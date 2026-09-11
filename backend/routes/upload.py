import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from models.schemas import DocumentUploadResponse
from services.pdf_service import PDFProcessor
from rag.vector_store import vector_store

router = APIRouter(tags=["Upload"])

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB limit

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF upload, extracts text, chunks content, and indexes into FAISS vector store.
    
    - Validates file MIME type and max size (15MB).
    - Generates unique doc_id for session tracking.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF research papers (.pdf) are supported."
        )

    file_bytes = await file.read()
    
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size limit of 15MB (uploaded {len(file_bytes) // (1024*1024)}MB)."
        )

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    try:
        # Extract text and chunk PDF content
        chunks, total_pages = PDFProcessor.extract_and_chunk(file_bytes)
        
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract readable text from the uploaded PDF. It may be scanned or image-only."
            )

        # Generate unique document ID
        doc_id = uuid.uuid4().hex[:10]

        # Index vectors into FAISS
        vector_store.add_document(doc_id, chunks)

        return DocumentUploadResponse(
            doc_id=doc_id,
            filename=file.filename,
            total_pages=total_pages,
            total_chunks=len(chunks),
            message=f"Successfully parsed '{file.filename}' ({total_pages} pages, {len(chunks)} chunks indexed)."
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing PDF document: {str(e)}"
        )
