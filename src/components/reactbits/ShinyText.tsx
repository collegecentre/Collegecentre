import React from 'react'
import { cn } from '@/lib/utils'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`

  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent transition-all duration-300',
        disabled
          ? 'text-foreground'
          : 'bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-600 bg-[200%_auto] animate-shimmer',
        className
      )}
      style={{
        animationDuration,
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(110deg, #6366f1 20%, #10b981 50%, #6366f1 80%)',
        backgroundSize: '200% 100%',
      }}
    >
      {text}
    </span>
  )
}
