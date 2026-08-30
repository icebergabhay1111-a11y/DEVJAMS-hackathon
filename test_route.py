from map_service import get_route


def main():
    origin = "VIT, Chennai"
    destination = "Katpadi, Vellore"
    waypoints = ["Katpadi"]

    result = get_route(
        origin=origin,
        destination=destination,
        waypoints=waypoints,
    )

    print("Route result:")
    print(result)


if __name__ == "__main__":
    main()