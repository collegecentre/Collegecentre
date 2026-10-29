"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  School,
  BookOpen,
  Share2,
  Plus,
  Trash2,
  GitBranch,
  Globe,
  Upload,
  Rocket,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import { checkUsernameAvailability, normalizeUsername, validateUsernameFormat } from "@/lib/username";
import type { ProfileTheme, SocialPlatform, SocialLink } from "@/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 7;

const THEMES: Array<{
  id: ProfileTheme;
  name: string;
  tagline: string;
  previewClass: string;
  accent: string;
}> = [
  {
    id: "obsidian",
    name: "Obsidian Minimal",
    tagline: "Clean monochrome design with subtle borders",
    previewClass: "bg-card border-border text-foreground",
    accent: "bg-foreground text-background",
  },
  {
    id: "academic",
    name: "Academic Editorial",
    tagline: "Warm paper tones with classic serif typography",
    previewClass: "bg-amber-50/50 dark:bg-zinc-900 border-amber-900/20 text-amber-950 dark:text-zinc-100 font-serif",
    accent: "bg-amber-900 text-amber-50",
  },
  {
    id: "cobalt",
    name: "Electric Cobalt",
    tagline: "Modern high-contrast theme with electric blue accents",
    previewClass: "bg-card border-brand/40 text-foreground",
    accent: "bg-brand text-brand-foreground",
  },
  {
    id: "terminal",
    name: "Midnight Terminal",
    tagline: "Terminal-inspired monospace layout with green syntax accents",
    previewClass: "bg-black border-zinc-800 text-emerald-400 font-mono",
    accent: "bg-emerald-500 text-black",
  },
];

const PLATFORMS: Array<{ id: SocialPlatform; label: string; placeholder: string; icon: any }> = [
  { id: "github", label: "GitHub", placeholder: "https://github.com/username", icon: GitBranch },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: Share2 },
  { id: "x", label: "X / Twitter", placeholder: "https://x.com/username", icon: Share2 },
  { id: "website", label: "Portfolio / Website", placeholder: "https://yourdomain.com", icon: Globe },
  { id: "email", label: "Public Contact Email", placeholder: "contact@email.com", icon: User },
];

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireOnboarding={false}>
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <OnboardingWizard />
      </React.Suspense>
    </ProtectedRoute>
  );
}

function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStepParam = parseInt(searchParams.get("step") || "1", 10);
  const handleQuery = searchParams.get("username") || "";

  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = React.useState<number>(
    initialStepParam >= 1 && initialStepParam <= TOTAL_STEPS ? initialStepParam : 1
  );

  // Form state
  const [username, setUsername] = React.useState(handleQuery || profile?.username || "");
  const [usernameChecking, setUsernameChecking] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState<string | undefined>();

  const [fullName, setFullName] = React.useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatar_url || "");
  const [bio, setBio] = React.useState(
    profile?.bio || ""
  );

  const [college, setCollege] = React.useState(profile?.college || "");
  const [course, setCourse] = React.useState(profile?.course || "");
  const [graduationYear, setGraduationYear] = React.useState<number | string>(
    profile?.graduation_year || 2026
  );

  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([
    { platform: "github", url: "", order_index: 0 },
    { platform: "linkedin", url: "", order_index: 1 },
  ]);

  const [selectedTheme, setSelectedTheme] = React.useState<ProfileTheme>(
    profile?.theme || "obsidian"
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  // Initialize from existing profile if available
  React.useEffect(() => {
    if (profile) {
      if (profile.username && !username) setUsername(profile.username);
      if (profile.full_name && !fullName) setFullName(profile.full_name);
      if (profile.bio && !bio) setBio(profile.bio);
      if (profile.college && !college) setCollege(profile.college);
      if (profile.course && !course) setCourse(profile.course);
      if (profile.graduation_year) setGraduationYear(profile.graduation_year);
      if (profile.theme) setSelectedTheme(profile.theme);
    }
  }, [profile]);

  // Username validation debounced
  React.useEffect(() => {
    const clean = normalizeUsername(username);
    if (!clean) {
      setUsernameChecking(false);
      setUsernameAvailable(false);
      setUsernameError(undefined);
      return;
    }

    const format = validateUsernameFormat(clean);
    if (!format.valid) {
      setUsernameChecking(false);
      setUsernameAvailable(false);
      setUsernameError(format.error);
      return;
    }

    setUsernameChecking(true);
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(clean, user?.id);
      setUsernameChecking(false);
      setUsernameAvailable(res.available);
      setUsernameError(res.available ? undefined : res.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [username, user?.id]);

  // Autosave current step progress to Supabase
  const persistProgress = async (nextStepNumber: number) => {
    if (!user?.id) return;
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        username: normalizeUsername(username) || user.id.substring(0, 10),
        full_name: fullName || null,
        avatar_url: avatarUrl || null,
        bio: bio || null,
        college: college || null,
        course: course || null,
        graduation_year: graduationYear ? Number(graduationYear) : null,
        theme: selectedTheme,
        onboarding_step: nextStepNumber,
        onboarding_completed: false,
      });
    } catch (e) {
      console.warn("Autosave warning:", e);
    }
  };

  const handleNext = async () => {
    // Step validation
    if (currentStep === 1) {
      const clean = normalizeUsername(username);
      const format = validateUsernameFormat(clean);
      if (!format.valid) {
        setUsernameError(format.error);
        return;
      }
      if (!usernameAvailable && !usernameChecking) {
        setUsernameError("Please pick an available username.");
        return;
      }
    }

    if (currentStep === 2) {
      if (!fullName.trim()) {
        toast({ title: "Name required", description: "Please enter your full name.", variant: "warning" });
        return;
      }
    }

    if (currentStep === 3) {
      if (!college.trim()) {
        toast({ title: "College required", description: "Please enter your college/university.", variant: "warning" });
        return;
      }
    }

    setIsSaving(true);
    const nextStep = currentStep + 1;
    await persistProgress(nextStep);
    setIsSaving(false);

    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { platform: "x", url: "", order_index: socialLinks.length },
    ]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleUpdateSocialLink = (index: number, field: "platform" | "url", value: string) => {
    const updated = [...socialLinks];
    if (field === "platform") {
      updated[index].platform = value as SocialPlatform;
    } else {
      updated[index].url = value;
    }
    setSocialLinks(updated);
  };

  const handlePublish = async () => {
    if (!user?.id) return;

    setIsPublishing(true);
    const cleanHandle = normalizeUsername(username);

    try {
      // 1. Update Profile as completed
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: cleanHandle,
        full_name: fullName,
        avatar_url: avatarUrl || null,
        bio: bio || null,
        college: college || null,
        course: course || null,
        graduation_year: graduationYear ? Number(graduationYear) : null,
        theme: selectedTheme,
        onboarding_completed: true,
        onboarding_step: 7,
      });

      if (profileError) throw profileError;

      // 2. Persist Social Links
      const validLinks = socialLinks.filter((l) => l.url.trim().length > 0);
      if (validLinks.length > 0) {
        await supabase.from("basic_social_links").delete().eq("profile_id", user.id);
        await supabase.from("basic_social_links").insert(
          validLinks.map((link, idx) => ({
            profile_id: user.id,
            platform: link.platform,
            url: link.url,
            order_index: idx,
          }))
        );
      }

      await refreshProfile();

      toast({
        title: "Showcase Published!",
        description: `Your student link is live at collegecentre.in/${cleanHandle}`,
        variant: "success",
      });

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Publishing error:", err);
      toast({
        title: "Publish failed",
        description: err.message || "Could not publish your profile. Please try again.",
        variant: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md px-4 py-3">
        <div className="container max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-xs tracking-tighter shadow-subtle">
              CC
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              CollegeCentre Onboarding
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[11px] font-mono font-medium">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="container max-w-3xl pt-2">
          <ProgressBar value={progressPercent} />
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="container max-w-xl py-10 sm:py-14 px-4 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* ============================================================== */}
          {/* STEP 1: CHOOSE USERNAME */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 01
                </Badge>
                <Typography variant="h2" as="h1">
                  Claim your student handle
                </Typography>
                <Typography variant="bodySm">
                  This will be your universal portfolio link: collegecentre.in/username.
                </Typography>
              </div>

              <Card className="p-6 space-y-4 border-border shadow-card bg-card">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">Desired Handle</span>
                    {usernameChecking && (
                      <span className="text-[11px] font-mono text-muted-foreground animate-pulse">
                        Checking availability...
                      </span>
                    )}
                    {!usernameChecking && usernameAvailable && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> collegecentre.in/{normalizeUsername(username)} is available
                      </span>
                    )}
                  </div>

                  <Input
                    prefixElement={
                      <span className="text-xs font-mono text-muted-foreground select-none">
                        collegecentre.in/
                      </span>
                    }
                    placeholder="sreehari"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!usernameChecking && username && !usernameAvailable ? usernameError : undefined}
                    autoFocus
                  />

                  <p className="text-[11px] text-muted-foreground">
                    Lowercase letters, numbers, hyphens, and underscores. 3 to 30 characters.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: NAME, PROFILE PHOTO & BIO */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 02
                </Badge>
                <Typography variant="h2" as="h1">
                  Student Identity
                </Typography>
                <Typography variant="bodySm">
                  Tell people who you are and what you care about.
                </Typography>
              </div>

              <Card className="p-6 space-y-5 border-border shadow-card bg-card">
                <div className="flex items-center gap-4">
                  <Avatar size="xl" status="verified" className="ring-2 ring-border">
                    <AvatarFallback className="text-lg font-bold">
                      {(fullName || username || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 flex-1">
                    <span className="text-xs font-medium text-foreground block">Avatar Photo URL</span>
                    <Input
                      placeholder="https://images.com/your-photo.jpg (or leave for initials)"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      prefixElement={<Upload className="h-3.5 w-3.5 text-muted-foreground" />}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Initials fallback automatically generates if left empty.
                    </p>
                  </div>
                </div>

                <Input
                  label="Full Name"
                  placeholder="e.g. Sreehari Nair"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  prefixElement={<User className="h-4 w-4 text-muted-foreground" />}
                  required
                />

                <Textarea
                  placeholder="e.g. Undergraduate CS researcher building low-latency inference engines and autonomous robotics..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  showCount
                  maxLength={180}
                  helperText="Short bio displayed at the top of your student profile."
                />
              </Card>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: COLLEGE, COURSE & GRADUATION YEAR */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 03
                </Badge>
                <Typography variant="h2" as="h1">
                  Academic Credentials
                </Typography>
                <Typography variant="bodySm">
                  Your university and expected graduation timeline.
                </Typography>
              </div>

              <Card className="p-6 space-y-4 border-border shadow-card bg-card">
                <Input
                  label="College / University"
                  placeholder="e.g. UC Berkeley, Stanford, BITS Pilani, IIT Delhi"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  prefixElement={<School className="h-4 w-4 text-muted-foreground" />}
                  required
                />

                <Input
                  label="Course / Degree / Major"
                  placeholder="e.g. B.Tech Computer Science &amp; Engineering"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  prefixElement={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground block">
                    Expected Graduation Year
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[2024, 2025, 2026, 2027, 2028, 2029].map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setGraduationYear(year)}
                        className={cn(
                          "px-3 py-1.5 rounded-md border text-xs font-mono transition-all",
                          Number(graduationYear) === year
                            ? "bg-foreground text-background font-semibold border-foreground shadow-subtle"
                            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: INITIAL SOCIAL LINKS */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 04
                </Badge>
                <Typography variant="h2" as="h1">
                  Connect Your Profiles
                </Typography>
                <Typography variant="bodySm">
                  Add links to your code, professional presence, and portfolio.
                </Typography>
              </div>

              <Card className="p-6 space-y-4 border-border shadow-card bg-card">
                <div className="space-y-3">
                  {socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={link.platform}
                        onChange={(e) => handleUpdateSocialLink(idx, "platform", e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium capitalize text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex-1">
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => handleUpdateSocialLink(idx, "url", e.target.value)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded"
                        aria-label="Remove link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSocialLink}
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  className="text-xs"
                >
                  Add Another Link
                </Button>
              </Card>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: CHOOSE PROFILE THEME */}
          {/* ============================================================== */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 05
                </Badge>
                <Typography variant="h2" as="h1">
                  Select Visual Aesthetic
                </Typography>
                <Typography variant="bodySm">
                  You can change this at any time with one click.
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all space-y-3 flex flex-col justify-between",
                        isSelected
                          ? "ring-2 ring-brand border-brand shadow-card bg-card"
                          : "border-border bg-card/60 hover:border-foreground/30 shadow-subtle"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <Badge variant="brand" size="sm" dot>Selected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {theme.tagline}
                        </p>
                      </div>

                      <div className={cn("p-3 rounded-lg border text-xs space-y-1.5", theme.previewClass)}>
                        <div className="font-semibold">{fullName || "Your Name"}</div>
                        <div className="text-[10px] opacity-70">
                          {college || "University"} • {graduationYear || "2026"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 6: PREVIEW PROFILE */}
          {/* ============================================================== */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1">
                <Badge variant="outline" size="sm" className="font-mono">
                  Step 06
                </Badge>
                <Typography variant="h2" as="h1">
                  Preview Your Showcase
                </Typography>
                <Typography variant="bodySm">
                  Review how recruiters and peers will see your page.
                </Typography>
              </div>

              {/* Realistic Preview Window */}
              <div className="rounded-xl border border-border bg-card shadow-modal overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40 text-xs font-mono text-muted-foreground">
                  <span>collegecentre.in/{normalizeUsername(username)}</span>
                  <Badge variant="brand" size="sm" dot>Preview Mode</Badge>
                </div>

                <div className={cn("p-6 sm:p-8 space-y-6 text-center", THEMES.find((t) => t.id === selectedTheme)?.previewClass)}>
                  <div className="space-y-3">
                    <Avatar size="2xl" status="verified" className="mx-auto shadow-subtle ring-2 ring-background">
                      <AvatarFallback className="text-xl font-bold">
                        {(fullName || "U").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {fullName || "Student Name"}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {college} {course ? `• ${course}` : ""} {graduationYear ? `• '${graduationYear}` : ""}
                      </p>
                      {bio && (
                        <p className="text-xs text-foreground/80 max-w-sm mx-auto leading-relaxed pt-1">
                          {bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Social Links List */}
                  {socialLinks.filter((l) => l.url.trim()).length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      {socialLinks
                        .filter((l) => l.url.trim())
                        .map((link, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-border text-xs font-medium bg-card/60"
                          >
                            <span className="capitalize">{link.platform}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                    collegecentre.in/{normalizeUsername(username)} • Powered by CollegeCentre
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 7: PUBLISH */}
          {/* ============================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6 text-center py-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Rocket className="h-7 w-7" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <Typography variant="h2" as="h1" className="text-2xl font-bold">
                  Ready to launch your showcase?
                </Typography>
                <Typography variant="body" className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Your profile will be published at{" "}
                  <span className="font-mono font-semibold text-foreground">
                    collegecentre.in/{normalizeUsername(username)}
                  </span>
                  . You can add project cards, awards, and credentials next in your dashboard.
                </Typography>
              </div>

              <Card className="p-5 max-w-sm mx-auto border-border bg-card text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Handle:</span>
                  <span className="font-mono font-semibold text-foreground">@{normalizeUsername(username)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-foreground">{fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">College:</span>
                  <span className="font-medium text-foreground">{college}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-medium capitalize text-brand">{selectedTheme}</span>
                </div>
              </Card>

              <div className="pt-4 max-w-sm mx-auto">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full shadow-card text-sm font-semibold"
                  isLoading={isPublishing}
                  onClick={handlePublish}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Publish &amp; Open Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls Footer */}
        {currentStep < 7 && (
          <div className="pt-8 border-t border-border flex items-center justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1 || isSaving}
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            >
              Back
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleNext}
              isLoading={isSaving}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {currentStep === 6 ? "Review & Publish" : "Next Step"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
