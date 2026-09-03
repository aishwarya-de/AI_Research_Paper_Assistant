import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function FileUpload({ onUploadSuccess, currentDoc }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    setErrorMessage('');
    setUploadResult(null);

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF file (*.pdf).');
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50MB limit.');
      return;
    }

    setSelectedFile(file);
    startUpload(file);
  };

  const startUpload = async (file) => {
    setIsProcessing(true);
    setUploadProgress(10);
    setStatusMessage('Uploading PDF...');
    setErrorMessage('');

    try {
      // Step 1: Upload and trigger backend extraction & FAISS indexing
      const data = await api.uploadPDF(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 50) / progressEvent.total);
          setUploadProgress(percent);
          if (percent >= 50) {
            setStatusMessage('Extracting text & building FAISS vector index...');
          }
        }
      });

      setUploadProgress(100);
      setStatusMessage('Processed successfully!');
      setUploadResult(data);

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Failed to process research paper. Please ensure the backend is running.';
      setErrorMessage(detail);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none overflow-hidden ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        } ${isProcessing ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/20 via-blue-600/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-indigo-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-slate-100">
              {isProcessing ? 'Processing Research Paper' : 'Upload Research Paper'}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Drag & drop your PDF here, or <span className="text-indigo-400 underline">browse files</span>.
            </p>
            <p className="text-xs text-slate-500">Supports standard academic PDFs up to 50MB</p>
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="w-full max-w-md mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{statusMessage}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Error</p>
            <p className="text-xs text-rose-300/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success details card */}
      {(uploadResult || currentDoc?.is_loaded) && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {uploadResult?.filename || currentDoc?.filename}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>Pages: <strong className="text-slate-200">{uploadResult?.pages ?? currentDoc?.pages}</strong></span>
                <span>•</span>
                <span>Indexed Chunks: <strong className="text-slate-200">{uploadResult?.chunks ?? currentDoc?.chunks}</strong></span>
                {(uploadResult?.words || currentDoc?.words) && (
                  <>
                    <span>•</span>
                    <span>Words: <strong className="text-slate-200">{uploadResult?.words ?? currentDoc?.words}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            FAISS RAG Ready
          </div>
        </div>
      )}
    </div>
  );
}
