import { StudentProfile } from '@/types'
import { ResumeExtractedProfile, ProfileMergeSummary } from '@/types/resume'
import { SKILL_SYNONYMS } from './matching'

/**
 * Skill Display Capitalization Map
 * Maps lowercase normalized canonical keys to polished display labels.
 */
export const CANONICAL_SKILL_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  cpp: 'C++',
  csharp: 'C#',
  ruby: 'Ruby',
  kotlin: 'Kotlin',
  rust: 'Rust',
  java: 'Java',
  react: 'React',
  vue: 'Vue.js',
  angular: 'Angular',
  'next.js': 'Next.js',
  'tailwind css': 'Tailwind CSS',
  html: 'HTML5',
  css: 'CSS3',
  redux: 'Redux',
  'node.js': 'Node.js',
  'express.js': 'Express.js',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  'spring boot': 'Spring Boot',
  '.net': '.NET',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  redis: 'Redis',
  cassandra: 'Cassandra',
  dynamodb: 'DynamoDB',
  sql: 'SQL',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  aws: 'AWS',
  gcp: 'GCP',
  azure: 'Azure',
  'ci/cd': 'CI/CD',
  git: 'Git',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'artificial intelligence': 'Artificial Intelligence',
  nlp: 'NLP',
  'computer vision': 'Computer Vision',
  llms: 'LLMs',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  pandas: 'Pandas',
  numpy: 'NumPy',
  tableau: 'Tableau',
  'power bi': 'Power BI',
  'data structures & algorithms': 'Data Structures & Algorithms',
  'system design': 'System Design',
  'object oriented programming': 'Object Oriented Programming',
  'rest apis': 'REST APIs',
  'unit testing': 'Unit Testing',
  'test automation': 'Test Automation',
}

/**
 * Normalize an individual skill name to its clean canonical display string.
 */
export function normalizeSkillName(rawSkill: string): string {
  if (!rawSkill || typeof rawSkill !== 'string') return ''
  const trimmed = rawSkill.trim()
  if (!trimmed) return ''

  const lookupKey = trimmed.toLowerCase()
  const canonicalKey = SKILL_SYNONYMS[lookupKey] || lookupKey
  return CANONICAL_SKILL_LABELS[canonicalKey] || trimmed
}

/**
 * Normalize and deduplicate a list of skills.
 */
export function normalizeAndDeduplicateSkills(skills: string[]): string[] {
  const seenCanonical = new Set<string>()
  const result: string[] = []

  for (const s of skills) {
    const normalized = normalizeSkillName(s)
    if (!normalized) continue
    const key = normalized.toLowerCase()
    if (!seenCanonical.has(key)) {
      seenCanonical.add(key)
      result.push(normalized)
    }
  }

  return result
}

/**
 * Non-destructively merges extracted resume data with the student's existing profile.
 * - Preserves existing manual entries if present
 * - Deduplicates skills and projects
 * - Computes a summary of newly added items
 */
export function mergeResumeWithProfile(
  existing: StudentProfile,
  extracted: ResumeExtractedProfile,
  rawFileName?: string
): { updatedProfile: StudentProfile; mergedProfile: StudentProfile; summary: ProfileMergeSummary } {
  // 1. Personal Credentials (preserve existing non-empty values)
  const name = (existing.name && existing.name !== 'Fresher Student')
    ? existing.name
    : (extracted.personal.full_name || existing.name || '')

  const email = existing.email || extracted.personal.email || ''
  const phone = existing.phone || extracted.personal.phone || ''

  // 2. Education
  const primaryEdu = extracted.education && extracted.education.length > 0 ? extracted.education[0] : null
  const college = existing.college?.trim() ? existing.college : (primaryEdu?.institution || '')
  let degree = existing.degree?.trim() ? existing.degree : ''
  if (!degree && primaryEdu) {
    const rawDeg = (primaryEdu.degree || '').trim()
    const field = (primaryEdu.field_of_study || '').trim()
    if (field && !rawDeg.toLowerCase().includes(field.toLowerCase())) {
      degree = `${rawDeg} in ${field}`.trim()
    } else {
      degree = rawDeg
    }
  }

  const gradYear = existing.graduation_year && existing.graduation_year !== 2026
    ? existing.graduation_year
    : (primaryEdu?.graduation_year || existing.graduation_year || 2026)

  // 3. Skills Merging & Deduplication
  const allResumeSkills: string[] = [
    ...(extracted.skills.normalized || []),
    ...(extracted.skills.programming_languages || []),
    ...(extracted.skills.frameworks || []),
    ...(extracted.skills.libraries || []),
    ...(extracted.skills.databases || []),
    ...(extracted.skills.tools || []),
    ...(extracted.skills.cloud || []),
    ...(extracted.skills.other || []),
  ]

  const existingNormalizedSet = new Set((existing.skills || []).map((s) => s.toLowerCase()))
  const addedSkills: string[] = []

  for (const s of allResumeSkills) {
    const norm = normalizeSkillName(s)
    if (norm && !existingNormalizedSet.has(norm.toLowerCase())) {
      existingNormalizedSet.add(norm.toLowerCase())
      addedSkills.push(norm)
    }
  }

  const mergedSkills = normalizeAndDeduplicateSkills([...(existing.skills || []), ...allResumeSkills])

  // 4. Projects Merging
  const existingProjectNames = new Set(
    (existing.projects || []).map((p) => (p.name || p.title || '').toLowerCase().trim()).filter(Boolean)
  )
  const newProjects = (extracted.projects || [])
    .map((p) => ({
      name: p.name || p.title || '',
      title: p.title || p.name || '',
      description: p.description || null,
      technologies: p.technologies || [],
      url: p.url || p.link || null,
      link: p.link || p.url || null,
    }))
    .filter((p) => p.name && !existingProjectNames.has(p.name.toLowerCase().trim()))
  const mergedProjects = [...(existing.projects || []), ...newProjects]

  // 5. Internships & Experience Merging
  const existingInternships = existing.internships || []
  const newInternships = (extracted.internships || [])
    .map((i) => ({
      company: i.company,
      role: i.role,
      duration: i.duration || null,
      technologies: i.technologies || i.skills_used || [],
      skills_used: i.skills_used || i.technologies || [],
      description: i.description || null,
    }))
    .filter(
      (i) => i.company && !existingInternships.some((ei) => ei.company.toLowerCase() === i.company.toLowerCase())
    )
  const mergedInternships = [...existingInternships, ...newInternships]

  const existingExperience = existing.experience || []
  const newExp = (extracted.experience || []).filter(
    (e) => e.company && !existingExperience.some((ee) => ee.company.toLowerCase() === e.company.toLowerCase())
  )
  const mergedExperience = [...existingExperience, ...newExp]

  // 6. Certifications
  const existingCerts = existing.certifications || []
  const newCerts = (extracted.certifications || []).filter(
    (c) => c.name && !existingCerts.some((ec) => ec.name.toLowerCase() === c.name.toLowerCase())
  )
  const mergedCertifications = [...existingCerts, ...newCerts]

  // 7. Categories & Career Alignment
  const likelyCategories = extracted.career?.job_categories || []
  const mergedCategories = Array.from(new Set([...(existing.preferred_categories || []), ...likelyCategories]))

  const updatedProfile: StudentProfile = {
    ...existing,
    name,
    email,
    phone,
    college,
    degree,
    graduation_year: gradYear,
    cgpa: existing.cgpa || primaryEdu?.gpa_or_percentage || null,
    skills: mergedSkills,
    preferred_categories: mergedCategories.length > 0 ? mergedCategories : existing.preferred_categories,
    experience_level: extracted.career?.experience_level || existing.experience_level || 'Fresher',
    linkedin_url: existing.linkedin_url || extracted.personal.linkedin_url || null,
    github_url: existing.github_url || extracted.personal.github_url || null,
    portfolio_url: existing.portfolio_url || extracted.personal.portfolio_url || null,
    projects: mergedProjects,
    internships: mergedInternships,
    experience: mergedExperience,
    certifications: mergedCertifications,
    achievements: extracted.achievements || existing.achievements || [],
    languages: extracted.languages ? extracted.languages.map((l) => l.language) : (existing.languages || []),
    resume_file_name: rawFileName || existing.resume_file_name || undefined,
    resume_parsed_at: new Date().toISOString(),
  }

  const summary: ProfileMergeSummary = {
    newSkillsCount: addedSkills.length,
    newProjectsCount: newProjects.length,
    newInternshipsCount: newInternships.length,
    newCertificationsCount: newCerts.length,
    addedSkills,
    skillsAdded: addedSkills.length,
    skillsRetained: existing.skills?.length || 0,
    projectsAdded: newProjects.length,
    internshipsAdded: newInternships.length,
    academicsUpdated: Boolean(
      (college && college !== existing.college) ||
      (degree && degree !== existing.degree)
    ),
  }

  return { updatedProfile, mergedProfile: updatedProfile, summary }
}
