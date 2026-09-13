from fastapi import APIRouter
from models.schemas import HealthResponse

try:
    from backend.services.rag_service import get_active_document
except ImportError:
    from services.rag_service import get_active_document

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify backend service readiness.
    
    Returns status 200 with service information and operational status.
    """
    return HealthResponse(
        status="healthy",
        version="2.0.0",
        message="AI Research Paper Assistant API is operating normally."
    )

@router.get("/document/status")
async def document_status():
    """Return the current active-document state for the frontend and test suite."""
    data = get_active_document()
    return data
