import React from 'react'
import { Application, ApplicationStatus } from '@/types'
import { Check, Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApplicationTimelineProps {
  application: Application
  onStatusChange: (status: ApplicationStatus) => void
  onEditNotes: () => void
}

const STAGES: { status: ApplicationStatus; label: string; code: string }[] = [
  { status: 'Saved', label: 'SAVED', code: '01' },
  { status: 'Applied', label: 'APPLIED', code: '02' },
  { status: 'Shortlisted', label: 'SHORTLISTED', code: '03' },
  { status: 'Assessment', label: 'ASSESSMENT', code: '04' },
  { status: 'Selected', label: 'OFFERED', code: '05' },
]

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  application,
  onStatusChange,
  onEditNotes,
}) => {
  const isRejected = application.status === 'Rejected'
  const currentStageIndex = STAGES.findIndex((s) => s.status === application.status)

  return (
    <div className="border border-black/10 dark:border-white/15 bg-muted/10 p-4 space-y-4">
      {/* Header with status badge and timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/10 dark:border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground uppercase tracking-widest text-[11px]">
            Status:
          </span>
          <span
            className={cn(
              'px-2 py-0.5 border font-bold uppercase tracking-wider text-[11px]',
              isRejected
                ? 'border-red-500/30 bg-red-500/10 text-red-600'
                : application.status === 'Selected'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                : 'border-vermilion/40 bg-vermilion-light text-vermilion dark:bg-vermilion/10'
            )}
          >
            {application.status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>UPDATED: {new Date(application.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15">
        {STAGES.map((stage, idx) => {
          const isCompleted = !isRejected && currentStageIndex >= idx
          const isCurrent = application.status === stage.status

          return (
            <button
              key={stage.status}
              type="button"
              onClick={() => onStatusChange(stage.status)}
              className={cn(
                'p-2.5 sm:p-3 text-left font-mono transition-colors flex flex-col justify-between h-full',
                isCurrent
                  ? 'bg-foreground text-background font-bold'
                  : isCompleted
                  ? 'bg-card text-foreground hover:bg-muted/40'
                  : 'bg-card text-muted-foreground hover:bg-muted/40'
              )}
              title={`Advance status to ${stage.label}`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className={isCurrent ? 'text-background/70' : 'text-muted-foreground'}>
                  {stage.code}
                </span>
                {isCompleted && !isCurrent && <Check className="w-3 h-3 text-vermilion" />}
              </div>
              <div className="text-xs font-bold tracking-wider mt-1 truncate">
                {stage.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Quick Stage Actions including Rejected */}
      <div className="flex items-center justify-between gap-2 pt-1 font-mono text-[11px]">
        <button
          type="button"
          onClick={() => onStatusChange(isRejected ? 'Applied' : 'Rejected')}
          className={cn(
            'px-2.5 py-1 border transition-colors uppercase tracking-wider',
            isRejected
              ? 'border-black dark:border-white text-foreground hover:bg-muted/40'
              : 'border-red-500/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
          )}
        >
          {isRejected ? 'Restore to Applied' : 'Mark as Rejected'}
        </button>

        <button
          type="button"
          onClick={onEditNotes}
          className="text-foreground hover:text-vermilion underline flex items-center gap-1 uppercase tracking-wider"
        >
          <FileText className="w-3 h-3" />
          <span>Edit Interview Notes</span>
        </button>
      </div>
    </div>
  )
}

