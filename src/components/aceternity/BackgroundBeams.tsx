import React from 'react'
import { cn } from '@/lib/utils'

interface BackgroundBeamsProps {
  className?: string
}

export const BackgroundBeams: React.FC<BackgroundBeamsProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
        className
      )}
    >
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl rounded-full opacity-60 dark:opacity-40 animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-2/3 -right-32 w-80 h-80 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
      
      {/* Dynamic Grid Background Overlay */}
      <svg
        className="absolute inset-0 h-full w-full stroke-slate-200/50 dark:stroke-slate-800/50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="beams-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0 -1)"
          >
            <path d="M.5 40V.5H40" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#beams-pattern)" />
      </svg>
    </div>
  )
}
