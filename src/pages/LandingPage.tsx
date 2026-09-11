import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsPaymentModalOpen, isPassActive, jobs, setSelectedJob } = useApp()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const featuredJobs = jobs.slice(0, 3)

  const faqs = [
    {
      q: 'What exactly is a 24-Hour Job Hunt Pass?',
      a: 'The 24-Hour Pass is a ₹199 one-time sprint pass. It gives you 24 continuous hours of unrestricted access to all 40+ verified fresher openings, AI eligibility scoring, and direct official employer links. There is NO recurring monthly subscription or auto-debit.',
    },
    {
      q: 'Can I purchase now and start my 24 hours later?',
      a: 'Yes! Our pass checkout features Flexible Sprint Scheduling. You can choose "Start Now" or schedule your sprint to start tonight (e.g., 7:00 PM after college) or tomorrow morning at 9:00 AM, so you never lose hours while sleeping or attending classes.',
    },
    {
      q: 'What happens when my 24 hours expire? (Rule 11)',
      a: 'Under our Rule 11 Lifetime Access Guarantee, you are NEVER locked out of your application history. Every position you applied to or saved during your sprint remains permanently accessible in your Application Tracker. You can update recruiter progress (Applied → Shortlisted → Selected) and review interview notes forever without paying again.',
    },
    {
      q: 'Can I view any jobs for free before purchasing?',
      a: 'Absolutely. Every visitor gets 3 full fresher openings completely free and unmasked in the Discover Jobs feed. You can inspect the full company details, verified CTC, and click "Apply" to experience the platform with zero commitment.',
    },
    {
      q: 'Are these real verified fresher openings?',
      a: 'Yes. Every listing is manually verified for fresher & 0–1 year eligibility across 2024, 2025, 2026, and 2027 graduating batches. We link directly to official employer career portals (Workday, Greenhouse, Lever, etc.) with zero middleman filtering.',
    },
  ]

  return (
    <div className="space-y-16 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 pb-6 space-y-8">
        {/* Monospace Eyebrow Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/15 pb-3 text-[11px] font-mono text-muted-foreground uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fe7141] animate-pulse" />
            <span className="text-foreground font-bold">Vol. 02 • Fresher Recruiting Engine</span>
          </div>
          <span>CAMPUS PLACEMENTS & FOCUSED APPLICATION SPRINTS</span>
          <span className="hidden sm:inline font-bold text-foreground">Batches: 2024 / 2025 / 2026 / 2027</span>
        </div>

        {/* Editorial Headline */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#fe7141]/40 bg-[#fe7141]/10 text-[#fe7141] text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Zero Subscription Traps • One-Time ₹199 Sprint
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08] uppercase font-sans">
            Sprint for 24 Hours. Keep Your Interviews Forever.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            The focused fresher job discovery platform built for college students. Curated entry-level roles, direct employer portal links, deterministic match scoring, and lifetime interview tracking.
          </p>
        </div>

        {/* Action Controls & Real-time Metrics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2 border-t border-black/10 dark:border-white/15">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('jobs')}
              className="font-mono text-xs font-bold px-6 py-3.5 rounded-none bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>Discover Fresher Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isPassActive ? (
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="font-mono text-xs font-bold px-5 py-3.5 rounded-none border border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Active Dashboard</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="font-mono text-xs font-bold px-5 py-3.5 rounded-none bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Unlock 24-Hour Pass — ₹199</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('workflow-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
                else setCurrentView('pricing')
              }}
              className="font-mono text-xs font-semibold px-4 py-3.5 rounded-none border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors text-foreground cursor-pointer"
            >
              How It Works
            </button>
          </div>

          {/* Hairline Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-left">
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">CURATED ROLES</span>
              <span className="text-base font-bold text-foreground">{jobs.length} ACTIVE</span>
            </div>
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">AVERAGE CTC</span>
              <span className="text-base font-bold text-foreground">₹5.8 LPA</span>
            </div>
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">MATCH SCORE</span>
              <span className="text-base font-bold text-foreground">94.6%</span>
            </div>
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">SPRINT RATE</span>
              <span className="text-base font-bold text-[#fe7141]">₹199 FLAT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Top Unlocked Openings Preview */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">01.</span>
            <span className="uppercase tracking-wider font-bold">FREE PREVIEW OPENINGS</span>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('jobs')}
            className="text-xs hover:underline flex items-center gap-1 font-bold text-[#fe7141] cursor-pointer"
          >
            <span>View All {jobs.length} Openings in Feed</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={(selected) => setSelectedJob(selected)}
              isLocked={false}
            />
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('jobs')}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-black/15 dark:border-white/20 px-5 py-2.5 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          >
            <span>Explore All 40+ Fresher Openings With Batch Calibration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Section 02: The 4 Core Advantages */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">02.</span>
            <span className="uppercase tracking-wider font-bold">WHY COLLEGECENTRE IS DIFFERENT</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">Built for Student Psychology</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-[#fe7141]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Zero Subscription Traps
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              No ₹999/month recurring plans that charge you while you study. Pay ₹199 flat only when you are sitting down to sprint.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Flexible Scheduling
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Buy now, launch tonight at 7 PM or tomorrow at 9 AM. Your 24-hour clock only starts when your focus sprint actually begins.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Rule 11 Lifetime Desk
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When 24 hours expire, every job you applied to stays in your tracker forever. Manage interview stages and notes with zero lock-out.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-purple-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              100% Direct Official Links
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              No resume black holes or middleman aggregators. Clicking "Apply" redirects you straight to verified employer career portals.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: Four-Step Execution Workflow */}
      <section id="workflow-section" className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">03.</span>
            <span className="uppercase tracking-wider font-bold">THE SPRINT WORKFLOW</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">From Discovery to Offer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 01</span>
            <h3 className="font-bold text-sm text-foreground">CALIBRATE</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select your passing batch (2024 / 2025 / 2026 / 2027) and degree to filter only 100% eligible fresher roles.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 02</span>
            <h3 className="font-bold text-sm text-foreground">PREVIEW FREE</h3>
            <p className="text-muted-foreground leading-relaxed">
              Inspect top 3 roles with full company details and CTC completely free. Experience 1-click apply and auto-logging.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 03</span>
            <h3 className="font-bold text-sm text-foreground">LAUNCH SPRINT</h3>
            <p className="text-muted-foreground leading-relaxed">
              Unlock the complete 40+ database for ₹199. Apply to 15–20 companies in one focused 24-hour sitting.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 04</span>
            <h3 className="font-bold text-sm text-foreground">KEEP FOREVER</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your sprint closes, but your applications, recruiter updates, and interview notes are preserved permanently.
            </p>
          </div>
        </div>
      </section>

      {/* Section 04: Fresher FAQ Accordion */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">04.</span>
            <span className="uppercase tracking-wider font-bold">FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">Transparent Placement Guidance</span>
        </div>

        <div className="border border-black/10 dark:border-white/15 bg-card divide-y divide-black/10 dark:divide-white/10 font-mono text-xs">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/10 cursor-pointer"
                >
                  <span className="font-bold text-foreground text-sm flex items-center gap-2">
                    <span className="text-[#fe7141]">Q{idx + 1}.</span> {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-foreground' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-muted-foreground text-xs leading-relaxed font-sans border-t border-black/5 dark:border-white/5 pt-3 bg-muted/5">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="p-8 sm:p-12 border border-black/15 dark:border-white/20 bg-gradient-to-br from-card via-card to-muted/20 text-center space-y-5 font-mono">
        <div className="inline-block text-[11px] text-[#fe7141] font-bold border border-[#fe7141]/30 bg-[#fe7141]/10 px-3 py-1 uppercase">
          ⚡ 24-Hour Focus • Permanent Retention
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground font-sans">
          Ready for your placement sprint?
        </h2>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Flat ₹199 unlocks the complete fresher database, real CTC verification, and direct employer application links. Every job you apply to stays on your desk permanently.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Fresher Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="text-xs font-bold px-6 py-3.5 bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer uppercase tracking-wider"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start 24H Sprint (₹199)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}

export const HomePage = LandingPage

