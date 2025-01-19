import logging
import traceback
from fastapi import FastAPI, HTTPException, Form, Request
import pymysql
from fastapi.responses import Response
from openai import OpenAI
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Define the Pydantic model for the expected response
class Event(BaseModel):
    name: str  # Name of the event
    type: str  # Type of the event (e.g., Meeting, Task, etc.)
    start_time: Optional[str]  # Start time in ISO 8601 format or None
    end_time: Optional[str]  # End time in ISO 8601 format or None

class EventSummary(BaseModel):
    sentiment: str  # Overall sentiment of the user's interaction
    summary: str  # Summary of the transcript
    event: Optional[Event]  # Event details or None if no event exists

# Prompt to extract event details and sentiment
oai_prompt = """
You are analyzing a transcript between an agent and a user. The transcript is in the following format:

**Transcript Example:**
Agent: Hello! This is Chloe, Jayden's virtual assistant. Jayden is currently unavailable. How may I help you? 
User: I want to book a meeting for next Tuesday at 3 PM.  
Agent: Great! Let me confirm. A meeting with Jayden is scheduled for next Tuesday, 3 PM to 4 PM. Anything else I can help with?  
User: No, thank you.  
Agent: Have a great day!  

Your task is to:

1. **Analyze Sentiment**: Determine the overall sentiment of the user's interactions. Use one of the following categories: 
   - POSITIVE
   - NEGATIVE
   - NEUTRAL

2. **Summarize the Transcript**: Provide a concise summary of the conversation, focusing on the key actions and context.

3. **Identify Event**: Extract the event such as meetings, tasks, follow-ups, demos, deadlines, or support requests. For meetings, extract the names of participants (e.g., "Jayden" or "Joe"), the type (e.g., 'Meeting', 'Task', etc.), and the datetime range (start_time and end_time). Ensure the datetime is formatted as `YYYY-MM-DD HH:MM:SS`.

### Expected Output Format:
{
  "sentiment": "POSITIVE",
  "summary": "The user scheduled a meeting with Jayden for next Tuesday at 3 PM.",
  "event": 
    {
      "name": "Meeting with Jayden",
      "type": "Meeting",
      "start_time": "2025-01-20 15:00:00",
      "end_time": "2025-01-20 16:00:00"
    }
}

### Key Details:
- Ensure the sentiment reflects the overall tone of the user during the conversation.
- Parse dates and times explicitly mentioned in the transcript.
- Provide a concise summary of the conversation.
- If no event is mentioned, return an empty `event` field:
{
  "sentiment": "NEUTRAL",
  "summary": "No significant actions were taken.",
  "event": null
}
- Default start_time and end_time to `null` if time details are unclear but specify the type and name if relevant.
"""

# Define the function to process the transcript
async def get_openai_response(transcript):
    # Call the OpenAI API with the specified schema and model
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": oai_prompt},
            {"role": "user", "content": transcript},
        ],
        response_format=EventSummary,
    )
    # Extract and validate the parsed event
    event_summary = completion.choices[0].message.parsed
    print(f"event_summary {event_summary}")

    # Convert the Pydantic object to a dictionary
    response_dict = jsonable_encoder(event_summary)

    response = JSONResponse(content=response_dict)
    # Print the serialized JSON content
    print(f"json response {response.body.decode('utf-8')}")
    return event_summary

# add connection from discord
connection = pymysql.connect(
    host="REMOVED",
    user="REMOVED",
    password="REMOVED",
    database="nwhacks",
    cursorclass=pymysql.cursors.DictCursor
) 

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()         # Log to the console
    ]
)
logger = logging.getLogger(__name__)

cursor = connection.cursor()

@router.post("/call_status")
async def retell_call_completed(request: Request):
    """
    Handle Retell call-completed webhook and update the most recent call row.
    """
    try:
        data = await request.json()
        # logger.info(f"Webhook Received: {data}")
        event = data.get("event")
        logger.info(f"{event}")

        if event == "call_ended":
            # logger.info(f"{data.get('call_id')} {data.get('start_timestamp')} {data.get('end_timestamp')} {len(data.get('transcript'))}")
            call = data.get('call')
            if not call:
                raise HTTPException(
                    status_code=400,
                    detail="Missing required fields: call_id or transcript",
                )

            call_id = call.get("call_id")
            duration = (call.get("end_timestamp") - call.get("start_timestamp"))//1000
            transcript = call.get("transcript")

            if not call_id or not transcript:
                raise HTTPException(
                    status_code=400,
                    detail="Missing required fields: call_id or transcript",
                )

           
            select_query = """
            SELECT id FROM calls
            ORDER BY timestamp DESC
            LIMIT 1
            """
            cursor.execute(select_query)
            recent_call = cursor.fetchone()

            if not recent_call:
                raise HTTPException(
                    status_code=404,
                    detail="No recent call found to update.",
                )

            update_query = """
            UPDATE calls
            SET retell_call_id = %s, length = %s, transcript = %s
            WHERE id = %s
            """
            cursor.execute(
                update_query, (call_id, duration, transcript, recent_call["id"])
            )
            connection.commit()

            # incoming caller phone number
            caller = call.get("from_number")

            query = """
            SELECT contacts.id AS contact_id, contacts.agent_id as agent_id from contacts where contacts.phone_number = %s
            """
            cursor.execute(query, (caller,))
            data = cursor.fetchone()

            contact_id = data["contact_id"] if data else None
            agent_id = data["agent_id"] if data else None

            openai_summary = await get_openai_response(transcript)
            # Extract fields from the OpenAI response
            summary_text = openai_summary.summary
            sentiment_text = openai_summary.sentiment
            event_data = openai_summary.event

            # Update the `calls` table to store the summary and sentiment
            update_summary_sentiment_query = """
                UPDATE calls
                SET summary = %s, sentiment = %s
                WHERE id = %s
            """
            cursor.execute(update_summary_sentiment_query, (summary_text, sentiment_text, recent_call["id"]))
            connection.commit()

            # Populate the `calendar_events` table if there is an event
            if event_data:
                insert_event_query = """
                    INSERT INTO calendar_events (name, type, contact_id, call_id, start_time, end_time, agent_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(
                    insert_event_query,
                    (
                        event_data.name,
                        event_data.type,
                        contact_id,
                        recent_call["id"],
                        event_data.start_time,
                        event_data.end_time,
                        agent_id
                    )
                )
                connection.commit()

            logger.debug("Summary, sentiment, and event data updated successfully")

            logger.info(
                f"Most recent call updated: Call ID {call_id}, Duration {duration}"
            )
            return {"status": "success"}

    except Exception as e:
        logger.error(f"Error processing Retell webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@router.post("/voice")
async def route_call(
    From: str = Form(...)
):
    """
    Handle incoming Twilio calls and route them to the appropriate agent.
    """
    try:        
        from_number = From  # Retrieve the caller's phone number
        logger.debug(f"Caller Number (From): {from_number}")

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
        logger.debug(f"Database Query Result: {result}")

        # Default to a fallback agent if no match is found
        DEFAULT_AGENT = "+17782005564"
        target_number = result["agent_phone_number"] if result else DEFAULT_AGENT
        logger.debug(f"Target Number: {target_number}")

        # Generate TwiML to forward the call
        twiml_response = f"""
        <Response>
            <Dial>{target_number}</Dial>
        </Response>
        """
        logger.debug(f"Generated TwiML: {twiml_response}")

        query = """
        SELECT contacts.id AS contact_id, contacts.agent_id as agent_id from contacts where contacts.phone_number = %s
        """
        cursor.execute(query, (from_number,))
        data = cursor.fetchone()

        contact_id = data["contact_id"] if data else None
        agent_id = data["agent_id"] if data else None

        try:
            insert_query = """
            INSERT INTO calls (contact_id, agent_id)
            VALUES (%s, %s)
            """
            cursor.execute(insert_query, (contact_id, agent_id))
            connection.commit()
            logger.debug("Call record inserted successfully.")
        except Exception as e:
            logger.error(f"Error inserting call record: {e}")
            raise HTTPException(status_code=500, detail="Error logging the call in the database")

        return Response(content=twiml_response.strip(), media_type="application/xml")


    except Exception as e:
        # Handle database or other errors
        logger.error("An error occurred", exc_info=True)
        traceback_str = traceback.format_exc()
        logger.debug(f"Stack Trace: {traceback_str}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")