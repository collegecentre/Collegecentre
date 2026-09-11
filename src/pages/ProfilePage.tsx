import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { StudentProfile, WorkMode } from '@/types'
import { Input } from '@/components/ui/input'
import {
  X,
  Save,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { student, updateStudent, setCurrentView, setIsPaymentModalOpen } = useApp()
  const [formData, setFormData] = useState<StudentProfile>(student)

  useEffect(() => {
    setFormData(student)
  }, [student])
  const [newSkill, setNewSkill] = useState<string>('')
  const [newLocation, setNewLocation] = useState<string>('')
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false)

  const availableModes: WorkMode[] = ['Remote', 'Hybrid', 'Onsite']

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    if (formData.skills.includes(newSkill.trim())) return
    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill.trim()],
    })
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    })
  }

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocation.trim()) return
    if (formData.preferred_locations.includes(newLocation.trim())) return
    setFormData({
      ...formData,
      preferred_locations: [...formData.preferred_locations, newLocation.trim()],
    })
    setNewLocation('')
  }

  const handleRemoveLocation = (locToRemove: string) => {
    setFormData({
      ...formData,
      preferred_locations: formData.preferred_locations.filter((l) => l !== locToRemove),
    })
  }

  const toggleWorkMode = (mode: WorkMode) => {
    const exists = formData.preferred_work_mode.includes(mode)
    const updated = exists
      ? formData.preferred_work_mode.filter((m) => m !== mode)
      : [...formData.preferred_work_mode, mode]
    setFormData({
      ...formData,
      preferred_work_mode: updated.length ? updated : ['Remote'],
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudent(formData)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 5000)
  }

  const isAcademicMissing = !formData.college?.trim() || !formData.degree?.trim()
  const isSkillsMissing = !formData.skills || formData.skills.length === 0
  const isProfileIncomplete = isAcademicMissing || isSkillsMissing

  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'academics' | 'skills' | 'preferences'>(
    isAcademicMissing ? 'academics' : 'all'
  )

  const profileTabs = [
    { id: 'all', label: 'All Sections' },
    { id: 'personal', label: '01. Personal' },
    { id: 'academics', label: '02. Academics' },
    { id: 'skills', label: '03. Skills Matrix' },
    { id: 'preferences', label: '04. Preferences' },
  ] as const

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Candidate Profile • Match Parameters
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Candidate Profile
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Direct criteria matching across graduation batch, degree discipline, and technical capabilities.
            </p>
          </div>

          {/* Primary Top Save Button */}
          <button
            type="submit"
            form="candidate-profile-form"
            className="px-6 py-3 bg-[#fe7141] hover:bg-[#e05828] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedFeedback ? '✓ Profile Updated' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Step 2 Onboarding Arrangement Banner (Shown after registration when profile is incomplete) */}
      {isProfileIncomplete && (
        <div className="border-2 border-[#fe7141] bg-[#fe7141]/10 p-5 font-mono text-xs text-foreground space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#fe7141] font-bold uppercase tracking-wider text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Step 2 of 2: Complete Your Job Profile</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5 border border-[#fe7141]/30 bg-card self-start sm:self-auto">
              Required for Matching & ₹199 Pass
            </span>
          </div>

          <p className="text-muted-foreground font-sans text-xs leading-relaxed">
            Welcome{formData.name ? `, ${formData.name}` : ''}! Your account has been registered. Now update your <strong>Institution & Degree</strong> (Section 02) and add your <strong>Technical Skills</strong> (Section 03) below so our engine can calculate your verified match score across 40+ curated fresher jobs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className={`p-2.5 border flex items-center gap-2 ${formData.name && formData.email ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
              <span className="font-bold">{formData.name && formData.email ? '✓' : '○'}</span>
              <span>1. Account Registered</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('academics')}
              className={`p-2.5 border flex items-center justify-between cursor-pointer transition-colors text-left ${formData.college && formData.degree ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-[#fe7141] bg-card text-[#fe7141] font-bold hover:bg-[#fe7141]/15'}`}
            >
              <div className="flex items-center gap-1.5">
                <span>{formData.college && formData.degree ? '✓' : '○'}</span>
                <span>2. Academics</span>
              </div>
              {(!formData.college || !formData.degree) && <span className="text-[9px] uppercase underline">Update now →</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`p-2.5 border flex items-center justify-between cursor-pointer transition-colors text-left ${formData.skills && formData.skills.length > 0 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-[#fe7141] bg-card text-[#fe7141] font-bold hover:bg-[#fe7141]/15'}`}
            >
              <div className="flex items-center gap-1.5">
                <span>{formData.skills && formData.skills.length > 0 ? '✓' : '○'}</span>
                <span>3. Skills ({formData.skills ? formData.skills.length : 0})</span>
              </div>
              {(!formData.skills || formData.skills.length === 0) && <span className="text-[9px] uppercase underline">Add skills →</span>}
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Banner with Post-Save Action Buttons */}
      {savedFeedback && (
        <div className="border border-emerald-500/50 bg-emerald-500/10 p-4 font-mono text-xs text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Profile and match criteria updated successfully!
              </div>
              <div className="text-[11px] text-muted-foreground font-sans">
                Real-time match scores recalculated across all curated openings.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentView('jobs')}
              className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-[11px] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
            >
              <span>View Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1.5 bg-[#fe7141] hover:bg-[#e05828] text-white font-bold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Unlock Pass</span>
            </button>
          </div>
        </div>
      )}

      {/* Zero Resume Guarantee Box */}
      <div className="border border-black/10 dark:border-white/15 p-4 sm:p-5 bg-muted/10 flex items-start gap-4 font-mono text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-foreground uppercase tracking-wider">
            DIRECT SPECIFICATION MATCHING · ZERO RESUME REQUIRED
          </div>
          <p className="text-muted-foreground font-sans text-xs leading-relaxed">
            Unlike traditional job boards that rely on faulty PDF resume parsers, CollegeCentre scores your fit transparently using your verified degree, graduation batch, technical skills matrix, and work mode preferences.
          </p>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-black/10 dark:border-white/15 font-mono text-xs">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 border whitespace-nowrap transition-colors uppercase tracking-wider ${
              activeTab === tab.id
                ? 'border-black dark:border-white bg-foreground text-background font-bold'
                : 'border-black/10 dark:border-white/15 text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form id="candidate-profile-form" onSubmit={handleSave} className="space-y-8">
        {/* Section 01: Personal Credentials */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                01. PERSONAL CREDENTIALS
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Identity Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="space-y-1.5">
                <label htmlFor="profile-full-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  id="profile-full-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu.in"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="profile-phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Mobile Number
                </label>
                <Input
                  id="profile-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 00000"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>
            </div>

            {activeTab === 'personal' && (
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  STEP 1 OF 4
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Personal Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('academics')}
                    className="px-4 py-2 border border-black dark:border-white hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                  >
                    Next: Academics →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 02: College & Academics */}
        {(activeTab === 'all' || activeTab === 'academics') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                02. COLLEGE & ACADEMIC DATA
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Degree & Graduation Batch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="space-y-1.5">
                <label htmlFor="profile-college" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Institution / University
                </label>
                <Input
                  id="profile-college"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. BITS Pilani / NIT / Anna University"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-degree" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Degree / Branch
                </label>
                <Input
                  id="profile-degree"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Computer Science & Engineering"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-education-level" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Education Level
                </label>
                <Input
                  id="profile-education-level"
                  value={formData.education_level}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                  placeholder="Undergraduate (B.Tech / B.E.)"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-grad-year" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Graduation Batch
                </label>
                <select
                  id="profile-grad-year"
                  value={formData.graduation_year}
                  onChange={(e) =>
                    setFormData({ ...formData, graduation_year: parseInt(e.target.value) })
                  }
                  className="w-full h-10 rounded-none border border-black/15 dark:border-white/20 bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                >
                  <option value={2027}>2027 (Pre-final year)</option>
                  <option value={2026}>2026 (Final year batch)</option>
                  <option value={2025}>2025 (Fresher / Graduated)</option>
                  <option value={2024}>2024 (0-1 yrs experience)</option>
                </select>
              </div>
            </div>

            {activeTab === 'academics' && (
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('personal')}
                  className="px-4 py-2 border border-black/20 dark:border-white/20 hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                >
                  ← Prev: Personal
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Academics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="px-4 py-2 border border-black dark:border-white hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                  >
                    Next: Skills →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 03: Technical Skills Matrix */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                03. TECHNICAL SKILLS MATRIX
              </div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">
                Weight: 40% of Match Score
              </div>
            </div>

            <div className="space-y-4 font-mono">
              <div className="flex flex-wrap gap-1.5 min-h-12 p-3 border border-black/10 dark:border-white/15 bg-muted/10">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2 py-1 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs uppercase"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove skill ${skill}`}
                      className="hover:text-vermilion p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  id="profile-new-skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Type skill (React, Python, PostgreSQL, Docker) and press Enter..."
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs uppercase placeholder:normal-case"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 border border-black dark:border-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/40 transition-colors shrink-0"
                >
                  + Add Skill
                </button>
              </div>
            </div>

            {activeTab === 'skills' && (
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('academics')}
                  className="px-4 py-2 border border-black/20 dark:border-white/20 hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                >
                  ← Prev: Academics
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Skills</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preferences')}
                    className="px-4 py-2 border border-black dark:border-white hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                  >
                    Next: Preferences →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 04: Location & Work Mode Preferences */}
        {(activeTab === 'all' || activeTab === 'preferences') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                04. LOCATION & WORK PREFERENCES
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Geography & Commute
              </span>
            </div>

            {/* Work Mode */}
            <div className="space-y-2 font-mono">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Target Work Mode
              </label>
              <div className="flex flex-wrap gap-2">
                {availableModes.map((mode) => {
                  const isSelected = formData.preferred_work_mode.includes(mode)
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleWorkMode(mode)}
                      className={`px-4 py-2 text-xs border uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'border-black dark:border-white bg-foreground text-background font-bold'
                          : 'border-black/15 dark:border-white/20 text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      {mode.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-2 font-mono">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Target Metro Regions
              </label>
              <div className="flex flex-wrap gap-1.5">
                {formData.preferred_locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-2 py-1 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs uppercase"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="hover:text-vermilion p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Input
                  id="profile-new-city"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add city (Bengaluru, Hyderabad, Pune, Remote)..."
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs uppercase placeholder:normal-case"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddLocation(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 border border-black dark:border-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/40 transition-colors shrink-0"
                >
                  + Add City
                </button>
              </div>
            </div>

            {activeTab === 'preferences' && (
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('skills')}
                  className="px-4 py-2 border border-black/20 dark:border-white/20 hover:bg-muted/40 text-xs font-bold uppercase tracking-wider"
                >
                  ← Prev: Skills
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Save & Update Bar */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="space-y-0.5 text-left w-full sm:w-auto">
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">
              COMMIT CANDIDATE PROFILE CHANGES
            </div>
            <p className="text-[11px] text-muted-foreground">
              Saving recalculates match scores across all active curated fresher openings immediately.
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto h-12 px-10 font-mono text-xs font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savedFeedback ? '✓ Profile Saved' : 'Save Profile'}</span>
          </button>
        </div>
      </form>

      {/* Sticky Floating Save Trigger (Always visible while editing any option) */}
      <div className="sticky bottom-6 z-20 flex justify-end pointer-events-none">
        <div className="pointer-events-auto border border-black/20 dark:border-white/25 bg-background/95 backdrop-blur-md p-2 shadow-xl flex items-center gap-3 font-mono">
          <span className="text-[11px] text-muted-foreground uppercase hidden md:inline px-2 font-bold">
            CANDIDATE SPECIFICATION
          </span>
          <button
            type="submit"
            form="candidate-profile-form"
            className="px-6 py-2.5 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedFeedback ? '✓ Profile Saved' : 'Save Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}


