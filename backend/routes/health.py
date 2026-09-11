from fastapi import APIRouter
from models.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify backend service readiness.
    
    Returns status 200 with service information and operational status.
    """
    return HealthResponse(
        status="ok",
        version="2.0.0",
        message="AI Research Paper Assistant API is operating normally."
    )
