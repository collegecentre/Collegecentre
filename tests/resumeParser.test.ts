import { describe, it, expect } from "vitest"
import {
  parseResumeRules,
  detectSections,
  extractContactInfo,
  extractEducation,
  extractSkills,
  calculateConfidence,
  normalizeText,
} from "../server/ruleResumeParser.js"
import {
  sanitizeExtractedProfile,
  sanitizeFileName,
} from "../server/resumeParserHandler.js"
import {
  normalizeSkillName,
  normalizeAndDeduplicateSkills,
  mergeResumeWithProfile,
} from "../src/services/skillNormalizer"
import { calculateJobMatch } from "../src/services/matching"
import { StudentProfile, Job } from "../src/types"
import { ResumeExtractedProfile } from "../src/types/resume"

describe("Deterministic Rule-Based Resume Parser Tests", () => {
  describe("1. Contact Information Extraction", () => {
    it("extracts candidate name, email, phone (+91 and international), and social links", () => {
      const sampleResume = `
Rahul Sharma
Software Engineer
Email: rahul.sharma@gmail.com | Phone: +91 98765 43210
Location: Bengaluru, Karnataka
LinkedIn: https://linkedin.com/in/rahul-sharma
GitHub: https://github.com/rahul-sharma
Portfolio: https://rahulsharma.dev
      `.trim()

      const parsed = parseResumeRules(sampleResume, "Rahul_Sharma_Resume.pdf")

      expect(parsed.personal.full_name).toBe("Rahul Sharma")
      expect(parsed.personal.email).toBe("rahul.sharma@gmail.com")
      expect(parsed.personal.phone).toBe("+91 98765 43210")
      expect(parsed.personal.location).toBe("Bengaluru")
      expect(parsed.personal.linkedin_url).toBe("https://linkedin.com/in/rahul-sharma")
      expect(parsed.personal.github_url).toBe("https://github.com/rahul-sharma")
      expect(parsed.personal.portfolio_url).toBe("https://rahulsharma.dev")
    })

    it("extracts phone numbers in diverse Indian formats", () => {
      const phone1 = "Contact: +91-9876543210 at office"
      const phone2 = "Tel: 9876543210"
      const phone3 = "Call +91 98765 43210"

      expect(extractContactInfo(phone1, { header: [] }).phone).toBe("+91-9876543210")
      expect(extractContactInfo(phone2, { header: [] }).phone).toBe("9876543210")
      expect(extractContactInfo(phone3, { header: [] }).phone).toBe("+91 98765 43210")
    })

    it("falls back cleanly to sanitized fileName when text does not contain a name", () => {
      const textWithoutName = `
contact@domain.com
+91 9876543210
SKILLS
React, Node.js
      `.trim()

      const parsed = parseResumeRules(textWithoutName, "sreehari_m_resume.pdf")
      expect(parsed.personal.full_name).toBe("Sreehari M")
    })
  })

  describe("2. Education Extraction", () => {
    it("extracts B.Tech, Computer Science, institution, and 2022-2026 year range", () => {
      const eduResume = `
Ananya Rao
ananya@nitk.edu.in | +91 9123456789

EDUCATION
National Institute of Technology Karnataka, Surathkal
Bachelor of Technology in Computer Science & Engineering
2022 - 2026
CGPA: 8.95 / 10
      `.trim()

      const parsed = parseResumeRules(eduResume)

      expect(parsed.education.length).toBe(1)
      const edu = parsed.education[0]
      expect(edu.degree).toBe("B.Tech")
      expect(edu.field_of_study).toBe("Computer Science")
      expect(edu.institution).toContain("National Institute of Technology")
      expect(edu.start_year).toBe(2022)
      expect(edu.graduation_year).toBe(2026)
      expect(edu.gpa_or_percentage).toContain("8.95")
    })

    it("extracts other degrees (MCA, B.E., BCA) without errors", () => {
      const textMCA = "EDUCATION\nMaster of Computer Applications\n2023 - 2025"
      const parsedMCA = parseResumeRules(textMCA)
      expect(parsedMCA.education[0]?.degree).toBe("MCA")

      const textBE = "EDUCATION\nBachelor of Engineering in Electronics & Communication\n2021 - 2025"
      const parsedBE = parseResumeRules(textBE)
      expect(parsedBE.education[0]?.degree).toBe("B.E.")
      expect(parsedBE.education[0]?.field_of_study).toBe("Electronics & Communication")
    })
  })

  describe("3. Skills Normalization & Deduplication", () => {
    it("normalizes skill synonyms to canonical representations", () => {
      expect(normalizeSkillName("react.js")).toBe("React")
      expect(normalizeSkillName("ReactJS")).toBe("React")
      expect(normalizeSkillName("js")).toBe("JavaScript")
      expect(normalizeSkillName("JS")).toBe("JavaScript")
      expect(normalizeSkillName("nodejs")).toBe("Node.js")
      expect(normalizeSkillName("NodeJS")).toBe("Node.js")
      expect(normalizeSkillName("postgres")).toBe("PostgreSQL")
      expect(normalizeSkillName("postgresql")).toBe("PostgreSQL")
      expect(normalizeSkillName("k8s")).toBe("Kubernetes")
      expect(normalizeSkillName("dsa")).toBe("Data Structures & Algorithms")
    })

    it("deduplicates redundant skills (React, React.js, ReactJS -> React)", () => {
      const rawList = ["React", "React.js", "ReactJS", "react", "Node", "Node.js", "nodejs", "NodeJS"]
      const deduplicated = normalizeAndDeduplicateSkills(rawList)

      expect(deduplicated).toEqual(["React", "Node.js"])
      expect(deduplicated.length).toBe(2)
    })

    it("categorizes extracted skills accurately", () => {
      const skillText = `
TECHNICAL SKILLS
Languages: Python, TypeScript, Go, C++
Frontend: React.js, Next.js, Tailwind CSS
Databases: PostgreSQL, Redis, MongoDB
DevOps: Docker, Kubernetes, AWS, Git
      `.trim()

      const parsed = parseResumeRules(skillText)

      expect(parsed.skills.programming_languages).toContain("Python")
      expect(parsed.skills.programming_languages).toContain("TypeScript")
      expect(parsed.skills.programming_languages).toContain("Go")
      expect(parsed.skills.frameworks).toContain("React")
      expect(parsed.skills.frameworks).toContain("Next.js")
      expect(parsed.skills.frameworks).toContain("Tailwind CSS")
      expect(parsed.skills.databases).toContain("PostgreSQL")
      expect(parsed.skills.databases).toContain("Redis")
      expect(parsed.skills.tools).toContain("Docker")
      expect(parsed.skills.tools).toContain("Git")
      expect(parsed.skills.cloud).toContain("AWS")
    })
  })

  describe("4. Section Detection Tolerances", () => {
    it("recognizes diverse section headings across case and punctuation variations", () => {
      const resume = `
John Doe
john@test.com | 9876543210

--- ACADEMIC BACKGROUND ---
B.Tech in Computer Science 2024

### CORE COMPETENCIES:
Python, Django, PostgreSQL

-- WORK HISTORY --
Software Engineer at Acme Corp (Jan 2024 - Present)

### PERSONAL PROJECTS:
Task Flow - Task management web application in React

CERTIFICATES & LICENSES:
AWS Certified Developer
      `.trim()

      const sections = detectSections(normalizeText(resume))

      expect(sections.education.length).toBeGreaterThan(0)
      expect(sections.skills.length).toBeGreaterThan(0)
      expect(sections.experience.length).toBeGreaterThan(0)
      expect(sections.projects.length).toBeGreaterThan(0)
      expect(sections.certifications.length).toBeGreaterThan(0)
    })
  })

  describe("5. Strict Anti-Hallucination", () => {
    it("leaves missing fields null or empty rather than guessing", () => {
      const bareMinimum = `
Vijay Kumar
vijay@example.com
      `.trim()

      const parsed = parseResumeRules(bareMinimum)

      expect(parsed.personal.full_name).toBe("Vijay Kumar")
      expect(parsed.personal.email).toBe("vijay@example.com")
      expect(parsed.personal.phone).toBeNull()
      expect(parsed.personal.location).toBeNull()
      expect(parsed.personal.linkedin_url).toBeNull()
      expect(parsed.personal.github_url).toBeNull()
      expect(parsed.personal.portfolio_url).toBeNull()

      // Missing education must be empty, NEVER invented
      expect(parsed.education).toEqual([])

      // Missing skills must be empty, NEVER invented
      expect(parsed.skills.normalized).toEqual([])
      expect(parsed.skills.programming_languages).toEqual([])

      // Missing experience and projects must be empty, NEVER invented
      expect(parsed.experience).toEqual([])
      expect(parsed.internships).toEqual([])
      expect(parsed.projects).toEqual([])
      expect(parsed.certifications).toEqual([])
      expect(parsed.achievements).toEqual([])
      expect(parsed.languages).toEqual([])
    })
  })

  describe("6. Extraction Quality / Confidence Indicators", () => {
    it("reports High Confidence when email, phone, education, and skills are present", () => {
      const fullResume = `
Priya Nair
priya@test.com | +91 9876543210
EDUCATION
College of Engineering Trivandrum
B.Tech Computer Science 2026
SKILLS
Python, React, PostgreSQL, Docker
      `.trim()

      const parsed = parseResumeRules(fullResume)
      expect(parsed.confidence).toBe("high")
      expect(parsed.extracted_fields_count).toBeGreaterThanOrEqual(4)
    })

    it("reports Low Confidence when crucial fields are missing", () => {
      const sparseResume = `
Just some notes
no email no phone no education
      `.trim()

      const parsed = parseResumeRules(sparseResume)
      expect(parsed.confidence).toBe("low")
    })
  })

  describe("7. Non-destructive Profile Merging", () => {
    const existingStudent: StudentProfile = {
      id: "student_123",
      name: "Existing Candidate",
      email: "candidate@college.edu",
      phone: "+91 99999 88888",
      education_level: "Undergraduate (B.Tech / B.E.)",
      degree: "B.Tech Electrical Engineering",
      college: "Existing Engineering College",
      graduation_year: 2026,
      skills: ["C", "C++"],
      experience_level: "Fresher",
      preferred_categories: ["Software Development"],
      preferred_locations: ["Kochi"],
      preferred_work_mode: ["Remote"],
    }

    const extractedFromResume: ResumeExtractedProfile = {
      personal: {
        full_name: "Resume Candidate Name",
        email: "candidate@college.edu",
        phone: "+91 11111 22222",
        location: "Bengaluru",
        linkedin_url: "https://linkedin.com/in/resumecandidate",
        github_url: "https://github.com/resumecandidate",
        portfolio_url: null,
      },
      education: [
        {
          institution: "Indian Institute of Technology",
          degree: "B.Tech Computer Science",
          field_of_study: "Computer Science",
          start_year: 2022,
          graduation_year: 2026,
          gpa_or_percentage: "9.1 / 10",
        },
      ],
      skills: {
        programming_languages: ["Python", "JavaScript"],
        frameworks: ["React"],
        libraries: [],
        databases: ["PostgreSQL"],
        tools: ["Docker"],
        cloud: ["AWS"],
        other: [],
        normalized: ["Python", "JavaScript", "React", "PostgreSQL", "Docker", "AWS"],
      },
      experience: [],
      internships: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      career: {
        experience_level: "Fresher",
        job_categories: ["Software Development"],
      },
    }

    it("preserves manually entered profile data and does not overwrite existing values", () => {
      const { mergedProfile, summary } = mergeResumeWithProfile(
        existingStudent,
        extractedFromResume,
        "resume.pdf"
      )

      // Retained existing manual personal credentials
      expect(mergedProfile.name).toBe("Existing Candidate")
      expect(mergedProfile.phone).toBe("+91 99999 88888")
      expect(mergedProfile.college).toBe("Existing Engineering College")
      expect(mergedProfile.degree).toBe("B.Tech Electrical Engineering")

      // Appended new skills non-destructively
      expect(mergedProfile.skills).toContain("C")
      expect(mergedProfile.skills).toContain("C++")
      expect(mergedProfile.skills).toContain("React")
      expect(mergedProfile.skills).toContain("Python")

      expect(summary.skillsRetained).toBe(2)
      expect(summary.skillsAdded).toBeGreaterThanOrEqual(4)
    })
  })

  describe("8. Edge Cases & Bad Files Security", () => {
    it("sanitizes file names to prevent path traversal", () => {
      expect(sanitizeFileName("../../../etc/passwd")).toBe("passwd")
      expect(sanitizeFileName("..\\..\\windows\\system32\\cmd.exe")).toBe("cmd.exe")
      expect(sanitizeFileName("my resume (1).pdf")).toBe("my resume (1).pdf")
      expect(sanitizeFileName(null as any)).toBe("resume.pdf")
    })

    it("sanitizes corrupt or null extracted profiles safely", () => {
      const sanitized = sanitizeExtractedProfile(null)
      expect(sanitized).toBeDefined()
      expect(sanitized.personal.full_name).toBeNull()
      expect(sanitized.education).toEqual([])
      expect(sanitized.skills.normalized).toEqual([])
    })
  })

  describe("9. Matching Engine Recalibration", () => {
    const devJob: Job = {
      id: "job_dev_01",
      title: "Frontend Developer (React)",
      company: "Tech Corp",
      location: "Bengaluru",
      work_mode: "Remote",
      salary: "₹10–14 LPA",
      experience: "0–1 years",
      education: "B.Tech",
      skills: ["React", "JavaScript", "TypeScript"],
      category: "Frontend Development",
      job_type: "Full-time",
      posted_at: new Date().toISOString(),
      deadline: "2026-12-31",
      description: "Build modern web apps",
      fresher_eligibility: true,
      application_url: "https://example.com",
      source: "Tech Corp",
    }

    it("enhances match score when resume skills are merged", () => {
      const studentBefore: StudentProfile = {
        id: "s1",
        name: "Student",
        email: "s@test.com",
        phone: "9876543210",
        education_level: "Undergraduate (B.Tech / B.E.)",
        degree: "B.Tech",
        college: "NIT",
        graduation_year: 2026,
        skills: ["HTML", "CSS"],
        experience_level: "Fresher",
        preferred_categories: ["Frontend Development"],
        preferred_locations: ["Bengaluru"],
        preferred_work_mode: ["Remote"],
      }

      const matchBefore = calculateJobMatch(studentBefore, devJob)

      const studentAfter: StudentProfile = {
        ...studentBefore,
        skills: ["HTML", "CSS", "React", "JavaScript", "TypeScript"],
      }

      const matchAfter = calculateJobMatch(studentAfter, devJob)

      expect(matchAfter.score).toBeGreaterThan(matchBefore.score)
      expect(matchAfter.breakdown.skillsMatch).toBe(100)
    })
  })
})
