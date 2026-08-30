from gemini_service import safe_call
from safety_controller import SafetyController


controller = SafetyController()

print("=== NetramAI SafeCall ===")
print("Type 'exit' to stop.\n")

while True:
    message = input("You: ")

    if message.lower() == "exit":
        break

    # Gemini handles the conversation
    reply = safe_call(message)

    print("NetramAI:", reply)

    # Show current safety state
    print("Safety state:", controller.get_state())
    print()