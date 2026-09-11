import faiss
import numpy as np
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer

class VectorStoreManager:
    """
    Manages document embeddings and FAISS index instances.
    Uses 'all-MiniLM-L6-v2' SentenceTransformer model.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStoreManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        # Load local embedding model
        self.model_name = "all-MiniLM-L6-v2"
        print(f"[VectorStore] Loading embedding model: {self.model_name}...")
        self.encoder = SentenceTransformer(self.model_name)
        self.dimension = self.encoder.get_sentence_embedding_dimension()
        
        # Dictionary storing doc_id -> {"index": FAISS_Index, "chunks": List[Dict]}
        self.stores: Dict[str, Dict[str, Any]] = {}
        self.full_texts: Dict[str, str] = {}
        self._initialized = True

    def add_document(self, doc_id: str, chunks: List[Dict[str, Any]]) -> None:
        """
        Embed chunks and build FAISS vector index for doc_id.
        """
        if not chunks:
            raise ValueError("Cannot index document with empty text chunks.")

        texts = [c["text"] for c in chunks]
        embeddings = self.encoder.encode(texts, show_progress_bar=False, convert_to_numpy=True)
        
        # L2 normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)

        # Create FAISS IndexFlatIP (Inner Product = Cosine similarity for normalized vectors)
        index = faiss.IndexFlatIP(self.dimension)
        index.add(embeddings.astype(np.float32))

        self.stores[doc_id] = {
            "index": index,
            "chunks": chunks
        }
        # Store full concatenated text for summary/insight prompts
        self.full_texts[doc_id] = "\n\n".join([f"[Page {c['page_number']}] {c['text']}" for c in chunks])
        print(f"[VectorStore] Document '{doc_id}' indexed successfully ({len(chunks)} chunks).")

    def search(self, doc_id: str, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Query FAISS index for doc_id and return top_k matching chunks with similarity score.
        """
        if doc_id not in self.stores:
            raise KeyError(f"Document ID '{doc_id}' not found in vector store.")

        query_embedding = self.encoder.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_embedding)

        store = self.stores[doc_id]
        index = store["index"]
        chunks = store["chunks"]

        k = min(top_k, len(chunks))
        distances, indices = index.search(query_embedding.astype(np.float32), k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(chunks):
                chunk_data = dict(chunks[idx])
                chunk_data["score"] = float(dist)
                results.append(chunk_data)

        return results

    def get_full_text(self, doc_id: str) -> str:
        """
        Retrieve full extracted document text.
        """
        if doc_id not in self.full_texts:
            raise KeyError(f"Document ID '{doc_id}' not found.")
        return self.full_texts[doc_id]

    def has_document(self, doc_id: str) -> bool:
        return doc_id in self.stores

# Singleton instance accessor
vector_store = VectorStoreManager()
