from response_engine import ResponseEngine


class SafetyController:

    def __init__(self):
        self.engine = ResponseEngine()

    def handle_event(self, event):
        """
        Pass an application event to the ResponseEngine
        and return the updated safety state.
        """

        new_state = self.engine.transition(event)

        return new_state.value

    def get_state(self):
        return self.engine.get_state()