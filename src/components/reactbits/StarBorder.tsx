import React from 'react'
import { cn } from '@/lib/utils'

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType
  className?: string
  color?: string
  speed?: string
  children: React.ReactNode
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = '#6366f1',
  speed = '6s',
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'relative inline-block py-[1px] overflow-hidden rounded-xl group select-none active:scale-[0.96] transition-transform',
        className
      )}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-0 right-[-100%] rounded-full animate-star-bottom pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-0 left-[-100%] rounded-full animate-star-top pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-10 bg-card dark:bg-slate-900 border border-border/80 rounded-[11px] px-4 py-2 text-foreground font-semibold flex items-center justify-center gap-2 group-hover:bg-accent/40 transition-colors">
        {children}
      </div>
    </Component>
  )
}
