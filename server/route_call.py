from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import pymysql
from fastapi.responses import Response

# add connection from discord 

cursor = connection.cursor()

app = FastAPI()

@app.post("/voice")
async def route_call(request: Request):
    """
    Handle incoming Twilio calls and route them to the appropriate agent.
    :param request: The incoming request from Twilio containing call details.
    """
    try:
        # Parse JSON payload
        payload = await request.json()
        print(f"Received payload: {payload}")

        form_data = await request.form()
        print(f"Received form data: {form_data}")
        
        from_number = payload.get("From")  # Retrieve the caller's phone number

        if not from_number:
            raise HTTPException(status_code=400, detail="Caller number (From) is missing in the request")

        # Query to find the agent's phone number based on the caller's number
        query = """
        SELECT agents.phone_number AS agent_phone_number
        FROM contacts
        JOIN agents ON contacts.agent_id = agents.id
        WHERE contacts.phone_number = %s
        """
        cursor.execute(query, (from_number,))
        result = cursor.fetchone()

        # Default to a fallback agent if no match is found
        DEFAULT_AGENT = "+17782005564"
        target_number = result["agent_phone_number"] if result else DEFAULT_AGENT

        # Generate TwiML to forward the call
        twiml_response = f"""
        <Response>
            <Dial>{target_number}</Dial>
        </Response>
        """
        print(f"Generated TwiML: {twiml_response}")
        return Response(content=twiml_response.strip(), media_type="application/xml")

    except Exception as e:
        # Handle database or other errors
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/agents")
async def get_all_agents():
    """
    Get all agents from the database.
    """
    cursor.execute("SELECT * FROM agents")
    connection.commit()
    return cursor.fetchall()

@app.get("/contacts")
async def get_all_contacts():
    """
    Get all contacts from the database.
    """
    cursor.execute("SELECT * FROM contacts")
    connection.commit()
    return cursor.fetchall()

class Contact(BaseModel):
    name: str
    phone_number: str

@app.post("/contacts")
async def add_contact(contact: Contact):
    """
    Add or update a contact in the database.
    """
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
    """
    Update the agent associated with a contact.
    """
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
