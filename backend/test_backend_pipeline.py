import fitz
import io
import asyncio
from fastapi.testclient import TestClient
from main import app

def create_sample_paper_pdf() -> bytes:
    """Create an in-memory sample PDF research paper."""
    doc = fitz.open()
    page = doc.new_page()
    
    text = (
        "Title: Attention and Transformer Architectures in Neural Language Modeling\n\n"
        "Abstract:\n"
        "Neural network models rely heavily on self-attention mechanisms to capture long-range dependencies in sequence modeling. "
        "In this work, we propose a lightweight multi-head self-attention module that reduces computational complexity from O(N^2) to O(N log N). "
        "Our empirical evaluation on standard benchmark datasets demonstrates a 15% improvement in translation quality with 30% fewer parameters.\n\n"
        "1. Introduction:\n"
        "Transformers have superseded recurrent neural networks (RNNs) in natural language processing tasks. "
        "However, quadratic memory requirements hinder deployment on edge devices.\n\n"
        "2. Proposed Method:\n"
        "We introduce Sparse-Attention blocks paired with layer normalization and residual connections. "
        "The model is trained using AdamW optimizer with a learning rate of 3e-4 and cosine decay schedule.\n\n"
        "3. Results & Discussion:\n"
        "On WMT14 English-to-German translation, our model achieves a BLEU score of 29.8, outperforming prior baseline architectures. "
        "Computational speedup is validated across GPUs and embedded mobile TPU hardware.\n\n"
        "4. Conclusion & Limitations:\n"
        "While Sparse-Attention significantly reduces memory consumption, sequence length scaling beyond 32k tokens requires further cache optimization."
    )
    
    page.insert_text((50, 50), text, fontsize=11)
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes

def test_pipeline():
    client = TestClient(app)

    print("\n--- 1. Testing GET /health ---")
    res = client.get("/health")
    assert res.status_code == 200
    print("Health response:", res.json())

    print("\n--- 2. Testing POST /upload ---")
    pdf_bytes = create_sample_paper_pdf()
    files = {"file": ("sample_paper.pdf", pdf_bytes, "application/pdf")}
    upload_res = client.post("/upload", files=files)
    print("Upload status:", upload_res.status_code)
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    print("Uploaded document metadata:", doc_data)
    doc_id = doc_data["doc_id"]
    assert doc_id is not None

    print("\n--- 3. Testing POST /chat (RAG query) ---")
    chat_payload = {"doc_id": doc_id, "question": "What is the computational complexity of the proposed attention module?"}
    chat_res = client.post("/chat", json=chat_payload)
    print("Chat status:", chat_res.status_code)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    print("Chat Answer:", chat_data["answer"])
    print("Citations count:", len(chat_data["citations"]))
    assert len(chat_data["citations"]) > 0

    print("\n--- 4. Testing POST /summary ---")
    summary_res = client.post("/summary", json={"doc_id": doc_id})
    assert summary_res.status_code == 200
    print("Summary insight generated (length):", len(summary_res.json()["content"]))

    print("\n--- 5. Testing POST /key-points ---")
    kp_res = client.post("/key-points", json={"doc_id": doc_id})
    assert kp_res.status_code == 200
    print("Key points generated successfully!")

    print("\n✅ ALL BACKEND RAG & INSIGHT PIPELINE TESTS PASSED!\n")

if __name__ == "__main__":
    test_pipeline()
