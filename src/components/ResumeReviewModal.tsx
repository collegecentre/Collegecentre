import React, { useState } from "react"
import {
  X,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react"
import { ResumeExtractedProfile, ProfileMergeSummary } from "@/types/resume"
import { StudentProfile, WorkMode } from "@/types"
import { mergeResumeWithProfile } from "@/services/skillNormalizer"
import { Input } from "@/components/ui/input"

interface ResumeReviewModalProps {
  isOpen: boolean
  fileName: string
  extractedProfile: ResumeExtractedProfile
  currentProfile: StudentProfile
  onClose: () => void
  onSave: (mergedProfile: StudentProfile, summary: ProfileMergeSummary) => void
}

export const ResumeReviewModal: React.FC<ResumeReviewModalProps> = ({
  isOpen,
  fileName,
  extractedProfile,
  currentProfile,
  onClose,
  onSave,
}) => {
  // Compute initial draft merged profile
  const initialMerge = mergeResumeWithProfile(currentProfile, extractedProfile, fileName)
  const [draftProfile, setDraftProfile] = useState<StudentProfile>(initialMerge.mergedProfile)
  const [activeTab, setActiveTab] = useState<"academics" | "skills" | "projects" | "experience" | "personal">("skills")
  const [newSkillInput, setNewSkillInput] = useState("")

  if (!isOpen) return null

  // Re-evaluate diff against baseline profile
  const originalSkills = new Set(currentProfile.skills || [])
  const newSkills = (draftProfile.skills || []).filter((s) => !originalSkills.has(s))

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (draftProfile.skills?.includes(trimmed)) return
    setDraftProfile({
      ...draftProfile,
      skills: [...(draftProfile.skills || []), trimmed],
    })
    setNewSkillInput("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setDraftProfile({
      ...draftProfile,
      skills: (draftProfile.skills || []).filter((s) => s !== skillToRemove),
    })
  }

  const handleRemoveProject = (index: number) => {
    setDraftProfile({
      ...draftProfile,
      projects: (draftProfile.projects || []).filter((_, i) => i !== index),
    })
  }

  const handleRemoveInternship = (index: number) => {
    setDraftProfile({
      ...draftProfile,
      internships: (draftProfile.internships || []).filter((_, i) => i !== index),
    })
  }

  const handleCommitSave = () => {
    const summary: ProfileMergeSummary = {
      skillsAdded: newSkills.length,
      skillsRetained: (currentProfile.skills || []).length,
      projectsAdded: (draftProfile.projects || []).length,
      internshipsAdded: (draftProfile.internships || []).length,
      academicsUpdated: Boolean(
        draftProfile.college !== currentProfile.college ||
        draftProfile.degree !== currentProfile.degree ||
        draftProfile.graduation_year !== currentProfile.graduation_year
      ),
    }
    onSave(draftProfile, summary)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border-2 border-black dark:border-white w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col relative font-mono text-xs overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-start justify-between gap-4 bg-muted/20 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#fe7141] font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Extracted from: {fileName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Review & Edit Extracted Profile
            </h2>
            <p className="text-muted-foreground font-sans text-xs">
              Review, edit, or remove any extracted details before saving to your profile. Nothing is committed to the database without your approval.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Summary Bar */}
        <div className="bg-[#fe7141]/10 border-b border-[#fe7141]/20 px-5 py-2.5 flex flex-wrap items-center gap-4 text-[11px] text-foreground shrink-0">
          <span className="font-bold uppercase tracking-wider text-[#fe7141]">Changes Detected:</span>
          <span>+{newSkills.length} new skill tags</span>
          <span>•</span>
          <span>{(draftProfile.projects || []).length} projects</span>
          <span>•</span>
          <span>{(draftProfile.internships || []).length} internships</span>
          <span>•</span>
          <span className="text-muted-foreground font-sans text-[11px]">
            Existing profile fields were preserved non-destructively.
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto px-5 pt-3 border-b border-black/10 dark:border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "skills"
                ? "border-[#fe7141] text-[#fe7141]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills Matrix ({draftProfile.skills?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("academics")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "academics"
                ? "border-[#fe7141] text-[#fe7141]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academics</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "projects"
                ? "border-[#fe7141] text-[#fe7141]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({draftProfile.projects?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "experience"
                ? "border-[#fe7141] text-[#fe7141]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience & Internships ({draftProfile.internships?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "personal"
                ? "border-[#fe7141] text-[#fe7141]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Personal & Links</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 grow">
          {/* TAB: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
                <div>
                  <h3 className="font-bold text-foreground uppercase tracking-wider">Normalized Skills Matrix</h3>
                  <p className="text-muted-foreground font-sans text-xs">
                    Cleaned, canonical skill tags ready for matching. Remove irrelevant tags or add missing technologies.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {draftProfile.skills?.length || 0} Total Skills
                </span>
              </div>

              {/* Add Skill Bar */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <Input
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Type a skill (e.g. Next.js, Docker, PyTorch) and press Enter"
                  className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-foreground text-background font-bold uppercase tracking-wider text-xs flex items-center gap-1 shrink-0 hover:opacity-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Skills Badges Grid */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(draftProfile.skills || []).map((skill) => {
                  const isNew = !originalSkills.has(skill)
                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold ${
                        isNew
                          ? "border-[#fe7141] bg-[#fe7141]/10 text-[#fe7141]"
                          : "border-black/20 dark:border-white/20 bg-card text-foreground"
                      }`}
                    >
                      <span>{skill}</span>
                      {isNew && <span className="text-[9px] uppercase px-1 bg-[#fe7141] text-white">NEW</span>}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 transition-colors ml-1 cursor-pointer"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB: ACADEMICS */}
          {activeTab === "academics" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="font-bold text-foreground uppercase tracking-wider">Educational Credentials</h3>
                <p className="text-muted-foreground font-sans text-xs">
                  Degree discipline and batch determine your primary match eligibility gates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">College / University</label>
                  <Input
                    value={draftProfile.college || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology Karnataka"
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Degree & Specialization</label>
                  <Input
                    value={draftProfile.degree || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, degree: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science and Engineering"
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Graduation Batch Year</label>
                  <Input
                    type="number"
                    value={draftProfile.graduation_year || 2026}
                    onChange={(e) =>
                      setDraftProfile({ ...draftProfile, graduation_year: parseInt(e.target.value) || 2026 })
                    }
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">CGPA / Score</label>
                  <Input
                    value={draftProfile.cgpa || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, cgpa: e.target.value })}
                    placeholder="e.g. 8.7 / 10"
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="font-bold text-foreground uppercase tracking-wider">Key Projects</h3>
                <p className="text-muted-foreground font-sans text-xs">
                  Technologies used in verified projects are automatically factored into your skill match scores.
                </p>
              </div>

              {(!draftProfile.projects || draftProfile.projects.length === 0) ? (
                <div className="p-8 border border-dashed border-black/20 dark:border-white/20 text-center text-muted-foreground">
                  No projects extracted from resume.
                </div>
              ) : (
                <div className="space-y-3">
                  {draftProfile.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="border border-black/10 dark:border-white/15 p-4 space-y-2 bg-card relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-foreground text-sm">{project.title}</div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(idx)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {project.description && (
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((t, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 bg-muted/50 border border-black/10 dark:border-white/10 text-[10px] font-bold"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.link && (
                        <div className="pt-1 text-[11px] text-[#fe7141] flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">
                            {project.link}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="font-bold text-foreground uppercase tracking-wider">Experience & Internships</h3>
                <p className="text-muted-foreground font-sans text-xs">
                  Prior internship credit gives you an immediate boost on roles requesting 0-1 years of experience.
                </p>
              </div>

              {(!draftProfile.internships || draftProfile.internships.length === 0) ? (
                <div className="p-8 border border-dashed border-black/20 dark:border-white/20 text-center text-muted-foreground">
                  No internships or employment history extracted.
                </div>
              ) : (
                <div className="space-y-3">
                  {draftProfile.internships.map((intern, idx) => (
                    <div
                      key={idx}
                      className="border border-black/10 dark:border-white/15 p-4 space-y-2 bg-card relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-foreground text-sm">{intern.role}</div>
                          <div className="text-xs text-[#fe7141] font-bold">
                            {intern.company} {intern.duration ? `• ${intern.duration}` : ""}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInternship(idx)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {intern.description && (
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                          {intern.description}
                        </p>
                      )}

                      {intern.skills_used && intern.skills_used.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {intern.skills_used.map((s, si) => (
                            <span
                              key={si}
                              className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PERSONAL & LINKS */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="font-bold text-foreground uppercase tracking-wider">Identity & Online Presence</h3>
                <p className="text-muted-foreground font-sans text-xs">
                  Review contact information and portfolio links found on your resume.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                  <Input
                    value={draftProfile.name || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })}
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
                  <Input
                    value={draftProfile.email || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</label>
                  <Input
                    value={draftProfile.phone || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })}
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">LinkedIn Profile</label>
                  <Input
                    value={draftProfile.linkedin_url || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">GitHub Profile</label>
                  <Input
                    value={draftProfile.github_url || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Portfolio Website</label>
                  <Input
                    value={draftProfile.portfolio_url || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, portfolio_url: e.target.value })}
                    placeholder="https://yourportfolio.dev"
                    className="rounded-none font-mono text-xs h-9 border-black/20 dark:border-white/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Non-destructive merge: existing custom inputs are preserved</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 border border-black/20 dark:border-white/20 hover:bg-muted/30 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleCommitSave}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#fe7141] hover:bg-[#e05828] text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
