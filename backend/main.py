import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from root or backend directory
env_path = Path(__file__).resolve().parent.parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(
    title="AI Research Paper Assistant 2.0 API",
    description="Backend service providing PDF RAG, Gemini API integration, and AI paper insights.",
    version="2.0.0",
)

# Configure CORS
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes
from routes.health import router as health_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.insights import router as insights_router

# Include routes under /api prefix and root level for maximum frontend compatibility
app.include_router(health_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(insights_router, prefix="/api")

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(insights_router)

@app.get("/")
async def root_redirect():
    """Root status endpoint."""
    return {
        "title": "AI Research Paper Assistant 2.0 API",
        "status": "online",
        "docs_url": "/docs"
    }
