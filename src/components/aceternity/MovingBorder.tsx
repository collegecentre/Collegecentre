import React from 'react'
import { cn } from '@/lib/utils'

interface MovingBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string
  children: React.ReactNode
  as?: React.ElementType
  containerClassName?: string
  borderClassName?: string
  duration?: number
  className?: string
}

export const MovingBorder: React.FC<MovingBorderProps> = ({
  borderRadius = '1.25rem',
  children,
  as: Component = 'button',
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        'bg-transparent relative text-xl p-[1px] overflow-hidden group select-none active:scale-[0.96] transition-transform',
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <div
          className={cn(
            'h-full w-full opacity-[0.8] absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#10b981_50%,#6366f1_100%)] animate-spin',
            borderClassName
          )}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>

      <div
        className={cn(
          'relative bg-card dark:bg-slate-900 border border-border/70 backdrop-blur-xl text-foreground flex items-center justify-center w-full h-full text-sm antialiased font-semibold z-10 px-5 py-2.5',
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}
