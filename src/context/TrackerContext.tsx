import React, { createContext, useContext, useState, useCallback } from 'react'
import { Application, ApplicationStatus, SavedJob } from '@/types'
import { db } from '@/services/db'

interface TrackerContextType {
  savedJobs: SavedJob[]
  applications: Application[]
  toggleSaveJob: (jobId: string) => void
  isJobSaved: (jobId: string) => boolean
  createOrUpdateApp: (jobId: string, status: ApplicationStatus, notes?: string) => void
  changeAppStatus: (appId: string, status: ApplicationStatus, notes?: string) => void
  deleteApp: (appId: string) => void
}

const TrackerContext = createContext<TrackerContextType | null>(null)

export const TrackerProvider: React.FC<{
  children: React.ReactNode
  studentId: string
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void
}> = ({ children, studentId, showToast }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(() => db.getSavedJobs(studentId))
  const [applications, setApplications] = useState<Application[]>(() => db.getApplications(studentId))

  const toggleSaveJob = useCallback(
    (jobId: string) => {
      const isSavedNow = db.toggleSaveJob(jobId, studentId)
      setSavedJobs(db.getSavedJobs(studentId))
      showToast(isSavedNow ? 'Job saved to your permanent desk!' : 'Job removed from saved list', 'info')
    },
    [showToast, studentId]
  )

  const isJobSaved = useCallback(
    (jobId: string) => {
      return savedJobs.some((s) => s.job_id === jobId)
    },
    [savedJobs]
  )

  const createOrUpdateApp = useCallback(
    (jobId: string, status: ApplicationStatus, notes?: string) => {
      db.createOrUpdateApplication(jobId, status, notes, studentId)
      setApplications(db.getApplications(studentId))
      showToast(`Application updated: ${status}`, 'success')
    },
    [showToast, studentId]
  )

  const changeAppStatus = useCallback(
    (appId: string, status: ApplicationStatus, notes?: string) => {
      db.updateApplicationStatus(appId, status, notes, studentId)
      setApplications(db.getApplications(studentId))
      showToast(`Status updated to ${status}`, 'info')
    },
    [showToast, studentId]
  )

  const deleteApp = useCallback(
    (appId: string) => {
      db.deleteApplication(appId, studentId)
      setApplications(db.getApplications(studentId))
      showToast('Application record removed', 'info')
    },
    [showToast, studentId]
  )

  return (
    <TrackerContext.Provider
      value={{
        savedJobs,
        applications,
        toggleSaveJob,
        isJobSaved,
        createOrUpdateApp,
        changeAppStatus,
        deleteApp,
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}

export const useTracker = (): TrackerContextType => {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within a TrackerProvider')
  return ctx
}
