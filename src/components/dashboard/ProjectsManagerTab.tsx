"use client";

import * as React from "react";
import {
  Plus,
  GripVertical,
  Star,
  ExternalLink,
  PlayCircle,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Code2,
  Sparkles,
  Calendar,
  Upload,
  X,
  Smartphone,
  Monitor,
  Check,
  AlertCircle,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { supabase, isLiveSupabase, realSupabase } from "@/lib/supabase";
import type { Profile, Project, SocialLink } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsManagerTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onProjectsCountChanged?: (count: number) => void;
}

function sanitizeUrl(raw: string): string {
  const clean = (raw || "").trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  return `https://${clean}`;
}

function isValidHttpUrl(raw: string): boolean {
  if (!raw.trim()) return true; // Optional field
  try {
    const url = new URL(sanitizeUrl(raw));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProjectsManagerTab({
  profile,
  socialLinks,
  onProjectsCountChanged,
}: ProjectsManagerTabProps) {
  const { toast } = useToast();

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mobile segmented control: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formCoverUrl, setFormCoverUrl] = React.useState("");
  const [techInput, setTechInput] = React.useState("");
  const [formTechs, setFormTechs] = React.useState<string[]>([]);
  const [formGithubUrl, setFormGithubUrl] = React.useState("");
  const [formDemoUrl, setFormDemoUrl] = React.useState("");
  const [formVideoUrl, setFormVideoUrl] = React.useState("");
  const [formStartDate, setFormStartDate] = React.useState("");
  const [formEndDate, setFormEndDate] = React.useState("");
  const [formFeatured, setFormFeatured] = React.useState(false);
  const [formEnabled, setFormEnabled] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  // 1. Fetch projects on mount
  const fetchProjects = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profile.id);

      if (error) {
        console.error("Failed to load projects:", error);
      } else if (data) {
        const sorted = (data as Project[]).sort((a, b) => {
          if (a.is_featured !== b.is_featured) {
            return a.is_featured ? -1 : 1;
          }
          return (a.order_index ?? 0) - (b.order_index ?? 0);
        });
        setProjects(sorted);
        onProjectsCountChanged?.(sorted.length);
      }
    } catch (err) {
      console.error("Unexpected error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profile.id, onProjectsCountChanged]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Open modal for new project
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormDescription("");
    setFormCoverUrl("");
    setTechInput("");
    setFormTechs([]);
    setFormGithubUrl("");
    setFormDemoUrl("");
    setFormVideoUrl("");
    setFormStartDate("");
    setFormEndDate("");
    setFormFeatured(false);
    setFormEnabled(true);
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal to edit existing project
  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormDescription(proj.description);
    setFormCoverUrl(proj.cover_image_url || "");
    setTechInput("");
    setFormTechs(proj.technologies || []);
    setFormGithubUrl(proj.github_url || "");
    setFormDemoUrl(proj.demo_url || "");
    setFormVideoUrl(proj.video_url || "");
    setFormStartDate(proj.start_date || "");
    setFormEndDate(proj.end_date || "");
    setFormFeatured(proj.is_featured);
    setFormEnabled(proj.is_enabled);
    setFormError(null);
    setModalOpen(true);
  };

  // Add technology chip
  const handleAddTech = (raw: string) => {
    const trimmed = raw.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (!formTechs.includes(trimmed)) {
      setFormTechs((prev) => [...prev, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormTechs((prev) => prev.filter((t) => t !== techToRemove));
  };

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (PNG, JPG, WebP, SVG).",
        variant: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Cover images must be under 5MB.",
        variant: "error",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${profile.id}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      if (isLiveSupabase) {
        const { error: uploadError } = await realSupabase.storage
          .from("project-covers")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = realSupabase.storage
          .from("project-covers")
          .getPublicUrl(fileName);

        setFormCoverUrl(publicUrlData.publicUrl);
      } else {
        // Local mode fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormCoverUrl(result);
        };
        reader.readAsDataURL(file);
      }

      toast({
        title: "Cover uploaded",
        description: "Project cover image loaded successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Cover upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload project cover image.",
        variant: "error",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Project (Add or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const title = formTitle.trim();
    if (!title) {
      setFormError("Project title is required.");
      return;
    }

    const description = formDescription.trim();
    if (!description) {
      setFormError("Project description is required.");
      return;
    }

    // Validate URLs if provided
    if (formGithubUrl && !isValidHttpUrl(formGithubUrl)) {
      setFormError("GitHub URL must be a valid http or https web address.");
      return;
    }
    if (formDemoUrl && !isValidHttpUrl(formDemoUrl)) {
      setFormError("Live Demo URL must be a valid http or https web address.");
      return;
    }
    if (formVideoUrl && !isValidHttpUrl(formVideoUrl)) {
      setFormError("Video URL must be a valid http or https web address.");
      return;
    }

    // If techInput has leftover text, add it
    const finalTechs = [...formTechs];
    if (techInput.trim() && !finalTechs.includes(techInput.trim())) {
      finalTechs.push(techInput.trim());
    }

    setIsSubmitting(true);

    try {
      const sanitizedGithub = formGithubUrl ? sanitizeUrl(formGithubUrl) : null;
      const sanitizedDemo = formDemoUrl ? sanitizeUrl(formDemoUrl) : null;
      const sanitizedVideo = formVideoUrl ? sanitizeUrl(formVideoUrl) : null;

      if (editingProject) {
        // Update existing project
        const updates: Partial<Project> = {
          title,
          description,
          cover_image_url: formCoverUrl.trim() || null,
          technologies: finalTechs,
          github_url: sanitizedGithub,
          demo_url: sanitizedDemo,
          video_url: sanitizedVideo,
          start_date: formStartDate.trim() || null,
          end_date: formEndDate.trim() || null,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("projects")
          .update(updates)
          .eq("id", editingProject.id);

        if (error) throw error;

        setProjects((prev) =>
          prev
            .map((p) => (p.id === editingProject.id ? { ...p, ...updates } : p))
            .sort((a, b) => {
              if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
              return (a.order_index ?? 0) - (b.order_index ?? 0);
            })
        );

        toast({
          title: "Project updated",
          description: `"${title}" has been saved.`,
          variant: "default",
        });
      } else {
        // Add new project
        const newProject: Partial<Project> = {
          profile_id: profile.id,
          title,
          description,
          cover_image_url: formCoverUrl.trim() || null,
          technologies: finalTechs,
          github_url: sanitizedGithub,
          demo_url: sanitizedDemo,
          video_url: sanitizedVideo,
          start_date: formStartDate.trim() || null,
          end_date: formEndDate.trim() || null,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          order_index: projects.length,
        };

        const { error } = await supabase.from("projects").insert(newProject);
        if (error) throw error;

        await fetchProjects();

        toast({
          title: "Project published",
          description: `"${title}" has been added to your showcase.`,
          variant: "default",
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      console.error("Save project failed:", err);
      setFormError(err.message || "Failed to save project. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (proj: Project) => {
    const newFeatured = !proj.is_featured;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_featured: newFeatured })
        .eq("id", proj.id);

      if (error) throw error;

      setProjects((prev) =>
        prev
          .map((p) => (p.id === proj.id ? { ...p, is_featured: newFeatured } : p))
          .sort((a, b) => {
            if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
            return (a.order_index ?? 0) - (b.order_index ?? 0);
          })
      );

      toast({
        title: newFeatured ? "Project Featured" : "Project Unfeatured",
        description: `"${proj.title}" ${newFeatured ? "will be pinned at the top" : "has standard priority"}.`,
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "Could not toggle featured state.",
        variant: "error",
      });
    }
  };

  // Toggle Enabled status
  const handleToggleEnabled = async (proj: Project) => {
    const newEnabled = !proj.is_enabled;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_enabled: newEnabled })
        .eq("id", proj.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, is_enabled: newEnabled } : p))
      );

      toast({
        title: newEnabled ? "Project visible" : "Project hidden",
        description: `"${proj.title}" is now ${newEnabled ? "live on" : "hidden from"} your public showcase.`,
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "Could not toggle visibility.",
        variant: "error",
      });
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      const remaining = projects.filter((p) => p.id !== deleteTarget.id);
      setProjects(remaining);
      onProjectsCountChanged?.(remaining.length);

      toast({
        title: "Project removed",
        description: `"${deleteTarget.title}" was deleted.`,
        variant: "default",
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete project.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reorder: Move Up / Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setProjects(updated);

    try {
      await Promise.all([
        supabase
          .from("projects")
          .update({ order_index: updated[index].order_index })
          .eq("id", updated[index].id),
        supabase
          .from("projects")
          .update({ order_index: updated[targetIndex].order_index })
          .eq("id", updated[targetIndex].id),
      ]);
    } catch (err) {
      console.error("Failed to persist project order:", err);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...projects];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    const reindexed = updated.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setDraggedIndex(index);
    setProjects(reindexed);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await Promise.all(
        projects.map((item, idx) =>
          supabase
            .from("projects")
            .update({ order_index: idx })
            .eq("id", item.id)
        )
      );
    } catch (err) {
      console.error("Failed to save reordered projects:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title, Actions & Responsive Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Projects &amp; Artifacts
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-xs">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Showcase systems, research, software, and artifacts you have built.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Edit / Preview View Switcher */}
          <div className="inline-flex lg:hidden rounded-lg border border-border p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "edit"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3 w-3" />
              <span>Manage</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "preview"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3 w-3" />
              <span>Preview</span>
            </button>
          </div>

          <Button
            onClick={handleOpenAddModal}
            size="sm"
            className="text-xs h-9 gap-1.5 shadow-subtle"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* 2. Responsive 2-Column Layout (Desktop) / Segmented View (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Projects Manager List */}
        <div
          className={cn(
            "lg:col-span-7 space-y-4",
            mobileView === "preview" ? "hidden lg:block" : "block"
          )}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border border-border bg-card/60 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            /* Empty State */
            <Card className="p-8 sm:p-12 text-center border-dashed border-border/80 bg-muted/10 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  No projects added yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Add your repositories, demos, robotics systems, and research papers to make your CollegeCentre showcase stand out.
                </p>
              </div>
              <Button
                onClick={handleOpenAddModal}
                size="sm"
                className="text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Your First Project</span>
              </Button>
            </Card>
          ) : (
            /* Projects Drag-and-Drop List */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
                <span>Drag to reorder • Click star to pin to top</span>
                <span>{projects.filter((p) => p.is_enabled).length} live</span>
              </div>

              {projects.map((proj, index) => {
                const isDragging = draggedIndex === index;
                const hasCover = Boolean(proj.cover_image_url);

                return (
                  <div
                    key={proj.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group relative rounded-xl border bg-card p-3.5 transition-all duration-200 select-none",
                      proj.is_enabled
                        ? "border-border shadow-xs hover:border-foreground/30 hover:shadow-subtle"
                        : "border-border/60 bg-muted/20 opacity-70",
                      proj.is_featured && "ring-1 ring-brand/40 bg-brand/[0.02]",
                      isDragging && "opacity-40 scale-[0.99] border-dashed border-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Drag Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground pt-1"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      {/* Cover Thumbnail / Icon */}
                      <div className="w-14 h-14 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                        {hasCover ? (
                          <img
                            src={proj.cover_image_url!}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Code2 className="h-6 w-6 text-muted-foreground/60" />
                        )}
                        {proj.is_featured && (
                          <div className="absolute top-0.5 right-0.5 bg-brand text-brand-foreground rounded-full p-0.5 shadow-xs">
                            <Star className="h-2 w-2 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Main Project Meta */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-foreground truncate max-w-xs">
                            {proj.title}
                          </h4>

                          {proj.is_featured && (
                            <Badge
                              variant="brand"
                              size="sm"
                              className="text-[9px] font-mono px-1.5 py-0 gap-0.5"
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              Featured
                            </Badge>
                          )}

                          {!proj.is_enabled && (
                            <Badge
                              variant="outline"
                              size="sm"
                              className="text-[9px] font-mono text-muted-foreground px-1.5 py-0"
                            >
                              Hidden
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {proj.description}
                        </p>

                        {/* Tech Stack Chips & Links Indicators */}
                        <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[11px]">
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex items-center gap-1 truncate max-w-xs">
                              {proj.technologies.slice(0, 3).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/70 text-foreground/80 border border-border/40"
                                >
                                  {t}
                                </span>
                              ))}
                              {proj.technologies.length > 3 && (
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  +{proj.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Link badges */}
                          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                            {proj.github_url && (
                              <span title="GitHub repository attached">
                                <GitHubIcon className="h-3 w-3" />
                              </span>
                            )}
                            {proj.demo_url && (
                              <span title="Live demo attached">
                                <ExternalLink className="h-3 w-3 text-brand" />
                              </span>
                            )}
                            {proj.video_url && (
                              <span title="Video walkthrough attached">
                                <PlayCircle className="h-3 w-3 text-brand" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Control Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {/* Toggle Featured Star */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            proj.is_featured
                              ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                              : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                          )}
                          title={proj.is_featured ? "Unpin featured" : "Pin as featured"}
                          aria-label="Toggle featured"
                        >
                          <Star
                            className={cn(
                              "h-3.5 w-3.5",
                              proj.is_featured && "fill-current"
                            )}
                          />
                        </button>

                        {/* Toggle Visibility Switch / Eye */}
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(proj)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            proj.is_enabled
                              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                              : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
                          )}
                          title={proj.is_enabled ? "Hide project" : "Make project visible"}
                          aria-label="Toggle project visibility"
                        >
                          {proj.is_enabled ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                          aria-label="Move project up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === projects.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                          aria-label="Move project down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenEditModal(proj)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit project"
                          aria-label="Edit project"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(proj)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Delete project"
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Showcase Preview (Sticky Desktop) */}
        <div
          className={cn(
            "lg:col-span-5 sticky top-24",
            mobileView === "edit" ? "hidden lg:block" : "block"
          )}
        >
          <LiveProfileCard
            profile={profile}
            socialLinks={socialLinks}
            projects={projects}
          />
        </div>
      </div>

      {/* 3. Add / Edit Project Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 border-border bg-card">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide your project details, tech stack, and live artifact links.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Project Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="proj-title"
                className="text-xs font-medium text-foreground block"
              >
                Project Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="proj-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Real-Time SLAM Drone, Distributed Raft Engine"
                className="text-sm h-9"
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="proj-desc"
                className="text-xs font-medium text-foreground block"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="proj-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Explain what you built, system architecture, performance achievements, and key challenges solved..."
                rows={4}
                className="text-sm resize-none"
                required
              />
            </div>

            {/* Cover Image Upload / URL */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Cover Image (Upload or Direct URL)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={formCoverUrl}
                  onChange={(e) => setFormCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  className="text-xs h-9 font-mono"
                />

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="sr-only"
                    disabled={isUploadingImage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 gap-1.5 text-xs shrink-0"
                    disabled={isUploadingImage}
                    asChild
                  >
                    <span>
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingImage ? "Uploading..." : "Browse"}</span>
                    </span>
                  </Button>
                </label>

                {formCoverUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setFormCoverUrl("")}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {formCoverUrl && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={formCoverUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Technologies Tag Manager */}
            <div className="space-y-1.5">
              <label
                htmlFor="proj-tech"
                className="text-xs font-medium text-foreground block"
              >
                Technologies Used (Press Enter or Comma to add)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="proj-tech"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      handleAddTech(techInput);
                    }
                  }}
                  placeholder="e.g. Next.js, Rust, PyTorch, ROS2"
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTech(techInput)}
                  className="h-9 text-xs px-3 shrink-0"
                >
                  Add
                </Button>
              </div>

              {formTechs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formTechs.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1 pl-2 pr-1 py-0.5 bg-muted/50"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-muted-foreground hover:text-foreground p-0.5"
                        aria-label={`Remove ${tech}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Links Grid: GitHub, Live Demo, Video */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label
                  htmlFor="proj-github"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </label>
                <Input
                  id="proj-github"
                  value={formGithubUrl}
                  onChange={(e) => setFormGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="proj-demo"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-brand" />
                  <span>Live Demo URL</span>
                </label>
                <Input
                  id="proj-demo"
                  value={formDemoUrl}
                  onChange={(e) => setFormDemoUrl(e.target.value)}
                  placeholder="https://demo.project.com"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label
                  htmlFor="proj-video"
                  className="text-xs font-medium text-foreground flex items-center gap-1.5"
                >
                  <PlayCircle className="h-3.5 w-3.5 text-brand" />
                  <span>Demo Video (YouTube or Loom URL)</span>
                </label>
                <Input
                  id="proj-video"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or Loom"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label
                  htmlFor="proj-start"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Start Date</span>
                </label>
                <Input
                  id="proj-start"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  placeholder="e.g. Jan 2026 or 2026-01"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="proj-end"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  <span>End Date</span>
                </label>
                <Input
                  id="proj-end"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  placeholder="e.g. Present or 2026-06"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Toggles: Featured & Visible */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/80">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Feature Project</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Pin at top of showcase with prominent badge
                  </span>
                </div>
                <Switch
                  checked={formFeatured}
                  onCheckedChange={setFormFeatured}
                  aria-label="Toggle featured"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">
                    Public Visibility
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Show on public profile
                  </span>
                </div>
                <Switch
                  checked={formEnabled}
                  onCheckedChange={setFormEnabled}
                  aria-label="Toggle enabled"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/80">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs gap-1.5"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>{editingProject ? "Save Changes" : "Create Project"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Delete Project?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete Project"
        cancelLabel="Keep Project"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
