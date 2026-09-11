import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { StudentProfile, WorkMode } from '@/types'
import { ResumeExtractedProfile, ProfileMergeSummary } from '@/types/resume'
import { ResumeUploadModal } from '@/components/ResumeUploadModal'
import { ResumeReviewModal } from '@/components/ResumeReviewModal'
import { Input } from '@/components/ui/input'
import {
  X,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Upload,
  Briefcase,
  FolderGit2,
  ExternalLink,
  Plus,
  Globe,
  Link as LinkIcon,
  Code2,
} from 'lucide-react'

const POPULAR_SKILLS = [
  'React',
  'Python',
  'Node.js',
  'TypeScript',
  'PostgreSQL',
  'Docker',
  'SQL',
  'Java',
  'Git',
  'Tailwind CSS',
  'Next.js',
  'C++',
  'AWS',
  'Express.js',
  'FastAPI',
  'MongoDB',
]

const POPULAR_LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi NCR',
  'Chennai',
  'Kochi',
  'Remote',
]

export const ProfilePage: React.FC = () => {
  const { student, updateStudent, setCurrentView, setIsPaymentModalOpen } = useApp()
  const [formData, setFormData] = useState<StudentProfile>(student)

  useEffect(() => {
    setFormData(student)
  }, [student])

  const [newSkill, setNewSkill] = useState<string>('')
  const [newLocation, setNewLocation] = useState<string>('')
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false)

  // Resume Builder States
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState<boolean>(false)
  const [isResumeReviewOpen, setIsResumeReviewOpen] = useState<boolean>(false)
  const [extractedResume, setExtractedResume] = useState<ResumeExtractedProfile | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>('')
  const [resumeMergeToast, setResumeMergeToast] = useState<string | null>(null)

  // Manual Project Creation State
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false)
  const [newProjectTitle, setNewProjectTitle] = useState<string>('')
  const [newProjectDesc, setNewProjectDesc] = useState<string>('')
  const [newProjectTech, setNewProjectTech] = useState<string>('')
  const [newProjectLink, setNewProjectLink] = useState<string>('')

  // Manual Internship Creation State
  const [isAddingInternship, setIsAddingInternship] = useState<boolean>(false)
  const [newInternRole, setNewInternRole] = useState<string>('')
  const [newInternCompany, setNewInternCompany] = useState<string>('')
  const [newInternDuration, setNewInternDuration] = useState<string>('')
  const [newInternTech, setNewInternTech] = useState<string>('')
  const [newInternDesc, setNewInternDesc] = useState<string>('')

  const availableModes: WorkMode[] = ['Remote', 'Hybrid', 'Onsite']

  // Minimum Requirements for Job Matching: Degree + at least 1 Technical Skill
  const hasDegree = Boolean(formData.degree?.trim())
  const hasSkills = Boolean(formData.skills && formData.skills.length > 0)
  const isMinimumComplete = hasDegree && hasSkills

  const [activeTab, setActiveTab] = useState<'essentials' | 'academics' | 'work' | 'links' | 'projects' | 'all'>(
    isMinimumComplete ? 'all' : 'essentials'
  )

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newSkill.trim()) return
    const trimmed = newSkill.trim()
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill('')
      return
    }
    setFormData({
      ...formData,
      skills: [...formData.skills, trimmed],
    })
    setNewSkill('')
  }

  const handleAddQuickSkill = (skill: string) => {
    if (formData.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return
    setFormData({
      ...formData,
      skills: [...formData.skills, skill],
    })
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    })
  }

  const handleAddLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newLocation.trim()) return
    const trimmed = newLocation.trim()
    if (formData.preferred_locations.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      setNewLocation('')
      return
    }
    setFormData({
      ...formData,
      preferred_locations: [...formData.preferred_locations, trimmed],
    })
    setNewLocation('')
  }

  const handleAddQuickLocation = (loc: string) => {
    if (formData.preferred_locations.some((l) => l.toLowerCase() === loc.toLowerCase())) return
    setFormData({
      ...formData,
      preferred_locations: [...formData.preferred_locations, loc],
    })
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

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    const techArray = newProjectTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newProj = {
      name: newProjectTitle.trim(),
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim() || null,
      technologies: techArray,
      link: newProjectLink.trim() || null,
      url: newProjectLink.trim() || null,
    }

    setFormData({
      ...formData,
      projects: [...(formData.projects || []), newProj],
    })

    setNewProjectTitle('')
    setNewProjectDesc('')
    setNewProjectTech('')
    setNewProjectLink('')
    setIsAddingProject(false)
  }

  const handleSaveInternship = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInternCompany.trim() || !newInternRole.trim()) return

    const techArray = newInternTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newIntern = {
      company: newInternCompany.trim(),
      role: newInternRole.trim(),
      duration: newInternDuration.trim() || null,
      technologies: techArray,
      skills_used: techArray,
      description: newInternDesc.trim() || null,
    }

    setFormData({
      ...formData,
      internships: [...(formData.internships || []), newIntern],
    })

    setNewInternCompany('')
    setNewInternRole('')
    setNewInternDuration('')
    setNewInternTech('')
    setNewInternDesc('')
    setIsAddingInternship(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudent(formData)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 5000)
  }

  const handleResumeExtracted = (extracted: ResumeExtractedProfile, rawFileName: string) => {
    setExtractedResume(extracted)
    setResumeFileName(rawFileName)
    setIsResumeUploadOpen(false)
    setIsResumeReviewOpen(true)
  }

  const handleResumeMergeSave = (merged: StudentProfile, summary: ProfileMergeSummary) => {
    updateStudent(merged)
    setFormData(merged)
    setIsResumeReviewOpen(false)
    const summaryText = `✓ Resume merged! Added ${summary.skillsAdded} skills and updated credentials.`
    setResumeMergeToast(summaryText)
    setTimeout(() => setResumeMergeToast(null), 8000)
  }

  const totalProjectsAndExp = (formData.projects?.length || 0) + (formData.internships?.length || 0)

  const profileTabs = [
    { id: 'essentials', label: '01. Core Essentials (Minimum)' },
    { id: 'academics', label: '02. Academics (Optional)' },
    { id: 'work', label: '03. Work & Location (Optional)' },
    { id: 'links', label: '04. Online Profiles (Optional)' },
    { id: 'projects', label: `05. Projects & Exp (${totalProjectsAndExp})` },
    { id: 'all', label: 'All Sections' },
  ] as const

  const unusedPopularSkills = POPULAR_SKILLS.filter(
    (skill) => !formData.skills?.some((s) => s.toLowerCase() === skill.toLowerCase())
  ).slice(0, 10)

  const unusedPopularLocations = POPULAR_LOCATIONS.filter(
    (loc) => !formData.preferred_locations?.some((l) => l.toLowerCase() === loc.toLowerCase())
  ).slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 relative pb-12">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-4">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
          Candidate Profile • Freshers Placement Matching
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Candidate Profile
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Minimum needed to match jobs: <strong>Degree</strong> and <strong>1+ Skill</strong>. All other fields are optional.
            </p>
          </div>
        </div>
      </div>

      {/* Minimum Requirements Checklist Banner */}
      <div className={`border p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isMinimumComplete
          ? 'border-emerald-500/50 bg-emerald-500/5'
          : 'border-[#fe7141]/40 bg-[#fe7141]/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${isMinimumComplete ? 'bg-emerald-500' : 'bg-[#fe7141] animate-pulse'}`} />
          <div>
            <div className="font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <span>{isMinimumComplete ? '✓ Minimum Requirements Complete' : 'Minimum Needed to Calculate Match:'}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">
              {isMinimumComplete
                ? 'Your degree and skills are actively calculating match scores across all 40+ fresher openings.'
                : 'Enter your Degree / Branch and at least 1 Technical Skill to activate full matching.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] shrink-0 font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('essentials')}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              hasDegree
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-[#fe7141] bg-card text-[#fe7141] hover:bg-[#fe7141]/10'
            }`}
          >
            {hasDegree ? '✓ 1. Degree Added' : '○ 1. Add Degree'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('essentials')}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              hasSkills
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-[#fe7141] bg-card text-[#fe7141] hover:bg-[#fe7141]/10'
            }`}
          >
            {hasSkills ? `✓ 2. Skills (${formData.skills.length})` : '○ 2. Add Skill'}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedFeedback && (
        <div className="border border-emerald-500/50 bg-emerald-500/10 p-3.5 font-mono text-xs text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              Profile updated! Match criteria recalibrated.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentView('jobs')}
              className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-[11px] hover:opacity-90 flex items-center gap-1 cursor-pointer"
            >
              <span>View Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3 py-1 bg-[#fe7141] hover:bg-[#e05828] text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Unlock Pass</span>
            </button>
          </div>
        </div>
      )}

      {/* Optional Resume Import Shortcut */}
      <div className="border border-black/15 dark:border-white/20 bg-muted/10 p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optional: Auto-fill from Resume</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            Upload your PDF/DOCX to extract skills, education, and projects with our free local parser. No AI is used.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsResumeUploadOpen(true)}
          className="px-4 py-2 border border-black/20 dark:border-white/20 hover:border-[#fe7141] bg-card text-foreground font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-[#fe7141]" />
          <span>{formData.resume_file_name ? 'Re-import Resume' : 'Import Resume (PDF)'}</span>
        </button>
      </div>

      {/* Resume Merged Toast */}
      {resumeMergeToast && (
        <div className="border border-emerald-500/50 bg-emerald-500/10 p-3 font-mono text-xs text-foreground flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{resumeMergeToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setResumeMergeToast(null)}
            className="p-1 hover:text-foreground text-muted-foreground cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-black/10 dark:border-white/15 font-mono text-xs scrollbar-none">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 border whitespace-nowrap transition-colors uppercase tracking-wider cursor-pointer ${
              activeTab === tab.id
                ? 'border-black dark:border-white bg-foreground text-background font-bold'
                : 'border-black/10 dark:border-white/15 text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form id="candidate-profile-form" onSubmit={handleSave} className="space-y-6">
        {/* TAB 01: Core Essentials (Minimum Needed for Matching) */}
        {(activeTab === 'essentials' || activeTab === 'all') && (
          <div className="border-2 border-[#fe7141]/30 bg-card p-5 sm:p-6 space-y-6 font-mono text-xs">
            <div className="flex items-baseline justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span>01. CORE ESSENTIALS</span>
                <span className="px-1.5 py-0.5 bg-[#fe7141] text-white text-[9px] font-bold uppercase tracking-wider">
                  MINIMUM REQUIRED TO MATCH
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">
                {isMinimumComplete ? '✓ Ready to Match' : 'Action Required'}
              </span>
            </div>

            {/* Candidate Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="profile-full-name" className="text-[10px] font-bold text-muted-foreground uppercase">
                  Candidate Name <span className="text-[#fe7141]">*</span>
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
                <label htmlFor="profile-email" className="text-[10px] font-bold text-muted-foreground uppercase">
                  Email Address <span className="text-[#fe7141]">*</span>
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
            </div>

            {/* Degree / Branch (Minimum Requirement 1) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label htmlFor="profile-degree" className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                  <span>Degree & Discipline</span>
                  <span className="text-[#fe7141]">*</span>
                </label>
                <span className="text-[10px] text-[#fe7141] font-bold">Matches Job Eligibility</span>
              </div>
              <Input
                id="profile-degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech Computer Science / BCA / MCA / B.E. ECE"
                className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs font-bold"
                required
              />
              <p className="text-[11px] text-muted-foreground font-sans">
                Curated jobs match directly against your branch (e.g. Computer Science, IT, Electronics, MCA).
              </p>
            </div>

            {/* Technical Skills (Minimum Requirement 2) */}
            <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
              <div className="flex items-baseline justify-between">
                <label className="text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
                  <span>Technical Skills Matrix</span>
                  <span className="text-[#fe7141]">* (at least 1 required)</span>
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {formData.skills?.length || 0} Skills Active
                </span>
              </div>

              {/* Skills Display */}
              <div className="flex flex-wrap gap-1.5 min-h-12 p-3 border border-black/10 dark:border-white/15 bg-muted/10">
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs font-bold"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 p-0.5 cursor-pointer ml-0.5"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-1 flex items-center gap-2 font-sans">
                    <AlertCircle className="w-3.5 h-3.5 text-[#fe7141] shrink-0" />
                    <span>No skills added yet. Type below or click the quick-add buttons.</span>
                  </div>
                )}
              </div>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Type skill (e.g. React, Python, PostgreSQL, Java) and press Enter..."
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-4 py-1.5 bg-foreground text-background font-bold uppercase tracking-wider text-xs flex items-center gap-1 shrink-0 hover:opacity-90 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick Add Chips */}
              {unusedPopularSkills.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    1-Click Add Popular Fresher Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {unusedPopularSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddQuickSkill(skill)}
                        className="px-2 py-0.5 border border-dashed border-black/20 dark:border-white/20 hover:border-[#fe7141] hover:text-[#fe7141] text-[11px] transition-colors cursor-pointer"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 02: Academics & Details (Optional) */}
        {(activeTab === 'academics' || activeTab === 'all') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-5 sm:p-6 space-y-4 font-mono text-xs">
            <div className="flex items-baseline justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="font-bold text-foreground uppercase tracking-wider">
                02. ACADEMICS & COLLEGE (OPTIONAL)
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">Optional Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="profile-college" className="text-[10px] font-bold text-muted-foreground uppercase">
                  College / University Name (Optional)
                </label>
                <Input
                  id="profile-college"
                  value={formData.college || ''}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. NIT Karnataka / Anna University"
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-grad-year" className="text-[10px] font-bold text-muted-foreground uppercase">
                  Graduation Batch Year (Optional)
                </label>
                <select
                  id="profile-grad-year"
                  value={formData.graduation_year}
                  onChange={(e) =>
                    setFormData({ ...formData, graduation_year: parseInt(e.target.value) })
                  }
                  className="w-full h-9 rounded-none border border-black/15 dark:border-white/20 bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                >
                  <option value={2029}>2029 (1st year)</option>
                  <option value={2028}>2028 (2nd year)</option>
                  <option value={2027}>2027 (Pre-final year)</option>
                  <option value={2026}>2026 (Final year batch)</option>
                  <option value={2025}>2025 (Fresher / Graduated)</option>
                  <option value={2024}>2024 (0-1 yrs exp)</option>
                  <option value={2023}>2023 (1-2 yrs exp)</option>
                  {![2029, 2028, 2027, 2026, 2025, 2024, 2023].includes(formData.graduation_year) && (
                    <option value={formData.graduation_year}>{formData.graduation_year} (Custom Batch)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-cgpa" className="text-[10px] font-bold text-muted-foreground uppercase">
                  CGPA / Percentage (Optional)
                </label>
                <Input
                  id="profile-cgpa"
                  value={formData.cgpa || ''}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="e.g. 8.85 / 10 or 85%"
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-education-level" className="text-[10px] font-bold text-muted-foreground uppercase">
                  Degree Level (Optional)
                </label>
                <select
                  id="profile-education-level"
                  value={formData.education_level || 'Undergraduate (B.Tech / B.E.)'}
                  onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                  className="w-full h-9 rounded-none border border-black/15 dark:border-white/20 bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                >
                  <option value="Undergraduate (B.Tech / B.E.)">Undergraduate (B.Tech / B.E.)</option>
                  <option value="BCA / MCA">BCA / MCA</option>
                  <option value="Postgraduate (M.Tech / M.Sc)">Postgraduate (M.Tech / M.Sc)</option>
                  <option value="B.Sc / Computer Applications">B.Sc / Computer Applications</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="Other Degree">Other Degree</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 03: Work & Location Preferences (Optional) */}
        {(activeTab === 'work' || activeTab === 'all') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-5 sm:p-6 space-y-5 font-mono text-xs">
            <div className="flex items-baseline justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="font-bold text-foreground uppercase tracking-wider">
                03. WORK & LOCATION (OPTIONAL)
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">Preferences</span>
            </div>

            {/* Mobile Phone */}
            <div className="space-y-1.5">
              <label htmlFor="profile-phone" className="text-[10px] font-bold text-muted-foreground uppercase">
                Contact Phone / WhatsApp (Optional)
              </label>
              <Input
                id="profile-phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs max-w-sm"
              />
            </div>

            {/* Work Mode */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Target Work Modes
              </label>
              <div className="flex flex-wrap gap-2">
                {availableModes.map((mode) => {
                  const isSelected = formData.preferred_work_mode.includes(mode)
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleWorkMode(mode)}
                      className={`px-3.5 py-1.5 text-xs border uppercase tracking-wider transition-colors cursor-pointer ${
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
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Preferred Cities
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-9 p-2 border border-black/10 dark:border-white/15 bg-muted/10">
                {formData.preferred_locations.length > 0 ? (
                  formData.preferred_locations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 px-2 py-0.5 border border-black/15 dark:border-white/20 bg-card text-foreground text-xs font-bold"
                    >
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        className="hover:text-red-500 p-0.5 cursor-pointer"
                        aria-label={`Remove location ${loc}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground py-0.5">No city filter applied (all cities matched).</span>
                )}
              </div>

              <div className="flex gap-2 pt-1 max-w-md">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add city (Bengaluru, Pune, Remote)..."
                  className="h-8 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddLocation()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddLocation()}
                  className="px-3 py-1 border border-black dark:border-white text-xs font-bold uppercase hover:bg-muted/40 transition-colors shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {unusedPopularLocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {unusedPopularLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleAddQuickLocation(loc)}
                      className="px-2 py-0.5 border border-dashed border-black/20 dark:border-white/20 hover:border-[#fe7141] hover:text-[#fe7141] text-[10px] transition-colors cursor-pointer"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 04: Online Profiles (Optional) */}
        {(activeTab === 'links' || activeTab === 'all') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-5 sm:p-6 space-y-4 font-mono text-xs">
            <div className="flex items-baseline justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="font-bold text-foreground uppercase tracking-wider">
                04. ONLINE PROFILES & SOCIAL (OPTIONAL)
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">Optional Links</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="profile-linkedin" className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-[#0a66c2]" />
                    <span>LinkedIn</span>
                  </label>
                  {formData.linkedin_url && (
                    <a href={formData.linkedin_url} target="_blank" rel="noreferrer" className="text-[9px] text-[#fe7141] hover:underline flex items-center gap-0.5">
                      <span>Test</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <Input
                  id="profile-linkedin"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="profile-github" className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    <span>GitHub</span>
                  </label>
                  {formData.github_url && (
                    <a href={formData.github_url} target="_blank" rel="noreferrer" className="text-[9px] text-[#fe7141] hover:underline flex items-center gap-0.5">
                      <span>Test</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <Input
                  id="profile-github"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="profile-portfolio" className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Portfolio</span>
                  </label>
                  {formData.portfolio_url && (
                    <a href={formData.portfolio_url} target="_blank" rel="noreferrer" className="text-[9px] text-[#fe7141] hover:underline flex items-center gap-0.5">
                      <span>Test</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <Input
                  id="profile-portfolio"
                  value={formData.portfolio_url || ''}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://mywebsite.dev"
                  className="h-9 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 05: Projects & Experience (Optional) */}
        {(activeTab === 'projects' || activeTab === 'all') && (
          <div className="border border-black/10 dark:border-white/15 bg-card p-5 sm:p-6 space-y-6 font-mono text-xs">
            <div className="flex items-baseline justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <div className="font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span>05. PROJECTS & INTERNSHIPS (OPTIONAL)</span>
                <span className="text-[10px] text-muted-foreground">Boosts Score</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase">Optional Portfolio</span>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-foreground uppercase flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#fe7141]" />
                  <span>Projects ({(formData.projects || []).length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="text-[11px] text-[#fe7141] hover:underline font-bold uppercase cursor-pointer"
                >
                  {isAddingProject ? '✕ Cancel' : '+ Add Project'}
                </button>
              </div>

              {isAddingProject && (
                <div className="p-3.5 border-2 border-dashed border-[#fe7141] bg-[#fe7141]/5 space-y-3">
                  <div className="font-bold text-[#fe7141] uppercase text-[10px]">Add Project</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Project Title (e.g. Distributed Task Queue)"
                      className="h-8 rounded-none text-xs"
                    />
                    <Input
                      value={newProjectLink}
                      onChange={(e) => setNewProjectLink(e.target.value)}
                      placeholder="Project URL (e.g. https://github.com/...)"
                      className="h-8 rounded-none text-xs"
                    />
                    <Input
                      value={newProjectTech}
                      onChange={(e) => setNewProjectTech(e.target.value)}
                      placeholder="Technologies (e.g. React, Node.js, Docker)"
                      className="h-8 rounded-none text-xs sm:col-span-2"
                    />
                    <Input
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Brief description"
                      className="h-8 rounded-none text-xs sm:col-span-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-3 py-1 border text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      disabled={!newProjectTitle.trim()}
                      className="px-3 py-1 bg-[#fe7141] text-white text-xs font-bold uppercase cursor-pointer disabled:opacity-40"
                    >
                      + Add Project
                    </button>
                  </div>
                </div>
              )}

              {(!formData.projects || formData.projects.length === 0) ? (
                <div className="p-4 border border-dashed border-black/15 dark:border-white/20 text-center text-muted-foreground text-xs">
                  No projects attached. Projects are optional but increase match ranking.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formData.projects.map((proj, i) => (
                    <div key={i} className="border border-black/10 dark:border-white/15 p-3 space-y-1.5 bg-card">
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-foreground">{proj.title || proj.name}</div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.projects || []).filter((_, idx) => idx !== i)
                            setFormData({ ...formData, projects: updated })
                          }}
                          className="text-muted-foreground hover:text-red-500 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {proj.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t, ti) => (
                            <span key={ti} className="px-1.5 py-0.2 bg-muted/40 border border-black/10 text-[9px] font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internships */}
            <div className="space-y-3 pt-3 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="font-bold text-foreground uppercase flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#fe7141]" />
                  <span>Internships ({(formData.internships || []).length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingInternship(!isAddingInternship)}
                  className="text-[11px] text-[#fe7141] hover:underline font-bold uppercase cursor-pointer"
                >
                  {isAddingInternship ? '✕ Cancel' : '+ Add Internship'}
                </button>
              </div>

              {isAddingInternship && (
                <div className="p-3.5 border-2 border-dashed border-[#fe7141] bg-[#fe7141]/5 space-y-3">
                  <div className="font-bold text-[#fe7141] uppercase text-[10px]">Add Internship</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Input
                      value={newInternCompany}
                      onChange={(e) => setNewInternCompany(e.target.value)}
                      placeholder="Company Name"
                      className="h-8 rounded-none text-xs"
                    />
                    <Input
                      value={newInternRole}
                      onChange={(e) => setNewInternRole(e.target.value)}
                      placeholder="Role (e.g. SDE Intern)"
                      className="h-8 rounded-none text-xs"
                    />
                    <Input
                      value={newInternDuration}
                      onChange={(e) => setNewInternDuration(e.target.value)}
                      placeholder="Duration (e.g. 3 months)"
                      className="h-8 rounded-none text-xs"
                    />
                    <Input
                      value={newInternTech}
                      onChange={(e) => setNewInternTech(e.target.value)}
                      placeholder="Technologies Used (e.g. Python, Docker)"
                      className="h-8 rounded-none text-xs sm:col-span-3"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingInternship(false)}
                      className="px-3 py-1 border text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInternship}
                      disabled={!newInternCompany.trim() || !newInternRole.trim()}
                      className="px-3 py-1 bg-[#fe7141] text-white text-xs font-bold uppercase cursor-pointer disabled:opacity-40"
                    >
                      + Add Internship
                    </button>
                  </div>
                </div>
              )}

              {(!formData.internships || formData.internships.length === 0) ? (
                <div className="p-4 border border-dashed border-black/15 dark:border-white/20 text-center text-muted-foreground text-xs">
                  No internships recorded. Internships are optional for fresher matching.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.internships.map((exp, i) => (
                    <div key={i} className="border border-black/10 dark:border-white/15 p-3 flex items-start justify-between gap-2 bg-card">
                      <div>
                        <div className="font-bold text-foreground">{exp.role}</div>
                        <div className="text-xs text-[#fe7141] font-bold">
                          {exp.company} {exp.duration ? `• ${exp.duration}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.internships || []).filter((_, idx) => idx !== i)
                          setFormData({ ...formData, internships: updated })
                        }}
                        className="text-muted-foreground hover:text-red-500 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Save & Update Bar */}
        <div className="border border-black/10 dark:border-white/15 bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div>
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">
              {isMinimumComplete ? '✓ MINIMUM PROFILE READY' : 'COMPLETE MINIMUM FIELDS TO MATCH'}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isMinimumComplete ? 'Degree & Skills are set. Match percentages recalculate in real-time.' : 'Please add Degree and 1 Skill to activate matching.'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-8 font-mono text-xs font-bold uppercase tracking-wider bg-[#fe7141] hover:bg-[#e05828] text-white transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savedFeedback ? '✓ Profile Saved' : 'Save Profile'}</span>
          </button>
        </div>
      </form>

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeUploadOpen}
        onClose={() => setIsResumeUploadOpen(false)}
        onExtracted={handleResumeExtracted}
      />

      {/* Resume Review Modal */}
      {extractedResume && (
        <ResumeReviewModal
          isOpen={isResumeReviewOpen}
          fileName={resumeFileName}
          extractedProfile={extractedResume}
          currentProfile={formData}
          onClose={() => setIsResumeReviewOpen(false)}
          onSave={handleResumeMergeSave}
        />
      )}
    </div>
  )
}
