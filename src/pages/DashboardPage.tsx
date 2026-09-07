import React, { useState, useMemo } from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  Clock,
  Zap,
  Sparkles,
  Briefcase,
  Laptop,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  Lock,
  User,
} from 'lucide-react'

interface DashboardPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectJob }) => {
  const {
    student,
    jobs,
    isPassActive,
    remainingTime,
    savedJobs,
    applications,
    setIsPaymentModalOpen,
    setCurrentView,
  } = useApp()

  const [mountTime] = useState(() => Date.now())
  const totalMatchedJobs = jobs.length
  const highMatchJobs = useMemo(() => jobs.filter((j) => j.match.score >= 85).length, [jobs])
  const remoteJobs = useMemo(() => jobs.filter((j) => j.work_mode === 'Remote').length, [jobs])
  const jobsPostedToday = useMemo(() => {
    return jobs.filter((j) => {
      const postedTime = new Date(j.posted_at).getTime()
      return mountTime - postedTime < 24 * 3600 * 1000
    }).length
  }, [jobs, mountTime])

  const recommendedJobs = jobs.slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header / Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#fe7141] font-bold">[STUDENT_PORTAL]</span>
            <span className="font-mono text-xs text-muted-foreground">/</span>
            <span className="font-mono text-xs text-muted-foreground">{student.graduation_year} BATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            {student.degree} · {student.college}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('profile')}
          className="font-mono text-xs px-3 py-2 rounded-sm border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors text-foreground flex items-center gap-1.5 self-start sm:self-auto"
        >
          <User className="w-3.5 h-3.5" />
          <span>[ UPDATE CANDIDATE PROFILE ]</span>
        </button>
      </div>

      {/* Main Situation & 24-Hour Pass Hairline Block */}
      <div className="rounded-lg border border-black/15 dark:border-white/20 bg-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground uppercase">[STATUS]</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded-xs ${
                  isPassActive
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {isPassActive ? '24-HOUR PASS ACTIVE' : 'PASS EXPIRED / SEARCH LOCKED'}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 mt-2">
              <Clock className={`w-4 h-4 shrink-0 ${isPassActive ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight tabular-nums text-foreground">
                {isPassActive ? (
                  <span>
                    ⏱ {remainingTime.hours}H {remainingTime.minutes}M {remainingTime.seconds}S REMAINING
                  </span>
                ) : (
                  <span className="text-base text-muted-foreground font-medium">
                    New job search is locked. Saved jobs & tracker remain permanent.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            {isPassActive ? (
              <button
                type="button"
                onClick={() => setCurrentView('jobs')}
                className="font-mono text-xs font-bold px-4 py-2.5 rounded-sm bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <span>[ BROWSE ALL JOBS ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="font-mono text-xs font-bold px-4 py-2.5 rounded-sm bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>[ UNLOCK 24 HOURS — ₹199 ]</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Swiss Metric Data Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-sm bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> TOTAL MATCHED
            </span>
            <div className="text-2xl font-black tabular-nums text-foreground">{totalMatchedJobs}</div>
            <span className="text-[10px] text-muted-foreground block">for your degree & skills</span>
          </div>

          <div className="p-3.5 rounded-sm bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3" /> HIGH MATCH (&gt;85%)
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {highMatchJobs}
            </div>
            <span className="text-[10px] text-muted-foreground block">highest skill fit</span>
          </div>

          <div className="p-3.5 rounded-sm bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Laptop className="w-3 h-3" /> REMOTE ROLES
            </span>
            <div className="text-2xl font-black tabular-nums text-foreground">{remoteJobs}</div>
            <span className="text-[10px] text-muted-foreground block">pan-India / WFH</span>
          </div>

          <div className="p-3.5 rounded-sm bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 space-y-1">
            <span className="text-[10px] text-[#fe7141] uppercase flex items-center gap-1 font-bold">
              <Flame className="w-3 h-3" /> POSTED TODAY
            </span>
            <div className="text-2xl font-black text-[#fe7141] tabular-nums">
              {jobsPostedToday}
            </div>
            <span className="text-[10px] text-muted-foreground block">curated in last 24h</span>
          </div>
        </div>
      </div>

      {/* Permanent Archive Quick Access (Rule 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setCurrentView('saved')}
          className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-foreground">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <h3 className="text-xs font-bold text-foreground">[SAVED JOBS]</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  RULE 11: PERMANENT
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {savedJobs.length} opportunities bookmarked for later review
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div
          onClick={() => setCurrentView('applications')}
          className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-foreground">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <h3 className="text-xs font-bold text-foreground">[APPLICATION TRACKER]</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  RULE 11: PERMANENT
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {applications.length} applications in recruitment pipeline
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#fe7141]">02 //</span>
            <span className="font-bold text-foreground uppercase tracking-wider">TOP MATCHES FOR YOUR DEGREE</span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold hover:underline flex items-center gap-1 text-[#fe7141]"
          >
            <span>[ VIEW ALL ({jobs.length}) ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lock warning if expired */}
        {!isPassActive && (
          <div className="p-4 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>
                Your 24-hour pass has expired. Discovery is locked, but your saved jobs & tracker stay permanent.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1.5 rounded-sm bg-[#fe7141] hover:bg-[#e05828] text-white font-bold shrink-0 shadow-2xs"
            >
              [ UNLOCK 24H — ₹199 ]
            </button>
          </div>
        )}

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} />
          ))}
        </div>
      </div>
    </div>
  )
}
