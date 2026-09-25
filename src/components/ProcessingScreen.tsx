import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  FileSearch,
  Cpu,
  Brain,
  Layers,
  ShieldCheck,
  Target,
  Stethoscope,
  MessageSquareCode
} from 'lucide-react';

interface ProcessingScreenProps {
  onComplete?: () => void;
}

const PIPELINE_STEPS = [
  { label: 'Parsing document & extracting text stream', icon: FileSearch },
  { label: 'Detecting resume sections, contact schema, and timeline flow', icon: Layers },
  { label: 'Normalizing candidate skills across 400+ taxonomy aliases', icon: Cpu },
  { label: 'Classifying job description: Mandatory vs. Preferred criteria', icon: Target },
  { label: 'Computing transparent 7-factor explainable ATS score weights', icon: Brain },
  { label: 'Executing Responsible AI audit for fair-hiring compliance', icon: ShieldCheck },
  { label: 'Running AI Resume Doctor: XYZ formula rewrites & metric checks', icon: Stethoscope },
  { label: 'Synthesizing tailored interview questions & 6-week roadmap', icon: MessageSquareCode },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        {/* Animated Radar Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-indigo-100 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            RESUMEX NLP Pipeline Active
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Executing hybrid document parsing, semantic taxonomy mapping, and explainable ATS calculations.
          </p>
        </div>

        {/* Step Progress Checklist */}
        <div className="space-y-2.5 text-left border border-slate-100 rounded-2xl p-4 bg-slate-50/60">
          {PIPELINE_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-white border border-indigo-200 shadow-2xs'
                    : isDone
                    ? 'text-slate-600'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-950 font-bold' : ''}`}>
                    {step.label}
                  </p>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                    Running
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Responsible Notice */}
        <p className="text-[11px] text-slate-400">
          Zero arbitrary hallucination. Scoring is grounded strictly in parsed lexical and semantic evidence.
        </p>
      </div>
    </div>
  );
};
