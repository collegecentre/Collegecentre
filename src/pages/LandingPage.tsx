import React from 'react'
import { useApp } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsPaymentModalOpen, isPassActive, jobs, setSelectedJob } = useApp()

  const sampleJobs = jobs.slice(0, 4)

  return (
    <div className="space-y-16 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 pb-6 space-y-8">
        {/* Monospace Eyebrow Metadata (State of AI Design Style) */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/15 pb-3 text-[11px] font-mono text-muted-foreground uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fe7141]" />
            <span className="text-foreground font-bold">[VOL. 02 // SPRINT REPORT]</span>
          </div>
          <span>CAMPUS RECRUITING & FRESHER DISCOVERY</span>
          <span className="hidden sm:inline">[BATCHES: 2024 / 2025 / 2026]</span>
        </div>

        {/* Editorial Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08] uppercase font-sans">
            A 24-Hour Job Hunt Platform for College Freshers.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Aggregated entry-level openings, deterministic skill matching, and zero subscription traps. Pay ₹199 once when you are ready to sprint—keep your application pipeline and saved jobs forever.
          </p>
        </div>

        {/* Action Controls & Real-time Metrics Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2 border-t border-black/10 dark:border-white/15">
          <div className="flex flex-wrap items-center gap-3">
            {isPassActive ? (
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="font-mono text-xs font-bold px-5 py-3 rounded-sm bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <span>[ GO TO ACTIVE DASHBOARD ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="font-mono text-xs font-bold px-5 py-3 rounded-sm bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>[ UNLOCK 24-HOUR PASS — ₹199 ]</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentView('pricing')}
              className="font-mono text-xs font-semibold px-4 py-3 rounded-sm border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors text-foreground"
            >
              [ HOW IT WORKS ]
            </button>
          </div>

          {/* Hairline Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-left">
            <div className="border-l border-black/10 dark:border-white/15 pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase">CURATED ROLES</span>
              <span className="text-base font-bold text-foreground">150+</span>
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
              <span className="text-[10px] text-muted-foreground block uppercase">SPRINT PASS</span>
              <span className="text-base font-bold text-[#fe7141]">₹199 FLAT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Curated Openings Feed */}
      <section className="space-y-6 pt-4">
        {/* Hairline Section Divider with Monospace Tag */}
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold">01 //</span>
            <span className="uppercase tracking-wider font-semibold">LIVE RECRUITING DATABASE</span>
          </div>
          <button
            type="button"
            onClick={() => (isPassActive ? setCurrentView('jobs') : setIsPaymentModalOpen(true))}
            className="text-xs hover:underline flex items-center gap-1 font-bold text-[#fe7141]"
          >
            <span>[ VIEW ALL 150+ ROLES ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={(selected) => setSelectedJob(selected)}
            />
          ))}
        </div>
      </section>

      {/* Section 02: The Economic Model */}
      <section className="space-y-6 pt-4">
        {/* Hairline Section Divider */}
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold">02 //</span>
            <span className="uppercase tracking-wider font-semibold">THE 24-HOUR SPRINT ARCHITECTURE</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">[RULE_11 // GUARANTEED_RETENTION]</span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: During Sprint */}
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 font-mono text-xs">
              <span className="font-bold text-foreground">[THE 24-HOUR PASS — ₹199]</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">DISCOVERY ACTIVE</span>
            </div>
            <ul className="space-y-2.5 font-mono text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">+</span>
                <span>Unrestricted search across 150+ fresher openings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">+</span>
                <span>Deterministic match percentages calculated per skill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">+</span>
                <span>Direct application URLs to official employer career portals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">+</span>
                <span>Save and bookmark jobs into your permanent archive</span>
              </li>
            </ul>
          </div>

          {/* Card B: After Expiration */}
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 font-mono text-xs">
              <span className="font-bold text-foreground">[PERMANENT CAREER ARCHIVE]</span>
              <span className="text-[#fe7141] font-bold">LIFETIME ACCESS</span>
            </div>
            <ul className="space-y-2.5 font-mono text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[#fe7141] font-bold">✓</span>
                <span>Saved jobs remain permanently accessible for review</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#fe7141] font-bold">✓</span>
                <span>Recruitment pipeline stages (Applied → Shortlisted → Selected)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#fe7141] font-bold">✓</span>
                <span>Record coding assessment links and interview notes freely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#fe7141] font-bold">✓</span>
                <span>Zero recurring fees. Buy another pass only when searching anew</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 03: Four-Step Execution */}
      <section className="space-y-6 pt-4">
        {/* Hairline Section Divider */}
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold">03 //</span>
            <span className="uppercase tracking-wider font-semibold">STUDENT WORKFLOW</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">[ZERO_RESUME_PARSING_ERRORS]</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold">[STEP 01]</span>
            <h3 className="font-bold text-sm text-foreground">PROFILE</h3>
            <p className="text-muted-foreground leading-relaxed">
              Specify degree, branch, passing year, and technical skills. No resume upload required.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold">[STEP 02]</span>
            <h3 className="font-bold text-sm text-foreground">₹199 PASS</h3>
            <p className="text-muted-foreground leading-relaxed">
              Instant activation via UPI QR or Card. A single flat fee with zero recurring monthly charges.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold">[STEP 03]</span>
            <h3 className="font-bold text-sm text-foreground">DISCOVERY</h3>
            <p className="text-muted-foreground leading-relaxed">
              Inspect transparent match breakdown, check criteria, and apply directly to employer portals.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-2">
            <span className="text-[11px] text-[#fe7141] font-bold">[STEP 04]</span>
            <h3 className="font-bold text-sm text-foreground">ARCHIVE</h3>
            <p className="text-muted-foreground leading-relaxed">
              Discovery locks after 24h, but your applications, status updates, and notes remain permanent.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Architectural Callout */}
      <section className="p-8 sm:p-12 rounded-lg border border-black/15 dark:border-white/20 bg-card text-center space-y-5">
        <div className="inline-block font-mono text-[11px] text-[#fe7141] font-bold border border-[#fe7141]/30 bg-[#fe7141]/10 px-2.5 py-1 rounded-xs">
          [TIME_BOXED_DISCOVERY // LIFETIME_RETENTION]
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground font-sans">
          Ready for your 24-hour job hunt?
        </h2>
        <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
          ₹199 unlocks the complete fresher database and AI match breakdown instantly. Keep application records forever.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="font-mono text-xs font-bold px-6 py-3 rounded-sm bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>[ UNLOCK 24-HOUR PASS — ₹199 ]</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
