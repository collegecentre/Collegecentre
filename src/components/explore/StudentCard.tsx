"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Award,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExploreStudentCardData } from "@/types";

interface StudentCardProps {
  student: ExploreStudentCardData;
}

export function StudentCard({ student }: StudentCardProps) {
  const displayName = student.full_name || `@${student.username}`;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-modal transition-all duration-200">
      <div className="space-y-4">
        {/* Top Identity Header */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/${student.username}`}
            className="flex items-center gap-3 min-w-0 group/link"
          >
            <Avatar size="lg" className="ring-2 ring-border/60 group-hover/link:ring-primary/60 transition-all">
              {student.avatar_url && (
                <AvatarImage src={student.avatar_url} alt={displayName} />
              )}
              <AvatarFallback className="text-xs font-bold font-mono">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-foreground group-hover/link:text-primary transition-colors truncate">
                  {displayName}
                </span>
                <span title="Verified Student" className="inline-flex">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand shrink-0" />
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground truncate">
                <span>@{student.username}</span>
                {student.category && (
                  <>
                    <span>•</span>
                    <span className="capitalize text-[11px] text-foreground/75 font-sans font-medium">
                      {student.category}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {student.is_featured && (
            <Badge
              variant="brand"
              size="sm"
              className="bg-brand/10 text-brand border border-brand/20 shadow-none font-mono text-[9px] px-1.5 py-0 shrink-0 gap-1"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Featured
            </Badge>
          )}
        </div>

        {/* Academic Context & Location */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {student.show_college_on_profile !== false && student.college && (
            <span className="inline-flex items-center gap-1 font-medium text-foreground/90 truncate max-w-[220px]">
              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {student.college_slug ? (
                <Link
                  href={`/college/${student.college_slug}`}
                  className="truncate hover:text-primary hover:underline transition-colors"
                >
                  {student.college}
                </Link>
              ) : (
                <span className="truncate">{student.college}</span>
              )}
              {student.graduation_year && (
                <span className="font-mono text-muted-foreground">
                  &apos;{String(student.graduation_year).slice(-2)}
                </span>
              )}
            </span>
          )}

          {student.location && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0 opacity-70" />
              <span>{student.location}</span>
            </span>
          )}
        </div>

        {/* Bio statement */}
        {student.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {student.bio}
          </p>
        )}

        {/* Highlighted Top Project / Artifact */}
        {student.top_project && (
          <div className="p-3 rounded-xl border border-border/50 bg-muted/30 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1 text-foreground font-semibold">
                <Code2 className="h-3.5 w-3.5 text-brand" />
                <span className="truncate max-w-[180px]">{student.top_project.title}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Top Artifact
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal">
              {student.top_project.description}
            </p>

            {student.top_project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {student.top_project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted/80 text-foreground/80 border border-border/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Pills */}
        {student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {student.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/50 border border-border/40 text-muted-foreground group-hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          {student.projects_count > 0 && (
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3 text-muted-foreground/70" />
              <span>{student.projects_count} {student.projects_count === 1 ? "Project" : "Projects"}</span>
            </span>
          )}

          {student.achievements_count > 0 && (
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3 text-muted-foreground/70" />
              <span>{student.achievements_count}</span>
            </span>
          )}
        </div>

        <Button
          asChild
          variant="ghost"
          size="xs"
          className="text-xs h-7 gap-1 font-semibold text-primary hover:text-primary group-hover:translate-x-0.5 transition-transform"
        >
          <Link href={`/${student.username}`}>
            <span>Showcase</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
