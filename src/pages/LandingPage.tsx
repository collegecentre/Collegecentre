import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JobCard } from '@/components/JobCard'
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Layers,
  Search,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsPaymentModalOpen, isPassActive, jobs, setSelectedJob } = useApp()

  // Sample top 4 jobs to showcase authentic product utility immediately
  const sampleJobs = jobs.slice(0, 4)

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-4 text-center max-w-3xl mx-auto space-y-6">
        {/* Crisp Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Curated for 2024, 2025 & 2026 Graduates</span>
        </div>

        {/* Clean, Confident Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
          Find verified fresher jobs, without the subscription trap.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CollegeCentre aggregates verified entry-level roles, ranks them against your degree and skills, and links directly to official employer portals. Pay ₹199 once for 24 hours of search—your saved jobs and application history stay permanent forever.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isPassActive ? (
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-2"
              onClick={() => setCurrentView('dashboard')}
            >
              <span>Go to Active Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-2"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Unlock 24-Hour Pass · ₹199</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-11 px-6 text-sm font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setCurrentView('pricing')}
          >
            How the Pass Works
          </Button>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Instant UPI & Card access
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            No recurring monthly auto-debit
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Applications never locked or deleted
          </span>
        </div>
      </section>

      {/* Real Product Utility: Live Job Feed Preview */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recently Curated Fresher Openings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Real entry-level positions verified with direct company application URLs
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isPassActive ? setCurrentView('jobs') : setIsPaymentModalOpen(true))}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 self-start sm:self-auto gap-1"
          >
            <span>{isPassActive ? 'Search all openings' : 'Unlock full database (150+)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
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

      {/* The Honest Model: Why 24 Hours? */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            The Philosophy
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Designed for high-focus sprints, not passive billing.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Most students don't need a ₹1,499 monthly subscription. Job hunting happens in dedicated 1-2 day sprints—on weekends, right after exams, or during placement drives. With CollegeCentre, you pay ₹199 when you are ready to apply.
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active 24 Hours */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>DURING YOUR 24-HOUR PASS (₹199)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Search & Filter:</strong> Full access to search 150+ verified entry-level roles.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>AI Profile Matching:</strong> Real-time match scoring against your degree and skills.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Direct Applications:</strong> Open official employer application links without intermediaries.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bookmark Opportunities:</strong> Save interesting roles to your permanent library.</span>
              </li>
            </ul>
          </div>

          {/* After Expiration (Rule 11) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>AFTER 24 HOURS (LIFETIME ACCESS)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Saved Jobs Never Expire:</strong> Return anytime to review jobs you bookmarked.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Recruitment Pipeline:</strong> Update stages (Applied → Shortlisted → Selected).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Interview Notes:</strong> Record coding test links, interview dates, and notes for free.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Recurring Charge:</strong> Only purchase another pass when you want new job discovery.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Simple 4-Step Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No resume parsing errors. Direct, deterministic matching from your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Set Profile</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add your college degree, branch, passing year, and technical skills. No resume upload required.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pay ₹199</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant activation via UPI QR or Card. A single flat fee with zero monthly auto-renewal traps.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Discover & Apply</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inspect transparent match scores, view verified role requirements, and apply directly to employer sites.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Track Forever</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pass expires after 24 hours, but your saved jobs, status updates, and notes remain permanent.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Card */}
      <section className="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready for your 24-hour job hunt?
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Unlock 150+ fresher opportunities and transparent match percentages for ₹199. Keep your application records forever.
        </p>

        <div className="pt-2">
          <Button
            size="lg"
            className="h-11 px-8 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm gap-2"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Unlock 24 Hours for ₹199</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
