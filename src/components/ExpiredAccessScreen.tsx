import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/reactbits/SpotlightCard'
import { StarBorder } from '@/components/reactbits/StarBorder'
import {
  Lock,
  Zap,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export const ExpiredAccessScreen: React.FC = () => {
  const {
    setIsPaymentModalOpen,
    setCurrentView,
    savedJobs,
    applications,
  } = useApp()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-in fade-in zoom-in-95 duration-300">
      <SpotlightCard
        spotlightColor="rgba(245, 158, 11, 0.15)"
        className="border-indigo-100 shadow-2xl dark:border-slate-800 rounded-3xl overflow-hidden"
      >
        {/* Top visual banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 p-6 md:p-8 text-center border-b border-border/60">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-3">
            <Clock className="w-3.5 h-3.5" /> 24-Hour Pass Expired
          </span>

          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Your 24-Hour Job Hunt Pass Has Expired
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
            Your saved jobs and application tracker are still available. Get another 24-hour pass for ₹199 to continue finding and applying to jobs.
          </p>

          {/* Primary Unlock CTA with StarBorder */}
          <div className="mt-6 flex justify-center">
            <StarBorder
              onClick={() => setIsPaymentModalOpen(true)}
              color="#6366f1"
              speed="4s"
            >
              <div className="flex items-center gap-2 py-1 px-5 text-base font-bold">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Get 24 Hours — ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </StarBorder>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Permanent Data Guarantee */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4.5 dark:bg-emerald-950/40 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                  Important: Your Data is Always Preserved
                </h4>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-300 mt-1 leading-relaxed">
                  CollegeCentre never locks or deletes your saved jobs, application statuses, interview notes, or student profile. You only purchase another ₹199 pass when you are ready to discover and apply to new job listings.
                </p>
              </div>
            </div>
          </div>

          {/* Immediate Action Buttons for Still Available Data */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Still Available in Your Student Account:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('saved')}
                className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-accent/60 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-extrabold text-foreground">Saved Jobs</h5>
                    <p className="text-xs text-muted-foreground">{savedJobs.length} opportunities saved</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('applications')}
                className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-accent/60 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-extrabold text-foreground">Application Tracker</h5>
                    <p className="text-xs text-muted-foreground">{applications.length} active applications</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-bold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Why the 24-Hour Pass?
            </span>{' '}
            No recurring auto-debit traps. You focus intensely for 24 hours finding high-match jobs, and maintain your career tracker forever.
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
