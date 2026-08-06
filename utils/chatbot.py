from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
)
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
def load_index():
    return faiss.read_index("faiss_index.bin")
def load_chunks():
    with open("chunks.pkl", "rb") as f:
        return pickle.load(f)
def search_similar_chunks(question, top_k=3):
    # Load the FAISS index
    index = load_index()

    # Load the original text chunks
    chunks = load_chunks()

    # Convert the user's question into an embedding
    question_embedding = model.encode([question])

    # Search the FAISS index
    distances, indices = index.search(
        np.array(question_embedding, dtype=np.float32),
        top_k
    )

    # Retrieve the matching text chunks
    relevant_chunks = [chunks[i] for i in indices[0]]

    return relevant_chunks
def ask_question(question):
    # Retrieve the most relevant chunks
    relevant_chunks = search_similar_chunks(question)

    # Combine them into one context
    context = "\n\n".join(relevant_chunks)

    # Prompt for the chatbot
    prompt = f"""
You are an AI Research Paper Assistant.

Answer the user's question ONLY using the research paper context below.

If the answer is not present in the context, reply:
"I could not find the answer in the uploaded research paper."

Research Paper Context:
{context}

Question:
{question}
"""

    # Send to the LLM
    response = client.responses.create(
        model="nvidia/nemotron-3-ultra-550b-a55b:free",
        input=prompt,
    )

    return response.output_text