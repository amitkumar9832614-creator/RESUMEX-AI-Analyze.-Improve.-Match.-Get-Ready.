import { FullAnalysisReport, WhatIfSimulationResult } from '../types.js';
import { calculateExplainableATS } from './atsScorer.js';
import { performJobMatching } from './matchingEngine.js';

export function runWhatIfSimulation(
  analysis: FullAnalysisReport,
  skillsToAdd: string[]
): WhatIfSimulationResult {
  const currentSkills = new Set(analysis.parsedResume.skills.map(s => s.toLowerCase()));
  const simulatedResume = {
    ...analysis.parsedResume,
    skills: [...analysis.parsedResume.skills],
    rawText: analysis.parsedResume.rawText + '\n' + skillsToAdd.join(', ')
  };

  const addedValidSkills: string[] = [];
  for (const s of skillsToAdd) {
    if (!currentSkills.has(s.toLowerCase())) {
      simulatedResume.skills.push(s);
      addedValidSkills.push(s);
    }
  }

  // Re-run matching with simulated skills
  const simulatedMatchResult = performJobMatching(simulatedResume, analysis.parsedJob);
  const simulatedATS = calculateExplainableATS(simulatedResume, analysis.parsedJob, simulatedMatchResult);

  const originalScore = analysis.atsScore.overall;
  const simulatedScore = simulatedATS.overall;
  const originalMatch = analysis.matchPercentage;
  const simulatedMatch = simulatedMatchResult.matchPercentage;
  const scoreDelta = simulatedScore - originalScore;

  // Determine which newly added skills matched requirements
  const newlyMatchedSkills = addedValidSkills.filter(s =>
    analysis.parsedJob.requiredSkills.some(req => req.toLowerCase() === s.toLowerCase()) ||
    analysis.parsedJob.preferredSkills.some(pref => pref.toLowerCase() === s.toLowerCase())
  );

  let impactExplanation = '';
  if (newlyMatchedSkills.length > 0) {
    impactExplanation = `Adding ${newlyMatchedSkills.join(', ')} directly satisfies ${newlyMatchedSkills.length} requirement(s) from the job description, projecting an estimated +${scoreDelta} point ATS index improvement.`;
  } else {
    impactExplanation = `The simulated skills expand your versatility, but did not match explicit keywords requested in this specific job description.`;
  }

  return {
    addedSkills: addedValidSkills,
    originalScore,
    simulatedScore,
    originalMatch,
    simulatedMatch,
    scoreDelta,
    impactExplanation,
    newlyMatchedSkills,
    remainingGaps: simulatedMatchResult.missingSkills,
    simulationDisclaimer: 'This is an educational alignment simulation illustrating how targeted competencies bridge job description criteria. It reflects theoretical parse matching and is not a guarantee or prediction of employment success.'
  };
}
