from models import Journey


def normalize_location(location: str) -> str:
    return location.strip().lower()


def check_route_deviation(
    journey: Journey,
    planned_locations: list[str],
) -> bool:
    """
    Prototype route-deviation detector.

    Returns True when the latest location is not present
    in the planned-route locations.

    This is intentionally a simulated demo implementation.
    Google Maps coordinate/polyline checking can replace it later.
    """
    if not planned_locations:
        return False

    current_location = normalize_location(journey.current_location)

    normalized_route = {
        normalize_location(location)
        for location in planned_locations
    }

    return current_location not in normalized_route