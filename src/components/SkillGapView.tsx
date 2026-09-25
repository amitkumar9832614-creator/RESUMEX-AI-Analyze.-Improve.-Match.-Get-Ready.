import React, { useState } from 'react';
import {
  Target,
  AlertCircle,
  Clock,
  Layers,
  Code2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { FullAnalysisReport, SkillGap } from '../types';

interface SkillGapViewProps {
  report: FullAnalysisReport;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ report }) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredGaps = report.skillGaps.filter((g) => {
    if (filter === 'ALL') return true;
    return g.priority === filter;
  });

  const highCount = report.skillGaps.filter(g => g.priority === 'HIGH').length;
  const medCount = report.skillGaps.filter(g => g.priority === 'MEDIUM').length;
  const lowCount = report.skillGaps.filter(g => g.priority === 'LOW').length;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              <Target className="w-3.5 h-3.5" />
              Skill Gap Intelligence
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Prioritized Skill-Gap Analysis
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Targeted diagnosis comparing your parsed skills against required and preferred specifications for{' '}
              <span className="font-semibold text-slate-800">{report.targetRole}</span>.
            </p>
          </div>

          {/* Quick counts */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <p className="text-lg font-black text-rose-700">{highCount}</p>
              <p className="text-[10px] font-bold text-rose-600 uppercase">High Priority</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-lg font-black text-amber-700">{medCount}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase">Medium</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-lg font-black text-emerald-700">{lowCount}</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Transferable</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-6 border-t border-slate-100 mt-6">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter Priority:</span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === p
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === 'ALL' ? `All (${report.skillGaps.length})` : `${p} (${report.skillGaps.filter(g => g.priority === p).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Gaps Cards List */}
      <div className="space-y-5">
        {filteredGaps.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No skill gaps in this priority level</h3>
            <p className="text-xs text-slate-500 mt-1">Your profile thoroughly satisfies these requirements.</p>
          </div>
        ) : (
          filteredGaps.map((gap) => {
            const isHigh = gap.priority === 'HIGH';
            const isMed = gap.priority === 'MEDIUM';

            return (
              <div
                key={gap.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isMed
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {gap.priority} Priority
                    </span>

                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">{gap.skill}</h2>
                      <span className="text-xs text-slate-400 font-medium">{gap.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{gap.estimatedTimeToLearn}</span>
                    </div>
                    <span className="h-3 w-px bg-slate-200" />
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {gap.estimatedDifficulty}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 space-y-4">
                  {/* Why it matters & Current evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-600" />
                        Why It Matters For This Role:
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {gap.whyItMatters}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Current Resume Evidence:
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {gap.currentEvidence}
                      </p>
                    </div>
                  </div>

                  {/* Recommended learning topics */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Learning Syllabus:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {gap.recommendedLearning.map((topic, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-indigo-950 font-medium"
                        >
                          <span className="text-indigo-600 font-bold mr-1">#{tIdx + 1}</span> {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested hands-on project */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-indigo-300">
                        <Code2 className="w-3.5 h-3.5" />
                        Suggested Proof-of-Concept Project:
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white">
                        Portfolio Proof
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {gap.suggestedProject}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
