from utils.chatbot import ask_question

# Ask a question
question = "What algorithm is used in this paper?"

# Get the answer from the chatbot
answer = ask_question(question)

# Display the result
print("\nQuestion:")
print(question)

print("\nAnswer:")
print(answer)