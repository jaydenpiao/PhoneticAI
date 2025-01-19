import logging
import traceback
from fastapi import FastAPI, HTTPException, Form
import pymysql
from fastapi.responses import Response

# add connection from discord 

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

app = FastAPI()

@app.post("/voice")
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
        return Response(content=twiml_response.strip(), media_type="application/xml")

    except Exception as e:
        # Handle database or other errors
        logger.error("An error occurred", exc_info=True)
        traceback_str = traceback.format_exc()
        logger.debug(f"Stack Trace: {traceback_str}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")