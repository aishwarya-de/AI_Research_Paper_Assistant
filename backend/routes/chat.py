from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from backend.services.rag_service import ask_rag

router = APIRouter(tags=["Chatbot"])


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="The user question regarding the research paper")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of context chunks to retrieve from FAISS")


@router.post("/chat")
async def chat_with_paper(request: ChatRequest):
    """
    RAG Chat endpoint:
    Searches indexed paper chunks using FAISS, supplies retrieved context to Gemini,
    and returns a grounded answer with cited source chunks.
    """
    clean_question = request.question.strip()
    if not clean_question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )

    try:
        result = ask_rag(clean_question, top_k=request.top_k)
        return {
            "success": True,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
