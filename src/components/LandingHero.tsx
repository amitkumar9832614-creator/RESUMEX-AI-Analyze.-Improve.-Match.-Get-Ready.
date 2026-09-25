import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Brain,
  Zap,
  Target,
  Stethoscope,
  MessageSquareCode,
  MapPin,
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react';
import { ActiveTab } from '../types';

interface LandingHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onLaunchDemo: () => void;
  isLoadingDemo: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  setActiveTab,
  onLaunchDemo,
  isLoadingDemo,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Resume Intelligence & Career Readiness Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          Analyze. Improve. Match.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
            Get Ready.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          RESUMEX AI transforms resume screening from a black box into a transparent, explainable career acceleration pipeline.
          Evaluate ATS compatibility, close skill gaps, optimize bullet points, and prepare for interviews.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setActiveTab('upload')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-98"
          >
            <FileCheck2 className="w-4 h-4" />
            Analyze My Resume
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onLaunchDemo}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            {isLoadingDemo ? 'Loading Demo...' : 'Launch Competition Demo'}
          </button>
        </div>

        {/* Safe AI Banner */}
        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Responsible AI & Bias Guardrails
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Explainable 0–100 ATS Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-violet-600" />
            Zero Experience Hallucination
          </span>
        </div>
      </section>

      {/* Product Journey Story: Resume → Understand → Match → Find Gaps → Improve → Prepare → Grow */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              The RESUMEX AI Lifecycle
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Resume → Understand → Match → Find Gaps → Improve → Prepare → Grow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { step: '1. Resume', desc: 'PDF/DOCX raw text extraction & parsing', icon: FileCheck2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { step: '2. Understand', desc: 'Contact, summary, history & skills hierarchy', icon: Brain, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { step: '3. Match', desc: 'Required vs preferred JD requirement separation', icon: Target, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
              { step: '4. Find Gaps', desc: 'Prioritized High/Med/Low deficit diagnosis', icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { step: '5. Improve', desc: 'Resume Doctor XYZ rewrites without fabrication', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { step: '6. Prepare', desc: 'Tailored technical & behavioral interview prompts', icon: MessageSquareCode, color: 'text-violet-600 bg-violet-50 border-violet-200' },
              { step: '7. Grow', desc: '6-Week structured hands-on learning roadmap', icon: MapPin, color: 'text-rose-600 bg-rose-50 border-rose-200' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{item.step}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Transparency & Rigor
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Unlike superficial keyword checkers, RESUMEX AI runs a multi-layered NLP and heuristic pipeline combining lexical, semantic, and rule-based verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Explainable 0–100 ATS Scoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Transparent point breakdown across 7 dimensions: Keyword relevance (20%), Required skill coverage (25%), Experience impact (15%), Education (10%), Projects (10%), Structure (10%), and Readability (10%).
            </p>
            <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md inline-block">
              Zero black-box mystery numbers
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Resume Doctor
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Section-by-section analysis highlighting weak summaries and passive verbs. Generates Google/Amazon-style XYZ bullet rewrites while strictly upholding factual integrity.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md inline-block">
              Preserves your authentic history
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Prioritized Skill Gap Diagnosis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Differentiates mandatory requirements from nice-to-haves. For each deficit, provides rationale, evidence assessment, recommended syllabus, and suggested proof-of-concept projects.
            </p>
            <div className="text-[11px] font-semibold text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-md inline-block">
              High / Medium / Low triage
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 mb-4">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Tailored Interview Simulator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Simulates realistic interview loops tailored to your resume's actual projects and identified job deficits. Covers Technical, Behavioral (STAR method), and Role-Specific categories.
            </p>
            <div className="text-[11px] font-semibold text-violet-700 bg-violet-50/80 px-2.5 py-1 rounded-md inline-block">
              Includes STAR method model guidance
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              "What If?" Alignment Sandbox
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Simulate acquiring a key technology (e.g. FastAPI, Docker, Kubernetes) and watch your projected match score and ATS index recalculate dynamically in real time.
            </p>
            <div className="text-[11px] font-semibold text-sky-700 bg-sky-50/80 px-2.5 py-1 rounded-md inline-block">
              Hypothesis testing for your career
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Responsible AI & Anti-Bias Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Audits resumes for potentially biasing personal disclosures such as age, marital status, portrait photos, or national IDs. Reinforces merit-based, blind evaluation standards.
            </p>
            <div className="text-[11px] font-semibold text-rose-700 bg-rose-50/80 px-2.5 py-1 rounded-md inline-block">
              Complies with fair hiring ethics
            </div>
          </div>
        </div>
      </section>

      {/* Competition Demo Callout Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 p-8 text-white shadow-lg text-center relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              Ready for Live Evaluation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Experience the Full End-to-End Workflow in Seconds
            </h2>
            <p className="text-sm text-indigo-100 max-w-xl mx-auto leading-relaxed">
              Launch our pre-packaged Software Engineer analysis. Review ATS dials, examine resume critique diffs, practice interview answers, and test the What-If simulator with zero setup.
            </p>
            <div className="pt-2">
              <button
                onClick={onLaunchDemo}
                disabled={isLoadingDemo}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white text-indigo-900 hover:bg-slate-50 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                {isLoadingDemo ? 'Preparing Demo...' : 'Launch Instant Competition Demo'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
