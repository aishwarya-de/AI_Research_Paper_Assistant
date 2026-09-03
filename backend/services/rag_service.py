import os
from typing import Dict, Any, List, Optional
from backend.services.embedding_service import search_similar_chunks, DEFAULT_INDEX_PATH, DEFAULT_CHUNKS_PATH
from backend.services.gemini_service import answer_rag_question

# In-memory session tracking current active paper
_ACTIVE_DOCUMENT: Dict[str, Any] = {
    "filename": None,
    "pages": 0,
    "chunks": 0,
    "characters": 0,
    "words": 0,
    "text": None,
    "filepath": None
}


def set_active_document(filename: str, text: str, pages: int, chunks: int, filepath: str):
    """
    Stores metadata and extracted text for the active research paper.
    """
    global _ACTIVE_DOCUMENT
    _ACTIVE_DOCUMENT = {
        "filename": filename,
        "pages": pages,
        "chunks": chunks,
        "characters": len(text),
        "words": len(text.split()),
        "text": text,
        "filepath": filepath
    }


def get_active_document() -> Dict[str, Any]:
    """
    Returns current active document metadata.
    """
    return {
        "filename": _ACTIVE_DOCUMENT["filename"],
        "pages": _ACTIVE_DOCUMENT["pages"],
        "chunks": _ACTIVE_DOCUMENT["chunks"],
        "characters": _ACTIVE_DOCUMENT["characters"],
        "words": _ACTIVE_DOCUMENT["words"],
        "is_loaded": _ACTIVE_DOCUMENT["text"] is not None
    }


def get_active_text() -> Optional[str]:
    """
    Returns extracted text of current active paper.
    """
    return _ACTIVE_DOCUMENT.get("text")


def clear_active_document():
    """
    Clears active document state.
    """
    global _ACTIVE_DOCUMENT
    _ACTIVE_DOCUMENT = {
        "filename": None,
        "pages": 0,
        "chunks": 0,
        "characters": 0,
        "words": 0,
        "text": None,
        "filepath": None
    }


def ask_rag(question: str, top_k: int = 4) -> Dict[str, Any]:
    """
    RAG pipeline:
    1. Check if an index exists.
    2. Retrieve top-k most similar text chunks using FAISS.
    3. Feed context + question into Gemini.
    4. Return answer along with retrieved sources for citations.
    """
    if not os.path.exists(DEFAULT_INDEX_PATH) or not os.path.exists(DEFAULT_CHUNKS_PATH):
        raise ValueError("No research paper has been uploaded and indexed yet. Please upload a PDF first.")

    # Search top-k similar chunks
    search_results = search_similar_chunks(question, top_k=top_k)

    if not search_results:
        return {
            "answer": "No relevant sections were found in the uploaded research paper.",
            "sources": []
        }

    chunk_texts = [res["text"] for res in search_results]

    # Grounded answer via Gemini
    answer = answer_rag_question(question, chunk_texts)

    # Format sources for frontend attribution
    sources = [
        {
            "chunk": res["chunk"],
            "text": res["text"],
            "score": round(res["score"], 4)
        }
        for res in search_results
    ]

    return {
        "answer": answer,
        "sources": sources
    }
