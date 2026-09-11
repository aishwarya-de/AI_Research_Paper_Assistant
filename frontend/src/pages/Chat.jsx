import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendChatMessage } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CitationModal from '../components/CitationModal';
import { 
  Send, 
  Bot, 
  User, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Loader2, 
  HelpCircle, 
  Bookmark,
  RefreshCw
} from 'lucide-react';

export default function Chat({ activeDoc }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: activeDoc
        ? `Hello! I have loaded and indexed **"${activeDoc.filename}"** (${activeDoc.total_pages} pages, ${activeDoc.total_chunks} chunks).\n\nAsk me any question about the paper's methodology, baselines, results, or limitations!`
        : 'Welcome! Please upload a PDF research paper first to start asking questions.',
      citations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'What is the core problem and proposed methodology?',
    'What datasets and baseline models were evaluated?',
    'Summarize the primary experimental results and key metrics.',
    'What limitations or edge cases are acknowledged by the authors?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q || loading || !activeDoc) return;

    // Append user message
    const newMessages = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(activeDoc.doc_id, q);
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: response.answer,
          citations: response.citations || [],
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: `❌ **Error querying paper**: ${err.message || 'Server error'}`,
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Header Info Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-sm">
              {activeDoc ? activeDoc.filename : 'No Paper Loaded'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeDoc ? `${activeDoc.total_pages} Pages • ${activeDoc.total_chunks} FAISS Chunks Indexed` : 'Upload a paper to begin'}
            </p>
          </div>
        </div>

        <div>
          <Link
            to="/upload"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-card border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            {activeDoc ? 'Change Paper' : 'Upload PDF'}
          </Link>
        </div>
      </div>

      {/* Main Chat Thread Container */}
      <div className="flex-1 glass-panel rounded-3xl border border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-6 flex flex-col">
        
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-slate-900 border border-indigo-500/30 text-indigo-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'glass-card border border-slate-800 text-slate-100'
              }`}
            >
              <MarkdownRenderer content={msg.text} />

              {/* Citations List Footer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-indigo-400" /> Cited Paper Sources ({msg.citations.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCitation(cit)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-indigo-500/20 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 flex items-center gap-1.5 transition-all"
                      >
                        <span className="text-indigo-400 font-bold">Page {cit.page_number}</span>
                        <span className="text-slate-500">Chunk #{cit.chunk_id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 text-indigo-400 text-xs font-medium pl-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching vector index & generating grounded answer with Gemini...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (Chips) */}
      {activeDoc && (
        <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full glass-card border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-2 flex items-center gap-3 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeDoc ? "Ask any question about the paper..." : "Upload a paper to ask questions..."}
          disabled={!activeDoc || loading}
          className="flex-1 px-5 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!activeDoc || !input.trim() || loading}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>

      {/* Citation Popover Modal */}
      <CitationModal citation={selectedCitation} onClose={() => setSelectedCitation(null)} />

    </div>
  );
}
