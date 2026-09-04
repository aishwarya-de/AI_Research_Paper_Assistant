import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.services.pdf_service import extract_text_from_pdf
from backend.services.embedding_service import chunk_text, build_faiss_index
from backend.services.rag_service import set_active_document, get_active_document, clear_active_document

router = APIRouter(tags=["Upload"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a research paper PDF, extracts text, generates embeddings,
    and builds the FAISS index for semantic search.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported. Please upload a valid .pdf document."
        )

    # Sanitize filename
    safe_filename = os.path.basename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded PDF file is empty."
            )
        if file_size > MAX_FILE_SIZE:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE // (1024 * 1024)}MB."
            )

        # Extract and clean text from PDF
        text, page_count = extract_text_from_pdf(file_path)

        # Split into chunks
        chunks = chunk_text(text)
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract meaningful text chunks from this PDF."
            )

        # Build FAISS vector index
        num_chunks = build_faiss_index(chunks)

        # Update active document session
        set_active_document(
            filename=safe_filename,
            text=text,
            pages=page_count,
            chunks=num_chunks,
            filepath=file_path
        )

        return {
            "success": True,
            "filename": safe_filename,
            "pages": page_count,
            "chunks": num_chunks,
            "characters": len(text),
            "words": len(text.split())
        }

    except HTTPException:
        raise
    except Exception as e:
        # Clean up failed file if needed
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process research paper: {str(e)}"
        )


@router.get("/document/status")
async def document_status():
    """
    Returns the metadata of the currently active document.
    """
    return get_active_document()


@router.post("/document/reset")
async def reset_document():
    """
    Clears the currently loaded document.
    """
    clear_active_document()
    return {"success": True, "message": "Document session cleared successfully."}
