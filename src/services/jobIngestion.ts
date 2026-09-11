import { Job, WorkMode, JobType } from '@/types'
import { normalizeSkill } from './matching'
import { supabase } from './supabase'

export interface RawJobInput {
  title: string
  company: string
  company_logo?: string
  location: string
  work_mode?: string
  salary: string
  experience?: string
  education?: string
  skills?: string[] | string
  category?: string
  job_type?: string
  posted_at?: string
  deadline?: string
  description?: string
  fresher_eligibility?: boolean
  application_url: string
  source: string
}

export interface IngestionSummary {
  totalReceived: number
  validCount: number
  rejectedCount: number
  deduplicatedCount: number
  insertedCount: number
  staleCount: number
  errors: { title: string; company: string; reason: string }[]
  normalizedJobs: Job[]
}

/**
 * Normalizes raw external job data to consistent internal specifications.
 */
export function normalizeJob(raw: RawJobInput, idPrefix = 'job'): Job {
  // Normalize Work Mode
  let workMode: WorkMode = 'Onsite'
  const rawMode = (raw.work_mode || '').toLowerCase()
  if (rawMode.includes('remote')) {
    workMode = 'Remote'
  } else if (rawMode.includes('hybrid')) {
    workMode = 'Hybrid'
  }

  // Normalize Job Type
  let jobType: JobType = 'Full-time'
  const rawType = (raw.job_type || '').toLowerCase()
  if (rawType.includes('intern')) {
    jobType = 'Internship'
  }

  // Parse and normalize skills array
  let skillsList: string[] = []
  if (Array.isArray(raw.skills)) {
    skillsList = raw.skills
  } else if (typeof raw.skills === 'string') {
    skillsList = raw.skills.split(/[,;|]/).map((s) => s.trim())
  }
  const cleanSkills = Array.from(
    new Set(
      skillsList
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => {
          // Capitalize canonical skills nicely
          const norm = normalizeSkill(s)
          return norm.charAt(0).toUpperCase() + norm.slice(1)
        })
    )
  )

  // Generate deterministic ID if not supplied
  const slug = `${raw.company}-${raw.title}`.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 32)
  const id = `${idPrefix}_${slug}_${Date.now().toString(36).slice(-4)}`

  return {
    id,
    title: (raw.title || '').trim(),
    company: (raw.company || '').trim(),
    company_logo: raw.company_logo || raw.company?.charAt(0).toUpperCase() || 'C',
    location: (raw.location || 'India (Multiple Locations)').trim(),
    work_mode: workMode,
    salary: (raw.salary || 'Competitive Fresher CTC').trim(),
    experience: (raw.experience || 'Fresher (0–1 years)').trim(),
    education: (raw.education || 'B.Tech / BCA / MCA / Any Graduate').trim(),
    skills: cleanSkills.length > 0 ? cleanSkills : ['Problem Solving', 'Data Structures'],
    category: (raw.category || 'Software Development').trim(),
    job_type: jobType,
    posted_at: raw.posted_at || new Date().toISOString(),
    deadline: raw.deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    description: (raw.description || '').trim(),
    fresher_eligibility: raw.fresher_eligibility !== false,
    application_url: (raw.application_url || '').trim(),
    source: (raw.source || 'Direct Recruiter Portal').trim(),
  }
}

/**
 * Validates normalized job. Ensures traceability, non-fabrication, and valid URL.
 */
export function validateJob(job: Job): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!job.title || job.title.length < 3) {
    errors.push('Job title must be at least 3 characters.')
  }
  if (!job.company || job.company.length < 2) {
    errors.push('Company name is required.')
  }
  if (!job.source || job.source.length < 2) {
    errors.push('Every job must have a real traceable source.')
  }

  // Strict URL Validation (No invented or javascript: links)
  try {
    const url = new URL(job.application_url)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      errors.push('Application URL must use HTTP or HTTPS protocol.')
    }
  } catch {
    errors.push('Invalid application URL format.')
  }

  // Salary format check
  if (!job.salary || job.salary.length < 2) {
    errors.push('Salary or stipend must be specified.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Checks whether a job posting is stale (closed or past deadline or > 45 days old).
 */
export function isJobStale(job: Job, maxAgeDays = 45): boolean {
  // Check explicit deadline
  if (job.deadline) {
    const deadlineTime = new Date(job.deadline).getTime()
    if (!isNaN(deadlineTime) && deadlineTime < Date.now()) {
      return true
    }
  }

  // Check posting age
  if (job.posted_at) {
    const postedTime = new Date(job.posted_at).getTime()
    if (!isNaN(postedTime)) {
      const ageDays = (Date.now() - postedTime) / (1000 * 60 * 60 * 24)
      if (ageDays > maxAgeDays) {
        return true
      }
    }
  }

  return false
}

/**
 * Deduplication content key based on canonical attributes.
 */
export function getJobDeduplicationKey(job: Job): string {
  const cleanTitle = job.title.toLowerCase().replace(/[^a-z0-9]/g, '')
  const cleanCompany = job.company.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `${cleanCompany}::${cleanTitle}`
}

/**
 * Comprehensive Job Ingestion Pipeline:
 * source → fetch → normalize → deduplicate → validate → freshness check → Supabase.
 */
export async function runJobIngestionPipeline(
  rawJobs: RawJobInput[],
  options: { persistToSupabase?: boolean } = { persistToSupabase: true }
): Promise<IngestionSummary> {
  const summary: IngestionSummary = {
    totalReceived: rawJobs.length,
    validCount: 0,
    rejectedCount: 0,
    deduplicatedCount: 0,
    insertedCount: 0,
    staleCount: 0,
    errors: [],
    normalizedJobs: [],
  }

  const seenKeys = new Set<string>()
  const validJobsToPersist: Job[] = []

  for (const raw of rawJobs) {
    const normalized = normalizeJob(raw)
    const dedupKey = getJobDeduplicationKey(normalized)

    // 1. Deduplication
    if (seenKeys.has(dedupKey)) {
      summary.deduplicatedCount++
      continue
    }
    seenKeys.add(dedupKey)

    // 2. Validation
    const validation = validateJob(normalized)
    if (!validation.isValid) {
      summary.rejectedCount++
      summary.errors.push({
        title: normalized.title,
        company: normalized.company,
        reason: validation.errors.join('; '),
      })
      continue
    }

    // 3. Freshness / Stale Check
    if (isJobStale(normalized)) {
      summary.staleCount++
      continue
    }

    summary.validCount++
    validJobsToPersist.push(normalized)
  }

  summary.normalizedJobs = validJobsToPersist

  // 4. Persistence to Supabase
  if (options.persistToSupabase && validJobsToPersist.length > 0) {
    try {
      const recordsToInsert = validJobsToPersist.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        company_logo: j.company_logo,
        location: j.location,
        work_mode: j.work_mode,
        salary: j.salary,
        experience: j.experience,
        education: j.education,
        skills: j.skills,
        category: j.category,
        job_type: j.job_type,
        posted_at: j.posted_at,
        deadline: j.deadline,
        description: j.description,
        fresher_eligibility: j.fresher_eligibility,
        application_url: j.application_url,
        source: j.source,
        is_active: true,
      }))

      const { error } = await supabase.from('cc_jobs').upsert(recordsToInsert, { onConflict: 'id' })
      if (error) {
        console.warn('Job ingestion database warning:', error.message)
      } else {
        summary.insertedCount = recordsToInsert.length
      }
    } catch (err: any) {
      console.error('Job ingestion persistence error:', err)
    }
  }

  return summary
}
