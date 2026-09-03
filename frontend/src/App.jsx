import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ResearchAssistant from './pages/ResearchAssistant';
import About from './pages/About';
import api from './services/api';

export default function App() {
  const [currentDoc, setCurrentDoc] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);

  // Poll health and active document status
  const checkBackendStatus = async () => {
    try {
      const health = await api.checkHealth();
      setBackendHealthy(health.status === 'healthy');

      const doc = await api.getDocumentStatus();
      setCurrentDoc(doc);
    } catch (err) {
      setBackendHealthy(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (data) => {
    setCurrentDoc({
      filename: data.filename,
      pages: data.pages,
      chunks: data.chunks,
      words: data.words,
      is_loaded: true,
    });
  };

  const handleResetDoc = async () => {
    try {
      await api.resetDocument();
      setCurrentDoc({ is_loaded: false });
    } catch (err) {
      console.error('Failed to reset document:', err);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar
          activeDoc={currentDoc}
          backendHealthy={backendHealthy}
          onResetDoc={handleResetDoc}
        />

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  currentDoc={currentDoc}
                  onUploadSuccess={handleUploadSuccess}
                />
              }
            />
            <Route
              path="/assistant"
              element={
                <ResearchAssistant
                  currentDoc={currentDoc}
                  onUploadSuccess={handleUploadSuccess}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
          <p>
            AI Research Paper Assistant • Built with React, Tailwind CSS, FastAPI, and Google Gemini
          </p>
        </footer>
      </div>
    </Router>
  );
}
