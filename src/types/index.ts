export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  links: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
  details?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
  location?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  technologies: string[];
  description: string;
  link?: string;
  bullets: string[];
}

export interface ParsedResume {
  contact: ContactInfo;
  summary: string;
  education: EducationItem[];
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: string[];
  links: string[];
  rawText: string;
  wordCount: number;
}

export interface JobAnalysis {
  roleTitle: string;
  experienceLevel: string;
  requiredSkills: string[];
  preferredSkills: string[];
  tools: string[];
  technologies: string[];
  qualifications: string[];
  responsibilities: string[];
  importantKeywords: string[];
  rawText: string;
}

export interface SubScore {
  score: number;
  weight: number;
  label: string;
  explanation: string;
  positiveFactors: string[];
  improvementAreas: string[];
}

export interface ATSScore {
  overall: number;
  keywordRelevance: SubScore;
  skillsMatch: SubScore;
  experienceRelevance: SubScore;
  educationMatch: SubScore;
  projectsAlignment: SubScore;
  resumeStructure: SubScore;
  readabilityFormatting: SubScore;
  disclaimer: string;
}

export interface PartialMatch {
  candidateSkill: string;
  requiredSkill: string;
  relationType: string;
  note: string;
}

export interface SkillGap {
  id: string;
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  whyItMatters: string;
  currentEvidence: string;
  recommendedLearning: string[];
  suggestedProject: string;
  estimatedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTimeToLearn: string;
}

export interface BulletImprovement {
  before: string;
  after: string;
  rationale: string;
  actionVerbAdded: string;
  quantificationHint: string;
}

export interface ResumeDoctorSection {
  id: string;
  sectionName: string;
  healthStatus: 'optimal' | 'needs_improvement' | 'critical';
  currentSnippet: string;
  critique: string;
  suggestedImprovement: string;
  bulletImprovements?: BulletImprovement[];
  strengths: string[];
  recommendations: string[];
}

export interface FlaggedPersonalDetail {
  category: 'Age/DOB' | 'Gender/Pronouns' | 'Marital Status' | 'Photo Reference' | 'Religion/Origin' | 'National ID';
  detectedSnippet: string;
  severity: 'warning' | 'info';
  explanation: string;
  recommendation: string;
}

export interface ResponsibleAiAudit {
  passesAudit: boolean;
  score: number;
  flaggedItems: FlaggedPersonalDetail[];
  fairHiringNotice: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Behavioral' | 'Project-based' | 'HR' | 'Role-specific';
  question: string;
  context: string;
  whyAsked: string;
  modelGuidance: string;
  keyPointsToCover: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewPrep {
  roleTitle: string;
  totalQuestions: number;
  questions: InterviewQuestion[];
  starMethodTips: string[];
  preparationNotice: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focusArea: string;
  skillsTargeted: string[];
  learningObjectives: string[];
  handsOnProject: string;
  estimatedHours: number;
  checkpointDeliverable: string;
}

export interface CareerRoadmap {
  roleTitle: string;
  durationWeeks: number;
  weeks: RoadmapWeek[];
  targetMilestones: string[];
}

export interface WhatIfSimulationResult {
  addedSkills: string[];
  originalScore: number;
  simulatedScore: number;
  originalMatch: number;
  simulatedMatch: number;
  scoreDelta: number;
  impactExplanation: string;
  newlyMatchedSkills: string[];
  remainingGaps: string[];
  simulationDisclaimer: string;
}

export interface FullAnalysisReport {
  id: string;
  userId?: string;
  createdAt: string;
  targetRole: string;
  resumeFileName: string;
  matchPercentage: number;
  atsScore: ATSScore;
  parsedResume: ParsedResume;
  parsedJob: JobAnalysis;
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: PartialMatch[];
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: SkillGap[];
  resumeDoctor: ResumeDoctorSection[];
  responsibleAi: ResponsibleAiAudit;
  interviewPrep: InterviewPrep;
  careerRoadmap: CareerRoadmap;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
}

export type ActiveTab =
  | 'landing'
  | 'upload'
  | 'processing'
  | 'dashboard'
  | 'doctor'
  | 'skill-gap'
  | 'interview'
  | 'roadmap'
  | 'what-if'
  | 'history'
  | 'settings';
