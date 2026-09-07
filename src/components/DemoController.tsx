import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Clock className="w-5 h-5" />
            </span>
            <DialogTitle>Pass Simulator & Demo Controls</DialogTitle>
          </div>
          <DialogDescription>
            Test CollegeCentre's ₹199 / 24-hour pass lifecycle, live countdown, and locked/unlocked access boundaries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Current Status Box */}
          <div className="p-3.5 rounded-xl border bg-muted/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Current Pass State:</span>
              <Badge variant={isPassActive ? 'passActive' : 'passExpired'}>
                {isPassActive ? '● Active (24-Hour Pass)' : '○ Expired / Locked'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Countdown Timer:</span>
              <span className="font-mono font-bold text-foreground">
                {isPassActive ? remainingTime.formatted : 'Pass Inactive (Job Search Locked)'}
              </span>
            </div>
            {accessPeriod && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2 mt-1">
                <span>Pass Expires At:</span>
                <span>{new Date(accessPeriod.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ({new Date(accessPeriod.expires_at).toLocaleDateString()})</span>
              </div>
            )}
          </div>

          {/* Quick Simulation Actions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Quick State Changes
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="default"
                size="sm"
                className="justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  activatePass('UPI')
                  onOpenChange(false)
                }}
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Activate Full 24 Hours</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"
                onClick={() => {
                  simulateRemainingTime(15)
                  onOpenChange(false)
                }}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Set 15 Mins Remaining</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 sm:col-span-2"
                onClick={() => {
                  simulatePassExpiry()
                  onOpenChange(false)
                }}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Simulate Expired Pass (Test Locked State)</span>
              </Button>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-start gap-2 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Rule 11 Enforced:</strong> When pass expires, new job search locks, but <strong>Saved Jobs</strong>, <strong>Application Tracker</strong>, and <strong>Profile</strong> remain permanently accessible!
            </span>
          </div>
        </div>

        <DialogFooter className="sm:justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetData}
            className="text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
