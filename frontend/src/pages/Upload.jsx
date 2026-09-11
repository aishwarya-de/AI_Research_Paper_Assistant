import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { uploadPDF } from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  Layers,
  FileCheck
} from 'lucide-react';

export default function Upload({ setActiveDoc }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setError(null);
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rej = rejectedFiles[0];
      if (rej.file.size > 15 * 1024 * 1024) {
        setError('File size exceeds the 15MB limit. Please upload a smaller PDF paper.');
      } else {
        setError('Invalid file type. Please upload a valid PDF document (.pdf).');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      handleUpload(selected);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
  });

  const handleUpload = async (selectedFile) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Uploading PDF research paper...');

      const result = await uploadPDF(selectedFile, (percent) => {
        setProgress(Math.min(percent, 80));
        if (percent >= 80) {
          setStatusText('Extracting text & generating FAISS vector index...');
        }
      });

      setProgress(100);
      setStatusText('Indexing complete!');
      setUploadSuccess(result);
      
      // Update global active document
      setActiveDoc({
        doc_id: result.doc_id,
        filename: result.filename,
        total_pages: result.total_pages,
        total_chunks: result.total_chunks,
      });

    } catch (err) {
      setError(err.message || 'Failed to upload and process PDF.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-heading">Upload Research Paper</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Upload any PDF paper (up to 15MB). We extract the text, build a local FAISS vector index, and prepare RAG grounded chat.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      {!uploadSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div
            {...getRootProps()}
            className={`glass-panel p-10 sm:p-14 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/40'
            }`}
          >
            <input {...getInputProps()} />

            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
              {loading ? (
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
              ) : (
                <UploadCloud className="w-10 h-10 group-hover:scale-110 transition-transform" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-100">
                {isDragActive ? 'Drop your research paper here...' : 'Drag & drop your PDF paper here'}
              </p>
              <p className="text-xs text-slate-400">or click to browse your files (PDF format, max 15MB)</p>
            </div>

            {/* Status & Progress Bar */}
            {loading && (
              <div className="w-full max-w-md space-y-2 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{statusText}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      ) : (
        /* Upload Success Summary Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{uploadSuccess.filename}</h2>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-2 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Paper Indexed & Ready for Analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400">Document ID</span>
              <p className="font-mono text-sm font-bold text-indigo-300 mt-1">{uploadSuccess.doc_id}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400">Total Pages</span>
              <p className="font-sans text-sm font-bold text-purple-300 mt-1">{uploadSuccess.total_pages} Pages</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400">Vector Chunks</span>
              <p className="font-sans text-sm font-bold text-sky-300 mt-1">{uploadSuccess.total_chunks} Chunks</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Start Grounded Chat
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="flex-1 px-6 py-3.5 rounded-xl glass-card border border-indigo-500/40 text-indigo-300 font-bold text-sm hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Generate AI Insights
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
