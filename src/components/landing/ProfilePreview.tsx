"use client";

import * as React from "react";
import {
  ExternalLink,
  GitBranch,
  Star,
  Award,
  FileText,
  Copy,
  Check,
  Sparkles,
  Share2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type PreviewTheme = "obsidian" | "academic" | "cobalt" | "terminal";

export function ProfilePreview() {
  const [activeTheme, setActiveTheme] = React.useState<PreviewTheme>("obsidian");
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    setCopied(true);
    toast({
      title: "URL Copied",
      description: "collegecentre.id/alexrivera copied to clipboard.",
      variant: "default",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles = {
    obsidian: {
      frame: "bg-card border-border",
      headerBg: "bg-muted/30",
      accent: "text-foreground",
      badgeVariant: "brand" as const,
      projectBorder: "border-border hover:border-foreground/40",
      linkCard: "border-border hover:bg-muted/40",
      fontFamily: "font-sans",
    },
    academic: {
      frame: "bg-amber-50/40 dark:bg-zinc-900 border-amber-900/10 dark:border-zinc-800",
      headerBg: "bg-amber-100/30 dark:bg-zinc-800/50",
      accent: "text-amber-900 dark:text-amber-200",
      badgeVariant: "secondary" as const,
      projectBorder: "border-amber-900/15 dark:border-zinc-700 hover:border-amber-900/30",
      linkCard: "border-amber-900/10 dark:border-zinc-800 hover:bg-amber-50 dark:hover:bg-zinc-800/40",
      fontFamily: "font-serif",
    },
    cobalt: {
      frame: "bg-card border-brand/20",
      headerBg: "bg-brand/5",
      accent: "text-brand",
      badgeVariant: "brand" as const,
      projectBorder: "border-brand/20 hover:border-brand/50",
      linkCard: "border-brand/10 hover:bg-brand/5",
      fontFamily: "font-sans",
    },
    terminal: {
      frame: "bg-zinc-950 text-zinc-100 border-zinc-800 font-mono",
      headerBg: "bg-zinc-900/80",
      accent: "text-emerald-400",
      badgeVariant: "success" as const,
      projectBorder: "border-zinc-800 hover:border-emerald-500/40",
      linkCard: "border-zinc-800/80 hover:bg-zinc-900/60",
      fontFamily: "font-mono",
    },
  };

  const currentTheme = themeStyles[activeTheme];

  return (
    <section id="preview" className="space-y-4 max-w-4xl mx-auto px-4">
      {/* Theme Picker Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            Live Showcase Preview
          </span>
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            Desktop &amp; Mobile View
          </Badge>
        </div>

        {/* Live Theme Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs">
          <span className="text-[11px] font-mono text-muted-foreground px-2 hidden sm:inline">Theme:</span>
          {(["obsidian", "academic", "cobalt", "terminal"] as PreviewTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTheme(t)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all",
                activeTheme === t
                  ? "bg-background text-foreground shadow-subtle font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Browser Window Frame */}
      <div className="rounded-xl border border-border bg-card shadow-modal overflow-hidden transition-all duration-200">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-border" />
            <div className="h-3 w-3 rounded-full bg-border" />
            <div className="h-3 w-3 rounded-full bg-border" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background border border-border/70 text-xs font-mono text-muted-foreground max-w-xs w-full justify-between">
            <span className="truncate">collegecentre.id/alexrivera</span>
            <button
              onClick={handleCopyLink}
              className="text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Copy profile link"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            <span className="hidden sm:inline">Verified Identity</span>
          </div>
        </div>

        {/* Realistic Profile Page Inside */}
        <div className={cn("p-6 sm:p-10 transition-colors duration-200", currentTheme.frame)}>
          <div className="max-w-xl mx-auto space-y-8">
            {/* 1. Identity Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar size="2xl" status="verified" className="ring-4 ring-background shadow-card">
                  <AvatarFallback className="text-xl font-bold bg-muted text-foreground">
                    AR
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Alex Rivera
                  </h2>
                  <Badge variant={currentTheme.badgeVariant} dot size="sm">
                    Verified Student
                  </Badge>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                  UC Berkeley • B.S. EECS &amp; Robotics &apos;26
                </p>

                <p className="text-xs sm:text-sm text-foreground/80 max-w-md mx-auto leading-relaxed pt-1">
                  Building visual SLAM kernels for autonomous drones and low-latency ROS2 nodes. ACM SIGGRAPH &amp; HackMIT finalist.
                </p>
              </div>

              {/* Social Link Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <a
                  href="#github"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs font-medium hover:bg-muted/80 transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5" /> github.com/arivera
                </a>
                <a
                  href="#linkedin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs font-medium hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" /> in/alex-rivera
                </a>
                <a
                  href="#resume"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs font-medium hover:bg-muted/80 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" /> Resume PDF
                </a>
              </div>
            </div>

            {/* 2. Featured Project Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-muted-foreground px-0.5">
                <span>Featured Project</span>
                <span className="flex items-center gap-1 text-brand font-medium">
                  <Sparkles className="h-3 w-3" /> Pinned
                </span>
              </div>

              <div className={cn("p-4 sm:p-5 rounded-lg border bg-card/60 transition-all shadow-subtle", currentTheme.projectBorder)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-foreground">
                        AeroSLAM — Subterranean Visual Inertial Odometry
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Custom sensor fusion pipeline combining stereo fisheye vision and high-rate IMU for autonomous quadrotors in GPS-denied tunnels.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono shrink-0 text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>248</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-border/50 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" size="sm">Rust</Badge>
                    <Badge variant="outline" size="sm">ROS2</Badge>
                    <Badge variant="outline" size="sm">CUDA</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline cursor-pointer">
                      Live Simulation <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Curated Links (Linktree-style but elevated) */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase text-muted-foreground px-0.5 block">
                Highlighted Links &amp; Research
              </span>

              <div className="space-y-2">
                <a
                  href="#arxiv"
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-lg border bg-card/40 transition-all group",
                    currentTheme.linkCard
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        Read My Preprint on arXiv (cs.RO)
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        arxiv.org/abs/2609.1104
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>

                <a
                  href="#hardware"
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-lg border bg-card/40 transition-all group",
                    currentTheme.linkCard
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        Custom Drone CAD Files &amp; KiCad Schematics
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Onshape 3D Assembly &amp; 4-Layer PCB Gerbers
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>

            {/* 4. Verified Academic Honors */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted-foreground px-0.5 block">
                Verified Honors &amp; Hackathons
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg border border-border/80 bg-card/40 flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">1st Place — HackMIT 2026</p>
                    <p className="text-[11px] text-muted-foreground">Hardware &amp; Robotics Track</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-card/40 flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Dean&apos;s Honor List</p>
                    <p className="text-[11px] text-muted-foreground">College of Engineering (4 Terms)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Footer */}
            <div className="pt-4 text-center border-t border-border/40">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Powered by CollegeCentre • Verified Student Page
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
