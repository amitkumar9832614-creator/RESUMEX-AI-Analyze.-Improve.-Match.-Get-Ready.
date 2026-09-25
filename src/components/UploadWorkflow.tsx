import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Sparkles,
  ArrowRight,
  ClipboardList,
  FileCheck,
  X,
  FileCode
} from 'lucide-react';
import { api } from '../services/api';
import { ParsedResume } from '../types';

interface UploadWorkflowProps {
  onStartAnalysis: (payload: {
    resumeText: string;
    jobText: string;
    targetRole: string;
    resumeFileName: string;
  }) => void;
  isLoading: boolean;
  sampleJob: string;
  sampleResume: string;
}

const POPULAR_ROLES = [
  'Full-Stack Software Engineer',
  'Frontend React Engineer',
  'Backend Python / Node Engineer',
  'DevOps & Cloud Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Mobile Application Engineer (iOS/Android)',
  'Product Solutions Architect'
];

export const UploadWorkflow: React.FC<UploadWorkflowProps> = ({
  onStartAnalysis,
  isLoading,
  sampleJob,
  sampleResume,
}) => {
  // Step tracker: 1 = Resume, 2 = Target Role & JD
  const [step, setStep] = useState<1 | 2>(1);

  // Resume states
  const [uploadMode, setUploadMode] = useState<'file' | 'paste'>('file');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<ParsedResume | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Job Description states
  const [targetRole, setTargetRole] = useState<string>('Full-Stack Software Engineer');
  const [customRole, setCustomRole] = useState<string>('');
  const [jobText, setJobText] = useState<string>('');
  const [jobError, setJobError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const processSelectedFile = async (file: File) => {
    setUploadError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      setUploadError('Invalid file type. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    if (file.size === 0) {
      setUploadError('The selected file is empty (0 bytes). Please select a valid resume document.');
      return;
    }

    setIsUploading(true);
    try {
      const data = await api.uploadResumeFile(file);
      setResumeFile(file);
      setResumeFileName(data.fileName);
      setResumeText(data.text);
      setParsedPreview(data.parsedResume);
    } catch (err: any) {
      setUploadError(err.message || 'Error parsing resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseSampleResume = () => {
    setUploadError(null);
    setResumeFileName('Alex_Rivera_Software_Engineer_Resume.pdf');
    setResumeText(sampleResume);
    setUploadMode('paste');
  };

  const handleUseSampleJob = () => {
    setJobError(null);
    setJobText(sampleJob);
    setTargetRole('Full-Stack Software Engineer');
  };

  const proceedToStep2 = () => {
    setUploadError(null);
    if (!resumeText || resumeText.trim().length < 30) {
      setUploadError('Please provide a valid resume (upload PDF/DOCX or paste resume text) before continuing.');
      return;
    }
    setStep(2);
  };

  const handleAnalyze = () => {
    setJobError(null);
    const finalRole = customRole.trim() || targetRole;
    if (!finalRole) {
      setJobError('Please specify a target role title.');
      return;
    }

    if (!jobText || jobText.trim().length < 20) {
      setJobError('Please paste the target job description or click "Insert Sample Job Posting".');
      return;
    }

    onStartAnalysis({
      resumeText,
      jobText,
      targetRole: finalRole,
      resumeFileName: resumeFileName || 'Uploaded_Resume.pdf'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xs mx-auto text-xs font-semibold">
          <div
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 cursor-pointer ${
              step >= 1 ? 'text-indigo-600 font-bold' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </div>
            <span>Upload Resume</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div
            onClick={() => resumeText && setStep(2)}
            className={`flex items-center gap-1.5 ${
              resumeText ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${step === 2 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span>Target Role & JD</span>
          </div>
        </div>
      </div>

      {/* STEP 1: RESUME UPLOAD */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1: Provide Your Resume</h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload your resume in PDF or DOCX format for accurate section parsing.
              </p>
            </div>

            {/* Toggle file vs text */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  uploadMode === 'file' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('paste')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  uploadMode === 'paste' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {/* Error notice */}
          {uploadError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Extraction Issue: </span>
                {uploadError}
              </div>
              <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {uploadMode === 'file' ? (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  resumeFile
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      resumeFile
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-indigo-100 text-indigo-600'
                    }`}
                  >
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : resumeFile ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    {resumeFile ? (
                      <div>
                        <p className="text-sm font-bold text-emerald-900">{resumeFile.name}</p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          {(resumeFile.size / 1024).toFixed(1)} KB • Text successfully parsed
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {isUploading ? 'Parsing document text...' : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supports PDF (.pdf) and Microsoft Word (.docx) up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {!resumeFile && (
                    <span className="inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      Standard text-based PDF/DOCX recommended
                    </span>
                  )}
                </div>
              </div>

              {/* Sample resume button */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Don't have a resume handy?</span>
                <button
                  type="button"
                  onClick={handleUseSampleResume}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Load Sample Software Engineer Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Paste Full Resume Text</label>
                <button
                  type="button"
                  onClick={handleUseSampleResume}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Insert Sample Resume
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setResumeFileName('Pasted_Resume_Text.txt');
                }}
                rows={10}
                placeholder="Paste the full text of your resume here (Contact info, Summary, Experience, Education, Skills, Projects)..."
                className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
              <p className="text-[11px] text-slate-400">
                Word count: {resumeText.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={proceedToStep2}
              disabled={!resumeText || isUploading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 disabled:opacity-40 transition-all"
            >
              Continue to Target Role & Job
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TARGET ROLE & JOB DESCRIPTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Step 2: Target Role & Job Description</h2>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ← Back to Resume
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select or enter your desired job title and paste the target job posting for custom requirement extraction.
            </p>
          </div>

          {/* Job error */}
          {jobError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{jobError}</div>
              <button onClick={() => setJobError(null)} className="text-rose-500 hover:text-rose-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Target Role Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Select Target Role Preset
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setTargetRole(role);
                    setCustomRole('');
                  }}
                  className={`text-left p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    targetRole === role && !customRole
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label className="text-[11px] font-semibold text-slate-500">Or type custom role title:</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g., Staff Distributed Systems Architect, Senior iOS Developer..."
                className="mt-1 w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Job Description Input */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                Target Job Description
              </label>
              <button
                type="button"
                onClick={handleUseSampleJob}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Insert Sample Software Engineer Posting
              </button>
            </div>

            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={8}
              placeholder="Paste the job description (Responsibilities, Requirements, Skills, Qualifications)..."
              className="w-full text-xs font-sans p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back to Resume
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !jobText}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-indigo-200 animate-spin" style={{ animationDuration: '6s' }} />
              {isLoading ? 'Analyzing Profile...' : 'Analyze Match & Generate Intelligence'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
