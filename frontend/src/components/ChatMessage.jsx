import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, ChevronDown, ChevronUp, Layers, Copy, Check } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'} group mb-4`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 flex-shrink-0 shadow-md shadow-indigo-500/10 mt-1">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
          }`}
        >
          <div className="prose prose-invert max-w-none text-inherit text-sm sm:text-[15px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>

          {/* Copy button for AI response */}
          {!isUser && (
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                title="Copy answer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Source chunks accordion */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-2">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {sourcesOpen ? 'Hide' : 'View'} Retrieved Sources ({message.sources.length} chunks)
              </span>
              {sourcesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {sourcesOpen && (
              <div className="mt-2 space-y-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800 flex justify-between">
                  <span>Context Sources (FAISS Top-K)</span>
                  <span className="text-indigo-400">Grounding References</span>
                </div>
                {message.sources.map((source, idx) => (
                  <div key={idx} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-indigo-300">Chunk {source.chunk}</span>
                      {source.score !== undefined && (
                        <span className="text-slate-500">L2 Distance: {source.score}</span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-normal text-[12px] italic">
                      "{source.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 p-0.5 flex-shrink-0 flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-indigo-300" />
        </div>
      )}
    </div>
  );
}
