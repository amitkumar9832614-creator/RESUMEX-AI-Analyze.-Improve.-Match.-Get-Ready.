import { FullAnalysisReport, JobAnalysis, ParsedResume, WhatIfSimulationResult } from '../types';

export const api = {
  async uploadResumeFile(file: File): Promise<{
    fileName: string;
    fileType: string;
    wordCount: number;
    pageCount?: number;
    text: string;
    parsedResume: ParsedResume;
  }> {
    const formData = new FormData();
    formData.append('resumeFile', file);

    const res = await fetch('/api/resumes/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to process resume file.');
    }

    return res.json();
  },

  async parseResumeText(text: string): Promise<{
    fileName: string;
    parsedResume: ParsedResume;
  }> {
    const res = await fetch('/api/resumes/parse-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to parse resume text.');
    }

    return res.json();
  },

  async analyzeJobDescription(jobText: string, targetRole?: string): Promise<JobAnalysis> {
    const res = await fetch('/api/jobs/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobText, targetRole }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze job description.');
    }

    return res.json();
  },

  async runFullAnalysis(payload: {
    resumeText: string;
    jobText: string;
    targetRole: string;
    resumeFileName?: string;
    userId?: string;
  }): Promise<FullAnalysisReport> {
    const res = await fetch('/api/analysis/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create analysis report.');
    }

    return res.json();
  },

  async getSavedAnalyses(): Promise<FullAnalysisReport[]> {
    const res = await fetch('/api/analysis');
    if (!res.ok) throw new Error('Failed to fetch saved analyses.');
    return res.json();
  },

  async getAnalysisById(id: string): Promise<FullAnalysisReport> {
    const res = await fetch(`/api/analysis/${id}`);
    if (!res.ok) throw new Error('Analysis report not found.');
    return res.json();
  },

  async deleteAnalysis(id: string): Promise<void> {
    const res = await fetch(`/api/analysis/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete analysis.');
  },

  async runSimulation(analysisId: string, skillsToAdd: string[]): Promise<WhatIfSimulationResult> {
    const res = await fetch('/api/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId, skillsToAdd }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to run simulation.');
    }

    return res.json();
  },

  async loadDemo(): Promise<{
    report: FullAnalysisReport;
    sampleResume: string;
    sampleJob: string;
  }> {
    const res = await fetch('/api/demo/load');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to load demo data.');
    }
    return res.json();
  },
};
