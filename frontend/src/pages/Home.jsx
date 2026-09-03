import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Star,
  Search,
  Lightbulb,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import FileUpload from '../components/FileUpload';

export default function Home({ currentDoc, onUploadSuccess }) {
  const navigate = useNavigate();

  const handleUploadDone = (data) => {
    if (onUploadSuccess) {
      onUploadSuccess(data);
    }
    // Navigate automatically to assistant after successful upload
    navigate('/assistant');
  };

  const features = [
    {
      icon: FileText,
      title: 'Executive Summaries',
      desc: 'Concise 200-word academic abstracts capturing objectives, methodology, and results.',
      color: 'from-indigo-500/20 to-blue-500/20',
      text: 'text-indigo-400',
    },
    {
      icon: Star,
      title: 'Key Takeaways',
      desc: 'Extracted novel contributions and methodological breakthroughs at a glance.',
      color: 'from-amber-500/20 to-yellow-500/20',
      text: 'text-amber-400',
    },
    {
      icon: Search,
      title: 'Research Gap Analysis',
      desc: 'Peer-reviewer scrutiny highlighting limitations, bias, and open research directions.',
      color: 'from-cyan-500/20 to-teal-500/20',
      text: 'text-cyan-400',
    },
    {
      icon: Lightbulb,
      title: 'Actionable Project Ideas',
      desc: 'Applied AI/ML engineering suggestions to extend and build upon the paper.',
      color: 'from-purple-500/20 to-pink-500/20',
      text: 'text-purple-400',
    },
    {
      icon: GraduationCap,
      title: 'Viva Voce Exam Prep',
      desc: 'Defensible interview questions with rigorous model answers for academic defense.',
      color: 'from-emerald-500/20 to-green-500/20',
      text: 'text-emerald-400',
    },
    {
      icon: MessageSquare,
      title: 'Grounded FAISS RAG Chat',
      desc: 'Ask questions with confidence—verified with source citations and zero hallucinations.',
      color: 'from-blue-500/20 to-indigo-500/20',
      text: 'text-blue-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-70px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Research Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          Supercharge Your Literature Review with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI Research Assistant
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Upload any academic research paper (PDF). Our vector-embedded RAG engine extracts key
          points, synthesizes comprehensive summaries, analyzes research gaps, and powers grounded
          Q&amp;A.
        </p>
      </div>

      {/* Upload Box Container */}
      <div className="max-w-2xl mx-auto space-y-4">
        <FileUpload onUploadSuccess={handleUploadDone} currentDoc={currentDoc} />

        {currentDoc?.is_loaded && (
          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/assistant')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-sm shadow-xl shadow-indigo-500/25 transition-all group"
            >
              <span>Launch Research Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">Everything you need to dissect papers</h2>
          <p className="text-sm text-slate-400">
            From quick abstract distillation to rigorous academic defense preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${feature.text}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
