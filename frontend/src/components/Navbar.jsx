import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, FileText, Activity, RefreshCw } from 'lucide-react';

export default function Navbar({ activeDoc, backendHealthy, onResetDoc }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ScholarAI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gemini RAG
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Research Paper Assistant</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/assistant"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              location.pathname === '/assistant'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Assistant
          </Link>
          <Link
            to="/about"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/about'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3">
          {activeDoc?.is_loaded && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
              <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs font-medium text-slate-300 max-w-[150px] truncate" title={activeDoc.filename}>
                {activeDoc.filename}
              </span>
              <span className="text-[11px] text-slate-500">
                ({activeDoc.pages}p • {activeDoc.chunks}c)
              </span>
              {onResetDoc && (
                <button
                  onClick={onResetDoc}
                  title="Unload active paper"
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Backend Status indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800"
            title={backendHealthy ? "FastAPI Backend Connected" : "Backend Disconnected"}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              {backendHealthy ? 'FastAPI Online' : 'API Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
