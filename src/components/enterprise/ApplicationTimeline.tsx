import React from 'react'
import { Application, ApplicationStatus } from '@/types'
import { Check, Clock, Calendar, FileText, ChevronRight, XCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApplicationTimelineProps {
  application: Application
  onStatusChange: (status: ApplicationStatus) => void
  onEditNotes: () => void
}

const STAGES: { status: ApplicationStatus; label: string; description: string }[] = [
  { status: 'Saved', label: 'Saved', description: 'Opportunity bookmarked for review' },
  { status: 'Applied', label: 'Applied', description: 'Submitted application on employer portal' },
  { status: 'Shortlisted', label: 'Shortlisted', description: 'Profile selected by recruiter' },
  { status: 'Assessment', label: 'Assessment', description: 'Online technical or aptitude test' },
  { status: 'Selected', label: 'Selected', description: 'Job offer extended or accepted' },
]

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  onStatusChange,
  onEditNotes,
}) => {
  const isRejected = application.status === 'Rejected'
  const currentStageIndex = STAGES.findIndex((s) => s.status === application.status)

  return (
    <div className="space-y-4 rounded-2xl bg-card border border-border/80 p-4 sm:p-5 shadow-xs">
      {/* Header with quick status badge and timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Pipeline Stage:
          </span>
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1',
              isRejected
                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                : application.status === 'Selected'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
            )}
          >
            {isRejected ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {application.status}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Last updated {new Date(application.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Ant Design Style Stepper Timeline */}
      <div className="relative py-2">
        <div className="hidden sm:flex items-center justify-between relative z-10">
          {STAGES.map((stage, idx) => {
            const isCompleted = !isRejected && currentStageIndex >= idx
            const isCurrent = application.status === stage.status

            return (
              <button
                key={stage.status}
                type="button"
                onClick={() => onStatusChange(stage.status)}
                className="group flex flex-col items-center flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg py-1 transition-transform active:scale-95"
                title={`Change stage to ${stage.label}`}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors shadow-xs',
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                      : isCompleted
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-muted-foreground/30 bg-muted text-muted-foreground group-hover:border-muted-foreground'
                  )}
                >
                  {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-bold mt-1.5 transition-colors',
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Mobile Horizontal Stage Scroller */}
        <div className="flex sm:hidden overflow-x-auto gap-1.5 pb-2 -mx-1 px-1">
          {STAGES.map((stage) => {
            const isCurrent = application.status === stage.status
            return (
              <button
                key={stage.status}
                type="button"
                onClick={() => onStatusChange(stage.status)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border shrink-0 transition-colors',
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-accent'
                )}
              >
                {stage.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Stage Actions including Rejected */}
      <div className="flex items-center justify-between gap-2 pt-2 text-xs">
        <button
          type="button"
          onClick={() => onStatusChange(isRejected ? 'Applied' : 'Rejected')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1',
            isRejected
              ? 'bg-muted text-foreground hover:bg-accent'
              : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          )}
        >
          {isRejected ? 'Restore to Applied' : 'Mark as Rejected'}
        </button>

        <button
          type="button"
          onClick={onEditNotes}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Edit Interview Notes & Links</span>
        </button>
      </div>
    </div>
  )
}
