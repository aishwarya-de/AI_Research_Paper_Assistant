import streamlit as st
from sentence_transformers import SentenceTransformer
from utils.model_loader import get_embedding_model

def search_similar_chunks(question, top_k=3):
    model = get_embedding_model()
    question_embedding = model.encode([question])
@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")
import os
import pickle

import faiss
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("OPENROUTER_API_KEY")

# Initialize OpenRouter client
client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
)

# Load the Sentence Transformer model



def load_index():
    """
    Load the saved FAISS index.
    """
    return faiss.read_index("faiss_index.bin")


def load_chunks():
    """
    Load the saved text chunks.
    """
    with open("chunks.pkl", "rb") as f:
        return pickle.load(f)


def search_similar_chunks(question, top_k=3):
    """
    Search the FAISS index and return the most relevant text chunks.
    """

    # Load FAISS index
    index = load_index()

    # Load original chunks
    chunks = load_chunks()

    # Convert question into embedding
    model = load_model()
    question_embedding = model.encode([question])

    # Search similar vectors
    distances, indices = index.search(
        np.array(question_embedding, dtype=np.float32),
        top_k
    )

    # Retrieve matching chunks
    relevant_chunks = [chunks[i] for i in indices[0]]

    return relevant_chunks


def ask_question(question):
    """
    Answer a user question using Retrieval-Augmented Generation (RAG).
    """

    # Retrieve relevant chunks
    relevant_chunks = search_similar_chunks(question)

    # Convert list into a single context string
    context = "\n\n".join(relevant_chunks)

    # Create prompt
    prompt = f"""
You are an AI Research Paper Assistant.

Answer the user's question ONLY using the research paper context below.

If the answer is not present in the context, reply exactly:

"I could not find the answer in the uploaded research paper."

Research Paper Context:
{context}

Question:
{question}
"""

    try:
        # Send prompt to OpenRouter
        response = client.responses.create(
            model="nvidia/nemotron-3-ultra-550b-a55b:free",
            input=prompt,
        )

        # Return generated answer
        return response.output_text

    except Exception as e:
        return f"Error: {str(e)}"