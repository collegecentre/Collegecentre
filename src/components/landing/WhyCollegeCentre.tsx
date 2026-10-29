"use client";

import * as React from "react";
import { Check, X, ShieldCheck, GitBranch, FileText } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

export function WhyCollegeCentre() {
  const comparisonItems = [
    {
      feature: "Student Proof of Work",
      generic: "Generic URLs with no code context or preview",
      collegecentre: "GitHub repository sync, tech stack tags, live demo embeds & star counts",
    },
    {
      feature: "Academic Identity",
      generic: "No university, degree, graduation year, or GPA fields",
      collegecentre: "Structured student bio, verified institutional badge, and graduation timeline",
    },
    {
      feature: "Hackathon & Honors Showcase",
      generic: "Boring plain text or buried in external links",
      collegecentre: "Dedicated verified achievement cards with tracks, awards, and credentials",
    },
    {
      feature: "Resume & Documents",
      generic: "Raw PDF download links or Google Drive redirects",
      collegecentre: "Integrated PDF reader, clean resume viewer, and research preprint cards",
    },
    {
      feature: "Visual Aesthetic",
      generic: "Cluttered creator templates, cartoon banners, and bloated animations",
      collegecentre: "Premium editorial typography, disciplined monochrome & cobalt tokens",
    },
    {
      feature: "Pricing & Student Rights",
      generic: "Aggressive paywalls for basic custom domains and analytics",
      collegecentre: "100% free for students with zero paywalls or creator spam",
    },
  ];

  return (
    <section id="why-collegecentre" className="space-y-10 max-w-5xl mx-auto px-4 pt-16 border-t border-border/70">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Typography variant="eyebrow" className="text-brand">
          The Contrast
        </Typography>
        <Typography variant="h2" as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
          Not just a bio link. <br />
          Your verified student showcase.
        </Typography>
        <Typography variant="body" className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Generic link-in-bio tools were built for TikTok influencers and affiliate marketers.
          CollegeCentre is engineered for students who write code, build hardware, publish research, and lead teams.
        </Typography>
      </div>

      {/* Comparison Grid / Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border bg-muted/40 p-4 sm:p-5 text-xs font-semibold uppercase tracking-wider">
          <div className="hidden md:block md:col-span-4 text-muted-foreground">Capability</div>
          <div className="md:col-span-4 text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            Generic Link-in-Bio
          </div>
          <div className="md:col-span-4 text-brand flex items-center gap-1.5 pt-2 md:pt-0">
            <span className="h-2 w-2 rounded-full bg-brand" />
            CollegeCentre 2.0
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60">
          {comparisonItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 md:gap-4 items-center hover:bg-muted/20 transition-colors"
            >
              {/* Feature Title */}
              <div className="md:col-span-4 space-y-0.5">
                <span className="text-xs font-semibold text-foreground">{item.feature}</span>
              </div>

              {/* Generic */}
              <div className="md:col-span-4 flex items-start gap-2 text-xs text-muted-foreground">
                <X className="h-4 w-4 text-destructive/80 shrink-0 mt-0.5" />
                <span className="line-through opacity-80">{item.generic}</span>
              </div>

              {/* CollegeCentre */}
              <div className="md:col-span-4 flex items-start gap-2 text-xs text-foreground font-medium">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item.collegecentre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Card className="p-5 space-y-2 border-border/80 shadow-subtle">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
            <GitBranch className="h-4 w-4" />
          </div>
          <Typography variant="h4" className="text-sm font-semibold">
            Proof Over Fluff
          </Typography>
          <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed block">
            Directly connect your live code, research DOIs, CAD models, and hackathon prototypes.
          </Typography>
        </Card>

        <Card className="p-5 space-y-2 border-border/80 shadow-subtle">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <Typography variant="h4" className="text-sm font-semibold">
            Institutional Verification
          </Typography>
          <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed block">
            Verify via institutional email to stand out to recruiters, labs, and fellowship committees.
          </Typography>
        </Card>

        <Card className="p-5 space-y-2 border-border/80 shadow-subtle">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <Typography variant="h4" className="text-sm font-semibold">
            The Universal Header
          </Typography>
          <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed block">
            Place your single clean link on your one-page resume, GitHub README, and job applications.
          </Typography>
        </Card>
      </div>
    </section>
  );
}
