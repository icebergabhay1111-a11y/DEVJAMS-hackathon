from safety_controller import SafetyController


controller = SafetyController()

print("Initial:", controller.get_state())

print("Route deviation:",
      controller.handle_event("route_deviation"))

print("Continued deviation:",
      controller.handle_event("continued_deviation"))

print("Check-in required:",
      controller.handle_event("check_in_required"))

print("User needs help:",
      controller.handle_event("user_needs_help"))

print("User triggers emergency:",
      controller.handle_event("user_emergency"))