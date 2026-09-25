import { ContactInfo, EducationItem, ExperienceItem, ParsedResume, ProjectItem } from '../types.js';
import { SKILL_TAXONOMY } from './skillTaxonomy.js';

// Section headers regex mapping
const SECTION_HEADERS: Record<string, RegExp> = {
  summary: /^(?:professional\s+summary|executive\s+summary|summary|profile|about\s+me|career\s+objective|objective)$/i,
  experience: /^(?:experience|work\s+experience|professional\s+experience|employment\s+history|work\s+history|career\s+history)$/i,
  education: /^(?:education|academic\s+background|academics|educational\s+qualifications|degrees)$/i,
  skills: /^(?:skills|technical\s+skills|core\s+competencies|technologies|areas\s+of\s+expertise|skillset|tools\s+&\s+technologies)$/i,
  projects: /^(?:projects|personal\s+projects|academic\s+projects|technical\s+projects|key\s+projects)$/i,
  certifications: /^(?:certifications|certificates|licenses\s+&\s+certifications|professional\s+certifications)$/i,
  achievements: /^(?:achievements|awards|honors\s+&\s+awards|accomplishments|publications)$/i,
  links: /^(?:links|portfolio|profiles|online\s+presence)$/i
};

export function extractContactInfo(text: string): ContactInfo {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstChunk = lines.slice(0, 15).join('\n');

  // Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : undefined;

  // Phone number (US & International)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,14}/;
  const phoneMatch = firstChunk.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : undefined;

  // LinkedIn
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = text.match(linkedinRegex);
  const linkedin = linkedinMatch ? linkedinMatch[0] : undefined;

  // GitHub
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
  const githubMatch = text.match(githubRegex);
  const github = githubMatch ? githubMatch[0] : undefined;

  // Generic Links
  const urlRegex = /(?:https?:\/\/[^\s,]+|(?:www\.)[^\s,]+)/gi;
  const allUrls = text.match(urlRegex) || [];
  const links = Array.from(new Set(allUrls.map(u => u.replace(/[),.;]+$/, ''))));

  // Location heuristic (e.g. San Francisco, CA or Bangalore, India)
  let location: string | undefined;
  const locationRegex = /([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))/;
  for (const line of lines.slice(0, 8)) {
    if (line.includes('@') || line.length > 50) continue;
    const match = line.match(locationRegex);
    if (match) {
      location = match[1].trim();
      break;
    }
  }

  // Name heuristic: Usually the first non-empty line without emails, URLs, or long sentences
  let name = 'Candidate';
  for (const line of lines.slice(0, 5)) {
    if (!line.includes('@') && !line.includes('http') && line.length < 40 && !/resume|curriculum\s+vitae/i.test(line)) {
      name = line.replace(/[^a-zA-Z\s.'-]/g, '').trim();
      if (name.split(' ').length >= 1) break;
    }
  }

  return {
    name: name || 'Candidate',
    email,
    phone,
    location,
    linkedin,
    github,
    portfolio: links.find(l => !l.includes('linkedin') && !l.includes('github')),
    links
  };
}

export function detectSections(rawText: string): ParsedResume {
  const lines = rawText.split('\n').map(l => l.trim());
  const contact = extractContactInfo(rawText);

  // Identify lines that are section headers
  const sectionIndices: { name: string; lineIndex: number }[] = [];

  lines.forEach((line, idx) => {
    if (!line || line.length > 45) return;
    // Strip common decoration like --- or ### or colon
    const cleanLine = line.replace(/^[#\-*_\s:]+|[#\-*_\s:]+$/g, '').trim();
    if (!cleanLine) return;

    for (const [secKey, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(cleanLine)) {
        sectionIndices.push({ name: secKey, lineIndex: idx });
        break;
      }
    }
  });

  // Sort by appearance
  sectionIndices.sort((a, b) => a.lineIndex - b.lineIndex);

  // Group text into sections
  const sectionTexts: Record<string, string[]> = {};
  for (let i = 0; i < sectionIndices.length; i++) {
    const current = sectionIndices[i];
    const next = sectionIndices[i + 1];
    const start = current.lineIndex + 1;
    const end = next ? next.lineIndex : lines.length;
    sectionTexts[current.name] = lines.slice(start, end).filter(Boolean);
  }

  // Parse Summary
  const summary = (sectionTexts['summary'] || []).join(' ').trim();

  // Parse Skills
  const rawSkillLines = (sectionTexts['skills'] || []).join(' ');
  const skillsFound = new Set<string>();
  
  // 1. Scan against taxonomy across full text + skills section
  const textToLower = rawText.toLowerCase();
  for (const skill of SKILL_TAXONOMY) {
    // Check if canonical or alias appears with word boundaries
    const namesToCheck = [skill.canonical, ...skill.aliases];
    for (const name of namesToCheck) {
      // Escape for regex
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (pattern.test(rawText)) {
        skillsFound.add(skill.canonical);
        break;
      }
    }
  }

  // Also parse comma-delimited items from skills section
  if (rawSkillLines) {
    const tokens = rawSkillLines.split(/[,|•·\n]/).map(t => t.trim().replace(/^[-*•]\s*/, ''));
    for (const tok of tokens) {
      if (tok.length > 1 && tok.length < 35 && !tok.includes(':')) {
        skillsFound.add(tok);
      }
    }
  }

  // Parse Experience
  const expLines = sectionTexts['experience'] || [];
  const experience: ExperienceItem[] = [];
  let currentExp: ExperienceItem | null = null;

  for (const line of expLines) {
    const isBullet = /^[-*•·]/.test(line);
    const dateMatch = line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*(?:-|–|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:\d{4}|Present|Current)/i);

    if ((!isBullet && line.length < 80 && (dateMatch || line.includes('|') || line.includes(' - '))) || (!currentExp && !isBullet)) {
      if (currentExp && (currentExp.role || currentExp.bullets.length > 0)) {
        experience.push(currentExp);
      }
      const parts = line.split(/[|–—\-]/).map(p => p.trim());
      currentExp = {
        role: parts[0] || 'Software Engineer',
        company: parts[1] || 'Company',
        duration: dateMatch ? dateMatch[0] : undefined,
        bullets: []
      };
    } else if (currentExp) {
      const cleanBullet = line.replace(/^[-*•·]\s*/, '').trim();
      if (cleanBullet) currentExp.bullets.push(cleanBullet);
    }
  }
  if (currentExp && (currentExp.role || currentExp.bullets.length > 0)) {
    experience.push(currentExp);
  }

  // Parse Education
  const eduLines = sectionTexts['education'] || [];
  const education: EducationItem[] = [];
  let currentEdu: EducationItem | null = null;

  for (const line of eduLines) {
    const degreeMatch = line.match(/(?:bachelor|master|b\.s|b\.e|b\.tech|m\.s|m\.tech|phd|associate|degree|diploma)/i);
    const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/);

    if (degreeMatch || line.includes('University') || line.includes('College') || line.includes('Institute')) {
      if (currentEdu) education.push(currentEdu);
      currentEdu = {
        degree: line,
        institution: '',
        year: yearMatch ? yearMatch[0] : undefined
      };
    } else if (currentEdu) {
      if (!currentEdu.institution) {
        currentEdu.institution = line;
      } else {
        currentEdu.details = (currentEdu.details ? currentEdu.details + '; ' : '') + line;
      }
    }
  }
  if (currentEdu) education.push(currentEdu);

  // Parse Projects
  const projLines = sectionTexts['projects'] || [];
  const projects: ProjectItem[] = [];
  let currentProj: ProjectItem | null = null;

  for (const line of projLines) {
    const isBullet = /^[-*•·]/.test(line);
    if (!isBullet && line.length < 80 && (line.includes('|') || line.includes(':') || !currentProj)) {
      if (currentProj) projects.push(currentProj);
      const name = line.split(/[:|]/)[0].trim();
      currentProj = {
        name: name || 'Technical Project',
        technologies: [],
        description: line,
        bullets: []
      };
      // detect tech in header
      for (const skill of SKILL_TAXONOMY) {
        if (line.toLowerCase().includes(skill.canonical.toLowerCase())) {
          currentProj.technologies.push(skill.canonical);
        }
      }
    } else if (currentProj) {
      const cleanBullet = line.replace(/^[-*•·]\s*/, '').trim();
      if (cleanBullet) currentProj.bullets.push(cleanBullet);
    }
  }
  if (currentProj) projects.push(currentProj);

  // Certifications
  const certifications = (sectionTexts['certifications'] || [])
    .map(c => c.replace(/^[-*•·]\s*/, '').trim())
    .filter(Boolean);

  // Achievements
  const achievements = (sectionTexts['achievements'] || [])
    .map(a => a.replace(/^[-*•·]\s*/, '').trim())
    .filter(Boolean);

  const words = rawText.split(/\s+/).filter(Boolean);

  return {
    contact,
    summary,
    education,
    skills: Array.from(skillsFound),
    experience,
    projects,
    certifications,
    achievements,
    links: contact.links,
    rawText,
    wordCount: words.length
  };
}
