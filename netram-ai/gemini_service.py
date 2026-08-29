import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)


def safe_call(user_message):
    prompt = f"""
You are NetramAI's SafeCall conversational assistant.

Your job is to have a short, calm safety check-in with the user.

User message:
{user_message}

Respond naturally and briefly.
Do NOT declare the user to be in an emergency.
Do NOT independently trigger emergency mode.
If the user explicitly says they need help or are in immediate danger,
the application will handle the appropriate safety state separately.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text