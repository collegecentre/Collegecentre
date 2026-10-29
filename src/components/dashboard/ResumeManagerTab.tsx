"use client";

import * as React from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Pencil,
  RefreshCw,
  HardDrive,
  Calendar,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Smartphone,
  Monitor,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LiveProfileCard } from "./LiveProfileCard";
import { ResumeViewerModal } from "@/components/profile/ResumeViewerModal";
import { supabase } from "@/lib/supabase";
import type { Profile, Resume, SocialLink } from "@/types";
import { cn } from "@/lib/utils";

interface ResumeManagerTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ResumeManagerTab({
  profile,
  socialLinks,
}: ResumeManagerTabProps) {
  const { toast } = useToast();

  const [resume, setResume] = React.useState<Resume | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Mobile segmented view: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [titleModalOpen, setTitleModalOpen] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState("");

  // Drag & drop state
  const [isDragging, setIsDragging] = React.useState(false);

  // Hidden file inputs
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const replaceInputRef = React.useRef<HTMLInputElement | null>(null);

  // 1. Fetch Resume
  const fetchResume = React.useCallback(async () => {
    if (!profile?.id) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching resume:", error);
      } else {
        setResume((data as Resume) || null);
      }
    } catch (err) {
      console.error("Resume fetch exception:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id]);

  React.useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  // 2. Validate and Upload File
  const processResumeFile = async (file: File) => {
    // Validate MIME type
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF documents are supported for resumes.",
        variant: "error",
      });
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: `Resume PDF must be under 10MB. Selected file is ${formatBytes(file.size)}.`,
        variant: "error",
      });
      return;
    }

    try {
      setIsUploading(true);

      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${profile.id}/${Date.now()}_${sanitizedName}`;

      // Upload to Supabase Storage 'resumes' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(storagePath, file, {
          upsert: true,
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file to storage.");
      }

      // Retrieve public URL
      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(uploadData?.path || storagePath);

      const publicUrl = urlData?.publicUrl || (uploadData as any)?.publicUrl;

      const now = new Date().toISOString();
      const defaultTitle =
        resume?.title ||
        file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") ||
        "Curriculum Vitae";

      if (resume) {
        // Replace existing resume record
        const { error: updateError } = await supabase
          .from("resumes")
          .update({
            file_path: storagePath,
            file_url: publicUrl,
            file_name: file.name,
            file_size: file.size,
            title: defaultTitle,
            updated_at: now,
          })
          .eq("profile_id", profile.id);

        if (updateError) throw updateError;

        setResume((prev) =>
          prev
            ? {
                ...prev,
                file_path: storagePath,
                file_url: publicUrl,
                file_name: file.name,
                file_size: file.size,
                title: defaultTitle,
                updated_at: now,
              }
            : null
        );

        toast({
          title: "Resume Replaced",
          description: `Successfully updated to ${file.name} (${formatBytes(file.size)}).`,
          variant: "success",
        });
      } else {
        // Insert new resume record
        const newRecord: Resume = {
          id: "res_" + Math.random().toString(36).substring(2, 9),
          profile_id: profile.id,
          file_path: storagePath,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          title: defaultTitle,
          is_visible: true,
          uploaded_at: now,
          updated_at: now,
        };

        const { error: insertError } = await supabase
          .from("resumes")
          .insert(newRecord);

        if (insertError) throw insertError;

        setResume(newRecord);

        toast({
          title: "Resume Uploaded",
          description: "Your verified resume is now active on your CollegeCentre profile.",
          variant: "success",
        });
      }
    } catch (err: any) {
      console.error("Resume upload error:", err);
      toast({
        title: "Upload Failed",
        description: err?.message || "Could not upload resume PDF.",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  // 3. Toggle Visibility
  const handleToggleVisibility = async (checked: boolean) => {
    if (!resume || !profile?.id) return;
    try {
      const { error } = await supabase
        .from("resumes")
        .update({ is_visible: checked, updated_at: new Date().toISOString() })
        .eq("profile_id", profile.id);

      if (error) throw error;

      setResume((prev) => (prev ? { ...prev, is_visible: checked } : null));

      toast({
        title: checked ? "Resume Visible" : "Resume Private",
        description: checked
          ? "Recruiters and visitors can now view your resume on your public profile."
          : "Resume is now hidden from your public showcase.",
        variant: checked ? "success" : "default",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Could not update visibility.",
        variant: "error",
      });
    }
  };

  // 4. Update Display Title
  const handleSaveTitle = async () => {
    if (!resume || !profile?.id) return;
    const cleanTitle = titleInput.trim();
    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          title: cleanTitle || null,
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", profile.id);

      if (error) throw error;

      setResume((prev) =>
        prev ? { ...prev, title: cleanTitle || null } : null
      );
      setTitleModalOpen(false);

      toast({
        title: "Title Updated",
        description: "Resume display title has been saved.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Could not save resume title.",
        variant: "error",
      });
    }
  };

  // 5. Delete Resume
  const handleDeleteResume = async () => {
    if (!resume || !profile?.id) return;
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("profile_id", profile.id);

      if (error) throw error;

      // Also clean up storage
      try {
        await supabase.storage.from("resumes").remove([resume.file_path]);
      } catch {
        // Non-blocking cleanup
      }

      setResume(null);
      setDeleteDialogOpen(false);

      toast({
        title: "Resume Deleted",
        description: "Your resume has been removed from your profile.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err?.message || "Could not delete resume.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Drag & drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header Bar with Mobile View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Resume &amp; Curriculum Vitae
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              Phase 9
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Upload your verified PDF resume for recruiters, founders, and research labs.
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex lg:hidden rounded-lg bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "edit"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Manage</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "preview"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processResumeFile(e.target.files[0]);
          }
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processResumeFile(e.target.files[0]);
          }
        }}
      />

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Management UI */}
        <div
          className={cn(
            "lg:col-span-7 space-y-6",
            mobileView === "preview" ? "hidden lg:block" : "block"
          )}
        >
          {isLoading ? (
            <Card className="p-8 border-border flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">
                  Loading resume status...
                </span>
              </div>
            </Card>
          ) : resume ? (
            /* Active Resume State */
            <div className="space-y-6">
              {/* Primary Resume Identity Card */}
              <Card className="p-6 border-border shadow-subtle space-y-5 bg-card">
                {/* Header Meta */}
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      size="sm"
                      className="font-mono text-[10px] text-red-500 border-red-500/30 bg-red-500/10"
                    >
                      PDF Document
                    </Badge>
                    <Badge
                      variant={resume.is_visible ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "text-[10px] font-mono",
                        resume.is_visible
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "text-muted-foreground"
                      )}
                    >
                      {resume.is_visible ? "Live on Profile" : "Hidden from Public"}
                    </Badge>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    Uploaded {formatDate(resume.uploaded_at)}
                  </span>
                </div>

                {/* File Details Row */}
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <FileText className="h-6 w-6" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-tight -mt-0.5">
                      PDF
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-foreground tracking-tight truncate">
                        {resume.title || "Curriculum Vitae / Resume"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setTitleInput(resume.title || "");
                          setTitleModalOpen(true);
                        }}
                        className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 font-mono transition-colors shrink-0"
                        title="Edit display title"
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="hidden sm:inline">Edit Title</span>
                      </button>
                    </div>

                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {resume.file_name}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3 opacity-70" />
                        {formatBytes(resume.file_size)}
                      </span>
                      {resume.updated_at && resume.updated_at !== resume.uploaded_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 opacity-70" />
                          Updated {formatDate(resume.updated_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified File
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <Button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    size="sm"
                    className="h-9 px-4 gap-1.5 text-xs font-medium"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Document</span>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 gap-1.5 text-xs font-medium"
                  >
                    <a
                      href={resume.file_url}
                      download={resume.file_name || "Resume.pdf"}
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => replaceInputRef.current?.click()}
                    className="h-9 px-3 gap-1.5 text-xs font-medium"
                  >
                    <RefreshCw
                      className={cn("h-3.5 w-3.5", isUploading && "animate-spin")}
                    />
                    <span>{isUploading ? "Uploading..." : "Replace File"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="h-9 px-3 gap-1.5 text-xs font-medium ml-auto"
                    title="Delete resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </Card>

              {/* Visibility & Profile Exposure Card */}
              <Card className="p-5 border-border shadow-subtle space-y-3 bg-muted/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      Public Profile Visibility
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Allow anyone visiting{" "}
                      <span className="font-mono text-foreground font-semibold">
                        collegecentre.in/{profile.username}
                      </span>{" "}
                      to view and download your resume.
                    </p>
                  </div>
                  <Switch
                    checked={resume.is_visible}
                    onCheckedChange={handleToggleVisibility}
                  />
                </div>

                {!resume.is_visible && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                      Resume is currently hidden. Visitors cannot see or download this file.
                    </span>
                  </div>
                )}
              </Card>

              {/* Replace Dropzone Secondary Option */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => replaceInputRef.current?.click()}
                className={cn(
                  "p-5 rounded-xl border border-dashed transition-all cursor-pointer text-center space-y-1.5",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border/70 hover:border-foreground/30 hover:bg-muted/30"
                )}
              >
                <Upload className="h-4 w-4 mx-auto text-muted-foreground" />
                <p className="text-xs text-foreground font-medium">
                  Drag and drop a new PDF to replace this resume
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  Preserves your existing title and settings • Max 10MB
                </p>
              </div>
            </div>
          ) : (
            /* Empty State: Upload Prompt */
            <div className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-4 shadow-sm",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-foreground/40 hover:bg-muted/20"
                )}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="h-7 w-7" />
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-foreground">
                    Upload Your Student Resume
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Drag and drop your PDF resume here, or click to browse files from your computer.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                    PDF Only
                  </Badge>
                  <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                    Up to 10MB
                  </Badge>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    disabled={isUploading}
                    className="h-9 px-5 text-xs font-semibold"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Uploading Resume...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Select PDF Document
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Value Proposition Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4 border-border shadow-subtle space-y-1.5 bg-card">
                  <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground">Direct Recruiter Access</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Recruiters can inspect your credentials directly from your vanity link.
                  </p>
                </Card>

                <Card className="p-4 border-border shadow-subtle space-y-1.5 bg-card">
                  <div className="h-7 w-7 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground">Safe In-App Preview</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Readers can view your CV in a clean modal without navigating away.
                  </p>
                </Card>

                <Card className="p-4 border-border shadow-subtle space-y-1.5 bg-card">
                  <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground">Privacy Controls</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Instantly toggle resume visibility on or off whenever you need.
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Profile Showcase Preview */}
        <div
          className={cn(
            "lg:col-span-5 sticky top-24 space-y-3",
            mobileView === "edit" ? "hidden lg:block" : "block"
          )}
        >
          <LiveProfileCard
            profile={profile}
            socialLinks={socialLinks}
            resume={resume}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Resume?"
        description="Are you sure you want to delete your resume? This will permanently remove the document from your public profile."
        confirmLabel="Delete Resume"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteResume}
      />

      {/* Edit Title Dialog */}
      <Dialog open={titleModalOpen} onOpenChange={setTitleModalOpen}>
        <DialogContent className="max-w-md border-border bg-card p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Edit Resume Title
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Customize the label displayed on your public profile card (e.g. &ldquo;Software Engineer Resume - 2026&rdquo;).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Display Title
            </label>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. Systems & Distributed Systems Resume"
              maxLength={80}
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Leave blank to default to &ldquo;Curriculum Vitae / Resume&rdquo;.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTitleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSaveTitle}>
              Save Title
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embedded Document Viewer Modal */}
      {resume && (
        <ResumeViewerModal
          resume={resume}
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          studentName={profile.full_name}
        />
      )}
    </div>
  );
}
