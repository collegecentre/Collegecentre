import React from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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

  // Calculate live stats
  const totalMatchedJobs = jobs.length
  const highMatchJobs = jobs.filter((j) => j.match.score >= 85).length
  const remoteJobs = jobs.filter((j) => j.work_mode === 'Remote').length
  const jobsPostedToday = jobs.filter((j) => {
    const postedTime = new Date(j.posted_at).getTime()
    return Date.now() - postedTime < 24 * 3600 * 1000
  }).length

  // High match recommendations (top 6)
  const recommendedJobs = jobs.slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Welcome & Student Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Welcome back, {student.name.split(' ')[0]}!
            </h1>
            <Badge variant="outline" className="text-xs">
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
            className="text-xs gap-1.5 h-9"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profile & Skills</span>
          </Button>
        </div>
      </div>

      {/* Main Situation & 24-Hour Pass Status Card */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 shadow-sm transition-all ${
          isPassActive
            ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white border-indigo-700/50'
            : 'bg-card border-border text-card-foreground'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 dark:border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                Your Job Hunt
              </span>
              <Badge
                className={
                  isPassActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs font-bold'
                    : 'bg-amber-500/20 text-amber-600 border-amber-400/40 text-xs font-bold dark:text-amber-300'
                }
              >
                24-HOUR PASS
              </Badge>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Clock className={`w-5 h-5 ${isPassActive ? 'text-emerald-400' : 'text-amber-500'}`} />
              <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
                {isPassActive ? (
                  `⏱ ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s remaining`
                ) : (
                  <span className="text-muted-foreground">Pass Expired / Inactive</span>
                )}
              </span>
            </div>
          </div>

          <div>
            {isPassActive ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('jobs')}
                className="gap-2 bg-white text-indigo-950 hover:bg-slate-100 font-bold"
              >
                <span>Browse All Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="premium"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
                className="gap-2 text-xs font-bold h-10 px-5 shadow-lg shadow-indigo-500/25"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Unlock for ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 4 Key Situation Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Total Matched</span>
            </div>
            <p className="text-2xl font-black">{totalMatchedJobs} jobs</p>
            <p className="text-[11px] opacity-70">filtered for your profile</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>High-Match Jobs</span>
            </div>
            <p className="text-2xl font-black text-emerald-400">{highMatchJobs} jobs</p>
            <p className="text-[11px] opacity-70">&gt; 85% skill alignment</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Laptop className="w-3.5 h-3.5 text-indigo-300" />
              <span>Remote Opportunities</span>
            </div>
            <p className="text-2xl font-black">{remoteJobs} jobs</p>
            <p className="text-[11px] opacity-70">work from anywhere</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Posted Today</span>
            </div>
            <p className="text-2xl font-black text-amber-300">{jobsPostedToday} fresh</p>
            <p className="text-[11px] opacity-70">last 24 hours</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts (Permanent Tracker Access) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          onClick={() => setCurrentView('saved')}
          className="cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all bg-card"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Saved Jobs</h3>
                <p className="text-xs text-muted-foreground">
                  {savedJobs.length} jobs saved permanently
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card
          onClick={() => setCurrentView('applications')}
          className="cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all bg-card"
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Application Tracker</h3>
                <p className="text-xs text-muted-foreground">
                  {applications.length} applications in pipeline
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Recommended for You Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-foreground">Recommended for You</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by AI matching score against your education, skills, and preferences
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('jobs')}
            className="text-xs font-semibold text-primary hover:text-primary gap-1"
          >
            <span>View all ({jobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Lock overlay if pass is expired */}
        {!isPassActive && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
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
