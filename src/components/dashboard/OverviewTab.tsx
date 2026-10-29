import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  Eye,
  MousePointerClick,
  TrendingUp,
  Lock,
  Globe,
  Edit3,
  Link2,
  GitBranch,
  Award,
  FileCheck2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ProgressBar } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";
import { supabase } from "@/lib/supabase";
import type { Profile, SocialLink } from "@/types";
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

      {/* 3. Basic Profile Statistics Placeholders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Showcase Engagement (Phase 8 Analytics Placeholder)
          </h2>
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            Preview
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-border shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Showcase Views</span>
              <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">128</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+14% this week</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Total Link Clicks</span>
              <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                <MousePointerClick className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">46</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+8% this week</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Direct Shares</span>
              <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                <Share2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold font-mono text-foreground">12</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                <span>Social &amp; direct links</span>
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
    </div>
  );
}
