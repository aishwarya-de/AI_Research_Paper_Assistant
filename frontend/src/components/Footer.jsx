import React from 'react';
import { Sparkles, Github, Heart, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">PaperMind 2.0</span>
          <span>— RAG-Powered AI Research Paper Assistant</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-slate-500">
            <Cpu className="w-3.5 h-3.5" /> FastRAG + Gemini 2.5 Flash
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Researchers
          </span>
        </div>

      </div>
    </footer>
  );
}
