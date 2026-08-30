from datetime import datetime, timedelta, timezone

from firestore_service import (
    save_guardian,
    save_journey,
    save_user,
)


now = datetime.now(timezone.utc)

save_user(
    "U001",
    {
        "user_id": "U001",
        "name": "Demo User",
        "phone": "+91XXXXXXXXXX",
        "location_tracking_consent": True,
    },
)

save_guardian(
    "G001",
    {
        "guardian_id": "G001",
        "user_id": "U001",
        "name": "Demo Guardian",
        "relationship": "Parent",
        "phone": "+91XXXXXXXXXX",
        "notification_enabled": True,
    },
)

save_journey(
    "J001",
    {
        "journey_id": "J001",
        "user_id": "U001",
        "start_location": "VIT",
        "destination": "Home",
        "vehicle": "Cab",
        "driver": "Demo Driver",
        "planned_route": "VIT -> Katpadi -> Home",
        "expected_eta": 230,
        "current_location": "Katpadi",
        "current_eta": 20,
        "state": "NORMAL",
        "driver_trust_score": 95,
        "guardian_ids": ["G001"],
        "journey_started_at": now.isoformat(),
        "planned_arrival_at": (
            now + timedelta(minutes=25)
        ).isoformat(),
    },
)

print("Firebase demo data created successfully.")
print("Created user: U001")
print("Created guardian: G001")
print("Created journey: J001")