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
  id: 'student_101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu.in',
  phone: '+91 98765 43210',
  education_level: 'Undergraduate (B.Tech / B.E.)',
  degree: 'Computer Science & Engineering',
  college: 'National Institute of Technology, Surathkal',
  graduation_year: 2026,
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'Tailwind CSS'],
  experience_level: 'Fresher (0–1 years)',
  preferred_categories: ['Software Development', 'Frontend Development', 'Full Stack', 'Data & AI'],
  preferred_locations: ['Bengaluru', 'Remote', 'Hyderabad', 'Pune'],
  preferred_work_mode: ['Remote', 'Hybrid'],
}

export const SEED_JOBS: Job[] = [
  {
    id: 'job_01',
    title: 'Junior Software Developer',
    company: 'TechNova Solutions',
    company_logo: '💻',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹4–6 LPA',
    experience: '0–1 years',
    education: 'B.Tech / BCA / B.Sc (CS/IT)',
    skills: ['JavaScript', 'React', 'SQL', 'Git', 'REST APIs'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    deadline: 'In 14 days',
    description:
      'TechNova is hiring Junior Software Developers for our core web engineering team. You will build user-facing features, integrate GraphQL & REST APIs, and write modular React components. Fast-tracked mentorship program for freshers.',
    fresher_eligibility: true,
    application_url: 'https://technova.example.com/careers/junior-dev-2026',
    source: 'TechNova Direct Campus Hire',
  },
  {
    id: 'job_02',
    title: 'Frontend Engineer Trainee',
    company: 'CloudScale Technologies',
    company_logo: '☁️',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    salary: '₹5–7 LPA',
    experience: 'Fresher',
    education: 'B.Tech / MCA',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    deadline: 'In 10 days',
    description:
      'Join our Design Systems & Frontend team! Build lightning-fast UI components with Tailwind and React. High exposure to production workflows and automated testing.',
    fresher_eligibility: true,
    application_url: 'https://cloudscale.example.com/jobs/frontend-trainee',
    source: 'Verified Employer Partner',
  },
  {
    id: 'job_03',
    title: 'Associate Data Analyst',
    company: 'FinPulse Analytics',
    company_logo: '📈',
    location: 'Hyderabad / Remote',
    work_mode: 'Remote',
    salary: '₹4.5–6.5 LPA',
    experience: '0–1 years',
    education: 'Any Engineering / Mathematics / BCA',
    skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Data Cleaning'],
    category: 'Data & AI',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    deadline: 'In 18 days',
    description:
      'Work alongside senior quantitative analysts translating raw market transactions into actionable dashboards. Excellent stepping stone for budding data analysts and data engineers.',
    fresher_eligibility: true,
    application_url: 'https://finpulse.example.com/openings/data-analyst',
    source: 'FinPulse Careers',
  },
  {
    id: 'job_04',
    title: 'Full Stack Developer Intern',
    company: 'NextGen SaaS Labs',
    company_logo: '🚀',
    location: 'Remote',
    work_mode: 'Remote',
    salary: '₹30,000 / month Stipend (PPO: ₹7–9 LPA)',
    experience: 'Fresher / Pre-final Year',
    education: 'B.Tech / BE (Graduating 2025/2026)',
    skills: ['Node.js', 'React', 'MongoDB', 'JavaScript'],
    category: 'Software Development',
    job_type: 'Internship',
    posted_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    deadline: 'In 7 days',
    description:
      '6-month paid internship with guaranteed Pre-Placement Offer (PPO) conversion based on performance. Work directly under the CTO building modern microservices.',
    fresher_eligibility: true,
    application_url: 'https://nextgensslabs.example.com/internships/fullstack',
    source: 'Startup Incubator Partner',
  },
  {
    id: 'job_05',
    title: 'QA Automation Trainee',
    company: 'TestForge Systems',
    company_logo: '🛡️',
    location: 'Pune',
    work_mode: 'Hybrid',
    salary: '₹3.8–5 LPA',
    experience: 'Fresher',
    education: 'B.Tech / B.Sc IT / BCA',
    skills: ['Python', 'Selenium', 'SQL', 'Git', 'API Testing'],
    category: 'QA / Testing',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    deadline: 'In 20 days',
    description:
      'Kickstart your career in Quality Assurance and automated testing pipelines. You will write automated end-to-end browser tests using Selenium and Cypress with Python.',
    fresher_eligibility: true,
    application_url: 'https://testforge.example.com/careers/qa-trainee',
    source: 'TestForge Direct',
  },
  {
    id: 'job_06',
    title: 'Junior Python Backend Engineer',
    company: 'DataMatrix Corp',
    company_logo: '⚡',
    location: 'Bengaluru / Hyderabad',
    work_mode: 'Hybrid',
    salary: '₹5.5–8 LPA',
    experience: '0–1 years',
    education: 'B.Tech CS / IT / Electronics',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    deadline: 'In 12 days',
    description:
      'Develop robust asynchronous APIs using FastAPI and PostgreSQL. Great environment for freshers keen on high-performance backend systems and cloud infrastructure.',
    fresher_eligibility: true,
    application_url: 'https://datamatrix.example.com/jobs/python-backend',
    source: 'Campus Placement Partner',
  },
  {
    id: 'job_07',
    title: 'Associate UI/UX Designer',
    company: 'PixelCraft Studio',
    company_logo: '🎨',
    location: 'Remote',
    work_mode: 'Remote',
    salary: '₹4–6 LPA',
    experience: 'Fresher / Portfolio required',
    education: 'Any Degree / Design Diploma',
    skills: ['Figma', 'Wireframing', 'UI Design', 'Design Systems', 'HTML/CSS'],
    category: 'UI/UX Design',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    deadline: 'In 15 days',
    description:
      'Passionate about crafting intuitive student and consumer experiences? Join PixelCraft to design wireframes, responsive UI prototypes, and clean mobile interfaces.',
    fresher_eligibility: true,
    application_url: 'https://pixelcraft.example.com/join/associate-designer',
    source: 'Design Guild India',
  },
  {
    id: 'job_08',
    title: 'Graduate Engineer Trainee (GET) - Cloud',
    company: 'Apex Cloud Solutions',
    company_logo: '🌐',
    location: 'Chennai / Hyderabad',
    work_mode: 'Onsite',
    salary: '₹4.2–5.5 LPA',
    experience: 'Fresher',
    education: 'B.Tech / B.E (All branches)',
    skills: ['Linux', 'Python', 'Networking', 'AWS Basics', 'Git'],
    category: 'Software Development',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    deadline: 'In 25 days',
    description:
      'Structured 12-month training with real cloud workloads. Learn AWS, Linux system administration, shell scripting, and container deployment.',
    fresher_eligibility: true,
    application_url: 'https://apexcloud.example.com/careers/get-2026',
    source: 'Apex Cloud Placement Program',
  },
  {
    id: 'job_09',
    title: 'Junior AI / ML Research Associate',
    company: 'NeuralBytes AI Labs',
    company_logo: '🧠',
    location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    salary: '₹6–9 LPA',
    experience: '0–1 years',
    education: 'B.Tech / M.Tech / B.Sc Stats',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'NLP', 'SQL'],
    category: 'Data & AI',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    deadline: 'In 9 days',
    description:
      'Work on LLM fine-tuning, retrieval-augmented generation (RAG) pipelines, and evaluation metrics for enterprise clients. Strong Python fundamentals required.',
    fresher_eligibility: true,
    application_url: 'https://neuralbytes.example.com/research/junior-ml',
    source: 'AI Founders Network',
  },
  {
    id: 'job_10',
    title: 'Associate Product Operations',
    company: 'ZetaFlow Commerce',
    company_logo: '📦',
    location: 'Gurugram / Hybrid',
    work_mode: 'Hybrid',
    salary: '₹4–5.5 LPA',
    experience: 'Fresher',
    education: 'Any Graduate / BBA / B.Tech',
    skills: ['Excel', 'SQL Basics', 'Communication', 'Problem Solving', 'Data Analysis'],
    category: 'Product & Operations',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    deadline: 'In 16 days',
    description:
      'Coordinate between engineering and customer success teams to resolve workflow bottlenecks and track product analytics metrics.',
    fresher_eligibility: true,
    application_url: 'https://zetaflow.example.com/careers/product-ops',
    source: 'ZetaFlow Hiring Hub',
  },
  {
    id: 'job_11',
    title: 'React Native Mobile Developer Intern',
    company: 'SwiftApp Studio',
    company_logo: '📱',
    location: 'Remote',
    work_mode: 'Remote',
    salary: '₹25,000 / month',
    experience: 'Fresher / College Student',
    education: 'BCA / B.Tech / MCA',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile UI'],
    category: 'Software Development',
    job_type: 'Internship',
    posted_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    deadline: 'In 11 days',
    description:
      'Build cross-platform mobile apps using React Native and Expo. You will work on animations, local SQLite storage, and push notifications.',
    fresher_eligibility: true,
    application_url: 'https://swiftapp.example.com/intern/react-native',
    source: 'Mobile Dev Collective',
  },
  {
    id: 'job_12',
    title: 'Junior Cyber Security Analyst',
    company: 'DefendShield Cyber',
    company_logo: '🔒',
    location: 'Hyderabad',
    work_mode: 'Onsite',
    salary: '₹4.5–6 LPA',
    experience: '0–1 years',
    education: 'B.Tech CSE / IT / BCA',
    skills: ['Networking', 'Linux', 'Vulnerability Assessment', 'Python', 'Wireshark'],
    category: 'Security & Infrastructure',
    job_type: 'Full-time',
    posted_at: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    deadline: 'In 22 days',
    description:
      'Monitor Security Operations Center (SOC) incidents, analyze packet captures, and participate in scheduled penetration test drills.',
    fresher_eligibility: true,
    application_url: 'https://defendshield.example.com/careers/junior-analyst',
    source: 'DefendShield Careers',
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
    this.saveStudent(INITIAL_STUDENT)
    return INITIAL_STUDENT
  },

  saveStudent(student: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student))
    this.saveStudentToCloud(student)
  },

  async saveStudentToCloud(student: StudentProfile): Promise<void> {
    try {
      await supabase.from('cc_student_profiles').upsert(
        {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          education_level: student.education_level,
          degree: student.degree,
          college: student.college,
          graduation_year: student.graduation_year,
          skills: student.skills,
          experience_level: student.experience_level,
          preferred_categories: student.preferred_categories,
          preferred_locations: student.preferred_locations,
          preferred_work_mode: student.preferred_work_mode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    } catch (err) {
      console.warn('Supabase student sync warning', err)
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
  getAccessPeriod(studentId: string = 'student_101'): AccessPeriod | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCESS_PERIOD)
      if (data) {
        const period: AccessPeriod = JSON.parse(data)
        if (period.student_id === studentId) {
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

  isPassActive(studentId: string = 'student_101'): boolean {
    const period = this.getAccessPeriod(studentId)
    if (!period) return false
    const now = Date.now()
    const expiresAt = new Date(period.expires_at).getTime()
    return period.status === 'active' && now < expiresAt
  },

  activatePass(
    studentId: string = 'student_101',
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' = 'UPI'
  ): { payment: Payment; accessPeriod: AccessPeriod } {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Exactly +24 hours

    const payment: Payment = {
      id: `pay_${Date.now()}`,
      student_id: studentId,
      amount: 199,
      status: 'Success',
      payment_method: paymentMethod,
      transaction_id: `TXN_CC_${Math.floor(100000000 + Math.random() * 900000000)}`,
      created_at: now.toISOString(),
    }

    const accessPeriod: AccessPeriod = {
      id: `access_${Date.now()}`,
      student_id: studentId,
      payment_id: payment.id,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'active',
    }

    // Save payment
    const payments = this.getPayments(studentId)
    payments.unshift(payment)
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))

    // Save access period
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERIOD, JSON.stringify(accessPeriod))

    this.syncPassToCloud(payment, accessPeriod)

    return { payment, accessPeriod }
  },

  async syncPassToCloud(payment: Payment, period: AccessPeriod): Promise<void> {
    try {
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
          student_email: 'student@college.edu.in',
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
  simulateExpirePass(studentId: string = 'student_101'): void {
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
  setPassRemainingMinutes(minutes: number, studentId: string = 'student_101'): void {
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
  getPayments(studentId: string = 'student_101'): Payment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS)
      if (data) {
        const list: Payment[] = JSON.parse(data)
        return list.filter((p) => p.student_id === studentId)
      }
    } catch {
      // ignore
    }
    return []
  },

  // Saved Jobs (PERMANENT - never deleted or locked on expiry)
  getSavedJobs(studentId: string = 'student_101'): SavedJob[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)
      if (data) {
        const list: SavedJob[] = JSON.parse(data)
        return list.filter((s) => s.student_id === studentId)
      }
    } catch {
      // ignore
    }
    // Preseed 2 saved jobs for great initial demo
    const defaultSaved: SavedJob[] = [
      {
        id: 'save_1',
        student_id: studentId,
        job_id: 'job_01',
        created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        notes: 'Priority application! Match looks great for junior React role.',
      },
      {
        id: 'save_2',
        student_id: studentId,
        job_id: 'job_04',
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        notes: 'Great stipend with PPO opportunity.',
      },
    ]
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(defaultSaved))
    return defaultSaved
  },

  isJobSaved(jobId: string, studentId: string = 'student_101'): boolean {
    const list = this.getSavedJobs(studentId)
    return list.some((s) => s.job_id === jobId)
  },

  toggleSaveJob(jobId: string, studentId: string = 'student_101'): boolean {
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

  removeSavedJob(jobId: string, studentId: string = 'student_101'): void {
    const list = this.getSavedJobs(studentId).filter((s) => s.job_id !== jobId)
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list))
  },

  // Applications Tracker (PERMANENT - never deleted or locked on expiry)
  getApplications(studentId: string = 'student_101'): Application[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS)
      if (data) {
        const list: Application[] = JSON.parse(data)
        return list.filter((a) => a.student_id === studentId)
      }
    } catch {
      // ignore
    }
    // Preseed initial realistic applications
    const defaultApps: Application[] = [
      {
        id: 'app_1',
        student_id: studentId,
        job_id: 'job_02',
        status: 'Shortlisted',
        applied_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        notes: 'Round 1 technical phone screen scheduled for Friday 2 PM.',
        updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        follow_up_date: 'Tomorrow, 2:00 PM',
      },
      {
        id: 'app_2',
        student_id: studentId,
        job_id: 'job_03',
        status: 'Assessment',
        applied_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        notes: 'Completed HackerRank Python & SQL test on Sept 6. Awaiting results.',
        updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'app_3',
        student_id: studentId,
        job_id: 'job_06',
        status: 'Applied',
        applied_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        notes: 'Applied on company portal with verified student profile.',
        updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(defaultApps))
    return defaultApps
  },

  getApplicationByJobId(jobId: string, studentId: string = 'student_101'): Application | undefined {
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
    studentId: string = 'student_101'
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
    studentId: string = 'student_101'
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

  deleteApplication(applicationId: string, studentId: string = 'student_101'): void {
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
