import {
  ResumeProject,
  ResumeInternship,
  ResumeExperience,
  ResumeCertification,
  ResumeAchievement,
  ResumeExtractedProfile,
} from './resume'

export * from './resume'

export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite'
export type JobType = 'Full-time' | 'Internship'
export type ApplicationStatus = 'Saved' | 'Applied' | 'Shortlisted' | 'Assessment' | 'Rejected' | 'Selected'

export interface StudentProfile {
  id: string
  name: string
  email: string
  phone: string
  education_level: string // e.g. "Undergraduate (B.Tech / B.E.)", "BCA / MCA"
  degree: string // e.g. "Computer Science & Engineering"
  college: string // e.g. "National Institute of Technology"
  graduation_year: number // e.g. 2026, 2025, 2024
  skills: string[] // e.g. ["JavaScript", "React", "Python", "SQL"]
  experience_level: string // e.g. "Fresher (0 years)", "0-1 years"
  preferred_categories: string[] // e.g. ["Software Development", "Data & AI"]
  preferred_locations: string[] // e.g. ["Bengaluru", "Hyderabad", "Remote", "Pune"]
  preferred_work_mode: WorkMode[] // ['Remote', 'Hybrid']
  cgpa?: string | null
  // Optional resume-extracted fields
  linkedin_url?: string | null
  github_url?: string | null
  portfolio_url?: string | null
  projects?: ResumeProject[]
  internships?: ResumeInternship[]
  experience?: ResumeExperience[]
  certifications?: ResumeCertification[]
  achievements?: ResumeAchievement[]
  languages?: string[]
  resume_file_name?: string | null
  resume_parsed_at?: string | null
}

export interface Job {
  id: string
  title: string
  company: string
  company_logo?: string
  location: string
  work_mode: WorkMode
  salary: string // e.g. "₹4–6 LPA", "₹30,000/month stipend"
  experience: string // e.g. "0–1 years", "Fresher"
  education: string // e.g. "B.Tech / BCA / Any Graduate"
  skills: string[]
  category: string // e.g. "Software Development", "Data & AI", "QA / Testing"
  job_type: JobType
  posted_at: string
  deadline: string
  description: string
  fresher_eligibility: boolean
  application_url: string
  source: string
}

export interface SavedJob {
  id: string
  student_id: string
  job_id: string
  created_at: string
  notes?: string
}

export interface Application {
  id: string
  student_id: string
  job_id: string
  status: ApplicationStatus
  applied_at: string
  notes?: string
  updated_at: string
  follow_up_date?: string
}

export interface Payment {
  id: string
  student_id: string
  amount: number // 199
  status: 'Success' | 'Failed' | 'Pending'
  payment_method: 'UPI' | 'Card' | 'NetBanking'
  transaction_id: string
  order_id?: string
  created_at: string
}

export interface AccessPeriod {
  id: string
  student_id: string
  payment_id: string
  started_at: string
  expires_at: string
  scheduled_for?: string
  status: 'active' | 'scheduled' | 'expired'
}

export interface MatchResult {
  score: number
  breakdown: {
    skillsMatch: number
    educationMatch: number
    experienceMatch: number
    locationMatch: number
    fresherMatch: number
  }
  reasons: string[]
  matchedSkills?: string[]
  missingSkills?: string[]
}
