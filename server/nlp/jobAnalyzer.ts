import { JobAnalysis } from '../types.js';
import { SKILL_TAXONOMY } from './skillTaxonomy.js';

export function analyzeJobDescription(jobText: string, customRoleTitle?: string): JobAnalysis {
  const lines = jobText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Role Title heuristic
  let roleTitle = customRoleTitle || '';
  if (!roleTitle) {
    const titleCandidates = lines.slice(0, 5);
    for (const cand of titleCandidates) {
      if (/(?:engineer|developer|architect|designer|scientist|manager|lead|consultant|analyst|specialist|administrator)/i.test(cand) && cand.length < 60) {
        roleTitle = cand.replace(/^(?:job\s+title|position|role):?\s*/i, '').trim();
        break;
      }
    }
  }
  if (!roleTitle) {
    roleTitle = 'Software Engineer';
  }

  // 2. Experience level detection
  let experienceLevel = 'Mid-Level';
  if (/(?:senior|sr\.|lead|principal|staff|architect|director|head\s+of)/i.test(jobText)) {
    experienceLevel = 'Senior';
  } else if (/(?:junior|jr\.|entry\s+level|intern|graduate|associate)/i.test(jobText)) {
    experienceLevel = 'Junior / Entry';
  }

  // 3. Partition sections: Requirements vs Responsibilities vs Nice-to-haves
  const requiredSkillSet = new Set<string>();
  const preferredSkillSet = new Set<string>();
  const toolsSet = new Set<string>();
  const techSet = new Set<string>();
  const qualifications: string[] = [];
  const responsibilities: string[] = [];

  let currentSection: 'req' | 'pref' | 'resp' | 'general' = 'general';

  for (const line of lines) {
    const lower = line.toLowerCase();
    
    // Check section header changes
    if (/(?:preferred\s+qualifications|nice\s+to\s+have|bonus|preferred\s+skills|what\s+would\s+be\s+great)/i.test(lower)) {
      currentSection = 'pref';
      continue;
    } else if (/(?:basic\s+qualifications|minimum\s+qualifications|requirements|must\s+have|what\s+you(?:'ll|\s+will)\s+need|qualifications)/i.test(lower)) {
      currentSection = 'req';
      continue;
    } else if (/(?:responsibilities|what\s+you(?:'ll|\s+will)\s+do|duties|the\s+role|key\s+deliverables)/i.test(lower)) {
      currentSection = 'resp';
      continue;
    }

    // Qualifications lines
    if (/(?:\d+\+?\s+years|degree|bachelor|master|phd|computer\s+science|equivalent\s+experience)/i.test(lower)) {
      qualifications.push(line.replace(/^[-*•]\s*/, ''));
    }

    // Responsibilities lines
    if (currentSection === 'resp' && /^[-*•]/.test(line)) {
      responsibilities.push(line.replace(/^[-*•]\s*/, ''));
    }
  }

  // 4. Scan against Skill Taxonomy with context awareness
  for (const skill of SKILL_TAXONOMY) {
    const aliasesToCheck = [skill.canonical, ...skill.aliases];
    for (const name of aliasesToCheck) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');

      if (regex.test(jobText)) {
        // Classify tool vs tech vs language
        if (skill.category === 'Cloud & DevOps' || skill.category === 'Databases' || skill.category === 'Tools & Methodologies') {
          toolsSet.add(skill.canonical);
        } else {
          techSet.add(skill.canonical);
        }

        // Determine if required or preferred
        // Check if mentioned near "preferred" or "nice to have"
        const prefMatch = new RegExp(`(?:preferred|nice to have|bonus|plus)[^.\\n]{0,80}${escaped}|${escaped}[^.\\n]{0,80}(?:preferred|a plus|bonus)`, 'i');
        if (prefMatch.test(jobText) && !/required|must have|minimum/i.test(jobText)) {
          preferredSkillSet.add(skill.canonical);
        } else {
          requiredSkillSet.add(skill.canonical);
        }
        break;
      }
    }
  }

  // 5. Extract domain keywords
  const keywordCandidates = [
    'Microservices', 'RESTful APIs', 'Scalability', 'System Architecture',
    'Database Optimization', 'High Availability', 'Clean Code', 'Test Driven Development',
    'Object-Oriented Design', 'Code Reviews', 'Continuous Delivery', 'Asynchronous Programming',
    'Concurrency', 'Security Best Practices', 'Performance Tuning', 'Distributed Systems',
    'Cross-functional', 'Full Lifecycle', 'Mentorship', 'Cloud Native'
  ];

  const importantKeywords: string[] = [];
  for (const kw of keywordCandidates) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(jobText)) {
      importantKeywords.push(kw);
    }
  }

  // Fallback defaults if the JD is terse
  if (requiredSkillSet.size === 0 && preferredSkillSet.size === 0) {
    ['Problem Solving', 'Git', 'Software Engineering', 'Communication'].forEach(s => requiredSkillSet.add(s));
  }

  return {
    roleTitle,
    experienceLevel,
    requiredSkills: Array.from(requiredSkillSet),
    preferredSkills: Array.from(preferredSkillSet),
    tools: Array.from(toolsSet),
    technologies: Array.from(techSet),
    qualifications: qualifications.slice(0, 8),
    responsibilities: responsibilities.slice(0, 10),
    importantKeywords,
    rawText: jobText
  };
}
