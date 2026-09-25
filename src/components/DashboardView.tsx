import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  Target,
  MessageSquareCode,
  MapPin,
  Zap,
  ShieldCheck,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  FileText
} from 'lucide-react';
import { ActiveTab, FullAnalysisReport, SubScore } from '../types';

interface DashboardViewProps {
  report: FullAnalysisReport;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ report, setActiveTab }) => {
  const [expandedScoreKey, setExpandedScoreKey] = useState<string | null>(null);

  const toggleSubScore = (key: string) => {
    setExpandedScoreKey(expandedScoreKey === key ? null : key);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: '#059669' };
    if (score >= 60) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', fill: '#4f46e5' };
    if (score >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: '#d97706' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', fill: '#e11d48' };
  };

  const overallColor = getScoreColor(report.atsScore.overall);
  const matchColor = getScoreColor(report.matchPercentage);

  const subScores: { key: string; data: SubScore }[] = [
    { key: 'skills', data: report.atsScore.skillsMatch },
    { key: 'keywords', data: report.atsScore.keywordRelevance },
    { key: 'experience', data: report.atsScore.experienceRelevance },
    { key: 'education', data: report.atsScore.educationMatch },
    { key: 'projects', data: report.atsScore.projectsAlignment },
    { key: 'structure', data: report.atsScore.resumeStructure },
    { key: 'readability', data: report.atsScore.readabilityFormatting },
  ];

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Analysis Dashboard
            </span>
            <span className="text-xs text-slate-400">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {report.targetRole}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            File analyzed: <span className="font-semibold text-slate-700">{report.resumeFileName}</span> • Candidate: <span className="font-semibold text-slate-700">{report.parsedResume.contact.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all active:scale-95"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Open Resume Doctor
          </button>
        </div>
      </div>

      {/* 4 MAIN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ATS Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ATS Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {report.atsScore.overall}
              </span>
              <span className="text-xs font-bold text-slate-400">/100</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700">
              {report.atsScore.overall >= 80 ? 'High Parsability' : report.atsScore.overall >= 60 ? 'Competitive Profile' : 'Needs Optimization'}
            </p>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-indigo-100 flex items-center justify-center font-black text-sm text-indigo-700">
            {report.atsScore.overall}%
          </div>
        </div>

        {/* Card 2: Job Match */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Match
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {report.matchPercentage}%
              </span>
            </div>
            <p className="text-[11px] font-semibold text-indigo-600">
              {report.matchedSkills.length} exact + {report.partialSkills.length} partial
            </p>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-emerald-100 flex items-center justify-center font-black text-sm text-emerald-700">
            {report.matchPercentage}%
          </div>
        </div>

        {/* Card 3: Skills Found */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Skills Detected
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {report.parsedResume.skills.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">verified</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">
              Across 400+ taxonomy entries
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Card 4: Missing Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Missing Skills
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-rose-600">
                {report.missingSkills.length}
              </span>
              <span className="text-xs font-semibold text-rose-400">gaps</span>
            </div>
            <p className="text-[11px] font-semibold text-rose-600">
              {report.skillGaps.filter(g => g.priority === 'HIGH').length} High Priority
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-bold text-lg">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>

      {/* QUICK WORKFLOW JUMP BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('doctor')}
          className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-2xs text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Resume Doctor</p>
            <p className="text-[10px] text-slate-500">XYZ rewrites & fixes</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('skill-gap')}
          className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-2xs text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Skill Gap Engine</p>
            <p className="text-[10px] text-slate-500">{report.skillGaps.length} categorized gaps</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-2xs text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Interview Prep</p>
            <p className="text-[10px] text-slate-500">STAR guidance & Q&A</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-2xs text-left transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Career Roadmap</p>
            <p className="text-[10px] text-slate-500">6-week milestones</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('what-if')}
          className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-2xs text-left transition-all col-span-2 md:col-span-1"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">What If? Sandbox</p>
            <p className="text-[10px] text-slate-500">Simulate skill additions</p>
          </div>
        </button>
      </div>

      {/* TWO COLUMN GRID: LEFT = TRANSPARENT SCORING BREAKDOWN; RIGHT = SKILLS MATRIX & RESPONSIBLE AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Transparent ATS Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Transparent ATS Score Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explainable algorithmic weighted audit across 7 core dimensions.
                </p>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                Overall: {report.atsScore.overall}/100
              </span>
            </div>

            <div className="space-y-3">
              {subScores.map(({ key, data }) => {
                const isExpanded = expandedScoreKey === key;
                const scoreColor = getScoreColor(data.score);

                return (
                  <div
                    key={key}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleSubScore(key)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all select-none"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800">{data.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Weight: {Math.round(data.weight * 100)}%
                            </span>
                            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${scoreColor.bg} ${scoreColor.text} border ${scoreColor.border}`}>
                              {data.score}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${data.score}%`,
                              backgroundColor: scoreColor.fill,
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-slate-400 pl-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded Explanation */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3 text-xs">
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {data.explanation}
                        </p>

                        {data.positiveFactors.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                              Positive Factors Detected:
                            </p>
                            <ul className="space-y-1">
                              {data.positiveFactors.map((f, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {data.improvementAreas.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                              Actionable Optimization:
                            </p>
                            <ul className="space-y-1">
                              {data.improvementAreas.map((imp, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Disclaimer banner */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{report.atsScore.disclaimer}</span>
            </div>
          </div>

          {/* RESUME SECTION HEALTH AUDIT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Resume Section Health & Schema
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Contact Info', ok: !!report.parsedResume.contact.email, detail: report.parsedResume.contact.email || 'Missing email' },
                { name: 'Summary', ok: !!report.parsedResume.summary, detail: report.parsedResume.summary ? `${report.parsedResume.summary.split(' ').length} words` : 'Missing' },
                { name: 'Experience', ok: report.parsedResume.experience.length > 0, detail: `${report.parsedResume.experience.length} roles found` },
                { name: 'Education', ok: report.parsedResume.education.length > 0, detail: `${report.parsedResume.education.length} degrees found` },
                { name: 'Technical Skills', ok: report.parsedResume.skills.length >= 5, detail: `${report.parsedResume.skills.length} skills listed` },
                { name: 'Projects', ok: report.parsedResume.projects.length > 0, detail: `${report.parsedResume.projects.length} projects documented` },
              ].map((sec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{sec.name}</span>
                    {sec.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{sec.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Matched vs Missing Skills & Responsible AI (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Matched & Missing Skills Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Job Matching Matrix
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {report.matchedSkills.length} Matched
              </span>
            </div>

            {/* Matched Skills */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Directly Matched Skills ({report.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {report.matchedSkills.length > 0 ? (
                  report.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No direct skills matched yet.</span>
                )}
              </div>
            </div>

            {/* Partial / Transferable Matches */}
            {report.partialSkills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Partial / Transferable Alignment ({report.partialSkills.length})
                </p>
                <div className="space-y-2">
                  {report.partialSkills.map((part, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                        <span>⚠ Has: {part.candidateSkill}</span>
                        <span>Requires: {part.requiredSkill}</span>
                      </div>
                      <p className="text-[11px] text-amber-800">{part.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Missing Skills ({report.missingSkills.length})
                </p>
                <button
                  onClick={() => setActiveTab('skill-gap')}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  View Learning Plans →
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.missingSkills.length > 0 ? (
                  report.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80"
                    >
                      ✗ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No missing skills detected!</span>
                )}
              </div>
            </div>

            {/* Keywords Match */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Domain Keyword Relevance
              </p>
              <div className="flex flex-wrap gap-1.5">
                {report.matchedKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800">
                    {kw}
                  </span>
                ))}
                {report.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400 line-through">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RESPONSIBLE AI AUDIT CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Responsible AI & Bias Guardrails
              </h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                report.responsibleAi.passesAudit
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {report.responsibleAi.passesAudit ? 'Audit Passed (100%)' : 'Personal Details Flagged'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {report.responsibleAi.fairHiringNotice}
            </p>

            {report.responsibleAi.flaggedItems.length > 0 ? (
              <div className="space-y-2 pt-1">
                {report.responsibleAi.flaggedItems.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span>Category: {flag.category}</span>
                      <span className="text-[10px] uppercase font-semibold text-amber-700">{flag.severity}</span>
                    </div>
                    <p className="text-amber-800">Detected: "{flag.detectedSnippet}"</p>
                    <p className="text-[11px] text-amber-900 font-medium">{flag.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero biasing personal characteristics detected (no age, gender, photo, or marital status disclosures). Candidate is evaluated purely on merit.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
