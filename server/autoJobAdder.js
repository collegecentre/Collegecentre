import { supabaseAdmin } from './supabaseAdmin.js';

const FETCH_TIMEOUT_MS = 15000;

// Seniority & Exclusion Filters
const seniorTitle = /\b(senior|sr\.?|staff|principal|lead|manager|director|architect|head of|vp|vice president|chief|mid[- ]level|expert)\b/i;
const nonFresherRole = /\b(account executive|sales executive|sales manager|business development manager|enterprise account|solutions architect)\b/i;
const fresherKeyword = /\b(fresher|entry[ -]?level|junior|graduate|new grad|intern(ship)?|trainee|apprentice|associate|early career|university graduate|campus|engineer\s*(?:i|1)|level\s*1|l1|microtask|tutor|tasker|support specialist|customer care|customer experience)\b/i;
const zeroExperience = /\b(no experience|no prior experience|0\s*(?:-|to)?\s*1\s*(?:years?|yrs?)|0\+?\s*(?:years?|yrs?))\b/i;
const experienceRange = /\b(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*(?:years?|yrs?)\b/gi;
const experienceYears = /\b(\d{1,2})\+?\s*(?:years?|yrs?)\b/gi;

export function plainText(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Evaluates whether a job qualifies for freshers/entry-level candidates.
 */
export function isFresherJob(job) {
  const title = plainText(job.title || '');
  const text = plainText(title + ' ' + (job.description || ''));

  if (seniorTitle.test(title) || nonFresherRole.test(title)) return false;

  const ranges = [...text.matchAll(experienceRange)].map((m) => [parseInt(m[1], 10), parseInt(m[2], 10)]);
  const hasEntryRange = ranges.some(([min]) => min < 2);
  const standaloneYears = [...text.matchAll(experienceYears)].map((m) => parseInt(m[1], 10));
  if (!hasEntryRange && standaloneYears.some((year) => year >= 2)) return false;

  if (fresherKeyword.test(text) || zeroExperience.test(text)) return true;

  return /\b(junior|jr\.?|associate|graduate|intern|trainee|engineer\s*(?:i|1)|level\s*1|l1)\b/i.test(title);
}

export function canonicalJobUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    [...url.searchParams.keys()].forEach((key) => {
      if (/^utm_/i.test(key) || /^(ref|source|campaign)$/i.test(key)) url.searchParams.delete(key);
    });
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return (value || '').trim();
  }
}

function normalize(value) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getJobFingerprint(job) {
  return [normalize(job.title || ''), normalize(job.company || ''), normalize(canonicalJobUrl(job.url || job.application_url || ''))].join('|');
}

function cleanSlug(val) {
  if (!val) return '';
  const segment = val.includes('/') ? val.split('/').filter(Boolean).pop() || '' : val;
  return segment.replace(/[^a-zA-Z0-9_-]/g, '');
}

function normalizePublishedAt(value) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  if (date.getTime() > Date.now() + 24 * 60 * 60 * 1000) return new Date().toISOString();
  return date.toISOString();
}

export function getJobCategory(job) {
  const text = (job.title + ' ' + (job.description || '')).toLowerCase();
  if (/\b(frontend|front-end|react|vue|angular|svelte|nextjs|next\.js|tailwind|css|html)\b/.test(text)) return 'Frontend Development';
  if (/\b(backend|back-end|node|express|django|flask|spring boot|fastapi|golang|ruby|sql|database)\b/.test(text)) return 'Backend Development';
  if (/\b(machine learning|artificial intelligence|llm|generative ai|ai engineer|data scientist|deep learning|nlp|data analyst|analytics)\b/.test(text)) return 'Data & AI';
  if (/\b(android|ios|react native|flutter|mobile developer|swift|kotlin)\b/.test(text)) return 'Mobile Development';
  if (/\b(devops|cloud|aws|azure|gcp|docker|kubernetes|sre|infrastructure)\b/.test(text)) return 'DevOps & Cloud';
  if (/\b(qa|quality assurance|testing|test engineer|automation|selenium|cypress|playwright)\b/.test(text)) return 'QA / Testing';
  if (/\b(ux|ui|designer|product design|figma)\b/.test(text)) return 'Design / UI / UX';
  if (/\b(product manager|product owner|project coordinator)\b/.test(text)) return 'Product Management';
  return 'Software Development';
}

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'React', 'Node.js', 'Next.js', 'Vue', 'Angular', 'Express.js', 'Django', 'FastAPI', 'Spring Boot',
  'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'GraphQL', 'REST API',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Git', 'CI/CD',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP',
  'Figma', 'UI/UX', 'Selenium', 'Postman', 'Data Structures', 'Algorithms'
];

export function extractSkills(job) {
  const text = (job.title + ' ' + (job.description || '')).toLowerCase();
  const found = [];
  for (const skill of COMMON_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'i');
    if (regex.test(text)) {
      found.push(skill);
      if (found.length >= 6) break;
    }
  }
  if (found.length === 0) {
    found.push('Problem Solving', 'Data Structures');
  }
  return found;
}

// -------------------------------------------------------------
// Source Fetchers
// -------------------------------------------------------------

async function fetchRemotive() {
  const res = await fetch('https://remotive.com/api/remote-jobs', {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('Remotive HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data?.jobs) ? data.jobs : [];
  return list.map((j) => ({
    id: 'remotive_' + String(j.id),
    title: String(j.title || ''),
    company: String(j.company_name || ''),
    location: String(j.candidate_required_location || 'Remote (Worldwide)'),
    url: String(j.url || ''),
    description: String(j.description || ''),
    salary: String(j.salary || 'Competitive Fresher CTC'),
    source: 'Remotive',
    publishedAt: j.publication_date ? String(j.publication_date) : undefined,
  }));
}

async function fetchRemoteOK() {
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'CollegeCentre-Bot/1.0' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('RemoteOK HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data) ? data.filter((j) => j && j.id) : [];
  return list.map((j) => ({
    id: 'remoteok_' + String(j.id),
    title: String(j.position || ''),
    company: String(j.company || ''),
    location: String(j.location || 'Remote'),
    url: String(j.url || 'https://remoteok.com/remote-jobs/' + j.id),
    description: String(j.description || ''),
    salary: j.salary_min && j.salary_max ? ('$' + j.salary_min + '–' + j.salary_max) : 'Competitive Fresher CTC',
    source: 'RemoteOK',
    publishedAt: j.date ? String(j.date) : undefined,
  }));
}

async function fetchArbeitnow() {
  const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('Arbeitnow HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map((j) => ({
    id: 'arbeitnow_' + cleanSlug(j.slug || j.title),
    title: String(j.title || ''),
    company: String(j.company_name || ''),
    location: String(j.location || 'Remote'),
    url: String(j.url || ''),
    description: String(j.description || ''),
    salary: 'Competitive Fresher CTC',
    source: 'Arbeitnow',
    publishedAt: typeof j.created_at === 'number' ? new Date(j.created_at * 1000).toISOString() : undefined,
  }));
}

async function fetchJobicy() {
  const res = await fetch('https://jobicy.com/api/v2/remote-jobs', {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('Jobicy HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data?.jobs) ? data.jobs : [];
  return list.map((j) => ({
    id: 'jobicy_' + String(j.id),
    title: String(j.jobTitle || ''),
    company: String(j.companyName || ''),
    location: String(j.jobGeo || 'Remote (Worldwide)'),
    url: String(j.url || ''),
    description: String(j.jobExcerpt || j.jobDescription || ''),
    salary: String(j.annualSalaryMin ? ((j.salaryCurrency || '$') + j.annualSalaryMin + '–' + j.annualSalaryMax) : 'Competitive Fresher CTC'),
    source: 'Jobicy',
    publishedAt: j.pubDate ? String(j.pubDate) : undefined,
  }));
}

async function fetchHimalayas() {
  const res = await fetch('https://himalayas.app/jobs/api?limit=50', {
    headers: { 'User-Agent': 'CollegeCentre-Bot/1.0' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('Himalayas HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data?.jobs) ? data.jobs : [];
  return list.map((j) => {
    const appLink = String(j.applicationLink || j.guid || '');
    const slug = cleanSlug(appLink) || cleanSlug(j.slug) || cleanSlug(j.title) || Math.random().toString(36).slice(2, 8);
    const locations = Array.isArray(j.locationRestrictions) ? j.locationRestrictions.join(', ') : 'Remote';
    return {
      id: 'himalayas_' + slug,
      title: String(j.title || ''),
      company: String(j.companyName || ''),
      location: locations || 'Remote',
      url: appLink,
      description: String(j.description || ''),
      salary: j.minSalary && j.maxSalary ? ('$' + j.minSalary + '–$' + j.maxSalary) : 'Competitive Fresher CTC',
      source: 'Himalayas',
      publishedAt: typeof j.pubDate === 'number' ? new Date(j.pubDate * 1000).toISOString() : undefined,
    };
  });
}

async function fetchWorkingNomads() {
  const res = await fetch('https://www.workingnomads.com/api/exposed_jobs/', {
    headers: { 'User-Agent': 'CollegeCentre-Bot/1.0' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('WorkingNomads HTTP ' + res.status);
  const data = await res.json();
  const list = Array.isArray(data) ? data : [];
  return list.map((j) => {
    const slug = cleanSlug(String(j.id)) || cleanSlug(j.url) || cleanSlug(j.title) || Math.random().toString(36).slice(2, 8);
    return {
      id: 'workingnomads_' + slug,
      title: String(j.title || ''),
      company: String(j.company_name || ''),
      location: String(j.location || 'Remote'),
      url: String(j.url || ''),
      description: String(j.description || ''),
      salary: 'Competitive Fresher CTC',
      source: 'WorkingNomads',
      publishedAt: j.pub_date ? String(j.pub_date) : undefined,
    };
  });
}

async function fetchWeWorkRemotely() {
  const res = await fetch('https://weworkremotely.com/remote-jobs.rss', {
    headers: { 'User-Agent': 'CollegeCentre-Bot/1.0' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error('WeWorkRemotely HTTP ' + res.status);
  const xml = await res.text();
  const items = xml.split('<item>').slice(1);
  return items.map((item) => {
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const rawTitle = titleMatch ? titleMatch[1].trim() : '';
    const [company, ...roleParts] = rawTitle.includes(':') ? rawTitle.split(':') : ['WeWorkRemotely', rawTitle];
    const url = linkMatch ? linkMatch[1].trim() : '';
    const slug = cleanSlug(url) || cleanSlug(rawTitle) || Math.random().toString(36).slice(2, 8);
    return {
      id: 'wwr_' + slug,
      title: roleParts.join(':').trim() || rawTitle,
      company: company.trim(),
      location: 'Worldwide (Remote)',
      url,
      description: descMatch ? descMatch[1].trim() : '',
      salary: 'Competitive Fresher CTC',
      source: 'WeWorkRemotely',
      publishedAt: dateMatch ? new Date(dateMatch[1]).toISOString() : undefined,
    };
  }).filter((j) => Boolean(j.title && j.url));
}

const SOURCES = [
  fetchRemotive,
  fetchRemoteOK,
  fetchArbeitnow,
  fetchJobicy,
  fetchHimalayas,
  fetchWorkingNomads,
  fetchWeWorkRemotely,
];

/**
 * Harvests fresher jobs from all sources and returns deduplicated normalized jobs.
 */
export async function harvestFresherJobs() {
  const results = await Promise.allSettled(SOURCES.map((fn) => fn()));
  const allRaw = [];
  results.forEach((res, i) => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allRaw.push(...res.value);
    } else {
      console.warn('Source ' + SOURCES[i].name + ' failed: ' + (res.reason?.message || res.reason));
    }
  });

  const seenFingerprints = new Set();
  const fresherJobs = [];

  for (const raw of allRaw) {
    if (!raw.title || !raw.company || !raw.url) continue;
    if (!isFresherJob(raw)) continue;

    const canonicalUrl = canonicalJobUrl(raw.url);
    const fingerprint = getJobFingerprint({ ...raw, url: canonicalUrl });
    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    const isIntern = /intern(ship)?/i.test(raw.title);
    const postedAt = normalizePublishedAt(raw.publishedAt);
    const deadline = new Date(new Date(postedAt).getTime() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

    fresherJobs.push({
      id: raw.id,
      title: raw.title.trim(),
      company: raw.company.trim(),
      company_logo: raw.company.trim().charAt(0).toUpperCase() || 'C',
      location: raw.location.trim() || 'Remote',
      work_mode: 'Remote',
      salary: raw.salary || 'Competitive Fresher CTC',
      experience: isIntern ? 'Fresher / Student Intern' : 'Fresher (0–1 years)',
      education: 'B.Tech / BCA / MCA / Any Graduate',
      skills: extractSkills(raw),
      category: getJobCategory(raw),
      job_type: isIntern ? 'Internship' : 'Full-time',
      posted_at: postedAt,
      deadline,
      description: plainText(raw.description).slice(0, 1500),
      fresher_eligibility: true,
      application_url: canonicalUrl,
      source: raw.source || 'Official Careers',
      is_active: true,
    });
  }

  return {
    totalRaw: allRaw.length,
    fresherCount: fresherJobs.length,
    jobs: fresherJobs,
  };
}

/**
 * Optional Telegram Digest Alert
 */
async function sendTelegramAlert(newJobs) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId || !newJobs.length) return false;

  try {
    const count = newJobs.length;
    const topJobs = newJobs.slice(0, 5).map((j) => '• ' + j.title + ' @ ' + j.company + '\n  ' + j.application_url).join('\n\n');
    const text = '🎓 CollegeCentre Auto Job Adder\n\nDiscovered ' + count + ' new verified fresher job(s):\n\n' + topJobs;

    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10000),
    });
    return true;
  } catch (err) {
    console.warn('Telegram alert failed:', err.message);
    return false;
  }
}

/**
 * Main Auto Job Adder Pipeline:
 * Harvests, filters, deduplicates, cleans stale jobs, and syncs to Supabase.
 */
export async function runAutoJobAdder(options = {}) {
  const { dryRun = false } = options;
  const startTime = Date.now();

  const harvest = await harvestFresherJobs();
  const summary = {
    timestamp: new Date().toISOString(),
    durationMs: 0,
    totalRawFetched: harvest.totalRaw,
    fresherEligible: harvest.fresherCount,
    newInserted: 0,
    alreadyExisting: 0,
    staleRemoved: 0,
    telegramNotified: false,
    dryRun,
    jobs: harvest.jobs,
  };

  if (dryRun || !supabaseAdmin) {
    summary.durationMs = Date.now() - startTime;
    return summary;
  }

  try {
    // 1. Remove stale jobs older than 45 days
    const expiryDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
    const { error: delError } = await supabaseAdmin
      .from('cc_jobs')
      .delete()
      .lt('posted_at', expiryDate);
    if (!delError) {
      summary.staleRemoved = 1;
    }

    // 2. Fetch existing job fingerprints from database to prevent duplicate churn
    const { data: existingJobs } = await supabaseAdmin
      .from('cc_jobs')
      .select('id, title, company, application_url');

    const existingFingerprints = new Set(
      (existingJobs || []).map((j) =>
        getJobFingerprint({ title: j.title, company: j.company, url: j.application_url })
      )
    );
    const existingIds = new Set((existingJobs || []).map((j) => j.id));

    const toInsert = harvest.jobs.filter((j) => {
      if (existingIds.has(j.id)) {
        summary.alreadyExisting++;
        return false;
      }
      const fp = getJobFingerprint(j);
      if (existingFingerprints.has(fp)) {
        summary.alreadyExisting++;
        return false;
      }
      existingFingerprints.add(fp);
      return true;
    });

    if (toInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('cc_jobs')
        .upsert(toInsert, { onConflict: 'id' });

      if (insertError) {
        console.error('Failed to upsert jobs into cc_jobs:', insertError);
      } else {
        summary.newInserted = toInsert.length;
        summary.telegramNotified = await sendTelegramAlert(toInsert);
      }
    }
  } catch (err) {
    console.error('Auto job adder database sync error:', err);
  }

  summary.durationMs = Date.now() - startTime;
  return summary;
}

/**
 * HTTP Handler for /api/sync-jobs and /api/cron
 */
export async function handleSyncJobs(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const isDev = process.env.NODE_ENV !== 'production';

  // Validate secret if configured
  if (cronSecret && !isDev) {
    const expected = 'Bearer ' + cronSecret;
    if (authHeader !== expected) {
      return res.status(401).json({ error: 'Unauthorized. Valid Bearer token required.' });
    }
  }

  const dryRun = req.query?.dryRun === 'true' || req.body?.dryRun === true;

  try {
    const result = await runAutoJobAdder({ dryRun });
    return res.status(200).json({
      success: true,
      message: 'Successfully harvested ' + result.fresherEligible + ' fresher jobs. ' + result.newInserted + ' new jobs added to cc_jobs.',
      data: result,
    });
  } catch (err) {
    console.error('Sync jobs handler failed:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to execute auto job adder',
    });
  }
}
