from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymysql
import os

# add connection from discord 

cursor = connection.cursor()

app = FastAPI()

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
    cursor.execute("select * from contacts")
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

@app.get("/contacts/{contact_id}/calls")
async def get_calls_for_contact(contact_id: int):
    cursor.execute("select * from calls where contact_id = %s", (contact_id))
    connection.commit()
    return cursor.fetchall()

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

@app.post("/contacts/update-agent")
async def update_contact_agent(request: UpdateAgentRequest):
    try:
        query = """
        UPDATE contacts
        SET agent_id = %s
        WHERE phone_number = %s
        """
        cursor.execute(query, (request.agent_id, request.contact_phone_number))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Contact not found")

        connection.commit()
        return {"message": "Agent ID updated successfully"}
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")