import { describe, it, expect } from 'vitest'
import {
  normalizeJob,
  validateJob,
  isJobStale,
  runJobIngestionPipeline,
  RawJobInput,
} from '../src/services/jobIngestion'

describe('Job Ingestion Pipeline & Freshness Checks', () => {
  const validRawJob: RawJobInput = {
    title: 'Software Engineer - Campus 2026',
    company: 'Razorpay',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹14–18 LPA',
    experience: 'Fresher (0 years)',
    education: 'B.Tech / B.E.',
    skills: ['Java', 'Spring Boot', 'SQL', 'Docker'],
    category: 'Backend Development',
    job_type: 'Full-time',
    deadline: '2026-12-31',
    application_url: 'https://razorpay.com/jobs/se-fresher',
    source: 'Razorpay Official Careers Portal',
  }

  it('normalizes raw job fields into consistent types', () => {
    const normalized = normalizeJob(validRawJob)
    expect(normalized.work_mode).toBe('Hybrid')
    expect(normalized.job_type).toBe('Full-time')
    expect(normalized.skills).toContain('Java')
    expect(normalized.skills).toContain('Docker')
    expect(normalized.fresher_eligibility).toBe(true)
  })

  it('validates legitimate jobs with authentic sources and HTTPS URLs', () => {
    const normalized = normalizeJob(validRawJob)
    const validation = validateJob(normalized)
    expect(validation.isValid).toBe(true)
    expect(validation.errors.length).toBe(0)
  })

  it('rejects fabricated or invalid job listings', () => {
    const invalidJob = normalizeJob({
      ...validRawJob,
      title: 'Hi', // Too short
      company: '',
      application_url: 'not-a-valid-url',
      source: '', // Missing source
    })

    const validation = validateJob(invalidJob)
    expect(validation.isValid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })

  it('correctly detects stale or closed jobs past deadline', () => {
    const activeJob = normalizeJob({
      ...validRawJob,
      deadline: '2026-12-31',
    })
    expect(isJobStale(activeJob)).toBe(false)

    const staleJob = normalizeJob({
      ...validRawJob,
      deadline: '2020-01-01', // Expired
    })
    expect(isJobStale(staleJob)).toBe(true)
  })

  it('deduplicates identical jobs submitted from multiple channels', async () => {
    const duplicateRawJobs: RawJobInput[] = [
      validRawJob,
      { ...validRawJob, title: 'Software Engineer - Campus 2026 ' }, // Same company & title
    ]

    const result = await runJobIngestionPipeline(duplicateRawJobs, { persistToSupabase: false })
    expect(result.totalReceived).toBe(2)
    expect(result.deduplicatedCount).toBe(1)
    expect(result.validCount).toBe(1)
  })
})
