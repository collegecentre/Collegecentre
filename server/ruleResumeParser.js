/**
 * CollegeCentre Rule-Based Resume Parser
 * 
 * 100% Free, Deterministic, Local Resume Parser.
 * - Zero AI / LLM APIs (No Gemini, OpenAI, or Claude).
 * - Multi-stage pipeline: Text normalization -> Section detection -> Regex extraction -> Skill normalization -> Confidence scoring.
 * - Strict Anti-Hallucination: Never invents missing data. If a field is not in the text, returns null or [].
 */

// Canonical Skill Normalization Dictionary
// Aligned with src/services/matching.ts and src/services/skillNormalizer.ts
export const SKILL_SYNONYMS = {
  // Programming Languages
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',
  'golang': 'Go',
  'go': 'Go',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'c': 'C',
  'rb': 'Ruby',
  'ruby': 'Ruby',
  'kt': 'Kotlin',
  'kotlin': 'Kotlin',
  'rustlang': 'Rust',
  'rust': 'Rust',
  'java': 'Java',
  'swift': 'Swift',
  'php': 'PHP',
  'dart': 'Dart',
  'scala': 'Scala',
  'r': 'R',

  // Frontend
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'redux': 'Redux',
  'material-ui': 'Material UI',
  'mui': 'Material UI',
  'shadcn': 'shadcn/ui',
  'sass': 'Sass',
  'less': 'Less',

  // Backend & Runtime
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'express.js': 'Express.js',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'spring': 'Spring Boot',
  'springboot': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'nest.js': 'NestJS',
  'nestjs': 'NestJS',
  'dotnet': '.NET',
  '.net': '.NET',
  'asp.net': 'ASP.NET',
  'laravel': 'Laravel',

  // Databases
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'pg': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'cassandra': 'Cassandra',
  'dynamodb': 'DynamoDB',
  'sql': 'SQL',
  'sqlite': 'SQLite',
  'oracle': 'Oracle',
  'firebase': 'Firebase',
  'supabase': 'Supabase',
  'mariadb': 'MariaDB',

  // DevOps & Cloud
  'docker': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'azure': 'Azure',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'GitLab',
  'jenkins': 'Jenkins',
  'linux': 'Linux',
  'bash': 'Bash',
  'terraform': 'Terraform',
  'ansible': 'Ansible',
  'vercel': 'Vercel',
  'netlify': 'Netlify',

  // Data & AI
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'dl': 'Deep Learning',
  'deep learning': 'Deep Learning',
  'ai': 'Artificial Intelligence',
  'artificial intelligence': 'Artificial Intelligence',
  'nlp': 'NLP',
  'computer vision': 'Computer Vision',
  'cv': 'Computer Vision',
  'llm': 'LLMs',
  'llms': 'LLMs',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'tf': 'TensorFlow',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'tableau': 'Tableau',
  'powerbi': 'Power BI',
  'power bi': 'Power BI',

  // Core CS Concepts & Tools
  'dsa': 'Data Structures & Algorithms',
  'data structures': 'Data Structures & Algorithms',
  'algorithms': 'Data Structures & Algorithms',
  'system design': 'System Design',
  'oop': 'Object Oriented Programming',
  'oops': 'Object Oriented Programming',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  'graphql': 'GraphQL',
  'unit testing': 'Unit Testing',
  'testing': 'Unit Testing',
  'postman': 'Postman',
  'figma': 'Figma',
  'jira': 'Jira',
  'vite': 'Vite',
  'webpack': 'Webpack',
};

// Skill categorization lookup sets
const CATEGORY_MAP = {
  programming_languages: new Set([
    'JavaScript', 'TypeScript', 'Python', 'Go', 'C++', 'C#', 'C', 'Ruby', 'Kotlin', 'Rust', 'Java', 'Swift', 'PHP', 'Dart', 'Scala', 'R'
  ]),
  frameworks: new Set([
    'React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Material UI', 'shadcn/ui',
    'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'NestJS', '.NET', 'ASP.NET', 'Laravel'
  ]),
  databases: new Set([
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'SQL', 'SQLite', 'Oracle', 'Firebase', 'Supabase', 'MariaDB'
  ]),
  cloud: new Set([
    'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify'
  ]),
  tools: new Set([
    'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitLab', 'Jenkins', 'Linux', 'Bash', 'Terraform', 'Ansible', 'Postman', 'Figma', 'Jira', 'Vite', 'Webpack'
  ]),
  libraries: new Set([
    'Pandas', 'NumPy', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Tableau', 'Power BI'
  ]),
};

// Indian & International Cities for Location Detection
const KNOWN_LOCATIONS = [
  'Bengaluru', 'Bangalore', 'Kochi', 'Cochin', 'Hyderabad', 'Pune', 'Mumbai',
  'Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Gurugram', 'Chennai', 'Kolkata',
  'Trivandrum', 'Thiruvananthapuram', 'Kozhikode', 'Calicut', 'Coimbatore',
  'Ahmedabad', 'Jaipur', 'Indore', 'Bhopal', 'Chandigarh', 'Kerala', 'Karnataka',
  'Tamil Nadu', 'Maharashtra', 'Telangana'
];

// Spoken languages for candidate profile
const KNOWN_LANGUAGES = [
  'English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Bengali',
  'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'French', 'German', 'Spanish', 'Japanese'
];

/**
 * Normalizes text: replaces unusual whitespace, fixes line endings, cleans ligatures.
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    .replace(/[ﬁﬂ]/g, (match) => (match === 'ﬁ' ? 'fi' : 'fl'))
    .replace(/[•·▪▫►–—]/g, '-')
    .replace(/\t/g, ' ')
    .replace(/ +/g, ' ');
}

/**
 * Section Detector: Partitions text into identified resume sections.
 */
export function detectSections(rawText) {
  const lines = rawText.split('\n');
  const sections = {
    header: [],
    education: [],
    skills: [],
    experience: [],
    internships: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    other: [],
  };

  const sectionPatterns = [
    { type: 'education', regex: /^(?:education(?:al\s+qualifications?)?|academic\s+(?:background|qualifications?|records?)|academics?|qualifications?)$/i },
    { type: 'skills', regex: /^(?:technical\s+skills?|technologies|skills?\s*(?:&|and)\s*abilities|skills?\s*(?:&|and)\s*tools|core\s+competencies|tech\s+stack|areas?\s+of\s+expertise|skills?)$/i },
    { type: 'experience', regex: /^(?:(?:work|professional|employment)\s+experience|work\s+history|employment|experience)$/i },
    { type: 'internships', regex: /^(?:internships?|summer\s+internships?|industrial\s+training)$/i },
    { type: 'projects', regex: /^(?:(?:academic|personal|key|technical)?\s*projects?)$/i },
    { type: 'certifications', regex: /^(?:certifications?|certificates?|licenses?|licenses?\s*(?:&|and)\s*certifications?|certificates?\s*(?:&|and)\s*licenses?|online\s+courses?)$/i },
    { type: 'achievements', regex: /^(?:achievements?|awards?\s*(?:&|and)\s*honors?|honours?|accomplishments?)$/i },
    { type: 'languages', regex: /^(?:languages?(?:\s+known)?)$/i },
  ];

  let currentSection = 'header';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line matches a known heading
    // Strip leading dashes or colons
    const cleanHeading = trimmed.replace(/^[-#*:\s]+|[-#*:\s]+$/g, '');
    let matchedType = null;

    if (cleanHeading.length >= 3 && cleanHeading.length <= 40) {
      for (const p of sectionPatterns) {
        if (p.regex.test(cleanHeading)) {
          matchedType = p.type;
          break;
        }
      }
    }

    if (matchedType) {
      currentSection = matchedType;
    } else {
      sections[currentSection].push(trimmed);
    }
  }

  return sections;
}

/**
 * Extracts candidate contact information (Name, Email, Phone, URLs, Location).
 */
export function extractContactInfo(rawText, sections, fileName = '') {
  // 1. Email Extraction
  const emailMatch = rawText.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/);
  const email = emailMatch ? emailMatch[1].toLowerCase() : null;

  // 2. Phone Extraction (handles Indian +91 with spaces/dashes and standard 10-digit)
  const phoneMatch = rawText.match(/(?:(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b)|(?:\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)/);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : null;

  // 3. Social Links
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-\.]+)/i);
  const linkedin_url = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : null;

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)/i);
  const github_url = githubMatch ? `https://github.com/${githubMatch[1]}` : null;

  // Other website / portfolio
  let portfolio_url = null;
  const urlMatches = rawText.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s)\]]*)?/gi) || [];
  for (const u of urlMatches) {
    if (!/linkedin\.com|github\.com|gmail\.com|google\.com|w3\.org/i.test(u)) {
      portfolio_url = u.trim();
      break;
    }
  }

  // 4. Candidate Name
  let full_name = null;
  const headerLines = sections.header.length > 0 ? sections.header : rawText.split('\n').slice(0, 5);

  for (let i = 0; i < Math.min(5, headerLines.length); i++) {
    const candidate = headerLines[i]
      .replace(/[|•,].*$/, '')
      .replace(/^[-#*:\s]+|[-#*:\s]+$/g, '')
      .trim();

    if (
      candidate.length >= 3 &&
      candidate.length <= 40 &&
      /^[A-Za-z\s.]+$/.test(candidate) &&
      !/resume|curriculum|vitae|page|contact|email|phone|profile/i.test(candidate) &&
      candidate.split(/\s+/).length >= 1 &&
      candidate.split(/\s+/).length <= 4
    ) {
      full_name = candidate;
      break;
    }
  }

  // Fallback to sanitized fileName if text header name was unclear
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

  // 5. Location Extraction
  let location = null;
  for (const loc of KNOWN_LOCATIONS) {
    const locRegex = new RegExp(`\\b${loc}\\b`, 'i');
    if (locRegex.test(rawText)) {
      location = loc;
      break;
    }
  }

  return {
    full_name,
    email,
    phone,
    location,
    linkedin_url,
    github_url,
    portfolio_url,
  };
}

/**
 * Extracts education details strictly without hallucinating missing fields.
 */
export function extractEducation(rawText, sections) {
  const eduText = (sections.education || []).join('\n') || rawText;

  // 1. Degree
  let degree = null;
  if (/b\.?\s*tech(?:nology)?|bachelor\s+of\s+technology/i.test(eduText)) {
    degree = 'B.Tech';
  } else if (/b\.?\s*e\.?|bachelor\s+of\s+engineering/i.test(eduText)) {
    degree = 'B.E.';
  } else if (/bca|bachelor\s+of\s+computer\s+applications?/i.test(eduText)) {
    degree = 'BCA';
  } else if (/mca|master\s+of\s+computer\s+applications?/i.test(eduText)) {
    degree = 'MCA';
  } else if (/m\.?\s*tech(?:nology)?|master\s+of\s+technology/i.test(eduText)) {
    degree = 'M.Tech';
  } else if (/b\.?\s*sc|bachelor\s+of\s+science/i.test(eduText)) {
    degree = 'B.Sc';
  } else if (/m\.?\s*sc|master\s+of\s+science/i.test(eduText)) {
    degree = 'M.Sc';
  } else if (/b\.?\s*com|bachelor\s+of\s+commerce/i.test(eduText)) {
    degree = 'B.Com';
  } else if (/mba|master\s+of\s+business\s+administration/i.test(eduText)) {
    degree = 'MBA';
  }

  // 2. Field of Study / Branch
  let field_of_study = null;
  if (/computer\s+science|information\s+technology|\bcse\b|\bit\b/i.test(eduText)) {
    field_of_study = 'Computer Science';
  } else if (/electronics\s*(?:&|and)\s*communication|\bece\b/i.test(eduText)) {
    field_of_study = 'Electronics & Communication';
  } else if (/electrical\s*(?:&|and)\s*electronics|\beee\b/i.test(eduText)) {
    field_of_study = 'Electrical & Electronics';
  } else if (/data\s+science|artificial\s+intelligence|\bai\b|\bml\b/i.test(eduText)) {
    field_of_study = 'Data Science & AI';
  } else if (/mechanical\s+engineering|\bmech\b/i.test(eduText)) {
    field_of_study = 'Mechanical Engineering';
  } else if (/civil\s+engineering/i.test(eduText)) {
    field_of_study = 'Civil Engineering';
  }

  // 3. Institution / College
  let institution = null;
  const collegeMatch = eduText.match(
    /([A-Za-z\s.,&'-]+(?:College|Institute|University|Engineering|Technology|School)[A-Za-z\s.,&'-]*)/i
  );
  if (collegeMatch) {
    const candidate = collegeMatch[1].split('\n')[0].replace(/[-|•,].*$/, '').trim();
    if (candidate.length >= 5 && candidate.length <= 100) {
      institution = candidate;
    }
  }

  // 4. Graduation Year (2020 - 2032)
  let graduation_year = null;
  let start_year = null;

  // Check for year ranges e.g., 2022 - 2026 or 2022-2026
  const yearRangeMatch = eduText.match(/\b(20[12]\d)\s*[-–]\s*(20[23]\d)\b/);
  if (yearRangeMatch) {
    start_year = parseInt(yearRangeMatch[1], 10);
    graduation_year = parseInt(yearRangeMatch[2], 10);
  } else {
    // Look for single passing out / graduation year
    const singleYearMatch = eduText.match(/\b(202[0-9]|203[0-2])\b/);
    if (singleYearMatch) {
      graduation_year = parseInt(singleYearMatch[1], 10);
    }
  }

  // 5. GPA or Percentage
  let gpa_or_percentage = null;
  const gpaMatch = eduText.match(
    /(?:cgpa|gpa|percentage|score)?[^\w\n]*([0-9]\.[0-9]{1,2}(?:\s*\/\s*10)?|[0-9]{2}(?:\.[0-9]{1,2})?%)/i
  );
  if (gpaMatch) {
    gpa_or_percentage = gpaMatch[1].trim();
  }

  // If no education details were found at all, return empty array
  if (!degree && !institution && !field_of_study && !graduation_year && !gpa_or_percentage) {
    return [];
  }

  return [
    {
      institution: institution || '',
      degree: degree || '',
      field_of_study: field_of_study || '',
      start_year,
      graduation_year,
      gpa_or_percentage,
    },
  ];
}

/**
 * Extracts and normalizes technical skills against canonical dictionary.
 * Strictly avoids duplicate skills and never hallucinates unmentioned skills.
 */
export function extractSkills(rawText, sections) {
  const lowerText = rawText.toLowerCase();

  const progLangs = new Set();
  const frameworks = new Set();
  const databases = new Set();
  const tools = new Set();
  const cloud = new Set();
  const libraries = new Set();
  const other = new Set();
  const normalized = new Set();

  // Sort keys by descending length so "react.js" or "spring boot" matches before "react" or "spring"
  const synonymKeys = Object.keys(SKILL_SYNONYMS).sort((a, b) => b.length - a.length);

  for (const alias of synonymKeys) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');

    if (regex.test(lowerText)) {
      const canonical = SKILL_SYNONYMS[alias];
      normalized.add(canonical);

      if (CATEGORY_MAP.programming_languages.has(canonical)) {
        progLangs.add(canonical);
      } else if (CATEGORY_MAP.frameworks.has(canonical)) {
        frameworks.add(canonical);
      } else if (CATEGORY_MAP.databases.has(canonical)) {
        databases.add(canonical);
      } else if (CATEGORY_MAP.tools.has(canonical)) {
        tools.add(canonical);
      } else if (CATEGORY_MAP.cloud.has(canonical)) {
        cloud.add(canonical);
      } else if (CATEGORY_MAP.libraries.has(canonical)) {
        libraries.add(canonical);
      } else {
        other.add(canonical);
      }
    }
  }

  return {
    programming_languages: Array.from(progLangs),
    frameworks: Array.from(frameworks),
    libraries: Array.from(libraries),
    databases: Array.from(databases),
    tools: Array.from(tools),
    cloud: Array.from(cloud),
    other: Array.from(other),
    normalized: Array.from(normalized),
  };
}

/**
 * Extracts projects strictly from the projects section or text.
 */
export function extractProjects(rawText, sections, normalizedSkills) {
  const projectLines = sections.projects || [];
  if (projectLines.length === 0) return [];

  const projects = [];
  let currentProject = null;

  for (const line of projectLines) {
    const isBullet = line.startsWith('-') || line.startsWith('*');
    const cleanLine = line.replace(/^[-*•\s]+/, '').trim();

    if (!cleanLine) continue;

    // Check if this line looks like a project title (short, title-like, not starting with bullet)
    if (!isBullet && cleanLine.length <= 70 && !cleanLine.endsWith('.')) {
      if (currentProject) {
        projects.push(currentProject);
      }

      const techFound = normalizedSkills.filter((tech) =>
        new RegExp(`\\b${tech}\\b`, 'i').test(line)
      );

      const urlMatch = line.match(/https?:\/\/[^\s]+/i);

      currentProject = {
        name: cleanLine.replace(/[-|•:].*$/, '').trim(),
        description: cleanLine,
        technologies: techFound,
        url: urlMatch ? urlMatch[0] : null,
      };
    } else if (currentProject) {
      // Append bullet or description
      currentProject.description = `${currentProject.description} ${cleanLine}`.trim();

      // Scan description for additional technologies
      normalizedSkills.forEach((tech) => {
        if (
          !currentProject.technologies.includes(tech) &&
          new RegExp(`\\b${tech}\\b`, 'i').test(cleanLine)
        ) {
          currentProject.technologies.push(tech);
        }
      });
    }

    if (projects.length >= 5) break;
  }

  if (currentProject && projects.length < 5) {
    projects.push(currentProject);
  }

  return projects;
}

/**
 * Extracts experience and internships strictly from their respective sections.
 */
export function extractExperienceAndInternships(rawText, sections, normalizedSkills) {
  const expLines = sections.experience || [];
  const internLines = sections.internships || [];

  const experience = [];
  const internships = [];

  const parseBlock = (lines, isInternship) => {
    const results = [];
    let currentItem = null;

    for (const line of lines) {
      const isBullet = line.startsWith('-') || line.startsWith('*');
      const cleanLine = line.replace(/^[-*•\s]+/, '').trim();
      if (!cleanLine) continue;

      // Check for dates e.g., "Jan 2024 - Jun 2024" or "2023 - Present"
      const dateMatch = cleanLine.match(
        /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*\d{4}\s*[-–]\s*(?:Present|Current|\w+\s*\d{4}|\d{4})\b/i
      );

      if (!isBullet && (dateMatch || cleanLine.length <= 60)) {
        if (currentItem) results.push(currentItem);

        const techFound = normalizedSkills.filter((tech) =>
          new RegExp(`\\b${tech}\\b`, 'i').test(line)
        );

        currentItem = {
          company: cleanLine.split(/[-–|,]/)[0].trim(),
          role: cleanLine.includes('-') ? cleanLine.split(/[-–]/)[1]?.trim() : (isInternship ? 'Intern' : 'Software Engineer'),
          duration: dateMatch ? dateMatch[0] : null,
          technologies: techFound,
          description: cleanLine,
        };
      } else if (currentItem) {
        currentItem.description = `${currentItem.description} ${cleanLine}`.trim();
        normalizedSkills.forEach((tech) => {
          if (
            !currentItem.technologies.includes(tech) &&
            new RegExp(`\\b${tech}\\b`, 'i').test(cleanLine)
          ) {
            currentItem.technologies.push(tech);
          }
        });
      }

      if (results.length >= 4) break;
    }

    if (currentItem && results.length < 4) results.push(currentItem);
    return results;
  };

  if (expLines.length > 0) {
    experience.push(...parseBlock(expLines, false));
  }

  if (internLines.length > 0) {
    internships.push(...parseBlock(internLines, true));
  }

  return { experience, internships };
}

/**
 * Extracts certifications, achievements, and languages.
 */
export function extractExtras(rawText, sections) {
  const certLines = sections.certifications || [];
  const achieveLines = sections.achievements || [];
  const langLines = sections.languages || [];

  const certifications = certLines
    .filter((l) => l.trim().length > 3)
    .slice(0, 5)
    .map((l) => ({
      name: l.replace(/^[-*•\s]+/, '').trim(),
      issuer: null,
      date: null,
    }));

  const achievements = achieveLines
    .filter((l) => l.trim().length > 3)
    .slice(0, 5)
    .map((l) => ({
      achievement: l.replace(/^[-*•\s]+/, '').trim(),
      organization: null,
      date: null,
    }));

  const languages = [];
  const langText = langLines.join(' ') || rawText;
  for (const lang of KNOWN_LANGUAGES) {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(langText)) {
      languages.push({
        language: lang,
        proficiency: null,
      });
    }
  }

  return { certifications, achievements, languages };
}

/**
 * Computes deterministic confidence score (high, medium, low) based on detected fields.
 */
export function calculateConfidence(profile) {
  let score = 0;
  let fieldsCount = 0;

  if (profile.personal.email) { score++; fieldsCount++; }
  if (profile.personal.phone) { score++; fieldsCount++; }
  if (profile.personal.full_name) { fieldsCount++; }
  if (profile.personal.linkedin_url || profile.personal.github_url) { fieldsCount++; }

  if (profile.education.length > 0 && (profile.education[0].degree || profile.education[0].institution)) {
    score++;
    fieldsCount++;
  }

  if (profile.skills.normalized.length >= 3) {
    score++;
    fieldsCount++;
  } else if (profile.skills.normalized.length > 0) {
    fieldsCount++;
  }

  if (profile.projects.length > 0) fieldsCount++;
  if (profile.internships.length > 0 || profile.experience.length > 0) fieldsCount++;

  let confidence = 'low';
  if (score >= 4) {
    confidence = 'high';
  } else if (score >= 2) {
    confidence = 'medium';
  }

  return { confidence, fieldsCount };
}

/**
 * Main Deterministic Resume Parser Function
 * Completely free, no AI, no external dependencies.
 */
export function parseResumeRules(rawText, fileName = '') {
  const normalized = normalizeText(rawText);
  const sections = detectSections(normalized);

  // 1. Personal & Contact
  const personal = extractContactInfo(normalized, sections, fileName);

  // 2. Education
  const education = extractEducation(normalized, sections);

  // 3. Skills
  const skills = extractSkills(normalized, sections);

  // 4. Projects
  const projects = extractProjects(normalized, sections, skills.normalized);

  // 5. Experience & Internships
  const { experience, internships } = extractExperienceAndInternships(normalized, sections, skills.normalized);

  // 6. Certifications, Achievements, Languages
  const { certifications, achievements, languages } = extractExtras(normalized, sections);

  // 7. Career alignment (deterministic)
  const experience_level = experience.length > 0 ? '0-1 years' : 'Fresher';
  const job_categories = [];
  if (skills.frameworks.some((f) => ['React', 'Vue.js', 'Angular', 'Next.js', 'HTML5', 'CSS3'].includes(f))) {
    job_categories.push('Frontend Development');
  }
  if (skills.programming_languages.some((p) => ['Python', 'Java', 'Go', 'Node.js'].includes(p)) || skills.frameworks.some((f) => ['Express.js', 'Django', 'FastAPI', 'Spring Boot'].includes(f))) {
    job_categories.push('Backend Development');
  }
  if (skills.databases.length > 0 && skills.frameworks.length > 0) {
    job_categories.push('Full Stack Development');
  }

  const result = {
    personal,
    education,
    skills,
    experience,
    internships,
    projects,
    certifications,
    achievements,
    languages,
    career: {
      experience_level,
      job_categories: Array.from(new Set(job_categories)),
    },
  };

  const { confidence, fieldsCount } = calculateConfidence(result);
  result.confidence = confidence;
  result.extracted_fields_count = fieldsCount;

  return result;
}
