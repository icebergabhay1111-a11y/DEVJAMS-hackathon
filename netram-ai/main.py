from fastapi import FastAPI
from pydantic import BaseModel

from gemini_service import safe_call
from safety_controller import SafetyController


app = FastAPI(title="NetramAI API")

controller = SafetyController()


# -----------------------------
# Request Models
# -----------------------------

class SafeCallRequest(BaseModel):
    message: str


class EventRequest(BaseModel):
    event: str


class CheckInRequest(BaseModel):
    message: str
    event: str


# -----------------------------
# Root Endpoint
# -----------------------------

@app.get("/")
def root():
    return {
        "app": "NetramAI",
        "status": "running"
    }


# -----------------------------
# SafeCall Endpoint
# -----------------------------

@app.post("/safecall")
def safecall(request: SafeCallRequest):

    reply = safe_call(request.message)

    return {
        "reply": reply,
        "safety_state": controller.get_state()
    }


# -----------------------------
# Safety Event Endpoint
# -----------------------------

@app.post("/event")
def handle_event(request: EventRequest):

    new_state = controller.handle_event(request.event)

    return {
        "event": request.event,
        "safety_state": new_state
    }


# -----------------------------
# Combined SafeCall + Event
# -----------------------------

@app.post("/check-in")
def check_in(request: CheckInRequest):

    reply = safe_call(request.message)

    new_state = controller.handle_event(request.event)

    return {
        "reply": reply,
        "event": request.event,
        "safety_state": new_state
    }
