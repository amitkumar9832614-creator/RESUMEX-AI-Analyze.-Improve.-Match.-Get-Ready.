import { FlaggedPersonalDetail, ParsedResume, ResponsibleAiAudit } from '../types.js';

export function runResponsibleAiAudit(resume: ParsedResume): ResponsibleAiAudit {
  const flaggedItems: FlaggedPersonalDetail[] = [];
  const text = resume.rawText;

  // 1. Age / Date of Birth detection
  const dobRegex = /\b(?:date\s+of\s+birth|dob|birth\s+date|born\s+on|born\s+in)\s*[:\-]?\s*([^\n,;]{4,25})/i;
  const dobMatch = text.match(dobRegex);
  if (dobMatch) {
    flaggedItems.push({
      category: 'Age/DOB',
      detectedSnippet: dobMatch[0].trim(),
      severity: 'warning',
      explanation: 'Date of birth / age disclosure detected. Age is not relevant to job qualifications and can unintentionally invite conscious or unconscious bias.',
      recommendation: 'Remove your date of birth or age. Modern hiring standards in US/EU and global tech firms prioritize relevant technical skills and demonstrable accomplishments.'
    });
  }

  // 2. Marital Status
  const maritalRegex = /\b(?:marital\s+status|marriage|single|married|divorced|widowed)\b/i;
  const maritalMatch = text.match(maritalRegex);
  if (maritalMatch) {
    flaggedItems.push({
      category: 'Marital Status',
      detectedSnippet: maritalMatch[0].trim(),
      severity: 'warning',
      explanation: 'Marital or family status disclosure identified. This has no bearing on professional capability.',
      recommendation: 'Remove marital status. Focus strictly on your engineering achievements and technical skillsets.'
    });
  }

  // 3. Gender / Pronouns / Sex
  const genderRegex = /\b(?:gender|sex)\s*[:\-]\s*(?:male|female|non-binary|other)\b/i;
  const genderMatch = text.match(genderRegex);
  if (genderMatch) {
    flaggedItems.push({
      category: 'Gender/Pronouns',
      detectedSnippet: genderMatch[0].trim(),
      severity: 'warning',
      explanation: 'Explicit gender identification detected.',
      recommendation: 'Omit explicit gender fields to ensure evaluation is conducted purely on merit and qualifications.'
    });
  }

  // 4. Photo Reference
  const photoRegex = /\b(?:photo\s+attached|headshot|photograph|passport\s+photo)\b/i;
  const photoMatch = text.match(photoRegex);
  if (photoMatch) {
    flaggedItems.push({
      category: 'Photo Reference',
      detectedSnippet: photoMatch[0].trim(),
      severity: 'info',
      explanation: 'Reference to a personal photograph or headshot detected.',
      recommendation: 'Most ATS systems and tech recruiters prefer clean, text-based resumes without portrait photos to support blind, unbiased resume reviews.'
    });
  }

  // 5. Religion / Caste / Nationality / National ID
  const nationalIdRegex = /\b(?:ssn|social\s+security\s+number|aadhaar|passport\s+no|national\s+id)\s*[:\-]?\s*\S+/i;
  const idMatch = text.match(nationalIdRegex);
  if (idMatch) {
    flaggedItems.push({
      category: 'National ID',
      detectedSnippet: idMatch[0].trim(),
      severity: 'warning',
      explanation: 'Sensitive identity number (SSN/National ID/Passport) detected.',
      recommendation: 'Never include sensitive national identification numbers on a resume for security and identity protection.'
    });
  }

  const religionRegex = /\b(?:religion|caste|faith)\s*[:\-]\s*[^\n,;]+/i;
  const religionMatch = text.match(religionRegex);
  if (religionMatch) {
    flaggedItems.push({
      category: 'Religion/Origin',
      detectedSnippet: religionMatch[0].trim(),
      severity: 'warning',
      explanation: 'Religious or community background field detected.',
      recommendation: 'Remove religious references to keep evaluation focused squarely on technical competencies.'
    });
  }

  const complianceScore = Math.max(20, 100 - flaggedItems.length * 20);

  return {
    passesAudit: flaggedItems.filter(f => f.severity === 'warning').length === 0,
    score: complianceScore,
    flaggedItems,
    fairHiringNotice: 'RESUMEX AI evaluates resumes strictly on verifiable qualifications, skills, and experience. It never evaluates candidates based on demographic attributes, age, gender, race, or religion, and does not make final employment decisions.'
  };
}
