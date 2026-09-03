import React from 'react';
import { Layers, Database, Cpu, Bot, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function About() {
  const steps = [
    {
      step: '01',
      title: 'PDF Text Ingestion',
      tech: 'PyMuPDF (fitz)',
      desc: 'Extracts full document text from academic PDFs, strips formatting artifacts, and calculates document metadata.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Sliding Window Chunking',
      tech: 'Custom Chunking Engine',
      desc: 'Splits text into 500-character segments with 50-character overlap to preserve semantic context across chunk boundaries.',
      icon: Database,
    },
    {
      step: '03',
      title: 'Vector Embeddings',
      tech: 'Sentence Transformers (all-MiniLM-L6-v2)',
      desc: 'Maps each text chunk into a high-dimensional dense vector space capturing deep academic semantics.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Vector Indexing & Retrieval',
      tech: 'FAISS (Facebook AI Similarity Search)',
      desc: 'Constructs an in-memory IndexFlatL2 for sub-millisecond similarity queries based on Euclidean distance.',
      icon: Database,
    },
    {
      step: '05',
      title: 'Grounded Generation',
      tech: 'Google Gemini API',
      desc: 'Uses structured prompts and context injection to synthesize grounded answers and perform analytical tasks with zero hallucinations.',
      icon: Bot,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-70px)] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Architecture &amp; RAG Methodology
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Learn how ScholarAI integrates state-of-the-art vector similarity search with Google Gemini
          to build an enterprise-grade academic assistant.
        </p>
      </div>

      {/* RAG Pipeline Flow */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
          The 5-Stage RAG Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      STAGE {s.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1">{s.title}</h3>
                  <p className="text-xs text-indigo-300/90 font-mono mb-2">{s.tech}</p>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-100">System Decoupling</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The frontend and backend are completely decoupled. The React client communicates with the
          FastAPI backend via clean RESTful JSON endpoints. No Streamlit runtime or server-side UI
          rendering is used.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
          <pre>{`[ React Client (Vite) ]
       │  HTTP /api/upload
       ▼
[ FastAPI Server ] ──▶ [ PyMuPDF: Text Extraction ]
       │                      │
       ▼                      ▼
[ FAISS Vector Store ] ◀── [ all-MiniLM-L6-v2 Embeddings ]
       ▲
       │ Semantic Top-K Chunks
       ▼
[ Google Gemini API ] ──▶ [ Structured Summaries / Grounded Answers ]`}</pre>
        </div>
      </div>
    </div>
  );
}
