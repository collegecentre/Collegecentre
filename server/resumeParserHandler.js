import { authenticateRequestUser } from './supabaseAdmin.js';
import { parseResumeRules } from './ruleResumeParser.js';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB limit as specified

/**
 * Sanitizes input file names to prevent directory traversal and illegal characters.
 */
export function sanitizeFileName(name) {
  if (!name || typeof name !== 'string') return 'resume.pdf';
  return name.replace(/^.*[\\\/]/, '').replace(/[^a-zA-Z0-9._\s()\-]/g, '_').trim();
}

/**
 * Validates and sanitizes extracted profile structures into guaranteed safe schema.
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
    confidence: safe.confidence || 'medium',
    extracted_fields_count: safe.extracted_fields_count || 0,
  };
}

/**
 * Offline sample profile generator for testing.
 */
export function generateMockProfile(fileName) {
  const nameFromFilename = fileName
    ? fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/resume/gi, '').trim()
    : 'Candidate';

  return {
    personal: {
      full_name: nameFromFilename ? (nameFromFilename.includes(' ') ? nameFromFilename : `${nameFromFilename} Candidate`) : 'Ananya Deshmukh',
      email: 'ananya.deshmukh@college.edu',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      linkedin_url: 'https://linkedin.com/in/ananya-deshmukh',
      github_url: 'https://github.com/ananya-deshmukh',
      portfolio_url: 'https://ananya.dev',
    },
    education: [
      {
        institution: 'National Institute of Technology Karnataka (NITK), Surathkal',
        degree: 'B.Tech Computer Science & Engineering',
        field_of_study: 'Computer Science',
        start_year: 2022,
        graduation_year: 2026,
        gpa_or_percentage: '8.85 / 10 CGPA',
      },
    ],
    skills: {
      programming_languages: ['TypeScript', 'JavaScript', 'Python', 'Go'],
      frameworks: ['React', 'Next.js', 'Tailwind CSS', 'FastAPI'],
      libraries: ['Redux', 'Zod'],
      databases: ['PostgreSQL', 'Redis'],
      tools: ['Git', 'Docker', 'Kubernetes'],
      cloud: ['AWS'],
      other: ['REST APIs', 'Data Structures & Algorithms'],
      normalized: [
        'TypeScript',
        'JavaScript',
        'Python',
        'Go',
        'React',
        'Next.js',
        'Tailwind CSS',
        'FastAPI',
        'PostgreSQL',
        'Redis',
        'Git',
        'Docker',
        'Kubernetes',
        'AWS',
        'REST APIs',
        'Data Structures & Algorithms',
      ],
    },
    experience: [],
    internships: [
      {
        company: 'Razorpay Software',
        role: 'Software Engineering Intern',
        duration: 'May 2025 – July 2025',
        technologies: ['TypeScript', 'React', 'FastAPI', 'PostgreSQL'],
        description: 'Engineered high-concurrency payment webhook processing service handling 2,000+ RPS.',
      },
    ],
    projects: [
      {
        name: 'Distributed Job Match Engine',
        description: 'Built a sub-millisecond candidate qualification scoring engine with inverted index matching in Go.',
        technologies: ['Go', 'Redis', 'Docker'],
        url: 'https://github.com/ananya-deshmukh/job-match-engine',
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
        achievement: 'Finalist at Smart India Hackathon (SIH 2024)',
        organization: 'Ministry of Education, Govt of India',
        date: '2024',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Professional' },
      { language: 'Hindi', proficiency: 'Fluent' },
    ],
    career: {
      experience_level: 'Fresher',
      job_categories: ['Software Development', 'Frontend Development', 'Backend Development'],
    },
    confidence: 'high',
    extracted_fields_count: 8,
  };
}

/**
 * Extracts raw PostScript text literals from uncompressed PDF streams.
 */
function extractTextFromPs(str, chunks) {
  if (!str) return;
  const parenRegex = /\(((?:[^()\\]|\\.)*)\)/g;
  let pMatch;
  while ((pMatch = parenRegex.exec(str)) !== null) {
    const val = pMatch[1]
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\r/g, '\n')
      .replace(/\\n/g, '\n')
      .trim();
    if (val && val.length >= 2 && !/^[\x00-\x1F\x7F-\x9F]+$/.test(val)) {
      chunks.push(val);
    }
  }
}

/**
 * Multi-layer PDF text extractor with OCR fallback.
 */
export async function extractPdfText(pdfBuffer) {
  let extractedText = '';

  // Layer 1: unpdf
  try {
    const { extractText } = await import('unpdf');
    const parsed = await extractText(new Uint8Array(pdfBuffer));
    if (parsed?.text) {
      const t = Array.isArray(parsed.text) ? parsed.text.join('\n\n') : String(parsed.text);
      if (t.trim().length >= 40) {
        extractedText = t.trim();
      }
    }
  } catch (e) {
    console.warn('[ResumeParser] Layer 1 (unpdf) notice:', e?.message);
  }

  // Layer 2: pdf-parse
  if (!extractedText) {
    try {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: pdfBuffer, verbosity: 0 });
      await parser.load();
      const res = await parser.getText();
      const t = res?.text || '';
      if (t.trim().length >= 40) {
        extractedText = t.trim();
      }
    } catch (e) {
      console.warn('[ResumeParser] Layer 2 (pdf-parse) notice:', e?.message);
    }
  }

  // Layer 3: FlateDecode PostScript stream decompression
  if (!extractedText) {
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
      if (joined.length >= 40) {
        extractedText = joined;
      }
    } catch (e) {
      console.warn('[ResumeParser] Layer 3 (stream) notice:', e?.message);
    }
  }

  // Layer 4: Raw words extraction
  if (!extractedText) {
    try {
      const str = pdfBuffer.toString('binary');
      const words = str.match(/[A-Za-z0-9+@._#\-\/]{3,}/g) || [];
      const filtered = words.filter(
        (w) =>
          !['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'filter', 'flatedecode', 'length'].includes(
            w.toLowerCase()
          )
      );
      if (filtered.length >= 25) {
        extractedText = filtered.join(' ');
      }
    } catch (e) {
      console.warn('[ResumeParser] Layer 4 (raw words) notice:', e?.message);
    }
  }

  // Layer 5: OCR Fallback for scanned / image-only PDFs
  if (!extractedText || extractedText.trim().length < 40) {
    console.log('[ResumeParser] Insufficient text extracted (<40 chars). Attempting OCR fallback...');
    try {
      const { createWorker } = await import('tesseract.js');
      
      // Look for embedded JPEG images in PDF stream (/Filter /DCTDecode)
      const binaryStr = pdfBuffer.toString('binary');
      const dctRegex = /\/Filter\s*(?:\[\s*)?\/DCTDecode[\s\S]*?stream\r?\n([\s\S]*?)\r?\nendstream/gi;
      let dctMatch;
      const imageBuffers = [];

      while ((dctMatch = dctRegex.exec(binaryStr)) !== null) {
        imageBuffers.push(Buffer.from(dctMatch[1], 'binary'));
        if (imageBuffers.length >= 3) break; // Limit to first 3 pages/images
      }

      if (imageBuffers.length > 0) {
        const worker = await createWorker('eng');
        const ocrResults = [];

        for (const imgBuf of imageBuffers) {
          const ret = await worker.recognize(imgBuf);
          if (ret?.data?.text) {
            ocrResults.push(ret.data.text);
          }
        }
        await worker.terminate();

        const combinedOcr = ocrResults.join('\n\n').trim();
        if (combinedOcr.length >= 40) {
          console.log('[ResumeParser] OCR successfully extracted text from scanned pages.');
          extractedText = combinedOcr;
        }
      }
    } catch (ocrErr) {
      console.warn('[ResumeParser] OCR processing failed or unavailable:', ocrErr?.message);
    }
  }

  return extractedText ? extractedText.trim() : '';
}

/**
 * Express / Vite HTTP Request Handler for /api/parse-resume
 * 100% Deterministic rule-based resume parsing without AI.
 */
export async function handleParseResume(req, res) {
  // 1. Authenticate Request
  const authUser = await authenticateRequestUser(req);
  if (!authUser) {
    return res.status(401).json({
      error: 'You must be signed in to parse a resume. Please sign in first.',
    });
  }

  // 2. Validate Payload
  const { fileName, fileType, fileData } = req.body || {};
  if (!fileData) {
    return res.status(400).json({ error: 'Missing resume file data in request payload.' });
  }

  const rawBase64 = String(fileData).replace(/^data:[^;]+;base64,/, '');
  if (!rawBase64 || rawBase64.trim().length === 0) {
    return res.status(400).json({ error: 'Uploaded file is empty. Please select a valid document.' });
  }

  let fileBuffer;
  try {
    fileBuffer = Buffer.from(rawBase64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid base64 payload. Could not decode file content.' });
  }

  // 3. Validate File Size (10 MB max)
  if (fileBuffer.length > MAX_FILE_BYTES) {
    return res.status(400).json({
      error: 'File exceeds maximum 10 MB size limit. Please upload a smaller document.',
    });
  }

  // 4. Validate File Type & Sanitize File Name
  const safeFileName = sanitizeFileName(fileName);
  const lowerName = safeFileName.toLowerCase();
  const lowerType = String(fileType || '').toLowerCase();
  const isPdf = lowerName.endsWith('.pdf') || lowerType.includes('pdf');
  const isDocx = lowerName.endsWith('.docx') || lowerType.includes('wordprocessingml') || lowerType.includes('document');

  if (!isPdf && !isDocx) {
    return res.status(400).json({
      error: 'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).',
    });
  }

  // 5. Extract Text using Local Extractors
  let extractedText = '';
  if (isPdf) {
    extractedText = await extractPdfText(fileBuffer);
  } else {
    // For DOCX documents, extract readable strings from document xml stream
    try {
      const zlib = await import('zlib');
      const docStr = fileBuffer.toString('binary');
      const xmlMatch = docStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (xmlMatch) {
        extractedText = xmlMatch.map((m) => m.replace(/<[^>]+>/g, '')).join(' ');
      }
    } catch {
      // fallback
    }
  }

  // 6. Handle Scanned / Unreadable Documents
  if (!extractedText || extractedText.trim().length < 40) {
    return res.status(422).json({
      error: 'The uploaded PDF appears to be a scanned image or unreadable document. OCR could not extract sufficient text. Please upload a standard text-based PDF resume.',
    });
  }

  // 7. Deterministic Rule-Based Resume Parsing
  try {
    const parsedProfile = parseResumeRules(extractedText, safeFileName);
    const sanitizedProfile = sanitizeExtractedProfile(parsedProfile);

    return res.status(200).json({
      success: true,
      profile: sanitizedProfile,
      extracted: sanitizedProfile,
      parser: 'rule-based',
      confidence: sanitizedProfile.confidence,
      note: 'Your resume was parsed instantly and locally using deterministic rule matching. No AI was used.',
    });
  } catch (parseError) {
    console.error('[ResumeParser] Rule parsing error:', parseError);
    return res.status(500).json({
      error: 'An error occurred while analyzing the resume text. Please verify the document format.',
    });
  }
}
