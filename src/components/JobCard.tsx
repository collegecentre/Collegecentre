import React from 'react'
import { JobWithMatch, useApp } from '@/context/AppContext'
import { SpotlightCard } from '@/components/reactbits/SpotlightCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  ExternalLink,
  Bookmark,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Calendar,
} from 'lucide-react'

interface JobCardProps {
  job: JobWithMatch
  onSelect: (job: JobWithMatch) => void
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const { toggleSaveJob, isJobSaved, isPassActive, setIsPaymentModalOpen, createOrUpdateApp } =
    useApp()
  const saved = isJobSaved(job.id)

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPassActive) {
      setIsPaymentModalOpen(true)
      return
    }
    createOrUpdateApp(job.id, 'Applied', `Applied via ${job.company} portal.`)
    window.open(job.application_url, '_blank', 'noopener,noreferrer')
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSaveJob(job.id)
  }

  const matchVariant =
    job.match.score >= 85 ? 'matchHigh' : job.match.score >= 70 ? 'matchMid' : 'matchNormal'

  return (
    <SpotlightCard
      onClick={() => onSelect(job)}
      spotlightColor={job.match.score >= 85 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(99, 102, 241, 0.14)'}
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Company, Title & Save */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-border/70 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform dark:from-slate-800 dark:to-indigo-950">
              {job.company_logo || '🏢'}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground/90 truncate">{job.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? `Remove ${job.title} at ${job.company} from saved jobs` : `Save ${job.title} at ${job.company}`}
            className={`p-2.5 rounded-xl transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              saved
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Match Percentage & Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={matchVariant} className="gap-1.5 py-1 px-3 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{job.match.score}% Match</span>
          </Badge>

          {job.fresher_eligibility && (
            <Badge variant="success" className="gap-1 py-1 px-2.5 text-xs font-semibold">
              <CheckCircle className="w-3 h-3" />
              <span>Fresher Eligible</span>
            </Badge>
          )}

          <Badge variant="secondary" className="text-xs font-medium">
            {job.work_mode}
          </Badge>

          <Badge variant="outline" className="text-xs text-muted-foreground font-medium">
            {job.job_type}
          </Badge>
        </div>

        {/* Salary and Education fit */}
        <div className="space-y-2 pt-1 border-t border-border/50">
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm tracking-tight tabular-nums">
              {job.salary}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <GraduationCap className="w-3.5 h-3.5" />
              {job.education}
            </span>
          </div>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-secondary/80 text-secondary-foreground text-[11px] font-medium border border-border/40"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-lg bg-muted text-muted-foreground text-[10px] font-medium">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job.deadline}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-3 font-semibold hover:bg-accent"
              onClick={() => onSelect(job)}
            >
              View details
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs ps-3.5 pe-3 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs shadow-indigo-500/20"
              onClick={handleApplyClick}
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
