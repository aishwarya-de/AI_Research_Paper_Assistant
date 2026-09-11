from utils.chatbot import search_similar_chunks

question = "What algorithm is used?"

results = search_similar_chunks(question)

print("Relevant Chunks:\n")

for i, chunk in enumerate(results, 1):
    print(f"Chunk {i}:")
    print(chunk)
    print("-" * 50)