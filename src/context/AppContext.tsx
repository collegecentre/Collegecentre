import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  AccessPeriod,
  Application,
  ApplicationStatus,
  Job,
  MatchResult,
  Payment,
  SavedJob,
  StudentProfile,
} from '@/types'
import { db } from '@/services/db'
import { calculateJobMatch } from '@/services/matching'
import confetti from 'canvas-confetti'

export interface JobWithMatch extends Job {
  match: MatchResult
}

export interface RemainingTime {
  totalSeconds: number
  hours: number
  minutes: number
  seconds: number
  formatted: string
  isExpired: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'

interface AppContextType {
  student: StudentProfile
  updateStudent: (student: StudentProfile) => void
  jobs: JobWithMatch[]
  savedJobs: SavedJob[]
  applications: Application[]
  payments: Payment[]
  accessPeriod: AccessPeriod | null
  isPassActive: boolean
  remainingTime: RemainingTime
  currentView: string
  setCurrentView: (view: string) => void
  selectedJob: JobWithMatch | null
  setSelectedJob: (job: JobWithMatch | null) => void
  isPaymentModalOpen: boolean
  setIsPaymentModalOpen: (open: boolean) => void
  toggleSaveJob: (jobId: string) => void
  isJobSaved: (jobId: string) => boolean
  createOrUpdateApp: (jobId: string, status: ApplicationStatus, notes?: string) => void
  changeAppStatus: (appId: string, status: ApplicationStatus, notes?: string) => void
  deleteApp: (appId: string) => void
  activatePass: (method?: 'UPI' | 'Card' | 'NetBanking') => void
  simulatePassExpiry: () => void
  simulateRemainingTime: (minutes: number) => void
  resetData: () => void
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile>(() => db.getStudent())
  const [jobsRaw, setJobsRaw] = useState<Job[]>(() => db.getJobs())

  // Fetch live active fresher openings from Supabase cloud database
  useEffect(() => {
    let isMounted = true
    db.fetchCloudJobs().then((cloudJobs) => {
      if (isMounted && cloudJobs && cloudJobs.length > 0) {
        setJobsRaw(cloudJobs)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(() => db.getSavedJobs())
  const [applications, setApplications] = useState<Application[]>(() => db.getApplications())
  const [payments, setPayments] = useState<Payment[]>(() => db.getPayments())
  const [accessPeriod, setAccessPeriod] = useState<AccessPeriod | null>(() => db.getAccessPeriod())
  const getInitialView = (): string => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const route = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      const validViews = [
        'landing',
        'pricing',
        'dashboard',
        'jobs',
        'saved',
        'applications',
        'profile',
        'account',
        'login',
        'signup',
      ]
      if (validViews.includes(route)) return route
    }
    return 'landing'
  }

  const [currentView, setCurrentViewState] = useState<string>(getInitialView)

  const setCurrentView = useCallback((view: string) => {
    setCurrentViewState(view)
    if (typeof window !== 'undefined') {
      const targetHash = `#/${view}`
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash
      }
    }
  }, [])

  // Sync with browser back/forward and external hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      const validViews = [
        'landing',
        'pricing',
        'dashboard',
        'jobs',
        'saved',
        'applications',
        'profile',
        'account',
        'login',
        'signup',
      ]
      if (validViews.includes(route)) {
        setCurrentViewState(route)
      } else if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
        setCurrentViewState('landing')
      }
    }

    if (!window.location.hash) {
      window.location.hash = '#/landing'
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const [selectedJob, setSelectedJob] = useState<JobWithMatch | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false)

  // Theme state & dark mode persistence
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('collegecentre-theme') as ThemeMode
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    }
    return 'system'
  })

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'system') {
      return systemIsDark ? 'dark' : 'light'
    }
    return theme
  }, [theme, systemIsDark])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Toast state
  const [toastInfo, setToastInfo] = useState<{ message: string; type: string } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastInfo({ message, type })
    setTimeout(() => {
      setToastInfo((current) => (current?.message === message ? null : current))
    }, 4000)
  }, [])

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('collegecentre-theme', newTheme)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    showToast(`Switched to ${nextTheme.toUpperCase()} mode`, 'info')
  }, [resolvedTheme, setTheme, showToast])

  // Calculate live countdown timer
  const [remainingTime, setRemainingTime] = useState<RemainingTime>(() => {
    return calculateTimeRemaining(accessPeriod)
  })

  function calculateTimeRemaining(period: AccessPeriod | null): RemainingTime {
    if (!period || period.status !== 'active') {
      return { totalSeconds: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Expired', isExpired: true }
    }
    const expiresAt = new Date(period.expires_at).getTime()
    const now = Date.now()
    const diffMs = expiresAt - now

    if (diffMs <= 0) {
      return { totalSeconds: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Expired', isExpired: true }
    }

    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const formatted = `${hours}h ${minutes}m ${seconds}s remaining`
    return { totalSeconds, hours, minutes, seconds, formatted, isExpired: false }
  }

  // Interval timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      const currentPeriod = db.getAccessPeriod()
      setAccessPeriod(currentPeriod)
      const calculated = calculateTimeRemaining(currentPeriod)
      setRemainingTime(calculated)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isPassActive = useMemo(() => {
    return !remainingTime.isExpired && accessPeriod?.status === 'active'
  }, [remainingTime.isExpired, accessPeriod])

  // Attach match score and sort by relevance
  const jobs: JobWithMatch[] = useMemo(() => {
    const list = jobsRaw.map((job) => ({
      ...job,
      match: calculateJobMatch(student, job),
    }))
    // Sort primarily by match score descending
    return list.sort((a, b) => b.match.score - a.match.score)
  }, [jobsRaw, student])

  const updateStudent = useCallback((updated: StudentProfile) => {
    db.saveStudent(updated)
    setStudent(updated)
    showToast('Profile updated successfully! Match scores recalculated.', 'success')
  }, [showToast])

  const toggleSaveJob = useCallback((jobId: string) => {
    const isSavedNow = db.toggleSaveJob(jobId)
    setSavedJobs(db.getSavedJobs())
    showToast(isSavedNow ? 'Job saved to your permanent list!' : 'Job removed from saved list', 'info')
  }, [showToast])

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some((s) => s.job_id === jobId)
  }, [savedJobs])

  const createOrUpdateApp = useCallback(
    (jobId: string, status: ApplicationStatus, notes?: string) => {
      db.createOrUpdateApplication(jobId, status, notes)
      setApplications(db.getApplications())
      showToast(`Application updated: ${status}`, 'success')
    },
    [showToast]
  )

  const changeAppStatus = useCallback(
    (appId: string, status: ApplicationStatus, notes?: string) => {
      db.updateApplicationStatus(appId, status, notes)
      setApplications(db.getApplications())
      showToast(`Status moved to ${status}`, 'info')
    },
    [showToast]
  )

  const deleteApp = useCallback((appId: string) => {
    db.deleteApplication(appId)
    setApplications(db.getApplications())
    showToast('Application record removed', 'info')
  }, [showToast])

  const activatePass = useCallback(
    (method: 'UPI' | 'Card' | 'NetBanking' = 'UPI') => {
      const result = db.activatePass(student.id, method)
      setAccessPeriod(result.accessPeriod)
      setPayments(db.getPayments())
      setIsPaymentModalOpen(false)

      // Confetti burst for excitement!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
      })

      showToast('🎉 ₹199 Pass Activated! 24-Hour Job Hunt unlocked.', 'success')
      // Switch view to dashboard or job search
      setCurrentView('dashboard')
    },
    [student.id, showToast]
  )

  const simulatePassExpiry = useCallback(() => {
    db.simulateExpirePass(student.id)
    const period = db.getAccessPeriod()
    setAccessPeriod(period)
    setRemainingTime(calculateTimeRemaining(period))
    showToast('Simulation: Pass has been expired.', 'warning')
  }, [student.id, showToast])

  const simulateRemainingTime = useCallback(
    (minutes: number) => {
      db.setPassRemainingMinutes(minutes, student.id)
      const period = db.getAccessPeriod()
      setAccessPeriod(period)
      setRemainingTime(calculateTimeRemaining(period))
      showToast(`Simulation: Pass remaining time set to ${minutes} minutes.`, 'info')
    },
    [student.id, showToast]
  )

  const resetData = useCallback(() => {
    db.resetAllData()
    setStudent(db.getStudent())
    setJobsRaw(db.getJobs())
    setSavedJobs(db.getSavedJobs())
    setApplications(db.getApplications())
    setPayments(db.getPayments())
    setAccessPeriod(db.getAccessPeriod())
    showToast('Data reset to default demo values.', 'info')
  }, [showToast])

  return (
    <AppContext.Provider
      value={{
        student,
        updateStudent,
        jobs,
        savedJobs,
        applications,
        payments,
        accessPeriod,
        isPassActive,
        remainingTime,
        currentView,
        setCurrentView,
        selectedJob,
        setSelectedJob,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        toggleSaveJob,
        isJobSaved,
        createOrUpdateApp,
        changeAppStatus,
        deleteApp,
        activatePass,
        simulatePassExpiry,
        simulateRemainingTime,
        resetData,
        showToast,
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastInfo && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toastInfo.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : toastInfo.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <span>{toastInfo.message}</span>
          </div>
        </div>
      )}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
