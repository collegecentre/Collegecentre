"use client";

import * as React from "react";
import {
  Link2,
  GitBranch,
  Award,
  FileCheck2,
  FileText,
  Star,
  ExternalLink,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ShowcaseGrid() {

  return (
    <section id="showcase" className="space-y-10 max-w-5xl mx-auto px-4 pt-16 border-t border-border/70">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Typography variant="eyebrow" className="text-brand">
          Showcase Modules
        </Typography>
        <Typography variant="h2" as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
          Everything you need to prove your skills.
        </Typography>
        <Typography variant="body" className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Six specialized modules built for students to organize their work into a polished, recruiter-ready destination.
        </Typography>
      </div>

      {/* Grid of 6 modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Curated Links */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Link2 className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 01
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Curated Links
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Direct visitors to your research papers, Substack essays, personal homelab, or design portfolio.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-background border border-border/60">
                <span className="font-medium text-foreground truncate">Deep Learning Lecture Notes</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-background border border-border/60">
                <span className="font-medium text-foreground truncate">Mechanical Keyboard CAD Build</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Custom metadata</span>
            <span className="text-foreground font-medium">Click analytics</span>
          </div>
        </Card>

        {/* 2. Projects & Demos */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Code2 className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 02
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Project Cards
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Showcase what you&apos;ve built with language badges, live preview buttons, and architecture overviews.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="p-2.5 rounded bg-background border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-xs">RayTracer-GPU</span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 182
                  </span>
                </div>
                <div className="flex gap-1">
                  <Badge variant="secondary" size="sm" className="text-[10px] py-0">C++</Badge>
                  <Badge variant="secondary" size="sm" className="text-[10px] py-0">Vulkan</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Live demo embeds</span>
            <span className="text-foreground font-medium">Auto README sync</span>
          </div>
        </Card>

        {/* 3. Achievements & Hackathons */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 03
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Hackathons &amp; Honors
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Put your competitive programming ranks, hackathon trophies, and dean&apos;s honors front and center.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="p-2.5 rounded bg-background border border-border/60 flex items-start gap-2">
                <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground text-xs">HackZurich Grand Finalist</span>
                  <p className="text-[11px] text-muted-foreground">1st in Mobility &amp; Autonomous Logistics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Verified track wins</span>
            <span className="text-foreground font-medium">Judges recognition</span>
          </div>
        </Card>

        {/* 4. Verified Certificates */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 04
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Verified Certificates
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Proof of completion for AWS, DeepLearning.AI, Coursera, and university laboratory safety credentials.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="p-2.5 rounded bg-background border border-border/60 flex items-center justify-between">
                <div className="truncate">
                  <span className="font-medium text-foreground text-xs block truncate">AWS Solutions Architect</span>
                  <span className="text-[10px] font-mono text-muted-foreground">ID: AWS-9821-VERIFIED</span>
                </div>
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Direct credential check</span>
            <span className="text-foreground font-medium">Tamper-proof</span>
          </div>
        </Card>

        {/* 5. Resume & Experience */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 05
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                Resume &amp; Work History
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Provide a one-click PDF download alongside structured summer internship and research assistant roles.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="p-2 rounded bg-background border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-[11px] text-foreground">resume_alex_rivera_2026.pdf</span>
                </div>
                <Badge variant="outline" size="sm" className="text-[10px]">1-Click</Badge>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Clean PDF renderer</span>
            <span className="text-foreground font-medium">Always up to date</span>
          </div>
        </Card>

        {/* 6. GitHub Auto-Sync */}
        <Card className="p-5 flex flex-col justify-between space-y-4 border-border/80 shadow-subtle hover:border-foreground/30 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
                <GitBranch className="h-4 w-4" />
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Module 06
              </Badge>
            </div>

            <div>
              <Typography variant="h4" className="text-base font-semibold">
                GitHub Deep Sync
              </Typography>
              <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed mt-1 block">
                Seamlessly import top repositories, stars, commit activity streaks, and language stats into your profile.
              </Typography>
            </div>

            {/* Mini preview */}
            <div className="p-3 rounded-md border border-border bg-muted/30 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-background border border-border/60 font-mono text-[11px]">
                <span className="text-foreground">842 commits in 2026</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Top 5% Student</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div className="h-full bg-orange-500 w-[45%]" title="Rust" />
                <div className="h-full bg-blue-500 w-[30%]" title="TypeScript" />
                <div className="h-full bg-yellow-500 w-[25%]" title="Python" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
            <span>Zero manual entry</span>
            <span className="text-foreground font-medium">Real-time sync</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
