import React from 'react'
import { JobWithMatch, useApp } from '@/context/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Building,
  Briefcase,
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

    // Automatically mark as Applied in tracker
    createOrUpdateApp(job.id, 'Applied', `Applied via ${job.company} portal.`)

    // Open company careers portal in new tab
    window.open(job.application_url, '_blank', 'noopener,noreferrer')
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSaveJob(job.id)
  }

  // Format match badge variant
  const matchVariant =
    job.match.score >= 85 ? 'matchHigh' : job.match.score >= 70 ? 'matchMid' : 'matchNormal'

  return (
    <Card
      onClick={() => onSelect(job)}
      className="group cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200 relative overflow-hidden bg-card"
    >
      {/* Top Match Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-4 sm:p-5">
        {/* Header row: Company, Title & Save */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform dark:bg-slate-800 dark:border-slate-700">
              {job.company_logo || '🏢'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="font-medium text-foreground/80 truncate">{job.company}</span>
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
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              saved
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
            title={saved ? 'Remove from Saved' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Match Percentage & Fresher Eligibility row */}
        <div className="flex flex-wrap items-center gap-2 my-3">
          <Badge variant={matchVariant} className="gap-1 py-1 px-2.5 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{job.match.score}% Match</span>
          </Badge>

          {job.fresher_eligibility && (
            <Badge variant="success" className="gap-1 py-1 px-2 text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Fresher Eligible</span>
            </Badge>
          )}

          <Badge variant="secondary" className="text-xs">
            {job.work_mode}
          </Badge>

          <Badge variant="outline" className="text-xs text-muted-foreground">
            {job.job_type}
          </Badge>
        </div>

        {/* Salary and Key Skills */}
        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {job.salary}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {job.education}
            </span>
          </div>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job.deadline}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => onSelect(job)}
            >
              Details
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs px-3 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              onClick={handleApplyClick}
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
