import React, { useState, useRef } from "react"
import { Upload, FileText, Sparkles, Loader2, AlertCircle, X, CheckCircle2, Zap } from "lucide-react"
import { ResumeExtractedProfile } from "@/types/resume"
import { supabase } from "@/services/supabase"
import { useApp } from "@/context/AppContext"

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onExtracted: (profile: ResumeExtractedProfile, rawFileName: string) => void
}

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onExtracted,
}) => {
  const { student, isAuthenticated } = useApp()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateAndSelectFile = (file: File) => {
    setErrorMessage("")
    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf"
    const isDocx =
      file.name.toLowerCase().endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (!isPdf && !isDocx) {
      setErrorMessage("Please upload a PDF (.pdf) or Word document (.docx).")
      return false
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File exceeds the 8 MB maximum size limit. Please upload a smaller resume.")
      return false
    }

    setSelectedFile(file)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0])
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Strip data:application/pdf;base64, prefix and any whitespace/newlines
        const base64 = (result.includes(",") ? result.split(",")[1] : result).replace(/\s+/g, "")
        resolve(base64)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  const handleStartParsing = async (mode: 'ai' | 'script' = 'ai') => {
    if (!selectedFile) return

    setIsLoading(true)
    setErrorMessage("")
    setStatusMessage(
      mode === "script"
        ? "Extracting credentials with high-speed rule engine..."
        : "AI is analyzing credentials, education, and technical stack..."
    )

    try {
      // 1. Get Supabase session token or fallback auth token
      let token: string | null = null
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        token = sessionData?.session?.access_token || null
      } catch {
        // ignore
      }

      if (!token && typeof localStorage !== "undefined") {
        token = localStorage.getItem("collegecentre_auth_token")
        if (!token) {
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
                const raw = localStorage.getItem(key)
                if (raw) {
                  const parsed = JSON.parse(raw)
                  token = parsed?.access_token || parsed?.currentSession?.access_token || null
                  if (token) break
                }
              }
            }
          } catch {
            // ignore
          }
        }
      }

      // Check whether user is authenticated in the application
      const isUserAuthenticated = isAuthenticated || (student && student.email && student.id !== "guest_student")
      if (!isUserAuthenticated && !token) {
        throw new Error("You must be signed in to parse a resume. Please sign in first.")
      }

      // 2. Read file to base64
      const base64Data = await convertFileToBase64(selectedFile)

      // 3. Send to server
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      if (student?.email) {
        headers["x-student-email"] = student.email
      }

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type || (selectedFile.name.endsWith(".docx") ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/pdf"),
          fileData: base64Data,
          parserMode: mode,
        }),
      })

      setStatusMessage("Validating and normalizing extracted credentials...")

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Server responded with status ${response.status}`)
      }

      if (!result.profile) {
        throw new Error("Could not extract a valid profile from the document. Please verify the resume content.")
      }

      // Success -> trigger parent review modal
      onExtracted(result.profile, selectedFile.name)
    } catch (err: any) {
      console.error("Resume parse error:", err)
      setErrorMessage(
        err.message || "Failed to analyze resume. Please ensure the file is not password-protected or corrupted."
      )
    } finally {
      setIsLoading(false)
      setStatusMessage("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border-2 border-black dark:border-white w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6 relative font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 border-b border-black/10 dark:border-white/10 pb-4 pr-8">
          <div className="flex items-center gap-2 text-[#fe7141] font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4" />
            <span>AI Resume Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Build Profile from Resume
          </h2>
          <p className="text-muted-foreground font-sans text-xs">
            Upload your PDF or DOCX resume. Gemini extracts your academics, normalized technical skills, projects, and work history. You can review and edit every detail before saving.
          </p>
        </div>

        {/* Drop Zone */}
        {!isLoading && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors space-y-3 ${
              dragActive
                ? "border-[#fe7141] bg-[#fe7141]/10"
                : selectedFile
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-black/20 dark:border-white/20 hover:border-[#fe7141] hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-bold text-foreground text-sm">{selectedFile.name}</div>
                <div className="text-muted-foreground text-[11px]">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-bold text-foreground text-sm">
                  Click to choose file or drag & drop here
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Supports PDF or DOCX resumes up to 8 MB
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {isLoading && (
          <div className="border border-black/10 dark:border-white/15 p-8 text-center space-y-4 bg-muted/10">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#fe7141]/10 flex items-center justify-center text-[#fe7141] animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-foreground text-sm uppercase tracking-wider">
                Analyzing Resume
              </div>
              <div className="text-muted-foreground font-sans text-xs">
                {statusMessage || "Extracting structured profile..."}
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground pt-2 border-t border-black/10 dark:border-white/10">
              ⚡ Powered by Gemini API • Anti-hallucination verification active
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="border border-red-500/50 bg-red-500/10 p-3.5 flex items-start gap-2.5 text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold uppercase tracking-wider text-[11px]">Analysis Failed</div>
              <div className="font-sans text-xs">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-black/10 dark:border-white/10">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Nothing is saved until you review & approve</span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-2.5 border border-black/20 dark:border-white/20 hover:bg-muted/30 font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleStartParsing("script")}
              disabled={!selectedFile || isLoading}
              title="Parse immediately using built-in deterministic script engine (No AI limits or API latency)"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Instant Script Parse</span>
            </button>
            <button
              type="button"
              onClick={() => handleStartParsing("ai")}
              disabled={!selectedFile || isLoading}
              title="Parse with AI for deep contextual analysis (auto falls back to script if API unavailable)"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#fe7141] hover:bg-[#e05828] text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
