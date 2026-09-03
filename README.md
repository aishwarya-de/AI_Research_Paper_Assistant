# 📄 AI Research Paper Assistant (React + FastAPI + Google Gemini)

An AI-powered Research Assistant that transforms how researchers, students, and engineers understand academic papers. Built with a decoupled **React (Vite + Tailwind CSS)** frontend, a **FastAPI** backend, **Google Gemini API**, **PyMuPDF**, and **FAISS RAG** vector search.

---

## 🚀 Features

- 📑 **Drag & Drop PDF Ingestion**: Instant text extraction and page counting via PyMuPDF with clean parsing.
- ⚡ **Dense Vector Embeddings & Indexing**: Semantic chunking with `all-MiniLM-L6-v2` and Euclidean similarity indexing using FAISS.
- 📝 **Structured Executive Summaries**: Concise summaries capturing objectives, methodologies, findings, and conclusions.
- ⭐ **Key Contribution Points**: Highlights novel findings and breakthroughs.
- 🔍 **Critical Research Gaps**: Uncovers limitations, sample biases, and open research directions.
- 💡 **Engineering & Project Ideas**: Actionable real-world software & ML extensions based on the paper.
- 🎓 **Viva Voce / Oral Defense Questions**: Comprehensive interview questions accompanied by model answers.
- 💬 **Grounded RAG Chatbot**: Query the paper with zero hallucinations. Includes expandable source chunk citations.
- 🎨 **Decoupled Modern Architecture**: Standalone React client and standalone FastAPI backend ready for independent deployment.

---

## 🏗️ Architecture & Workflow

```text
             ┌──────────────────────────────────┐
             │      React UI (Port 5173)        │
             │   Vite + Tailwind CSS + Axios    │
             └─────────────────┬────────────────┘
                               │ REST APIs (JSON)
                               ▼
             ┌──────────────────────────────────┐
             │     FastAPI Server (Port 8000)   │
             └─────────────────┬────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
     │ PDF Service │    │ RAG Service │    │ Gemini SDK  │
     │   PyMuPDF   │    │ FAISS + ST  │    │ Google GenAI│
     └─────────────┘    └──────┬──────┘    └──────┬──────┘
                               │                  │
                               ▼                  ▼
                        Top-K Context  +  User Question
                               │                  │
                               └─────────┬────────┘
                                         ▼
                             Grounded Answer + Sources
```

---

## 📂 Project Structure

```text
AI_Research_Paper_Assistant/
│
├── backend/                         # Standalone FastAPI Service
│   ├── main.py                      # FastAPI entry point & CORS configuration
│   ├── requirements.txt             # Backend Python dependencies
│   ├── .env.example                 # Example environment variables
│   │
│   ├── routes/
│   │   ├── upload.py                # POST /api/upload, GET /api/document/status
│   │   ├── research.py              # POST /api/research/{summary, key-points, gaps, project-ideas, viva}
│   │   └── chat.py                  # POST /api/chat (FAISS Top-K context retrieval & Gemini)
│   │
│   ├── services/
│   │   ├── pdf_service.py           # Text extraction, cleaning, and page counting
│   │   ├── embedding_service.py     # SentenceTransformer singleton & FAISS index persistence
│   │   ├── rag_service.py           # Top-K retrieval, context injection & citation formatting
│   │   └── gemini_service.py        # Google GenAI SDK integration with configurable models
│   │
│   ├── utils/
│   │   └── prompts.py               # Structured prompts for summarization, gaps, viva, & chat
│   │
│   └── data/
│       ├── uploads/                 # Temporary stored PDFs
│       ├── faiss/                   # Serialized FAISS indices
│       └── chunks/                  # Pickled chunk texts
│
├── frontend/                        # Standalone React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top header, health indicator & active doc badge
│   │   │   ├── Sidebar.jsx          # Multi-tab view selector & doc info
│   │   │   ├── FileUpload.jsx       # Drag & drop uploader with progress indicator
│   │   │   ├── ChatWindow.jsx       # Chat interface with auto-scroll & prompt suggestions
│   │   │   ├── ChatMessage.jsx      # Chat bubble with Markdown & source citations drawer
│   │   │   ├── SummaryCard.jsx      # Research summary card
│   │   │   ├── KeyPoints.jsx        # Key contributions card
│   │   │   ├── ResearchGaps.jsx     # Research gap discovery card
│   │   │   ├── ProjectIdeas.jsx     # Project ideas card
│   │   │   └── VivaQuestions.jsx    # Viva examination questions card
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero & upload CTA
│   │   │   ├── ResearchAssistant.jsx# Comprehensive analysis workspace
│   │   │   └── About.jsx            # Architecture & RAG pipeline documentation
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Axios HTTP client with backend routes
│   │   │
│   │   ├── App.jsx                  # Main router and shared document state
│   │   └── main.jsx                 # React root
│   │
│   ├── package.json
│   └── vite.config.js               # Configured with proxy to http://localhost:8000
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, Axios, React Router, Lucide React, React Markdown |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic, Python-dotenv |
| **AI / LLM** | Google Gemini API (`google-genai` SDK), default: `gemini-2.5-flash` |
| **RAG / Vector DB** | FAISS (`faiss-cpu`), Sentence Transformers (`all-MiniLM-L6-v2`) |
| **PDF Processing** | PyMuPDF (`fitz`) |

---

## ⚙️ Quickstart Guide

Frontend and backend run as independent services.

### 1. Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   ```bash
   # Windows PowerShell
   ..\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   Copy `.env.example` to `.env` and insert your Gemini API Key from [Google AI Studio](https://aistudio.google.com/):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   FRONTEND_URL=http://localhost:5173
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   Backend documentation will be accessible at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Backend health check & Gemini configuration status |
| `POST` | `/api/upload` | Ingest PDF, extract text, and build FAISS index |
| `GET` | `/api/document/status` | Current active document metadata |
| `POST` | `/api/document/reset` | Clear active document session |
| `POST` | `/api/research/summary` | Generate research paper summary |
| `POST` | `/api/research/key-points` | Extract key contributions & findings |
| `POST` | `/api/research/gaps` | Identify limitations and research gaps |
| `POST` | `/api/research/project-ideas` | Generate applied project suggestions |
| `POST` | `/api/research/viva` | Generate oral exam questions with model answers |
| `POST` | `/api/chat` | RAG query over FAISS chunks with source citation |

---

## 👩‍💻 Author

**Aishwarya**  
Computer Science & Engineering Student | AI & Machine Learning Enthusiast
