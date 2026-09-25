import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { FullAnalysisReport, WhatIfSimulationResult } from '../types';

interface WhatIfSimulationViewProps {
  report: FullAnalysisReport;
}

export const WhatIfSimulationView: React.FC<WhatIfSimulationViewProps> = ({ report }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    report.missingSkills.slice(0, 2)
  );
  const [customSkill, setCustomSkill] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Suggested skills to simulate adding (from missing skills)
  const suggestedSkills = report.missingSkills.filter(
    (s) => !selectedSkills.includes(s)
  );

  const handleAddSkill = (skill: string) => {
    if (!skill || selectedSkills.includes(skill)) return;
    const updated = [...selectedSkills, skill];
    setSelectedSkills(updated);
    triggerSimulation(updated);
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updated);
    triggerSimulation(updated);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    handleAddSkill(customSkill.trim());
    setCustomSkill('');
  };

  const triggerSimulation = async (skills: string[]) => {
    setIsSimulating(true);
    try {
      const res = await api.runSimulation(report.id, skills);
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Run initial simulation on mount if not yet run
  React.useEffect(() => {
    if (selectedSkills.length > 0 && !simulationResult) {
      triggerSimulation(selectedSkills);
    }
  }, []);

  const currentScore = report.atsScore.overall;
  const simulatedScore = simulationResult ? simulationResult.simulatedScore : currentScore;
  const scoreDelta = simulationResult ? simulationResult.scoreDelta : 0;
  const currentMatch = report.matchPercentage;
  const simulatedMatch = simulationResult ? simulationResult.simulatedMatch : currentMatch;
  const matchDelta = simulatedMatch - currentMatch;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
              <Zap className="w-3.5 h-3.5 fill-current" />
              What If? Alignment Simulation Sandbox
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Simulate Target Skill Additions
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Model how acquiring specific mandatory or preferred competencies impacts your parsed ATS alignment index and job coverage for{' '}
              <span className="font-semibold text-slate-800">{report.targetRole}</span>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-xs space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600" />
              Alignment Simulation Only
            </p>
            <p className="text-[11px] text-slate-500">
              Illustrates algorithmic parse matching changes. Does not predict or guarantee hiring outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* SIMULATION COMPARISON GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATS Score Simulation Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ATS Scoring Index Impact
            </span>
            {scoreDelta > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                +{scoreDelta} Pts Projected
              </span>
            )}
          </div>

          <div className="flex items-center justify-around py-4">
            {/* Current */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">Baseline</p>
              <div className="text-3xl font-extrabold text-slate-700">{currentScore}</div>
              <p className="text-[11px] text-slate-400">Current Score</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-300" />

            {/* Simulated */}
            <div className="text-center">
              <p className="text-xs font-bold text-indigo-600 mb-1">Simulated</p>
              <div className="text-4xl font-black text-indigo-600">{simulatedScore}</div>
              <p className="text-[11px] font-semibold text-indigo-700">Projected Index</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600">
            {simulationResult ? simulationResult.impactExplanation : 'Add skills below to simulate alignment changes.'}
          </div>
        </div>

        {/* Job Match Percentage Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Match Percentage
            </span>
            {matchDelta > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                +{matchDelta}% Coverage
              </span>
            )}
          </div>

          <div className="flex items-center justify-around py-4">
            {/* Current Match */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-400 mb-1">Baseline</p>
              <div className="text-3xl font-extrabold text-slate-700">{currentMatch}%</div>
              <p className="text-[11px] text-slate-400">Current Match</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-300" />

            {/* Simulated Match */}
            <div className="text-center">
              <p className="text-xs font-bold text-emerald-600 mb-1">Simulated</p>
              <div className="text-4xl font-black text-emerald-600">{simulatedMatch}%</div>
              <p className="text-[11px] font-semibold text-emerald-700">Projected Match</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600">
            Simulated satisfying {selectedSkills.length} additional key qualification criteria.
          </div>
        </div>
      </div>

      {/* INTERACTIVE SKILL CHIP SELECTOR & SIMULATION SANDBOX */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Active Simulated Skills ({selectedSkills.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            These skills are currently being injected into the simulated ATS parsing run:
          </p>
        </div>

        {/* Active Chips */}
        <div className="flex flex-wrap gap-2">
          {selectedSkills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No skills selected for simulation. Click suggested skills below!</span>
          ) : (
            selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs"
              >
                <Zap className="w-3 h-3 text-indigo-600 fill-current" />
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Suggested Missing Skills to Add */}
        {suggestedSkills.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-700">
              Suggested Missing Requirements from Job Posting (Click to simulate):
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Skill Input */}
        <div className="pt-4 border-t border-slate-100">
          <form onSubmit={handleAddCustom} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Or test custom skill (e.g. Kubernetes, Terraform)..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95"
            >
              Simulate
            </button>
          </form>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Important: This feature is strictly an educational alignment simulation to visualize keyword coverage impacts. It does not predict recruiter decisions, guarantee interviews, or ensure job offers.
        </span>
      </div>
    </div>
  );
};
