from fastapi import FastAPI
from pydantic import BaseModel

from response_engine import ResponseEngine


app = FastAPI(title="NetramAI")

# One shared safety controller
controller = ResponseEngine()


# ---------------------------------------------------------
# REQUEST MODELS
# ---------------------------------------------------------

class EventRequest(BaseModel):
    event: str


class SafeCallRequest(BaseModel):
    message: str


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "app": "NetramAI",
        "status": "running"
    }


# ---------------------------------------------------------
# SAFETY STATE
# ---------------------------------------------------------

@app.get("/state")
def get_state():
    return {
        "safety_state": controller.get_state()
    }


# ---------------------------------------------------------
# MONITORING EVENT
# ---------------------------------------------------------

@app.post("/event")
def handle_event(request: EventRequest):

    new_state = controller.transition(request.event)

    return {
        "event": request.event,
        "safety_state": new_state.value
    }


# ---------------------------------------------------------
# USER SAFETY ACTIONS
# ---------------------------------------------------------

@app.post("/check-in")
def check_in(request: EventRequest):

    new_state = controller.transition(request.event)

    return {
        "event": request.event,
        "safety_state": new_state.value
    }


# ---------------------------------------------------------
# SAFECALL
# ---------------------------------------------------------

@app.post("/safecall")
def safecall(request: SafeCallRequest):

    # Temporary response until Gemini integration is connected.
    message = request.message.lower()

    if "emergency" in message or "help" in message:
        reply = (
            "I'm here with you. If you are in immediate danger, "
            "please use the SOS control or contact emergency services."
        )
    elif "nervous" in message or "scared" in message:
        reply = (
            "I'm right here with you. Take a slow, deep breath. "
            "Would you like to tell me what's making you nervous?"
        )
    else:
        reply = (
            "I'm here with you. Tell me what's going on "
            "and I'll stay with you."
        )

    return {
        "reply": reply,
        "safety_state": controller.get_state()
    }