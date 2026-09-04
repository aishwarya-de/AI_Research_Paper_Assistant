import React, { useState, useEffect } from 'react';
import {
  FileText,
  Star,
  Search,
  Lightbulb,
  GraduationCap,
  MessageSquare,
  Sparkles,
  UploadCloud,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SummaryCard from '../components/SummaryCard';
import KeyPoints from '../components/KeyPoints';
import ResearchGaps from '../components/ResearchGaps';
import ProjectIdeas from '../components/ProjectIdeas';
import VivaQuestions from '../components/VivaQuestions';
import ChatWindow from '../components/ChatWindow';
import FileUpload from '../components/FileUpload';
import api from '../services/api';

export default function ResearchAssistant({ currentDoc, onUploadSuccess }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Stored analysis data
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [researchGaps, setResearchGaps] = useState('');
  const [projectIdeas, setProjectIdeas] = useState('');
  const [vivaQuestions, setVivaQuestions] = useState('');

  // Loading states
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingKeyPoints, setLoadingKeyPoints] = useState(false);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingViva, setLoadingViva] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  // Trigger handlers
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.getSummary();
      setSummary(res.summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to generate summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateKeyPoints = async () => {
    setLoadingKeyPoints(true);
    try {
      const res = await api.getKeyPoints();
      setKeyPoints(res.key_points);
    } catch (err) {
      console.error('Failed to generate key points:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to generate key points');
    } finally {
      setLoadingKeyPoints(false);
    }
  };

  const handleGenerateGaps = async () => {
    setLoadingGaps(true);
    try {
      const res = await api.getResearchGaps();
      setResearchGaps(res.research_gaps);
    } catch (err) {
      console.error('Failed to generate gaps:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to generate research gaps');
    } finally {
      setLoadingGaps(false);
    }
  };

  const handleGenerateProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.getProjectIdeas();
      setProjectIdeas(res.project_ideas);
    } catch (err) {
      console.error('Failed to generate project ideas:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to generate project ideas');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleGenerateViva = async () => {
    setLoadingViva(true);
    try {
      const res = await api.getVivaQuestions();
      setVivaQuestions(res.viva_questions);
    } catch (err) {
      console.error('Failed to generate viva questions:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to generate viva questions');
    } finally {
      setLoadingViva(false);
    }
  };

  const handleGenerateAll = async () => {
    setLoadingAll(true);
    await Promise.allSettled([
      handleGenerateSummary(),
      handleGenerateKeyPoints(),
      handleGenerateGaps(),
      handleGenerateProjects(),
      handleGenerateViva(),
    ]);
    setLoadingAll(false);
  };

  const handleUploadDone = (data) => {
    if (onUploadSuccess) onUploadSuccess(data);
    setShowUploadModal(false);
    // Reset previously generated sections for new paper
    setSummary('');
    setKeyPoints('');
    setResearchGaps('');
    setProjectIdeas('');
    setVivaQuestions('');
  };

  return (
    <div className="min-h-[calc(100vh-70px)] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Upload New Paper Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">Upload Research Paper</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>
            <FileUpload onUploadSuccess={handleUploadDone} currentDoc={currentDoc} />
          </div>
        </div>
      )}

      {/* Top Banner if no document is loaded */}
      {!currentDoc?.is_loaded ? (
        <div className="text-center py-16 space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">No Research Paper Loaded</h2>
            <p className="text-sm text-slate-400">
              Please upload an academic PDF to enable summary generation, gap discovery, viva questions, and RAG chat.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <FileUpload onUploadSuccess={handleUploadDone} currentDoc={currentDoc} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-800/80">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Research Analysis Suite</h1>
              <p className="text-xs text-slate-400">
                Viewing analysis for:{' '}
                <span className="text-indigo-400 font-semibold">{currentDoc.filename}</span>
              </p>
            </div>

            <button
              onClick={handleGenerateAll}
              disabled={loadingAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              {loadingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{loadingAll ? 'Analyzing Everything...' : 'Synthesize All Insights'}</span>
            </button>
          </div>

          {/* Main Layout: Sidebar + Content Area */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentDoc={currentDoc}
              onUploadNew={() => setShowUploadModal(true)}
            />

            {/* Dynamic Content Pane */}
            <main className="flex-1 w-full min-w-0">
              {activeTab === 'summary' && (
                <SummaryCard
                  summary={summary}
                  loading={loadingSummary}
                  onGenerate={handleGenerateSummary}
                />
              )}

              {activeTab === 'keypoints' && (
                <KeyPoints
                  keyPoints={keyPoints}
                  loading={loadingKeyPoints}
                  onGenerate={handleGenerateKeyPoints}
                />
              )}

              {activeTab === 'gaps' && (
                <ResearchGaps
                  researchGaps={researchGaps}
                  loading={loadingGaps}
                  onGenerate={handleGenerateGaps}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectIdeas
                  projectIdeas={projectIdeas}
                  loading={loadingProjects}
                  onGenerate={handleGenerateProjects}
                />
              )}

              {activeTab === 'viva' && (
                <VivaQuestions
                  vivaQuestions={vivaQuestions}
                  loading={loadingViva}
                  onGenerate={handleGenerateViva}
                />
              )}

              {activeTab === 'chat' && (
                <ChatWindow
                  paperLoaded={currentDoc.is_loaded}
                  paperName={currentDoc.filename}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
