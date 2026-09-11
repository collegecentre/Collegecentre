import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { Job, StudentProfile } from '@/types'
import { db } from '@/services/db'
import { supabase } from '@/services/supabase'
import { calculateJobMatch } from '@/services/matching'
import { JobWithMatch } from './AppContext'

interface JobsContextType {
  jobs: JobWithMatch[]
  selectedJob: JobWithMatch | null
  setSelectedJob: (job: JobWithMatch | null) => void
  isLoadingJobs: boolean
  refetchJobs: () => Promise<void>
}

const JobsContext = createContext<JobsContextType | null>(null)

export const JobsProvider: React.FC<{
  children: React.ReactNode
  student: StudentProfile
  isPassActive: boolean
}> = ({ children, student, isPassActive }) => {
  const [jobsRaw, setJobsRaw] = useState<Job[]>(() => db.getJobs())
  const [selectedJob, setSelectedJob] = useState<JobWithMatch | null>(null)
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false)

  // Fetch protected jobs from server endpoint
  const refetchJobs = useCallback(async () => {
    setIsLoadingJobs(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch('/api/jobs', { headers })
      if (res.ok) {
        const payload = await res.json()
        if (payload.jobs && payload.jobs.length > 0) {
          setJobsRaw(payload.jobs)
          return
        }
      }
    } catch (err) {
      console.warn('Server protected jobs fetch warning, falling back to local database:', err)
    } finally {
      setIsLoadingJobs(false)
    }

    // Fallback if server endpoint is not reached
    const cloudJobs = await db.fetchCloudJobs()
    if (cloudJobs && cloudJobs.length > 0) {
      setJobsRaw(cloudJobs)
    }
  }, [])

  // Refetch jobs whenever pass status changes (e.g. user just activated pass)
  useEffect(() => {
    refetchJobs()
  }, [isPassActive, refetchJobs])

  // Compute criteria matches for every job against the verified candidate profile
  const jobs = useMemo((): JobWithMatch[] => {
    const list: JobWithMatch[] = jobsRaw.map((job) => ({
      ...job,
      match: calculateJobMatch(student, job),
    }))

    // Sort primarily by match score descending
    return list.sort((a, b) => b.match.score - a.match.score)
  }, [jobsRaw, student])

  return (
    <JobsContext.Provider
      value={{
        jobs,
        selectedJob,
        setSelectedJob,
        isLoadingJobs,
        refetchJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = (): JobsContextType => {
  const ctx = useContext(JobsContext)
  if (!ctx) throw new Error('useJobs must be used within a JobsProvider')
  return ctx
}
