import React from 'react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  className?: string
  children: React.ReactNode
}

export const BentoGrid: React.FC<BentoGridProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[20rem]',
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoGridItemProps {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  className,
  title,
  description,
  header,
  icon,
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-input dark:shadow-none p-5 sm:p-6 bg-card dark:bg-slate-900 border border-border/80 justify-between flex flex-col space-y-4 hover:border-indigo-500/50 relative overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {header && <div className="w-full flex-1 overflow-hidden rounded-2xl">{header}</div>}
      {children}
      {(title || description || icon) && (
        <div className="group-hover/bento:translate-x-1 transition duration-200">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-primary">{icon}</div>}
            {title && (
              <div className="font-extrabold text-foreground text-base sm:text-lg">
                {title}
              </div>
            )}
          </div>
          {description && (
            <div className="font-normal text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
