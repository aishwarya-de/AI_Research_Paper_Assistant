import React from 'react';
import {
  FileText,
  Star,
  Search,
  Lightbulb,
  GraduationCap,
  MessageSquare,
  UploadCloud,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentDoc,
  onUploadNew
}) {
  const navItems = [
    { id: 'summary', label: 'Summary', icon: FileText, color: 'text-indigo-400' },
    { id: 'keypoints', label: 'Key Points', icon: Star, color: 'text-amber-400' },
    { id: 'gaps', label: 'Research Gaps', icon: Search, color: 'text-cyan-400' },
    { id: 'projects', label: 'Project Ideas', icon: Lightbulb, color: 'text-purple-400' },
    { id: 'viva', label: 'Viva Questions', icon: GraduationCap, color: 'text-emerald-400' },
    { id: 'chat', label: 'Chat Assistant', icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between shadow-xl backdrop-blur-sm">
      <div className="space-y-4">
        {/* Active Paper Header Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Paper</span>
          </div>
          {currentDoc?.is_loaded ? (
            <div>
              <p className="text-sm font-medium text-slate-200 truncate" title={currentDoc.filename}>
                {currentDoc.filename}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {currentDoc.pages} {currentDoc.pages === 1 ? 'page' : 'pages'}
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {currentDoc.chunks} chunks
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No paper loaded</p>
          )}

          <button
            onClick={onUploadNew}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload New Paper</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">
            Analysis Views
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 mt-6 text-center">
        <p className="text-[11px] text-slate-500">
          Powered by <span className="text-slate-400 font-medium">Google Gemini</span> &amp; <span className="text-slate-400 font-medium">FAISS RAG</span>
        </p>
      </div>
    </aside>
  );
}
