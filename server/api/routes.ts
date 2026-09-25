import express from 'express';
import multer from 'multer';
import {
  generatePersonalizedInterviewPrep,
  generatePersonalizedRoadmap,
  generateResumeDoctorSuggestions
} from '../ai/geminiService.js';
import { calculateExplainableATS } from '../nlp/atsScorer.js';
import { analyzeJobDescription } from '../nlp/jobAnalyzer.js';
import { performJobMatching } from '../nlp/matchingEngine.js';
import { runResponsibleAiAudit } from '../nlp/responsibleAi.js';
import { detectSections } from '../nlp/sectionDetector.js';
import { generateSkillGaps } from '../nlp/skillGapEngine.js';
import { runWhatIfSimulation } from '../nlp/simulationEngine.js';
import { parseResumeBuffer } from '../parsers/resumeParser.js';
import { db, DEMO_JOB_DESCRIPTION, DEMO_RESUME_TEXT } from '../storage/db.js';
import { FullAnalysisReport, UserAccount } from '../types.js';

export const apiRouter = express.Router();

// Configure multer for file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------
apiRouter.post('/auth/register', (req, res) => {
  const { name, email, password, targetRole } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user: UserAccount = {
    id: `user-${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    passwordHash: password, // In production use bcrypt
    targetRole: targetRole || 'Software Engineer',
    createdAt: new Date().toISOString()
  };
  db.saveUser(user);

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, targetRole: user.targetRole },
    token: `token-${user.id}`
  });
});

apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, targetRole: user.targetRole },
    token: `token-${user.id}`
  });
});

apiRouter.get('/auth/me', (req, res) => {
  // Demo auto-login default
  const user = db.getUserById('demo-user-1') || {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@resumex.ai',
    targetRole: 'Software Engineer'
  };
  res.json({ user });
});

// -------------------------------------------------------------
// RESUME UPLOAD & PARSING
// -------------------------------------------------------------
apiRouter.post('/resumes/upload', upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded. Please upload a PDF or DOCX file.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const parsedFile = await parseResumeBuffer(buffer, originalname, mimetype);

    if (parsedFile.isScannedOrEmpty) {
      return res.status(422).json({
        error: parsedFile.warning || 'Scanned or unreadable document detected. Please provide a text-based resume.'
      });
    }

    const parsedSections = detectSections(parsedFile.text);

    res.json({
      fileName: originalname,
      fileType: parsedFile.fileType,
      wordCount: parsedFile.wordCount,
      pageCount: parsedFile.pageCount,
      text: parsedFile.text,
      parsedResume: parsedSections
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error processing resume file.' });
  }
});

apiRouter.post('/resumes/parse-text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 30) {
      return res.status(400).json({ error: 'Resume text is too short. Please provide at least 30 words.' });
    }

    const parsedSections = detectSections(text);
    res.json({
      fileName: 'Pasted Resume Text',
      parsedResume: parsedSections
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error parsing resume text.' });
  }
});

// -------------------------------------------------------------
// JOB DESCRIPTION ANALYZER
// -------------------------------------------------------------
apiRouter.post('/jobs/analyze', (req, res) => {
  try {
    const { jobText, targetRole } = req.body;
    if (!jobText || jobText.trim().length < 20) {
      return res.status(400).json({ error: 'Job description text is too short. Please paste a complete job posting.' });
    }

    const jobAnalysis = analyzeJobDescription(jobText, targetRole);
    res.json(jobAnalysis);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error analyzing job description.' });
  }
});

// -------------------------------------------------------------
// FULL PIPELINE ANALYSIS CREATE
// -------------------------------------------------------------
apiRouter.post('/analysis/create', async (req, res) => {
  try {
    const { resumeText, jobText, targetRole, resumeFileName, userId } = req.body;

    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ error: 'A valid resume is required to perform an analysis.' });
    }
    if (!jobText || jobText.trim().length < 20) {
      return res.status(400).json({ error: 'A valid target job description is required for matching.' });
    }

    // 1. NLP Pipeline Execution
    const parsedResume = detectSections(resumeText);
    const parsedJob = analyzeJobDescription(jobText, targetRole || parsedResume.contact.name ? targetRole : 'Software Engineer');

    // 2. Matching Engine
    const match = performJobMatching(parsedResume, parsedJob);

    // 3. Explainable ATS Scoring
    const atsScore = calculateExplainableATS(parsedResume, parsedJob, match);

    // 4. Responsible AI Audit
    const responsibleAi = runResponsibleAiAudit(parsedResume);

    // 5. Skill Gap Analysis
    const skillGaps = generateSkillGaps(parsedResume, parsedJob, match);

    // 6. AI Resume Doctor
    const resumeDoctor = await generateResumeDoctorSuggestions(parsedResume, parsedJob);

    // 7. Interview Preparation
    const interviewPrep = await generatePersonalizedInterviewPrep(parsedResume, parsedJob, skillGaps);

    // 8. Career Roadmap
    const careerRoadmap = await generatePersonalizedRoadmap(parsedJob, skillGaps);

    const report: FullAnalysisReport = {
      id: `analysis-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      targetRole: parsedJob.roleTitle,
      resumeFileName: resumeFileName || 'Uploaded Resume',
      matchPercentage: match.matchPercentage,
      atsScore,
      parsedResume,
      parsedJob,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      partialSkills: match.partialSkills,
      matchedKeywords: match.matchedKeywords,
      missingKeywords: match.missingKeywords,
      skillGaps,
      resumeDoctor,
      responsibleAi,
      interviewPrep,
      careerRoadmap
    };

    db.saveAnalysis(report);
    res.status(201).json(report);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to complete resume analysis.' });
  }
});

// -------------------------------------------------------------
// SAVED ANALYSES
// -------------------------------------------------------------
apiRouter.get('/analysis', (req, res) => {
  const userId = req.query.userId as string | undefined;
  const list = db.listAnalyses(userId);
  res.json(list);
});

apiRouter.get('/analysis/:id', (req, res) => {
  const report = db.getAnalysis(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Analysis report not found.' });
  }
  res.json(report);
});

apiRouter.delete('/analysis/:id', (req, res) => {
  const success = db.deleteAnalysis(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Analysis not found.' });
  }
  res.json({ success: true, message: 'Analysis deleted successfully.' });
});

// -------------------------------------------------------------
// WHAT-IF SIMULATION
// -------------------------------------------------------------
apiRouter.post('/simulation', (req, res) => {
  try {
    const { analysisId, skillsToAdd } = req.body;
    if (!analysisId || !Array.isArray(skillsToAdd)) {
      return res.status(400).json({ error: 'analysisId and skillsToAdd array are required.' });
    }

    const report = db.getAnalysis(analysisId);
    if (!report) {
      return res.status(404).json({ error: 'Analysis report not found.' });
    }

    const simulation = runWhatIfSimulation(report, skillsToAdd);
    res.json(simulation);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error executing simulation.' });
  }
});

// -------------------------------------------------------------
// COMPETITION DEMO LOADER
// -------------------------------------------------------------
apiRouter.get('/demo/load', async (req, res) => {
  try {
    // Check if demo analysis already exists
    const existingDemo = db.listAnalyses().find(a => a.id === 'demo-analysis-preset');
    if (existingDemo) {
      return res.json({
        report: existingDemo,
        sampleResume: DEMO_RESUME_TEXT,
        sampleJob: DEMO_JOB_DESCRIPTION
      });
    }

    // Generate fresh demo analysis
    const parsedResume = detectSections(DEMO_RESUME_TEXT);
    const parsedJob = analyzeJobDescription(DEMO_JOB_DESCRIPTION, 'Full-Stack Software Engineer');
    const match = performJobMatching(parsedResume, parsedJob);
    const atsScore = calculateExplainableATS(parsedResume, parsedJob, match);
    const responsibleAi = runResponsibleAiAudit(parsedResume);
    const skillGaps = generateSkillGaps(parsedResume, parsedJob, match);
    const resumeDoctor = await generateResumeDoctorSuggestions(parsedResume, parsedJob);
    const interviewPrep = await generatePersonalizedInterviewPrep(parsedResume, parsedJob, skillGaps);
    const careerRoadmap = await generatePersonalizedRoadmap(parsedJob, skillGaps);

    const demoReport: FullAnalysisReport = {
      id: 'demo-analysis-preset',
      userId: 'demo-user-1',
      createdAt: new Date().toISOString(),
      targetRole: 'Full-Stack Software Engineer',
      resumeFileName: 'Alex_Rivera_Software_Engineer_Resume.pdf',
      matchPercentage: match.matchPercentage,
      atsScore,
      parsedResume,
      parsedJob,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      partialSkills: match.partialSkills,
      matchedKeywords: match.matchedKeywords,
      missingKeywords: match.missingKeywords,
      skillGaps,
      resumeDoctor,
      responsibleAi,
      interviewPrep,
      careerRoadmap
    };

    db.saveAnalysis(demoReport);

    res.json({
      report: demoReport,
      sampleResume: DEMO_RESUME_TEXT,
      sampleJob: DEMO_JOB_DESCRIPTION
    });
  } catch (err: any) {
    console.error('Demo load error:', err);
    res.status(500).json({ error: err.message || 'Failed to initialize demo analysis.' });
  }
});
