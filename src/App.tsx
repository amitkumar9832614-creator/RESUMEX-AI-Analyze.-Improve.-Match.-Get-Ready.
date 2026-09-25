import React, { useState, useEffect } from 'react';
import {
  FileText,
  BarChart3,
  Stethoscope,
  Target,
  MessageSquareCode,
  MapPin,
  Zap,
  History,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { UploadWorkflow } from './components/UploadWorkflow';
import { ProcessingScreen } from './components/ProcessingScreen';
import { DashboardView } from './components/DashboardView';
import { ResumeDoctorView } from './components/ResumeDoctorView';
import { SkillGapView } from './components/SkillGapView';
import { InterviewPrepView } from './components/InterviewPrepView';
import { RoadmapView } from './components/RoadmapView';
import { WhatIfSimulationView } from './components/WhatIfSimulationView';
import { SavedAnalysesView } from './components/SavedAnalysesView';
import { SettingsView } from './components/SettingsView';
import { api } from './services/api';
import { ActiveTab, FullAnalysisReport } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [currentReport, setCurrentReport] = useState<FullAnalysisReport | null>(null);
  const [sampleResume, setSampleResume] = useState<string>('');
  const [sampleJob, setSampleJob] = useState<string>('');
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);

  // Load sample data on initial mount
  useEffect(() => {
    api.loadDemo()
      .then((data) => {
        setSampleResume(data.sampleResume);
        setSampleJob(data.sampleJob);
      })
      .catch((err) => {
        console.warn('Initial demo seed check:', err);
      });
  }, []);

  // Launch 1-Click Competition Demo
  const handleLaunchDemo = async () => {
    setIsLoadingDemo(true);
    setAnalysisError(null);
    setActiveTab('processing');

    try {
      // Small delay for smooth animated pipeline display
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const demoData = await api.loadDemo();
      setCurrentReport(demoData.report);
      setSampleResume(demoData.sampleResume);
      setSampleJob(demoData.sampleJob);
      setActiveTab('dashboard');
      setShowDemoGuide(true);
    } catch (err: any) {
      console.error('Demo launch error:', err);
      setAnalysisError(err.message || 'Failed to initialize demo report.');
      setActiveTab('upload');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  // Launch fresh analysis from user upload
  const handleStartAnalysis = async (payload: {
    resumeText: string;
    jobText: string;
    targetRole: string;
    resumeFileName: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setActiveTab('processing');

    try {
      const report = await api.runFullAnalysis(payload);
      setCurrentReport(report);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err.message || 'Analysis failed. Please check the resume text and try again.');
      setActiveTab('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSavedAnalysis = (report: FullAnalysisReport) => {
    setCurrentReport(report);
    setActiveTab('dashboard');
  };

  const handleClearSession = () => {
    setCurrentReport(null);
    setActiveTab('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentReport={currentReport}
        onLaunchDemo={handleLaunchDemo}
        isLoadingDemo={isLoadingDemo}
      />

      {/* Competition Demo Tour Floating Header (if demo active) */}
      {showDemoGuide && currentReport?.id === 'demo-analysis-preset' && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white px-4 py-2 text-xs font-semibold shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-extrabold uppercase text-[10px]">
                Demo Mode Active
              </span>
              <span>
                Presentation Flow: <strong>1. Dashboard</strong> → <strong>2. Resume Doctor</strong> → <strong>3. Skill Gaps</strong> → <strong>4. Interview Prep</strong> → <strong>5. Roadmap</strong> → <strong>6. What If?</strong>
              </span>
            </div>

            <button
              onClick={() => setShowDemoGuide(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {analysisError && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span className="font-semibold">{analysisError}</span>
            <button onClick={() => setAnalysisError(null)} className="text-rose-600 hover:text-rose-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingHero
            setActiveTab={setActiveTab}
            onLaunchDemo={handleLaunchDemo}
            isLoadingDemo={isLoadingDemo}
          />
        )}

        {activeTab === 'upload' && (
          <UploadWorkflow
            onStartAnalysis={handleStartAnalysis}
            isLoading={isAnalyzing}
            sampleJob={sampleJob}
            sampleResume={sampleResume}
          />
        )}

        {activeTab === 'processing' && <ProcessingScreen />}

        {activeTab === 'dashboard' && currentReport && (
          <DashboardView report={currentReport} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'doctor' && currentReport && (
          <ResumeDoctorView report={currentReport} />
        )}

        {activeTab === 'skill-gap' && currentReport && (
          <SkillGapView report={currentReport} />
        )}

        {activeTab === 'interview' && currentReport && (
          <InterviewPrepView report={currentReport} />
        )}

        {activeTab === 'roadmap' && currentReport && (
          <RoadmapView report={currentReport} />
        )}

        {activeTab === 'what-if' && currentReport && (
          <WhatIfSimulationView report={currentReport} />
        )}

        {activeTab === 'history' && (
          <SavedAnalysesView
            onSelectAnalysis={handleSelectSavedAnalysis}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentReport={currentReport}
            onClearSession={handleClearSession}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight">RESUMEX AI</span>
            <span className="text-slate-300">•</span>
            <span>Analyze. Improve. Match. Get Ready.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Responsible AI Certified
            </span>
            <button
              onClick={() => setActiveTab('settings')}
              className="hover:text-slate-900 transition-colors"
            >
              Settings & Privacy
            </button>
            <button
              onClick={handleLaunchDemo}
              className="text-indigo-600 font-bold hover:underline"
            >
              Competition Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
