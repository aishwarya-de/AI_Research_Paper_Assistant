import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getInsight } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { 
  Sparkles, 
  FileText, 
  Search, 
  Lightbulb, 
  GraduationCap, 
  Compass, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  UploadCloud,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Insights({ activeDoc }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [insightsCache, setInsightsCache] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'summary', label: 'Executive Summary', icon: FileText, color: 'text-indigo-400' },
    { id: 'key-points', label: 'Key Points', icon: Sparkles, color: 'text-purple-400' },
    { id: 'research-gaps', label: 'Research Gaps', icon: Search, color: 'text-pink-400' },
    { id: 'future-scope', label: 'Future Scope', icon: Compass, color: 'text-sky-400' },
    { id: 'project-ideas', label: 'Project Ideas', icon: Lightbulb, color: 'text-amber-400' },
    { id: 'viva', label: 'Viva Questions', icon: GraduationCap, color: 'text-emerald-400' },
  ];

  // Fetch insight on tab click or doc change
  const fetchInsightForTab = async (tabId) => {
    if (!activeDoc) return;
    if (insightsCache[tabId]) return; // Already cached

    setLoadingMap((prev) => ({ ...prev, [tabId]: true }));
    setErrorMap((prev) => ({ ...prev, [tabId]: null }));

    try {
      const data = await getInsight(activeDoc.doc_id, tabId);
      setInsightsCache((prev) => ({ ...prev, [tabId]: data.content }));
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [tabId]: err.message || 'Failed to generate insight.' }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [tabId]: false }));
    }
  };

  useEffect(() => {
    if (activeDoc) {
      fetchInsightForTab(activeTab);
    }
  }, [activeTab, activeDoc]);

  const handleCopy = () => {
    const text = insightsCache[activeTab];
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = insightsCache[activeTab];
    if (!text) return;

    const currentTab = tabs.find((t) => t.id === activeTab);
    const filename = `${activeDoc?.filename || 'Paper'}_${currentTab?.label.replace(/\s+/g, '_')}.md`;
    
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!activeDoc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">No Research Paper Uploaded</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Please upload a research paper to generate AI summaries, key points, research gaps, project ideas, and viva exam questions.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Research Paper
        </Link>
      </div>
    );
  }

  const currentTabObj = tabs.find((t) => t.id === activeTab);
  const isTabLoading = loadingMap[activeTab];
  const tabError = errorMap[activeTab];
  const currentContent = insightsCache[activeTab];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-heading">AI Research Insights</h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyzing paper: <span className="text-indigo-300 font-semibold">{activeDoc.filename}</span>
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!currentContent || isTabLoading}
            className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!currentContent || isTabLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>
      </div>

      {/* Insight Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                  : 'glass-card text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Insight Display Card */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 min-h-[400px] space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {currentTabObj && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <currentTabObj.icon className={`w-5 h-5 ${currentTabObj.color}`} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-100">{currentTabObj?.label}</h2>
              <p className="text-xs text-slate-400">Automated Gemini 2.5 Flash Academic Analysis</p>
            </div>
          </div>

          <button
            onClick={() => {
              setInsightsCache((prev) => ({ ...prev, [activeTab]: null }));
              fetchInsightForTab(activeTab);
            }}
            disabled={isTabLoading}
            className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-colors"
            title="Regenerate Insight"
          >
            <RefreshCw className={`w-4 h-4 ${isTabLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content area */}
        {isTabLoading ? (
          <div className="space-y-4 py-8">
            <div className="flex items-center gap-3 text-indigo-400 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing research paper and synthesizing {currentTabObj?.label}...</span>
            </div>
            {/* Skeleton loaders */}
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-slate-900 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-900 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-slate-900 rounded-lg w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-900 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
        ) : tabError ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{tabError}</span>
          </div>
        ) : currentContent ? (
          <MarkdownRenderer content={currentContent} />
        ) : null}
      </motion.div>

    </div>
  );
}
