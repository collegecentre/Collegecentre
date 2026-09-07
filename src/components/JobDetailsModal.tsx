import React, { useState } from 'react'
import { JobWithMatch, useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  MapPin,
  Sparkles,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

interface JobDetailsModalProps {
  job: JobWithMatch | null
  onClose: () => void
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const {
    isPassActive,
    toggleSaveJob,
    isJobSaved,
    createOrUpdateApp,
    setIsPaymentModalOpen,
    applications,
  } = useApp()

  const [appliedPrompt, setAppliedPrompt] = useState<boolean>(false)

  if (!job) return null

  const saved = isJobSaved(job.id)
  const existingApp = applications.find((a) => a.job_id === job.id)

  const handleApply = () => {
    if (!isPassActive) {
      setIsPaymentModalOpen(true)
      return
    }

    createOrUpdateApp(job.id, 'Applied', `Applied via ${job.company} portal.`)
    setAppliedPrompt(true)
    window.open(job.application_url, '_blank', 'noopener,noreferrer')
  }

  const matchVariant =
    job.match.score >= 85 ? 'matchHigh' : job.match.score >= 70 ? 'matchMid' : 'matchNormal'

  return (
    <Dialog open={!!job} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl max-h-[88vh]">
        <DialogHeader className="text-left border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-border flex items-center justify-center text-2xl shrink-0 dark:from-slate-800 dark:to-indigo-950">
                {job.company_logo || '🏢'}
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
                  {job.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="font-bold text-foreground">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location} ({job.work_mode})
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-extrabold tabular-nums dark:text-emerald-400">
                    {job.salary}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                saved
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'border-border hover:bg-accent text-muted-foreground'
              }`}
              title={saved ? 'Remove from Saved' : 'Save Job'}
              aria-label={saved ? 'Remove job from saved' : 'Save job'}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-3 overflow-y-auto max-h-[60vh] pr-1">
          {/* AI Match Analysis Box */}
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-background to-emerald-50/50 p-4 sm:p-5 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-emerald-950/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-foreground">
                    CollegeCentre AI Match Score
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Matched against your college degree, batch & technical skills
                  </p>
                </div>
              </div>
              <Badge variant={matchVariant} className="text-sm font-black px-3.5 py-1">
                {job.match.score}% Match
              </Badge>
            </div>

            {/* Score Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Skills Match:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.skillsMatch}%
                  </span>
                </div>
                <Progress value={job.match.breakdown.skillsMatch} indicatorClassName="bg-indigo-600" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Education & Degree:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.educationMatch}%
                  </span>
                </div>
                <Progress
                  value={job.match.breakdown.educationMatch}
                  indicatorClassName="bg-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fresher Eligibility:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.fresherMatch}%
                  </span>
                </div>
                <Progress
                  value={job.match.breakdown.fresherMatch}
                  indicatorClassName="bg-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Location & Mode:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.locationMatch}%
                  </span>
                </div>
                <Progress
                  value={job.match.breakdown.locationMatch}
                  indicatorClassName="bg-blue-600"
                />
              </div>
            </div>

            {/* Match Reasons */}
            <div className="border-t border-border/70 pt-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Why this opportunity matches you:
              </span>
              <ul className="space-y-1.5 text-xs text-foreground/90">
                {job.match.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Job Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border bg-card space-y-0.5">
              <span className="text-[11px] text-muted-foreground">Experience</span>
              <p className="text-xs font-bold text-foreground">{job.experience}</p>
            </div>
            <div className="p-3 rounded-xl border bg-card space-y-0.5">
              <span className="text-[11px] text-muted-foreground">Education</span>
              <p className="text-xs font-bold text-foreground">{job.education}</p>
            </div>
            <div className="p-3 rounded-xl border bg-card space-y-0.5">
              <span className="text-[11px] text-muted-foreground">Work Mode</span>
              <p className="text-xs font-bold text-foreground">{job.work_mode}</p>
            </div>
            <div className="p-3 rounded-xl border bg-card space-y-0.5">
              <span className="text-[11px] text-muted-foreground">Source</span>
              <p className="text-xs font-bold text-foreground truncate">{job.source}</p>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              About the Position
            </h4>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/20 p-4 rounded-xl border">
              {job.description}
            </p>
          </div>

          {/* Tracker Status Banner */}
          {existingApp && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between dark:bg-emerald-950/40 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>Application Tracked:</strong> Current status is{' '}
                  <span className="font-bold underline">{existingApp.status}</span>
                </span>
              </div>
              <span className="text-[11px] text-emerald-700">
                Applied {new Date(existingApp.applied_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct employer application link</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSaveJob(job.id)}
              className="gap-1.5 text-xs h-10 px-4 font-semibold"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-indigo-600' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </Button>

            <Button
              variant="premium"
              size="sm"
              onClick={handleApply}
              className="flex-1 sm:flex-initial h-10 px-6 text-xs font-bold gap-1.5"
            >
              <span>Apply on Company Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
