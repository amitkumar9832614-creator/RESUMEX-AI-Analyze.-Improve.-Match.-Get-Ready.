import { FullAnalysisReport, JobAnalysis, ParsedResume, UserAccount } from '../types.js';

// Pre-seeded demo resume text
export const DEMO_RESUME_TEXT = `ALEX RIVERA
San Francisco, CA | (415) 555-0192 | alex.rivera@email.com
linkedin.com/in/alex-rivera-dev | github.com/alexrivera-tech

PROFESSIONAL SUMMARY
Results-oriented Software Engineer with 2+ years of experience designing and implementing scalable web applications, RESTful microservices, and modern user interfaces. Proficient in Python, JavaScript, React, and SQL, with a passion for clean code and performance optimization.

WORK EXPERIENCE
Software Engineer | NexaTech Solutions | June 2022 - Present | San Francisco, CA
• Engineered high-performance backend microservices using Python and Flask, reducing API response times by 32% across 200,000 daily active users.
• Developed responsive frontend dashboards in React and Tailwind CSS, increasing user session engagement by 24%.
• Optimized SQL database queries and implemented caching strategies, cutting database server CPU load by 40%.
• Collaborated in an Agile Scrum team of 7 engineers, participating in code reviews, automated CI/CD pipeline deployments, and sprint planning.

Junior Developer | CloudScale Labs | August 2021 - May 2022 | San Jose, CA
• Built REST API endpoints in Node.js and Express to ingest and process telemetry data from 5,000+ IoT edge nodes.
• Wrote automated unit tests with Jest achieving 88% code test coverage across core modules.
• Maintained Git repository branching workflows and resolved 40+ client-facing bug tickets.

TECHNICAL PROJECTS
Distributed Task Queue Engine | Python, Redis, Docker
• Built an asynchronous task distribution system in Python utilizing Redis pub/sub to handle background batch jobs.
• Containerized services using Docker and Docker Compose for seamless multi-container local testing and deployment.
• Handled peak throughput of 1,200 background jobs per minute with zero task drop rate.

Real-time Analytics Dashboard | React, TypeScript, WebSockets
• Created a responsive live telemetry visualization interface with interactive charts and WebSocket data streaming.
• Implemented client-side state management using Redux Toolkit to maintain 60 FPS rendering under heavy data flow.

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis | Graduated May 2021

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3, Bash
Frameworks: React, Node.js, Express, Flask, Tailwind CSS
Databases: PostgreSQL, MySQL, Redis, SQLite
DevOps & Tools: Docker, Git, GitHub Actions, Linux, REST API, Agile`;

// Pre-seeded target job description
export const DEMO_JOB_DESCRIPTION = `Role: Full-Stack Software Engineer
Company: Apex Innovations
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking a talented Software Engineer to join our core product engineering team. You will be responsible for architecting and deploying robust backend microservices, building intuitive React frontends, and scaling our cloud infrastructure.

Key Responsibilities:
• Design, develop, and maintain production-ready RESTful APIs and backend services using Python and FastAPI.
• Build scalable, modern, and accessible user interfaces using React, TypeScript, and modern styling libraries.
• Containerize applications using Docker and deploy to cloud environments on AWS (ECS, RDS, S3).
• Architect database schemas and optimize queries in PostgreSQL.
• Participate in code reviews, architectural discussions, and automated CI/CD releases.

Basic Qualifications:
• 2+ years of professional software engineering experience.
• Strong proficiency in Python and modern web frameworks (FastAPI or Django).
• Demonstrated experience with React, JavaScript/TypeScript, and frontend state management.
• Hands-on experience with relational databases, specifically PostgreSQL.
• Familiarity with containerization (Docker) and REST API principles.
• Bachelor's degree in Computer Science, Engineering, or equivalent practical experience.

Preferred Qualifications:
• Experience with AWS cloud infrastructure (S3, ECS, Lambda).
• Familiarity with Redis caching and asynchronous job queues.
• Knowledge of Kubernetes and Terraform.
• Experience building high-throughput distributed systems.`;

// In-memory Database Store
class DatabaseStore {
  private users: Map<string, UserAccount> = new Map();
  private analyses: Map<string, FullAnalysisReport> = new Map();

  constructor() {
    // Seed default demo user
    const demoUser: UserAccount = {
      id: 'demo-user-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@email.com',
      passwordHash: 'demo123', // In demo app, simple hash
      targetRole: 'Full-Stack Software Engineer',
      createdAt: new Date().toISOString()
    };
    this.users.set(demoUser.id, demoUser);
  }

  getUserByEmail(email: string): UserAccount | undefined {
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserAccount | undefined {
    return this.users.get(id);
  }

  saveUser(user: UserAccount): UserAccount {
    this.users.set(user.id, user);
    return user;
  }

  saveAnalysis(report: FullAnalysisReport): FullAnalysisReport {
    this.analyses.set(report.id, report);
    return report;
  }

  getAnalysis(id: string): FullAnalysisReport | undefined {
    return this.analyses.get(id);
  }

  listAnalyses(userId?: string): FullAnalysisReport[] {
    const all = Array.from(this.analyses.values());
    if (userId) {
      return all.filter(a => a.userId === userId || !a.userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  deleteAnalysis(id: string): boolean {
    return this.analyses.delete(id);
  }
}

export const db = new DatabaseStore();
