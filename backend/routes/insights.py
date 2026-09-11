from fastapi import APIRouter, HTTPException, status, Path
from models.schemas import InsightRequest, InsightResponse
from rag.vector_store import vector_store
from rag.prompts import get_prompt_template, PROMPT_MAP
from services.gemini_service import gemini_service

router = APIRouter(tags=["AI Insights"])

@router.post("/insights/{insight_type}", response_model=InsightResponse)
async def generate_paper_insight(
    request: InsightRequest,
    insight_type: str = Path(..., description="Type of insight: summary, key-points, research-gaps, future-scope, project-ideas, viva")
):
    """
    Generate specialized AI insights for an uploaded paper.
    
    Supported types: summary, key-points, research-gaps, future-scope, project-ideas, viva.
    """
    doc_id = request.doc_id.strip()
    
    if not vector_store.has_document(doc_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document ID '{doc_id}' not found. Please upload the paper first."
        )

    try:
        prompt_template = get_prompt_template(insight_type)
        full_text = vector_store.get_full_text(doc_id)

        content = gemini_service.generate_insight(prompt_template, full_text)

        return InsightResponse(
            doc_id=doc_id,
            insight_type=insight_type,
            content=content
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating insight '{insight_type}': {str(e)}"
        )

# Direct alias routes as specified in Phase 3
@router.post("/summary", response_model=InsightResponse)
async def get_summary(request: InsightRequest):
    """Generate executive paper summary."""
    return await generate_paper_insight(request, "summary")

@router.post("/key-points", response_model=InsightResponse)
async def get_key_points(request: InsightRequest):
    """Generate key findings and contributions."""
    return await generate_paper_insight(request, "key-points")

@router.post("/research-gaps", response_model=InsightResponse)
async def get_research_gaps(request: InsightRequest):
    """Identify research gaps and limitations."""
    return await generate_paper_insight(request, "research-gaps")

@router.post("/future-scope", response_model=InsightResponse)
async def get_future_scope(request: InsightRequest):
    """Outline future research directions."""
    return await generate_paper_insight(request, "future-scope")

@router.post("/project-ideas", response_model=InsightResponse)
async def get_project_ideas(request: InsightRequest):
    """Generate practical project implementation concepts."""
    return await generate_paper_insight(request, "project-ideas")

@router.post("/viva", response_model=InsightResponse)
async def get_viva_questions(request: InsightRequest):
    """Generate viva voce examination questions and model answers."""
    return await generate_paper_insight(request, "viva")
