# AI Research Paper Assistant 2.0 🔬📄

A production-grade web application for AI-powered research paper analysis, retrieval-augmented generation (RAG) chat, and automated insight generation.

## Features
- 📑 **PDF Upload & Indexing**: Parse and chunk academic PDFs using PyMuPDF (`fitz`).
- ⚡ **Local RAG Vector Search**: Embed chunks with `sentence-transformers` (`all-MiniLM-L6-v2`) and index with `faiss-cpu`.
- 💬 **Interactive Grounded Chat**: Ask questions about your paper with cited chunk references and page numbers.
- 💡 **Automated Insights**:
  - **Summary**: Concise executive summary of background, methods, and results.
  - **Key Points**: Core findings and major contributions.
  - **Research Gaps**: Limitations and unaddressed research questions.
  - **Future Scope**: Potential extensions and future research directions.
  - **Project Ideas**: Practical project concepts derived from the paper.
  - **Viva Questions**: Exam & interview preparation questions with sample answers.
- 🎨 **Modern React 19 UI**: Built with Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## System Architecture

```
                                    +--------------------+
                                    |    React 19 UI     |
                                    |  (Vite + Tailwind) |
                                    +---------+----------+
                                              |
                                      Axios REST API
                                              |
                                              v
+-----------------------------------------------------------------------------------+
| Node.js Express Backend                                                            |
|                                                                                   |
|  +--------------------+      +--------------------+      +---------------------+  |
|  | PDF Extractor      | ---> | Chunk & Embed      | ---> | In-memory FAISS-like|  |
|  +--------------------+      | (PDF parse)        |      | Vector Store        |  |
|                              +--------------------+      +----------+----------+  |
|                                                                Top-K Retrieval    |
|                                                                     |             |
|                                                                     v             |
|                                                          +---------------------+  |
|                                                          |  Gemini 2.5 Flash   |  |
|                                                          |   (RAG Engine)      |  |
|                                                          +---------------------+  |
+-----------------------------------------------------------------------------------+
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Setup Instructions

1. **Node.js Backend Setup**:
   ```bash
   cd backend-node
   npm install
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Environment Configuration**:
   Create `.env` in the project root or inside the Node backend folder:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=8000
   ```

## Deployment Notes
- **Frontend**: Deploy `frontend/` build artifact to **Vercel** or **Netlify**.
- **Backend**: Deploy `backend/` as a Python web service on **Render**, **Koyeb**, or **Railway**.
