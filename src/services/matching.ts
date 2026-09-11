import { Job, MatchResult, StudentProfile } from "@/types"

/**
 * Skill Normalization Dictionary & Synonyms
 * Maps tech aliases, abbreviations, and informal spellings to canonical forms.
 */
export const SKILL_SYNONYMS: Record<string, string> = {
  // Programming Languages
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "python3": "python",
  "golang": "go",
  "c++": "cpp",
  "c#": "csharp",
  "rb": "ruby",
  "kt": "kotlin",
  "rustlang": "rust",

  // Frontend
  "react": "react",
  "reactjs": "react",
  "react.js": "react",
  "vue": "vue",
  "vuejs": "vue",
  "vue.js": "vue",
  "angular": "angular",
  "angularjs": "angular",
  "next": "next.js",
  "nextjs": "next.js",
  "next.js": "next.js",
  "tailwind": "tailwind css",
  "tailwindcss": "tailwind css",
  "html": "html",
  "html5": "html",
  "css": "css",
  "css3": "css",
  "redux": "redux",

  // Backend & Runtime
  "node": "node.js",
  "nodejs": "node.js",
  "node.js": "node.js",
  "express": "express.js",
  "expressjs": "express.js",
  "express.js": "express.js",
  "django": "django",
  "flask": "flask",
  "fastapi": "fastapi",
  "spring": "spring boot",
  "springboot": "spring boot",
  "spring boot": "spring boot",
  "dotnet": ".net",
  ".net": ".net",

  // Databases
  "postgres": "postgresql",
  "postgresql": "postgresql",
  "pg": "postgresql",
  "mysql": "mysql",
  "mongo": "mongodb",
  "mongodb": "mongodb",
  "redis": "redis",
  "cassandra": "cassandra",
  "dynamodb": "dynamodb",
  "sql": "sql",

  // DevOps & Cloud
  "docker": "docker",
  "k8s": "kubernetes",
  "kubernetes": "kubernetes",
  "aws": "aws",
  "amazon web services": "aws",
  "gcp": "gcp",
  "google cloud": "gcp",
  "azure": "azure",
  "ci/cd": "ci/cd",
  "cicd": "ci/cd",
  "git": "git",
  "github": "git",

  // Data & AI
  "ml": "machine learning",
  "machine learning": "machine learning",
  "dl": "deep learning",
  "deep learning": "deep learning",
  "ai": "artificial intelligence",
  "nlp": "nlp",
  "cv": "computer vision",
  "computer vision": "computer vision",
  "llm": "llms",
  "llms": "llms",
  "pytorch": "pytorch",
  "tensorflow": "tensorflow",
  "tf": "tensorflow",
  "pandas": "pandas",
  "numpy": "numpy",
  "tableau": "tableau",
  "powerbi": "power bi",
  "power bi": "power bi",

  // Core CS Concepts
  "dsa": "data structures & algorithms",
  "data structures": "data structures & algorithms",
  "algorithms": "data structures & algorithms",
  "system design": "system design",
  "oop": "object oriented programming",
  "oops": "object oriented programming",
  "rest": "rest apis",
  "rest api": "rest apis",
  "rest apis": "rest apis",
  "graphql": "graphql",
  "testing": "unit testing",
  "automation": "test automation",
}

/**
 * Normalizes a skill string to its canonical identity.
 */
export function normalizeSkill(raw: string): string {
  if (!raw) return ""
  const cleaned = raw.trim().toLowerCase().replace(/['"]/g, "")
  return SKILL_SYNONYMS[cleaned] || cleaned
}

/**
 * Checks whether two skills match after normalization,
 * using exact token boundaries to prevent "java" from false-matching "javascript",
 * or "c" from matching "css".
 */
export function doSkillsMatch(skillA: string, skillB: string): boolean {
  const normA = normalizeSkill(skillA)
  const normB = normalizeSkill(skillB)

  if (!normA || !normB) return false
  if (normA === normB) return true

  // Word boundary regex check for multi-word skills
  const regexA = new RegExp(`\\b${normA.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
  const regexB = new RegExp(`\\b${normB.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")

  return regexA.test(normB) || regexB.test(normA)
}

/**
 * Evaluates candidate fit against job requirements using explainable
 * weighted scoring without artificial score floors.
 */
export function calculateJobMatch(student: StudentProfile, job: Job): MatchResult {
  const studentSkills = (student.skills || []).map((s) => s.trim())
  const projectTechs = (student.projects || []).flatMap((p) => p.technologies || []).map((s) => s.trim())
  const internshipTechs = (student.internships || []).flatMap((i) => i.skills_used || []).map((s) => s.trim())
  const allStudentSkills = Array.from(new Set([...studentSkills, ...projectTechs, ...internshipTechs]))
  const jobSkills = (job.skills || []).map((s) => s.trim())

  // 1. SKILLS MATCHING (Weight: 35%)
  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  jobSkills.forEach((jobSkill) => {
    const isMatched = allStudentSkills.some((sSkill) => doSkillsMatch(sSkill, jobSkill))
    if (isMatched) {
      matchedSkills.push(jobSkill)
    } else {
      missingSkills.push(jobSkill)
    }
  })

  let skillsMatch = 0
  if (jobSkills.length === 0) {
    skillsMatch = 75 // Neutral when job specifies no technical prerequisites
  } else {
    const ratio = matchedSkills.length / jobSkills.length
    skillsMatch = Math.min(100, Math.round(ratio * 100))
  }

  // 2. EDUCATION & DEGREE DISCIPLINE MATCH (Weight: 20%)
  let educationMatch = 60
  const studentDegree = `${student.education_level || ""} ${student.degree || ""}`.toLowerCase()
  const jobEdu = (job.education || "").toLowerCase()

  const isCsOrIt =
    studentDegree.includes("computer") ||
    studentDegree.includes("cse") ||
    studentDegree.includes("information technology") ||
    studentDegree.includes("bca") ||
    studentDegree.includes("mca")

  if (jobEdu.includes("any") || jobEdu.includes("any graduate") || jobEdu.includes("all branches")) {
    educationMatch = 100
  } else if (isCsOrIt && (jobEdu.includes("cs") || jobEdu.includes("computer") || jobEdu.includes("b.tech") || jobEdu.includes("bca"))) {
    educationMatch = 100
  } else if (studentDegree.includes("b.tech") && jobEdu.includes("b.tech")) {
    educationMatch = 90
  } else if (studentDegree.includes("bca") || studentDegree.includes("mca")) {
    educationMatch = 80
  } else {
    educationMatch = 50
  }

  // 3. GRADUATION BATCH CALIBRATION (Weight: 15%)
  let batchMatch = 85
  const studentBatch = student.graduation_year || 2026
  const jobText = `${job.title} ${job.description || ""} ${job.experience || ""}`.toLowerCase()

  if (jobText.includes(String(studentBatch))) {
    batchMatch = 100 // Exact target batch match
  } else if (jobText.includes("2026") && studentBatch !== 2026) {
    batchMatch = 60 // Specific batch requested and candidate differs
  } else if (jobText.includes("2025") && studentBatch === 2026) {
    batchMatch = 75 // Adjacent batch
  } else if (jobText.includes("2024") && studentBatch >= 2026) {
    batchMatch = 55 // Earlier batch required
  } else {
    batchMatch = 90 // General campus hiring
  }

  // 4. EXPERIENCE LEVEL MATCH (Weight: 10%)
  let experienceMatch = 80
  const jobExp = (job.experience || "").toLowerCase().replace(/[\u2010-\u2015]/g, "-")
  const studentExp = (student.experience_level || "").toLowerCase().replace(/[\u2010-\u2015]/g, "-")
  const hasInternships = (student.internships || []).length > 0

  if (jobExp.includes("fresher") || jobExp.includes("0-1") || jobExp.includes("0 years")) {
    if (studentExp.includes("fresher") || studentExp.includes("0-1") || studentExp.includes("0 years") || hasInternships) {
      experienceMatch = 100
    }
  } else if (hasInternships) {
    experienceMatch = 85
  } else {
    experienceMatch = 70
  }

  // 5. LOCATION & WORK MODE MATCH (Weight: 10%)
  let locationMatch = 60
  const isJobRemote = job.work_mode === "Remote"
  const studentPrefersRemote = (student.preferred_work_mode || []).includes("Remote")
  const studentPrefersJobMode = (student.preferred_work_mode || []).includes(job.work_mode)
  const jobCityMatches = (student.preferred_locations || []).some((loc) =>
    job.location.toLowerCase().includes(loc.toLowerCase())
  )

  if (isJobRemote && studentPrefersRemote) {
    locationMatch = 100
  } else if (jobCityMatches && studentPrefersJobMode) {
    locationMatch = 95
  } else if (jobCityMatches || isJobRemote) {
    locationMatch = 85
  } else if (studentPrefersJobMode) {
    locationMatch = 75
  } else {
    locationMatch = 50
  }

  // 6. FRESHER ELIGIBILITY (Weight: 10%)
  const fresherMatch = job.fresher_eligibility ? 100 : 50

  // WEIGHTED SCORING AGGREGATION
  let weightedScore =
    skillsMatch * 0.35 +
    educationMatch * 0.20 +
    batchMatch * 0.15 +
    experienceMatch * 0.10 +
    locationMatch * 0.10 +
    fresherMatch * 0.10

  // MANDATORY PREREQUISITE PENALTY GATES:
  // If candidate matches 0 required skills on a skill-dependent job, score CANNOT exceed 35%.
  if (jobSkills.length >= 2 && matchedSkills.length === 0) {
    weightedScore = Math.min(35, weightedScore * 0.5)
  }

  // If education is mismatched (below 60%), cap score at 55%.
  if (educationMatch < 60) {
    weightedScore = Math.min(55, weightedScore)
  }

  const finalScore = Math.min(99, Math.max(15, Math.round(weightedScore)))

  const reasons: string[] = [
    `Skill alignment: ${skillsMatch}% (${matchedSkills.length}/${jobSkills.length} verified tags matched)`,
    `Degree match: ${educationMatch}% (${student.degree || student.education_level})`,
    `Graduation batch fit: ${batchMatch}% (${studentBatch} Batch)`,
    `Location & work mode: ${locationMatch}% (${job.work_mode} · ${job.location})`,
    `Fresher status: ${fresherMatch}% (${job.fresher_eligibility ? "Immediate Campus Graduate Eligible" : "Prior Internship Preferred"})`,
  ]

  return {
    score: finalScore,
    breakdown: {
      skillsMatch,
      educationMatch,
      experienceMatch,
      locationMatch,
      fresherMatch,
    },
    reasons,
    matchedSkills,
    missingSkills,
  }
}
