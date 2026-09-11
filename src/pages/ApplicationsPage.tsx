import React, { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { ApplicationStatus } from '@/types'
import { ApplicationTimeline } from '@/components/enterprise/ApplicationTimeline'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  CheckCircle2,
  MapPin,
  FileText,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Edit3,
  Check,
  Search,
  X,
  Briefcase,
} from 'lucide-react'

export const ApplicationsPage: React.FC = () => {
  const { applications, jobs, changeAppStatus, deleteApp, setCurrentView } = useApp()
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState<string>('')

  const statusStages: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Shortlisted',
    'Assessment',
    'Selected',
    'Rejected',
  ]

  const stats = useMemo(() => {
    return {
      applied: applications.filter((a) => a.status === 'Applied').length,
      shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
      assessment: applications.filter((a) => a.status === 'Assessment').length,
      selected: applications.filter((a) => a.status === 'Selected').length,
    }
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (selectedStatusTab !== 'All' && app.status !== selectedStatusTab) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const job = jobs.find((j) => j.id === app.job_id)
        const matchesTitle = job?.title.toLowerCase().includes(q)
        const matchesCompany = job?.company.toLowerCase().includes(q)
        const matchesNotes = app.notes?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesCompany && !matchesNotes) return false
      }
      return true
    })
  }, [applications, selectedStatusTab, searchQuery, jobs])

  const handleStartEditNotes = (appId: string, currentNotes: string = '') => {
    setEditingNotesId(appId)
    setTempNotes(currentNotes)
  }

  const handleSaveNotes = (appId: string, currentStatus: ApplicationStatus) => {
    changeAppStatus(appId, currentStatus, tempNotes)
    setEditingNotesId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Permanent Pipeline • Interview Tracker
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your interview pipeline, update recruiter progress, and record interview notes forever.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('jobs')}
              className="px-3.5 py-1.5 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-mono font-bold uppercase tracking-wider rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Discover More Jobs</span>
            </button>
            <div className="font-mono text-xs px-3 py-1.5 border border-black/10 dark:border-white/15 bg-muted/20 text-foreground">
              {applications.length} Tracked
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Metric Counters HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="border border-black/10 dark:border-white/15 p-3.5 bg-muted/10 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Applied Roles
          </span>
          <div className="text-xl font-black text-foreground tabular-nums">
            {stats.applied}
          </div>
        </div>
        <div className="border border-black/10 dark:border-white/15 p-3.5 bg-muted/10 space-y-1">
          <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
            Shortlisted
          </span>
          <div className="text-xl font-black text-foreground tabular-nums">
            {stats.shortlisted}
          </div>
        </div>
        <div className="border border-black/10 dark:border-white/15 p-3.5 bg-muted/10 space-y-1">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider">
            Assessments / Rounds
          </span>
          <div className="text-xl font-black text-foreground tabular-nums">
            {stats.assessment}
          </div>
        </div>
        <div className="border border-black/10 dark:border-white/15 p-3.5 bg-muted/10 space-y-1">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
            Offers / Selected
          </span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.selected}
          </div>
        </div>
      </div>

      {/* Permanent Access Guarantee Banner */}
      <div className="border border-black/10 dark:border-white/15 p-4 sm:p-5 bg-muted/10 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Rule 11: Lifetime Pipeline Access Guarantee
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your application history and stages are permanently accessible. You can return weeks or months later to transition roles from <span className="font-mono font-bold text-foreground">Applied</span> to <span className="font-mono font-bold text-foreground">Shortlisted</span> or <span className="font-mono font-bold text-foreground">Selected</span> without purchasing another pass. Passes are only required for discovering new opportunities.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3 font-mono text-xs">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="FILTER APPLIED ROLES BY COMPANY, ROLE, OR NOTES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs font-mono bg-card border-black/15 dark:border-white/20 rounded-none uppercase"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Stage Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-black/10 dark:border-white/15">
          <button
            onClick={() => setSelectedStatusTab('All')}
            className={`px-3 py-1.5 border transition-colors uppercase tracking-wider ${
              selectedStatusTab === 'All'
                ? 'border-black dark:border-white bg-foreground text-background font-bold'
                : 'border-black/10 dark:border-white/15 text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({applications.length})
          </button>

          {statusStages.map((stage) => {
            const count = applications.filter((a) => a.status === stage).length
            const isSelected = selectedStatusTab === stage
            return (
              <button
                key={stage}
                onClick={() => setSelectedStatusTab(stage)}
                className={`px-3 py-1.5 border whitespace-nowrap transition-colors uppercase tracking-wider flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-vermilion bg-vermilion text-white font-bold'
                    : 'border-black/10 dark:border-white/15 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{stage.toUpperCase()}</span>
                {count > 0 && <span className="text-[10px] opacity-80">({count})</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="p-16 text-center border border-black/10 dark:border-white/15 bg-muted/10 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
            NO APPLICATIONS RECORDED IN THIS STAGE
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Apply to jobs from your active feed or dashboard to track recruiter milestones here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const job = jobs.find((j) => j.id === app.job_id)
            const isEditingNotes = editingNotesId === app.id

            return (
              <div
                key={app.id}
                className="border border-black/10 dark:border-white/15 bg-card p-5 sm:p-6 space-y-5"
              >
                {/* Top Row: Job Title, Company, Controls */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="font-bold text-foreground">{job?.company}</span>
                      <span>//</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job?.location}
                      </span>
                      <span>//</span>
                      <span className="text-vermilion font-bold">{job?.salary}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {job?.title || 'Fresher Position'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                    <span className="px-2.5 py-1 border border-black/15 dark:border-white/15 bg-muted/20 text-foreground font-bold uppercase">
                      {app.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteApp(app.id)}
                      className="p-1.5 border border-black/10 dark:border-white/15 text-muted-foreground hover:text-red-600 hover:border-red-500/30 transition-colors"
                      title="Delete application record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Timeline Stepper */}
                <ApplicationTimeline
                  application={app}
                  onStatusChange={(newStatus) => changeAppStatus(app.id, newStatus, app.notes)}
                  onEditNotes={() => handleStartEditNotes(app.id, app.notes)}
                />

                {/* Personal Notes / Interview Tracker */}
                <div className="space-y-2 border-t border-black/10 dark:border-white/10 pt-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-vermilion" />
                      Interview Logs & Test Links:
                    </span>
                    {!isEditingNotes && (
                      <button
                        onClick={() => handleStartEditNotes(app.id, app.notes)}
                        className="text-foreground hover:text-vermilion underline flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Log
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2 font-mono">
                      <Textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="e.g. Completed round 1 coding test, next round on Thursday with engineering manager..."
                        className="text-xs bg-background rounded-none border-black/20 dark:border-white/20 font-mono"
                        rows={3}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 border border-black/15 dark:border-white/15 text-xs text-muted-foreground hover:bg-muted/40 uppercase tracking-wider"
                        >
                          CANCEL
                        </button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveNotes(app.id, app.status)}
                          className="h-8 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-foreground text-background rounded-none border-0 gap-1"
                        >
                          <Check className="w-3 h-3" />
                          SAVE LOG
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground/90 bg-muted/10 p-3 border border-black/5 dark:border-white/10 font-mono leading-relaxed">
                      {app.notes || 'No notes recorded yet. Click "Edit Log" to add interview details or test links.'}
                    </p>
                  )}
                </div>

                {/* External Portal Link */}
                {job?.application_url && (
                  <div className="pt-1 flex justify-end font-mono">
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-vermilion hover:underline font-bold uppercase tracking-wider"
                    >
                      <span>RE-OPEN COMPANY APPLICATION PORTAL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

