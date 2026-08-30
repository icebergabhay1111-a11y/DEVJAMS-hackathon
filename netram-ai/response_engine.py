from enum import Enum


class SafetyState(Enum):
    NORMAL = "Normal"
    ATTENTION = "Attention"
    CONCERN = "Concern"
    ARE_YOU_SAFE = "Are You Safe?"
    HELP = "Help"
    EMERGENCY = "Emergency"


class ResponseEngine:

    def __init__(self):
        self.state = SafetyState.NORMAL

    def transition(self, event: str):
        """
        Graduated Response Engine.

        Automatic monitoring events can move the system only through
        Normal -> Attention -> Concern -> Are You Safe?

        Emergency requires explicit user action.
        """

        if self.state == SafetyState.NORMAL:

            if event == "route_deviation":
                self.state = SafetyState.ATTENTION

        elif self.state == SafetyState.ATTENTION:

            if event == "continued_deviation":
                self.state = SafetyState.CONCERN

            elif event == "route_normal":
                self.state = SafetyState.NORMAL

        elif self.state == SafetyState.CONCERN:

            if event == "check_in_required":
                self.state = SafetyState.ARE_YOU_SAFE

            elif event == "route_normal":
                self.state = SafetyState.NORMAL

        elif self.state == SafetyState.ARE_YOU_SAFE:

            if event == "user_safe":
                self.state = SafetyState.NORMAL

            elif event == "user_needs_help":
                self.state = SafetyState.HELP

            elif event == "user_emergency":
                self.state = SafetyState.EMERGENCY

        elif self.state == SafetyState.HELP:

            if event == "user_safe":
                self.state = SafetyState.NORMAL

            elif event == "user_emergency":
                self.state = SafetyState.EMERGENCY

        return self.state

    def get_state(self):
        return self.state.value