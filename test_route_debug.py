from map_service import _call_google_maps


def main():
    origin = "VIT, Chennai"
    destination = "Katpadi, Vellore"
    waypoints = ["Katpadi"]

    try:
        result = _call_google_maps(
            origin=origin,
            destination=destination,
            waypoints=waypoints,
        )
        print("Google Maps call succeeded:")
        print(result)
    except Exception as e:
        print("Google Maps call failed with error:")
        print(type(e).__name__, "-", e)


if __name__ == "__main__":
    main()