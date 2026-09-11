import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  Search, 
  Lightbulb, 
  GraduationCap, 
  Layers,
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function Home({ activeDoc }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'Grounded RAG Chat',
      description: 'Ask deep technical questions. Every AI response comes strictly grounded in retrieved paper chunks with exact page citations.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: FileText,
      title: 'Executive Summarizer',
      description: 'Instantly generate multi-section summaries covering background, problem statement, methodology, and key experimental findings.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Search,
      title: 'Research Gap Identification',
      description: 'Critically analyze papers for missing baselines, dataset limitations, unaddressed edge cases, and uncontrolled variables.',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: Lightbulb,
      title: 'Practical Project Ideas',
      description: 'Convert complex academic concepts into actionable computer science project proposals with suggested tech stacks.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: GraduationCap,
      title: 'Viva Voce Exam Prep',
      description: 'Prepare for thesis defense and interviews with 5 challenging professor-level questions and authoritative model answers.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Layers,
      title: 'Local FAISS Vector Engine',
      description: 'Fast, secure local vector search powered by SentenceTransformers (all-MiniLM-L6-v2) for sub-second retrieval.',
      color: 'from-sky-500 to-indigo-500',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20"
    >
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 text-center space-y-8">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          Powered by Gemini 2.5 Flash & FAISS RAG
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Read & Analyze Academic Papers <span className="gradient-text">10x Faster</span> with AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload any research paper PDF. Chat with grounded page-cited RAG context and automatically generate executive summaries, research gaps, project ideas, and viva exam prep.
        </motion.p>

        {/* Call-to-action buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/upload"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 group"
          >
            <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Upload Research Paper
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {activeDoc ? (
            <Link
              to="/chat"
              className="px-8 py-4 rounded-2xl glass-card border border-emerald-500/40 text-emerald-300 font-bold text-base hover:bg-emerald-500/10 transition-all flex items-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Chat with Active Paper
            </Link>
          ) : (
            <Link
              to="/about"
              className="px-8 py-4 rounded-2xl glass-card text-slate-300 font-bold text-base hover:bg-slate-800/80 transition-all flex items-center gap-3"
            >
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              View Architecture
            </Link>
          )}
        </motion.div>

        {/* Feature Checkmarks */}
        <motion.div variants={itemVariants} className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Data Hardcoding</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exact Page Citations</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 6 Automated Insight Types</span>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold gradient-heading">Built for Researchers, Students & Engineers</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Everything you need to digest, query, and critique complex literature in minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} p-2.5 text-white shadow-lg`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow Banner */}
      <motion.section variants={itemVariants} className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              3-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Upload, Generate Insights, and Chat</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              No registration or key exposure required. Your paper is indexed locally using FAISS embeddings and processed via Gemini 2.5 Flash server-side APIs.
            </p>
          </div>
          <Link
            to="/upload"
            className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg shrink-0 flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

    </motion.div>
  );
}
