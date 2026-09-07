import React, { useState } from 'react'
import { JobWithMatch, useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  MapPin,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Check,
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

  const [, setAppliedPrompt] = useState<boolean>(false)

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

  return (
    <Dialog open={!!job} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl max-h-[90vh] p-0 overflow-hidden border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3 bg-muted/20 flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground uppercase tracking-widest">
            [ROLE_SPEC // JOB_{job.id.padStart(4, '0')}]
          </span>
          <span className="font-bold text-vermilion uppercase tracking-wider">
            [MATCH: {job.match.score}%]
          </span>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          <DialogHeader className="text-left space-y-2 border-b border-black/10 dark:border-white/15 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {job.title}
                </DialogTitle>
                <div className="font-mono text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{job.company}</span>
                  <span>//</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location} ({job.work_mode})
                  </span>
                  <span>//</span>
                  <span className="text-vermilion font-bold">{job.salary}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleSaveJob(job.id)}
                className={`px-3 py-2 border font-mono text-xs transition-colors shrink-0 ${
                  saved
                    ? 'border-black dark:border-white bg-foreground text-background font-bold'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground'
                }`}
                title={saved ? 'Remove from Saved' : 'Save Job'}
                aria-label={saved ? 'Remove job from saved' : 'Save job'}
              >
                <span className="flex items-center gap-1.5">
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                  <span>{saved ? '[SAVED]' : '[+SAVE]'}</span>
                </span>
              </button>
            </div>
          </DialogHeader>

          {/* AI Match Analysis Box */}
          <div className="border border-black/10 dark:border-white/15 p-5 bg-muted/10 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                01 // AI COMPATIBILITY MATRIX
              </span>
              <span className="font-mono text-xs font-bold text-vermilion">
                OVERALL: {job.match.score}%
              </span>
            </div>

            {/* Score Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">SKILLS_ALIGNMENT:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.skillsMatch}%
                  </span>
                </div>
                <Progress value={job.match.breakdown.skillsMatch} indicatorClassName="bg-foreground" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">DEGREE_ELIGIBILITY:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.educationMatch}%
                  </span>
                </div>
                <Progress value={job.match.breakdown.educationMatch} indicatorClassName="bg-vermilion" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">FRESHER_BATCH:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.fresherMatch}%
                  </span>
                </div>
                <Progress value={job.match.breakdown.fresherMatch} indicatorClassName="bg-foreground" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">LOCATION_PREF:</span>
                  <span className="font-bold text-foreground">
                    {job.match.breakdown.locationMatch}%
                  </span>
                </div>
                <Progress value={job.match.breakdown.locationMatch} indicatorClassName="bg-vermilion" />
              </div>
            </div>

            {/* Match Reasons */}
            <div className="border-t border-black/10 dark:border-white/10 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                EVALUATION REASONS:
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-foreground/90">
                {job.match.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-vermilion shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Job Specifications */}
          <div>
            <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              02 // ROLE ATTRIBUTES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15">
              <div className="p-3 bg-card font-mono space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Experience</span>
                <p className="text-xs font-bold text-foreground">{job.experience}</p>
              </div>
              <div className="p-3 bg-card font-mono space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Education</span>
                <p className="text-xs font-bold text-foreground">{job.education}</p>
              </div>
              <div className="p-3 bg-card font-mono space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Work Mode</span>
                <p className="text-xs font-bold text-foreground">{job.work_mode}</p>
              </div>
              <div className="p-3 bg-card font-mono space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Source</span>
                <p className="text-xs font-bold text-foreground truncate">{job.source}</p>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              03 // TECHNICAL SKILLS
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 border border-black/15 dark:border-white/15 bg-muted/20 text-foreground"
                >
                  [{skill.toUpperCase()}]
                </span>
              ))}
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              04 // POSITION DESCRIPTION
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line border border-black/10 dark:border-white/15 p-4 bg-muted/10 font-sans">
              {job.description}
            </p>
          </div>

          {/* Tracker Status Banner */}
          {existingApp && (
            <div className="p-3 border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 font-mono text-xs flex items-center justify-between">
              <div className="text-foreground">
                [TRACKED] CURRENT STATUS: <span className="font-bold underline uppercase">{existingApp.status}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                RECORDED {new Date(existingApp.applied_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-black/10 dark:border-white/15 p-4 sm:p-6 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED DIRECT EMPLOYER APPLICATION LINK</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto font-mono">
            <button
              type="button"
              onClick={() => toggleSaveJob(job.id)}
              className={`px-4 py-2 text-xs border uppercase tracking-wider transition-colors ${
                saved
                  ? 'border-black dark:border-white bg-foreground text-background font-bold'
                  : 'border-black/20 dark:border-white/20 hover:bg-muted/40 text-foreground'
              }`}
            >
              {saved ? '[SAVED TO DESK]' : '[+ SAVE JOB]'}
            </button>

            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 sm:flex-initial h-9 px-6 text-xs font-mono font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white rounded-none border-0 transition-colors shadow-none gap-2"
            >
              <span>APPLY ON OFFICIAL SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

