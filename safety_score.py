from signal_scores import (
    anomaly_score,
    response_score,
    route_score,
    timing_score,
)


def clamp_score(value: float) -> float:
    return max(0.0, min(100.0, value))


def calculate_safety_score(
    route_deviation: bool,
    eta_overrun: bool,
    response_confirmed: bool | None,
    anomaly_detected: bool,
    driver_trust_score: float = 95.0,
) -> tuple[int, list[str]]:
    """
    Calculates an explainable safety score from 0 to 100.

    Journey signals contribute 90%.
    Driver trust contributes 10%.
    """
    route = route_score(route_deviation)
    timing = timing_score(eta_overrun)
    response = response_score(response_confirmed)
    anomaly = anomaly_score(anomaly_detected)

    journey_score = (
        route
        + timing
        + response
        + anomaly
    ) / 4

    safe_driver_score = clamp_score(driver_trust_score)

    final_score = (
        journey_score * 0.90
        + safe_driver_score * 0.10
    )

    reasons = []

    if route_deviation:
        reasons.append(
            "Route deviation detected: current location is outside the planned route."
        )
    else:
        reasons.append(
            "Route is on track."
        )

    if eta_overrun:
        reasons.append(
            "ETA delay detected: journey is taking longer than planned."
        )
    else:
        reasons.append(
            "ETA is within the expected journey time."
        )

    if anomaly_detected:
        reasons.append(
            "Movement anomaly detected."
        )
    else:
        reasons.append(
            "No movement anomaly detected."
        )

    if response_confirmed is False:
        reasons.append(
            "Safety check was not answered."
        )
    elif response_confirmed is True:
        reasons.append(
            "User confirmed they are safe."
        )
    else:
        reasons.append(
            "No safety check response is required yet."
        )

    reasons.append(
        f"Driver trust score: {round(safe_driver_score)}/100."
    )

    return round(final_score), reasons