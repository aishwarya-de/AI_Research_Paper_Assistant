import os
import pickle
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Tuple, Dict, Any

_MODEL_INSTANCE = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
FAISS_DIR = os.path.join(DATA_DIR, "faiss")
CHUNKS_DIR = os.path.join(DATA_DIR, "chunks")

os.makedirs(FAISS_DIR, exist_ok=True)
os.makedirs(CHUNKS_DIR, exist_ok=True)

DEFAULT_INDEX_PATH = os.path.join(FAISS_DIR, "faiss_index.bin")
DEFAULT_CHUNKS_PATH = os.path.join(CHUNKS_DIR, "chunks.pkl")


def get_embedding_model() -> SentenceTransformer:
    """
    Lazy-loads and caches the SentenceTransformer model in memory.
    Reuses the existing 'all-MiniLM-L6-v2' model.
    """
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is None:
        _MODEL_INSTANCE = SentenceTransformer("all-MiniLM-L6-v2")
    return _MODEL_INSTANCE


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Splits text into overlapping chunks.
    Preserves existing working chunking behavior.
    """
    if not text:
        return []
        
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


def build_faiss_index(chunks: List[str], index_path: str = DEFAULT_INDEX_PATH, chunks_path: str = DEFAULT_CHUNKS_PATH) -> int:
    """
    Encodes text chunks, creates an IndexFlatL2 FAISS index, and persists both index and chunks.
    Returns the total number of chunks indexed.
    """
    if not chunks:
        raise ValueError("Cannot build index with empty chunks list.")

    model = get_embedding_model()
    embeddings = model.encode(chunks, show_progress_bar=False)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings, dtype=np.float32))

    # Save index and chunks to disk
    faiss.write_index(index, index_path)
    with open(chunks_path, "wb") as f:
        pickle.dump(chunks, f)

    return len(chunks)


def load_index_and_chunks(index_path: str = DEFAULT_INDEX_PATH, chunks_path: str = DEFAULT_CHUNKS_PATH) -> Tuple[faiss.Index, List[str]]:
    """
    Loads saved FAISS index and chunks from disk.
    """
    if not os.path.exists(index_path) or not os.path.exists(chunks_path):
        raise FileNotFoundError("FAISS index or chunks file not found. Please upload a research paper first.")

    index = faiss.read_index(index_path)
    with open(chunks_path, "rb") as f:
        chunks = pickle.load(f)

    return index, chunks


def search_similar_chunks(query: str, top_k: int = 4, index_path: str = DEFAULT_INDEX_PATH, chunks_path: str = DEFAULT_CHUNKS_PATH) -> List[Dict[str, Any]]:
    """
    Performs semantic vector search over FAISS index and returns top-k matching chunks with chunk IDs and distances.
    """
    index, chunks = load_index_and_chunks(index_path, chunks_path)
    model = get_embedding_model()

    query_embedding = model.encode([query], show_progress_bar=False)
    k = min(top_k, len(chunks))

    distances, indices = index.search(
        np.array(query_embedding, dtype=np.float32),
        k
    )

    results = []
    for rank, idx in enumerate(indices[0]):
        if 0 <= idx < len(chunks):
            results.append({
                "chunk": int(idx + 1),
                "text": chunks[idx],
                "score": float(distances[0][rank])
            })

    return results
