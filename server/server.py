from fastapi import FastAPI
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
    pass

@app.get("/contacts")
async def get_all_contacts():
    pass

@app.get("/contacts/{contact_id}")
async def get_single_contact(contact_id: int):
 pass

@app.get("/calls")
async def get_all_calls():
    pass

@app.get("/calls/{call_id}")
async def get_specific_call(call_id: int):
    pass

@app.get("/events")
async def get_all_events():
    pass

@app.get("/contacts/{contact_id}/calls")
async def get_calls_for_contact(contact_id: int):
    pass

@app.post("/contacts")
async def add_contact(contact):
   pass
