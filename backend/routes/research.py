from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from backend.services.rag_service import get_active_text
from backend.services.gemini_service import (
    generate_summary,
    generate_key_points,
    generate_research_gaps,
    generate_project_ideas,
    generate_viva_questions
)

router = APIRouter(prefix="/research", tags=["Research Analysis"])


class TextPayload(BaseModel):
    text: Optional[str] = None


def resolve_paper_text(payload: Optional[TextPayload] = None) -> str:
    if payload and payload.text and payload.text.strip():
        return payload.text.strip()
    active_text = get_active_text()
    if not active_text or not active_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active research paper found. Please upload a PDF research paper first."
        )
    return active_text


@router.post("/summary")
async def get_summary(payload: Optional[TextPayload] = None):
    text = resolve_paper_text(payload)
    try:
        summary = generate_summary(text)
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/key-points")
async def get_key_points(payload: Optional[TextPayload] = None):
    text = resolve_paper_text(payload)
    try:
        points = generate_key_points(text)
        return {"success": True, "key_points": points}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/gaps")
async def get_research_gaps(payload: Optional[TextPayload] = None):
    text = resolve_paper_text(payload)
    try:
        gaps = generate_research_gaps(text)
        return {"success": True, "research_gaps": gaps}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/project-ideas")
async def get_project_ideas(payload: Optional[TextPayload] = None):
    text = resolve_paper_text(payload)
    try:
        ideas = generate_project_ideas(text)
        return {"success": True, "project_ideas": ideas}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/viva")
async def get_viva_questions(payload: Optional[TextPayload] = None):
    text = resolve_paper_text(payload)
    try:
        viva = generate_viva_questions(text)
        return {"success": True, "viva_questions": viva}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
