import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, jobs, setSelectedJob } = useApp()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const featuredJobs = jobs.slice(0, 3)

  const faqs = [
    {
      q: 'Is CollegeCentre completely free to use?',
      a: 'Yes, CollegeCentre is 100% free for college freshers and job seekers. There are no subscriptions, no paid passes, no locked tiers, and no payment requirements. All job listings, direct employer links, and tracking features are fully accessible.',
    },
    {
      q: 'Are these real verified fresher openings?',
      a: 'Yes. Every listing is manually verified for fresher & 0–1 year eligibility across 2024, 2025, 2026, and 2027 graduating batches. We link directly to official employer career portals (Workday, Greenhouse, Lever, etc.) with zero middleman filtering.',
    },
    {
      q: 'How does the Application Tracker work?',
      a: 'Whenever you apply to a position or save a job, it is permanently saved to your personalized recruitment pipeline. You can update recruiter progress (Applied → Shortlisted → Assessment → Selected) and review your history anytime.',
    },
    {
      q: 'How does the Match Scoring work?',
      a: 'Our platform uses a 100% deterministic, rule-based matching engine. It evaluates your graduation year, degree, technical skills, and preferred locations against employer requirements to give you a transparent, real-time suitability percentage.',
    },
    {
      q: 'Do you take any cut or commission from candidates?',
      a: 'Never. CollegeCentre was built specifically to eliminate predatory student subscription traps and placement scams. Our mission is to connect college graduates directly to verified employer hiring teams.',
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
          <span>CAMPUS PLACEMENTS & DIRECT APPLICATIONS</span>
          <span className="hidden sm:inline font-bold text-foreground">Batches: 2024 / 2025 / 2026 / 2027</span>
        </div>

        {/* Editorial Headline */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> 100% Free For College Freshers • Zero Paywalls
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08] uppercase font-sans">
            Find Verified Fresher Jobs. 100% Free Forever.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            The focused fresher job discovery platform built for college students. Curated entry-level roles, direct employer portal links, deterministic match scoring, and permanent application tracking.
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

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('workflow-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
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
              <span className="text-[10px] text-muted-foreground block uppercase">MATCH ACCURACY</span>
              <span className="text-base font-bold text-foreground">94.6%</span>
            </div>
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">PLATFORM FEE</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹0 FREE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Top Openings Preview */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">01.</span>
            <span className="uppercase tracking-wider font-bold">LATEST CURATED OPENINGS</span>
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
            />
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('jobs')}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-black/15 dark:border-white/20 px-5 py-2.5 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          >
            <span>Explore All {jobs.length} Fresher Openings With Batch Calibration</span>
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
          <span className="text-muted-foreground hidden sm:inline">Built for Student Success</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              100% Free Forever
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              No subscription traps, no paywalls, and no hidden fees. Browse and apply to every fresher job opening completely free.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-blue-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Direct Official Links
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              No middleman aggregators or resume black holes. Clicking apply takes you straight to official company careers portals.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-[#fe7141]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Permanent Candidate Pipeline
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Every job you bookmark or apply to is permanently retained in your personal tracker with notes and stage updates.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-none border border-black/15 dark:border-white/20 bg-muted/20 flex items-center justify-center text-purple-500">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
              Batch Calibrated
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Curated specifically for 2024–2027 college batches with instant deterministic eligibility and skill match scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: Four-Step Execution Workflow */}
      <section id="workflow-section" className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">03.</span>
            <span className="uppercase tracking-wider font-bold">HOW IT WORKS</span>
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
            <h3 className="font-bold text-sm text-foreground">MATCH SKILLS</h3>
            <p className="text-muted-foreground leading-relaxed">
              Review your transparent match breakdown comparing your skills and requirements for every position.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 03</span>
            <h3 className="font-bold text-sm text-foreground">APPLY DIRECTLY</h3>
            <p className="text-muted-foreground leading-relaxed">
              Open verified direct application links on official company portals with automatic application logging.
            </p>
          </div>

          <div className="p-5 border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold uppercase">Step 04</span>
            <h3 className="font-bold text-sm text-foreground">TRACK PIPELINE</h3>
            <p className="text-muted-foreground leading-relaxed">
              Organize your applications through Applied, Shortlisted, Interview, and Offer stages in your personal desk.
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
        <div className="inline-block text-[11px] text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 uppercase">
          ⚡ 100% Free Fresher Platform • No Charges
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground font-sans">
          Ready to discover your next opportunity?
        </h2>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Access all verified fresher jobs, real CTC verification, and direct employer application links without any barriers.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse All Fresher Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}

export const HomePage = LandingPage

