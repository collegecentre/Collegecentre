import * as React from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinksRow } from "@/components/profile/SocialLinksRow";
import { ProjectsShowcase } from "@/components/profile/ProjectsShowcase";
import { AchievementsShowcase } from "@/components/profile/AchievementsShowcase";
import { CertificatesShowcase } from "@/components/profile/CertificatesShowcase";
import { ResumeShowcase } from "@/components/profile/ResumeShowcase";
import { StudentLinksList } from "@/components/profile/StudentLinksList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getProfileTheme } from "@/lib/themes";
import { supabase } from "@/lib/supabase";
import type { Profile, SocialLink, StudentLink, Project, Achievement, Certificate, Resume } from "@/types";
import { cn } from "@/lib/utils";

interface LiveProfileCardProps {
  profile: Profile;
  socialLinks: SocialLink[];
  studentLinks?: StudentLink[];
  projects?: Project[];
  achievements?: Achievement[];
  certificates?: Certificate[];
  resume?: Resume | null;
  className?: string;
}

export function LiveProfileCard({
  profile,
  socialLinks,
  studentLinks = [],
  projects,
  achievements,
  certificates,
  resume,
  className,
}: LiveProfileCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [internalProjects, setInternalProjects] = React.useState<Project[]>([]);
  const [internalAchievements, setInternalAchievements] = React.useState<Achievement[]>([]);
  const [internalCertificates, setInternalCertificates] = React.useState<Certificate[]>([]);
  const [internalResume, setInternalResume] = React.useState<Resume | null>(null);
  const themeConfig = getProfileTheme(profile.theme, {
    accentColor: profile.theme_accent,
    layoutVariant: profile.theme_layout,
    buttonStyle: profile.theme_button,
    backgroundStyle: profile.theme_background,
  });

  React.useEffect(() => {
    if (projects !== undefined) {
      setInternalProjects(projects);
    } else if (profile?.id) {
      supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profile.id)
        .then((res: { data: any }) => {
          if (res.data) setInternalProjects(res.data as Project[]);
        });
    }
  }, [projects, profile?.id]);

  React.useEffect(() => {
    if (achievements !== undefined) {
      setInternalAchievements(achievements);
    } else if (profile?.id) {
      supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", profile.id)
        .then((res: { data: any }) => {
          if (res.data) setInternalAchievements(res.data as Achievement[]);
        });
    }
  }, [achievements, profile?.id]);

  React.useEffect(() => {
    if (certificates !== undefined) {
      setInternalCertificates(certificates);
    } else if (profile?.id) {
      supabase
        .from("certificates")
        .select("*")
        .eq("profile_id", profile.id)
        .then((res: { data: any }) => {
          if (res.data) setInternalCertificates(res.data as Certificate[]);
        });
    }
  }, [certificates, profile?.id]);

  React.useEffect(() => {
    if (resume !== undefined) {
      setInternalResume(resume);
    } else if (profile?.id) {
      supabase
        .from("resumes")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle()
        .then((res: { data: any }) => {
          if (res.data) setInternalResume(res.data as Resume);
        });
    }
  }, [resume, profile?.id]);

  const username = profile.username || "student";
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://collegecentre.in/${username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "URL Copied",
      description: `${profileUrl} copied to clipboard.`,
      variant: "default",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            Live Showcase Preview
          </span>
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            Real-Time
          </Badge>
        </div>

        <Link href={`/${username}`} target="_blank">
          <Button
            variant="ghost"
            size="xs"
            className="text-[11px] text-primary h-7 gap-1"
          >
            <span>Open in Tab</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Device Frame Window */}
      <div className="rounded-2xl border border-border bg-card shadow-modal overflow-hidden transition-all duration-200">
        {/* Top Browser / Window Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-background border border-border/70 text-[11px] font-mono text-muted-foreground max-w-[220px] w-full justify-between">
            <span className="truncate">collegecentre.in/{username}</span>
            <button
              onClick={handleCopyLink}
              className="text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Copy preview link"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-brand" />
            <span className="hidden sm:inline">Verified</span>
          </div>
        </div>

        {/* Scaled Profile Container Inside */}
        <div className={cn("p-5 sm:p-6 transition-colors duration-200 max-h-[720px] overflow-y-auto", themeConfig.pageBackground)}>
          <div className={cn("rounded-xl border p-5 sm:p-6 space-y-6 shadow-sm", themeConfig.containerClass)}>
            {/* Header */}
            <ProfileHeader profile={profile} themeConfig={themeConfig} />

            {/* Social Links */}
            <SocialLinksRow socialLinks={socialLinks} themeConfig={themeConfig} />

            {/* Configured Links */}
            {studentLinks.length > 0 && (
              <StudentLinksList links={studentLinks} themeConfig={themeConfig} />
            )}

            {/* Projects Showcase */}
            <ProjectsShowcase
              projects={projects !== undefined ? projects : internalProjects}
              themeConfig={themeConfig}
              studentName={profile.full_name}
            />

            {/* Achievements Showcase */}
            <AchievementsShowcase
              achievements={achievements !== undefined ? achievements : internalAchievements}
              themeConfig={themeConfig}
              studentName={profile.full_name}
            />

            {/* Certificates Showcase */}
            <CertificatesShowcase
              certificates={certificates !== undefined ? certificates : internalCertificates}
              themeConfig={themeConfig}
              studentName={profile.full_name}
            />

            {/* Resume Showcase */}
            <ResumeShowcase
              resume={resume !== undefined ? resume : internalResume}
              themeConfig={themeConfig}
              studentName={profile.full_name}
            />

            {/* Minimal Card Footer Branding */}
            <div className="pt-4 border-t border-border/40 text-center space-y-1">
              <span className="text-[10px] font-semibold text-foreground/80 block">
                CollegeCentre • Verified Student Identity
              </span>
              <p className="text-[9px] text-muted-foreground">
                One link for everything you&apos;ve built, achieved, and are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
