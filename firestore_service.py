from firebase_admin import firestore

from firebase_config import db


def get_journey(journey_id: str) -> dict | None:
    document = db.collection("journeys").document(journey_id).get()

    if not document.exists:
        return None

    return document.to_dict()


def save_journey(journey_id: str, data: dict) -> None:
    """
    Creates or merges a journey document.
    """
    db.collection("journeys").document(journey_id).set(
        {
            **data,
            "updated_at": firestore.SERVER_TIMESTAMP,
        },
        merge=True,
    )


def update_journey(journey_id: str, updates: dict) -> None:
    """
    Updates a journey safely.
    set(..., merge=True) works even if the document is newly created.
    """
    db.collection("journeys").document(journey_id).set(
        {
            **updates,
            "updated_at": firestore.SERVER_TIMESTAMP,
        },
        merge=True,
    )


def save_monitoring_result(
    journey_id: str,
    result: dict,
) -> None:
    update_journey(
        journey_id,
        {
            "state": result["state"],
            "safety_score": result["safety_score"],
            "safety_reasons": result["reasons"],
            "monitoring_signals": result["signals"],
            "needs_safety_check": result["needs_safety_check"],
            "last_monitored_at": firestore.SERVER_TIMESTAMP,
        },
    )


def save_safety_event(
    journey_id: str,
    event_type: str,
    severity: str,
    message: str,
    result: dict,
) -> None:
    """
    Adds an audit/history event.
    This allows you to show judges why the safety state changed.
    """
    db.collection("safety_events").add(
        {
            "journey_id": journey_id,
            "event_type": event_type,
            "severity": severity,
            "message": message,
            "state": result["state"],
            "safety_score": result["safety_score"],
            "signals": result["signals"],
            "created_at": firestore.SERVER_TIMESTAMP,
        }
    )


def get_user(user_id: str) -> dict | None:
    document = db.collection("users").document(user_id).get()

    if not document.exists:
        return None

    return document.to_dict()


def save_user(user_id: str, data: dict) -> None:
    db.collection("users").document(user_id).set(
        {
            **data,
            "updated_at": firestore.SERVER_TIMESTAMP,
        },
        merge=True,
    )


def get_guardian(guardian_id: str) -> dict | None:
    document = db.collection("guardians").document(guardian_id).get()

    if not document.exists:
        return None

    return document.to_dict()


def save_guardian(guardian_id: str, data: dict) -> None:
    db.collection("guardians").document(guardian_id).set(
        {
            **data,
            "updated_at": firestore.SERVER_TIMESTAMP,
        },
        merge=True,
    )