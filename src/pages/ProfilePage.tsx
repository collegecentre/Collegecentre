import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { StudentProfile, WorkMode } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Plus,
  X,
  Save,
  Sparkles,
  Upload,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { student, updateStudent } = useApp()
  const [formData, setFormData] = useState<StudentProfile>(student)
  const [newSkill, setNewSkill] = useState<string>('')
  const [newLocation, setNewLocation] = useState<string>('')

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
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Student Profile & Preferences
            </h1>
            <Badge variant="matchMid" className="text-xs">
              Personalized Matching
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            CollegeCentre uses your profile to calculate exact AI Match percentages for every job listing.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-10 px-5 font-bold shadow-md shadow-indigo-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Personal Details</CardTitle>
            </div>
            <CardDescription>Basic contact details for employer applications</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aarav Sharma"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@college.edu"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </CardContent>
        </Card>

        {/* Education & Academic Fit */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">College & Education</CardTitle>
            </div>
            <CardDescription>
              Enables CollegeCentre to match minimum education criteria & graduation batch
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">College / University</label>
              <Input
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="National Institute of Technology"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Degree / Major</label>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Computer Science & Engineering"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Education Level</label>
              <Input
                value={formData.education_level}
                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                placeholder="Undergraduate (B.Tech / B.E.)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Graduation Year</label>
              <select
                value={formData.graduation_year}
                onChange={(e) =>
                  setFormData({ ...formData, graduation_year: parseInt(e.target.value) })
                }
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={2027}>2027 (Pre-final year)</option>
                <option value={2026}>2026 (Final year)</option>
                <option value={2025}>2025 (Immediate graduate / fresher)</option>
                <option value={2024}>2024 (0-1 yrs experience)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Skills Tag Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Skills & Technologies (40% Match Weight)</CardTitle>
            </div>
            <CardDescription>
              Add your technical & soft skills to increase match scores against job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-xl border bg-muted/30">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type skill and press Add (e.g. Next.js, Docker, Java)..."
                className="text-xs"
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
                className="text-xs shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences & Work Mode */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Job Preferences</CardTitle>
            </div>
            <CardDescription>Preferred locations and work modes for filtered suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Work Mode */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Preferred Work Mode
              </label>
              <div className="flex flex-wrap gap-2">
                {availableModes.map((mode) => {
                  const isSelected = formData.preferred_work_mode.includes(mode)
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleWorkMode(mode)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Preferred Locations
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.preferred_locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add location (e.g. Bengaluru, Mumbai, Gurgaon)..."
                  className="text-xs"
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
                  className="text-xs shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume & Headline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Resume & Headline</CardTitle>
            </div>
            <CardDescription>Your current active student resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Professional Headline</label>
              <Textarea
                value={formData.resume_headline || ''}
                onChange={(e) => setFormData({ ...formData, resume_headline: e.target.value })}
                placeholder="Brief summary of your academic projects, internships, and primary interests..."
                className="text-xs"
                rows={2}
              />
            </div>

            <div className="p-4 rounded-xl border border-dashed flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {formData.resume_name || 'Resume_2026.pdf'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Uploaded & verified PDF</p>
                </div>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({
                        ...formData,
                        resume_name: e.target.files[0].name,
                      })
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 pointer-events-none"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Update Resume</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Save CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto h-11 px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
