import React from 'react'

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Top ambient aura */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/10 blur-[120px] pointer-events-none" />
    </div>
  )
}
