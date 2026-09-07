import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { StudentProfile, WorkMode } from '@/types'
import { Input } from '@/components/ui/input'
import {
  Plus,
  X,
  Save,
  ShieldCheck,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { student, updateStudent } = useApp()
  const [formData, setFormData] = useState<StudentProfile>(student)
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
    setTimeout(() => setSavedFeedback(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          [STUDENT_RECORD // MATCH_PARAMETERS]
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

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-vermilion hover:bg-vermilion-hover text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            {savedFeedback ? '[✓ SAVED]' : '[SAVE PARAMETERS →]'}
          </button>
        </div>
      </div>

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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 01: Personal Credentials */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-4">
          <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-black/10 dark:border-white/10">
            01 // PERSONAL CREDENTIALS
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
                placeholder="Aarav Sharma"
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
                placeholder="+91 98765 43210"
                className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 02: College & Academics */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-4">
          <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-black/10 dark:border-white/10">
            02 // COLLEGE & ACADEMIC DATA
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
                placeholder="National Institute of Technology"
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
        </div>

        {/* Section 03: Technical Skills Matrix */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-4">
          <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
            <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              03 // TECHNICAL SKILLS MATRIX
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase">
              [WEIGHT: 40% OF AI MATCH SCORE]
            </div>
          </div>

          <div className="space-y-4 font-mono">
            <div className="flex flex-wrap gap-1.5 min-h-12 p-3 border border-black/10 dark:border-white/15 bg-muted/10">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2 py-1 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs uppercase"
                >
                  <span>[{skill}]</span>
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
                placeholder="TYPE SKILL (REACT, PYTHON, POSTGRESQL, DOCKER) & PRESS ENTER..."
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
                [+ ADD]
              </button>
            </div>
          </div>
        </div>

        {/* Section 04: Location & Work Mode Preferences */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-6 space-y-5">
          <div className="font-mono text-xs font-bold text-foreground uppercase tracking-wider pb-3 border-b border-black/10 dark:border-white/10">
            04 // LOCATION & WORK MODE PREFERENCES
          </div>

          {/* Work Mode */}
          <div className="space-y-2 font-mono">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              [TARGET_WORK_MODE]
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
                    [{mode.toUpperCase()}]
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-2 font-mono">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              [TARGET_METRO_REGIONS]
            </label>
            <div className="flex flex-wrap gap-1.5">
              {formData.preferred_locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 px-2 py-1 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs uppercase"
                >
                  <span>[{loc}]</span>
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
                placeholder="ADD CITY (BENGALURU, HYDERABAD, PUNE, REMOTE)..."
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
                [+ ADD CITY]
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto h-12 px-10 font-mono text-xs font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CANDIDATE SPECIFICATION</span>
          </button>
        </div>
      </form>
    </div>
  )
}

