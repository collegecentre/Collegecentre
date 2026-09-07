import React from 'react'
import { cn } from '@/lib/utils'

interface MetricStatCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  badge?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  onClick?: () => void
}

export const MetricStatCard: React.FC<MetricStatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  badge,
  trend,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-indigo-500/40 hover:shadow-md transition-[border-color,box-shadow] relative overflow-hidden flex flex-col justify-between group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-1 tabular-nums">
            {value}
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtext || badge) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60 text-xs">
          {badge && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[11px] font-extrabold',
                trend === 'up'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : trend === 'down'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {badge}
            </span>
          )}
          {subtext && <span className="text-muted-foreground truncate">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
