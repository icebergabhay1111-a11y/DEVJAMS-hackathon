import requests
from typing import Any
from firebase_config import GOOGLE_MAPS_API_KEY

def decode_polyline(polyline_str: str) -> list[tuple[float, float]]:
    """
    Decodes a Google encoded polyline string into a list of (lat, lng) tuples.
    """
    index, lat, lng = 0, 0, 0
    coordinates = []
    length = len(polyline_str)

    while index < length:
        for unit in ["lat", "lng"]:
            shift, result = 0, 0

            while True:
                byte = ord(polyline_str[index]) - 63
                index += 1
                result |= (byte & 0x1f) << shift
                shift += 5
                if byte < 0x20:
                    break

            delta = ~(result >> 1) if (result & 1) else (result >> 1)

            if unit == "lat":
                lat += delta
            else:
                lng += delta

        coordinates.append((lat / 1e5, lng / 1e5))

    return coordinates


GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


def geocode_location(address: str) -> tuple[float, float] | None:
    """
    Converts an address/place string into (lat, lng) using
    the Google Geocoding API. Returns None on failure.
    """
    try:
        resp = requests.get(
            GOOGLE_GEOCODE_URL,
            params={"address": address, "key": GOOGLE_MAPS_API_KEY},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("status") != "OK" or not data.get("results"):
            return None

        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]

    except Exception as e:
        print(f"Geocoding failed for '{address}': {e}")
        return None

GOOGLE_ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"


def _call_google_maps(
    origin: str,
    destination: str,
    waypoints: list[str] | None = None,
) -> dict[str, Any]:
    """
    Call the Google Maps Routes API and return parsed route info.
    """
    waypoints = waypoints or []

    origin_dict = {"address": origin}
    destination_dict = {"address": destination}

    intermediates = [
        {"address": wp}
        for wp in waypoints
    ]

    body = {
        "origin": origin_dict,
        "destination": destination_dict,
        "intermediates": intermediates,
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
    }

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline",
    }

    resp = requests.post(GOOGLE_ROUTES_URL, json=body, headers=headers, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    route = data["routes"][0]

    distance_meters = route.get("distanceMeters", 0)
    duration_seconds = route.get("duration", "").replace("s", "")
    try:
        duration_minutes = int(float(duration_seconds) / 60)
    except Exception:
        duration_minutes = 25

    polyline = route.get("polyline", {}).get("encodedPolyline", "")
    polyline_points = decode_polyline(polyline) if polyline else []

    return {
        "distance_km": distance_meters / 1000.0,
        "duration_minutes": duration_minutes,
        "polyline": polyline,
        "polyline_points": polyline_points,
        "source": "google_maps",
    }


def get_route(
    origin: str,
    destination: str,
    waypoints: list[str] | None = None,
    estimated_duration_minutes: int = 25,
) -> dict[str, Any]:
    """
    Return route information using Google Maps Routes API.
    Falls back to simulation if the API call fails.
    """
    waypoints = waypoints or []

    try:
        google_data = _call_google_maps(origin, destination, waypoints)
        return {
            "origin": origin,
            "destination": destination,
            "waypoints": waypoints,
            "route": [origin] + waypoints + [destination],
            "distance_km": google_data["distance_km"],
            "duration_minutes": google_data["duration_minutes"],
            "polyline": google_data["polyline"],
            "polyline_points": google_data["polyline_points"],
            "source": google_data["source"],
        }
    except Exception as e:
        print(f"Google Maps API failed ({e}), falling back to simulation")
        route_locations = [origin] + waypoints + [destination]
        return {
            "origin": origin,
            "destination": destination,
            "waypoints": waypoints,
            "route": route_locations,
            "distance_km": 8.5,
            "duration_minutes": estimated_duration_minutes,
            "polyline_points": [],
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