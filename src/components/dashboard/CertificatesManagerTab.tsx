"use client";

import * as React from "react";
import {
  Plus,
  GripVertical,
  Star,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Calendar,
  Upload,
  X,
  Smartphone,
  Monitor,
  Check,
  AlertCircle,
  Building2,
  FileText,
  FileCheck2,
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
import { supabase, isLiveSupabase, realSupabase } from "@/lib/supabase";
import type { Profile, Certificate, SocialLink } from "@/types";
import { cn } from "@/lib/utils";

interface CertificatesManagerTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onCertificatesCountChanged?: (count: number) => void;
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

export function CertificatesManagerTab({
  profile,
  socialLinks,
  onCertificatesCountChanged,
}: CertificatesManagerTabProps) {
  const { toast } = useToast();

  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mobile segmented control: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCert, setEditingCert] = React.useState<Certificate | null>(null);

  // Form Fields
  const [formName, setFormName] = React.useState("");
  const [formIssuer, setFormIssuer] = React.useState("");
  const [formIssueDate, setFormIssueDate] = React.useState("");
  const [formExpirationDate, setFormExpirationDate] = React.useState("");
  const [formCredentialId, setFormCredentialId] = React.useState("");
  const [formCredentialUrl, setFormCredentialUrl] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");
  const [formPdfUrl, setFormPdfUrl] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formFeatured, setFormFeatured] = React.useState(false);
  const [formEnabled, setFormEnabled] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = React.useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = React.useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  // 1. Fetch certificates on mount
  const fetchCertificates = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("profile_id", profile.id);

      if (error) {
        console.error("Failed to load certificates:", error);
      } else if (data) {
        const sorted = (data as Certificate[]).sort((a, b) => {
          if (a.is_featured !== b.is_featured) {
            return a.is_featured ? -1 : 1;
          }
          return (a.order_index ?? 0) - (b.order_index ?? 0);
        });
        setCertificates(sorted);
        onCertificatesCountChanged?.(sorted.length);
      }
    } catch (err) {
      console.error("Unexpected error fetching certificates:", err);
    } finally {
      setIsLoading(false);
    }
  }, [profile.id, onCertificatesCountChanged]);

  React.useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Open modal for new certificate
  const handleOpenAddModal = () => {
    setEditingCert(null);
    setFormName("");
    setFormIssuer("");
    setFormIssueDate("");
    setFormExpirationDate("");
    setFormCredentialId("");
    setFormCredentialUrl("");
    setFormImageUrl("");
    setFormPdfUrl("");
    setFormDescription("");
    setFormFeatured(false);
    setFormEnabled(true);
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal to edit existing certificate
  const handleOpenEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setFormName(cert.name);
    setFormIssuer(cert.issuer);
    setFormIssueDate(cert.issue_date);
    setFormExpirationDate(cert.expiration_date || "");
    setFormCredentialId(cert.credential_id || "");
    setFormCredentialUrl(cert.credential_url || "");
    setFormImageUrl(cert.image_url || "");
    setFormPdfUrl(cert.pdf_url || "");
    setFormDescription(cert.description || "");
    setFormFeatured(cert.is_featured);
    setFormEnabled(cert.is_enabled);
    setFormError(null);
    setModalOpen(true);
  };

  // Handle Certificate Image Upload
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

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Certificate images must be under 10MB.",
        variant: "error",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${profile.id}/images/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      if (isLiveSupabase) {
        const { error: uploadError } = await realSupabase.storage
          .from("certificates")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = realSupabase.storage
          .from("certificates")
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
        title: "Image uploaded",
        description: "Certificate image loaded successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload certificate image.",
        variant: "error",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Certificate PDF Upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast({
        title: "Invalid file",
        description: "Please select a valid PDF document (.pdf).",
        variant: "error",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Certificate PDFs must be under 10MB.",
        variant: "error",
      });
      return;
    }

    setIsUploadingPdf(true);
    try {
      const fileName = `${profile.id}/docs/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.pdf`;

      if (isLiveSupabase) {
        const { error: uploadError } = await realSupabase.storage
          .from("certificates")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = realSupabase.storage
          .from("certificates")
          .getPublicUrl(fileName);

        setFormPdfUrl(publicUrlData.publicUrl);
      } else {
        // Local mode fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setFormPdfUrl(result);
        };
        reader.readAsDataURL(file);
      }

      toast({
        title: "PDF uploaded",
        description: "Certificate PDF attached successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("PDF upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload certificate PDF.",
        variant: "error",
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Submit Form (Add or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = formName.trim();
    if (!name) {
      setFormError("Certificate name is required.");
      return;
    }

    const issuer = formIssuer.trim();
    if (!issuer) {
      setFormError("Issuing organization is required.");
      return;
    }

    const issueDate = formIssueDate.trim();
    if (!issueDate) {
      setFormError("Issue date is required (e.g. 'May 2025' or '2025-05').");
      return;
    }

    if (formCredentialUrl && !isValidHttpUrl(formCredentialUrl)) {
      setFormError("Credential URL must be a valid http or https web address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedCredentialUrl = formCredentialUrl ? sanitizeUrl(formCredentialUrl) : null;
      const sanitizedCredentialId = formCredentialId.trim() || null;
      const sanitizedExpiration = formExpirationDate.trim() || null;
      const sanitizedDescription = formDescription.trim() || null;
      const sanitizedImage = formImageUrl.trim() || null;
      const sanitizedPdf = formPdfUrl.trim() || null;

      if (editingCert) {
        // Update existing certificate
        const updates: Partial<Certificate> = {
          name,
          issuer,
          issue_date: issueDate,
          expiration_date: sanitizedExpiration,
          credential_id: sanitizedCredentialId,
          credential_url: sanitizedCredentialUrl,
          image_url: sanitizedImage,
          pdf_url: sanitizedPdf,
          description: sanitizedDescription,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("certificates")
          .update(updates)
          .eq("id", editingCert.id);

        if (error) throw error;

        setCertificates((prev) =>
          prev
            .map((c) => (c.id === editingCert.id ? { ...c, ...updates } : c))
            .sort((a, b) => {
              if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
              return (a.order_index ?? 0) - (b.order_index ?? 0);
            })
        );

        toast({
          title: "Certificate updated",
          description: `"${name}" has been saved.`,
          variant: "default",
        });
      } else {
        // Add new certificate
        const newCertificate: Partial<Certificate> = {
          profile_id: profile.id,
          name,
          issuer,
          issue_date: issueDate,
          expiration_date: sanitizedExpiration,
          credential_id: sanitizedCredentialId,
          credential_url: sanitizedCredentialUrl,
          image_url: sanitizedImage,
          pdf_url: sanitizedPdf,
          description: sanitizedDescription,
          is_featured: formFeatured,
          is_enabled: formEnabled,
          order_index: certificates.length,
        };

        const { error } = await supabase.from("certificates").insert(newCertificate);
        if (error) throw error;

        await fetchCertificates();

        toast({
          title: "Certificate added",
          description: `"${name}" has been added to your credentials.`,
          variant: "default",
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      console.error("Save certificate failed:", err);
      setFormError(err.message || "Failed to save certificate. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (cert: Certificate) => {
    const newFeatured = !cert.is_featured;
    try {
      const { error } = await supabase
        .from("certificates")
        .update({ is_featured: newFeatured })
        .eq("id", cert.id);

      if (error) throw error;

      setCertificates((prev) =>
        prev
          .map((c) => (c.id === cert.id ? { ...c, is_featured: newFeatured } : c))
          .sort((a, b) => {
            if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
            return (a.order_index ?? 0) - (b.order_index ?? 0);
          })
      );

      toast({
        title: newFeatured ? "Certificate Featured" : "Certificate Unfeatured",
        description: `"${cert.name}" ${newFeatured ? "will be pinned at the top" : "has standard priority"}.`,
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
  const handleToggleEnabled = async (cert: Certificate) => {
    const newEnabled = !cert.is_enabled;
    try {
      const { error } = await supabase
        .from("certificates")
        .update({ is_enabled: newEnabled })
        .eq("id", cert.id);

      if (error) throw error;

      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, is_enabled: newEnabled } : c))
      );

      toast({
        title: newEnabled ? "Certificate visible" : "Certificate hidden",
        description: `"${cert.name}" is now ${newEnabled ? "live on" : "hidden from"} your showcase.`,
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

  // Delete Certificate
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      const remaining = certificates.filter((c) => c.id !== deleteTarget.id);
      setCertificates(remaining);
      onCertificatesCountChanged?.(remaining.length);

      toast({
        title: "Certificate removed",
        description: `"${deleteTarget.name}" was deleted.`,
        variant: "default",
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete certificate.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Reorder: Move Up / Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;

    const reordered = [...certificates];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setCertificates(updated);

    try {
      await Promise.all([
        supabase
          .from("certificates")
          .update({ order_index: updated[index].order_index })
          .eq("id", updated[index].id),
        supabase
          .from("certificates")
          .update({ order_index: updated[targetIndex].order_index })
          .eq("id", updated[targetIndex].id),
      ]);
    } catch (err) {
      console.error("Failed to persist certificate order:", err);
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

    const updated = [...certificates];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    const reindexed = updated.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    setDraggedIndex(index);
    setCertificates(reindexed);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await Promise.all(
        certificates.map((item, idx) =>
          supabase
            .from("certificates")
            .update({ order_index: idx })
            .eq("id", item.id)
        )
      );
    } catch (err) {
      console.error("Failed to save reordered certificates:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title, Actions & Responsive Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Certificates &amp; Licenses
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-xs">
              {certificates.length} {certificates.length === 1 ? "credential" : "credentials"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Showcase industry certifications, accredited coursework, and verified professional licenses.
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
            <span>Add Certificate</span>
          </Button>
        </div>
      </div>

      {/* 2. Responsive 2-Column Layout (Desktop) / Segmented View (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Certificates Manager List */}
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
          ) : certificates.length === 0 ? (
            /* Empty State */
            <Card className="p-8 sm:p-12 text-center border-dashed border-border/80 bg-muted/10 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  No certificates listed yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Add AWS, NVIDIA, Google, or academic course certifications to authenticate your technical capabilities.
                </p>
              </div>
              <Button
                onClick={handleOpenAddModal}
                size="sm"
                className="text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Your First Certificate</span>
              </Button>
            </Card>
          ) : (
            /* Drag-and-Drop List */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
                <span>Drag to reorder • Star to pin to top</span>
                <span>{certificates.filter((c) => c.is_enabled).length} live</span>
              </div>

              {certificates.map((cert, index) => {
                const isDragging = draggedIndex === index;
                const hasImage = Boolean(cert.image_url);
                const hasPdf = Boolean(cert.pdf_url);

                return (
                  <div
                    key={cert.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group relative rounded-xl border bg-card p-3.5 transition-all duration-200 select-none",
                      cert.is_enabled
                        ? "border-border shadow-xs hover:border-foreground/30 hover:shadow-subtle"
                        : "border-border/60 bg-muted/20 opacity-70",
                      cert.is_featured && "ring-1 ring-brand/40 bg-brand/[0.02]",
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

                      {/* Issuer Emblem or Avatar */}
                      <div className="w-11 h-11 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                        {hasImage ? (
                          <img
                            src={cert.image_url!}
                            alt={cert.issuer}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShieldCheck className="h-5 w-5 text-brand" />
                        )}
                        {cert.is_featured && (
                          <div className="absolute top-0.5 right-0.5 bg-brand text-brand-foreground rounded-full p-0.5 shadow-xs">
                            <Star className="h-1.5 w-1.5 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Main Certificate Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-semibold text-foreground truncate max-w-xs">
                            {cert.name}
                          </h4>

                          {cert.is_featured && (
                            <Badge
                              variant="brand"
                              size="sm"
                              className="text-[9px] font-mono px-1 py-0 gap-0.5"
                            >
                              <Sparkles className="h-2 w-2" />
                              Featured
                            </Badge>
                          )}

                          {!cert.is_enabled && (
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
                            <span>{cert.issuer}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px] flex items-center gap-1">
                            <Calendar className="h-3 w-3 opacity-60" />
                            <span>Issued {cert.issue_date}</span>
                          </span>
                          {cert.expiration_date && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px]">
                                Expires {cert.expiration_date}
                              </span>
                            </>
                          )}
                        </div>

                        {cert.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                            {cert.description}
                          </p>
                        )}

                        {/* Badges / Links Row */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] font-mono text-muted-foreground">
                          {cert.credential_id && (
                            <span className="px-1.5 py-0.2 rounded bg-muted/50 border border-border/40">
                              ID: {cert.credential_id}
                            </span>
                          )}

                          {hasPdf && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                              <FileText className="h-2.5 w-2.5" />
                              <span>PDF Attached</span>
                            </span>
                          )}

                          {cert.credential_url && (
                            <span className="inline-flex items-center gap-0.5 text-brand">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verifiable</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Control Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {/* Toggle Featured Star */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(cert)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            cert.is_featured
                              ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                              : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                          )}
                          title={cert.is_featured ? "Unpin featured" : "Pin as featured"}
                          aria-label="Toggle featured"
                        >
                          <Star
                            className={cn(
                              "h-3.5 w-3.5",
                              cert.is_featured && "fill-current"
                            )}
                          />
                        </button>

                        {/* Toggle Visibility Switch / Eye */}
                        <button
                          type="button"
                          onClick={() => handleToggleEnabled(cert)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            cert.is_enabled
                              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                              : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
                          )}
                          title={cert.is_enabled ? "Hide certificate" : "Make visible"}
                          aria-label="Toggle visibility"
                        >
                          {cert.is_enabled ? (
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
                          aria-label="Move certificate up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === certificates.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                          aria-label="Move certificate down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenEditModal(cert)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit certificate"
                          aria-label="Edit certificate"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(cert)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Delete certificate"
                          aria-label="Delete certificate"
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
            certificates={certificates}
          />
        </div>
      </div>

      {/* 3. Add / Edit Certificate Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 border-border bg-card">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              {editingCert ? "Edit Certificate" : "Add New Certificate"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide credential details, issuing authority, and proof verification links.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Certificate Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="cert-name"
                className="text-xs font-medium text-foreground block"
              >
                Certificate Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="cert-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect - Associate"
                className="text-sm h-9"
                required
              />
            </div>

            {/* Issuing Organization */}
            <div className="space-y-1.5">
              <label
                htmlFor="cert-issuer"
                className="text-xs font-medium text-foreground block"
              >
                Issuing Organization <span className="text-destructive">*</span>
              </label>
              <Input
                id="cert-issuer"
                value={formIssuer}
                onChange={(e) => setFormIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services, NVIDIA, Stanford, Coursera"
                className="text-xs h-9"
                required
              />
            </div>

            {/* Dates: Issue & Expiration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="cert-issue-date"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Issue Date <span className="text-destructive">*</span></span>
                </label>
                <Input
                  id="cert-issue-date"
                  value={formIssueDate}
                  onChange={(e) => setFormIssueDate(e.target.value)}
                  placeholder="e.g. May 2025 or 2025-05"
                  className="text-xs h-9 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cert-exp-date"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Expiration Date (Optional)</span>
                </label>
                <Input
                  id="cert-exp-date"
                  value={formExpirationDate}
                  onChange={(e) => setFormExpirationDate(e.target.value)}
                  placeholder="e.g. May 2028 or No Expiration"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Credential ID & Verification URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="cert-id"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <FileCheck2 className="h-3 w-3 text-brand" />
                  <span>Credential ID (Optional)</span>
                </label>
                <Input
                  id="cert-id"
                  value={formCredentialId}
                  onChange={(e) => setFormCredentialId(e.target.value)}
                  placeholder="e.g. AWS-SAA-839210"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="cert-url"
                  className="text-xs font-medium text-foreground flex items-center gap-1"
                >
                  <ShieldCheck className="h-3 w-3 text-brand" />
                  <span>Verification URL (Optional)</span>
                </label>
                <Input
                  id="cert-url"
                  value={formCredentialUrl}
                  onChange={(e) => setFormCredentialUrl(e.target.value)}
                  placeholder="https://aws.amazon.com/verify/..."
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="cert-desc"
                className="text-xs font-medium text-foreground block"
              >
                Description / Covered Skills (Optional)
              </label>
              <Textarea
                id="cert-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Overview of validated competencies, topics, and practical labs covered..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            {/* Image Upload & PDF Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                  Certificate Image (Upload or URL)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://... or upload image"
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
                      className="h-9 px-2.5 text-xs shrink-0"
                      disabled={isUploadingImage}
                      asChild
                    >
                      <span>
                        <Upload className="h-3 w-3" />
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
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                  Certificate PDF (Upload or URL)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={formPdfUrl}
                    onChange={(e) => setFormPdfUrl(e.target.value)}
                    placeholder="https://... or upload PDF"
                    className="text-xs h-9 font-mono"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handlePdfUpload}
                      className="sr-only"
                      disabled={isUploadingPdf}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 px-2.5 text-xs shrink-0"
                      disabled={isUploadingPdf}
                      asChild
                    >
                      <span>
                        <Upload className="h-3 w-3" />
                      </span>
                    </Button>
                  </label>
                  {formPdfUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setFormPdfUrl("")}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      title="Remove PDF"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Toggles: Featured & Visible */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/80">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Feature Certificate</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Pin at top of credentials with distinct highlight
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
                    <span>{editingCert ? "Save Changes" : "Create Certificate"}</span>
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
        title="Delete Certificate?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete Credential"
        cancelLabel="Keep Credential"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
