from typing import Any


def get_route(
    origin: str,
    destination: str,
    waypoints: list[str] | None = None,
    estimated_duration_minutes: int = 25,
) -> dict[str, Any]:
    """
    Prototype route provider.

    Uses simulated route information so the project works
    even without a Google Maps API key during the hackathon.
    """
    waypoints = waypoints or []

    route_locations = [origin] + waypoints + [destination]

    return {
        "origin": origin,
        "destination": destination,
        "waypoints": waypoints,
        "route": route_locations,
        "distance_km": 8.5,
        "duration_minutes": estimated_duration_minutes,
        "source": "simulation",
    }


def get_eta(
    origin: str,
    destination: str,
    waypoints: list[str] | None = None,
    estimated_duration_minutes: int = 25,
) -> int:
    route = get_route(
        origin=origin,
        destination=destination,
        waypoints=waypoints,
        estimated_duration_minutes=estimated_duration_minutes,
    )

    return route["duration_minutes"]


def check_route(
    current_location: str,
    planned_locations: list[str],
) -> bool:
    """
    Returns True when current_location is not in planned_locations.
    Used only for simulated route checking.
    """
    current = current_location.strip().lower()

    planned = {
        location.strip().lower()
        for location in planned_locations
    }

    return current not in planned