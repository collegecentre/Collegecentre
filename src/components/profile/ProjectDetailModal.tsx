"use client";

import * as React from "react";
import {
  ExternalLink,
  PlayCircle,
  Calendar,
  Sparkles,
  Code2,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const youtubeId = project.video_url ? extractYouTubeId(project.video_url) : null;
  const hasCover = Boolean(project.cover_image_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* 1. Header Media / Cover Banner */}
        <div className="relative w-full aspect-video max-h-56 sm:max-h-64 bg-muted overflow-hidden border-b border-border">
          {hasCover ? (
            <img
              src={project.cover_image_url!}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/80 to-muted text-muted-foreground gap-2 p-6">
              <Code2 className="h-10 w-10 text-primary/40" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/80">
                Verified Student Showcase
              </span>
            </div>
          )}

          {/* Featured pill overlay */}
          {project.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="brand"
                size="sm"
                className="bg-brand text-brand-foreground shadow-subtle gap-1 font-mono text-[10px]"
              >
                <Sparkles className="h-3 w-3" />
                Featured Project
              </Badge>
            </div>
          )}
        </div>

        {/* 2. Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          <DialogHeader className="text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {project.title}
              </DialogTitle>

              {(project.start_date || project.end_date) && (
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {project.start_date || "Start"} — {project.end_date || "Present"}
                  </span>
                </div>
              )}
            </div>

            <DialogDescription className="sr-only">
              Details and technical overview for {project.title}
            </DialogDescription>
          </DialogHeader>

          {/* Technologies Stack Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Technologies &amp; Architecture
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, index) => (
                  <Badge
                    key={`${tech}-${index}`}
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs py-0.5 px-2 bg-muted/40 border-border/70 hover:bg-muted"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Full Project Description */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              About the Project
            </span>
            <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed border-l-2 border-primary/20 pl-3 py-0.5">
              {project.description}
            </div>
          </div>

          {/* Embedded Video Demo if Available */}
          {project.video_url && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Demo Video
              </span>
              {youtubeId ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={`${project.title} Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <PlayCircle className="h-4 w-4 text-brand" />
                    <span>Watch Walkthrough Video</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              )}
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-border/60">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-9"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </Button>
              </a>
            )}

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs h-9"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
