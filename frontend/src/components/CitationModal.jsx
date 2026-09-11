import React from 'react';
import { FileText, X, Bookmark } from 'lucide-react';

export default function CitationModal({ citation, onClose }) {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-indigo-500/30 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Citation Source Context — Page {citation.page_number}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans mb-1">
            <span>Chunk ID: #{citation.chunk_id}</span>
            <span>Page {citation.page_number}</span>
          </div>
          <p>{citation.text_snippet || citation.text}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
