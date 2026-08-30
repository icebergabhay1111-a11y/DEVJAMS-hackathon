import math

from map_service import geocode_location, get_route
from models import Journey


DEVIATION_THRESHOLD_METERS = 500


def normalize_location(location: str) -> str:
    return location.strip().lower()


def haversine_distance_meters(
    lat1: float, lng1: float, lat2: float, lng2: float
) -> float:
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )

    return 2 * R * math.asin(math.sqrt(a))


def min_distance_to_route(
    point: tuple[float, float],
    route_points: list[tuple[float, float]],
) -> float:
    lat, lng = point
    return min(
        haversine_distance_meters(lat, lng, rp[0], rp[1])
        for rp in route_points
    )


def check_route_deviation(
    journey: Journey,
    planned_locations: list[str],
) -> bool:
    """
    Real route-deviation detector.

    Geocodes the current location and measures its distance from
    the planned route's polyline. Falls back to simple name-matching
    if geocoding or routing fails (offline demo, quota exceeded, etc).
    """
    try:
        route = get_route(
            origin=journey.start_location,
            destination=journey.destination,
            waypoints=[
                loc for loc in planned_locations
                if loc not in (journey.start_location, journey.destination)
            ],
        )

        route_points = route.get("polyline_points")
        if not route_points:
            raise ValueError("No polyline available")

        current_point = geocode_location(journey.current_location)
        if current_point is None:
            raise ValueError("Geocoding failed")

        distance = min_distance_to_route(current_point, route_points)
        return distance > DEVIATION_THRESHOLD_METERS

    except Exception as e:
        print(f"Route deviation check falling back to name match: {e}")
        return _check_by_name(journey, planned_locations)


def _check_by_name(journey: Journey, planned_locations: list[str]) -> bool:
    if not planned_locations:
        return False

    current_location = normalize_location(journey.current_location)
    normalized_route = {normalize_location(loc) for loc in planned_locations}

    return current_location not in normalized_route