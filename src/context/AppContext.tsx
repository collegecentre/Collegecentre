import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
import { AuthProvider, useAuth } from './AuthContext'
import { PassProvider, usePass, RemainingTime } from './PassContext'
import { JobsProvider, useJobs } from './JobsContext'
import { TrackerProvider, useTracker } from './TrackerContext'

export interface JobWithMatch extends Job {
  match: MatchResult
}

export type { RemainingTime }
export type ThemeMode = 'light' | 'dark' | 'system'

export interface AppContextType {
  student: StudentProfile
  updateStudent: (student: StudentProfile, customToast?: string | null) => void
  jobs: JobWithMatch[]
  savedJobs: SavedJob[]
  applications: Application[]
  payments: Payment[]
  accessPeriod: AccessPeriod | null
  isPassActive: boolean
  isPassScheduled: boolean
  scheduledStartTime?: string
  startSprintNow: () => void
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
  activatePass: (
    method?: 'UPI' | 'Card' | 'NetBanking',
    transactionId?: string,
    orderId?: string,
    scheduledFor?: string
  ) => void
  simulatePassExpiry: () => void
  simulateRemainingTime: (minutes: number) => void
  resetData: () => void
  signOut: () => Promise<void>
  isAuthenticated: boolean
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

interface ToastState {
  message: string
  type: 'success' | 'info' | 'warning'
}

/**
 * Inner Bridge Component:
 * Binds modularized contexts (Auth, Pass, Jobs, Tracker) together with UI state.
 */
const AppInnerComposer: React.FC<{
  children: React.ReactNode
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void
}> = ({ children, showToast }) => {
  const auth = useAuth()
  const pass = usePass()
  const jobs = useJobs()
  const tracker = useTracker()

  const [isPaymentModalOpen, setInternalIsPaymentModalOpen] = useState<boolean>(false)

  // Route / View state from URL Hash
  const getInitialView = (): string => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const route = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      const validViews = ['home', 'landing', 'search', 'saved', 'applications', 'dashboard', 'pricing', 'profile', 'login', 'signup', 'account']
      if (validViews.includes(route)) return route
    }
    return 'home'
  }

  const [currentView, setInternalCurrentView] = useState<string>(getInitialView)

  const setCurrentView = useCallback((view: string) => {
    setInternalCurrentView(view)
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${view}`
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setInternalIsPaymentModalOpen(false)
  }, [])

  const setIsPaymentModalOpen = useCallback(
    (open: boolean) => {
      if (open && !auth.isAuthenticated) {
        showToast('Please sign in or create an account to unlock your Sprint Pass.', 'info')
        setCurrentView('login')
        return
      }
      setInternalIsPaymentModalOpen(open)
    },
    [auth.isAuthenticated, setCurrentView, showToast]
  )

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      const validViews = ['home', 'landing', 'search', 'saved', 'applications', 'dashboard', 'pricing', 'profile', 'login', 'signup', 'account']
      if (validViews.includes(route)) {
        setInternalCurrentView(route)
        setInternalIsPaymentModalOpen(false)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Theme Management
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('cc_theme') as ThemeMode
    return saved || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      let isDark = false
      if (theme === 'system') {
        isDark = mediaQuery.matches
      } else {
        isDark = theme === 'dark'
      }

      if (isDark) {
        root.classList.add('dark')
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        setResolvedTheme('light')
      }
    }

    applyTheme()
    localStorage.setItem('cc_theme', theme)
    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const resetData = useCallback(() => {
    db.resetAllData()
    showToast('Data reset to defaults.', 'info')
  }, [showToast])

  const contextValue: AppContextType = {
    student: auth.student,
    updateStudent: auth.updateStudent,
    jobs: jobs.jobs,
    savedJobs: tracker.savedJobs,
    applications: tracker.applications,
    payments: pass.payments,
    accessPeriod: pass.accessPeriod,
    isPassActive: pass.isPassActive,
    isPassScheduled: pass.isPassScheduled,
    scheduledStartTime: pass.scheduledStartTime,
    startSprintNow: pass.startSprintNow,
    remainingTime: pass.remainingTime,
    currentView,
    setCurrentView,
    selectedJob: jobs.selectedJob,
    setSelectedJob: jobs.setSelectedJob,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    toggleSaveJob: tracker.toggleSaveJob,
    isJobSaved: tracker.isJobSaved,
    createOrUpdateApp: tracker.createOrUpdateApp,
    changeAppStatus: tracker.changeAppStatus,
    deleteApp: tracker.deleteApp,
    activatePass: pass.activatePass,
    simulatePassExpiry: pass.simulatePassExpiry,
    simulateRemainingTime: pass.simulateRemainingTime,
    resetData,
    signOut: async () => {
      await auth.signOut()
      setCurrentView('home')
    },
    isAuthenticated: auth.isAuthenticated,
    showToast,
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

/**
 * Connects Auth state reactively to downstream domain providers.
 * Whenever student logs in or logs out, child providers receive the live student identity.
 */
const DataProvidersBridge: React.FC<{
  children: React.ReactNode
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void
}> = ({ children, showToast }) => {
  const { student } = useAuth()
  const isPassActive = db.isPassActive(student.id)

  return (
    <PassProvider studentId={student.id} showToast={showToast}>
      <JobsProvider student={student} isPassActive={isPassActive}>
        <TrackerProvider studentId={student.id} showToast={showToast}>
          <AppInnerComposer showToast={showToast}>{children}</AppInnerComposer>
        </TrackerProvider>
      </JobsProvider>
    </PassProvider>
  )
}

/**
 * Root AppProvider:
 * Composes domain providers in correct dependency order.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastInfo, setToastInfo] = useState<ToastState | null>(null)

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
      setToastInfo({ message, type })
      setTimeout(() => {
        setToastInfo((current) => (current?.message === message ? null : current))
      }, 4000)
    },
    []
  )

  return (
    <AuthProvider showToast={showToast}>
      <DataProvidersBridge showToast={showToast}>
        {children}

        {/* Floating Toast Notification */}
        {toastInfo && (
          <div className="fixed bottom-16 sm:bottom-6 right-4 left-4 sm:left-auto z-50 animate-in slide-in-from-bottom-5 duration-200 max-w-sm sm:max-w-md mx-auto sm:mx-0">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-xs sm:text-sm font-mono font-medium ${
                toastInfo.type === 'success'
                  ? 'bg-emerald-950 text-emerald-100 border-emerald-600'
                  : toastInfo.type === 'warning'
                  ? 'bg-amber-950 text-amber-100 border-amber-600'
                  : 'bg-slate-950 text-slate-100 border-slate-700'
              }`}
            >
              <span>{toastInfo.message}</span>
            </div>
          </div>
        )}
      </DataProvidersBridge>
    </AuthProvider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
