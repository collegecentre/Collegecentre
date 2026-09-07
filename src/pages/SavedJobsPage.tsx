import React from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Bookmark,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Trash2,
  Lock,
} from 'lucide-react'

interface SavedJobsPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const SavedJobsPage: React.FC<SavedJobsPageProps> = ({ onSelectJob }) => {
  const {
    savedJobs,
    jobs,
    toggleSaveJob,
    setCurrentView,
    isPassActive,
    setIsPaymentModalOpen,
  } = useApp()

  // Match saved jobs with their full job entity and score
  const savedJobList: JobWithMatch[] = savedJobs
    .map((saved) => jobs.find((j) => j.id === saved.job_id))
    .filter((j): j is JobWithMatch => !!j)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Saved Jobs</h1>
            <Badge variant="matchMid" className="text-xs">
              {savedJobList.length} Saved
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your saved jobs belong permanently to your student account.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('jobs')}
          className="text-xs gap-1.5 h-9"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Discover More Jobs</span>
        </Button>
      </div>

      {/* Permanent Data Guarantee Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:bg-emerald-950/30 dark:border-emerald-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
            Permanent Access Guarantee
          </h4>
          <p className="text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
            Even when your ₹199 / 24-hour pass expires, all saved jobs remain in your account forever. You can open role details, apply to them, or manage your notes at any time without paying again.
          </p>
        </div>
      </div>

      {/* Saved Jobs List */}
      {savedJobList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed bg-muted/20 space-y-3">
          <Bookmark className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-foreground">No saved jobs yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When you browse opportunities, select the bookmark icon on any card to save it permanently for later review.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentView(isPassActive ? 'jobs' : 'dashboard')}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isPassActive ? 'Browse Jobs Now' : 'Go to Dashboard'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobList.map((job) => (
            <div key={job.id} className="relative group">
              <JobCard job={job} onSelect={onSelectJob} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
