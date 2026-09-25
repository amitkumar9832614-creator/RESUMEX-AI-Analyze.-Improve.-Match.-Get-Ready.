export interface SkillDefinition {
  canonical: string;
  category: 'Programming Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Cloud & DevOps' | 'AI & Data Science' | 'Mobile & Systems' | 'Tools & Methodologies' | 'Soft Skills';
  aliases: string[];
  relatedSkills?: string[];
  learningDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const SKILL_TAXONOMY: SkillDefinition[] = [
  // Programming Languages
  { canonical: 'Python', category: 'Programming Languages', aliases: ['py', 'python3', 'python 3'], relatedSkills: ['Django', 'FastAPI', 'Flask', 'Pandas'], learningDifficulty: 'Beginner' },
  { canonical: 'JavaScript', category: 'Programming Languages', aliases: ['js', 'ecmascript', 'es6', 'es2020'], relatedSkills: ['TypeScript', 'Node.js', 'React'], learningDifficulty: 'Beginner' },
  { canonical: 'TypeScript', category: 'Programming Languages', aliases: ['ts'], relatedSkills: ['JavaScript', 'Node.js', 'React', 'Angular'], learningDifficulty: 'Intermediate' },
  { canonical: 'Java', category: 'Programming Languages', aliases: ['jdk', 'core java'], relatedSkills: ['Spring Boot', 'Kotlin', 'Hibernate'], learningDifficulty: 'Intermediate' },
  { canonical: 'Kotlin', category: 'Programming Languages', aliases: ['kt'], relatedSkills: ['Java', 'Android'], learningDifficulty: 'Intermediate' },
  { canonical: 'Go', category: 'Programming Languages', aliases: ['golang'], relatedSkills: ['Docker', 'Kubernetes', 'Microservices'], learningDifficulty: 'Intermediate' },
  { canonical: 'Rust', category: 'Programming Languages', aliases: ['rust-lang'], relatedSkills: ['C++', 'Systems Programming', 'WebAssembly'], learningDifficulty: 'Advanced' },
  { canonical: 'C++', category: 'Programming Languages', aliases: ['cpp', 'c/c++'], relatedSkills: ['C', 'Rust', 'Algorithms'], learningDifficulty: 'Advanced' },
  { canonical: 'C#', category: 'Programming Languages', aliases: ['csharp', '.net', 'c-sharp'], relatedSkills: ['.NET Core', 'ASP.NET', 'Azure'], learningDifficulty: 'Intermediate' },
  { canonical: 'PHP', category: 'Programming Languages', aliases: ['php7', 'php8'], relatedSkills: ['Laravel', 'MySQL'], learningDifficulty: 'Beginner' },
  { canonical: 'Ruby', category: 'Programming Languages', aliases: ['ruby on rails', 'rails'], relatedSkills: ['PostgreSQL'], learningDifficulty: 'Beginner' },
  { canonical: 'Swift', category: 'Programming Languages', aliases: ['swiftui'], relatedSkills: ['iOS', 'Objective-C'], learningDifficulty: 'Intermediate' },
  { canonical: 'SQL', category: 'Programming Languages', aliases: ['structured query language'], relatedSkills: ['PostgreSQL', 'MySQL', 'Database Design'], learningDifficulty: 'Beginner' },
  { canonical: 'HTML5', category: 'Programming Languages', aliases: ['html'], relatedSkills: ['CSS3', 'Web Development'], learningDifficulty: 'Beginner' },
  { canonical: 'CSS3', category: 'Programming Languages', aliases: ['css', 'styling'], relatedSkills: ['Tailwind CSS', 'Sass'], learningDifficulty: 'Beginner' },
  { canonical: 'Bash', category: 'Programming Languages', aliases: ['shell script', 'shell scripting', 'sh', 'zsh'], relatedSkills: ['Linux', 'DevOps'], learningDifficulty: 'Intermediate' },
  { canonical: 'R', category: 'Programming Languages', aliases: ['r programming', 'r-lang'], relatedSkills: ['Data Science', 'Statistics'], learningDifficulty: 'Intermediate' },
  { canonical: 'Scala', category: 'Programming Languages', aliases: [], relatedSkills: ['Apache Spark', 'Java'], learningDifficulty: 'Advanced' },

  // Frontend
  { canonical: 'React', category: 'Frontend', aliases: ['react.js', 'reactjs'], relatedSkills: ['Next.js', 'Redux', 'JavaScript', 'TypeScript'], learningDifficulty: 'Intermediate' },
  { canonical: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next'], relatedSkills: ['React', 'Server Side Rendering', 'TypeScript'], learningDifficulty: 'Intermediate' },
  { canonical: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'vue 3'], relatedSkills: ['Nuxt.js', 'JavaScript'], learningDifficulty: 'Intermediate' },
  { canonical: 'Angular', category: 'Frontend', aliases: ['angularjs', 'angular 2+'], relatedSkills: ['TypeScript', 'RxJS'], learningDifficulty: 'Advanced' },
  { canonical: 'Svelte', category: 'Frontend', aliases: ['sveltekit'], relatedSkills: ['JavaScript'], learningDifficulty: 'Intermediate' },
  { canonical: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'], relatedSkills: ['CSS3', 'PostCSS'], learningDifficulty: 'Beginner' },
  { canonical: 'Redux', category: 'Frontend', aliases: ['redux toolkit', 'rtk'], relatedSkills: ['React', 'State Management'], learningDifficulty: 'Intermediate' },
  { canonical: 'GraphQL', category: 'Frontend', aliases: ['apollo client', 'graphql api'], relatedSkills: ['REST API', 'Node.js'], learningDifficulty: 'Intermediate' },
  { canonical: 'Webpack', category: 'Frontend', aliases: ['vite', 'rollup', 'bundlers'], relatedSkills: ['JavaScript', 'Frontend Tooling'], learningDifficulty: 'Intermediate' },

  // Backend
  { canonical: 'Node.js', category: 'Backend', aliases: ['nodejs', 'node'], relatedSkills: ['Express', 'JavaScript', 'TypeScript', 'Backend'], learningDifficulty: 'Intermediate' },
  { canonical: 'Express', category: 'Backend', aliases: ['express.js', 'expressjs'], relatedSkills: ['Node.js', 'REST API'], learningDifficulty: 'Beginner' },
  { canonical: 'FastAPI', category: 'Backend', aliases: ['fast api'], relatedSkills: ['Python', 'Pydantic', 'REST API', 'Swagger'], learningDifficulty: 'Intermediate' },
  { canonical: 'Django', category: 'Backend', aliases: ['django rest framework', 'drf'], relatedSkills: ['Python', 'ORM', 'PostgreSQL'], learningDifficulty: 'Intermediate' },
  { canonical: 'Flask', category: 'Backend', aliases: [], relatedSkills: ['Python', 'Microservices'], learningDifficulty: 'Beginner' },
  { canonical: 'Spring Boot', category: 'Backend', aliases: ['springboot', 'spring framework'], relatedSkills: ['Java', 'Microservices', 'Hibernate'], learningDifficulty: 'Advanced' },
  { canonical: 'NestJS', category: 'Backend', aliases: ['nest.js'], relatedSkills: ['TypeScript', 'Node.js'], learningDifficulty: 'Intermediate' },
  { canonical: 'REST API', category: 'Backend', aliases: ['rest', 'restful api', 'restful apis', 'web apis'], relatedSkills: ['HTTP', 'FastAPI', 'Express', 'JSON'], learningDifficulty: 'Beginner' },
  { canonical: 'Microservices', category: 'Backend', aliases: ['microservice architecture', 'distributed systems'], relatedSkills: ['Docker', 'Kubernetes', 'gRPC'], learningDifficulty: 'Advanced' },
  { canonical: 'gRPC', category: 'Backend', aliases: ['protocol buffers', 'protobuf'], relatedSkills: ['Microservices', 'Go', 'RPC'], learningDifficulty: 'Advanced' },
  { canonical: 'WebSockets', category: 'Backend', aliases: ['websocket', 'socket.io', 'real-time'], relatedSkills: ['Node.js', 'Event-Driven Architecture'], learningDifficulty: 'Intermediate' },

  // Databases
  { canonical: 'PostgreSQL', category: 'Databases', aliases: ['postgres', 'psql'], relatedSkills: ['SQL', 'Relational Databases', 'Database Optimization'], learningDifficulty: 'Intermediate' },
  { canonical: 'MySQL', category: 'Databases', aliases: ['mariadb'], relatedSkills: ['SQL', 'Relational Databases'], learningDifficulty: 'Beginner' },
  { canonical: 'MongoDB', category: 'Databases', aliases: ['mongo', 'nosql database'], relatedSkills: ['NoSQL', 'Mongoose', 'Document DB'], learningDifficulty: 'Beginner' },
  { canonical: 'Redis', category: 'Databases', aliases: ['caching', 'redis cache', 'in-memory db'], relatedSkills: ['Backend', 'Performance Optimization'], learningDifficulty: 'Intermediate' },
  { canonical: 'SQLite', category: 'Databases', aliases: ['sqlite3'], relatedSkills: ['SQL', 'Mobile DB'], learningDifficulty: 'Beginner' },
  { canonical: 'Elasticsearch', category: 'Databases', aliases: ['elastic search', 'elk stack'], relatedSkills: ['Search Engines', 'Distributed Systems'], learningDifficulty: 'Advanced' },
  { canonical: 'DynamoDB', category: 'Databases', aliases: ['aws dynamodb'], relatedSkills: ['AWS', 'NoSQL'], learningDifficulty: 'Intermediate' },
  { canonical: 'Firebase', category: 'Databases', aliases: ['firestore', 'firebase auth'], relatedSkills: ['Cloud Functions', 'BaaS'], learningDifficulty: 'Beginner' },
  { canonical: 'Prisma', category: 'Databases', aliases: ['prisma orm', 'drizzle'], relatedSkills: ['TypeScript', 'PostgreSQL'], learningDifficulty: 'Beginner' },

  // Cloud & DevOps
  { canonical: 'Docker', category: 'Cloud & DevOps', aliases: ['containerization', 'containers', 'dockerfile', 'docker compose'], relatedSkills: ['Kubernetes', 'DevOps', 'CI/CD'], learningDifficulty: 'Intermediate' },
  { canonical: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'k8', 'helm'], relatedSkills: ['Docker', 'DevOps', 'Microservices'], learningDifficulty: 'Advanced' },
  { canonical: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'], relatedSkills: ['Cloud Computing', 'Terraform', 'DevOps'], learningDifficulty: 'Intermediate' },
  { canonical: 'Google Cloud', category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud platform', 'cloud run', 'bigquery'], relatedSkills: ['Cloud Computing', 'Kubernetes'], learningDifficulty: 'Intermediate' },
  { canonical: 'Azure', category: 'Cloud & DevOps', aliases: ['microsoft azure'], relatedSkills: ['Cloud Computing', 'Active Directory'], learningDifficulty: 'Intermediate' },
  { canonical: 'CI/CD', category: 'Cloud & DevOps', aliases: ['continuous integration', 'continuous deployment', 'github actions', 'gitlab ci', 'jenkins'], relatedSkills: ['DevOps', 'Testing'], learningDifficulty: 'Intermediate' },
  { canonical: 'Terraform', category: 'Cloud & DevOps', aliases: ['infrastructure as code', 'iac'], relatedSkills: ['AWS', 'Cloud Architecture'], learningDifficulty: 'Advanced' },
  { canonical: 'Linux', category: 'Cloud & DevOps', aliases: ['ubuntu', 'debian', 'centos', 'redhat', 'linux administration'], relatedSkills: ['Bash', 'Systems Administration'], learningDifficulty: 'Intermediate' },
  { canonical: 'Nginx', category: 'Cloud & DevOps', aliases: ['reverse proxy'], relatedSkills: ['Linux', 'Web Servers'], learningDifficulty: 'Intermediate' },

  // AI & Data Science
  { canonical: 'Machine Learning', category: 'AI & Data Science', aliases: ['ml', 'predictive modeling', 'statistical learning'], relatedSkills: ['Python', 'Scikit-Learn', 'Deep Learning'], learningDifficulty: 'Advanced' },
  { canonical: 'Deep Learning', category: 'AI & Data Science', aliases: ['neural networks', 'dl'], relatedSkills: ['PyTorch', 'TensorFlow', 'Computer Vision'], learningDifficulty: 'Advanced' },
  { canonical: 'PyTorch', category: 'AI & Data Science', aliases: ['torch'], relatedSkills: ['Deep Learning', 'Python'], learningDifficulty: 'Advanced' },
  { canonical: 'TensorFlow', category: 'AI & Data Science', aliases: ['tf', 'keras'], relatedSkills: ['Deep Learning', 'Python'], learningDifficulty: 'Advanced' },
  { canonical: 'Natural Language Processing', category: 'AI & Data Science', aliases: ['nlp', 'text mining', 'spacy', 'nltk', 'huggingface'], relatedSkills: ['Transformers', 'LLMs', 'Python'], learningDifficulty: 'Advanced' },
  { canonical: 'Large Language Models', category: 'AI & Data Science', aliases: ['llm', 'llms', 'genai', 'generative ai', 'prompt engineering', 'langchain', 'rag'], relatedSkills: ['Python', 'NLP', 'Gemini', 'OpenAI'], learningDifficulty: 'Intermediate' },
  { canonical: 'Pandas', category: 'AI & Data Science', aliases: ['pandas library'], relatedSkills: ['NumPy', 'Data Analysis', 'Python'], learningDifficulty: 'Beginner' },
  { canonical: 'NumPy', category: 'AI & Data Science', aliases: [], relatedSkills: ['Pandas', 'Linear Algebra'], learningDifficulty: 'Beginner' },
  { canonical: 'Scikit-Learn', category: 'AI & Data Science', aliases: ['sklearn'], relatedSkills: ['Machine Learning', 'Python'], learningDifficulty: 'Intermediate' },
  { canonical: 'Data Analysis', category: 'AI & Data Science', aliases: ['data analytics', 'data exploration', 'eda'], relatedSkills: ['Pandas', 'SQL', 'Tableau'], learningDifficulty: 'Beginner' },

  // Tools & Methodologies
  { canonical: 'Git', category: 'Tools & Methodologies', aliases: ['github', 'gitlab', 'version control', 'git flow'], relatedSkills: ['Software Engineering', 'CI/CD'], learningDifficulty: 'Beginner' },
  { canonical: 'System Design', category: 'Tools & Methodologies', aliases: ['systems architecture', 'software architecture', 'scalability', 'distributed architecture'], relatedSkills: ['Microservices', 'Databases', 'Cloud'], learningDifficulty: 'Advanced' },
  { canonical: 'Unit Testing', category: 'Tools & Methodologies', aliases: ['automated testing', 'pytest', 'jest', 'junit', 'tdd', 'test driven development'], relatedSkills: ['Software Quality', 'Clean Code'], learningDifficulty: 'Intermediate' },
  { canonical: 'Agile', category: 'Tools & Methodologies', aliases: ['scrum', 'kanban', 'sprint planning'], relatedSkills: ['Collaboration', 'Project Management'], learningDifficulty: 'Beginner' },
  { canonical: 'Cybersecurity', category: 'Tools & Methodologies', aliases: ['security', 'owasp', 'penetration testing', 'oauth', 'jwt'], relatedSkills: ['Authentication', 'Networking'], learningDifficulty: 'Advanced' },
  
  // Soft Skills
  { canonical: 'Problem Solving', category: 'Soft Skills', aliases: ['analytical thinking', 'troubleshooting'], relatedSkills: ['Algorithms', 'Debugging'], learningDifficulty: 'Intermediate' },
  { canonical: 'Team Leadership', category: 'Soft Skills', aliases: ['mentoring', 'team lead', 'tech lead'], relatedSkills: ['Communication', 'Project Management'], learningDifficulty: 'Intermediate' },
  { canonical: 'Communication', category: 'Soft Skills', aliases: ['stakeholder communication', 'technical writing', 'presentation'], relatedSkills: ['Collaboration'], learningDifficulty: 'Beginner' },
  { canonical: 'Cross-functional Collaboration', category: 'Soft Skills', aliases: ['cross-functional teams', 'product alignment'], relatedSkills: ['Agile', 'Teamwork'], learningDifficulty: 'Beginner' }
];

export function findCanonicalSkill(text: string): SkillDefinition | null {
  const clean = text.trim().toLowerCase();
  for (const skill of SKILL_TAXONOMY) {
    if (skill.canonical.toLowerCase() === clean) return skill;
    for (const alias of skill.aliases) {
      if (alias.toLowerCase() === clean) return skill;
    }
  }
  return null;
}
