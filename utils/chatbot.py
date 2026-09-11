import os
import pickle

import faiss
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from sentence_transformers import SentenceTransformer
import streamlit as st


load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1",
)


@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def load_index():
    return faiss.read_index("faiss_index.bin")


def load_chunks():
    with open("chunks.pkl", "rb") as f:
        return pickle.load(f)


def search_similar_chunks(question, top_k=3):

    index = load_index()
    chunks = load_chunks()

    model = load_model()

    question_embedding = model.encode([question])

    distances, indices = index.search(
        np.array(question_embedding, dtype=np.float32),
        top_k
    )

    relevant_chunks = [
        chunks[i] for i in indices[0]
    ]

    return relevant_chunks



def ask_question(question):

    relevant_chunks = search_similar_chunks(question)

    context = "\n\n".join(relevant_chunks)

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
        response = client.responses.create(
            model="nvidia/nemotron-3-ultra-550b-a55b:free",
            input=prompt,
        )

        return response.output_text


    except Exception as e:

        if "429" in str(e) or "rate limit" in str(e).lower():

            return (
                "⚠️ Daily AI request limit reached.\n\n"
                "The free OpenRouter quota has been exhausted."
            )

        return f"Error: {str(e)}"