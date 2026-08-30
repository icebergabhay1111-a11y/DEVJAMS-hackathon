from response_engine import ResponseEngine


engine = ResponseEngine()

print("Initial state:", engine.get_state())

print("After route deviation:",
      engine.transition("route_deviation").value)

print("After continued deviation:",
      engine.transition("continued_deviation").value)

print("Check-in:",
      engine.transition("check_in_required").value)

print("User needs help:",
      engine.transition("user_needs_help").value)

print("User triggers emergency:",
      engine.transition("user_emergency").value)