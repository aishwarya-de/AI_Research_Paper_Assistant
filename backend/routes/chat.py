from fastapi import APIRouter, HTTPException, status
from models.schemas import ChatRequest, ChatResponse, Citation
from rag.vector_store import vector_store
from services.gemini_service import gemini_service

router = APIRouter(tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest):
    """
    RAG Chat endpoint for querying an uploaded document.
    
    - Retrieves top matching chunks from FAISS vector store.
    - Sends prompt + retrieved context to Gemini API.
    - Returns grounded response with cited chunk references.
    """
    doc_id = request.doc_id.strip()
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )

    if not vector_store.has_document(doc_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document ID '{doc_id}' not found. Please upload the paper first."
        )

    try:
        # Retrieve top 4 relevant context chunks
        top_chunks = vector_store.search(doc_id, question, top_k=4)

        # Generate answer with Gemini
        answer = gemini_service.generate_rag_answer(question, top_chunks)

        # Build citations
        citations = [
            Citation(
                chunk_id=c["chunk_id"],
                page_number=c["page_number"],
                text_snippet=c["text"][:150] + "..." if len(c["text"]) > 150 else c["text"]
            )
            for c in top_chunks
        ]

        return ChatResponse(
            doc_id=doc_id,
            question=question,
            answer=answer,
            citations=citations
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing RAG query: {str(e)}"
        )
