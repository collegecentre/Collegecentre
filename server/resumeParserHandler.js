import { authenticateRequestUser } from './supabaseAdmin.js';
import { parseResumeWithScript } from './scriptResumeParser.js';

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

const GEMINI_SYSTEM_PROMPT = `You are a resume information extraction system. Extract only information explicitly present in the resume. Never invent information. If information is missing, return null or an empty array.

Return a strictly formatted JSON object matching this exact schema:
{
  "personal": {
    "full_name": string | null,
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "linkedin_url": string | null,
    "github_url": string | null,
    "portfolio_url": string | null
  },
  "education": [
    {
      "institution": string,
      "degree": string,
      "field_of_study": string,
      "start_year": number | null,
      "graduation_year": number | null,
      "gpa_or_percentage": string | null
    }
  ],
  "skills": {
    "programming_languages": string[],
    "frameworks": string[],
    "libraries": string[],
    "databases": string[],
    "tools": string[],
    "cloud": string[],
    "other": string[],
    "normalized": string[]
  },
  "experience": [
    {
      "company": string,
      "role": string,
      "location": string | null,
      "employment_type": string | null,
      "start_date": string | null,
      "end_date": string | null,
      "current": boolean,
      "description": string | null,
      "technologies": string[]
    }
  ],
  "internships": [
    {
      "company": string,
      "role": string,
      "duration": string | null,
      "technologies": string[],
      "description": string | null
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string | null,
      "technologies": string[],
      "url": string | null
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string | null,
      "date": string | null
    }
  ],
  "achievements": [
    {
      "achievement": string,
      "organization": string | null,
      "date": string | null
    }
  ],
  "languages": [
    {
      "language": string,
      "proficiency": string | null
    }
  ],
  "career": {
    "experience_level": "Fresher" | "0-1 years" | "1-2 years" | null,
    "job_categories": string[]
  }
}

Rules:
1. Do not infer skills that are not explicitly stated.
2. If GPA or percentage is not explicitly in the text, return null.
3. If an internship is explicitly labeled as an internship, put it in "internships", otherwise put general employment in "experience".
4. "normalized" skills should be canonical technology names (e.g. "React", "Python", "Node.js", "PostgreSQL", "Docker").`;

/**
 * Validates and sanitizes raw JSON from Gemini into a reliable ResumeExtractedProfile structure.
 */
export function sanitizeExtractedProfile(raw) {
  const safe = (raw && typeof raw === 'object') ? raw : {};

  const p = safe.personal || {};
  const personal = {
    full_name: typeof p.full_name === 'string' && p.full_name.trim() ? p.full_name.trim() : null,
    email: typeof p.email === 'string' && p.email.trim() ? p.email.trim() : null,
    phone: typeof p.phone === 'string' && p.phone.trim() ? p.phone.trim() : null,
    location: typeof p.location === 'string' && p.location.trim() ? p.location.trim() : null,
    linkedin_url: typeof p.linkedin_url === 'string' && p.linkedin_url.trim() ? p.linkedin_url.trim() : null,
    github_url: typeof p.github_url === 'string' && p.github_url.trim() ? p.github_url.trim() : null,
    portfolio_url: typeof p.portfolio_url === 'string' && p.portfolio_url.trim() ? p.portfolio_url.trim() : null,
  };

  const education = Array.isArray(safe.education)
    ? safe.education.map((e) => ({
        institution: String(e.institution || '').trim(),
        degree: String(e.degree || '').trim(),
        field_of_study: String(e.field_of_study || '').trim(),
        start_year: typeof e.start_year === 'number' ? e.start_year : null,
        graduation_year: typeof e.graduation_year === 'number' ? e.graduation_year : null,
        gpa_or_percentage: typeof e.gpa_or_percentage === 'string' && e.gpa_or_percentage.trim() ? e.gpa_or_percentage.trim() : null,
      })).filter((e) => e.institution || e.degree)
    : [];

  const s = safe.skills || {};
  const toStringArray = (arr) =>
    Array.isArray(arr)
      ? arr
          .filter((v) => v !== null && v !== undefined)
          .map(String)
          .map((v) => v.trim())
          .filter((v) => v !== '' && v.toLowerCase() !== 'null' && v.toLowerCase() !== 'undefined')
      : [];

  const skills = {
    programming_languages: toStringArray(s.programming_languages),
    frameworks: toStringArray(s.frameworks),
    libraries: toStringArray(s.libraries),
    databases: toStringArray(s.databases),
    tools: toStringArray(s.tools),
    cloud: toStringArray(s.cloud),
    other: toStringArray(s.other),
    normalized: toStringArray(s.normalized),
  };

  if (skills.normalized.length === 0) {
    skills.normalized = Array.from(new Set([
      ...skills.programming_languages,
      ...skills.frameworks,
      ...skills.databases,
      ...skills.tools,
      ...skills.cloud,
    ]));
  }

  const experience = Array.isArray(safe.experience)
    ? safe.experience.map((exp) => ({
        company: String(exp.company || '').trim(),
        role: String(exp.role || '').trim(),
        location: exp.location ? String(exp.location).trim() : null,
        employment_type: exp.employment_type ? String(exp.employment_type).trim() : null,
        start_date: exp.start_date ? String(exp.start_date).trim() : null,
        end_date: exp.end_date ? String(exp.end_date).trim() : null,
        current: Boolean(exp.current),
        description: exp.description ? String(exp.description).trim() : null,
        technologies: toStringArray(exp.technologies),
      })).filter((e) => e.company || e.role)
    : [];

  const internships = Array.isArray(safe.internships)
    ? safe.internships.map((i) => ({
        company: String(i.company || '').trim(),
        role: String(i.role || '').trim(),
        duration: i.duration ? String(i.duration).trim() : null,
        technologies: toStringArray(i.technologies),
        description: i.description ? String(i.description).trim() : null,
      })).filter((i) => i.company || i.role)
    : [];

  const projects = Array.isArray(safe.projects)
    ? safe.projects.map((proj) => ({
        name: String(proj.name || '').trim(),
        description: proj.description ? String(proj.description).trim() : null,
        technologies: toStringArray(proj.technologies),
        url: proj.url ? String(proj.url).trim() : null,
      })).filter((p) => p.name)
    : [];

  const certifications = Array.isArray(safe.certifications)
    ? safe.certifications.map((c) => ({
        name: String(c.name || '').trim(),
        issuer: c.issuer ? String(c.issuer).trim() : null,
        date: c.date ? String(c.date).trim() : null,
      })).filter((c) => c.name)
    : [];

  const achievements = Array.isArray(safe.achievements)
    ? safe.achievements.map((a) => ({
        achievement: String(a.achievement || '').trim(),
        organization: a.organization ? String(a.organization).trim() : null,
        date: a.date ? String(a.date).trim() : null,
      })).filter((a) => a.achievement)
    : [];

  const languages = Array.isArray(safe.languages)
    ? safe.languages.map((l) => ({
        language: String(l.language || '').trim(),
        proficiency: l.proficiency ? String(l.proficiency).trim() : null,
      })).filter((l) => l.language)
    : [];

  const c = safe.career || {};
  const career = {
    experience_level: c.experience_level ? String(c.experience_level).trim() : 'Fresher',
    job_categories: toStringArray(c.job_categories),
  };

  return {
    personal,
    education,
    skills,
    experience,
    internships,
    projects,
    certifications,
    achievements,
    languages,
    career,
  };
}

/**
 * Isolated development mock extraction for offline testing.
 */
export function generateMockProfile(fileName = 'sample_resume.pdf') {
  return sanitizeExtractedProfile({
    personal: {
      full_name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@nitk.edu.in',
      phone: '+91 98451 22334',
      location: 'Bengaluru, India',
      linkedin_url: 'https://linkedin.com/in/ananya-deshmukh',
      github_url: 'https://github.com/ananya-codes',
      portfolio_url: null,
    },
    education: [
      {
        institution: 'National Institute of Technology Karnataka (NITK), Surathkal',
        degree: 'Bachelor of Technology',
        field_of_study: 'Computer Science and Engineering',
        start_year: 2022,
        graduation_year: 2026,
        gpa_or_percentage: '8.85 / 10 CGPA',
      },
    ],
    skills: {
      programming_languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'],
      frameworks: ['React', 'Next.js', 'Express.js', 'FastAPI'],
      libraries: ['Redux Toolkit', 'Tailwind CSS', 'Pandas'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      tools: ['Git', 'Docker', 'Postman'],
      cloud: ['AWS (S3, Lambda)'],
      other: ['RESTful APIs', 'Data Structures & Algorithms', 'System Design'],
      normalized: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'MongoDB', 'Git'],
    },
    experience: [],
    internships: [
      {
        company: 'Zepto Labs',
        role: 'Software Development Intern (Backend)',
        duration: 'May 2025 - July 2025 (3 mos)',
        technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis'],
        description: 'Optimized delivery order dispatch queue microservices, reducing dispatch latency by 24%. Built REST endpoints with automated unit test suites.',
      },
    ],
    projects: [
      {
        name: 'Campus Job Sprint Matching Engine',
        description: 'Full-stack platform matching college graduates to verified entry-level software engineer roles with deterministic criteria matching.',
        technologies: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
        url: 'https://github.com/ananya-codes/job-match',
      },
      {
        name: 'Algorithmic Visualizer',
        description: 'Interactive visualization tool for pathfinding and tree traversal algorithms.',
        technologies: ['JavaScript', 'Canvas API', 'React'],
        url: null,
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024',
      },
    ],
    achievements: [
      {
        achievement: 'Finalist at Smart India Hackathon (SIH)',
        organization: 'Ministry of Education',
        date: '2024',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Professional' },
      { language: 'Hindi', proficiency: 'Native' },
    ],
    career: {
      experience_level: 'Fresher',
      job_categories: ['Software Development', 'Frontend Development', 'Full Stack', 'Backend Development'],
    },
  });
}

/**
 * Main HTTP handler for POST /api/parse-resume
 */
export async function handleParseResume(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate Request User
  const user = await authenticateRequestUser(req);
  const studentEmail = req.headers?.['x-student-email'] || req.headers?.['X-Student-Email'];
  if (!user && !studentEmail && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized: Valid student session required to parse resume' });
  }

  const { fileData, fileName, fileType, parserMode } = req.body || {};

  // 2. Validate File Presence
  if (!fileData || typeof fileData !== 'string') {
    return res.status(400).json({ error: 'No file data received. Please select a resume file to upload.' });
  }

  // Clean all whitespace, newlines, tabs, and data URI prefixes
  const rawBase64 = fileData.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');
  if (!rawBase64) {
    return res.status(400).json({ error: 'Uploaded resume document is empty.' });
  }

  // Ensure pure RFC 4648 standard base64 encoding without breaks or padding issues
  let base64Content = rawBase64;
  try {
    base64Content = Buffer.from(rawBase64, 'base64').toString('base64');
  } catch {
    base64Content = rawBase64;
  }

  // 3. Validate File Size
  const approximateBytes = Math.ceil((base64Content.length * 3) / 4);
  if (approximateBytes > MAX_FILE_BYTES) {
    return res.status(400).json({ error: 'File exceeds maximum 8 MB size limit. Please upload a smaller document.' });
  }

  // 4. Validate File Type
  const lowerName = String(fileName || '').toLowerCase();
  const lowerType = String(fileType || '').toLowerCase();
  const isPdf = lowerName.endsWith('.pdf') || lowerType.includes('pdf');
  const isDocx = lowerName.endsWith('.docx') || lowerType.includes('wordprocessingml') || lowerType.includes('document');

  if (!isPdf && !isDocx) {
    return res.status(400).json({
      error: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).',
    });
  }

  const mimeType = isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  // 5. Development Mock Fallback Check
  const isMockMode = process.env.GEMINI_MOCK === 'true' || !process.env.GEMINI_API_KEY;
  if (isMockMode) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ error: 'AI resume parsing configuration error: GEMINI_API_KEY is not configured.' });
    }
    const mockData = generateMockProfile(fileName);
    return res.status(200).json({
      success: true,
      profile: mockData,
      extracted: mockData,
      isMock: true,
    });
  }

  // 6. Invoke Google Gemini API with fallback resilience across available models
  const apiKey = process.env.GEMINI_API_KEY;
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
  const candidateModels = Array.from(
    new Set([
      preferredModel,
      'gemini-3.7-flash',
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
    ])
  );

  // Extract text from PDF buffer with multi-layer fallback resilience
  let extractedPdfText = '';
  if (isPdf) {
    const pdfBuffer = Buffer.from(base64Content, 'base64');
    
    // Layer 1: unpdf
    try {
      const { extractText } = await import('unpdf');
      const parsed = await extractText(new Uint8Array(pdfBuffer));
      if (parsed?.text) {
        const t = Array.isArray(parsed.text) ? parsed.text.join('\n\n') : String(parsed.text);
        if (t.trim().length > 30) extractedPdfText = t.trim();
      }
    } catch (e) {
      console.warn('[ResumeParser] unpdf notice:', e?.message);
    }

    // Layer 2: pdf-parse (PDFParse)
    if (!extractedPdfText) {
      try {
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: pdfBuffer, verbosity: 0 });
        await parser.load();
        const res = await parser.getText();
        const t = res?.text || '';
        if (t.trim().length > 30) extractedPdfText = t.trim();
      } catch (e) {
        console.warn('[ResumeParser] pdf-parse notice:', e?.message);
      }
    }

    // Layer 3: Direct Stream & FlateDecode decompression (immune to unterminated string errors)
    if (!extractedPdfText) {
      try {
        const zlib = await import('zlib');
        const str = pdfBuffer.toString('binary');
        const chunks = [];

        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        let sMatch;
        while ((sMatch = streamRegex.exec(str)) !== null) {
          try {
            const decompressed = zlib.inflateSync(Buffer.from(sMatch[1], 'binary')).toString('binary');
            extractTextFromPs(decompressed, chunks);
          } catch {
            extractTextFromPs(sMatch[1], chunks);
          }
        }
        extractTextFromPs(str, chunks);

        const joined = chunks.join(' ').replace(/\\([()\\])/g, '$1').replace(/\s+/g, ' ').trim();
        if (joined.length > 30) {
          extractedPdfText = joined;
        } else {
          // Layer 4: Raw words extraction
          const words = str.match(/[A-Za-z0-9+@._#\-\/]{3,}/g) || [];
          const filtered = words.filter(w => !['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'filter', 'flatedecode', 'length'].includes(w.toLowerCase()));
          if (filtered.length > 20) {
            extractedPdfText = filtered.join(' ');
          }
        }
      } catch (e) {
        console.warn('[ResumeParser] stream extraction notice:', e?.message);
      }
    }
  }

  // If explicit Script mode requested, bypass AI and execute deterministic parser directly
  if (parserMode === 'script') {
    console.log('[ResumeParser] Running deterministic Script Parser mode on demand');
    const textToParse = extractedPdfText || fileName;
    const scriptProfile = parseResumeWithScript(textToParse, fileName);
    return res.status(200).json({
      success: true,
      profile: scriptProfile,
      extracted: scriptProfile,
      parser: 'script',
      note: 'Parsed instantly using deterministic rule engine.',
    });
  }

  const hasText = Boolean(extractedPdfText && extractedPdfText.trim().length > 30);

  const payload = hasText
    ? {
        contents: [
          {
            parts: [
              {
                text: `Candidate Resume Content:\n"""\n${extractedPdfText.trim()}\n"""\n\n${GEMINI_SYSTEM_PROMPT}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }
    : {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Content,
                },
              },
              {
                text: GEMINI_SYSTEM_PROMPT,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      };

  console.log(
    `[ResumeParser] Processing document: fileName="${fileName}", fileType="${fileType}", mimeType="${mimeType}", base64Length=${base64Content.length}, hasExtractedText=${hasText}`
  );

  try {
    let response = null;
    let lastErr = '';

    for (const modelName of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (apiRes.ok) {
        response = apiRes;
        break;
      }

      const errText = await apiRes.text();
      let parsedErr = '';
      try {
        const errJson = JSON.parse(errText);
        parsedErr = errJson?.error?.message || '';
        console.error(`[ResumeParser] Gemini API (${modelName}) returned ${apiRes.status}:`, JSON.stringify(errJson));
      } catch {
        parsedErr = errText;
        console.error(`[ResumeParser] Gemini API (${modelName}) returned ${apiRes.status}: ${errText}`);
      }
      lastErr = parsedErr || errText;

      // If a model is deprecated (404), temporarily high demand (503), or rate limited (429), try next model in pool
      console.warn(`[ResumeParser] Model ${modelName} returned status ${apiRes.status}. Trying next candidate model...`);
    }

    if (!response) {
      console.warn(`[ResumeParser] AI parsing unavailable (${lastErr}), automatically falling back to Script Parser`);
      const fallbackProfile = parseResumeWithScript(extractedPdfText || fileName, fileName);
      return res.status(200).json({
        success: true,
        profile: fallbackProfile,
        extracted: fallbackProfile,
        parser: 'script-fallback',
        note: 'Parsed via deterministic resume script engine.',
      });
    }

    const geminiData = await response.json();
    const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('[ResumeParser] Empty candidate text from AI, falling back to Script Parser');
      const fallbackProfile = parseResumeWithScript(extractedPdfText || fileName, fileName);
      return res.status(200).json({
        success: true,
        profile: fallbackProfile,
        extracted: fallbackProfile,
        parser: 'script-fallback',
        note: 'Parsed via deterministic resume script engine.',
      });
    }

    // Clean potential markdown wrapping
    const cleanJson = candidateText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    let parsedProfile;
    try {
      parsedProfile = JSON.parse(cleanJson);
    } catch {
      console.warn('[ResumeParser] JSON parse error from AI response, falling back to Script Parser');
      const fallbackProfile = parseResumeWithScript(extractedPdfText || fileName, fileName);
      return res.status(200).json({
        success: true,
        profile: fallbackProfile,
        extracted: fallbackProfile,
        parser: 'script-fallback',
        note: 'Parsed via deterministic resume script engine.',
      });
    }

    // 7. Sanitize and Validate Structured Output
    const sanitized = sanitizeExtractedProfile(parsedProfile);

    return res.status(200).json({
      success: true,
      profile: sanitized,
      extracted: sanitized,
      parser: 'gemini',
    });
  } catch (err) {
    console.error('Resume parsing execution error, falling back to Script Parser:', err.message);
    const fallbackProfile = parseResumeWithScript(extractedPdfText || fileName, fileName);
    return res.status(200).json({
      success: true,
      profile: fallbackProfile,
      extracted: fallbackProfile,
      parser: 'script-fallback',
      note: 'Parsed via deterministic resume script engine.',
    });
  }
}

function extractTextFromPs(ps, out) {
  if (!ps || typeof ps !== 'string') return;
  const strRegex = /\(([\s\S]*?)\)\s*(?:Tj|'|"|TJ)/g;
  let m;
  while ((m = strRegex.exec(ps)) !== null) {
    const clean = m[1].replace(/\\([()\\])/g, '$1').trim();
    if (clean.length > 1 && !/^[^\x20-\x7E]+$/.test(clean)) {
      out.push(clean);
    }
  }

  const hexRegex = /<([0-9a-fA-F]{4,})>\s*(?:Tj|TJ)/g;
  let hm;
  while ((hm = hexRegex.exec(ps)) !== null) {
    const hex = hm[1];
    let decoded = '';
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16);
      if (code >= 32 && code <= 126) decoded += String.fromCharCode(code);
    }
    if (decoded.trim().length > 1) {
      out.push(decoded.trim());
    }
  }
}

