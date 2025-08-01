# Neura Backend

This directory contains the backend server for the Neura AI assistant. It's built with FastAPI.

## Running the Server

1.  **Install Dependencies**: Make sure you have Python 3.10+ installed. Then, install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The server will be available at `http://localhost:8000`.

## Integrating a Real LLM (Ollama)

The current implementation uses a **mocked** LLM for demonstration purposes. To connect to a real Ollama instance, you need to modify the `main.py` file.

1.  **Install and Run Ollama**: Follow the official Ollama documentation to install it and pull a model.
    ```bash
    # Example:
    ollama pull mistral
    ollama run mistral
    ```
    Ensure the Ollama server is running.

2.  **Update `main.py`**:
    -   Comment out or delete the `mock_llm_processor` function.
    -   Implement a new `llm_processor` function that uses the `ollama` python library to make a real API call.

    Here is an example of what the new function could look like:

    ```python
    import ollama

    def llm_processor(text: str) -> dict:
        """
        Processes the command using a real Ollama model.
        """
        try:
            response = ollama.chat(
                model='mistral',
                messages=[
                    {
                        'role': 'system',
                        'content': (
                            'You are an expert at parsing user commands into structured JSON. '
                            'The user will give you a command, and you must extract the key details. '
                            'The possible tasks are "send_message" and "create_website". '
                            'For "send_message", you must provide the "app", "recipient", and "message". '
                            'For "create_website", you must provide the "website_description". '
                            'If the command is unclear, return a task of "unknown_command".'
                            'Respond with only the JSON object.'
                        ),
                    },
                    {
                        'role': 'user',
                        'content': f"Parse the following command: '{text}'",
                    },
                ],
            )
            # The response from ollama.chat needs to be parsed to extract the JSON
            # This might require string manipulation or json.loads depending on the model's output
            # For example:
            # import json
            # result = json.loads(response['message']['content'])
            # return result

            # This is a placeholder for the actual parsing logic
            # You will need to adapt this based on the exact output of your chosen model
            return {"task": "llm_success", "raw_response": response['message']['content']}

        except Exception as e:
            logger.error(f"Error communicating with Ollama: {e}")
            return {"task": "llm_error", "message": str(e)}

    ```
    -   Finally, in the `/command` endpoint, change the call from `mock_llm_processor` to your new `llm_processor`.

    ```python
    @app.post("/command", response_model=CommandResponse)
    async def handle_command(request: CommandRequest):
        logger.info(f"Received command: '{request.command}'")
        # OLD: processed_data = mock_llm_processor(request.command)
        processed_data = llm_processor(request.command) # NEW
        return processed_data
    ```
