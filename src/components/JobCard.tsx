import React from 'react'
import { JobWithMatch, useApp } from '@/context/AppContext'
import {
  MapPin,
  Bookmark,
  Calendar,
  ArrowUpRight,
  Lock,
  Check,
} from 'lucide-react'

interface JobCardProps {
  job: JobWithMatch
  onSelect: (job: JobWithMatch) => void
  isLocked?: boolean
}

const formatLocationDisplay = (location: string, workMode: string): string => {
  if (!location) return workMode
  const cleanLoc = location.trim()
  const cleanMode = workMode.trim()
  if (cleanLoc.toLowerCase() === cleanMode.toLowerCase()) return cleanLoc
  if (cleanLoc.toLowerCase().includes(cleanMode.toLowerCase())) return cleanLoc
  return `${cleanLoc} • ${cleanMode}`
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, isLocked = false }) => {
  const {
    toggleSaveJob,
    isJobSaved,
    isPassActive,
    setIsPaymentModalOpen,
    createOrUpdateApp,
    showToast,
    applications,
  } = useApp()
  const saved = isJobSaved(job.id)
  const isApplied = applications.some((a) => a.job_id === job.id)

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLocked || !isPassActive) {
      setIsPaymentModalOpen(true)
      return
    }
    createOrUpdateApp(job.id, 'Applied', `Applied via ${job.company} portal.`)
    showToast?.(`🚀 Application to ${job.company} logged to your Permanent Pipeline!`, 'success')
    const popup = window.open(job.application_url, '_blank', 'noopener,noreferrer')
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = job.application_url
    }
  }

  const handleCardClick = () => {
    if (isLocked) {
      setIsPaymentModalOpen(true)
      return
    }
    onSelect(job)
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLocked) {
      setIsPaymentModalOpen(true)
      return
    }
    toggleSaveJob(job.id)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer rounded-lg border transition-all duration-150 p-5 flex flex-col justify-between space-y-4 ${
        isLocked
          ? 'border-black/10 dark:border-white/10 bg-muted/5 hover:border-vermilion/50 hover:bg-muted/10'
          : 'border-black/10 dark:border-white/15 bg-card hover:border-black dark:hover:border-white'
      }`}
    >
      <div className="space-y-3">
        {/* Top Monospace Metadata Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <span className="font-bold text-foreground/80 uppercase tracking-wider font-mono flex items-center gap-1 text-[10px]">
                <Lock className="w-2.5 h-2.5 text-vermilion" /> [Verified Top Employer]
              </span>
            ) : (
              <span className="font-bold text-foreground uppercase tracking-wider">{job.company}</span>
            )}
            <span>/</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatLocationDisplay(job.location, job.work_mode)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-1.5 py-0.5 rounded-xs font-bold text-[10px] ${
                job.match.score >= 85
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                  : job.match.score >= 70
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {job.match.score}% MATCH
            </span>

            <button
              type="button"
              onClick={handleSaveClick}
              aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
              className={`p-1 rounded-sm transition-colors ${
                saved
                  ? 'text-[#fe7141]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight group-hover:underline">
              {job.title}
            </h3>
            {isApplied && (
              <span className="px-1.5 py-0.5 border border-emerald-500/40 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase shrink-0 flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Applied
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            {isLocked ? (
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sm text-foreground/60 select-none filter blur-[2px]">
                  ₹8.5 - 14 LPA
                </span>
                <span className="text-[9px] font-mono text-vermilion font-bold uppercase tracking-wider">
                  (Locked)
                </span>
              </div>
            ) : (
              <span className="font-mono font-bold text-sm text-[#fe7141] tabular-nums">
                {job.salary}
              </span>
            )}
            <span className="text-[11px] font-mono text-muted-foreground">
              · {job.education}
            </span>
          </div>
        </div>

        {/* Monospace Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-xs bg-slate-100 dark:bg-slate-800 text-foreground font-mono text-[10px] uppercase tracking-tight border border-black/5 dark:border-white/10"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-xs font-mono text-[10px] text-muted-foreground">
              +{job.skills.length - 4} MORE
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-black/10 dark:border-white/10 font-mono text-xs">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {job.deadline}
        </span>

        <div className="flex items-center gap-2">
          {!isLocked && (
            <button
              type="button"
              className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
              onClick={() => onSelect(job)}
            >
              DETAILS
            </button>
          )}

          {isLocked ? (
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-bold font-mono bg-vermilion hover:bg-vermilion-hover text-white transition-colors rounded-sm flex items-center gap-1.5 shadow-sm"
              onClick={handleApplyClick}
            >
              <Lock className="w-3 h-3" />
              <span>UNLOCK (₹199)</span>
            </button>
          ) : isApplied ? (
            <button
              type="button"
              className="px-3 py-1 text-xs font-bold font-mono border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-sm flex items-center gap-1"
              onClick={handleApplyClick}
            >
              <span>APPLY AGAIN</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              className="px-3 py-1 text-xs font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors rounded-sm flex items-center gap-1"
              onClick={handleApplyClick}
            >
              <span>APPLY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
