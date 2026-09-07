import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { ApplicationStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
} from 'lucide-react'

export const ApplicationsPage: React.FC = () => {
  const { applications, jobs, changeAppStatus, deleteApp } = useApp()
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All')
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

  const filteredApplications = applications.filter((app) => {
    if (selectedStatusTab === 'All') return true
    return app.status === selectedStatusTab
  })

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
        return <Badge variant="success" className="font-bold">🎉 Selected / Offered</Badge>
      case 'Shortlisted':
        return <Badge variant="matchHigh" className="font-bold">⭐ Shortlisted</Badge>
      case 'Assessment':
        return <Badge variant="matchMid" className="font-bold">📝 Assessment / Test</Badge>
      case 'Applied':
        return <Badge variant="secondary" className="font-semibold text-foreground">📨 Applied</Badge>
      case 'Rejected':
        return <Badge variant="destructive">Declined / Rejected</Badge>
      case 'Saved':
      default:
        return <Badge variant="outline">📌 Saved to Apply</Badge>
    }
  }

  const handleStartEditNotes = (appId: string, currentNotes: string = '') => {
    setEditingNotesId(appId)
    setTempNotes(currentNotes)
  }

  const handleSaveNotes = (appId: string, currentStatus: ApplicationStatus) => {
    changeAppStatus(appId, currentStatus, tempNotes)
    setEditingNotesId(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Application Tracker
            </h1>
            <Badge variant="matchMid" className="text-xs">
              {applications.length} Total Records
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your recruitment stages, update statuses, and record interview notes forever.
          </p>
        </div>
      </div>

      {/* Permanent Data Guarantee Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:bg-emerald-950/30 dark:border-emerald-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
            Permanent Lifetime Application Tracker
          </h4>
          <p className="text-emerald-800/90 dark:text-emerald-300 leading-relaxed">
            As guaranteed by CollegeCentre, your application history is permanent. You can return two weeks or months later to change <strong>Applied → Shortlisted</strong> or <strong>Applied → Selected</strong> without buying another pass. Passes are only required when discovering new jobs.
          </p>
        </div>
      </div>

      {/* Status Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedStatusTab('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedStatusTab === 'All'
              ? 'bg-foreground text-background font-bold'
              : 'bg-muted text-muted-foreground hover:text-foreground'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{stage}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected
                      ? 'bg-indigo-800 text-white'
                      : 'bg-background text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed bg-muted/20 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-foreground">No applications in this stage</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Apply to jobs from your active dashboard or search feed, and they will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const job = jobs.find((j) => j.id === app.job_id)
            const isEditingNotes = editingNotesId === app.id

            return (
              <Card
                key={app.id}
                className="overflow-hidden border border-border/80 shadow-xs hover:border-indigo-200 transition-colors"
              >
                <CardContent className="p-4 sm:p-5 space-y-4">
                  {/* Top Row: Job Title, Company, Status, and Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border flex items-center justify-center text-xl shrink-0 dark:bg-slate-800">
                        {job?.company_logo || '🏢'}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground">
                          {job?.title || 'Fresher Role'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="font-semibold text-foreground">{job?.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job?.location}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold dark:text-emerald-400">
                            {job?.salary}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(app.status)}
                      <button
                        onClick={() => deleteApp(app.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete application record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stage Transition Buttons */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                        Move Status Stage:
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {statusStages.map((stage) => {
                        const isCurrent = app.status === stage
                        return (
                          <button
                            key={stage}
                            onClick={() => changeAppStatus(app.id, stage, app.notes)}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white font-bold shadow-xs scale-105'
                                : 'bg-background border border-border text-foreground hover:bg-accent'
                            }`}
                          >
                            {stage}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Personal Notes / Interview Tracker */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        Interview Notes & Reminders:
                      </span>
                      {!isEditingNotes && (
                        <button
                          onClick={() => handleStartEditNotes(app.id, app.notes)}
                          className="text-primary hover:underline flex items-center gap-1 font-medium text-[11px]"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit Note
                        </button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <Textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="e.g. Completed round 1 coding test, next round on Thursday with engineering manager..."
                          className="text-xs bg-background"
                          rows={3}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNotesId(null)}
                            className="h-7 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSaveNotes(app.id, app.status)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save Note
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/80 bg-background/60 p-2.5 rounded-lg border border-border/50 italic leading-relaxed">
                        {app.notes || 'No notes added yet. Click edit to record interview dates and test links.'}
                      </p>
                    )}
                  </div>

                  {/* External Company Link */}
                  {job?.application_url && (
                    <div className="pt-2 flex justify-end">
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        <span>Re-open Company Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
