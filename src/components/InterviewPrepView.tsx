import React, { useState } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  ShieldCheck,
  Send
} from 'lucide-react';
import { FullAnalysisReport, InterviewQuestion } from '../types';

interface InterviewPrepViewProps {
  report: FullAnalysisReport;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({ report }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    report.interviewPrep.questions[0]?.id || null
  );
  const [userDrafts, setUserDrafts] = useState<Record<string, string>>({});

  const categories = ['All', 'Technical', 'Behavioral', 'Project-based', 'HR', 'Role-specific'];

  const filteredQuestions = report.interviewPrep.questions.filter((q) => {
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200">
              <MessageSquareCode className="w-3.5 h-3.5" />
              Tailored Interview Preparation
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized Interview Simulator
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Targeted technical, behavioral, and architectural questions crafted directly from your resume's recorded projects and detected target job criteria for{' '}
              <span className="font-semibold text-slate-800">{report.targetRole}</span>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-xs space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-violet-600" />
              STAR Method Framework
            </p>
            <p className="text-[11px] text-slate-500">
              Structure behavioral scenarios: Situation, Task, Action, and quantifiable Result.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-6 border-t border-slate-100 mt-6">
          <span className="text-xs font-bold text-slate-500 mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* STAR TIPS BANNER */}
      <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-white rounded-2xl border border-violet-200 p-5 shadow-xs">
        <h3 className="text-xs font-extrabold text-violet-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-violet-600" />
          The STAR Methodology for High-Impact Answers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {report.interviewPrep.starMethodTips.map((tip, i) => (
            <div key={i} className="p-3 rounded-xl bg-white border border-violet-100 shadow-2xs text-slate-700">
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* QUESTIONS ACCORDION LIST */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQuestionId === q.id;

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Question Bar */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-all select-none"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-violet-100 text-violet-800 border border-violet-200">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Difficulty: {q.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500 italic">
                      Context: {q.context}
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    "{q.question}"
                  </h2>
                </div>

                <div className="text-slate-400 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded Answer Guidance & Practice Mode */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/60 border-t border-slate-100 space-y-6">
                  {/* Why this is asked */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-900">What the Interviewer is Evaluating: </span>
                    <span className="text-indigo-800">{q.whyAsked}</span>
                  </div>

                  {/* Model Guidance */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      Model Answer Blueprint:
                    </p>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium shadow-2xs">
                      {q.modelGuidance}
                    </div>
                  </div>

                  {/* Key Points to Cover Checklist */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800">
                      High-Priority Points to Articulate:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {q.keyPointsToCover.map((pt, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-950 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Practice Scratchpad */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        Practice Your Draft Response (Saved in session)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {userDrafts[q.id]?.split(/\s+/).filter(Boolean).length || 0} words
                      </span>
                    </div>

                    <textarea
                      value={userDrafts[q.id] || ''}
                      onChange={(e) =>
                        setUserDrafts({ ...userDrafts, [q.id]: e.target.value })
                      }
                      rows={4}
                      placeholder="Draft your talking points here using the STAR formula..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preparation Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 text-center">
        {report.interviewPrep.preparationNotice}
      </div>
    </div>
  );
};
