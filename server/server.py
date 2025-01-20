from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import os
from retell import Retell
from dotenv import load_dotenv

load_dotenv()

from route_call import router as calls

# add connection from discord
connection = pymysql.connect(
    host=os.getenv("MY_SQL_SERVER"),
    user=os.getenv("MY_SQL_USER"),
    password=os.getenv("MY_SQL_PASS"),
    database=os.getenv("MY_SQL_DB"),
    cursorclass=pymysql.cursors.DictCursor
)  

cursor = connection.cursor()

client = Retell(
    api_key=os.getenv('RETELL_API_KEY'),
)

app = FastAPI()

app.include_router(calls, prefix="", tags=[])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def main():
    cursor.execute("select * from agents")
    connection.commit()
    return cursor.fetchall()

@app.get("/agents")
async def get_all_agents():
    cursor.execute("select * from agents")
    connection.commit()
    return cursor.fetchall()

@app.get("/contacts")
async def get_all_contacts():
    cursor.execute("""
        SELECT contacts.id, contacts.name, contacts.phone_number as phone_number, contacts.notes as notes, contacts.agent_id, agents.name AS agent_name
        FROM contacts
        LEFT OUTER JOIN agents ON contacts.agent_id = agents.id
    """)
    connection.commit()
    return cursor.fetchall()

@app.get("/contacts/{contact_id}")
async def get_single_contact(contact_id: int):
    cursor.execute("select * from contacts where id = %s", (contact_id))
    connection.commit()
    return cursor.fetchall()

@app.get("/calls")
async def get_all_calls():
    cursor.execute("select * from calls")
    connection.commit()
    return cursor.fetchall()

@app.get("/calls/{call_id}")
async def get_specific_call(call_id: int):
    cursor.execute("select * from calls where id = %s", (call_id))
    connection.commit()
    return cursor.fetchall()

@app.get("/events")
async def get_all_events():
    cursor.execute("select * from calendar_events")
    connection.commit()
    return cursor.fetchall()

@app.get("/events/{contact_id}")
async def get_specific_event(contact_id: int):
    cursor.execute("select * from calendar_events where calendar_events.contact_id = %s order by start_time desc", (contact_id))
    connection.commit()
    return cursor.fetchall()

@app.get("/contacts/{contact_id}/calls")
async def get_calls_for_contact(contact_id: int):
    cursor.execute("select * from calls where contact_id = %s", (contact_id))
    connection.commit()
    calls =  cursor.fetchall()
    print(calls)
    for call in calls:
        if call['retell_call_id'] is not None:
            call_id = call['retell_call_id']
            print(call_id)
            call_response = client.call.retrieve(
            call_id)
            call['audio_url'] = call_response.recording_url
    return calls


# @app.get('/calls/{call_id}/audio')
# async def get_call_audio(call_id: str):
#     call_response = client.call.retrieve(
#     call_id)
#     return call_response.recording_url

# Post requests
class Contact(BaseModel):
    name: str
    phone_number: str

@app.post("/contacts")
async def add_contact(contact: Contact):
    try:
        query = """
        INSERT INTO contacts (name, phone_number)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name)
        """
        cursor.execute(query, (contact.name, contact.phone_number))
        connection.commit()
        return {"message": "Contact added or updated successfully"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

class UpdateAgentRequest(BaseModel):
    contact_phone_number: str
    agent_id: int

@app.put("/contacts/{contact_id}/{agent_id}")
async def update_contact_agent(contact_id: int, agent_id : int):
    try:
        query = """
        UPDATE contacts
        SET agent_id = %s
        WHERE id = %s
        """
        cursor.execute(query, (agent_id, contact_id))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Contact not found")

        connection.commit()
        return {"message": "Agent ID updated successfully"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Statistics
@app.get("/statistics")
async def get_statistics():
    stats = {}

    # 1. Call length statistics
    cursor.execute("""
        SELECT 
            AVG(length) AS avg_length, 
            MAX(length) AS max_length, 
            MIN(length) AS min_length, 
            SUM(length) AS total_length 
        FROM calls
    """)
    call_stats = cursor.fetchone()
    stats["call_stats"] = call_stats

    # 2. Overall sentiment counts
    cursor.execute("""
        SELECT sentiment, COUNT(*) AS count
        FROM calls 
        GROUP BY sentiment
    """)
    sentiment_rows = cursor.fetchall()
    sentiments = {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
    total_count = 0
    for row in sentiment_rows:
        sentiments[row["sentiment"]] = row["count"]
        total_count += row["count"]
    sentiments["total_count"] = total_count
    stats["overall_sentiment"] = sentiments

    # 3. Number of calendar events
    cursor.execute("SELECT COUNT(*) AS event_count FROM calendar_events")
    event_count = cursor.fetchone()["event_count"]
    stats["calendar_event_count"] = event_count

    # 4. Agent use count (using agent names)
    cursor.execute("""
        SELECT a.name, COUNT(c.id) AS call_count
        FROM calls c 
        JOIN agents a ON c.agent_id = a.id
        GROUP BY c.agent_id, a.name
    """)
    agent_rows = cursor.fetchall()
    agent_usage = {row["name"]: row["call_count"] for row in agent_rows}
    stats["agent_usage"] = agent_usage

    # COMMENT OUT BY DAY
    # # 5. Call length by date (aggregated per day)
    # cursor.execute("""
    #     SELECT DATE(timestamp) AS date, SUM(length) AS call_length
    #     FROM calls
    #     GROUP BY DATE(timestamp)
    #     ORDER BY date
    # """)
    # time_rows = cursor.fetchall()
    # call_length_by_time = [
    #     [row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]), row["call_length"]]
    #     for row in time_rows
    # ]
    # stats["call_length_by_time"] = call_length_by_time
    
    # 5. Call length by time (hourly)
    cursor.execute("""
        SELECT DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour, SUM(length) AS call_length
        FROM calls
        GROUP BY hour
        ORDER BY hour
    """)
    time_rows = cursor.fetchall()
    call_length_by_time = [[row["hour"], row["call_length"]] for row in time_rows]
    stats["call_length_by_time"] = call_length_by_time

    return stats
