import React from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  Bookmark,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

interface SavedJobsPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({ onSelectJob }) => {
  const {
    savedJobs,
    jobs,
    setCurrentView,
    isPassActive,
  } = useApp()

  // Match saved jobs with their full job entity and score
  const savedJobList: JobWithMatch[] = savedJobs
    .map((saved) => jobs.find((j) => j.id === saved.job_id))
    .filter((j): j is JobWithMatch => !!j)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Permanent Archive • Saved Jobs
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Saved Positions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Roles preserved permanently under your student profile. Zero expiration on bookmarked jobs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-3 py-1.5 border border-black/10 dark:border-white/15 bg-muted/20 text-foreground">
              {savedJobList.length} Saved Roles
            </span>
            <button
              onClick={() => setCurrentView(isPassActive ? 'jobs' : 'pricing')}
              className="px-4 py-1.5 border border-black dark:border-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/40 transition-colors"
            >
              + Discover More
            </button>
          </div>
        </div>
      </div>

      {/* Rule 11 Permanent Access Notice */}
      <div className="border border-black/10 dark:border-white/15 p-4 sm:p-5 bg-muted/10 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Rule 11: Permanent Student Access Guarantee
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All positions saved during your ₹199 / 24-hour pass stay unlocked forever. You can return at any time, review details, check AI match insights, and apply directly without purchasing another sprint pass.
          </p>
        </div>
      </div>

      {/* Saved Jobs List */}
      {savedJobList.length === 0 ? (
        <div className="p-16 text-center border border-black/10 dark:border-white/15 bg-muted/10 space-y-4">
          <div className="w-12 h-12 border border-black/15 dark:border-white/20 mx-auto flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              NO BOOKMARKED POSITIONS FOUND
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Save opportunities while browsing the live database to preserve them here permanently.
            </p>
          </div>
          <button
            onClick={() => setCurrentView(isPassActive ? 'jobs' : 'pricing')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            <span>{isPassActive ? 'BROWSE OPPORTUNITIES' : 'ACTIVATE 24H PASS (₹199)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15">
          {savedJobList.map((job) => (
            <div key={job.id} className="bg-background">
              <JobCard job={job} onSelect={onSelectJob} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
