from pydantic import BaseModel, Field
from typing import List, Optional

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "2.0.0"
    message: str = "AI Research Paper Assistant API is online."

class Citation(BaseModel):
    chunk_id: int
    page_number: int
    text_snippet: str

class DocumentUploadResponse(BaseModel):
    doc_id: str
    filename: str
    total_pages: int
    total_chunks: int
    message: str = "Document successfully processed and indexed."

class ChatRequest(BaseModel):
    doc_id: str = Field(..., description="Unique document ID returned upon upload")
    question: str = Field(..., description="User question about the document")

class ChatResponse(BaseModel):
    doc_id: str
    question: str
    answer: str
    citations: List[Citation] = []

class InsightRequest(BaseModel):
    doc_id: str = Field(..., description="Unique document ID returned upon upload")

class InsightResponse(BaseModel):
    doc_id: str
    insight_type: str
    content: str
