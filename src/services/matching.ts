import { Job, MatchResult, StudentProfile } from "@/types"

export function calculateJobMatch(student: StudentProfile, job: Job): MatchResult {
  // 1. Skills Matching (Weight: 40%)
  const studentSkills = student.skills.map((s) => s.trim().toLowerCase())
  const jobSkills = job.skills.map((s) => s.trim().toLowerCase())

  let skillsMatchedCount = 0
  jobSkills.forEach((jobSkill) => {
    const matched = studentSkills.some(
      (sSkill) =>
        sSkill.includes(jobSkill) ||
        jobSkill.includes(sSkill) ||
        (sSkill === "js" && jobSkill.includes("javascript")) ||
        (sSkill === "javascript" && jobSkill.includes("js")) ||
        (sSkill === "react" && jobSkill.includes("reactjs"))
    )
    if (matched) skillsMatchedCount++
  })

  const skillsRatio = jobSkills.length > 0 ? skillsMatchedCount / jobSkills.length : 0.8
  const skillsMatch = Math.min(100, Math.round(skillsRatio * 100))

  // 2. Education Matching (Weight: 20%)
  let educationMatch = 85
  const studentEdu = `${student.education_level} ${student.degree}`.toLowerCase()
  const jobEdu = job.education.toLowerCase()

  if (
    jobEdu.includes("any") ||
    jobEdu.includes("graduate") ||
    (jobEdu.includes("b.tech") && studentEdu.includes("b.tech")) ||
    (jobEdu.includes("bca") && studentEdu.includes("bca")) ||
    (jobEdu.includes("computer") && studentEdu.includes("computer"))
  ) {
    educationMatch = 100
  } else if (jobEdu.includes("b.tech") && !studentEdu.includes("b.tech")) {
    educationMatch = 75
  }

  // 3. Experience Match (Weight: 15%)
  let experienceMatch = 90
  const jobExp = job.experience.toLowerCase()
  const studentExp = student.experience_level.toLowerCase()

  if (jobExp.includes("fresher") || jobExp.includes("0") || jobExp.includes("0-1")) {
    if (studentExp.includes("fresher") || studentExp.includes("0-1")) {
      experienceMatch = 100
    }
  } else {
    experienceMatch = 80
  }

  // 4. Location & Work Mode Match (Weight: 15%)
  let locationMatch = 70
  const isJobRemote = job.work_mode === "Remote"
  const studentPrefersRemote = student.preferred_work_mode.includes("Remote")
  const studentPrefersJobMode = student.preferred_work_mode.includes(job.work_mode)
  const jobCityMatches = student.preferred_locations.some((loc) =>
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
  }

  // 5. Fresher Eligibility (Weight: 10%)
  const fresherMatch = job.fresher_eligibility ? 100 : 60

  // Calculate Weighted Overall Score
  const rawScore =
    skillsMatch * 0.4 +
    educationMatch * 0.2 +
    experienceMatch * 0.15 +
    locationMatch * 0.15 +
    fresherMatch * 0.1

  const finalScore = Math.min(99, Math.max(50, Math.round(rawScore)))

  // Human-readable breakdown reasons
  const reasons: string[] = [
    `Skills match: ${skillsMatch}% (${skillsMatchedCount}/${jobSkills.length} key skills)`,
    `Education match: ${educationMatch}% (${student.degree})`,
    `Experience match: ${experienceMatch}% (${student.experience_level})`,
    `Location & mode: ${locationMatch}% (${job.work_mode} · ${job.location})`,
    `Fresher eligibility: ${fresherMatch}% (${job.fresher_eligibility ? "Immediate Graduate Eligible" : "Prior Internship Preferred"})`,
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
  }
}
