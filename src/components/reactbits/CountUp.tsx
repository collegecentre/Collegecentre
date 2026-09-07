import React, { useEffect, useState } from 'react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  suffix?: string
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1000,
  className = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const current = Math.floor(progress * (to - from) + from)
      setCount(current)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(to)
      }
    }
    window.requestAnimationFrame(step)
  }, [to, from, duration])

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  )
}
