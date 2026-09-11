import {
  authenticateRequestUser,
  checkServerUserPassStatus,
  supabaseAdmin,
} from './supabaseAdmin.js';

// Fallback seed jobs for offline development or when DB is empty
const FALLBACK_SEED_JOBS = [
  {
    id: 'job_01',
    title: 'Software Development Engineer - Campus Graduate',
    company: 'Google',
    company_logo: 'G',
    location: 'Bengaluru / Hyderabad',
    work_mode: 'Hybrid',
    salary: '₹18–24 LPA',
    experience: 'Fresher (0–1 years)',
    education: 'B.Tech / B.E. / M.Tech in CS / IT / allied branches',
    skills: ['Data Structures', 'Algorithms', 'Java', 'Python', 'System Design'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    deadline: '2026-09-30',
    description: 'Design scalable distributed software systems and modern microservices.',
    fresher_eligibility: true,
    application_url: 'https://careers.google.com/jobs/results/',
    source: 'Google Careers',
  },
  {
    id: 'job_02',
    title: 'Associate Software Engineer - 2026 Batch',
    company: 'Microsoft',
    company_logo: 'M',
    location: 'Hyderabad / Noida',
    work_mode: 'Hybrid',
    salary: '₹16–22 LPA',
    experience: 'Fresher (0 years)',
    education: 'B.Tech / B.E. / Dual Degree in Computer Science, Electrical',
    skills: ['C++', 'C#', 'Data Structures', 'Algorithms', 'Azure'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    deadline: '2026-10-15',
    description: 'Work on Azure cloud services, Office 365, and intelligent cloud systems.',
    fresher_eligibility: true,
    application_url: 'https://careers.microsoft.com/',
    source: 'Microsoft University Recruiting',
  },
  {
    id: 'job_03',
    title: 'Software Development Engineer I',
    company: 'Amazon',
    company_logo: 'A',
    location: 'Bengaluru / Chennai',
    work_mode: 'Onsite',
    salary: '₹17–23 LPA',
    experience: 'Fresher (0–1 years)',
    education: 'B.Tech / B.E. / MCA in Computer Science or related fields',
    skills: ['Java', 'C++', 'Object Oriented Design', 'Distributed Systems', 'AWS'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    deadline: '2026-09-28',
    description: 'Solve real-world scale problems across Amazon Retail and AWS.',
    fresher_eligibility: true,
    application_url: 'https://www.amazon.jobs/en/jobs/',
    source: 'Amazon Student Programs',
  },
  {
    id: 'job_04',
    title: 'Frontend Engineer (Fresher / Early Career)',
    company: 'Swiggy',
    company_logo: 'S',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹10–14 LPA',
    experience: 'Fresher (0–1 years)',
    education: 'B.Tech / BCA / MCA / Any STEM Graduate',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Redux', 'Performance'],
    category: 'Frontend Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    deadline: '2026-10-05',
    description: 'Deliver consumer-facing web and mobile web experiences handling millions of daily orders.',
    fresher_eligibility: true,
    application_url: 'https://careers.swiggy.com/#/jobs',
    source: 'Swiggy Early Talent',
  },
  {
    id: 'job_05',
    title: 'Graduate Engineer Trainee - Backend Platforms',
    company: 'PhonePe',
    company_logo: 'P',
    location: 'Bengaluru / Pune',
    work_mode: 'Hybrid',
    salary: '₹14–18 LPA',
    experience: 'Fresher (0 years)',
    education: 'B.Tech / B.E. in CS / IT / ECE',
    skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis', 'Microservices'],
    category: 'Backend Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    deadline: '2026-10-10',
    description: 'Scale payment infrastructure processing billions of transactions per month.',
    fresher_eligibility: true,
    application_url: 'https://www.phonepe.com/careers/job-openings/',
    source: 'PhonePe University Careers',
  },
  {
    id: 'job_06',
    title: 'Data Analyst - Growth & Intelligence',
    company: 'CRED',
    company_logo: 'C',
    location: 'Bengaluru',
    work_mode: 'Onsite',
    salary: '₹12–16 LPA',
    experience: 'Fresher (0–1 years)',
    education: 'B.Tech / B.Sc / B.Com / Statistics / Economics',
    skills: ['SQL', 'Python', 'Data Analytics', 'Tableau', 'Excel', 'Problem Solving'],
    category: 'Data & AI',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    deadline: '2026-10-01',
    description: 'Analyze financial datasets to optimize member experience and credit underwriting.',
    fresher_eligibility: true,
    application_url: 'https://cred.club/careers',
    source: 'CRED Campus Hiring',
  },
  {
    id: 'job_07',
    title: 'QA Automation Engineer - Fresher',
    company: 'Razorpay',
    company_logo: 'R',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹9–13 LPA',
    experience: 'Fresher (0–1 years)',
    education: 'B.Tech / B.E. / BCA / MCA',
    skills: ['Selenium', 'Java', 'Python', 'API Testing', 'Postman', 'Test Automation'],
    category: 'QA / Testing',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    deadline: '2026-10-12',
    description: 'Build automated test suites ensuring 99.99% availability across checkout rails.',
    fresher_eligibility: true,
    application_url: 'https://razorpay.com/jobs/',
    source: 'Razorpay University Hiring',
  },
  {
    id: 'job_08',
    title: 'AI/ML Engineering Intern (PPO Track)',
    company: 'Zomato',
    company_logo: 'Z',
    location: 'Gurugram / Remote',
    work_mode: 'Hybrid',
    salary: '₹40,000/month stipend',
    experience: 'Fresher (2025 / 2026 Batch)',
    education: 'B.Tech / M.Tech in CS, AI, Data Science or Mathematics',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'LLMs'],
    category: 'Data & AI',
    job_type: 'Internship',
    posted_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    deadline: '2026-09-29',
    description: 'Deploy machine learning models for real-time dispatch routing and menu recommendations.',
    fresher_eligibility: true,
    application_url: 'https://www.zomato.com/careers',
    source: 'Zomato AI Labs',
  },
];

/**
 * Server-Side Redaction:
 * Redacts direct application URLs, real company names, and salary numbers
 * for protected jobs so unpaying clients cannot scrape or inspect them.
 */
function redactJobForFreeUser(job, index) {
  // Top 3 jobs remain unmasked as the official preview teaser
  if (index < 3) {
    return {
      ...job,
      is_locked: false,
    };
  }

  // Jobs 4+ are redacted on the server
  return {
    ...job,
    company: '[Verified Top Employer]',
    salary: '₹••–•• LPA (Locked)',
    application_url: '', // Redacted on server! Never sent over the wire
    description: job.description ? `${job.description.slice(0, 110)}... [Unlock 24h Pass to read full job description]` : '',
    is_locked: true,
  };
}

/**
 * Endpoint: GET /api/jobs
 * Protected Job Discovery: Returns full unmasked data only if user has active pass.
 */
export async function getProtectedJobs(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate user if token is provided
  const authUser = await authenticateRequestUser(req);

  // 2. Check if user has an active pass server-side
  let userHasPass = false;
  if (authUser) {
    const passStatus = await checkServerUserPassStatus(authUser.id);
    userHasPass = Boolean(passStatus.isActive);
  }

  // 3. Fetch jobs from Supabase or fallback
  let allJobs = [];
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('cc_jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        allJobs = data;
      }
    } catch (dbErr) {
      console.warn('Supabase fetch error, using fallback seed jobs:', dbErr);
    }
  }

  if (allJobs.length === 0) {
    allJobs = FALLBACK_SEED_JOBS;
  }

  // 4. Return full data if user has active pass; otherwise return server-redacted dataset
  const responseJobs = userHasPass
    ? allJobs.map((job) => ({ ...job, is_locked: false }))
    : allJobs.map((job, idx) => redactJobForFreeUser(job, idx));

  return res.status(200).json({
    success: true,
    userHasPass,
    count: responseJobs.length,
    previewCount: 3,
    jobs: responseJobs,
  });
}

/**
 * Endpoint: GET /api/user-jobs
 * Returns full, unmasked details for jobs saved or applied by the authenticated user,
 * EVEN IF their 24h pass has expired (Permanent Rule 11 Guarantee).
 */
export async function getUserSavedAndAppliedJobs(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authUser = await authenticateRequestUser(req);
  if (!authUser) {
    return res.status(401).json({
      error: 'Unauthorized. You must be signed in to view your permanent desk.',
    });
  }

  if (!supabaseAdmin) {
    return res.status(200).json({ savedJobs: [], appliedJobs: [] });
  }

  try {
    // 1. Get user's saved job IDs
    const { data: savedRows } = await supabaseAdmin
      .from('cc_saved_jobs')
      .select('job_id, saved_at')
      .eq('user_id', authUser.id);

    // 2. Get user's applied job IDs
    const { data: appRows } = await supabaseAdmin
      .from('cc_applications')
      .select('id, job_id, status, notes, applied_at, updated_at')
      .eq('user_id', authUser.id);

    const savedJobIds = (savedRows || []).map((r) => r.job_id);
    const appliedJobIds = (appRows || []).map((r) => r.job_id);
    const allUserJobIds = Array.from(new Set([...savedJobIds, ...appliedJobIds]));

    if (allUserJobIds.length === 0) {
      return res.status(200).json({
        savedJobs: [],
        applications: [],
        jobs: [],
      });
    }

    // 3. Fetch full unmasked job details for these specific user jobs
    const { data: fullJobs } = await supabaseAdmin
      .from('cc_jobs')
      .select('*')
      .in('id', allUserJobIds);

    return res.status(200).json({
      success: true,
      savedRecords: savedRows || [],
      applicationRecords: appRows || [],
      // Full unmasked job details for the user's permanent pipeline
      jobs: (fullJobs || []).map((j) => ({ ...j, is_locked: false })),
    });
  } catch (err) {
    console.error('Failed to load user permanent pipeline jobs:', err);
    return res.status(500).json({ error: 'Failed to retrieve permanent job pipeline' });
  }
}
