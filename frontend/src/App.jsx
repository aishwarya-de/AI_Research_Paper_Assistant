import React, { useEffect, useState } from 'react';
import { getHealth } from './services/api';
import { Activity, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        setLoading(true);
        const data = await getHealth();
        setHealthStatus(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to connect to FastAPI backend');
      } finally {
        setLoading(false);
      }
    }
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Activity className="w-8 h-8 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold gradient-heading">AI Research Paper Assistant 2.0</h1>
          <p className="text-sm text-slate-400">Phase 1 Scaffolding & System Health Check</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-left text-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Backend Connection:</span>
            {loading ? (
              <span className="inline-flex items-center text-amber-400 gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" /> Checking...
              </span>
            ) : error ? (
              <span className="inline-flex items-center text-rose-400 gap-1.5 font-semibold">
                <XCircle className="w-4 h-4" /> Disconnected
              </span>
            ) : (
              <span className="inline-flex items-center text-emerald-400 gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
            )}
          </div>

          {healthStatus && (
            <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
              <p><span className="text-slate-500">Status:</span> {healthStatus.status}</p>
              <p><span className="text-slate-500">Version:</span> {healthStatus.version}</p>
              <p><span className="text-slate-500">Message:</span> {healthStatus.message}</p>
            </div>
          )}

          {error && (
            <div className="pt-2 border-t border-slate-800 text-xs text-rose-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
