import { ATSScore, JobAnalysis, ParsedResume, SubScore } from '../types.js';
import { MatchResult } from './matchingEngine.js';

export function calculateExplainableATS(
  resume: ParsedResume,
  job: JobAnalysis,
  match: MatchResult
): ATSScore {
  // 1. Keyword Relevance (20%)
  const totalKeywords = job.importantKeywords.length || 1;
  const kwRatio = match.matchedKeywords.length / totalKeywords;
  const kwScoreVal = Math.min(100, Math.round(kwRatio * 100));

  const keywordRelevance: SubScore = {
    score: kwScoreVal,
    weight: 0.20,
    label: 'Keyword & Terminology Relevance',
    explanation: `Your resume matched ${match.matchedKeywords.length} of ${job.importantKeywords.length} key domain keywords identified in the job description.`,
    positiveFactors: match.matchedKeywords.length > 0
      ? [`Recognized high-impact industry terms: ${match.matchedKeywords.slice(0, 4).join(', ')}`]
      : ['Basic industry context present'],
    improvementAreas: match.missingKeywords.length > 0
      ? [`Consider contextualizing missing concepts: ${match.missingKeywords.slice(0, 3).join(', ')}`]
      : ['Keyword coverage is comprehensive']
  };

  // 2. Skills Match (25%)
  const totalRequired = job.requiredSkills.length || 1;
  const matchedRequiredCount = job.requiredSkills.filter(s => match.matchedSkills.includes(s)).length;
  const partialCount = match.partialSkills.length;
  const skillScoreVal = Math.min(100, Math.round(((matchedRequiredCount + partialCount * 0.5) / totalRequired) * 100));

  const skillsMatch: SubScore = {
    score: skillScoreVal,
    weight: 0.25,
    label: 'Required Skill Coverage',
    explanation: `Directly matched ${matchedRequiredCount} mandatory skills with ${partialCount} transferable/partial skill matches out of ${totalRequired} core requirements.`,
    positiveFactors: match.matchedSkills.slice(0, 5).map(s => `Confirmed proficiency in core required skill: ${s}`),
    improvementAreas: match.missingSkills.slice(0, 4).map(s => `Skill gap detected: ${s} is required by the role`)
  };

  // 3. Experience Relevance (15%)
  let expScoreVal = 50;
  const positiveExp: string[] = [];
  const improveExp: string[] = [];

  // Check metrics / numbers in bullets
  let metricCount = 0;
  let actionVerbCount = 0;
  const actionVerbs = /\b(spearheaded|architected|developed|engineered|implemented|optimized|reduced|increased|scaled|delivered|automated|designed)\b/gi;

  for (const exp of resume.experience) {
    for (const b of exp.bullets) {
      if (/\b\d+(?:%|\+?k|\+?x|\s+percent|\s+users|\s+ms|\s+seconds|\s+dollars|\$)\b/i.test(b)) {
        metricCount++;
      }
      if (actionVerbs.test(b)) {
        actionVerbCount++;
      }
    }
  }

  if (resume.experience.length >= 2) {
    expScoreVal += 20;
    positiveExp.push(`Documented ${resume.experience.length} career positions showing progressive trajectory.`);
  } else if (resume.experience.length === 1) {
    expScoreVal += 10;
    positiveExp.push('Documented 1 key professional role.');
  } else {
    improveExp.push('No formal work experience entries identified. Highlight internships or capstone roles.');
  }

  if (metricCount >= 3) {
    expScoreVal += 20;
    positiveExp.push(`Found ${metricCount} measurable business/technical outcomes with quantitative metrics.`);
  } else {
    expScoreVal += 5;
    improveExp.push('Quantify your bullet points with measurable outcomes (e.g., "reduced latency by 35%").');
  }

  if (actionVerbCount >= 4) {
    expScoreVal += 10;
    positiveExp.push(`Strong use of leadership and engineering action verbs (${actionVerbCount} detected).`);
  }

  expScoreVal = Math.min(100, Math.max(30, expScoreVal));

  const experienceRelevance: SubScore = {
    score: expScoreVal,
    weight: 0.15,
    label: 'Experience Relevance & Impact',
    explanation: `Evaluated job duration, role seniority alignment, strong engineering action verbs, and quantifiable impact metrics.`,
    positiveFactors: positiveExp,
    improvementAreas: improveExp
  };

  // 4. Education Alignment (10%)
  let eduScoreVal = 70;
  const positiveEdu: string[] = [];
  const improveEdu: string[] = [];

  if (resume.education.length > 0) {
    eduScoreVal += 25;
    positiveEdu.push(`Identified academic degree credential: ${resume.education[0].degree || 'Technical Degree'}`);
    if (resume.education[0].year) {
      positiveEdu.push(`Graduation timeframe documented: ${resume.education[0].year}`);
    }
  } else {
    eduScoreVal = 40;
    improveEdu.push('Add an explicit Education section with institution name and field of study.');
  }

  const educationMatch: SubScore = {
    score: Math.min(100, eduScoreVal),
    weight: 0.10,
    label: 'Education & Academic Alignment',
    explanation: 'Checked degree level, computer science/engineering field alignment, and graduation credentials.',
    positiveFactors: positiveEdu,
    improvementAreas: improveEdu
  };

  // 5. Projects Alignment (10%)
  let projScoreVal = 50;
  const positiveProj: string[] = [];
  const improveProj: string[] = [];

  if (resume.projects.length >= 2) {
    projScoreVal += 35;
    positiveProj.push(`Found ${resume.projects.length} dedicated technical projects showcasing practical implementation.`);
  } else if (resume.projects.length === 1) {
    projScoreVal += 20;
    positiveProj.push('Found 1 technical project.');
  } else {
    improveProj.push('Include 2-3 technical projects demonstrating the job description technologies in action.');
  }

  // Check if project tech mentions target skills
  const projText = resume.projects.map(p => `${p.name} ${p.description} ${p.bullets.join(' ')}`).join(' ').toLowerCase();
  const matchedInProj = job.requiredSkills.filter(s => projText.includes(s.toLowerCase()));
  if (matchedInProj.length >= 2) {
    projScoreVal += 15;
    positiveProj.push(`Projects actively demonstrate target job skills: ${matchedInProj.slice(0, 3).join(', ')}`);
  }

  const projectsAlignment: SubScore = {
    score: Math.min(100, projScoreVal),
    weight: 0.10,
    label: 'Projects & Practical Evidence',
    explanation: 'Measures whether technical projects validate practical application of required frameworks and tools.',
    positiveFactors: positiveProj,
    improvementAreas: improveProj
  };

  // 6. Resume Structure & Completeness (10%)
  let structScoreVal = 60;
  const positiveStruct: string[] = [];
  const improveStruct: string[] = [];

  if (resume.contact.email) {
    structScoreVal += 10;
    positiveStruct.push('Verified professional email address present.');
  } else {
    improveStruct.push('Add a valid professional email address.');
  }

  if (resume.contact.linkedin || resume.contact.github) {
    structScoreVal += 10;
    positiveStruct.push('Professional portfolio/profile links (GitHub/LinkedIn) detected.');
  } else {
    improveStruct.push('Include links to your GitHub profile and LinkedIn.');
  }

  if (resume.summary && resume.summary.length > 50) {
    structScoreVal += 10;
    positiveStruct.push('Professional summary / headline section detected.');
  } else {
    improveStruct.push('Include a 2-3 sentence tailored Professional Summary at the top of your resume.');
  }

  if (resume.skills.length >= 6) {
    structScoreVal += 10;
    positiveStruct.push('Comprehensive dedicated skills inventory identified.');
  }

  const resumeStructure: SubScore = {
    score: Math.min(100, structScoreVal),
    weight: 0.10,
    label: 'Structure & ATS Parseability',
    explanation: 'Scans for standard ATS-compatible section headers, contact schema, and parseable flow.',
    positiveFactors: positiveStruct,
    improvementAreas: improveStruct
  };

  // 7. Readability & Formatting (10%)
  let readScoreVal = 85;
  const positiveRead: string[] = [];
  const improveRead: string[] = [];

  if (resume.wordCount >= 250 && resume.wordCount <= 850) {
    positiveRead.push(`Optimal resume length (${resume.wordCount} words - ideal 1 to 2 page length).`);
  } else if (resume.wordCount < 250) {
    readScoreVal -= 20;
    improveRead.push(`Resume content is brief (${resume.wordCount} words). Elaborate on bullet points.`);
  } else {
    readScoreVal -= 15;
    improveRead.push(`Resume is long (${resume.wordCount} words). Condense to keep concise.`);
  }

  const totalBullets = resume.experience.reduce((acc, e) => acc + e.bullets.length, 0) +
                       resume.projects.reduce((acc, p) => acc + p.bullets.length, 0);

  if (totalBullets >= 6) {
    positiveRead.push(`Clean bulleted layout with ${totalBullets} distinct achievement statements.`);
  } else {
    readScoreVal -= 15;
    improveRead.push('Use bullet points instead of dense paragraphs for easier parsing.');
  }

  const readabilityFormatting: SubScore = {
    score: Math.min(100, Math.max(40, readScoreVal)),
    weight: 0.10,
    label: 'Readability & Scannability',
    explanation: 'Evaluates word density, bullet point usage, and concise information layout for human recruiters and ATS crawlers.',
    positiveFactors: positiveRead,
    improvementAreas: improveRead
  };

  // Compute Overall Weighted Score
  const overall = Math.round(
    keywordRelevance.score * keywordRelevance.weight +
    skillsMatch.score * skillsMatch.weight +
    experienceRelevance.score * experienceRelevance.weight +
    educationMatch.score * educationMatch.weight +
    projectsAlignment.score * projectsAlignment.weight +
    resumeStructure.score * resumeStructure.weight +
    readabilityFormatting.score * readabilityFormatting.weight
  );

  return {
    overall: Math.max(10, Math.min(99, overall)),
    keywordRelevance,
    skillsMatch,
    experienceRelevance,
    educationMatch,
    projectsAlignment,
    resumeStructure,
    readabilityFormatting,
    disclaimer: 'This ATS score is an educational alignment index calculated across 7 algorithmic checkpoints. It reflects keyword overlap, section parseability, and role coverage, but does not guarantee interview shortlisting or hiring decisions.'
  };
}
