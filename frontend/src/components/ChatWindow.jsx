import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import api from '../services/api';

const SAMPLE_QUESTIONS = [
  'What is the primary objective of this research?',
  'Explain the methodology used in this paper.',
  'What were the key quantitative findings?',
  'What limitations do the authors discuss?',
];

export default function ChatWindow({ paperLoaded, paperName }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your AI Research Assistant. Ask me anything about your uploaded research paper, and I will answer grounded directly in the paper with cited context.',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionToSend) => {
    const question = (questionToSend || input).trim();
    if (!question || loading) return;

    if (!paperLoaded) {
      setErrorMessage('Please upload and process a research paper before asking questions.');
      return;
    }

    setErrorMessage('');
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(question);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.answer,
        sources: response.sources || [],
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat failed:', err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Failed to get answer. Please check if your Gemini API key is configured.';
      setErrorMessage(detail);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `⚠️ **Error:** ${detail}`,
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Chat history cleared. How else can I help you analyze this research paper?',
        sources: [],
      },
    ]);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col h-[750px] bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Chat with Research Paper</span>
              {paperName && (
                <span className="text-[11px] font-normal text-slate-400 truncate max-w-[200px]">
                  ({paperName})
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">Grounded FAISS RAG with Google Gemini</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Clear chat messages"
          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 w-fit">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs">Searching context & generating grounded answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts suggestions */}
      {paperLoaded && messages.length <= 2 && (
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/60">
          <p className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Suggested questions:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SAMPLE_QUESTIONS.map((sampleQ, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sampleQ)}
                disabled={loading}
                className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex-shrink-0"
              >
                {sampleQ}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        {errorMessage && (
          <div className="mb-2 text-xs text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              paperLoaded
                ? 'Ask anything about this research paper... (Enter to send)'
                : 'Upload a research paper first to chat...'
            }
            disabled={!paperLoaded || loading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition-all disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !paperLoaded || loading}
            className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/20 flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
