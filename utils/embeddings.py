import streamlit as st
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
from utils.model_loader import get_embedding_model

def generate_embeddings(chunks):
    model = get_embedding_model()
    return model.encode(chunks)


@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")


def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


def generate_embeddings(chunks):
    model = load_model()
    embeddings = model.encode(chunks)
    return embeddings


def create_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings, dtype=np.float32))
    return index


def save_index(index, filename="faiss_index.bin"):
    faiss.write_index(index, filename)


def save_chunks(chunks, filename="chunks.pkl"):
    with open(filename, "wb") as f:
        pickle.dump(chunks, f)


def process_document(text):
    chunks = chunk_text(text)
    embeddings = generate_embeddings(chunks)
    index = create_faiss_index(embeddings)
    save_index(index)
    save_chunks(chunks)
    return index, chunks