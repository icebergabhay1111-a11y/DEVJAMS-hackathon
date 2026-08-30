from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from firestore_service import get_journey, save_journey
from models import journey_from_data
from monitoring import complete_journey, monitor_and_save

app = FastAPI(title="NetramAI Backend API")


# ---- request/response shapes -------------------------------------------

class JourneyIn(BaseModel):
    journey_id: str
    user_id: str
    start_location: str
    destination: str
    vehicle: str
    driver: str
    planned_route: str
    expected_eta: int
    current_location: str
    current_eta: int
    driver_trust_score: float = 95.0
    platform_rating: float | None = None
    guardian_ids: list[str] = []
    journey_started_at: str | None = None
    planned_arrival_at: str | None = None


class EvaluateIn(BaseModel):
    planned_locations: list[str]
    response_confirmed: bool | None = None
    anomaly_detected: bool = False


# ---- endpoints ------------------------------------------------------------

@app.post("/journeys")
def create_journey(journey: JourneyIn) -> dict[str, Any]:
    data = journey.model_dump()
    save_journey(journey.journey_id, data)
    return {"status": "created", "journey_id": journey.journey_id}


@app.get("/journeys/{journey_id}")
def read_journey(journey_id: str) -> dict[str, Any]:
    data = get_journey(journey_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Journey not found")
    return data


@app.post("/journeys/{journey_id}/evaluate")
def evaluate(journey_id: str, body: EvaluateIn) -> dict[str, Any]:
    data = get_journey(journey_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Journey not found")

    journey = journey_from_data(data)

    result = monitor_and_save(
        journey=journey,
        planned_locations=body.planned_locations,
        response_confirmed=body.response_confirmed,
        anomaly_detected=body.anomaly_detected,
        now=datetime.now(timezone.utc),
    )
    return result


@app.post("/journeys/{journey_id}/complete")
def complete(journey_id: str) -> dict[str, str]:
    complete_journey(journey_id)
    return {"status": "completed", "journey_id": journey_id}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
