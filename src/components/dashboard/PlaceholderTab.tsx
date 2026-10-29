import * as React from "react";
import {
  Link2,
  GitBranch,
  Award,
  FileCheck2,
  FileText,
  Palette,
  BarChart3,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardTab } from "./dashboard-types";

interface PlaceholderTabProps {
  tab: DashboardTab;
  onNavigateTab: (tab: DashboardTab) => void;
}

const TAB_CONFIG: Record<
  string,
  {
    title: string;
    phase: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
    sampleSnippet: string;
  }
> = {
  links: {
    title: "Showcase Links & Resources",
    phase: "Phase 5",
    description:
      "Configure prioritized student showcase links, personal portfolios, technical writing preprints, and research repositories.",
    icon: Link2,
    features: [
      "Custom drag-and-drop link ordering",
      "Automatic favicon & domain extraction",
      "Link click analytics tracking",
      "Categorized link groups & badges",
    ],
    sampleSnippet: "collegecentre.in/links • Configurable priority list",
  },
  projects: {
    title: "Verified Student Projects",
    phase: "Phase 6",
    description:
      "Pin your most ambitious technical builds, open source repositories, architecture RFCs, and live production deployments.",
    icon: GitBranch,
    features: [
      "Direct GitHub repository sync",
      "Live demo iframe previews",
      "Technology badges (Rust, Next.js, PyTorch)",
      "Co-builder tags & hackathon awards",
    ],
    sampleSnippet: "vslam-drone-kernel • Real-time SLAM quadrotor • 90fps Jetson Orin",
  },
  achievements: {
    title: "Achievements & Hackathon Honors",
    phase: "Phase 7",
    description:
      "Curate your competitive programming rank, hackathon victories, academic scholarships, and published peer-reviewed papers.",
    icon: Award,
    features: [
      "Verified hackathon podium finishes",
      "ACM / IEEE research publications",
      "Fellowship & scholarship badges",
      "Timeline view of academic milestones",
    ],
    sampleSnippet: "1st Place • HackMIT 2026 • Autonomous Aerial SLAM",
  },
  certificates: {
    title: "Certificates & Academic Credentials",
    phase: "Phase 7",
    description:
      "Cryptographically verifiable course completions, university honors, preprints, and credential proof badges.",
    icon: FileCheck2,
    features: [
      "Tamper-proof credential verification IDs",
      "Direct university issuer verification",
      "Coursera / edX / AWS credential embedding",
      "QR verification proof links",
    ],
    sampleSnippet: "Credential ID: CC-VERIFIED-9824 • Verified by UC Berkeley",
  },
  resume: {
    title: "Resume & Curriculum Vitae",
    phase: "Phase 7",
    description:
      "Embed an interactive digital CV alongside high-resolution downloadable PDF transcripts and recruiter one-sheets.",
    icon: FileText,
    features: [
      "In-browser PDF viewer modal",
      "One-click recruiter download tracking",
      "Formatted experience & education blocks",
      "Quick contact request dispatch",
    ],
    sampleSnippet: "Resume_2026_SWE_Systems.pdf • 1.2 MB",
  },
  appearance: {
    title: "Profile Themes & Custom Appearance",
    phase: "Phase 5",
    description:
      "Switch between Obsidian Minimal, Academic Editorial, Cobalt Dynamic, and Terminal Mono themes with customizable layout tokens.",
    icon: Palette,
    features: [
      "4 distinct curated student themes",
      "Custom accent colors & font selections",
      "Light / Dark mode preview overrides",
      "Hairline border & card radius controls",
    ],
    sampleSnippet: "Active Theme: Obsidian Minimal • System Font Stack",
  },
  analytics: {
    title: "Real-Time Showcase Analytics",
    phase: "Phase 8",
    description:
      "Gain deep insights into who is discovering your student portfolio, link click-through rates, and referring tech companies.",
    icon: BarChart3,
    features: [
      "Daily & weekly unique visitor graphs",
      "Link click heatmap & click-through rates",
      "Top referrer domains (LinkedIn, GitHub, X)",
      "Geographic breakdown of viewer regions",
    ],
    sampleSnippet: "128 unique visitors • 46 link clicks • 92% mobile traffic",
  },
  settings: {
    title: "Account & Security Settings",
    phase: "Phase 5",
    description:
      "Manage authenticated email, password updates, profile visibility, session revocation, and data export.",
    icon: Settings,
    features: [
      "Email address & password changes",
      "Public vs Private profile visibility toggle",
      "Session history & remote signout",
      "Account deletion & full data export",
    ],
    sampleSnippet: "Status: Verified Student • CollegeCentre 2.0 Account",
  },
};

export function PlaceholderTab({ tab, onNavigateTab }: PlaceholderTabProps) {
  const config = TAB_CONFIG[tab] || TAB_CONFIG.links;
  const IconComponent = config.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      <Card className="p-6 sm:p-8 border-border shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground shrink-0 shadow-xs">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {config.title}
                </h2>
                <Badge variant="brand" size="sm" className="font-mono text-[10px]">
                  {config.phase}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground pt-0.5">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("profile")}
              className="text-xs"
            >
              Edit Profile
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigateTab("overview")}
              className="text-xs"
            >
              Back to Overview
            </Button>
          </div>
        </div>

        {/* Planned Capabilities */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>Planned Capabilities for {config.phase}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-border/70 bg-muted/20 text-xs text-foreground/90 font-medium"
              >
                <div className="h-2 w-2 rounded-full bg-brand shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Realistic Module Preview Mockup */}
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-background px-3 py-1 rounded-md border border-border/60">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{config.sampleSnippet}</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            This module architecture is fully reserved. Full management, data modeling, and live editing will be activated in {config.phase}.
          </p>
          <div className="pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("profile")}
              className="text-xs text-primary font-semibold hover:underline"
              rightIcon={<ArrowRight className="h-3 w-3" />}
            >
              Continue editing your core profile details
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
