import React, { useState, useMemo } from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import {
  Sparkles,
  Briefcase,
  Laptop,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  User,
} from 'lucide-react'

interface DashboardPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectJob }) => {
  const {
    student,
    jobs,
    savedJobs,
    applications,
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
            <span className="font-mono text-xs text-[#fe7141] font-bold">Student Portal</span>
            <span className="font-mono text-xs text-muted-foreground">/</span>
            <span className="font-mono text-xs text-muted-foreground">{student.graduation_year} BATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            {student.name ? `Welcome back, ${student.name.split(' ')[0]}` : 'Welcome to your Career Desk'}
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            {student.degree} {student.college ? `· ${student.college}` : '· College Placement & Fresher Matching'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('profile')}
          className="font-mono text-xs px-3 py-2 rounded-sm border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors text-foreground flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Update Profile</span>
        </button>
      </div>

      {/* Main Situation & Platform Overview Block */}
      <div className="rounded-lg border border-black/15 dark:border-white/20 bg-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground uppercase">Access Tier:</span>
              <span className="font-bold px-1.5 py-0.2 rounded-xs bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                100% FREE UNRESTRICTED
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 mt-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-foreground">
                All Verified Fresher Openings Unlocked
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Direct employer applications, real-time criteria match scores, and permanent pipeline tracking.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setCurrentView('jobs')}
              className="font-mono text-xs font-bold px-4 py-2.5 rounded-sm bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                <h3 className="text-xs font-bold text-foreground">Saved Jobs</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Permanent Archive
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
                <h3 className="text-xs font-bold text-foreground">Application Tracker</h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Permanent Archive
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
            <span className="font-bold text-[#fe7141]">02.</span>
            <span className="font-bold text-foreground uppercase tracking-wider">TOP MATCHES FOR YOUR DEGREE</span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-bold hover:underline flex items-center gap-1 text-[#fe7141]"
          >
            <span>View All ({jobs.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
