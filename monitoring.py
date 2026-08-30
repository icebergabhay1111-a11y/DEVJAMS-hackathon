from datetime import datetime

from deviation import check_route_deviation
from driver_trust import calculate_driver_trust_score
from firestore_service import (
    save_monitoring_result,
    save_safety_event,
    update_journey,
)
from models import Journey, JourneyState
from safety_score import calculate_safety_score


def determine_state(
    route_deviation: bool,
    eta_overrun: bool,
    anomaly_detected: bool,
    response_confirmed: bool | None,
) -> tuple[str, bool]:
    """
    Deterministic monitoring state logic.

    This engine never enters EMERGENCY automatically.
    Emergency must come from explicit SOS/user action
    handled by the response-engine team.
    """
    signal_count = sum(
        [
            route_deviation,
            eta_overrun,
            anomaly_detected,
        ]
    )

    if response_confirmed is False:
        return JourneyState.CONCERN.value, True

    if signal_count >= 2:
        return JourneyState.CONCERN.value, True

    if signal_count == 1:
        return JourneyState.ATTENTION.value, False

    return JourneyState.NORMAL.value, False


def evaluate_journey(
    journey: Journey,
    planned_locations: list[str],
    response_confirmed: bool | None = None,
    anomaly_detected: bool = False,
    driver_trust_score: float | None = None,
    now: datetime | None = None,
) -> dict:
    """
    Evaluates the planned journey and returns a complete,
    explainable monitoring result.
    """
    eta_overrun = journey.has_eta_overrun(now)

    route_deviation = check_route_deviation(
        journey=journey,
        planned_locations=planned_locations,
    )

    needs_manual_review = False
    trust_note = None

    if driver_trust_score is None:
        if journey.platform_rating is not None:
            driver_trust_score, trust_note, needs_manual_review = (
                calculate_driver_trust_score(journey.platform_rating)
            )
        else:
            driver_trust_score = journey.driver_trust_score

    state, needs_safety_check = determine_state(
        route_deviation=route_deviation,
        eta_overrun=eta_overrun,
        anomaly_detected=anomaly_detected,
        response_confirmed=response_confirmed,
    )

    score, reasons = calculate_safety_score(
        route_deviation=route_deviation,
        eta_overrun=eta_overrun,
        response_confirmed=response_confirmed,
        anomaly_detected=anomaly_detected,
        driver_trust_score=driver_trust_score,
    )

    if trust_note is not None:
        reasons.append(f"Driver trust band: {trust_note}.")

    return {
        "state": state,
        "safety_score": score,
        "reasons": reasons,
        "needs_safety_check": needs_safety_check,
        "needs_manual_review": needs_manual_review,
        "signals": {
            "eta_overrun": eta_overrun,
            "eta_overrun_minutes": journey.get_eta_overrun_minutes(),
            "route_deviation": route_deviation,
            "anomaly_detected": anomaly_detected,
            "response_confirmed": response_confirmed,
        },
    }


def get_event_details(result: dict) -> tuple[str, str, str]:
    """
    Produces a readable safety event for Firestore.
    """
    state = result["state"]

    if state == JourneyState.CONCERN.value:
        return (
            "CONCERN_DETECTED",
            "high",
            "Multiple journey safety signals require an Are You Safe? check.",
        )

    if state == JourneyState.ATTENTION.value:
        return (
            "ATTENTION_DETECTED",
            "medium",
            "A journey safety signal was detected and monitoring continues.",
        )

    return (
        "JOURNEY_NORMAL",
        "low",
        "Journey is currently following the planned route and timing.",
    )


def monitor_and_save(
    journey: Journey,
    planned_locations: list[str],
    **kwargs,
) -> dict:
    """
    Runs monitoring, saves the current journey state,
    and writes an auditable safety event to Firestore.
    """
    result = evaluate_journey(
        journey=journey,
        planned_locations=planned_locations,
        **kwargs,
    )

    save_monitoring_result(
        journey_id=journey.journey_id,
        result=result,
    )

    event_type, severity, message = get_event_details(result)

    save_safety_event(
        journey_id=journey.journey_id,
        event_type=event_type,
        severity=severity,
        message=message,
        result=result,
    )

    return result


def complete_journey(journey_id: str) -> None:
    """
    Marks a journey as completed after safe arrival.

    This is a normal completion action, not an emergency action.
    """
    update_journey(
        journey_id,
        {
            "state": "COMPLETED",
            "journey_status": "COMPLETED",
            "needs_safety_check": False,
        },
    )

    save_safety_event(
        journey_id=journey_id,
        event_type="JOURNEY_COMPLETED",
        severity="low",
        message="Journey completed safely at the planned destination.",
        result={
            "state": "COMPLETED",
            "safety_score": 100,
            "signals": {
                "route_deviation": False,
                "eta_overrun": False,
                "anomaly_detected": False,
                "response_confirmed": True,
            },
        },
    )