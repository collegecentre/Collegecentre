export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite'
export type JobType = 'Full-time' | 'Internship'
export type ApplicationStatus = 'Saved' | 'Applied' | 'Shortlisted' | 'Assessment' | 'Rejected' | 'Selected'

export interface StudentProfile {
  id: string
  name: string
  email: string
  phone: string
  education_level: string // e.g. "B.Tech / B.E.", "BCA / MCA", "B.Sc / M.Sc", "BBA / MBA"
  degree: string // e.g. "Computer Science & Engineering"
  college: string // e.g. "National Institute of Technology"
  graduation_year: number // e.g. 2026, 2025, 2024
  skills: string[] // e.g. ["JavaScript", "React", "Python", "SQL"]
  experience_level: string // e.g. "Fresher (0 years)", "0-1 years (Internships)"
  preferred_categories: string[] // e.g. ["Software Development", "Data & AI", "Frontend", "QA / Testing"]
  preferred_locations: string[] // e.g. ["Bengaluru", "Hyderabad", "Remote", "Pune", "Delhi NCR"]
  preferred_work_mode: WorkMode[] // ['Remote', 'Hybrid']
  resume_name?: string
  resume_headline?: string
}

export interface Job {
  id: string
  title: string
  company: string
  company_logo?: string
  location: string
  work_mode: WorkMode
  salary: string // e.g. "₹4–6 LPA", "₹25,000/month stipend"
  experience: string // e.g. "0–1 years", "Fresher", "0 years"
  education: string // e.g. "B.Tech / BCA / Any Graduate"
  skills: string[]
  category: string // e.g. "Software Development", "Data Engineering", "UI/UX Design", "Product Management", "QA / Testing", "Sales & Marketing"
  job_type: JobType
  posted_at: string // ISO date or "Today", "Yesterday"
  deadline: string
  description: string
  fresher_eligibility: boolean // true = Fresher eligible
  application_url: string
  source: string // e.g. "TechNova Careers", "Direct Employer", "Campus Placement Partner"
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
  created_at: string
}

export interface AccessPeriod {
  id: string
  student_id: string
  payment_id: string
  started_at: string // ISO timestamp
  expires_at: string // ISO timestamp (+24 hours)
  status: 'active' | 'expired'
}

export interface MatchResult {
  score: number // 0 - 100
  breakdown: {
    skillsMatch: number
    educationMatch: number
    experienceMatch: number
    locationMatch: number
    fresherMatch: number
  }
  reasons: string[]
}
