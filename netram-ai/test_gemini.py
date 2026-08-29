from gemini_service import safe_call

message = input("You: ")

reply = safe_call(message)

print("NetramAI:", reply)