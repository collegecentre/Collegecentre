"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Sparkles,
  Code2,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExploreProject } from "@/types";

interface ExploreProjectCardProps {
  project: ExploreProject;
}

export function ExploreProjectCard({ project }: ExploreProjectCardProps) {
  const authorName = project.author?.full_name || `@${project.author?.username || "student"}`;
  const authorInitials = authorName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card overflow-hidden hover:border-primary/50 hover:shadow-modal transition-all duration-200">
      {/* Optional Project Cover Image */}
      {project.cover_image_url ? (
        <div className="h-44 w-full overflow-hidden bg-muted relative">
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          {project.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="brand"
                size="sm"
                className="bg-background/90 backdrop-blur-md text-foreground border border-border font-mono text-[9px] gap-1 shadow-xs"
              >
                <Sparkles className="h-2.5 w-2.5 text-brand" />
                Featured Project
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="h-24 w-full bg-gradient-to-br from-muted/60 via-muted/30 to-background p-4 flex items-start justify-between border-b border-border/40">
          <div className="h-9 w-9 rounded-lg bg-background border border-border/60 flex items-center justify-center text-brand">
            <Code2 className="h-4 w-4" />
          </div>
          {project.is_featured && (
            <Badge
              variant="brand"
              size="sm"
              className="font-mono text-[9px] gap-1 bg-brand/10 text-brand border border-brand/20 shadow-none"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Featured
            </Badge>
          )}
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[10px] font-mono px-1 py-0.5 text-muted-foreground">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Author Metadata Bar */}
        {project.author && (
          <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
            <Link
              href={`/${project.author.username}`}
              className="flex items-center gap-2 group/author min-w-0"
            >
              <Avatar size="sm" className="ring-1 ring-border shrink-0">
                {project.author.avatar_url && (
                  <AvatarImage src={project.author.avatar_url} alt={authorName} />
                )}
                <AvatarFallback className="text-[10px] font-bold font-mono">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <span className="text-xs font-semibold text-foreground group-hover/author:text-primary transition-colors truncate block">
                  {authorName}
                </span>
                {project.author.college && (
                  <span className="text-[10px] text-muted-foreground truncate block font-mono">
                    {project.author.college}
                  </span>
                )}
              </div>
            </Link>

            {/* Quick Outbound Links */}
            <div className="flex items-center gap-1 shrink-0">
              {project.github_url && (
                <Button asChild size="icon-sm" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View GitHub Repository"
                  >
                    <GitHubIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}

              {project.demo_url && (
                <Button asChild size="icon-sm" variant="ghost" className="h-7 w-7 text-brand hover:text-brand-hover">
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Live Demo"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
