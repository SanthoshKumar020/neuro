from fastapi import FastAPI
from pydantic import BaseModel
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class CommandRequest(BaseModel):
    command: str

class CommandResponse(BaseModel):
    task: str
    app: str | None = None
    recipient: str | None = None
    message: str | None = None
    website_description: str | None = None

def mock_llm_processor(text: str) -> dict:
    """
    This is a mock function to simulate the behavior of a local LLM.
    It uses simple regex to parse commands and returns a structured JSON object.
    Replace this function with a real call to your Ollama server.
    """
    text = text.lower()
    logger.info(f"Processing command with mock LLM: '{text}'")

    # Rule for sending a message
    # Example: "send hi to sandy on whatsapp"
    msg_match = re.search(r"send (.*?) to (.*?) on (.*)", text)
    if msg_match:
        message = msg_match.group(1).strip()
        recipient = msg_match.group(2).strip()
        app_name = msg_match.group(3).strip()
        logger.info(f"Matched 'send message' rule: app={app_name}, recipient={recipient}, message={message}")
        return {
            "task": "send_message",
            "app": app_name.capitalize(),
            "recipient": recipient.capitalize(),
            "message": message,
        }

    # Rule for creating a website
    # Example: "create a website for my bakery"
    web_match = re.search(r"create a website for (.*)", text)
    if web_match:
        description = web_match.group(1).strip()
        logger.info(f"Matched 'create website' rule: description={description}")
        return {
            "task": "create_website",
            "website_description": description,
        }

    # Default fallback
    logger.warning("No specific rule matched. Returning a default response.")
    return {
        "task": "unknown_command",
        "message": "I'm not sure how to handle that command. Please try again.",
    }


@app.post("/command", response_model=CommandResponse)
async def handle_command(request: CommandRequest):
    """
    Receives a command from the mobile app, processes it using the (mock) LLM,
    and returns a structured response.
    """
    logger.info(f"Received command: '{request.command}'")
    processed_data = mock_llm_processor(request.command)
    return processed_data

@app.get("/")
def read_root():
    return {"message": "Neura Backend is running."}
