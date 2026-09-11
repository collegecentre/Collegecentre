import {
  AccessPeriod,
  Application,
  ApplicationStatus,
  Job,
  Payment,
  SavedJob,
  StudentProfile,
} from '@/types'
import { supabase } from './supabase'

const STORAGE_KEYS = {
  STUDENT: 'collegecentre_student_profile',
  JOBS: 'collegecentre_jobs',
  SAVED_JOBS: 'collegecentre_saved_jobs',
  APPLICATIONS: 'collegecentre_applications',
  PAYMENTS: 'collegecentre_payments',
  ACCESS_PERIOD: 'collegecentre_access_period',
}

export const INITIAL_STUDENT: StudentProfile = {
  id: 'guest_student',
  name: '',
  email: '',
  phone: '',
  education_level: 'Undergraduate (B.Tech / B.E.)',
  degree: 'Computer Science & Engineering',
  college: '',
  graduation_year: 2026,
  skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
  experience_level: 'Fresher (0–1 years)',
  preferred_categories: ['Software Development', 'Frontend Development', 'Full Stack', 'Data & AI'],
  preferred_locations: ['Bengaluru', 'Remote', 'Hyderabad', 'Pune', 'Gurugram'],
  preferred_work_mode: ['Remote', 'Hybrid'],
}

export const SEED_JOBS: Job[] = [
  {
    id: 'job_01',
    title: 'Software Development Engineer - Campus Graduate',
    company: 'Google',
    company_logo: 'G',
    location: 'Bengaluru / Hyderabad',
    work_mode: 'Hybrid',
    salary: '₹18–24 LPA',
    experience: 'Fresher (2024–2026)',
    education: 'B.Tech / BCA / M.Tech (CS/IT/ECE)',
    skills: ['Data Structures', 'Algorithms', 'Java', 'C++', 'Python'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    deadline: 'In 14 days',
    description:
      'Google is hiring University Graduates and Freshers for our core engineering teams across Bengaluru and Hyderabad. You will build scalable systems, contribute to cloud and client software, and participate in peer code reviews.',
    fresher_eligibility: true,
    application_url: 'https://www.google.com/about/careers/applications/jobs/results/?q=software+engineer',
    source: 'Google University Programs',
  },
  {
    id: 'job_02',
    title: 'Software Engineer Trainee',
    company: 'Microsoft',
    company_logo: 'MS',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹16–22 LPA',
    experience: 'Fresher',
    education: 'B.Tech / BE / MCA',
    skills: ['React', 'TypeScript', 'C#', 'Azure', 'Algorithms'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    deadline: 'In 10 days',
    description:
      'Join Microsoft India Development Center. Work on cutting-edge cloud productivity, Azure services, and modern developer tooling. Mentorship from senior software architects.',
    fresher_eligibility: true,
    application_url: 'https://jobs.careers.microsoft.com/global/en/search?q=university',
    source: 'Microsoft Careers Portal',
  },
  {
    id: 'job_03',
    title: 'Associate Software Engineer',
    company: 'Razorpay',
    company_logo: 'RZ',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹12–16 LPA',
    experience: '0–1 years',
    education: 'B.Tech / BE / MCA',
    skills: ['Golang', 'Python', 'SQL', 'Distributed Systems', 'Git'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    deadline: 'In 18 days',
    description:
      'Power the financial infrastructure of India. You will work on low-latency payment processing, merchant checkout SDKs, and automated fraud prevention systems.',
    fresher_eligibility: true,
    application_url: 'https://razorpay.com/jobs/',
    source: 'Razorpay Early Careers',
  },
  {
    id: 'job_04',
    title: 'Software Development Intern (PPO Track)',
    company: 'Swiggy',
    company_logo: 'SW',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹40,000 / month Stipend (PPO: ₹14–18 LPA)',
    experience: 'Fresher / Pre-final Year',
    education: 'B.Tech / BE (Graduating 2025/2026)',
    skills: ['Node.js', 'React', 'Java', 'Microservices', 'Kafka'],
    category: 'Software Development',
    job_type: 'Internship',
    posted_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    deadline: 'In 7 days',
    description:
      '6-month high-impact internship with fast-tracked Pre-Placement Offer conversion. Build consumer-facing delivery routing and instant-commerce microservices.',
    fresher_eligibility: true,
    application_url: 'https://careers.swiggy.com/',
    source: 'Swiggy Engineering Campus',
  },
  {
    id: 'job_05',
    title: 'Associate QA / Test Automation Engineer',
    company: 'Zomato',
    company_logo: 'ZO',
    location: 'Gurugram',
    work_mode: 'Hybrid',
    salary: '₹6–9 LPA',
    experience: 'Fresher',
    education: 'B.Tech / BCA / B.Sc IT',
    skills: ['Python', 'Selenium', 'Appium', 'Postman', 'SQL'],
    category: 'QA / Testing',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    deadline: 'In 20 days',
    description:
      'Ensure 99.99% release reliability across millions of live food orders. Automate integration test suites, mobile app regressions, and API contract tests.',
    fresher_eligibility: true,
    application_url: 'https://www.zomato.com/careers',
    source: 'Zomato Talent Network',
  },
  {
    id: 'job_06',
    title: 'Junior Backend Engineer',
    company: 'Zerodha',
    company_logo: 'ZD',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹10–14 LPA',
    experience: '0–1 years',
    education: 'B.Tech CS / IT / Self-taught',
    skills: ['Python', 'PostgreSQL', 'Golang', 'Linux', 'Redis'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    deadline: 'In 12 days',
    description:
      'Work on free and open-source fintech software handling tens of millions of daily trade orders. Clean architecture, zero telemetry bloat, and emphasis on fast execution.',
    fresher_eligibility: true,
    application_url: 'https://zerodha.com/careers',
    source: 'Zerodha Tech Collective',
  },
  {
    id: 'job_07',
    title: 'Associate Product Designer (UI/UX)',
    company: 'CRED',
    company_logo: 'CR',
    location: 'Bengaluru',
    work_mode: 'Onsite',
    salary: '₹10–15 LPA',
    experience: 'Fresher / Portfolio required',
    education: 'Any Degree / Design Graduate',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'Micro-interactions', 'Typography'],
    category: 'UI/UX Design',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    deadline: 'In 15 days',
    description:
      'Design high-craft design experiences for top-tier credit users. Work on sleek dark-mode design languages, typography systems, and tactile physical feedback.',
    fresher_eligibility: true,
    application_url: 'https://careers.cred.club/',
    source: 'CRED Design Team',
  },
  {
    id: 'job_08',
    title: 'Cloud Support Associate',
    company: 'Amazon Web Services (AWS)',
    company_logo: 'AWS',
    location: 'Hyderabad',
    work_mode: 'Hybrid',
    salary: '₹12–15 LPA',
    experience: '0–1 years',
    education: 'B.Tech / BE / MCA (2024–2026)',
    skills: ['Linux', 'Networking', 'AWS', 'Python', 'Troubleshooting'],
    category: 'Security & Infrastructure',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    deadline: 'In 21 days',
    description:
      'Help global enterprise engineering teams debug distributed cloud systems. Comprehensive onboarding on EC2, S3, RDS, networking architectures, and container orchestration.',
    fresher_eligibility: true,
    application_url: 'https://www.amazon.jobs/en/teams/internships-for-students',
    source: 'Amazon University Hiring',
  },
  {
    id: 'job_09',
    title: 'Junior AI / ML Research Engineer',
    company: 'Postman',
    company_logo: 'PM',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹14–18 LPA',
    experience: '0–1 years',
    education: 'B.Tech / M.Tech / MS in CS or Stats',
    skills: ['Python', 'PyTorch', 'NLP', 'LLMs', 'API Design'],
    category: 'Data & AI',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    deadline: 'In 9 days',
    description:
      'Build generative AI developer tooling and automated API documentation workflows. Fine-tune open models and develop high-precision evaluation harnesses.',
    fresher_eligibility: true,
    application_url: 'https://www.postman.com/company/careers/',
    source: 'Postman AI Labs',
  },
  {
    id: 'job_10',
    title: 'Associate Product Operations Specialist',
    company: 'Flipkart',
    company_logo: 'FK',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹6–8 LPA',
    experience: 'Fresher',
    education: 'Any Graduate / B.Tech / BBA',
    skills: ['Excel', 'SQL', 'Problem Solving', 'Data Analytics', 'Dashboards'],
    category: 'Product & Operations',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    deadline: 'In 16 days',
    description:
      'Bridge the gap between product managers and supply chain operations. Analyze catalog metrics, track fulfillment SLAs, and build automated operational dashboards.',
    fresher_eligibility: true,
    application_url: 'https://www.flipkartcareers.com/',
    source: 'Flipkart Campus Connect',
  },
  {
    id: 'job_11',
    title: 'React Native Mobile Developer Intern',
    company: 'PhonePe',
    company_logo: 'PP',
    location: 'Bengaluru',
    work_mode: 'Onsite',
    salary: '₹35,000 / month Stipend (PPO: ₹12–15 LPA)',
    experience: 'Fresher / Final Year',
    education: 'B.Tech / BCA / MCA',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Mobile UX'],
    category: 'Software Development',
    job_type: 'Internship',
    posted_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    deadline: 'In 11 days',
    description:
      'Work on India’s most widely used payments app. Build smooth, 60fps React Native user experiences handling millions of concurrent UPI transactions.',
    fresher_eligibility: true,
    application_url: 'https://www.phonepe.com/careers/',
    source: 'PhonePe Tech Careers',
  },
  {
    id: 'job_12',
    title: 'Graduate Cybersecurity Analyst Trainee',
    company: 'Tata Consultancy Services (TCS)',
    company_logo: 'TCS',
    location: 'Pune / Hyderabad',
    work_mode: 'Hybrid',
    salary: '₹4.5–7 LPA',
    experience: 'Fresher (TCS NextStep)',
    education: 'B.Tech / B.Sc IT / BCA / MCA',
    skills: ['Network Security', 'Linux', 'Vulnerability Assessment', 'Python', 'Wireshark'],
    category: 'Security & Infrastructure',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    deadline: 'In 22 days',
    description:
      'Join TCS Cyber Security Practice via the NextStep hiring track. Monitor threat vectors in real-time Security Operation Centers (SOC) and implement security protocols.',
    fresher_eligibility: true,
    application_url: 'https://nextstep.tcs.com/campus/',
    source: 'TCS NextStep Campus Hiring',
  },
]

// Database Service Helper functions
export const db = {
  // Student Profile
  getStudent(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT)
      if (data) return JSON.parse(data)
    } catch {
      // ignore
    }
    return INITIAL_STUDENT
  },

  saveStudent(student: StudentProfile): void {
    const studentToSave: StudentProfile = {
      ...student,
      id: (!student.id || student.id === 'guest_student')
        ? `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
        : student.id,
    }
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(studentToSave))
    this.saveStudentToCloud(studentToSave)
  },

  async saveStudentToCloud(student: StudentProfile): Promise<void> {
    try {
      if (!student.email || !student.email.trim()) return
      const cleanPhone = student.phone || ''
      const payload = {
        id: student.id || `cand_${Date.now()}`,
        name: student.name || 'Candidate',
        email: student.email.trim().toLowerCase(),
        phone: cleanPhone,
        education_level: student.education_level || 'Undergraduate',
        degree: student.degree || 'Computer Science',
        college: student.college || '',
        graduation_year: student.graduation_year || 2026,
        skills: student.skills || [],
        experience_level: student.experience_level || 'Fresher',
        preferred_categories: student.preferred_categories || [],
        preferred_locations: student.preferred_locations || [],
        preferred_work_mode: student.preferred_work_mode || ['Remote', 'Hybrid'],
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from('cc_student_profiles').upsert(payload, { onConflict: 'email' })
      if (error) {
        console.warn('Supabase student sync warning:', error.message)
      }
    } catch (err) {
      console.warn('Supabase student sync warning', err)
    }
  },

  async fetchCloudStudentByEmail(email: string): Promise<StudentProfile | null> {
    try {
      if (!email || !email.trim()) return null
      const { data, error } = await supabase
        .from('cc_student_profiles')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle()

      if (error || !data) return null
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        education_level: data.education_level || 'Undergraduate',
        degree: data.degree || '',
        college: data.college || '',
        graduation_year: data.graduation_year || 2026,
        skills: data.skills || [],
        experience_level: data.experience_level || 'Fresher',
        preferred_categories: data.preferred_categories || [],
        preferred_locations: data.preferred_locations || [],
        preferred_work_mode: data.preferred_work_mode || ['Remote', 'Hybrid'],
      }
    } catch {
      return null
    }
  },

  // Jobs
  getJobs(): Job[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS)
      if (data) return JSON.parse(data)
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(SEED_JOBS))
    return SEED_JOBS
  },

  // Fetch live jobs from Supabase cc_jobs table
  async fetchCloudJobs(): Promise<Job[] | null> {
    try {
      const { data, error } = await supabase
        .from('cc_jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_at', { ascending: false })

      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(data))
        return data as Job[]
      }
    } catch (err) {
      console.warn('Supabase jobs fetch fallback to local storage', err)
    }
    return null
  },

  getJobById(id: string): Job | undefined {
    return this.getJobs().find((j) => j.id === id)
  },

  // Access Period (₹199 / 24-Hour Pass)
  getAccessPeriod(studentId?: string): AccessPeriod | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCESS_PERIOD)
      if (data) {
        const period: AccessPeriod = JSON.parse(data)
        if (!studentId || period.student_id === studentId) {
          // Check if expired
          const now = Date.now()
          const expiresAt = new Date(period.expires_at).getTime()
          if (now >= expiresAt && period.status === 'active') {
            period.status = 'expired'
            localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(period))
          }
          return period
        }
      }
    } catch {
      // ignore
    }
    return null
  },

  saveAccessPeriod(period: AccessPeriod, studentId?: string): void {
    const toSave: AccessPeriod = studentId ? { ...period, student_id: studentId } : period
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(toSave))
  },

  isPassActive(studentId?: string): boolean {
    const period = this.getAccessPeriod(studentId)
    if (!period) return false
    const now = Date.now()

    // If pass was scheduled and scheduled time has arrived, auto-activate
    if (period.status === 'scheduled' && period.scheduled_for) {
      const scheduledTime = new Date(period.scheduled_for).getTime()
      if (now >= scheduledTime) {
        period.status = 'active'
        period.started_at = new Date(scheduledTime).toISOString()
        period.expires_at = new Date(scheduledTime + 24 * 60 * 60 * 1000).toISOString()
        localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(period))
      }
    }

    const expiresAt = new Date(period.expires_at).getTime()
    return period.status === 'active' && now < expiresAt
  },

  isPassScheduled(studentId?: string): { isScheduled: boolean; scheduledFor?: string } {
    const period = this.getAccessPeriod(studentId)
    if (!period || period.status !== 'scheduled' || !period.scheduled_for) {
      return { isScheduled: false }
    }
    const now = Date.now()
    const scheduledTime = new Date(period.scheduled_for).getTime()
    if (now < scheduledTime) {
      return { isScheduled: true, scheduledFor: period.scheduled_for }
    }
    return { isScheduled: false }
  },

  startScheduledPassNow(studentId: string = 'guest_student'): AccessPeriod | null {
    const period = this.getAccessPeriod(studentId)
    if (!period) return null
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    period.status = 'active'
    period.started_at = now.toISOString()
    period.expires_at = expiresAt.toISOString()
    delete period.scheduled_for
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(period))
    return period
  },

  activatePass(
    studentId: string = 'guest_student',
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' = 'UPI',
    studentEmail?: string,
    transactionId?: string,
    orderId?: string,
    scheduledFor?: string
  ): { payment: Payment; accessPeriod: AccessPeriod } {
    const now = new Date()
    const isScheduled = !!scheduledFor && new Date(scheduledFor).getTime() > now.getTime()
    const startTime = isScheduled ? new Date(scheduledFor) : now
    const expiresAt = new Date(startTime.getTime() + 24 * 60 * 60 * 1000) // Exactly +24 hours from start

    const payment: Payment = {
      id: `pay_${Date.now()}`,
      student_id: studentId,
      amount: 199,
      status: 'Success',
      payment_method: paymentMethod,
      transaction_id: transactionId || `TXN_CC_${Math.floor(100000000 + Math.random() * 900000000)}`,
      order_id: orderId,
      created_at: now.toISOString(),
    }

    const accessPeriod: AccessPeriod = {
      id: `access_${Date.now()}`,
      student_id: studentId,
      payment_id: payment.id,
      started_at: startTime.toISOString(),
      expires_at: expiresAt.toISOString(),
      scheduled_for: isScheduled ? scheduledFor : undefined,
      status: isScheduled ? 'scheduled' : 'active',
    }

    // Save payment
    const payments = this.getPayments(studentId)
    payments.unshift(payment)
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))

    // Save access period
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(accessPeriod))

    this.syncPassToCloud(payment, accessPeriod, studentEmail)

    return { payment, accessPeriod }
  },

  async syncPassToCloud(payment: Payment, period: AccessPeriod, email?: string): Promise<void> {
    try {
      const studentEmail = email || this.getStudent().email || 'student@collegecentre.in'
      await Promise.all([
        supabase.from('cc_payments').insert({
          id: payment.id,
          user_id: payment.student_id,
          amount: payment.amount,
          currency: 'INR',
          payment_method: payment.payment_method,
          status: payment.status,
          transaction_id: payment.transaction_id,
          created_at: payment.created_at,
        }),
        supabase.from('cc_access_passes').insert({
          id: period.id,
          user_id: period.student_id,
          student_email: studentEmail,
          started_at: period.started_at,
          expires_at: period.expires_at,
          amount: 199.0,
          status: period.status,
          payment_method: payment.payment_method,
          transaction_id: payment.transaction_id,
          created_at: period.started_at,
        }),
      ])
    } catch (err) {
      console.warn('Supabase pass sync warning', err)
    }
  },

  // Developer simulation helper: immediately expire pass to test locked state
  simulateExpirePass(studentId: string = 'guest_student'): void {
    const period = this.getAccessPeriod(studentId)
    if (period) {
      const pastTime = new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
      period.expires_at = pastTime
      period.status = 'expired'
      localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(period))
    } else {
      // create expired period
      const dummyPeriod: AccessPeriod = {
        id: `access_exp_${Date.now()}`,
        student_id: studentId,
        payment_id: 'pay_dummy',
        started_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
        expires_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        status: 'expired',
      }
      localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(dummyPeriod))
    }
  },

  // Developer simulation helper: set remaining time in minutes
  setPassRemainingMinutes(minutes: number, studentId: string = 'guest_student'): void {
    const now = Date.now()
    const expiresAt = new Date(now + minutes * 60 * 1000)
    const period: AccessPeriod = {
      id: `access_sim_${now}`,
      student_id: studentId,
      payment_id: 'pay_sim',
      started_at: new Date(now - (24 * 60 - minutes) * 60 * 1000).toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'active',
    }
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(period))
  },

  // Payments History
  getPayments(studentId?: string): Payment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS)
      if (data) {
        const list: Payment[] = JSON.parse(data)
        if (studentId) return list.filter((p) => p.student_id === studentId)
        return list
      }
    } catch {
      // ignore
    }
    return []
  },

  // Saved Jobs (PERMANENT - never deleted or locked on expiry)
  getSavedJobs(studentId?: string): SavedJob[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)
      if (data) {
        const list: SavedJob[] = JSON.parse(data)
        if (studentId) return list.filter((s) => s.student_id === studentId)
        return list
      }
    } catch {
      // ignore
    }
    return []
  },

  isJobSaved(jobId: string, studentId?: string): boolean {
    const list = this.getSavedJobs(studentId)
    return list.some((s) => s.job_id === jobId)
  },

  toggleSaveJob(jobId: string, studentId: string = 'guest_student'): boolean {
    const list = this.getSavedJobs(studentId)
    const index = list.findIndex((s) => s.job_id === jobId)
    if (index >= 0) {
      list.splice(index, 1)
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list))
      return false
    } else {
      list.push({
        id: `save_${Date.now()}`,
        student_id: studentId,
        job_id: jobId,
        created_at: new Date().toISOString(),
      })
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list))
      return true
    }
  },

  removeSavedJob(jobId: string, studentId: string = 'guest_student'): void {
    const list = this.getSavedJobs(studentId).filter((s) => s.job_id !== jobId)
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list))
  },

  // Applications Tracker (PERMANENT - never deleted or locked on expiry)
  getApplications(studentId?: string): Application[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS)
      if (data) {
        const list: Application[] = JSON.parse(data)
        if (studentId) return list.filter((a) => a.student_id === studentId)
        return list
      }
    } catch {
      // ignore
    }
    return []
  },

  getApplicationByJobId(jobId: string, studentId?: string): Application | undefined {
    return this.getApplications(studentId).find((a) => a.job_id === jobId)
  },

  async syncApplicationToCloud(app: Application): Promise<void> {
    try {
      await supabase.from('cc_applications').upsert(
        {
          id: app.id,
          user_id: app.student_id,
          job_id: app.job_id,
          status: app.status,
          notes: app.notes || null,
          applied_at: app.applied_at,
          updated_at: app.updated_at,
        },
        { onConflict: 'id' }
      )
    } catch (err) {
      console.warn('Supabase application sync warning', err)
    }
  },

  createOrUpdateApplication(
    jobId: string,
    status: ApplicationStatus,
    notes?: string,
    studentId: string = 'guest_student'
  ): Application {
    const list = this.getApplications(studentId)
    const existingIndex = list.findIndex((a) => a.job_id === jobId)

    if (existingIndex >= 0) {
      list[existingIndex].status = status
      if (notes !== undefined) list[existingIndex].notes = notes
      list[existingIndex].updated_at = new Date().toISOString()
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list))
      this.syncApplicationToCloud(list[existingIndex])
      return list[existingIndex]
    } else {
      const newApp: Application = {
        id: `app_${Date.now()}`,
        student_id: studentId,
        job_id: jobId,
        status,
        applied_at: new Date().toISOString(),
        notes: notes || 'Applied via CollegeCentre pass',
        updated_at: new Date().toISOString(),
      }
      list.unshift(newApp)
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list))
      this.syncApplicationToCloud(newApp)
      return newApp
    }
  },

  updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    studentId?: string
  ): Application | null {
    const list = this.getApplications(studentId)
    const app = list.find((a) => a.id === applicationId)
    if (!app) return null

    app.status = newStatus
    if (notes !== undefined) app.notes = notes
    app.updated_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list))
    this.syncApplicationToCloud(app)
    return app
  },

  deleteApplication(applicationId: string, studentId?: string): void {
    const list = this.getApplications(studentId).filter((a) => a.id !== applicationId)
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list))
  },

  // Reset entire database to initial state
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENT)
    localStorage.removeItem(STORAGE_KEYS.JOBS)
    localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS)
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS)
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS)
    localStorage.removeItem(STORAGE_KEYS.ACCESS_PERIOD)
  },
}
