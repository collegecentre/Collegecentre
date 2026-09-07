import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

export const ExpiredAccessScreen: React.FC = () => {
  const {
    setIsPaymentModalOpen,
    setCurrentView,
    savedJobs,
    applications,
    accessPeriod,
  } = useApp()

  const isNeverActivated = !accessPeriod

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      <div className="border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-4 bg-muted/20 flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground uppercase tracking-widest">
            {isNeverActivated ? 'Access Status • Pass Required' : 'Access Status • Sprint Window Closed'}
          </span>
          <span className="font-bold text-vermilion uppercase tracking-wider">
            {isNeverActivated ? 'Pass Inactive' : 'Sprint Expired'}
          </span>
        </div>

        {/* Hero Section */}
        <div className="p-6 md:p-10 border-b border-black/10 dark:border-white/15 space-y-4">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {isNeverActivated ? 'Student Discovery Pass • ₹199 Flat' : 'Sprint Conclusion • 24 Hours Elapsed'}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            {isNeverActivated ? '24-Hour Job Hunt Pass Required' : 'Your 24-Hour Pass Has Expired'}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
            {isNeverActivated
              ? 'Unlock unrestricted fresher job search, verified company portals, and instant eligibility compatibility matrices. Flat ₹199 rate when you are ready to sprint—no recurring subscription.'
              : 'Discovery access to new job listings and real-time AI scoring has concluded. All positions you saved and applications you tracked remain permanently accessible under your profile.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>{isNeverActivated ? 'UNLOCK 24-HOUR PASS — ₹199' : 'UNLOCK NEW 24-HOUR SPRINT — ₹199'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rule 11 Permanent Guarantee Notice */}
        <div className="p-6 md:p-8 bg-muted/10 border-b border-black/10 dark:border-white/15 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rule 11: Permanent Career Desk Guarantee</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CollegeCentre never locks or revokes access to your saved positions, application pipeline stages, interview notes, or student credentials. Passes are strictly transactional: ₹199 only when you wish to execute a new 24-hour job search cycle.
          </p>
        </div>

        {/* Preserved Data Shortcuts */}
        <div className="p-6 md:p-8 space-y-4 font-mono">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            PERMANENTLY PRESERVED ASSETS:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15">
            <button
              type="button"
              onClick={() => setCurrentView('saved')}
              className="p-5 bg-card hover:bg-muted/40 transition-colors text-left flex items-start justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <Bookmark className="w-3.5 h-3.5 text-vermilion" />
                  <span>Saved Positions</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {savedJobs.length} roles preserved on desk
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('applications')}
              className="p-5 bg-card hover:bg-muted/40 transition-colors text-left flex items-start justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Application Tracker</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {applications.length} pipeline records
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
