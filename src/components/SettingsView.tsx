import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  FileCode,
  Sparkles,
  Info
} from 'lucide-react';
import { FullAnalysisReport, UserAccount } from '../types';

interface SettingsViewProps {
  currentReport: FullAnalysisReport | null;
  onClearSession: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentReport, onClearSession }) => {
  const [candidateName, setCandidateName] = useState(
    currentReport?.parsedResume.contact.name || 'Alex Rivera'
  );
  const [preferredRole, setPreferredRole] = useState(
    currentReport?.targetRole || 'Full-Stack Software Engineer'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJSON = () => {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RESUMEX_Analysis_${currentReport.targetRole.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Candidate Profile & System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your defaults, view responsible AI data handling preferences, and export analysis JSON schemas.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Candidate Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Default Target Role</label>
              <input
                type="text"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="mt-1 w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
            >
              {isSaved ? 'Preferences Saved!' : 'Save Preferences'}
            </button>

            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Data Export & Privacy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Responsible AI & Data Retention</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          RESUMEX AI processes resumes ephemeral in-memory without persistent training retention. Raw files are not shared with external advertising or scraping brokers.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {currentReport && (
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              Export Full Analysis (JSON)
            </button>
          )}

          <button
            type="button"
            onClick={onClearSession}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Current Analysis Session
          </button>
        </div>
      </div>
    </div>
  );
};
