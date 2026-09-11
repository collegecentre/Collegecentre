import { describe, it, expect } from 'vitest'
import {
  calculateJobMatch,
  doSkillsMatch,
  normalizeSkill,
} from '../src/services/matching'
import { Job, StudentProfile } from '../src/types'

const baseStudent: StudentProfile = {
  id: 'test_student',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  phone: '9876543210',
  education_level: 'Undergraduate (B.Tech / B.E.)',
  degree: 'Computer Science & Engineering',
  college: 'National Institute of Technology',
  graduation_year: 2026,
  skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
  experience_level: 'Fresher (0–1 years)',
  preferred_categories: ['Software Development', 'Frontend Development'],
  preferred_locations: ['Bengaluru', 'Remote'],
  preferred_work_mode: ['Remote', 'Hybrid'],
}

const baseJob: Job = {
  id: 'job_test_01',
  title: 'Junior Frontend Engineer',
  company: 'TechCorp India',
  location: 'Bengaluru',
  work_mode: 'Hybrid',
  salary: '₹12–16 LPA',
  experience: 'Fresher (0–1 years)',
  education: 'B.Tech in Computer Science / IT',
  skills: ['React', 'JavaScript', 'TypeScript', 'Git'],
  category: 'Frontend Development',
  job_type: 'Full-time',
  posted_at: new Date().toISOString(),
  deadline: '2026-12-31',
  description: 'Frontend role building next-gen web applications.',
  fresher_eligibility: true,
  application_url: 'https://careers.techcorp.com/apply/101',
  source: 'TechCorp Official Careers',
}

describe('Matching Engine & Skill Normalization Tests', () => {
  it('normalizes common tech synonyms correctly', () => {
    expect(normalizeSkill('js')).toBe('javascript')
    expect(normalizeSkill('py')).toBe('python')
    expect(normalizeSkill('reactjs')).toBe('react')
    expect(normalizeSkill('react.js')).toBe('react')
    expect(normalizeSkill('k8s')).toBe('kubernetes')
    expect(normalizeSkill('postgres')).toBe('postgresql')
    expect(normalizeSkill('dsa')).toBe('data structures & algorithms')
  })

  it('prevents false positive substring matches (Java vs JavaScript, C vs CSS)', () => {
    // Java should NOT match JavaScript
    expect(doSkillsMatch('java', 'javascript')).toBe(false)
    expect(doSkillsMatch('javascript', 'java')).toBe(false)

    // C should NOT match CSS
    expect(doSkillsMatch('c', 'css')).toBe(false)

    // Go should NOT match Django
    expect(doSkillsMatch('go', 'django')).toBe(false)
  })

  it('accurately matches equivalent skills regardless of abbreviation', () => {
    expect(doSkillsMatch('react', 'reactjs')).toBe(true)
    expect(doSkillsMatch('js', 'javascript')).toBe(true)
    expect(doSkillsMatch('k8s', 'kubernetes')).toBe(true)
  })

  it('calculates high match for well-aligned candidate profile', () => {
    const match = calculateJobMatch(baseStudent, baseJob)
    expect(match.score).toBeGreaterThanOrEqual(75)
    expect(match.breakdown.skillsMatch).toBeGreaterThanOrEqual(70)
    expect(match.breakdown.educationMatch).toBe(100)
    expect(match.reasons.length).toBeGreaterThanOrEqual(4)
  })

  it('severely penalizes candidate with 0 skills matching on skill-dependent job', () => {
    const nonTechStudent: StudentProfile = {
      ...baseStudent,
      skills: ['Sales', 'Public Speaking', 'Accounting'],
    }
    const match = calculateJobMatch(nonTechStudent, baseJob)
    // Score gate: 0 skills matched must drop score to 35% or below
    expect(match.score).toBeLessThanOrEqual(35)
    expect(match.breakdown.skillsMatch).toBe(0)
  })

  it('calibrates batch alignment against job specifications', () => {
    const job2024Only: Job = {
      ...baseJob,
      title: 'Graduate Engineer - 2024 Batch Immediate Joiner',
      description: 'Strictly hiring candidates graduated in 2024.',
    }

    const student2026 = { ...baseStudent, graduation_year: 2026 }
    const student2024 = { ...baseStudent, graduation_year: 2024 }

    const match2026 = calculateJobMatch(student2026, job2024Only)
    const match2024 = calculateJobMatch(student2024, job2024Only)

    expect(match2024.score).toBeGreaterThan(match2026.score)
  })

  it('never assigns artificial score floor of 50% when requirements are missing', () => {
    const completelyMismatchedStudent: StudentProfile = {
      ...baseStudent,
      skills: ['Painting', 'Carpentry'],
      education_level: 'High School',
      degree: 'Arts',
      graduation_year: 2029,
    }
    const match = calculateJobMatch(completelyMismatchedStudent, baseJob)
    expect(match.score).toBeLessThan(40)
  })
})
