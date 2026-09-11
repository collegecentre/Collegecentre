/**
 * Script-based Deterministic Resume Parser
 * Extracts structured profile data from raw text without relying on external AI/APIs.
 * Zero quota limits, zero network latency, 100% deterministic.
 */

const KNOWN_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'cpp', 'c#', 'csharp', 'c',
  'golang', 'go', 'rust', 'kotlin', 'swift', 'ruby', 'php', 'r', 'dart', 'scala'
];

const KNOWN_FRAMEWORKS = [
  'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'angular', 'next.js', 'nextjs',
  'express', 'express.js', 'node.js', 'nodejs', 'django', 'flask', 'fastapi',
  'spring boot', 'spring', '.net', 'asp.net', 'laravel', 'nest.js', 'nestjs',
  'tailwind', 'tailwind css', 'bootstrap', 'material-ui', 'shadcn'
];

const KNOWN_DATABASES = [
  'postgresql', 'postgres', 'mysql', 'mongodb', 'mongo', 'redis', 'sqlite',
  'oracle', 'cassandra', 'dynamodb', 'firebase', 'supabase', 'mariadb', 'sql'
];

const KNOWN_TOOLS = [
  'git', 'github', 'gitlab', 'docker', 'kubernetes', 'k8s', 'jenkins', 'postman',
  'figma', 'jira', 'linux', 'bash', 'npm', 'vite', 'webpack'
];

const KNOWN_CLOUD = [
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'vercel', 'netlify', 'heroku'
];

const CANONICAL_MAP = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'c': 'C',
  'golang': 'Go',
  'go': 'Go',
  'rust': 'Rust',
  'kotlin': 'Kotlin',
  'swift': 'Swift',
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'spring boot': 'Spring Boot',
  'spring': 'Spring Boot',
  'tailwind': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'supabase': 'Supabase',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'git': 'Git',
  'github': 'GitHub',
  'aws': 'AWS',
  'azure': 'Azure',
  'gcp': 'Google Cloud (GCP)',
  'sql': 'SQL',
  'rest apis': 'REST APIs',
  'html': 'HTML5',
  'css': 'CSS3',
};

/**
 * Extracts structured profile from raw text without AI.
 */
export function parseResumeWithScript(text, fileName = '') {
  const cleanText = String(text || '').replace(/\r\n/g, '\n');
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Email Extraction
  const emailMatch = cleanText.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/);
  const email = emailMatch ? emailMatch[1].toLowerCase() : null;

  // 2. Phone Extraction (Indian 10-digit & international format)
  const phoneMatch = cleanText.match(/(?:(?:\+?91[\s-]?)?[6-9]\d{9}\b)|(?:\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)/);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : null;

  // 3. Social Links
  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin_url = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : null;

  const githubMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github_url = githubMatch ? `https://github.com/${githubMatch[1]}` : null;

  const portfolioMatch = cleanText.match(/https?:\/\/(?!www\.linkedin|linkedin|www\.github|github|gmail)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  const portfolio_url = portfolioMatch ? portfolioMatch[0] : null;

  // 4. Candidate Name Extraction
  let full_name = null;
  // Check first 5 lines for a likely name (letters only, 2-4 words)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const candidate = lines[i].replace(/[|•,].*$/, '').trim();
    if (
      candidate.length >= 3 &&
      candidate.length <= 40 &&
      /^[A-Za-z\s.]+$/.test(candidate) &&
      !candidate.toLowerCase().includes('resume') &&
      !candidate.toLowerCase().includes('curriculum') &&
      !candidate.toLowerCase().includes('page')
    ) {
      full_name = candidate;
      break;
    }
  }

  // Fallback to fileName if text header name was unclear
  if (!full_name && fileName) {
    const fromFile = fileName
      .replace(/\.(pdf|docx)$/i, '')
      .replace(/\s*\(\d+\)/g, '')
      .replace(/[-_+]/g, ' ')
      .replace(/resume|cv/gi, '')
      .trim();
    if (fromFile.length >= 3 && /^[A-Za-z\s.]+$/.test(fromFile)) {
      full_name = fromFile.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // 5. Education Extraction
  let degree = 'B.Tech';
  if (/b\.?\s*tech|bachelor of technology/i.test(cleanText)) {
    degree = 'B.Tech';
  } else if (/b\.?\s*e\.?|bachelor of engineering/i.test(cleanText)) {
    degree = 'B.E.';
  } else if (/bca|bachelor of computer applications/i.test(cleanText)) {
    degree = 'BCA';
  } else if (/mca|master of computer applications/i.test(cleanText)) {
    degree = 'MCA';
  } else if (/m\.?\s*tech|master of technology/i.test(cleanText)) {
    degree = 'M.Tech';
  } else if (/b\.?\s*sc/i.test(cleanText)) {
    degree = 'B.Sc';
  }

  let field_of_study = 'Computer Science';
  if (/computer science|information technology|cs|it/i.test(cleanText)) {
    field_of_study = 'Computer Science';
  } else if (/electronics|ece|electrical/i.test(cleanText)) {
    field_of_study = 'Electronics & Communication';
  } else if (/data science|artificial intelligence|ai|ml/i.test(cleanText)) {
    field_of_study = 'Data Science & AI';
  } else if (/mechanical/i.test(cleanText)) {
    field_of_study = 'Mechanical Engineering';
  }

  // Institution / College extraction
  let institution = '';
  const collegeMatch = cleanText.match(/([A-Za-z\s.,&'-]+(?:College|Institute|University|Engineering|Technology|School)[A-Za-z\s.,&'-]*)/i);
  if (collegeMatch) {
    institution = collegeMatch[1].split('\n')[0].replace(/[|•].*$/, '').trim();
  }

  // Graduation Year extraction
  const gradYearMatch = cleanText.match(/\b(202[4-9]|203[0-2])\b/);
  const graduation_year = gradYearMatch ? parseInt(gradYearMatch[1], 10) : 2026;

  // GPA / Percentage
  const gpaMatch = cleanText.match(/(?:cgpa|gpa|percentage|score)?[\s:]*([0-9]\.[0-9]{1,2}(?:\s*\/\s*10)?|[0-9]{2}(?:\.[0-9]{1,2})?%)/i);
  const gpa_or_percentage = gpaMatch ? gpaMatch[1] : null;

  // 6. Skills Extraction by Lexicon Matching
  const lowerText = cleanText.toLowerCase();
  const progLangs = new Set();
  const frameworks = new Set();
  const databases = new Set();
  const tools = new Set();
  const cloud = new Set();
  const normalized = new Set();

  const checkAndAdd = (keyword, targetSet) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
    if (regex.test(lowerText)) {
      const canonical = CANONICAL_MAP[keyword.toLowerCase()] || keyword;
      targetSet.add(canonical);
      normalized.add(canonical);
    }
  };

  KNOWN_LANGUAGES.forEach((k) => checkAndAdd(k, progLangs));
  KNOWN_FRAMEWORKS.forEach((k) => checkAndAdd(k, frameworks));
  KNOWN_DATABASES.forEach((k) => checkAndAdd(k, databases));
  KNOWN_TOOLS.forEach((k) => checkAndAdd(k, tools));
  KNOWN_CLOUD.forEach((k) => checkAndAdd(k, cloud));

  if (normalized.size === 0) {
    ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'].forEach((s) => normalized.add(s));
  }

  // 7. Projects Extraction
  const projects = [];
  const projectHeaderIdx = lines.findIndex((l) => /^(academic\s+)?projects?$/i.test(l.trim()));
  if (projectHeaderIdx !== -1) {
    for (let i = projectHeaderIdx + 1; i < Math.min(lines.length, projectHeaderIdx + 15); i++) {
      const line = lines[i];
      if (/^(experience|internships|education|skills|certifications|achievements)/i.test(line)) {
        break;
      }
      if (line.length > 5 && line.length < 80 && !line.startsWith('•') && !line.startsWith('-')) {
        const projName = line.replace(/[:|•-].*$/, '').trim();
        const techFound = Array.from(normalized).filter((tech) =>
          new RegExp(`\\b${tech}\\b`, 'i').test(cleanText)
        );
        projects.push({
          name: projName,
          description: line,
          technologies: techFound.slice(0, 4),
          url: null,
        });
        if (projects.length >= 3) break;
      }
    }
  }

  if (projects.length === 0) {
    projects.push({
      name: 'Full Stack Web Platform',
      description: 'Built a responsive web application with modern tech stack and database integration.',
      technologies: Array.from(normalized).slice(0, 3),
      url: null,
    });
  }

  // 8. Internships / Experience Extraction
  const internships = [];
  const internHeaderIdx = lines.findIndex((l) => /internships?|work\s+experience/i.test(l.trim()));
  if (internHeaderIdx !== -1) {
    for (let i = internHeaderIdx + 1; i < Math.min(lines.length, internHeaderIdx + 10); i++) {
      const line = lines[i];
      if (/^(projects|education|skills|certifications|achievements)/i.test(line)) {
        break;
      }
      if (line.length > 5 && line.length < 80) {
        internships.push({
          company: line.split(/[-–|,]/)[0].trim(),
          role: 'Software Development Intern',
          duration: '3 months',
          technologies: Array.from(normalized).slice(0, 3),
          description: line,
        });
        break;
      }
    }
  }

  return {
    personal: {
      full_name,
      email,
      phone,
      location: 'India',
      linkedin_url,
      github_url,
      portfolio_url,
    },
    education: [
      {
        institution: institution || 'Engineering College',
        degree,
        field_of_study,
        start_year: graduation_year - 4,
        graduation_year,
        gpa_or_percentage,
      },
    ],
    skills: {
      programming_languages: Array.from(progLangs),
      frameworks: Array.from(frameworks),
      libraries: [],
      databases: Array.from(databases),
      tools: Array.from(tools),
      cloud: Array.from(cloud),
      other: [],
      normalized: Array.from(normalized),
    },
    experience: [],
    internships,
    projects,
    certifications: [],
    achievements: [],
    languages: [
      { language: 'English', proficiency: 'Professional' },
      { language: 'Hindi', proficiency: 'Conversational' },
    ],
    career: {
      experience_level: 'Fresher',
      job_categories: ['Software Development', 'Web Development'],
    },
  };
}
