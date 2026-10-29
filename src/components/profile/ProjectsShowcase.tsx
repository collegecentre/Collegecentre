"use client";

import * as React from "react";
import {
  Code2,
  ExternalLink,
  Sparkles,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectDetailModal } from "./ProjectDetailModal";
import type { ProfileThemeConfig } from "@/lib/themes";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsShowcaseProps {
  projects: Project[];
  themeConfig: ProfileThemeConfig;
  studentName?: string | null;
  className?: string;
}

export function ProjectsShowcase({
  projects,
  themeConfig,
  studentName,
  className,
}: ProjectsShowcaseProps) {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  // Filter enabled projects just in case
  const visibleProjects = projects.filter((p) => p.is_enabled !== false);

  if (visibleProjects.length === 0) {
    return (
      <section aria-labelledby="featured-projects-heading" className={cn("space-y-3 pt-2", className)}>
        <div className="flex items-center justify-between px-1">
          <h2
            id="featured-projects-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Projects &amp; Work
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="text-[10px] font-mono text-muted-foreground border-border/80"
          >
            0 projects
          </Badge>
        </div>

        <div
          className={cn(
            "rounded-xl border p-5 text-center space-y-2",
            themeConfig.featuredCard
          )}
        >
          <div className="h-9 w-9 rounded-full bg-muted/80 flex items-center justify-center mx-auto text-muted-foreground">
            <Code2 className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium text-foreground">
            No projects published yet
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            {studentName ? `${studentName}'s` : "This"} technical portfolio and artifacts will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="featured-projects-heading" className={cn("space-y-3 pt-2", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2
            id="featured-projects-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Projects &amp; Artifacts
          </h2>
        </div>
        <Badge
          variant="outline"
          size="sm"
          className="text-[10px] font-mono text-muted-foreground border-border/80"
        >
          {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
        </Badge>
      </div>

      {/* Projects List: Compact, high-density, beautiful cards */}
      <div className="space-y-3">
        {visibleProjects.map((project) => {
          const hasCover = Boolean(project.cover_image_url);
          const visibleTech = (project.technologies || []).slice(0, 3);
          const remainingTechCount = Math.max(0, (project.technologies || []).length - 3);

          return (
            <div
              key={project.id}
              className={cn(
                "group rounded-xl border p-4 sm:p-5 transition-all duration-200 relative overflow-hidden",
                themeConfig.featuredCard
              )}
            >
              {/* Optional Cover Image Banner */}
              {hasCover && (
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative w-full h-32 sm:h-36 rounded-lg overflow-hidden mb-3.5 bg-muted border border-border/40 cursor-pointer group-hover:opacity-95 transition-opacity"
                >
                  <img
                    src={project.cover_image_url!}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  {project.is_featured && (
                    <div className="absolute top-2.5 left-2.5">
                      <Badge
                        variant="brand"
                        size="sm"
                        className="bg-brand text-brand-foreground shadow-subtle gap-1 font-mono text-[9px] px-1.5 py-0"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {project.video_url && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono flex items-center gap-1 backdrop-blur-xs">
                      <PlayCircle className="h-3 w-3" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title, Featured Tag (if no image) & Dates */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!hasCover && project.is_featured && (
                      <Badge
                        variant="brand"
                        size="sm"
                        className="bg-brand text-brand-foreground shadow-subtle gap-1 font-mono text-[9px] px-1.5 py-0"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        Featured
                      </Badge>
                    )}
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                  </div>

                  {(project.start_date || project.end_date) && (
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30">
                      {project.start_date || "Start"} — {project.end_date || "Present"}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p
                  onClick={() => setSelectedProject(project)}
                  className="text-xs text-muted-foreground line-clamp-2 leading-relaxed cursor-pointer"
                >
                  {project.description}
                </p>
              </div>

              {/* Technologies Pills */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-border/40">
                  {visibleTech.map((tech, idx) => (
                    <span
                      key={`${tech}-${idx}`}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/50 border border-border/40 text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {remainingTechCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-muted-foreground">
                      +{remainingTechCount} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Links & Details trigger */}
              <div className="flex items-center justify-between gap-2 mt-3.5 pt-2.5 border-t border-border/40">
                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/60"
                      aria-label={`View GitHub repository for ${project.title}`}
                    >
                      <GitHubIcon className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:text-brand-hover transition-colors p-1 rounded hover:bg-muted/60"
                      aria-label={`Open live demo for ${project.title}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setSelectedProject(project)}
                  className="text-[11px] h-6 px-2 gap-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Details</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProject(null);
        }}
      />
    </section>
  );
}
