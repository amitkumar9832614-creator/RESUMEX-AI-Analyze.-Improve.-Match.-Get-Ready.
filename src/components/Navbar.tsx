import React from 'react';
import {
  FileText,
  Sparkles,
  BarChart3,
  Stethoscope,
  Target,
  MessageSquareCode,
  MapPin,
  PlayCircle,
  History,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab, FullAnalysisReport } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentReport: FullAnalysisReport | null;
  onLaunchDemo: () => void;
  isLoadingDemo: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentReport,
  onLaunchDemo,
  isLoadingDemo,
}) => {
  const hasAnalysis = !!currentReport;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  RESUMEX<span className="text-indigo-600 ml-0.5">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Analyze. Improve. Match. Get Ready.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              New Analysis
            </button>

            {hasAnalysis && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'doctor'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Resume Doctor
                </button>

                <button
                  onClick={() => setActiveTab('skill-gap')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'skill-gap'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  Skill Gap
                </button>

                <button
                  onClick={() => setActiveTab('interview')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'interview'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5" />
                  Interview Prep
                </button>

                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'roadmap'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Roadmap
                </button>

                <button
                  onClick={() => setActiveTab('what-if')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'what-if'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  What If?
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Saved
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Competition Demo Mode Button */}
            <button
              onClick={onLaunchDemo}
              disabled={isLoadingDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 hover:from-amber-200 hover:to-yellow-200 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              title="Instantly test end-to-end demo flow with sample Software Engineer profile"
            >
              <Zap className="w-3.5 h-3.5 text-amber-700 animate-pulse fill-amber-500" />
              <span>{isLoadingDemo ? 'Loading Demo...' : 'Competition Demo'}</span>
            </button>

            {hasAnalysis ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Score: {currentReport.atsScore.overall}/100
                </span>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('upload')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all active:scale-95"
              >
                <Layers className="w-3.5 h-3.5" />
                Analyze Resume
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation */}
        {hasAnalysis && (
          <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'doctor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Resume Doctor
            </button>
            <button
              onClick={() => setActiveTab('skill-gap')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'skill-gap' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Skill Gaps
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'interview' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Interview Prep
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'roadmap' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab('what-if')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                activeTab === 'what-if' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              What If?
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
