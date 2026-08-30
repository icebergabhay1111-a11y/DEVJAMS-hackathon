def route_score(route_deviation: bool) -> int:
    return 50 if route_deviation else 100


def timing_score(eta_overrun: bool) -> int:
    return 50 if eta_overrun else 100


def response_score(response_confirmed: bool | None) -> int:
    if response_confirmed is None:
        return 80

    return 100 if response_confirmed else 40


def anomaly_score(anomaly_detected: bool) -> int:
    return 50 if anomaly_detected else 100