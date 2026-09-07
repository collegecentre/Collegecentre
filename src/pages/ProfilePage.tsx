import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { StudentProfile, WorkMode } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Plus,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { student, updateStudent } = useApp()
  const [formData, setFormData] = useState<StudentProfile>(student)
  const [newSkill, setNewSkill] = useState<string>('')
  const [newLocation, setNewLocation] = useState<string>('')
  const [newCategory, setNewCategory] = useState<string>('')

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
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Student Profile & Match Criteria
            </h1>
            <Badge variant="matchMid" className="text-xs font-bold">
              AI Powered
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            CollegeCentre calculates real-time match percentages against your education, batch year, and technical skills.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-10 px-6 font-bold shadow-md shadow-indigo-500/25"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold">Personal Details</CardTitle>
            </div>
            <CardDescription>Contact information for your student account</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-full-name" className="text-xs font-bold text-muted-foreground">Full Name</label>
              <Input
                id="profile-full-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aarav Sharma"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="text-xs font-bold text-muted-foreground">College Email ID</label>
              <Input
                id="profile-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@college.edu.in"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="profile-phone" className="text-xs font-bold text-muted-foreground">Mobile Phone</label>
              <Input
                id="profile-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </CardContent>
        </Card>

        {/* College & Education */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold">College & Academics</CardTitle>
            </div>
            <CardDescription>
              Determines education compatibility and batch-specific fresher eligibility
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-college" className="text-xs font-bold text-muted-foreground">College / University</label>
              <Input
                id="profile-college"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="National Institute of Technology"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-degree" className="text-xs font-bold text-muted-foreground">Degree / Major</label>
              <Input
                id="profile-degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Computer Science & Engineering"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-education-level" className="text-xs font-bold text-muted-foreground">Education Level</label>
              <Input
                id="profile-education-level"
                value={formData.education_level}
                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                placeholder="Undergraduate (B.Tech / B.E.)"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-grad-year" className="text-xs font-bold text-muted-foreground">Graduation Batch</label>
              <select
                id="profile-grad-year"
                value={formData.graduation_year}
                onChange={(e) =>
                  setFormData({ ...formData, graduation_year: parseInt(e.target.value) })
                }
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={2027}>2027 (Pre-final year)</option>
                <option value={2026}>2026 (Final year batch)</option>
                <option value={2025}>2025 (Fresher / Graduated)</option>
                <option value={2024}>2024 (0-1 yrs experience)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Technical & Core Skills (40% Match Weight) */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold">Skills & Technologies (40% Match Weight)</CardTitle>
            </div>
            <CardDescription>
              Add programming languages, frameworks, databases, and tools to boost your match scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 min-h-14 p-3.5 rounded-xl border bg-muted/20">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove skill ${skill}`}
                    className="hover:text-rose-600 transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="space-y-1">
              <label htmlFor="profile-new-skill" className="sr-only">Add new skill</label>
              <div className="flex gap-2">
                <Input
                  id="profile-new-skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Type skill and press Add (e.g. React, Next.js, Python, PostgreSQL, Docker)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill(e)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  variant="secondary"
                  className="text-xs font-bold shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Skill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Preferences & Locations */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg font-bold">Job Preferences & Locations</CardTitle>
            </div>
            <CardDescription>Target work modes and preferred employment hubs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Work Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Preferred Work Mode
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableModes.map((mode) => {
                  const isSelected = formData.preferred_work_mode.includes(mode)
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleWorkMode(mode)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-border text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {mode}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Preferred Cities
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.preferred_locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="space-y-1">
                <label htmlFor="profile-new-city" className="sr-only">Add new city</label>
                <div className="flex gap-2 pt-1">
                  <Input
                    id="profile-new-city"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Add city (e.g. Bengaluru, Hyderabad, Pune, Remote, Gurugram)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddLocation(e)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddLocation}
                    variant="secondary"
                    className="text-xs font-bold shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add City
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto h-12 px-9 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
