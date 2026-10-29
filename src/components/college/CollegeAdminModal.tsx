"use client";

import * as React from "react";
import { X, ShieldCheck, AlertCircle, Save, Loader2, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import type { College } from "@/types";
import { updateCollegeProfile } from "@/lib/college-service";

interface CollegeAdminModalProps {
  college: College;
  isOpen: boolean;
  onClose: () => void;
  adminUserId: string;
  onCollegeUpdated: (updated: College) => void;
  onRequestVerification: () => void;
}

export function CollegeAdminModal({
  college,
  isOpen,
  onClose,
  adminUserId,
  onCollegeUpdated,
  onRequestVerification,
}: CollegeAdminModalProps) {
  const { toast } = useToast();
  const [name, setName] = React.useState(college.name);
  const [shortName, setShortName] = React.useState(college.short_name || "");
  const [description, setDescription] = React.useState(college.description || "");
  const [location, setLocation] = React.useState(college.location || "");
  const [website, setWebsite] = React.useState(college.website || "");
  const [logoUrl, setLogoUrl] = React.useState(college.logo_url || "");
  const [bannerUrl, setBannerUrl] = React.useState(college.banner_url || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setName(college.name);
    setShortName(college.short_name || "");
    setDescription(college.description || "");
    setLocation(college.location || "");
    setWebsite(college.website || "");
    setLogoUrl(college.logo_url || "");
    setBannerUrl(college.banner_url || "");
  }, [college]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "College name cannot be empty.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateCollegeProfile(college.id, adminUserId, {
        name: name.trim(),
        short_name: shortName.trim() || null,
        description: description.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        logo_url: logoUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
      });

      if (res.error) {
        toast({
          title: "Update Failed",
          description: res.error,
          variant: "error",
        });
      } else if (res.data) {
        toast({
          title: "Campus Profile Updated",
          description: "Changes have been successfully published.",
          variant: "success",
        });
        onCollegeUpdated(res.data);
        onClose();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update college.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = college.verification_status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-modal space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Manage Campus Hub</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Administrator permissions for {college.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Verification Status Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">Verification Status</span>
            {isVerified ? (
              <Badge variant="success" size="sm" className="font-mono text-[10px] gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified ({college.verified_domain})</span>
              </Badge>
            ) : college.verification_status === "pending" ? (
              <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                Pending Review
              </Badge>
            ) : (
              <Badge variant="outline" size="sm" className="font-mono text-[10px] gap-1">
                <AlertCircle className="h-3 w-3 text-amber-500" />
                <span>Unverified Community</span>
              </Badge>
            )}
          </div>

          {!isVerified && college.verification_status !== "pending" && (
            <div className="pt-1 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Authenticate with an official institutional domain (.edu) to earn the verified campus seal.
              </p>
              <Button
                type="button"
                size="xs"
                variant="secondary"
                onClick={() => {
                  onClose();
                  onRequestVerification();
                }}
                className="font-mono text-xs gap-1 shrink-0 ml-2"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Verify</span>
              </Button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-muted-foreground">
              College Full Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. National Institute of Technology Calicut"
              className="rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">
                Short Name / Acronym
              </label>
              <Input
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. NIT Calicut"
                className="rounded-xl font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">
                Campus Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kozhikode, Kerala, India"
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-muted-foreground">
              Official Website
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.nitc.ac.in"
              className="rounded-xl font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-muted-foreground">
              Campus Overview / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell builders about your institution's academic culture, student labs, and research focus..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">
                Logo / Emblem URL
              </label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
                className="rounded-xl font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">
                Banner Backdrop URL
              </label>
              <Input
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://.../banner.jpg"
                className="rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border/60">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
