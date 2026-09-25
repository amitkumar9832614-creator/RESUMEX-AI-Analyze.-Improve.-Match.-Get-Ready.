import { JobAnalysis, ParsedResume, PartialMatch } from '../types.js';
import { SKILL_TAXONOMY, findCanonicalSkill } from './skillTaxonomy.js';

export interface MatchResult {
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: PartialMatch[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
}

export function performJobMatching(resume: ParsedResume, job: JobAnalysis): MatchResult {
  const resumeSkillsLower = new Set(resume.skills.map(s => s.toLowerCase()));
  const allJobSkills = [...job.requiredSkills, ...job.preferredSkills];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const partialSkills: PartialMatch[] = [];

  for (const jobSkill of allJobSkills) {
    const jobSkillDef = findCanonicalSkill(jobSkill);
    const canonicalName = jobSkillDef ? jobSkillDef.canonical : jobSkill;
    const lowerName = canonicalName.toLowerCase();

    // Check exact or alias match in resume
    let isMatched = false;
    if (resumeSkillsLower.has(lowerName)) {
      isMatched = true;
    } else if (jobSkillDef) {
      for (const alias of jobSkillDef.aliases) {
        if (resumeSkillsLower.has(alias.toLowerCase())) {
          isMatched = true;
          break;
        }
      }
    }

    // Also check raw text occurrence
    if (!isMatched) {
      const escaped = canonicalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i').test(resume.rawText)) {
        isMatched = true;
      }
    }

    if (isMatched) {
      if (!matchedSkills.includes(canonicalName)) {
        matchedSkills.push(canonicalName);
      }
    } else {
      // Check for partial/related match
      let foundPartial = false;
      if (jobSkillDef && jobSkillDef.relatedSkills) {
        for (const rel of jobSkillDef.relatedSkills) {
          if (resumeSkillsLower.has(rel.toLowerCase()) || new RegExp(`\\b${rel}\\b`, 'i').test(resume.rawText)) {
            partialSkills.push({
              candidateSkill: rel,
              requiredSkill: canonicalName,
              relationType: `${rel} is in the same technology ecosystem as ${canonicalName}`,
              note: `Candidate has demonstrated proficiency in ${rel}, which provides strong transferable foundations for learning ${canonicalName}.`
            });
            foundPartial = true;
            break;
          }
        }
      }

      if (!foundPartial) {
        if (!missingSkills.includes(canonicalName)) {
          missingSkills.push(canonicalName);
        }
      }
    }
  }

  // Keywords match
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of job.importantKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(resume.rawText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Calculate Match Percentage
  const totalSkills = allJobSkills.length || 1;
  const fullScore = matchedSkills.length * 1.0;
  const partialScore = partialSkills.length * 0.5;
  const matchPercentage = Math.min(100, Math.round(((fullScore + partialScore) / totalSkills) * 100));

  return {
    matchedSkills,
    missingSkills,
    partialSkills,
    matchedKeywords,
    missingKeywords,
    matchPercentage
  };
}
