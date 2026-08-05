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
    pass