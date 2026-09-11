import { describe, it, expect } from "vitest"
import { sanitizeExtractedProfile, generateMockProfile } from "../server/resumeParserHandler.js"
import {
  normalizeSkillName,
  normalizeAndDeduplicateSkills,
  mergeResumeWithProfile,
} from "../src/services/skillNormalizer"
import { calculateJobMatch } from "../src/services/matching"
import { StudentProfile, Job } from "../src/types"
import { ResumeExtractedProfile } from "../src/types/resume"

describe("Resume Parser & AI Profile Builder Unit Tests", () => {
  describe("1. Anti-hallucination & Schema Sanitization", () => {
    it("sanitizes empty, null, or corrupted data without throwing", () => {
      const sanitized = sanitizeExtractedProfile(null)
      expect(sanitized).toBeDefined()
      expect(sanitized.personal.full_name).toBeNull()
      expect(sanitized.personal.email).toBeNull()
      expect(sanitized.education).toEqual([])
      expect(sanitized.skills.programming_languages).toEqual([])
      expect(sanitized.projects).toEqual([])
      expect(sanitized.internships).toEqual([])
    })

    it("enforces anti-hallucination rules by stripping whitespace-only and invalid fields", () => {
      const raw = {
        personal: {
          full_name: "  ",
          email: "valid@nitk.edu.in",
          phone: "   ",
          linkedin_url: null,
        },
        education: [
          {
            institution: "NITK Surathkal",
            degree: "B.Tech CSE",
            field_of_study: "Computer Science",
            start_year: 2022,
            graduation_year: 2026,
            gpa_or_percentage: "8.9 / 10",
          },
          {
            institution: "   ", // Invalid empty entry
            degree: "",
          },
        ],
        skills: {
          programming_languages: [" TypeScript ", "Python", "", "   "],
          frameworks: ["React", null as any],
          normalized: ["React", "TypeScript", "Python"],
        },
        projects: [
          {
            name: "Cloud Task Orchestrator",
            description: "Distributed workflow runner in Go and Redis",
            technologies: ["Golang", "Redis", "Docker"],
            url: "https://github.com/test/orchestrator",
          },
        ],
      }

      const clean = sanitizeExtractedProfile(raw)

      // Stripped empty strings to null
      expect(clean.personal.full_name).toBeNull()
      expect(clean.personal.email).toBe("valid@nitk.edu.in")
      expect(clean.personal.phone).toBeNull()

      // Filtered out invalid empty education entry
      expect(clean.education.length).toBe(1)
      expect(clean.education[0].institution).toBe("NITK Surathkal")

      // Cleaned skills
      expect(clean.skills.programming_languages).toEqual(["TypeScript", "Python"])
      expect(clean.skills.frameworks).toEqual(["React"])

      // Projects mapped correctly
      expect(clean.projects.length).toBe(1)
      expect(clean.projects[0].name).toBe("Cloud Task Orchestrator")
      expect(clean.projects[0].technologies).toEqual(["Golang", "Redis", "Docker"])
    })

    it("generates a realistic sample profile in offline development mock mode", () => {
      const mock = generateMockProfile("ananya_resume.pdf")
      expect(mock.personal.full_name).toBe("Ananya Deshmukh")
      expect(mock.education[0].graduation_year).toBe(2026)
      expect(mock.skills.normalized.length).toBeGreaterThan(5)
      expect(mock.projects.length).toBeGreaterThanOrEqual(1)
      expect(mock.internships.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("2. Skill Normalizer & Canonical Synonyms", () => {
    it("maps tech aliases to canonical forms", () => {
      expect(normalizeSkillName("js")).toBe("JavaScript")
      expect(normalizeSkillName("py")).toBe("Python")
      expect(normalizeSkillName("react.js")).toBe("React")
      expect(normalizeSkillName("reactjs")).toBe("React")
      expect(normalizeSkillName("k8s")).toBe("Kubernetes")
      expect(normalizeSkillName("postgres")).toBe("PostgreSQL")
      expect(normalizeSkillName("postgresql")).toBe("PostgreSQL")
      expect(normalizeSkillName("dsa")).toBe("Data Structures & Algorithms")
    })

    it("deduplicates skills across casing, synonyms, and variations", () => {
      const rawList = [
        "react",
        "ReactJS",
        "React.js",
        "python",
        "py",
        "Python3",
        "Docker",
        "docker",
        "K8s",
        "kubernetes",
      ]
      const deduplicated = normalizeAndDeduplicateSkills(rawList)

      expect(deduplicated).toContain("React")
      expect(deduplicated).toContain("Python")
      expect(deduplicated).toContain("Docker")
      expect(deduplicated).toContain("Kubernetes")

      // Should not contain duplicate representations
      const reactMatches = deduplicated.filter((s) => s.toLowerCase().includes("react"))
      expect(reactMatches.length).toBe(1)
    })
  })

  describe("3. Non-destructive Profile Merging", () => {
    const existingStudent: StudentProfile = {
      id: "student_123",
      name: "Existing Candidate",
      email: "candidate@college.edu",
      phone: "+91 99999 88888",
      education_level: "Undergraduate (B.Tech / B.E.)",
      degree: "",
      college: "",
      graduation_year: 2026,
      skills: ["JavaScript", "HTML", "CSS"],
      experience_level: "Fresher",
      preferred_categories: ["Software Development"],
      preferred_locations: ["Bengaluru"],
      preferred_work_mode: ["Remote", "Hybrid"],
    }

    const extractedFromResume: ResumeExtractedProfile = {
      personal: {
        full_name: "Resume Candidate Name",
        email: "candidate@college.edu",
        phone: "+91 11111 22222",
        location: "Bengaluru, India",
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
        programming_languages: ["Python", "TypeScript", "JavaScript"],
        frameworks: ["React", "FastAPI"],
        libraries: [],
        databases: ["PostgreSQL"],
        tools: ["Docker", "Git"],
        cloud: ["AWS"],
        other: [],
        normalized: ["Python", "TypeScript", "JavaScript", "React", "FastAPI", "PostgreSQL", "Docker", "Git", "AWS"],
      },
      experience: [],
      internships: [
        {
          company: "Acme FinTech",
          role: "Software Engineering Intern",
          duration: "May 2025 – July 2025",
          technologies: ["Python", "FastAPI", "PostgreSQL"],
          description: "Built high-throughput payment webhook processing microservice.",
        },
      ],
      projects: [
        {
          name: "Real-time Chat App",
          description: "WebSocket messaging service with Redis pub/sub",
          technologies: ["Node.js", "WebSocket", "Redis"],
          url: "https://github.com/resumecandidate/chat",
        },
      ],
      certifications: [],
      achievements: [],
      languages: [],
      career: {
        experience_level: "Fresher",
        job_categories: ["Software Development"],
      },
    }

    it("preserves existing manual fields while filling missing academics and merging new skills", () => {
      const { mergedProfile, summary } = mergeResumeWithProfile(
        existingStudent,
        extractedFromResume,
        "resume_v1.pdf"
      )

      // Retained original candidate name & email & phone
      expect(mergedProfile.name).toBe("Existing Candidate")
      expect(mergedProfile.phone).toBe("+91 99999 88888")

      // Filled missing college and degree
      expect(mergedProfile.college).toBe("Indian Institute of Technology")
      expect(mergedProfile.degree).toBe("B.Tech Computer Science")

      // Added links that were previously empty
      expect(mergedProfile.linkedin_url).toBe("https://linkedin.com/in/resumecandidate")
      expect(mergedProfile.github_url).toBe("https://github.com/resumecandidate")

      // Preserved existing skills ("JavaScript", "HTML5", "CSS3") and added new unique skills
      expect(mergedProfile.skills).toContain("JavaScript")
      expect(mergedProfile.skills).toContain("HTML5")
      expect(mergedProfile.skills).toContain("CSS3")
      expect(mergedProfile.skills).toContain("React")
      expect(mergedProfile.skills).toContain("Python")
      expect(mergedProfile.skills).toContain("Docker")

      // Attached projects & internships
      expect(mergedProfile.projects?.length).toBe(1)
      expect(mergedProfile.projects?.[0].title).toBe("Real-time Chat App")
      expect(mergedProfile.internships?.length).toBe(1)
      expect(mergedProfile.internships?.[0].company).toBe("Acme FinTech")

      // Recorded metadata
      expect(mergedProfile.resume_file_name).toBe("resume_v1.pdf")
      expect(mergedProfile.resume_parsed_at).toBeDefined()

      // Summary diff verification
      expect(summary.skillsAdded).toBeGreaterThan(0)
      expect(summary.skillsRetained).toBe(3)
      expect(summary.projectsAdded).toBe(1)
      expect(summary.internshipsAdded).toBe(1)
      expect(summary.academicsUpdated).toBe(true)
    })
  })

  describe("4. Matching Engine Integration with Extracted Resume Stack", () => {
    const backendJob: Job = {
      id: "job_be_01",
      title: "Backend Engineer (FastAPI & Docker)",
      company: "ScaleGrid",
      location: "Bengaluru",
      work_mode: "Hybrid",
      salary: "₹14–18 LPA",
      experience: "0–1 years",
      education: "B.Tech Computer Science",
      skills: ["Python", "FastAPI", "Docker", "PostgreSQL"],
      category: "Backend Development",
      job_type: "Full-time",
      posted_at: new Date().toISOString(),
      deadline: "2026-12-31",
      description: "Scale distributed microservices with Python and Docker.",
      fresher_eligibility: true,
      application_url: "https://scalegrid.io/careers/1",
      source: "ScaleGrid Careers",
    }

    it("increases match score when candidate acquires demonstrated project and internship technologies", () => {
      // Baseline student with only HTML/CSS
      const baselineStudent: StudentProfile = {
        id: "student_base",
        name: "Student A",
        email: "studentA@example.com",
        phone: "9876543210",
        education_level: "Undergraduate (B.Tech / B.E.)",
        degree: "Computer Science",
        college: "NITK",
        graduation_year: 2026,
        skills: ["HTML", "CSS"],
        experience_level: "Fresher",
        preferred_categories: ["Software Development"],
        preferred_locations: ["Bengaluru"],
        preferred_work_mode: ["Hybrid"],
      }

      const baselineMatch = calculateJobMatch(baselineStudent, backendJob)

      // Student after merging resume containing Python, FastAPI, Docker, and an internship
      const enrichedStudent: StudentProfile = {
        ...baselineStudent,
        skills: ["HTML", "CSS", "Python", "FastAPI", "Docker", "PostgreSQL"],
        internships: [
          {
            company: "Tech Labs",
            role: "Backend Intern",
            duration: "3 months",
            skills_used: ["Python", "Docker"],
            description: "Built API endpoints",
          },
        ],
        projects: [
          {
            title: "Microservice API",
            description: "FastAPI REST service",
            technologies: ["FastAPI", "Docker", "PostgreSQL"],
          },
        ],
      }

      const enrichedMatch = calculateJobMatch(enrichedStudent, backendJob)

      // Enriched profile matching all skills and having internship experience must have a vastly higher score
      expect(enrichedMatch.score).toBeGreaterThan(baselineMatch.score)
      expect(enrichedMatch.breakdown.skillsMatch).toBe(100)
      expect(enrichedMatch.breakdown.experienceMatch).toBe(100)
      expect(enrichedMatch.matchedSkills).toContain("Python")
      expect(enrichedMatch.matchedSkills).toContain("FastAPI")
      expect(enrichedMatch.matchedSkills).toContain("Docker")
      expect(enrichedMatch.matchedSkills).toContain("PostgreSQL")
      expect(enrichedMatch.missingSkills.length).toBe(0)
    })
  })
})
