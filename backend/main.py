import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.routes.upload import router as upload_router
from backend.routes.research import router as research_router
from backend.routes.chat import router as chat_router

load_dotenv()

app = FastAPI(
    title="AI Research Paper Assistant API",
    description="FastAPI backend for AI Research Paper Assistant powered by Google Gemini and FAISS RAG.",
    version="2.0.0"
)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    frontend_url.rstrip("/"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(upload_router, prefix="/api")
app.include_router(research_router, prefix="/api")
app.include_router(chat_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "AI Research Paper Assistant API is running.",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health")
async def health_check():
    gemini_configured = bool(os.getenv("GEMINI_API_KEY") and not os.getenv("GEMINI_API_KEY").startswith("your_"))
    return {
        "status": "healthy",
        "gemini_configured": gemini_configured,
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
