import { JobAnalysis, ParsedResume, SkillGap } from '../types.js';
import { MatchResult } from './matchingEngine.js';
import { findCanonicalSkill } from './skillTaxonomy.js';

export function generateSkillGaps(
  resume: ParsedResume,
  job: JobAnalysis,
  match: MatchResult
): SkillGap[] {
  const gaps: SkillGap[] = [];

  // Iterate over missing skills
  for (const skillName of match.missingSkills) {
    const isRequired = job.requiredSkills.includes(skillName);
    const def = findCanonicalSkill(skillName);
    const priority: 'HIGH' | 'MEDIUM' | 'LOW' = isRequired ? 'HIGH' : 'MEDIUM';

    // Current evidence
    const partialFound = match.partialSkills.find(p => p.requiredSkill.toLowerCase() === skillName.toLowerCase());
    const currentEvidence = partialFound
      ? `Found transferable experience in ${partialFound.candidateSkill}, but direct hands-on mention of ${skillName} is absent.`
      : `No explicit mention or project evidence of ${skillName} was detected in your resume sections.`;

    const whyItMatters = isRequired
      ? `${skillName} is explicitly listed as a mandatory core requirement for ${job.roleTitle}. Lack of evidence could cause ATS keyword filters to rank your profile lower.`
      : `${skillName} is a strongly preferred capability that elevates candidate competitiveness for modern ${job.roleTitle} teams.`;

    const learningTopics = def
      ? [
          `${def.canonical} core architecture & fundamentals`,
          `Production patterns, state handling, and error resilience`,
          `Testing, continuous deployment, and industry best practices with ${def.canonical}`
        ]
      : [
          `${skillName} fundamentals and official documentation`,
          `Practical implementation in real-world scenarios`,
          `Integration with related tech stack components`
        ];

    const suggestedProject = `Build a containerized ${job.roleTitle} prototype incorporating ${skillName} with real data endpoints, automated unit tests, and a clear GitHub README demonstration.`;

    gaps.push({
      id: `gap-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      skill: skillName,
      priority,
      category: def ? def.category : 'Technical Skills',
      whyItMatters,
      currentEvidence,
      recommendedLearning: learningTopics,
      suggestedProject,
      estimatedDifficulty: def ? def.learningDifficulty : 'Intermediate',
      estimatedTimeToLearn: def?.learningDifficulty === 'Advanced' ? '3-5 weeks' : def?.learningDifficulty === 'Intermediate' ? '2-3 weeks' : '1-2 weeks'
    });
  }

  // Also include partially matched skills as LOW or MEDIUM priority gaps
  for (const partial of match.partialSkills) {
    // only if not already in gaps
    if (!gaps.some(g => g.skill.toLowerCase() === partial.requiredSkill.toLowerCase())) {
      const def = findCanonicalSkill(partial.requiredSkill);
      gaps.push({
        id: `gap-partial-${partial.requiredSkill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        skill: partial.requiredSkill,
        priority: 'LOW',
        category: def ? def.category : 'Technical Skills',
        whyItMatters: `You know ${partial.candidateSkill}, so bridging the gap to ${partial.requiredSkill} is high-leverage and fast to demonstrate.`,
        currentEvidence: partial.note,
        recommendedLearning: [
          `Syntax & paradigm comparison between ${partial.candidateSkill} and ${partial.requiredSkill}`,
          `Idiomatic standard libraries and ecosystem patterns`,
          `Port an existing ${partial.candidateSkill} project to ${partial.requiredSkill}`
        ],
        suggestedProject: `Port or extend one of your existing ${partial.candidateSkill} projects to ${partial.requiredSkill} to showcase cross-stack agility.`,
        estimatedDifficulty: 'Beginner',
        estimatedTimeToLearn: '3-7 days'
      });
    }
  }

  // Sort: HIGH first, then MEDIUM, then LOW
  const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  return gaps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
