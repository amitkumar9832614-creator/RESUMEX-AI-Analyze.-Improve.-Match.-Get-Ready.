import { GoogleGenAI } from '@google/genai';
import {
  CareerRoadmap,
  InterviewPrep,
  InterviewQuestion,
  JobAnalysis,
  ParsedResume,
  ResumeDoctorSection,
  SkillGap
} from '../types.js';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function callWithTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs)
    ),
  ]);
}

// -------------------------------------------------------------
// 1. AI RESUME DOCTOR
// -------------------------------------------------------------
export async function generateResumeDoctorSuggestions(
  resume: ParsedResume,
  job: JobAnalysis
): Promise<ResumeDoctorSection[]> {
  const sections: ResumeDoctorSection[] = [];

  // 1. Professional Summary Section
  const summarySnippet = resume.summary || 'Summary section currently missing from resume.';
  let summaryCritique = '';
  let summaryImproved = '';

  if (ai) {
    try {
      const prompt = `You are RESUMEX AI Resume Doctor, an expert hiring consultant.
Analyze this candidate's Professional Summary for the target role: "${job.roleTitle}".

Candidate Summary:
"${summarySnippet}"

Key Skills from their resume: ${resume.skills.slice(0, 8).join(', ')}
Target Role Requirements: ${job.requiredSkills.slice(0, 6).join(', ')}

RULES:
- NEVER fabricate experience, companies, or degrees.
- NEVER invent achievements they did not claim.
- Emphasize role-specific terminology and factual strengths.
- Output a JSON object with keys:
  "critique": "2 sentences explaining strengths and weaknesses",
  "suggestedImprovement": "A concise, 3-4 sentence professional summary tailored to ${job.roleTitle} emphasizing their real skills"`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        }),
        6000
      );

      if (response.text) {
        const parsed = JSON.parse(response.text);
        summaryCritique = parsed.critique;
        summaryImproved = parsed.suggestedImprovement;
      }
    } catch (e) {
      console.warn('Gemini summary doctor fallback activated:', e);
    }
  }

  // Fallback if AI was unavailable
  if (!summaryImproved) {
    if (!resume.summary) {
      summaryCritique = 'Your resume is missing a Professional Summary. A concise executive summary at the top anchors your technical identity and immediately validates target role alignment.';
      summaryImproved = `Results-driven ${job.roleTitle} with demonstrated expertise in ${resume.skills.slice(0, 4).join(', ') || 'modern software engineering'}. Proven track record designing scalable solutions, executing clean architectural patterns, and collaborating across cross-functional teams to deliver production-ready software.`;
    } else {
      summaryCritique = 'Your summary provides a general overview, but can be significantly sharpened by leading with your target title and citing specific technical proficiencies.';
      summaryImproved = `Forward-thinking ${job.roleTitle} specializing in ${resume.skills.slice(0, 3).join(', ')}. Experienced in building high-performance applications, streamlining development workflows, and applying modern software engineering standards to deliver measurable business value.`;
    }
  }

  sections.push({
    id: 'doctor-summary',
    sectionName: 'Professional Summary',
    healthStatus: resume.summary && resume.summary.length > 40 ? 'needs_improvement' : 'critical',
    currentSnippet: summarySnippet,
    critique: summaryCritique,
    suggestedImprovement: summaryImproved,
    strengths: ['Identifies core technical identity', 'Eliminates passive buzzwords', 'Directly addresses target job requirements'],
    recommendations: [
      'Lead with your target role title in the first sentence',
      'Mention your top 3-4 high-relevance technologies explicitly',
      'Keep length between 3 and 4 sentences max'
    ]
  });

  // 2. Experience Section Improvements
  if (resume.experience.length > 0) {
    const firstExp = resume.experience[0];
    const bulletBefore = firstExp.bullets[0] || 'Developed software modules and assisted team with bug fixes.';

    let bulletCritique = 'Bullet points currently lack quantified business impact and strong active engineering verbs.';
    let bulletAfter = `Architected and deployed high-throughput features using ${resume.skills.slice(0, 2).join(' and ') || 'modern frameworks'}, improving operational performance by 25% and reducing runtime errors.`;

    if (ai && firstExp.bullets.length > 0) {
      try {
        const expPrompt = `You are RESUMEX AI Resume Doctor.
Rewrite this real resume bullet point for maximum impact for a ${job.roleTitle} role:
"${bulletBefore}"

Context:
Role: ${firstExp.role} at ${firstExp.company}
Available skills from candidate: ${resume.skills.slice(0, 6).join(', ')}

RULES:
- Preserve factual truth (do not invent unearned positions or degrees).
- Transform passive wording into strong Google/Amazon style XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]").
- Return JSON:
  "critique": "brief critique",
  "after": "improved bullet point",
  "actionVerb": "verb used",
  "quantHint": "metric explanation"`;

        const expRes = await callWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: expPrompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3
            }
          }),
          6000
        );

        if (expRes.text) {
          const parsed = JSON.parse(expRes.text);
          bulletCritique = parsed.critique;
          bulletAfter = parsed.after;
        }
      } catch (e) {
        console.warn('Gemini exp doctor fallback activated:', e);
      }
    }

    sections.push({
      id: 'doctor-experience',
      sectionName: 'Professional Experience',
      healthStatus: firstExp.bullets.some(b => /\d+%|\d+x/.test(b)) ? 'optimal' : 'needs_improvement',
      currentSnippet: `${firstExp.role} at ${firstExp.company}\n• ${bulletBefore}`,
      critique: bulletCritique,
      suggestedImprovement: `• ${bulletAfter}`,
      bulletImprovements: [
        {
          before: bulletBefore,
          after: bulletAfter,
          rationale: 'Replaces passive descriptive language with the standard Google XYZ formula (Accomplished X by doing Y measured by Z).',
          actionVerbAdded: 'Architected / Engineered',
          quantificationHint: 'Attach a concrete baseline metric (e.g. latency, throughput, time-saved, user adoption).'
        }
      ],
      strengths: ['Uses strong action verbs at the start of each bullet', 'Clarifies technical implementation mechanism'],
      recommendations: [
        'Replace "Assisted with" or "Responsible for" with "Engineered", "Optimized", or "Orchestrated"',
        'Include at least one measurable percentage, time savings, or volume metric per role'
      ]
    });
  }

  // 3. Technical Skills Section
  const skillsSnippet = resume.skills.join(', ') || 'No categorized skills section found.';
  sections.push({
    id: 'doctor-skills',
    sectionName: 'Technical Skills Taxonomy',
    healthStatus: resume.skills.length >= 8 ? 'optimal' : 'needs_improvement',
    currentSnippet: skillsSnippet,
    critique: 'Skills are most effective for ATS parsers when categorized into distinct domains (Languages, Frameworks, Cloud/DevOps, Databases) rather than an unstructured paragraph.',
    suggestedImprovement: `Languages: ${resume.skills.filter(s => ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'C++', 'Go'].includes(s)).join(', ') || 'Python, JavaScript, SQL'}
Frameworks & Libraries: ${resume.skills.filter(s => ['React', 'Node.js', 'FastAPI', 'Express', 'Django', 'Spring Boot'].includes(s)).join(', ') || 'React, Node.js, Express'}
Cloud & Infrastructure: ${resume.skills.filter(s => ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Git'].includes(s)).join(', ') || 'Docker, AWS, Git'}
Databases: ${resume.skills.filter(s => ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'].includes(s)).join(', ') || 'PostgreSQL, Redis'}`,
    strengths: ['Categorized hierarchy allows both ATS regex and human recruiters to quickly verify domain depth.'],
    recommendations: [
      'Group skills into Languages, Frameworks, Cloud/DevOps, and Databases',
      'Remove outdated or universal basics like "Microsoft Word" or "Email"'
    ]
  });

  return sections;
}

// -------------------------------------------------------------
// 2. PERSONALIZED INTERVIEW PREPARATION
// -------------------------------------------------------------
export async function generatePersonalizedInterviewPrep(
  resume: ParsedResume,
  job: JobAnalysis,
  gaps: SkillGap[]
): Promise<InterviewPrep> {
  let questions: InterviewQuestion[] = [];

  if (ai) {
    try {
      const topGaps = gaps.slice(0, 3).map(g => g.skill).join(', ');
      const candidateProjects = resume.projects.map(p => p.name).join(', ') || 'Software Engineering Projects';
      const prompt = `You are a Principal Hiring Manager interviewing a candidate for "${job.roleTitle}".
Generate 5 highly tailored interview questions based strictly on this candidate's profile:
- Candidate skills: ${resume.skills.slice(0, 8).join(', ')}
- Candidate projects: ${candidateProjects}
- Target job requirements: ${job.requiredSkills.slice(0, 6).join(', ')}
- Skill gaps detected: ${topGaps}

Generate 1 question in each of these 5 categories:
1. Technical (testing depth in a skill they claim)
2. Behavioral (STAR method regarding engineering tradeoffs or challenges)
3. Project-based (referencing their actual project or stack)
4. HR (culture, motivation for this role, career goals)
5. Role-specific (testing how they approach a core responsibility of ${job.roleTitle})

Return JSON array of 5 objects with keys:
"category": ("Technical"|"Behavioral"|"Project-based"|"HR"|"Role-specific"),
"question": string,
"context": string (why this matters for their profile),
"whyAsked": string (what the interviewer is evaluating),
"modelGuidance": string (clear preparation tips and how to frame the response),
"keyPointsToCover": string[] (3 bullet points),
"difficulty": ("Easy"|"Medium"|"Hard")`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4
          }
        }),
        6000
      );

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed.map((q: any, i: number) => ({
            id: `q-${i + 1}`,
            category: q.category || 'Technical',
            question: q.question,
            context: q.context || `Tailored to ${job.roleTitle}`,
            whyAsked: q.whyAsked || 'Evaluating technical and communication competence',
            modelGuidance: q.modelGuidance || 'Use concrete examples and structure your thoughts clearly.',
            keyPointsToCover: Array.isArray(q.keyPointsToCover) ? q.keyPointsToCover : ['Core concept', 'Trade-offs', 'Outcome'],
            difficulty: q.difficulty || 'Medium'
          }));
        }
      }
    } catch (e) {
      console.warn('Gemini interview prep fallback activated:', e);
    }
  }

  // Fallback questions if AI was offline or empty
  if (questions.length === 0) {
    const primarySkill = resume.skills[0] || 'Python';
    const firstProj = resume.projects[0]?.name || 'Full-Stack Application';
    const topGap = gaps[0]?.skill || 'System Architecture';

    questions = [
      {
        id: 'q-1',
        category: 'Technical',
        question: `How do you handle error handling, concurrency, and performance optimization when developing services with ${primarySkill}?`,
        context: `You listed ${primarySkill} as a core competency on your resume.`,
        whyAsked: `Tests whether your knowledge extends beyond syntax to real-world production reliability and runtime characteristics.`,
        modelGuidance: `Discuss specific debugging techniques, logging strategies, and asynchronous vs synchronous patterns in ${primarySkill}.`,
        keyPointsToCover: [
          `Error isolation and exception hierarchies`,
          `Memory management or event-loop considerations`,
          `Unit testing and mock coverage strategies`
        ],
        difficulty: 'Medium'
      },
      {
        id: 'q-2',
        category: 'Behavioral',
        question: 'Describe a situation where a technical requirement changed right before a release deadline. How did you adapt?',
        context: 'Relevant for agile product environments.',
        whyAsked: 'Evaluates resilience, stakeholder communication, and pragmatic engineering trade-offs under pressure.',
        modelGuidance: 'Structure your answer using the STAR method: Situation, Task, Action, and measurable Result.',
        keyPointsToCover: [
          'How you triaged scope vs quality',
          'How you kept teammates and product managers informed',
          'What retrospectives or guardrails were established afterward'
        ],
        difficulty: 'Medium'
      },
      {
        id: 'q-3',
        category: 'Project-based',
        question: `In your project "${firstProj}", what was the most difficult architectural decision you had to make, and what trade-offs did you accept?`,
        context: `Directly references the project listed in your resume.`,
        whyAsked: 'Verifies hands-on ownership and critical thinking rather than following a copy-pasted tutorial.',
        modelGuidance: 'Be candid about alternatives considered. Interviewers value candidates who articulate trade-offs clearly.',
        keyPointsToCover: [
          'Alternative libraries or database patterns evaluated',
          'The performance or scalability bottleneck encountered',
          'What you would do differently in version 2.0'
        ],
        difficulty: 'Hard'
      },
      {
        id: 'q-4',
        category: 'HR',
        question: `What motivated you to target this ${job.roleTitle} opportunity, and how does it fit into your continuous learning goals?`,
        context: `Assesses career trajectory and culture fit.`,
        whyAsked: 'Gauges genuine engagement with the domain and team mission.',
        modelGuidance: 'Tie your passion to specific technological challenges the team faces.',
        keyPointsToCover: [
          `Excitement about solving problems at ${job.roleTitle} scale`,
          'Commitment to continuous skill acquisition',
          'Collaborative work ethics'
        ],
        difficulty: 'Easy'
      },
      {
        id: 'q-5',
        category: 'Role-specific',
        question: `The job description emphasizes ${topGap}. If tasked with shipping a feature requiring this technology next week, how would you rapidly ramp up and ensure high quality?`,
        context: `Directly targets the detected skill gap in ${topGap}.`,
        whyAsked: 'Evaluates self-directed learning velocity and proactive de-risking.',
        modelGuidance: 'Show that you leverage transferable fundamentals while quickly validating understanding with POCs.',
        keyPointsToCover: [
          'Reference your strong foundations in related technologies',
          'Methodology for reading documentation and implementing a small proof-of-concept',
          'Seeking code reviews from senior domain experts to validate best practices'
        ],
        difficulty: 'Medium'
      }
    ];
  }

  return {
    roleTitle: job.roleTitle,
    totalQuestions: questions.length,
    questions,
    starMethodTips: [
      'Situation: Set the scene in 1-2 sentences with relevant context.',
      'Task: Clearly define your specific responsibility and the challenge.',
      'Action: Detail the technical decisions, code, and collaboration YOU executed.',
      'Result: Conclude with quantified outcomes, lessons learned, or business impact.'
    ],
    preparationNotice: 'These questions are generated based on your real resume experiences and target job requirements for interview preparation. They are practice simulations and not official company interview prompts.'
  };
}

// -------------------------------------------------------------
// 3. PERSONALIZED CAREER ROADMAP
// -------------------------------------------------------------
export async function generatePersonalizedRoadmap(
  job: JobAnalysis,
  gaps: SkillGap[]
): Promise<CareerRoadmap> {
  const topGaps = gaps.slice(0, 4);

  let weeks: any[] = [];

  if (ai && topGaps.length > 0) {
    try {
      const prompt = `You are a Technical Career Coach.
Create a structured 6-Week Learning Roadmap for a candidate aiming to become a "${job.roleTitle}".
The candidate needs to close these specific skill gaps:
${topGaps.map(g => `- ${g.skill} (${g.priority} priority, category: ${g.category})`).join('\n')}

Target Role: ${job.roleTitle}

Format as a JSON array of 6 weekly milestone objects:
[
  {
    "weekNumber": 1,
    "title": "Short descriptive title",
    "focusArea": "Core domain",
    "skillsTargeted": ["Skill1"],
    "learningObjectives": ["Objective 1", "Objective 2"],
    "handsOnProject": "Specific deliverable project",
    "estimatedHours": 10,
    "checkpointDeliverable": "Clear verification milestone"
  }
]`;

      const response = await callWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        }),
        6000
      );

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed) && parsed.length === 6) {
          weeks = parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini roadmap fallback activated:', e);
    }
  }

  // Fallback 6-week curriculum if AI is offline
  if (weeks.length === 0) {
    const gap1 = topGaps[0]?.skill || 'Core Architecture';
    const gap2 = topGaps[1]?.skill || 'API Engineering';
    const gap3 = topGaps[2]?.skill || 'Docker & Cloud Deployment';

    weeks = [
      {
        weekNumber: 1,
        title: `${gap1} Core Foundations`,
        focusArea: 'Foundational Knowledge & Syntax',
        skillsTargeted: [gap1],
        learningObjectives: [
          `Master core principles, runtime execution model, and standard libraries of ${gap1}`,
          'Build 3 mini-exercises implementing core patterns',
          'Read official documentation and architectural conventions'
        ],
        handsOnProject: `Implement a standalone CLI or core module showcasing ${gap1} fundamentals.`,
        estimatedHours: 8,
        checkpointDeliverable: 'Passing unit test suite verifying fundamental logic.'
      },
      {
        weekNumber: 2,
        title: `${gap2} Deep Dive & Best Practices`,
        focusArea: 'Production Architecture',
        skillsTargeted: [gap2],
        learningObjectives: [
          `Understand idiomatic design patterns and concurrency/async handling in ${gap2}`,
          'Integrate robust error boundaries and schema validation',
          'Implement structured logging and environment configurations'
        ],
        handsOnProject: `Develop an API service with ${gap2} implementing CRUD, authentication, and validation.`,
        estimatedHours: 10,
        checkpointDeliverable: 'Clean GitHub repository with Swagger/OpenAPI documentation.'
      },
      {
        weekNumber: 3,
        title: `${gap3} & Infrastructure Integration`,
        focusArea: 'DevOps & Containerization',
        skillsTargeted: [gap3],
        learningObjectives: [
          `Write optimized multi-stage Dockerfiles and container configurations`,
          'Manage environmental secrets and configuration safely',
          'Set up automated GitHub Actions workflow to lint and build automatically'
        ],
        handsOnProject: `Containerize your services with Docker Compose and publish to a container registry.`,
        estimatedHours: 10,
        checkpointDeliverable: 'Working Docker container running locally with one-command launch.'
      },
      {
        weekNumber: 4,
        title: 'Full-Stack Integration & Database Scaling',
        focusArea: 'Data Layer & System Design',
        skillsTargeted: ['Database Optimization', 'Caching'],
        learningObjectives: [
          'Design normalized database schemas with foreign keys and indexes',
          'Implement Redis caching layer for high-read endpoints',
          'Measure response time improvements under simulated load'
        ],
        handsOnProject: 'Connect PostgreSQL and Redis with your services, achieving sub-50ms query benchmarks.',
        estimatedHours: 12,
        checkpointDeliverable: 'Query execution benchmark report showing 2x speedup.'
      },
      {
        weekNumber: 5,
        title: 'Capstone Project Implementation',
        focusArea: 'Portfolio Showcase',
        skillsTargeted: [gap1, gap2, gap3],
        learningObjectives: [
          `Synthesize all target skills into a cohesive, production-grade ${job.roleTitle} application`,
          'Write comprehensive integration tests covering critical user paths',
          'Write a recruiter-ready README featuring architecture diagrams and live demo link'
        ],
        handsOnProject: `Complete full capstone web application deployed to Cloud Run or Render with live URL.`,
        estimatedHours: 14,
        checkpointDeliverable: 'Live public demo URL and polished GitHub repository.'
      },
      {
        weekNumber: 6,
        title: 'Resume Update & Mock Interview Readiness',
        focusArea: 'Career Launch & Technical Polish',
        skillsTargeted: ['System Design', 'Technical Communication'],
        learningObjectives: [
          'Update your resume with new capstone project metrics and newly validated skills',
          'Conduct 3 timed mock interview sessions covering Technical and System Design prompts',
          'Practice explaining your architectural tradeoffs concisely using the STAR technique'
        ],
        handsOnProject: 'Updated resume version ready for application submissions.',
        estimatedHours: 8,
        checkpointDeliverable: 'Final ATS analysis re-run on RESUMEX AI achieving 85%+ score.'
      }
    ];
  }

  return {
    roleTitle: job.roleTitle,
    durationWeeks: 6,
    weeks,
    targetMilestones: [
      `Week 2: Functional API demonstration with ${topGaps[0]?.skill || 'core requirements'}`,
      'Week 4: Automated CI/CD and containerized workflow active',
      'Week 5: Public capstone deployed with recruiter-ready documentation',
      'Week 6: Ready for high-confidence technical interviews'
    ]
  };
}
