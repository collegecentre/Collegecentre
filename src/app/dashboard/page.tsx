"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  School,
  BookOpen,
  Calendar,
  Layers,
  Award,
  FileCheck2,
  Lock,
  Plus,
  Settings,
  ArrowUpRight,
  Share2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { supabase } from "@/lib/supabase";
import type { SocialLink } from "@/types";

export default function DashboardPage() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();

  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (user?.id) {
      supabase
        .from("basic_social_links")
        .select("*")
        .eq("profile_id", user.id)
        .then((res: { data: any }) => {
          if (res.data) setSocialLinks(res.data as SocialLink[]);
        });
    }
  }, [user?.id]);

  const handleCopyLink = () => {
    if (!profile?.username) return;
    navigator.clipboard.writeText(`https://collegecentre.in/${profile.username}`);
    setCopied(true);
    toast({
      title: "URL Copied",
      description: `collegecentre.in/${profile.username} copied to clipboard.`,
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    setLogoutDialogOpen(false);
    toast({
      title: "Signed out",
      description: "You have been safely signed out.",
      variant: "default",
    });
    router.replace("/");
  };

  const username = profile?.username || "student";
  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Dashboard Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="container max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
                CC
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                CollegeCentre
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground border-l border-border pl-3">
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs font-mono"
              leftIcon={copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            >
              <span className="hidden sm:inline">collegecentre.in/</span>
              {username}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLogoutDialogOpen(true)}
              className="text-xs text-muted-foreground hover:text-destructive"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container max-w-5xl py-8 sm:py-12 px-4 space-y-8 flex-1">
        {/* Profile Card Header */}
        <Card className="p-6 sm:p-8 border-border bg-card shadow-card relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <Avatar size="2xl" status="verified" className="ring-2 ring-border">
                <AvatarFallback className="text-xl font-bold bg-muted">
                  {fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Typography variant="h2" as="h1" className="text-xl sm:text-2xl font-bold">
                    {fullName}
                  </Typography>
                  <Badge variant="brand" size="sm" dot>
                    Verified Student
                  </Badge>
                  <Badge variant="outline" size="sm" className="capitalize font-mono text-[10px]">
                    Theme: {profile?.theme || "obsidian"}
                  </Badge>
                </div>

                <p className="text-xs font-mono text-muted-foreground">
                  collegecentre.in/{username}
                </p>

                <p className="text-xs text-foreground/80 pt-0.5">
                  {profile?.college || "University"} • {profile?.course || "Undergraduate"} {profile?.graduation_year ? `• Class of '${profile.graduation_year}` : ""}
                </p>

                {profile?.bio && (
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed pt-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
              <Button
                variant="brand"
                size="sm"
                onClick={handleCopyLink}
                className="text-xs shadow-subtle w-full sm:w-auto"
                leftIcon={<Share2 className="h-3.5 w-3.5" />}
              >
                Share Showcase Link
              </Button>

              <Link href="/onboarding?step=1" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Phase 2 Social Links Module */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography variant="h4" className="text-base font-semibold">
              Connected Social &amp; Web Links
            </Typography>
            <Link href="/onboarding?step=4">
              <Button variant="ghost" size="xs" className="text-xs font-medium">
                Manage Links
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-lg border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all flex items-center justify-between group"
              >
                <div className="truncate space-y-0.5">
                  <span className="font-semibold text-xs capitalize text-foreground group-hover:text-primary transition-colors block">
                    {link.platform}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono truncate block max-w-[200px]">
                    {link.url}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </a>
            ))}

            {socialLinks.length === 0 && (
              <div className="col-span-full p-6 text-center border border-dashed border-border rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground">No social links connected yet.</p>
                <Link href="/onboarding?step=4" className="mt-2 inline-block">
                  <Button variant="outline" size="xs">
                    Add Links
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder Blocks for Future Phases (Phase 3 & Beyond) */}
        <div className="space-y-3 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Showcase Sections (Next Phases)
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground">
                Phase 2 authentication &amp; onboarding is complete. Modules unlock in Phase 3.
              </Typography>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              Phase 3 Up Next
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-border/60 bg-muted/20 space-y-2 opacity-80">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span className="font-semibold text-xs text-foreground">Projects &amp; Repos</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect GitHub repositories, live demo URLs, and tech stacks.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Scheduled for Phase 3
                </span>
              </div>
            </Card>

            <Card className="p-5 border-border/60 bg-muted/20 space-y-2 opacity-80">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4" />
                <span className="font-semibold text-xs text-foreground">Hackathons &amp; Honors</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Verified prize tracks, competition badges, and dean&apos;s honors.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Scheduled for Phase 3
                </span>
              </div>
            </Card>

            <Card className="p-5 border-border/60 bg-muted/20 space-y-2 opacity-80">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCheck2 className="h-4 w-4" />
                <span className="font-semibold text-xs text-foreground">Certificates &amp; Papers</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tamper-proof certificate IDs and academic preprint links.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Scheduled for Phase 3
                </span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog for Sign Out */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Sign Out of CollegeCentre?"
        description="Are you sure you want to end your student session? You can sign back in anytime."
        variant="default"
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        isLoading={isLoggingOut}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
