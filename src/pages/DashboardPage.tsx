import React from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { MetricStatCard } from '@/components/enterprise/MetricStatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Zap,
  Sparkles,
  Briefcase,
  Laptop,
  Flame,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Lock,
  User,
  ShieldCheck,
  TrendingUp,
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

  const totalMatchedJobs = jobs.length
  const highMatchJobs = jobs.filter((j) => j.match.score >= 85).length
  const remoteJobs = jobs.filter((j) => j.work_mode === 'Remote').length
  const jobsPostedToday = jobs.filter((j) => {
    const postedTime = new Date(j.posted_at).getTime()
    return Date.now() - postedTime < 24 * 3600 * 1000
  }).length

  const recommendedJobs = jobs.slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Welcome & Profile Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Welcome back, {student.name.split(' ')[0]}!
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {student.graduation_year} Batch
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {student.degree} · {student.college}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView('profile')}
            className="text-xs gap-1.5 h-9 font-semibold hover:bg-accent"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Skills</span>
          </Button>
        </div>
      </div>

      {/* Main Situation & 24-Hour Pass Hero Banner */}
      <div
        className={`rounded-3xl border p-6 sm:p-7 space-y-6 shadow-sm transition-[border-color,background-color] ${
          isPassActive
            ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-indigo-700/60 shadow-xl'
            : 'bg-card border-border text-card-foreground'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider opacity-80">
                Your Job Hunt Sprint
              </span>
              <Badge
                className={
                  isPassActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs font-bold'
                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40 text-xs font-bold'
                }
              >
                24-HOUR PASS
              </Badge>
            </div>

            <div className="flex items-center gap-2.5 mt-2.5">
              <Clock className={`w-5 h-5 shrink-0 ${isPassActive ? 'text-emerald-400' : 'text-amber-500'}`} />
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums">
                {isPassActive ? (
                  <span>
                    ⏱ {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s remaining
                  </span>
                ) : (
                  <span className="text-foreground font-sans text-lg font-bold">
                    Pass Expired / Discovery Locked
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            {isPassActive ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('jobs')}
                className="gap-2 bg-white text-indigo-950 hover:bg-slate-100 font-bold shadow-xs h-10 px-5"
              >
                <span>Browse All Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
                className="h-10 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-1.5"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Unlock 24 Hours for ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 4 Metric Cards (Mantine Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs opacity-75 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Total Matched
            </span>
            <div className="text-2xl sm:text-3xl font-black tabular-nums">{totalMatchedJobs}</div>
            <span className="text-[11px] opacity-70 block">tailored to profile</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs opacity-75 flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> High Match (&gt;85%)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {highMatchJobs}
            </div>
            <span className="text-[11px] opacity-70 block">top skill alignment</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs opacity-75 flex items-center gap-1.5 text-indigo-300">
              <Laptop className="w-3.5 h-3.5" /> Remote Roles
            </span>
            <div className="text-2xl sm:text-3xl font-black tabular-nums">{remoteJobs}</div>
            <span className="text-[11px] opacity-70 block">pan-India / WFH</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs opacity-75 flex items-center gap-1.5 text-amber-300">
              <Flame className="w-3.5 h-3.5" /> Posted Today
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
              {jobsPostedToday}
            </div>
            <span className="text-[11px] opacity-70 block">in the last 24h</span>
          </div>
        </div>
      </div>

      {/* Permanent Tracker Quick Access (Ant Design / HeroUI inspired) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setCurrentView('saved')}
          className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-indigo-400/50 hover:shadow-md transition-[border-color,box-shadow] cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-foreground">Saved Jobs</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Permanent
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {savedJobs.length} opportunities saved for later review
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div
          onClick={() => setCurrentView('applications')}
          className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-emerald-400/50 hover:shadow-md transition-[border-color,box-shadow] cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-foreground">Application Tracker</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Permanent
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {applications.length} applications in recruitment stages
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-foreground">Recommended for You</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by AI match percentage based on your technical skills, branch & graduation year
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold text-primary hover:text-primary gap-1"
          >
            <span>View all ({jobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Lock alert if expired */}
        {!isPassActive && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Your 24-hour Job Hunt Pass has expired. Unlock for ₹199 to search and apply to new openings.
              </span>
            </div>
            <Button
              variant="premium"
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs h-8 px-4 font-bold shrink-0"
            >
              Unlock for ₹199
            </Button>
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
