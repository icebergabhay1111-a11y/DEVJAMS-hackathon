from datetime import datetime, timedelta, timezone

from firestore_service import get_journey
from models import journey_from_data
from monitoring import monitor_and_save


PLANNED_LOCATIONS = ["VIT", "Katpadi", "Home"]


def get_demo_journey():
    data = get_journey("J001")

    if data is None:
        print("Journey J001 not found.")
        print("Run: python firebase_test.py")
        return None

    return journey_from_data(data)


def run_scenario(choice: str) -> None:
    journey = get_demo_journey()

    if journey is None:
        return

    now = datetime.now(timezone.utc)

    journey.planned_arrival_at = (
        now + timedelta(minutes=25)
    ).isoformat()

    if choice == "1":
        title = "NORMAL JOURNEY"
        journey.current_location = "Katpadi"
        journey.current_eta = 20
        response_confirmed = None
        anomaly_detected = False

    elif choice == "2":
        title = "ETA DELAY -> ATTENTION"
        journey.current_location = "Katpadi"
        journey.current_eta = 35
        response_confirmed = None
        anomaly_detected = False

    elif choice == "3":
        title = "DEVIATION + DELAY + ANOMALY -> CONCERN"
        journey.current_location = "Unknown Road"
        journey.current_eta = 38
        response_confirmed = None
        anomaly_detected = True

    elif choice == "4":
        title = "UNANSWERED SAFETY CHECK -> CONCERN"
        journey.current_location = "Unknown Road"
        journey.current_eta = 38
        response_confirmed = False
        anomaly_detected = True

    else:
        print("Invalid selection. Choose 1, 2, 3, or 4.")
        return

    result = monitor_and_save(
        journey=journey,
        planned_locations=PLANNED_LOCATIONS,
        response_confirmed=response_confirmed,
        anomaly_detected=anomaly_detected,
        now=now,
    )

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


def main() -> None:
    print("\nNetramAI Backend Demo Controller")
    print("1. Normal journey")
    print("2. ETA delay -> Attention")
    print("3. Deviation + delay + anomaly -> Concern")
    print("4. Unanswered safety check -> Concern")

    choice = input("\nChoose a scenario (1-4): ").strip()

    run_scenario(choice)


if __name__ == "__main__":
    main()