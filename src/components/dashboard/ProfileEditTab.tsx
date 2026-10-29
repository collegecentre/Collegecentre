"use client";

import * as React from "react";
import {
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Smartphone,
  Monitor,
  School,
  BookOpen,
  Calendar,
  Globe,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { LiveProfileCard } from "./LiveProfileCard";
import { supabase } from "@/lib/supabase";
import {
  checkUsernameAvailability,
  normalizeUsername,
  validateUsernameFormat,
} from "@/lib/username";
import type { Profile, SocialLink, SocialPlatform } from "@/types";
import { cn } from "@/lib/utils";

interface ProfileEditTabProps {
  initialProfile: Profile;
  initialSocialLinks: SocialLink[];
  onProfileUpdated: (updated: Profile) => void;
}

const AVAILABLE_PLATFORMS: Array<{ id: SocialPlatform; label: string; placeholder: string }> = [
  { id: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { id: "x", label: "X / Twitter", placeholder: "https://x.com/username" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { id: "website", label: "Personal Website", placeholder: "https://yourportfolio.com" },
  { id: "email", label: "Contact Email", placeholder: "contact@email.com" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { id: "substack", label: "Substack", placeholder: "https://substack.com/@username" },
];

export function ProfileEditTab({
  initialProfile,
  initialSocialLinks,
  onProfileUpdated,
}: ProfileEditTabProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mobile segmented control view mode: "edit" | "preview"
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Form Fields State
  const [fullName, setFullName] = React.useState(initialProfile.full_name || "");
  const [username, setUsername] = React.useState(initialProfile.username || "");
  const [avatarUrl, setAvatarUrl] = React.useState(initialProfile.avatar_url || "");
  const [bio, setBio] = React.useState(initialProfile.bio || "");
  const [college, setCollege] = React.useState(initialProfile.college || "");
  const [course, setCourse] = React.useState(initialProfile.course || "");
  const [graduationYear, setGraduationYear] = React.useState<number | string>(
    initialProfile.graduation_year || 2026
  );
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(initialSocialLinks);

  // Status & Validation
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [usernameChecking, setUsernameChecking] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState<{
    valid: boolean;
    available: boolean;
    error?: string;
  }>({ valid: true, available: true });

  // Mark dirty whenever values change
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Warn user before leaving page if unsaved changes exist
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Debounced username availability validation (only if changed from initial)
  React.useEffect(() => {
    const clean = normalizeUsername(username);
    if (!clean) {
      setUsernameStatus({ valid: false, available: false, error: "Username is required." });
      return;
    }

    if (clean === initialProfile.username) {
      setUsernameStatus({ valid: true, available: true });
      return;
    }

    const formatCheck = validateUsernameFormat(clean);
    if (!formatCheck.valid) {
      setUsernameStatus({ valid: false, available: false, error: formatCheck.error });
      return;
    }

    let isMounted = true;
    setUsernameChecking(true);
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(clean);
      if (isMounted) {
        setUsernameChecking(false);
        setUsernameStatus({ valid: res.available, available: res.available, error: res.error });
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [username, initialProfile.username]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please upload an image smaller than 3MB.",
        variant: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      markDirty();
      toast({
        title: "Photo loaded",
        description: "Click Save Changes to apply your new profile photo.",
        variant: "info",
      });
    };
    reader.readAsDataURL(file);
  };

  // Social Links Handlers
  const handleAddSocialLink = (platform: SocialPlatform) => {
    setSocialLinks((prev) => [
      ...prev,
      {
        platform,
        url: "",
        order_index: prev.length,
      },
    ]);
    markDirty();
  };

  const handleUpdateSocialUrl = (index: number, newUrl: string) => {
    setSocialLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], url: newUrl };
      return copy;
    });
    markDirty();
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  };

  // Reset/Discard Changes
  const handleReset = () => {
    setFullName(initialProfile.full_name || "");
    setUsername(initialProfile.username || "");
    setAvatarUrl(initialProfile.avatar_url || "");
    setBio(initialProfile.bio || "");
    setCollege(initialProfile.college || "");
    setCourse(initialProfile.course || "");
    setGraduationYear(initialProfile.graduation_year || 2026);
    setSocialLinks(initialSocialLinks);
    setIsDirty(false);
    toast({
      title: "Changes discarded",
      description: "Restored original profile details.",
      variant: "default",
    });
  };

  // Save Changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!usernameStatus.valid || !usernameStatus.available) {
      toast({
        title: "Invalid Username",
        description: usernameStatus.error || "Please choose a valid and available handle.",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const cleanUsername = normalizeUsername(username);
      const gradYearNum = parseInt(String(graduationYear), 10) || null;

      // 1. Update Profile in DB
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          username: cleanUsername,
          avatar_url: avatarUrl || null,
          bio: bio.trim() || null,
          college: college.trim() || null,
          course: course.trim() || null,
          graduation_year: gradYearNum,
        })
        .eq("id", initialProfile.id);

      if (profileError) {
        throw new Error(profileError.message || "Failed to update profile.");
      }

      // 2. Update Social Links
      const validLinks = socialLinks
        .filter((l) => Boolean(l.url.trim()))
        .map((l, index) => ({
          profile_id: initialProfile.id,
          platform: l.platform,
          url: l.url.trim(),
          order_index: index,
        }));

      await supabase.from("basic_social_links").insert(validLinks);

      const updatedProfile: Profile = {
        ...initialProfile,
        full_name: fullName.trim() || null,
        username: cleanUsername,
        avatar_url: avatarUrl || null,
        bio: bio.trim() || null,
        college: college.trim() || null,
        course: course.trim() || null,
        graduation_year: gradYearNum,
      };

      onProfileUpdated(updatedProfile);
      setIsDirty(false);

      toast({
        title: "Profile Saved",
        description: "Your showcase has been successfully updated.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error saving profile",
        description: err.message || "An unexpected error occurred.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Live computed profile object for real-time preview
  const previewProfile: Profile = React.useMemo(() => ({
    ...initialProfile,
    full_name: fullName || "Student Name",
    username: normalizeUsername(username) || initialProfile.username,
    avatar_url: avatarUrl || null,
    bio: bio || "Student showcase bio statement.",
    college: college || "University",
    course: course || "Degree Program",
    graduation_year: parseInt(String(graduationYear), 10) || 2026,
  }), [initialProfile, fullName, username, avatarUrl, bio, college, course, graduationYear]);

  // Initials for avatar
  const initials = (fullName || username || "CC")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* Top Action Bar with Save Status & Mobile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Edit Student Profile
            </h2>
            <p className="text-xs text-muted-foreground pt-0.5">
              Live edits reflect immediately on your public CollegeCentre showcase.
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono">
            {isDirty ? (
              <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <Check className="h-3.5 w-3.5" />
                All changes saved
              </span>
            )}
          </div>
        </div>

        {/* Mobile Edit vs Preview Segmented Control */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
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
              <span>Edit</span>
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

          <div className="flex items-center gap-2">
            {isDirty && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isSaving}
                className="text-xs"
                leftIcon={<RotateCcw className="h-3 w-3" />}
              >
                Discard
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave()}
              isLoading={isSaving}
              disabled={!isDirty && usernameStatus.valid}
              className="text-xs font-semibold shadow-subtle"
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Desktop Split View (Left: Editor, Right: Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile Editor Form (Hidden on mobile when preview selected) */}
        <div
          className={cn(
            "lg:col-span-7 space-y-6",
            mobileView === "preview" && "hidden lg:block"
          )}
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Identity & Vanity Handle */}
            <Card className="p-6 border-border shadow-subtle space-y-5">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  1. Identity &amp; Vanity URL
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  collegecentre.in/{username || "..."}
                </span>
              </div>

              {/* Avatar Upload / URL */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
                <div className="relative group shrink-0">
                  <Avatar size="xl" status="verified" className="shadow-subtle ring-2 ring-border">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="text-lg font-bold bg-muted text-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs"
                      leftIcon={<Upload className="h-3.5 w-3.5" />}
                    >
                      Upload New Photo
                    </Button>

                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarUrl("");
                          markDirty();
                        }}
                        className="text-xs text-destructive hover:bg-destructive/10"
                        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Upload a square PNG or JPG (max 3MB), or provide an image link below.
                  </p>

                  <Input
                    placeholder="Or paste image URL (https://...)"
                    value={avatarUrl}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      markDirty();
                    }}
                    className="text-xs h-8"
                  />
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Alex Rivera"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      markDirty();
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Username / Handle <span className="text-primary">*</span>
                    </label>
                    {usernameChecking && (
                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground font-mono text-xs">
                      in/
                    </div>
                    <Input
                      placeholder="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
                        markDirty();
                      }}
                      className={cn(
                        "pl-8 font-mono text-xs",
                        !usernameStatus.valid && "border-destructive focus-visible:ring-destructive"
                      )}
                      required
                    />
                  </div>

                  {!usernameStatus.valid && usernameStatus.error && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 pt-0.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{usernameStatus.error}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Student Bio / Statement
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {bio.length}/250
                  </span>
                </div>
                <Textarea
                  placeholder="Explain what you build, what areas you research, and what hackathons or projects you care about..."
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) {
                      setBio(e.target.value);
                      markDirty();
                    }
                  }}
                  rows={3}
                  className="text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </Card>

            {/* Section 2: Academic Background */}
            <Card className="p-6 border-border shadow-subtle space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block border-b border-border/50 pb-3">
                2. Academic Background
              </span>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 opacity-70" />
                    <span>College or University</span>
                  </label>
                  <Input
                    placeholder="e.g. UC Berkeley, Stanford, National Institute of Technology"
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      markDirty();
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 opacity-70" />
                      <span>Course / Major Program</span>
                    </label>
                    <Input
                      placeholder="e.g. B.S. EECS, Computer Science"
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value);
                        markDirty();
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 opacity-70" />
                      <span>Graduation Year</span>
                    </label>
                    <Input
                      type="number"
                      min={2020}
                      max={2035}
                      placeholder="2026"
                      value={graduationYear}
                      onChange={(e) => {
                        setGraduationYear(e.target.value);
                        markDirty();
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Connected Social Links */}
            <Card className="p-6 border-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  3. Connected Social &amp; Web Links
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {socialLinks.length} Active
                </span>
              </div>

              {/* Dynamic Links List */}
              <div className="space-y-3">
                {socialLinks.map((link, idx) => {
                  const meta = AVAILABLE_PLATFORMS.find((p) => p.id === link.platform) || AVAILABLE_PLATFORMS[0];
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/20"
                    >
                      <div className="min-w-[100px] shrink-0">
                        <span className="text-xs font-semibold capitalize font-mono text-foreground px-1">
                          {link.platform}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <Input
                          placeholder={meta.placeholder}
                          value={link.url}
                          onChange={(e) => handleUpdateSocialUrl(idx, e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8"
                        aria-label="Remove link"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}

                {socialLinks.length === 0 && (
                  <div className="p-6 rounded-lg border border-dashed border-border text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      No social links added yet.
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Connect your GitHub, LinkedIn, and personal portfolio to build student credibility.
                    </p>
                  </div>
                )}
              </div>

              {/* Add Platform Pill Selector */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-muted-foreground block pb-2">
                  + Add Platform Link:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_PLATFORMS.map((p) => {
                    const alreadyAdded = socialLinks.some((l) => l.platform === p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        disabled={alreadyAdded}
                        onClick={() => handleAddSocialLink(p.id)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1",
                          alreadyAdded
                            ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
                            : "border-border hover:border-foreground/40 hover:bg-muted text-foreground"
                        )}
                      >
                        <Plus className="h-3 w-3" />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Sticky Save Bar on Mobile */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="text-xs"
                >
                  Discard Changes
                </Button>
              )}

              <Button
                type="submit"
                variant="default"
                isLoading={isSaving}
                className="text-xs font-semibold shadow-subtle min-w-[140px]"
                leftIcon={<Save className="h-3.5 w-3.5" />}
              >
                Save All Changes
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Live Public Profile Preview (Always visible on desktop, toggled on mobile) */}
        <div
          className={cn(
            "lg:col-span-5 lg:sticky lg:top-20 space-y-4",
            mobileView === "edit" && "hidden lg:block"
          )}
        >
          <LiveProfileCard
            profile={previewProfile}
            socialLinks={socialLinks.filter((l) => Boolean(l.url.trim()))}
          />
        </div>
      </div>
    </div>
  );
}
