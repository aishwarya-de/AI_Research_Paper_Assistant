import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, UploadCloud, MessageSquare, Sparkles, Info, FileText } from 'lucide-react';

export default function Navbar({ activeDoc }) {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: BookOpen },
    { name: 'Upload Paper', path: '/upload', icon: UploadCloud },
    { name: 'Chat (RAG)', path: '/chat', icon: MessageSquare, badge: activeDoc ? 'Active' : null },
    { name: 'AI Insights', path: '/insights', icon: Sparkles },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight gradient-heading">
              PaperMind <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">2.0</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase">AI Research Assistant</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.name}
                {link.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Active Document Indicator */}
        <div className="flex items-center gap-3">
          {activeDoc ? (
            <Link
              to="/chat"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="max-w-[120px] truncate">{activeDoc.filename}</span>
            </Link>
          ) : (
            <Link
              to="/upload"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload PDF
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
