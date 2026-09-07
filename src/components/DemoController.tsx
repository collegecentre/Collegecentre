import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Clock, Zap, AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react'

interface DemoControllerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DemoController: React.FC<DemoControllerProps> = ({ open, onOpenChange }) => {
  const {
    isPassActive,
    remainingTime,
    accessPeriod,
    activatePass,
    simulatePassExpiry,
    simulateRemainingTime,
    resetData,
  } = useApp()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md p-0 overflow-hidden border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3 bg-muted/20 flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground uppercase tracking-widest">
            Dev Tools • Pass Simulator
          </span>
          <span className="font-bold text-vermilion uppercase tracking-wider">
            Debug Panel
          </span>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-black text-foreground tracking-tight">
              Pass Lifecycle Simulator
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Toggle between active 24-hour search access, 15-minute expiration warnings, and locked boundary states.
            </DialogDescription>
          </DialogHeader>

          {/* Current Status Box */}
          <div className="border border-black/10 dark:border-white/15 p-4 bg-muted/10 font-mono space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Current State:</span>
              <span
                className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${
                  isPassActive
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                    : 'border-red-500/30 bg-red-500/10 text-red-600'
                }`}
              >
                {isPassActive ? 'ACTIVE (24H)' : 'EXPIRED (LOCKED)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Countdown Timer:</span>
              <span className="font-bold text-foreground">
                {isPassActive ? remainingTime.formatted : '00h 00m 00s (LOCKED)'}
              </span>
            </div>
            {accessPeriod && (
              <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-black/10 dark:border-white/10 pt-2">
                <span>Expires:</span>
                <span>{new Date(accessPeriod.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            )}
          </div>

          {/* Simulation Actions */}
          <div className="space-y-2 font-mono">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Simulate Lifecycle State:
            </div>

            <div className="space-y-2">
              <button
                type="button"
                className="w-full py-2.5 px-3 border border-black dark:border-white bg-foreground text-background text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                onClick={() => {
                  activatePass('UPI')
                  onOpenChange(false)
                }}
              >
                <Zap className="w-3.5 h-3.5 text-vermilion" />
                <span>Activate Full 24-Hour Sprint</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-3 border border-black/15 dark:border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-muted/40 transition-colors"
                onClick={() => {
                  simulateRemainingTime(15)
                  onOpenChange(false)
                }}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Set 15 Minutes Remaining</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-3 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
                onClick={() => {
                  simulatePassExpiry()
                  onOpenChange(false)
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Pass Expiry (Test Lock)</span>
              </button>
            </div>
          </div>

          {/* Rule 11 Reminder */}
          <div className="border border-black/10 dark:border-white/15 p-3 bg-muted/10 text-xs flex items-start gap-2.5 font-mono">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
            <span className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground uppercase">Rule 11:</strong> When sprint locks, saved positions and recruitment stages stay permanently intact.
            </span>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs">
            <button
              type="button"
              onClick={resetData}
              className="text-muted-foreground hover:text-red-600 flex items-center gap-1 uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-1.5 border border-black/15 dark:border-white/20 text-foreground hover:bg-muted/40 uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
