import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  BarChart3,
  FileText,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { ActiveTab, FullAnalysisReport } from '../types';

interface SavedAnalysesViewProps {
  onSelectAnalysis: (report: FullAnalysisReport) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SavedAnalysesView: React.FC<SavedAnalysesViewProps> = ({
  onSelectAnalysis,
  setActiveTab,
}) => {
  const [analyses, setAnalyses] = useState<FullAnalysisReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadList = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSavedAnalyses();
      setAnalyses(data);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      setDeleteError('Failed to delete report.');
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <History className="w-3.5 h-3.5" />
            Resume History & Archives
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Saved Analysis Reports
          </h1>
          <p className="text-xs text-slate-500">
            Compare multiple resume iterations and target roles over time.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('upload')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          New Analysis
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading saved analyses...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">No Saved Analyses Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't run any resume analyses yet. Upload a resume or launch the competition demo to get started.
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()} at{' '}
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.targetRole}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  File: {item.resumeFileName} • Candidate: {item.parsedResume.contact.name}
                </p>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-base font-black text-slate-900">{item.atsScore.overall}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">ATS Score</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-base font-black text-emerald-600">{item.matchPercentage}%</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Job Match</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <p className="text-base font-black text-indigo-600">{item.matchedSkills.length}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Skills Matched</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-bold text-indigo-600">
                <span>Open Full Intelligence Report</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
