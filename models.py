from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from typing import Any


ETA_OVERRUN_THRESHOLD_MINUTES = 5


class JourneyState(str, Enum):
    NORMAL = "NORMAL"
    ATTENTION = "ATTENTION"
    CONCERN = "CONCERN"
    EMERGENCY = "EMERGENCY"


@dataclass
class Journey:
    journey_id: str
    user_id: str
    start_location: str
    destination: str
    vehicle: str
    driver: str
    planned_route: str
    expected_eta: int
    current_location: str
    current_eta: int
    state: str = JourneyState.NORMAL.value
    journey_started_at: datetime | str | None = None
    planned_arrival_at: datetime | str | None = None
    driver_trust_score: float = 95.0
    platform_rating: float | None = None

    def get_eta_overrun_minutes(self) -> int:
        return max(0, self.current_eta - self.expected_eta)

    @staticmethod
    def as_datetime(value: datetime | str | None) -> datetime | None:
        if value is None:
            return None

        if isinstance(value, datetime):
            return value

        return datetime.fromisoformat(value.replace("Z", "+00:00"))

    def has_eta_overrun(self, now: datetime | None = None) -> bool:
        planned_arrival = self.as_datetime(self.planned_arrival_at)

        if planned_arrival is None:
            journey_started = self.as_datetime(self.journey_started_at)

            if journey_started is not None:
                planned_arrival = journey_started + timedelta(
                    minutes=self.expected_eta
                )

        if planned_arrival is None:
            return (
                self.get_eta_overrun_minutes()
                > ETA_OVERRUN_THRESHOLD_MINUTES
            )

        if now is None:
            now = datetime.now(tz=planned_arrival.tzinfo)

        estimated_arrival = now + timedelta(minutes=self.current_eta)

        return estimated_arrival > (
            planned_arrival
            + timedelta(minutes=ETA_OVERRUN_THRESHOLD_MINUTES)
        )


def journey_from_data(data: dict[str, Any]) -> Journey:
    allowed_fields = {
        "journey_id",
        "user_id",
        "start_location",
        "destination",
        "vehicle",
        "driver",
        "planned_route",
        "expected_eta",
        "current_location",
        "current_eta",
        "state",
        "journey_started_at",
        "planned_arrival_at",
        "driver_trust_score",
        "platform_rating",
    }

    journey_data = {
        key: value
        for key, value in data.items()
        if key in allowed_fields
    }

    return Journey(**journey_data)