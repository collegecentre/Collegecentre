"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogOut,
  ExternalLink,
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTheme } from "@/components/theme-provider";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ProfileEditTab } from "@/components/dashboard/ProfileEditTab";
import { LinksManagerTab } from "@/components/dashboard/LinksManagerTab";
import { ProjectsManagerTab } from "@/components/dashboard/ProjectsManagerTab";
import { PlaceholderTab } from "@/components/dashboard/PlaceholderTab";
import type { DashboardTab } from "@/components/dashboard/dashboard-types";
import { supabase } from "@/lib/supabase";
import type { SocialLink, Profile } from "@/types";

export default function DashboardPage() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <DashboardContent />
      </React.Suspense>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTabParam = (searchParams.get("tab") as DashboardTab) || "overview";

  const { user, profile, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Active navigation tab
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(
    [
      "overview",
      "profile",
      "links",
      "projects",
      "achievements",
      "certificates",
      "resume",
      "appearance",
      "analytics",
      "settings",
    ].includes(initialTabParam)
      ? initialTabParam
      : "overview"
  );

  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Load connected social links
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

  const handleProfileUpdated = (updated: Profile) => {
    refreshProfile();
  };

  const username = profile?.username || "student";
  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors selection:bg-primary selection:text-primary-foreground">
      {/* 1. Dashboard Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Vanity Handle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90 shrink-0"
            >
              <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
                CC
              </div>
              <span className="font-bold tracking-tight text-sm hidden sm:inline">
                CollegeCentre
              </span>
            </Link>

            <span className="text-border hidden sm:inline">•</span>

            <Link
              href={`/${username}`}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-xs font-mono text-muted-foreground hover:text-foreground transition-colors border border-border/60"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <span>collegecentre.in/{username}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
          </div>

          {/* Right Header Utilities: Live Showcase link, Theme toggle, User badge, Sign Out */}
          <div className="flex items-center gap-2">
            <Link href={`/${username}`} target="_blank" className="hidden sm:inline-block">
              <Button
                variant="outline"
                size="xs"
                className="text-xs h-8 gap-1.5"
                rightIcon={<ExternalLink className="h-3 w-3" />}
              >
                <span>Live Showcase</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setTheme(
                  theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
                )
              }
              aria-label="Toggle color theme"
              className="h-8 w-8"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : theme === "system" ? (
                <Laptop className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </Button>

            <div className="flex items-center gap-2 pl-1 border-l border-border/60">
              <Avatar size="sm" className="ring-1 ring-border shadow-xs">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={fullName} />
                )}
                <AvatarFallback className="text-[11px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setLogoutDialogOpen(true)}
                title="Sign out of CollegeCentre"
                aria-label="Sign out"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Top Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto pt-2.5 border-t border-border/40 mt-2">
          <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      {/* 3. Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "overview" && (
          <OverviewTab
            profile={profile}
            socialLinks={socialLinks}
            onNavigateTab={setActiveTab}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {activeTab === "profile" && profile && (
          <ProfileEditTab
            initialProfile={profile}
            initialSocialLinks={socialLinks}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {activeTab === "links" && profile && (
          <LinksManagerTab
            profile={profile}
            socialLinks={socialLinks}
          />
        )}

        {activeTab === "projects" && profile && (
          <ProjectsManagerTab
            profile={profile}
            socialLinks={socialLinks}
          />
        )}

        {activeTab !== "overview" &&
          activeTab !== "profile" &&
          activeTab !== "links" &&
          activeTab !== "projects" && (
            <PlaceholderTab tab={activeTab} onNavigateTab={setActiveTab} />
          )}
      </main>

      {/* Sign Out Confirmation Dialog */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Sign out of CollegeCentre?"
        description="Are you sure you want to end your current session? You will need to sign in again to edit your student showcase."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isLoggingOut}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
