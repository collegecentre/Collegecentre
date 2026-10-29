import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Eye,
  MousePointerClick,
  TrendingUp,
  Lock,
  Globe,
  Compass,
  Edit3,
  Link2,
  GitBranch,
  Award,
  FileCheck2,
  FileText,
  QrCode,
  Building2,
  School,
} from "lucide-react";
import { ProfileShareModal } from "@/components/profile/ProfileShareModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ProgressBar } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import { getAnalyticsSummary } from "@/lib/analytics";
import type { Profile, SocialLink, AnalyticsOverviewMetrics } from "@/types";
import type { DashboardTab } from "./dashboard-types";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  onNavigateTab: (tab: DashboardTab) => void;
  onProfileUpdated?: (updated: Profile) => void;
}

export function OverviewTab({
  profile,
  socialLinks,
  onNavigateTab,
  onProfileUpdated,
}: OverviewTabProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = React.useState(false);
  const [isUpdatingDiscoverability, setIsUpdatingDiscoverability] = React.useState(false);
  const [isUpdatingCollegePrivacy, setIsUpdatingCollegePrivacy] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [analyticsMetrics, setAnalyticsMetrics] = React.useState<AnalyticsOverviewMetrics | null>(null);

  React.useEffect(() => {
    if (profile?.id) {
      getAnalyticsSummary(profile.id, "30d")
        .then((res) => setAnalyticsMetrics(res.metrics))
        .catch(() => {});
    }
  }, [profile?.id]);

  // Compute profile completion percentage and missing items
  const completionItems = React.useMemo(() => {
    if (!profile) return { score: 0, checks: [] };

    const checks = [
      { key: "username", label: "Unique Username", done: Boolean(profile.username), weight: 15 },
      { key: "full_name", label: "Full Name", done: Boolean(profile.full_name), weight: 15 },
      { key: "avatar_url", label: "Profile Photo", done: Boolean(profile.avatar_url), weight: 15 },
      { key: "bio", label: "Bio Statement", done: Boolean(profile.bio), weight: 15 },
      { key: "academics", label: "College & Course", done: Boolean(profile.college && profile.course), weight: 20 },
      { key: "socials", label: "Connected Social Links", done: socialLinks.length > 0, weight: 20 },
    ];

    const score = checks.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
    return { score, checks };
  }, [profile, socialLinks]);

  const username = profile?.username || "student";
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://collegecentre.in/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "Showcase Link Copied",
      description: `${profileUrl} copied to clipboard.`,
      variant: "default",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePrivacy = async (checked: boolean) => {
    if (!profile) return;
    setIsUpdatingPrivacy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_public: checked })
        .eq("id", profile.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: "Could not update profile visibility.",
          variant: "error",
        });
      } else {
        const updated = { ...profile, is_public: checked };
        if (onProfileUpdated) onProfileUpdated(updated);
        toast({
          title: checked ? "Showcase is Public" : "Showcase Set to Private",
          description: checked
            ? `Your showcase is now publicly accessible at collegecentre.in/${username}`
            : "Your showcase is hidden from public view.",
          variant: checked ? "success" : "info",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const handleToggleDiscoverability = async (checked: boolean) => {
    if (!profile) return;
    setIsUpdatingDiscoverability(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_discoverable: checked })
        .eq("id", profile.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: "Could not update discoverability setting.",
          variant: "error",
        });
      } else {
        const updated = { ...profile, is_discoverable: checked };
        if (onProfileUpdated) onProfileUpdated(updated);
        toast({
          title: checked ? "Listed in Explore" : "Unlisted from Explore",
          description: checked
            ? "Your showcase is now discoverable in the CollegeCentre student network."
            : "Your showcase is unlisted from Explore (direct link still works).",
          variant: checked ? "success" : "info",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingDiscoverability(false);
    }
  };

  const handleToggleShowCollege = async (checked: boolean) => {
    if (!profile) return;
    setIsUpdatingCollegePrivacy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ show_college_on_profile: checked })
        .eq("id", profile.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: "Could not update college visibility.",
          variant: "error",
        });
      } else {
        const updated = { ...profile, show_college_on_profile: checked };
        if (onProfileUpdated) onProfileUpdated(updated);
        toast({
          title: checked ? "College Shown on Profile" : "College Hidden from Profile",
          description: checked
            ? "Your college name is displayed on your public showcase."
            : "Your college name is now hidden from your public showcase.",
          variant: "success",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingCollegePrivacy(false);
    }
  };

  const handleToggleShowInDirectory = async (checked: boolean) => {
    if (!profile) return;
    setIsUpdatingCollegePrivacy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ show_in_college_directory: checked })
        .eq("id", profile.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: "Could not update campus directory preference.",
          variant: "error",
        });
      } else {
        const updated = { ...profile, show_in_college_directory: checked };
        if (onProfileUpdated) onProfileUpdated(updated);
        toast({
          title: checked ? "Listed in Campus Directory" : "Hidden from Campus Directory",
          description: checked
            ? "Your profile is listed in your college's public student directory."
            : "Your profile is hidden from your college's student directory.",
          variant: "success",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingCollegePrivacy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* 1. Top Vanity URL & Publish Banner */}
      <Card className="p-6 sm:p-7 border-border shadow-subtle bg-gradient-to-br from-card via-card to-muted/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm" dot>
                {profile?.is_public ? "Live & Public" : "Private Mode"}
              </Badge>
              <Badge variant="outline" size="sm" className="font-mono text-[10px] capitalize">
                Theme: {profile?.theme || "obsidian"}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Your Public Showcase URL
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/${username}`}
                  target="_blank"
                  className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <span>collegecentre.in/{username}</span>
                  <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Share this single link on your GitHub profile, LinkedIn headline, resume header, and email signature.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="text-xs font-semibold shadow-subtle min-w-[120px]"
              leftIcon={copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            >
              {copied ? "Copied Link" : "Copy Link"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="text-xs font-semibold gap-1.5"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Share &amp; QR</span>
            </Button>

            <Link href={`/${username}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                View Live Page
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("profile")}
              className="text-xs"
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Visibility Toggle Row */}
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {profile?.is_public ? (
              <Globe className="h-4 w-4 text-emerald-500" />
            ) : (
              <Lock className="h-4 w-4 text-amber-500" />
            )}
            <div>
              <span className="text-xs font-semibold text-foreground">
                Public Showcase Visibility
              </span>
              <p className="text-[11px] text-muted-foreground">
                {profile?.is_public
                  ? "Anyone with your link can view your verified student profile."
                  : "Profile is currently hidden. Only you can view this page while signed in."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={profile?.is_public ?? true}
              onCheckedChange={handleTogglePrivacy}
              disabled={isUpdatingPrivacy}
              aria-label="Toggle profile public visibility"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {profile?.is_public ? "Public" : "Private"}
            </span>
          </div>
        </div>

        {/* Discoverability in Explore Network Toggle Row */}
        <div className="mt-3 pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Compass className={cn("h-4 w-4", (profile?.is_discoverable ?? true) ? "text-brand" : "text-muted-foreground")} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Explore Directory Discoverability
                </span>
                {!(profile?.is_public ?? true) && (
                  <Badge variant="outline" size="sm" className="text-[9px] font-mono text-amber-500 border-amber-500/30">
                    Disabled (Profile Private)
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Allow other students and engineering teams to discover your profile and projects in the Explore directory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={(profile?.is_discoverable ?? true) && (profile?.is_public ?? true)}
              onCheckedChange={handleToggleDiscoverability}
              disabled={isUpdatingDiscoverability || !(profile?.is_public ?? true)}
              aria-label="Toggle explore directory discoverability"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {(profile?.is_discoverable ?? true) && (profile?.is_public ?? true) ? "Discoverable" : "Unlisted"}
            </span>
          </div>
        </div>

        {/* Show College on Profile Toggle Row */}
        <div className="mt-3 pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <School className={cn("h-4 w-4", (profile?.show_college_on_profile ?? true) ? "text-primary" : "text-muted-foreground")} />
            <div>
              <span className="text-xs font-semibold text-foreground">
                Show College On Public Profile
              </span>
              <p className="text-[11px] text-muted-foreground">
                Display your college name and campus link in your showcase header ({profile?.college || "No college linked"}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={profile?.show_college_on_profile ?? true}
              onCheckedChange={handleToggleShowCollege}
              disabled={isUpdatingCollegePrivacy}
              aria-label="Toggle college on profile"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {(profile?.show_college_on_profile ?? true) ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>

        {/* Show in Campus Directory Toggle Row */}
        <div className="mt-3 pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Building2 className={cn("h-4 w-4", (profile?.show_in_college_directory ?? true) ? "text-brand" : "text-muted-foreground")} />
            <div>
              <span className="text-xs font-semibold text-foreground">
                List in College Campus Directory
              </span>
              <p className="text-[11px] text-muted-foreground">
                Allow peers and campus visitors to discover your profile on your college's public directory page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={profile?.show_in_college_directory ?? true}
              onCheckedChange={handleToggleShowInDirectory}
              disabled={isUpdatingCollegePrivacy}
              aria-label="Toggle college directory listing"
            />
            <span className="text-xs font-mono text-muted-foreground">
              {(profile?.show_in_college_directory ?? true) ? "Listed" : "Hidden"}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Profile Completion Card */}
      <Card className="p-6 border-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-foreground">
              Profile Completeness
            </h2>
            <p className="text-xs text-muted-foreground">
              A comprehensive student showcase receives 4x more portfolio views from engineering recruiters.
            </p>
          </div>
          <Badge
            variant={completionItems.score === 100 ? "success" : "brand"}
            size="sm"
            className="font-mono text-xs font-bold"
          >
            {completionItems.score}%
          </Badge>
        </div>

        <div className="space-y-1.5">
          <ProgressBar value={completionItems.score} max={100} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {completionItems.checks.map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-colors",
                item.done
                  ? "bg-muted/30 border-border text-foreground/90 font-medium"
                  : "bg-background border-dashed border-border/80 text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[10px]",
                  item.done
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.done ? <Check className="h-2.5 w-2.5" /> : "•"}
              </div>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>

        {completionItems.score < 100 && (
          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("profile")}
              className="text-xs font-medium text-primary hover:underline"
              rightIcon={<ArrowRight className="h-3 w-3" />}
            >
              Complete remaining profile sections
            </Button>
          </div>
        )}
      </Card>

      {/* 2.5 Campus Hub Association Card */}
      <Card className="p-6 border-border shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <School className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {profile?.college || "Associate with your Campus"}
                </h3>
                {profile?.college_slug && (
                  <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                    Connected Hub
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.college
                  ? `You are connected to ${profile.college}. Your work is discoverable by campus peers.`
                  : "Link your institution to appear in your university's student directory and project showcase."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {profile?.college_slug ? (
              <Button asChild size="sm" variant="outline" className="font-mono text-xs gap-1.5 h-8">
                <Link href={`/college/${profile.college_slug}`} target="_blank">
                  <span>View Campus Hub</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab("profile")}
                className="font-mono text-xs gap-1.5 h-8"
              >
                <span>Connect Campus</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Showcase Analytics Snapshot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Showcase Engagement (Past 30 Days)
            </h2>
            <Badge variant="outline" size="sm" className="font-mono text-[10px] text-emerald-500 border-emerald-500/30">
              Live
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onNavigateTab("analytics")}
            className="text-xs font-medium gap-1 text-primary hover:underline h-7 px-2"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            onClick={() => onNavigateTab("analytics")}
            className="p-4 border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Showcase Views</span>
              <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Eye className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">
                {analyticsMetrics ? analyticsMetrics.totalProfileViews.toLocaleString() : "—"}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                {analyticsMetrics?.viewsChangePercent !== null && analyticsMetrics?.viewsChangePercent !== undefined ? (
                  <span className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    analyticsMetrics.viewsChangePercent >= 0 ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {analyticsMetrics.viewsChangePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                    {analyticsMetrics.viewsChangePercent >= 0 ? `+${analyticsMetrics.viewsChangePercent}%` : `${analyticsMetrics.viewsChangePercent}%`} vs prev
                  </span>
                ) : (
                  <span>Verified visitors</span>
                )}
              </div>
            </div>
          </Card>

          <Card
            onClick={() => onNavigateTab("analytics")}
            className="p-4 border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Total Link Clicks</span>
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <MousePointerClick className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">
                {analyticsMetrics ? analyticsMetrics.totalLinkClicks.toLocaleString() : "—"}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                {analyticsMetrics ? `${analyticsMetrics.clickThroughRate}% click-through rate` : "Outbound clicks"}
              </div>
            </div>
          </Card>

          <Card
            onClick={() => onNavigateTab("analytics")}
            className="p-4 border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Project &amp; Resume Activity</span>
              <div className="h-7 w-7 rounded-md bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <GitBranch className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">
                {analyticsMetrics
                  ? (analyticsMetrics.totalProjectInteractions + analyticsMetrics.totalResumeInteractions).toLocaleString()
                  : "—"}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                <span>Code, demos &amp; CV downloads</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Quick Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          Quick Management Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab("profile")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Edit Bio &amp; Photo</span>
              <span className="text-[11px] text-muted-foreground">Update your identity &amp; headshot</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("links")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Showcase Links</span>
              <span className="text-[11px] text-muted-foreground">Manage, reorder &amp; curate links</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("projects")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Projects &amp; Work</span>
              <span className="text-[11px] text-muted-foreground">Add repositories, demos &amp; stack</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("achievements")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Honors &amp; Awards</span>
              <span className="text-[11px] text-muted-foreground">Hackathons, preprints &amp; prizes</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("certificates")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Certificates &amp; Licenses</span>
              <span className="text-[11px] text-muted-foreground">Cloud, vendor &amp; course credentials</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("resume")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Resume &amp; CV</span>
              <span className="text-[11px] text-muted-foreground">Verified PDF showcase &amp; download</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("appearance")}
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-muted text-foreground flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Theme Appearance</span>
              <span className="text-[11px] text-muted-foreground">Obsidian, Academic, Cobalt, Terminal</span>
            </div>
          </button>

          <Link
            href={`/${username}`}
            target="_blank"
            className="p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all text-left space-y-2 group block"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ExternalLink className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">View Public Showcase</span>
              <span className="text-[11px] text-muted-foreground">Open your live collegecentre.in link</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Profile Share & QR Modal */}
      {profile && (
        <ProfileShareModal
          profile={profile}
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
        />
      )}
    </div>
  );
}
