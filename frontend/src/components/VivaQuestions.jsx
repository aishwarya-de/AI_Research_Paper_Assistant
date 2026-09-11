import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GraduationCap, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';

export default function VivaQuestions({ vivaQuestions, loading, onGenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!vivaQuestions) return;
    navigator.clipboard.writeText(vivaQuestions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Viva & Defense Questions</h2>
            <p className="text-xs text-slate-400">Oral examination questions with model answers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {vivaQuestions && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{vivaQuestions ? 'Regenerate' : 'Generate Viva Questions'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm text-slate-400">Crafting professor-level viva questions and model answers...</p>
          </div>
        ) : vivaQuestions ? (
          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{vivaQuestions}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <p className="text-sm">No viva questions generated yet.</p>
            <p className="text-xs">Click the button above to generate viva and interview prep questions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
