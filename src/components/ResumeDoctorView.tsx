import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { FullAnalysisReport, ResumeDoctorSection } from '../types';

interface ResumeDoctorViewProps {
  report: FullAnalysisReport;
}

export const ResumeDoctorView: React.FC<ResumeDoctorViewProps> = ({ report }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Stethoscope className="w-3.5 h-3.5" />
              AI Resume Doctor Diagnostics
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Section-by-Section Precision Rewrites
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Transform weak descriptions into high-impact Google XYZ achievement statements. Grounded in your real experience with zero fabricated metrics or hallucinated history.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-xs space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Strict Factual Guardrails
            </p>
            <p className="text-[11px] text-slate-500">
              AI recommendations preserve your authentic company history, genuine degrees, and validated skills.
            </p>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {report.resumeDoctor.map((section, idx) => (
          <div
            key={section.id || idx}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Section Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{section.sectionName}</h2>
                  <p className="text-xs text-slate-500">
                    Health Status:{' '}
                    <span
                      className={`font-bold ${
                        section.healthStatus === 'optimal'
                          ? 'text-emerald-600'
                          : section.healthStatus === 'critical'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {section.healthStatus === 'optimal'
                        ? 'Optimal'
                        : section.healthStatus === 'critical'
                        ? 'Critical Missing / Deficient'
                        : 'Improvement Recommended'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(section.id, section.suggestedImprovement)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all self-start sm:self-center"
              >
                {copiedId === section.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Suggestion
                  </>
                )}
              </button>
            </div>

            {/* Critique & Recommendation */}
            <div className="p-5 bg-amber-50/40 border-b border-slate-100 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">Expert Diagnostic: </span>
                  <span className="text-amber-800">{section.critique}</span>
                </div>
              </div>

              {section.recommendations && (
                <div className="flex flex-wrap gap-2 pt-1 pl-6">
                  {section.recommendations.map((rec, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-amber-200 text-amber-900 shadow-2xs"
                    >
                      💡 {rec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Before vs After Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* BEFORE */}
              <div className="p-5 space-y-2 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Before (Current Resume Content)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Original</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {section.currentSnippet}
                </div>
              </div>

              {/* SUGGESTED IMPROVEMENT */}
              <div className="p-5 space-y-2 bg-indigo-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Suggested Improvement (AI Doctor)
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    High ATS Yield
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-indigo-200 font-sans text-xs font-medium text-slate-900 whitespace-pre-wrap leading-relaxed shadow-2xs">
                  {section.suggestedImprovement}
                </div>
              </div>
            </div>

            {/* Bullet Point Detailed Breakdown (if available) */}
            {section.bulletImprovements && section.bulletImprovements.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
                <p className="text-xs font-bold text-slate-800">
                  Google XYZ Formula Transformation:
                </p>
                {section.bulletImprovements.map((b, bIdx) => (
                  <div key={bIdx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Passive:</span>
                        <p className="text-slate-600 mt-0.5 italic">{b.before}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600">Action + Metric:</span>
                        <p className="text-slate-900 font-semibold mt-0.5">{b.after}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Action Verb: {b.actionVerbAdded}
                      </span>
                      <span>{b.rationale}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
