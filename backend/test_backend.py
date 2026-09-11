import os
import sys
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.services.pdf_service import clean_text
from backend.services.embedding_service import chunk_text, build_faiss_index, search_similar_chunks
from backend.services.rag_service import set_active_document, get_active_document

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[PASS] Health check endpoint passed")


def test_clean_text():
    raw = "  Hello   world \x00\n\n\n\nNew   Paragraph  "
    cleaned = clean_text(raw)
    assert "Hello world" in cleaned
    assert "\x00" not in cleaned
    assert "\n\nNew Paragraph" in cleaned
    print("[PASS] Text cleaning passed")


def test_chunking_and_faiss():
    sample_text = (
        "Artificial intelligence and deep learning models are revolutionizing automated literature reviews. "
        "Retrieval-Augmented Generation (RAG) combines semantic vector retrieval with large language models "
        "to deliver grounded, hallucination-resistant answers. "
        "FAISS enables millisecond similarity search over dense vector spaces. "
        "Sentence transformers map textual chunks into semantic embedding vectors. "
    ) * 3

    chunks = chunk_text(sample_text, chunk_size=200, overlap=30)
    assert len(chunks) > 0
    print(f"[PASS] Chunking passed ({len(chunks)} chunks created)")

    # Test FAISS building
    test_index_path = os.path.join(os.path.dirname(__file__), "data", "faiss", "test_faiss.bin")
    test_chunks_path = os.path.join(os.path.dirname(__file__), "data", "chunks", "test_chunks.pkl")

    count = build_faiss_index(chunks, index_path=test_index_path, chunks_path=test_chunks_path)
    assert count == len(chunks)
    assert os.path.exists(test_index_path)
    assert os.path.exists(test_chunks_path)
    print(f"[PASS] FAISS index build passed ({count} chunks indexed)")

    # Test FAISS similarity search
    results = search_similar_chunks("What is RAG and FAISS?", top_k=2, index_path=test_index_path, chunks_path=test_chunks_path)
    assert len(results) > 0
    assert "text" in results[0]
    assert "chunk" in results[0]
    print(f"[PASS] FAISS semantic search passed (top match chunk #{results[0]['chunk']})")

    # Clean up test files
    if os.path.exists(test_index_path):
        os.remove(test_index_path)
    if os.path.exists(test_chunks_path):
        os.remove(test_chunks_path)


def test_document_status_endpoint():
    response = client.get("/api/document/status")
    assert response.status_code == 200
    data = response.json()
    assert "is_loaded" in data
    print("[PASS] Document status endpoint passed")


if __name__ == "__main__":
    print("Running backend tests...")
    test_health()
    test_clean_text()
    test_chunking_and_faiss()
    test_document_status_endpoint()
    print("\nAll automated backend tests passed successfully!")
