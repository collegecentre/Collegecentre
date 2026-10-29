"use client";

import * as React from "react";
import {
  Trophy,
  Award,
  Medal,
  GitPullRequest,
  GraduationCap,
  Users,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Calendar,
  Building2,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProfileThemeConfig } from "@/lib/themes";
import type { Achievement, AchievementType } from "@/types";
import { cn } from "@/lib/utils";

interface AchievementsShowcaseProps {
  achievements: Achievement[];
  themeConfig: ProfileThemeConfig;
  studentName?: string | null;
  className?: string;
}

export function getAchievementTypeMeta(type: AchievementType): {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  switch (type) {
    case "hackathon":
      return { label: "Hackathon", icon: Trophy };
    case "competition":
      return { label: "Competition", icon: Medal };
    case "award":
      return { label: "Award & Honor", icon: Award };
    case "open_source":
      return { label: "Open Source", icon: GitPullRequest };
    case "academic":
      return { label: "Academic Honor", icon: GraduationCap };
    case "leadership":
      return { label: "Leadership", icon: Users };
    case "certification":
      return { label: "Certification", icon: ShieldCheck };
    case "other":
    default:
      return { label: "Achievement", icon: Sparkles };
  }
}

export function AchievementsShowcase({
  achievements,
  themeConfig,
  studentName,
  className,
}: AchievementsShowcaseProps) {
  // Filter out disabled achievements
  const visibleAchievements = achievements.filter((a) => a.is_enabled !== false);

  if (visibleAchievements.length === 0) {
    return (
      <section aria-labelledby="achievements-heading" className={cn("space-y-3 pt-2", className)}>
        <div className="flex items-center justify-between px-1">
          <h2
            id="achievements-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Honors &amp; Achievements
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="text-[10px] font-mono text-muted-foreground border-border/80"
          >
            0 honors
          </Badge>
        </div>

        <div
          className={cn(
            "rounded-xl border p-5 text-center space-y-2",
            themeConfig.featuredCard
          )}
        >
          <div className="h-9 w-9 rounded-full bg-muted/80 flex items-center justify-center mx-auto text-muted-foreground">
            <Award className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium text-foreground">
            No achievements published yet
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            {studentName ? `${studentName}'s` : "This"} verified hackathon wins, research awards, and leadership honors will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="achievements-heading" className={cn("space-y-3 pt-2", className)}>
      {/* Section Title Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2
            id="achievements-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Honors &amp; Achievements
          </h2>
        </div>
        <Badge
          variant="outline"
          size="sm"
          className="text-[10px] font-mono text-muted-foreground border-border/80"
        >
          {visibleAchievements.length} {visibleAchievements.length === 1 ? "honor" : "honors"}
        </Badge>
      </div>

      {/* Visual Distinct Milestone Timeline / List */}
      <div className="relative pl-3 sm:pl-4 space-y-3 before:absolute before:left-1 sm:before:left-1.5 before:top-3 before:bottom-3 before:w-[1px] before:bg-border/60">
        {visibleAchievements.map((item) => {
          const typeMeta = getAchievementTypeMeta(item.type);
          const TypeIcon = typeMeta.icon;
          const hasImage = Boolean(item.image_url);

          return (
            <div
              key={item.id}
              className="relative group transition-all duration-200"
            >
              {/* Timeline Indicator Dot */}
              <div
                className={cn(
                  "absolute -left-3 sm:-left-4 top-4 h-2.5 w-2.5 rounded-full border border-background ring-2 transition-transform duration-200",
                  item.is_featured
                    ? "bg-brand ring-brand/30 scale-110"
                    : "bg-muted-foreground/60 ring-border"
                )}
                aria-hidden="true"
              />

              {/* Achievement Structured Milestone Card */}
              <div
                className={cn(
                  "rounded-xl border p-3.5 sm:p-4 transition-all duration-200 space-y-2.5 shadow-xs",
                  themeConfig.featuredCard,
                  item.is_featured && "ring-1 ring-brand/30"
                )}
              >
                {/* Header: Organization Emblem / Logo + Title + Type Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Organization Logo or Icon Thumbnail */}
                    <div className="w-9 h-9 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                      {hasImage ? (
                        <img
                          src={item.image_url!}
                          alt={item.organization}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TypeIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    {/* Title & Organization Meta */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.is_featured && (
                          <Badge
                            variant="brand"
                            size="sm"
                            className="text-[9px] font-mono px-1 py-0 gap-0.5 bg-brand text-brand-foreground"
                          >
                            <Sparkles className="h-2 w-2" />
                            Featured
                          </Badge>
                        )}
                        <h3 className="text-sm font-semibold text-foreground leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="font-medium text-foreground/80 flex items-center gap-1">
                          <Building2 className="h-3 w-3 opacity-70" />
                          <span>{item.organization}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px] flex items-center gap-1">
                          <Calendar className="h-3 w-3 opacity-60" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <Badge
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-[10px] font-mono px-2 py-0.5 gap-1 bg-muted/40 border-border/70"
                  >
                    <TypeIcon className="h-2.5 w-2.5 text-primary" />
                    <span>{typeMeta.label}</span>
                  </Badge>
                </div>

                {/* Description Narrative */}
                {item.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed pl-12 border-l border-border/30">
                    {item.description}
                  </p>
                )}

                {/* Footer Metadata: Credential ID & Verification Link */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/30 text-[11px]">
                  {/* Credential Reference ID if present */}
                  {item.credential_id ? (
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
                      <FileCheck2 className="h-3 w-3 opacity-70 text-brand" />
                      <span>ID: {item.credential_id}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Verification URL Link */}
                  {item.verification_url && (
                    <a
                      href={item.verification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:text-brand-hover hover:underline transition-colors ml-auto"
                      aria-label={`Verify ${item.title} with ${item.organization}`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify Credential</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
