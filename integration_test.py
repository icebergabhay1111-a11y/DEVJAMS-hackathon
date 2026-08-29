from datetime import datetime, timedelta, timezone

from firestore_service import get_journey
from models import journey_from_data
from monitoring import monitor_and_save


def print_result(title: str, result: dict) -> None:
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

    print("Monitoring state:", result["state"])
    print("Safety score:", result["safety_score"])
    print("Needs safety check:", result["needs_safety_check"])

    print("\nSignals:")
    for key, value in result["signals"].items():
        print(f"- {key}: {value}")

    print("\nReasons:")
    for reason in result["reasons"]:
        print(f"- {reason}")


data = get_journey("J001")

if data is None:
    print("Journey J001 was not found.")
    print("Run: python firebase_test.py")
    raise SystemExit(1)

journey = journey_from_data(data)

planned_locations = [
    "VIT",
    "Katpadi",
    "Home",
]

now = datetime.now(timezone.utc)

# Scenario 1: Normal Journey
journey.current_location = "Katpadi"
journey.current_eta = 20
journey.planned_arrival_at = (
    now + timedelta(minutes=25)
).isoformat()

normal_result = monitor_and_save(
    journey=journey,
    planned_locations=planned_locations,
    response_confirmed=None,
    anomaly_detected=False,
    now=now,
)

print_result("SCENARIO 1: NORMAL JOURNEY", normal_result)

# Scenario 2: One Signal -> Attention
journey.current_location = "Katpadi"
journey.current_eta = 35
journey.planned_arrival_at = (
    now + timedelta(minutes=25)
).isoformat()

attention_result = monitor_and_save(
    journey=journey,
    planned_locations=planned_locations,
    response_confirmed=None,
    anomaly_detected=False,
    now=now,
)

print_result("SCENARIO 2: ETA DELAY -> ATTENTION", attention_result)

# Scenario 3: Multiple Signals -> Concern
journey.current_location = "Unknown Road"
journey.current_eta = 38
journey.planned_arrival_at = (
    now + timedelta(minutes=25)
).isoformat()

concern_result = monitor_and_save(
    journey=journey,
    planned_locations=planned_locations,
    response_confirmed=None,
    anomaly_detected=True,
    now=now,
)

print_result(
    "SCENARIO 3: DEVIATION + DELAY + ANOMALY -> CONCERN",
    concern_result,
)

# Scenario 4: No Response -> Concern
journey.current_location = "Unknown Road"
journey.current_eta = 38

no_response_result = monitor_and_save(
    journey=journey,
    planned_locations=planned_locations,
    response_confirmed=False,
    anomaly_detected=True,
    now=now,
)

print_result(
    "SCENARIO 4: UNANSWERED SAFETY CHECK -> CONCERN",
    no_response_result,
)

print("\nMonitoring integration is ready.")
print("Check Firestore collections: journeys and safety_events.")