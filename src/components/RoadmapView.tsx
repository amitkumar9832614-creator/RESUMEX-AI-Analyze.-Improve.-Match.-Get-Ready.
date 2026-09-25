import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Code2,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { FullAnalysisReport, RoadmapWeek } from '../types';

interface RoadmapViewProps {
  report: FullAnalysisReport;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ report }) => {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);

  const toggleWeekCompleted = (weekNum: number) => {
    setCompletedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const progressPercent = Math.round(
    (completedWeeks.length / (report.careerRoadmap.weeks.length || 1)) * 100
  );

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <MapPin className="w-3.5 h-3.5" />
              Career Acceleration Roadmap
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              6-Week Skill-Gap Bridge for {report.targetRole}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              A structured, hands-on learning roadmap engineered to close your detected deficits in{' '}
              <span className="font-semibold text-slate-800">
                {report.skillGaps.slice(0, 3).map((g) => g.skill).join(', ') || 'core technologies'}
              </span>.
            </p>
          </div>

          {/* Progress Tracker Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[200px] text-center space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Roadmap Progress</span>
              <span className="text-indigo-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {completedWeeks.length} of {report.careerRoadmap.weeks.length} milestones complete
            </p>
          </div>
        </div>

        {/* Target Milestones Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-100 mt-6">
          {report.careerRoadmap.targetMilestones.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800 block mb-1">🏁 Milestone {idx + 1}</span>
              <p className="text-slate-600 text-[11px]">{m}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY TIMELINE CARDS */}
      <div className="space-y-6">
        {report.careerRoadmap.weeks.map((week) => {
          const isDone = completedWeeks.includes(week.weekNumber);

          return (
            <div
              key={week.weekNumber}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isDone
                  ? 'border-emerald-300 shadow-xs bg-emerald-50/10'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Header Bar */}
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => toggleWeekCompleted(week.weekNumber)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : `W${week.weekNumber}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{week.title}</h2>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Focus: {week.focusArea}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{week.estimatedHours} hrs</span>
                  </div>

                  <button
                    onClick={() => toggleWeekCompleted(week.weekNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {isDone ? 'Mark Incomplete' : 'Mark as Done'}
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-5">
                {/* Skills Targeted */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-slate-700">Target Competencies:</span>
                  {week.skillsTargeted.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Objectives */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Learning Objectives & Topics:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {week.learningObjectives.map((obj, oIdx) => (
                      <li
                        key={oIdx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverable Project & Checkpoint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1 text-xs">
                    <p className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      Weekly Hands-On Project:
                    </p>
                    <p className="text-slate-200 leading-relaxed">{week.handsOnProject}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Verification Deliverable:
                    </p>
                    <p className="text-emerald-800 leading-relaxed font-medium">
                      {week.checkpointDeliverable}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
