"use client";

import * as React from "react";
import {
  Plus,
  GripVertical,
  Star,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Award,
  Sparkles,
  Calendar,
  Upload,
  X,
  Smartphone,
  Monitor,
  Check,
  AlertCircle,
  Building2,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
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
import { getAchievementTypeMeta } from "@/components/profile/AchievementsShowcase";
import { supabase, isLiveSupabase, realSupabase } from "@/lib/supabase";
import type { Profile, Achievement, AchievementType, SocialLink } from "@/types";
import { cn } from "@/lib/utils";

interface AchievementsManagerTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onAchievementsCountChanged?: (count: number) => void;
}

const ACHIEVEMENT_TYPES: Array<{
  value: AchievementType;
  label: string;
}> = [
  { value: "hackathon", label: "Hackathon" },
  { value: "competition", label: "Competition" },
  { value: "award", label: "Award & Honor" },
  { value: "open_source", label: "Open Source" },
  { value: "academic", label: "Academic Honor" },
  { value: "leadership", label: "Leadership" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
];

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

export function AchievementsManagerTab({
  profile,
  socialLinks,
  onAchievementsCountChanged,
}: AchievementsManagerTabProps) {
  const { toast } = useToast();

  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mobile segmented control: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingAchievement, setEditingAchievement] = React.useState<Achievement | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formOrganization, setFormOrganization] = React.useState("");
  const [formType, setFormType] = React.useState<AchievementType>("hackathon");
  const [formDate, setFormDate] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");
  const [formVerificationUrl, setFormVerificationUrl] = React.useState("");
  const [formCredentialId, setFormCredentialId] = React.useState("");
  const [formFeatured, setFormFeatured] = React.useState(false);
  const [formEnabled, setFormEnabled] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<Achievement | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  // 1. Fetch achievements on mount
  const fetchAchievements = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", profile.id);

      if (error) {
        console.error("Failed to load achievements:", error);
      } else if (data) {
        const sorted = (data as Achievement[]).sort((a, b) => {
          if (a.is_featured !== b.is_featured) {
            return a.is_featured ? -1 : 1;
          }
          return (a.order_index ?? 0) - (b.order_index ?? 0);
        });
        setAchievements(sorted);
        onAchievementsCountChanged?.(sorted.length);
      }
    } catch (err) {
      console.error("Unexpected error fetching achievements:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profile.id, onAchievementsCountChanged]);

  React.useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Open modal for new achievement
  const handleOpenAddModal = () => {
    setEditingAchievement(null);
    setFormTitle("");
    setFormOrganization("");
    setFormType("hackathon");
    setFormDate("");
    setFormDescription("");
    setFormImageUrl("");
    setFormVerificationUrl("");
    setFormCredentialId("");
    setFormFeatured(false);
    setFormEnabled(true);
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal to edit existing achievement
  const handleOpenEditModal = (ach: Achievement) => {
    setEditingAchievement(ach);
    setFormTitle(ach.title);
    setFormOrganization(ach.organization);
    setFormType(ach.type);
    setFormDate(ach.date);
    setFormDescription(ach.description || "");
    setFormImageUrl(ach.image_url || "");
    setFormVerificationUrl(ach.verification_url || "");
    setFormCredentialId(ach.credential_id || "");
    setFormFeatured(ach.is_featured);
    setFormEnabled(ach.is_enabled);
    setFormError(null);
    setModalOpen(true);
  };

  // Handle Organization Logo / Badge Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: "Images must be under 5MB.",
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
          .from("achievement-images")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = realSupabase.storage
          .from("achievement-images")
          .getPublicUrl(fileName);

        setFormImageUrl(publicUrlData.publicUrl);
      } else {
        // Local mode fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormImageUrl(result);
        };
        reader.readAsDataURL(file);
      }

      toast({
        title: "Logo uploaded",
        description: "Achievement badge loaded successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Achievement image upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload image.",
        variant: "error",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Form (Add or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const title = formTitle.trim();
    if (!title) {
      setFormError("Achievement title is required.");
      return;
    }

    const organization = formOrganization.trim();
    if (!organization) {
      setFormError("Awarding organization is required.");
      return;
    }

    const date = formDate.trim();
    if (!date) {
      setFormError("Date is required (e.g. 'Oct 2025' or '2025-10').");
      return;
    }

    if (formVerificationUrl && !isValidHttpUrl(formVerificationUrl)) {
      setFormError("Verification URL must be a valid http or https web address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedVerification = formVerificationUrl ? sanitizeUrl(formVerificationUrl) : null;
      const sanitizedCredential = formCredentialId.trim() || null;
      const sanitizedDescription = formDescription.trim() || null;
      const sanitizedImage = formImageUrl.trim() || null;

      if (editingAchievement) {
        // Update existing achievement
        const updates: Partial<Achievement> = {
          title,
          organization,
          type: formType,
          date,
          description: sanitizedDescription,
          image_url: sanitizedImage,
          verification_url: sanitizedVerification,
          credential_id: sanitizedCredential,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("achievements")
          .update(updates)
          .eq("id", editingAchievement.id);

        if (error) throw error;

        setAchievements((prev) =>
          prev
            .map((a) => (a.id === editingAchievement.id ? { ...a, ...updates } : a))
            .sort((a, b) => {
              if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
              return (a.order_index ?? 0) - (b.order_index ?? 0);
            })
        );

        toast({
          title: "Achievement updated",
          description: `"${title}" has been saved.`,
          variant: "default",
        });
      } else {
        // Add new achievement
        const newAchievement: Partial<Achievement> = {
          profile_id: profile.id,
          title,
          organization,
          type: formType,
          date,
          description: sanitizedDescription,
          image_url: sanitizedImage,
          verification_url: sanitizedVerification,
          credential_id: sanitizedCredential,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          order_index: achievements.length,
        };

        const { error } = await supabase.from("achievements").insert(newAchievement);
        if (error) throw error;

        await fetchAchievements();

        toast({
          title: "Achievement added",
          description: `"${title}" has been added to your showcase.`,
          variant: "default",
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      console.error("Save achievement failed:", err);
      setFormError(err.message || "Failed to save achievement. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (ach: Achievement) => {
    const newFeatured = !ach.is_featured;
    try {
      const { error } = await supabase
        .from("achievements")
        .update({ is_featured: newFeatured })
        .eq("id", ach.id);

      if (error) throw error;

      setAchievements((prev) =>
        prev
          .map((a) => (a.id === ach.id ? { ...a, is_featured: newFeatured } : a))
          .sort((a, b) => {
            if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
            return (a.order_index ?? 0) - (b.order_index ?? 0);
          })
      );

      toast({
        title: newFeatured ? "Achievement Featured" : "Achievement Unfeatured",
        description: `"${ach.title}" ${newFeatured ? "will be pinned at the top" : "has standard priority"}.`,
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
  const handleToggleEnabled = async (ach: Achievement) => {
    const newEnabled = !ach.is_enabled;
    try {
      const { error } = await supabase
        .from("achievements")
        .update({ is_enabled: newEnabled })
        .eq("id", ach.id);

      if (error) throw error;

      setAchievements((prev) =>
        prev.map((a) => (a.id === ach.id ? { ...a, is_enabled: newEnabled } : a))
      );

      toast({
        title: newEnabled ? "Achievement visible" : "Achievement hidden",
        description: `"${ach.title}" is now ${newEnabled ? "live on" : "hidden from"} your showcase.`,
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

  // Delete Achievement
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("achievements")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      const remaining = achievements.filter((a) => a.id !== deleteTarget.id);
      setAchievements(remaining);
      onAchievementsCountChanged?.(remaining.length);

      toast({
        title: "Achievement removed",
        description: `"${deleteTarget.title}" was deleted.`,
        variant: "default",
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete achievement.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reorder: Move Up / Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= achievements.length) return;

    const reordered = [...achievements];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setAchievements(updated);

    try {
      await Promise.all([
        supabase
          .from("achievements")
          .update({ order_index: updated[index].order_index })
          .eq("id", updated[index].id),
        supabase
          .from("achievements")
          .update({ order_index: updated[targetIndex].order_index })
          .eq("id", updated[targetIndex].id),
      ]);
    } catch (err) {
      console.error("Failed to persist achievement order:", err);
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

    const updated = [...achievements];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    const reindexed = updated.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setDraggedIndex(index);
    setAchievements(reindexed);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await Promise.all(
        achievements.map((item, idx) =>
          supabase
            .from("achievements")
            .update({ order_index: idx })
            .eq("id", item.id)
        )
      );
    } catch (err) {
      console.error("Failed to save reordered achievements:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title, Actions & Responsive Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Honors &amp; Achievements
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-xs">
              {achievements.length} {achievements.length === 1 ? "honor" : "honors"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Showcase hackathon victories, research awards, open source impact, and leadership honors.
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
            <span>Add Achievement</span>
          </Button>
        </div>
      </div>

      {/* 2. Responsive 2-Column Layout (Desktop) / Segmented View (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Achievements Manager List */}
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
                  className="h-24 rounded-xl border border-border bg-card/60 animate-pulse"
                />
              ))}
            </div>
          ) : achievements.length === 0 ? (
            /* Empty State */
            <Card className="p-8 sm:p-12 text-center border-dashed border-border/80 bg-muted/10 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  No achievements listed yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Add hackathons, research honors, competitive programming ranks, or leadership positions to build a credible student showcase.
                </p>
              </div>
              <Button
                onClick={handleOpenAddModal}
                size="sm"
                className="text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Your First Achievement</span>
              </Button>
            </Card>
          ) : (
            /* Drag-and-Drop List */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
                <span>Drag to reorder • Star to pin to top</span>
                <span>{achievements.filter((a) => a.is_enabled).length} live</span>
              </div>

              {achievements.map((ach, index) => {
                const isDragging = draggedIndex === index;
                const typeMeta = getAchievementTypeMeta(ach.type);
                const TypeIcon = typeMeta.icon;
                const hasImage = Boolean(ach.image_url);

                return (
                  <div
                    key={ach.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group relative rounded-xl border bg-card p-3.5 transition-all duration-200 select-none",
                      ach.is_enabled
                        ? "border-border shadow-xs hover:border-foreground/30 hover:shadow-subtle"
                        : "border-border/60 bg-muted/20 opacity-70",
                      ach.is_featured && "ring-1 ring-brand/40 bg-brand/[0.02]",
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

                      {/* Organization Logo / Type Icon */}
                      <div className="w-11 h-11 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                        {hasImage ? (
                          <img
                            src={ach.image_url!}
                            alt={ach.organization}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <TypeIcon className="h-5 w-5 text-primary" />
                        )}
                        {ach.is_featured && (
                          <div className="absolute top-0.5 right-0.5 bg-brand text-brand-foreground rounded-full p-0.5 shadow-xs">
                            <Star className="h-1.5 w-1.5 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Main Achievement Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-semibold text-foreground truncate max-w-xs">
                            {ach.title}
                          </h4>

                          {ach.is_featured && (
                            <Badge
                              variant="brand"
                              size="sm"
                              className="text-[9px] font-mono px-1 py-0 gap-0.5"
                            >
                              <Sparkles className="h-2 w-2" />
                              Featured
                            </Badge>
                          )}

                          {!ach.is_enabled && (
                            <Badge
                              variant="outline"
                              size="sm"
                              className="text-[9px] font-mono text-muted-foreground px-1.5 py-0"
                            >
                              Hidden
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                          <span className="font-medium text-foreground/80 flex items-center gap-1">
                            <Building2 className="h-3 w-3 opacity-70" />
                            <span>{ach.organization}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px] flex items-center gap-1">
                            <Calendar className="h-3 w-3 opacity-60" />
                            <span>{ach.date}</span>
                          </span>
                        </div>

                        {ach.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                            {ach.description}
                          </p>
                        )}

                        {/* Badges / Links Row */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] font-mono text-muted-foreground">
                          <span className="px-1.5 py-0.2 rounded bg-muted/70 text-foreground/80 border border-border/40">
                            {typeMeta.label}
                          </span>

                          {ach.credential_id && (
                            <span className="px-1.5 py-0.2 rounded bg-muted/40 border border-border/40">
                              ID: {ach.credential_id}
                            </span>
                          )}

                          {ach.verification_url && (
                            <span className="inline-flex items-center gap-0.5 text-brand">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Control Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {/* Toggle Featured Star */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(ach)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            ach.is_featured
                              ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                              : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                          )}
                          title={ach.is_featured ? "Unpin featured" : "Pin as featured"}
                          aria-label="Toggle featured"
                        >
                          <Star
                            className={cn(
                              "h-3.5 w-3.5",
                              ach.is_featured && "fill-current"
                            )}
                          />
                        </button>

                        {/* Toggle Visibility Switch / Eye */}
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(ach)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            ach.is_enabled
                              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                              : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
                          )}
                          title={ach.is_enabled ? "Hide achievement" : "Make visible"}
                          aria-label="Toggle visibility"
                        >
                          {ach.is_enabled ? (
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
                          aria-label="Move achievement up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === achievements.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                          aria-label="Move achievement down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenEditModal(ach)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit achievement"
                          aria-label="Edit achievement"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(ach)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Delete achievement"
                          aria-label="Delete achievement"
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
            achievements={achievements}
          />
        </div>
      </div>

      {/* 3. Add / Edit Achievement Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 border-border bg-card">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Highlight competitive victories, research papers, awards, and verified credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Achievement Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="ach-title"
                className="text-xs font-medium text-foreground block"
              >
                Achievement Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="ach-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. 1st Place Winner - Distributed Systems, NeurIPS Best Paper Award"
                className="text-sm h-9"
                required
              />
            </div>

            {/* Organization & Achievement Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="ach-org"
                  className="text-xs font-medium text-foreground block"
                >
                  Organization / Issuer <span className="text-destructive">*</span>
                </label>
                <Input
                  id="ach-org"
                  value={formOrganization}
                  onChange={(e) => setFormOrganization(e.target.value)}
                  placeholder="e.g. HackMIT, ACM, NeurIPS, Google"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ach-type"
                  className="text-xs font-medium text-foreground block"
                >
                  Achievement Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="ach-type"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as AchievementType)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {ACHIEVEMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Credential ID Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="ach-date"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Date Received <span className="text-destructive">*</span></span>
                </label>
                <Input
                  id="ach-date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  placeholder="e.g. Oct 2025 or 2025-10"
                  className="text-xs h-9 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ach-credential"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <FileCheck2 className="h-3 w-3 text-brand" />
                  <span>Credential / Reference ID (Optional)</span>
                </label>
                <Input
                  id="ach-credential"
                  value={formCredentialId}
                  onChange={(e) => setFormCredentialId(e.target.value)}
                  placeholder="e.g. HACKMIT-2025-1049"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Verification URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="ach-verification"
                className="text-xs font-medium text-foreground flex items-center gap-1"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                <span>Verification / Proof URL (Optional)</span>
              </label>
              <Input
                id="ach-verification"
                value={formVerificationUrl}
                onChange={(e) => setFormVerificationUrl(e.target.value)}
                placeholder="https://hackmit.org/winners/2025 or credential verification page"
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="ach-desc"
                className="text-xs font-medium text-foreground block"
              >
                Description / Impact Summary (Optional)
              </label>
              <Textarea
                id="ach-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Explain the scale of the competition, criteria, or notable milestone achievements..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            {/* Image / Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Organization Emblem / Badge Image (Optional)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://... or upload logo image"
                  className="text-xs h-9 font-mono"
                />

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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

                {formImageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setFormImageUrl("")}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {formImageUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                  <img
                    src={formImageUrl}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Toggles: Featured & Visible */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/80">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Feature Achievement</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Pin at top of honors section with distinct marker
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
                    <span>{editingAchievement ? "Save Changes" : "Create Achievement"}</span>
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
        title="Delete Achievement?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete Honor"
        cancelLabel="Keep Honor"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
