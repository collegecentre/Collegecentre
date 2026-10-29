"use client";

import * as React from "react";
import {
  Plus,
  GripVertical,
  Globe,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  MousePointerClick,
  Smartphone,
  Monitor,
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
import { supabase } from "@/lib/supabase";
import type { Profile, StudentLink, SocialLink, LinkCategory } from "@/types";
import { cn } from "@/lib/utils";

interface LinksManagerTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onLinksCountChanged?: (count: number) => void;
}

const CATEGORIES: Array<{ id: LinkCategory; label: string }> = [
  { id: "engineering", label: "Engineering & Code" },
  { id: "research", label: "Research & Preprints" },
  { id: "writing", label: "Writing & Essays" },
  { id: "portfolio", label: "Portfolio & Demos" },
  { id: "social", label: "Social & Community" },
  { id: "other", label: "Other Link" },
];

function sanitizeUrl(raw: string): string {
  const clean = (raw || "").trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("mailto:")) {
    return clean;
  }
  return `https://${clean}`;
}

function isValidHttpUrl(raw: string): boolean {
  try {
    const url = new URL(sanitizeUrl(raw));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function LinksManagerTab({
  profile,
  socialLinks,
  onLinksCountChanged,
}: LinksManagerTabProps) {
  const { toast } = useToast();

  const [links, setLinks] = React.useState<StudentLink[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mobile segmented control: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingLink, setEditingLink] = React.useState<StudentLink | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formUrl, setFormUrl] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formThumbnail, setFormThumbnail] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<LinkCategory | "">("engineering");
  const [formEnabled, setFormEnabled] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<StudentLink | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  // 1. Fetch links on mount
  const fetchLinks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("student_links")
        .select("*")
        .eq("profile_id", profile.id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      const loaded = ((data || []) as StudentLink[]).sort(
        (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
      );
      setLinks(loaded);
      if (onLinksCountChanged) onLinksCountChanged(loaded.length);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to load links",
        description: err.message || "Could not retrieve showcase links.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [profile.id, toast, onLinksCountChanged]);

  React.useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingLink(null);
    setFormTitle("");
    setFormUrl("");
    setFormDescription("");
    setFormThumbnail("");
    setFormCategory("engineering");
    setFormEnabled(true);
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (link: StudentLink) => {
    setEditingLink(link);
    setFormTitle(link.title);
    setFormUrl(link.url);
    setFormDescription(link.description || "");
    setFormThumbnail(link.thumbnail_url || "");
    setFormCategory((link.category as LinkCategory) || "engineering");
    setFormEnabled(link.is_enabled ?? true);
    setFormError(null);
    setModalOpen(true);
  };

  // Submit Add / Edit Link
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const titleClean = formTitle.trim();
    if (!titleClean) {
      setFormError("Title is required.");
      return;
    }

    const urlClean = sanitizeUrl(formUrl);
    if (!urlClean || !isValidHttpUrl(urlClean)) {
      setFormError("Please enter a valid website URL (e.g. https://yourdomain.com).");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLink) {
        // Update existing link
        const updates = {
          title: titleClean,
          url: urlClean,
          description: formDescription.trim() || null,
          thumbnail_url: formThumbnail.trim() || null,
          category: formCategory || null,
          is_enabled: formEnabled,
        };

        const { error } = await supabase
          .from("student_links")
          .update(updates)
          .eq("id", editingLink.id);

        if (error) throw error;

        setLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? { ...l, ...updates } : l))
        );

        toast({
          title: "Link updated",
          description: `"${titleClean}" has been saved.`,
          variant: "success",
        });
      } else {
        // Create new link
        const newRecord = {
          profile_id: profile.id,
          title: titleClean,
          url: urlClean,
          description: formDescription.trim() || null,
          thumbnail_url: formThumbnail.trim() || null,
          category: formCategory || null,
          is_enabled: formEnabled,
          order_index: links.length,
          clicks_count: 0,
        };

        const { data, error } = await supabase
          .from("student_links")
          .insert(newRecord);

        if (error) throw error;

        const inserted = Array.isArray(data) ? data[0] : newRecord;
        setLinks((prev) => [...prev, inserted as StudentLink]);

        toast({
          title: "Link created",
          description: `"${titleClean}" added to your showcase.`,
          variant: "success",
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to save link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Enable / Disable Toggle
  const handleToggleEnable = async (link: StudentLink, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = !link.is_enabled;

    // Optimistic update
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, is_enabled: nextState } : l))
    );

    try {
      await supabase
        .from("student_links")
        .update({ is_enabled: nextState })
        .eq("id", link.id);

      toast({
        title: nextState ? "Link enabled" : "Link hidden",
        description: nextState
          ? `"${link.title}" is now visible on your public showcase.`
          : `"${link.title}" is hidden from your public showcase.`,
        variant: nextState ? "info" : "default",
      });
    } catch (err: any) {
      console.error(err);
      // Revert optimistic update
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, is_enabled: !nextState } : l))
      );
    }
  };

  // Reorder: Move Up / Down
  const handleMove = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= links.length) return;

    const copy = [...links];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);

    // Update order_index on all
    const updated = copy.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setLinks(updated);

    // Persist new ordering to DB
    try {
      for (const item of updated) {
        await supabase
          .from("student_links")
          .update({ order_index: item.order_index })
          .eq("id", item.id);
      }
    } catch (err) {
      console.error("Failed to persist link ordering:", err);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    handleMove(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("student_links")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      toast({
        title: "Link deleted",
        description: `"${deleteTarget.title}" was removed.`,
        variant: "default",
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast({
        title: "Failed to delete link",
        description: err.message || "An error occurred.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Showcase Links
            </h2>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              {links.length} {links.length === 1 ? "Link" : "Links"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-0.5">
            Curate portfolios, GitHub repos, technical writing, and preprints. Reorder via drag &amp; drop.
          </p>
        </div>

        {/* Action Controls & Mobile Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* Mobile Edit vs Preview Segmented Control */}
          <div className="inline-flex lg:hidden rounded-lg bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={cn(
                "px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5",
                mobileView === "edit"
                  ? "bg-background text-foreground shadow-subtle font-semibold"
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
                "px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5",
                mobileView === "preview"
                  ? "bg-background text-foreground shadow-subtle font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs font-semibold shadow-subtle"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add New Link
          </Button>
        </div>
      </div>

      {/* 2. Main Desktop Split Screen / Mobile View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Links List & Drag Manager */}
        <div
          className={cn(
            "lg:col-span-7 space-y-4",
            mobileView === "preview" && "hidden lg:block"
          )}
        >
          {links.length > 0 ? (
            <div className="space-y-2.5">
              {links.map((link, index) => {
                const domain = link.url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
                const isFirst = index === 0;
                const isLast = index === links.length - 1;

                return (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={cn(
                      "group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-150 bg-card select-none",
                      link.is_enabled
                        ? "border-border hover:border-foreground/30 shadow-xs"
                        : "border-dashed border-border/80 bg-muted/20 opacity-75",
                      draggedIndex === index && "opacity-40 border-primary"
                    )}
                  >
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 shrink-0 -ml-1"
                      title="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Thumbnail / Icon */}
                    {link.thumbnail_url ? (
                      <div className="h-9 w-9 rounded-lg overflow-hidden border border-border/70 shrink-0 bg-muted">
                        <img
                          src={link.thumbnail_url}
                          alt={link.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-9 w-9 rounded-lg border border-border/60 bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0">
                        <Globe className="h-4 w-4" />
                      </div>
                    )}

                    {/* Link Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {link.title}
                        </span>
                        {link.category && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground uppercase shrink-0">
                            {link.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate font-mono text-[11px]">{domain}</span>
                        {link.clicks_count !== undefined && (
                          <>
                            <span className="text-border">•</span>
                            <span className="text-[10px] font-mono flex items-center gap-1 text-muted-foreground">
                              <MousePointerClick className="h-2.5 w-2.5" />
                              {link.clicks_count} {link.clicks_count === 1 ? "click" : "clicks"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Status & Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up / Down Accessible Controls */}
                      <div className="hidden sm:flex flex-col mr-1">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMove(index, index - 1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                          title="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMove(index, index + 1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Enable / Disable Switch */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleEnable(link, e)}
                        className={cn(
                          "px-2 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors flex items-center gap-1",
                          link.is_enabled
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                        title={link.is_enabled ? "Click to hide" : "Click to enable"}
                      >
                        {link.is_enabled ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span className="hidden md:inline">Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span className="hidden md:inline">Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(link)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit link"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(link)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete link"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <Card className="p-10 border-dashed border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-muted-foreground mx-auto">
                <Link2 className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  No links added yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Add custom links to your projects, GitHub repositories, blog posts, and academic papers to showcase what you build.
                </p>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={handleOpenCreate}
                className="text-xs font-semibold shadow-subtle"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Your First Link
              </Button>
            </Card>
          )}

          {/* Quick Tip Bar */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>Links display in real time on your public profile.</span>
            </span>
            <span className="font-mono text-[11px]">
              Drag handle to reorder
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Profile Preview (Always visible on desktop, toggled on mobile) */}
        <div
          className={cn(
            "lg:col-span-5 lg:sticky lg:top-20 space-y-4",
            mobileView === "edit" && "hidden lg:block"
          )}
        >
          <LiveProfileCard
            profile={profile}
            socialLinks={socialLinks}
            studentLinks={links}
          />
        </div>
      </div>

      {/* 3. Add / Edit Link Dialog Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingLink ? "Edit Showcase Link" : "Add Showcase Link"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure destination, category, and optional preview details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Title <span className="text-primary">*</span>
              </label>
              <Input
                placeholder="e.g. Distributed Key-Value Store Repo"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Destination URL <span className="text-primary">*</span>
              </label>
              <Input
                placeholder="https://github.com/username/project"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Category Tag
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormCategory(cat.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                      formCategory === cat.id
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Brief summary explaining what visitors will find when following this link..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Thumbnail Image URL (Optional)
              </label>
              <Input
                placeholder="https://.../preview.png"
                value={formThumbnail}
                onChange={(e) => setFormThumbnail(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Enabled / Disabled Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Link Visibility
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Display on your public CollegeCentre profile
                </span>
              </div>
              <Switch
                checked={formEnabled}
                onCheckedChange={setFormEnabled}
                aria-label="Toggle link visibility"
              />
            </div>

            {/* Error Feedback */}
            {formError && (
              <p className="text-xs text-destructive flex items-center gap-1.5 pt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={isSubmitting}
                className="text-xs font-semibold shadow-subtle min-w-[100px]"
              >
                {editingLink ? "Save Changes" : "Create Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete showcase link?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Link"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
