"use client";

import * as React from "react";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  HardDrive,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResumeViewerModal } from "./ResumeViewerModal";
import type { ProfileThemeConfig } from "@/lib/themes";
import type { Resume } from "@/types";
import { cn } from "@/lib/utils";

interface ResumeShowcaseProps {
  resume: Resume | null;
  themeConfig: ProfileThemeConfig;
  studentName?: string | null;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "PDF";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ResumeShowcase({
  resume,
  themeConfig,
  studentName,
  className,
}: ResumeShowcaseProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  // If no resume uploaded or explicitly hidden, do not render publicly
  if (!resume || resume.is_visible === false) {
    return null;
  }

  const displayTitle = resume.title || "Curriculum Vitae / Resume";
  const formattedSize = formatBytes(resume.file_size);
  const formattedDate = formatDate(resume.uploaded_at);

  return (
    <>
      <section
        aria-labelledby="resume-heading"
        className={cn("space-y-3 pt-2", className)}
      >
        <div className="flex items-center justify-between px-1">
          <h2
            id="resume-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Resume &amp; CV
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Verified Document
          </Badge>
        </div>

        {/* Professional Document Card */}
        <div
          className={cn(
            "group relative p-4 rounded-xl border transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4",
            themeConfig.linkCard
          )}
        >
          {/* Left Document Identity */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            {/* PDF Emblem */}
            <div className="h-11 w-11 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <FileText className="h-5 w-5" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-tight -mt-0.5">
                PDF
              </span>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-foreground tracking-tight truncate max-w-[280px] sm:max-w-xs block">
                  {displayTitle}
                </span>
                <Badge
                  variant="outline"
                  size="sm"
                  className="font-mono text-[9px] px-1.5 py-0 text-emerald-500 border-emerald-500/30 bg-emerald-500/5 hidden sm:inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Live
                </Badge>
              </div>

              {/* File Info */}
              <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground flex-wrap">
                <span className="truncate max-w-[160px] sm:max-w-xs">
                  {resume.file_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3 opacity-70" />
                  {formattedSize}
                </span>
                {formattedDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 opacity-70" />
                      {formattedDate}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t border-border/40 sm:border-0 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="h-8 px-3 text-xs gap-1.5 font-medium transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Resume</span>
            </Button>

            <Button
              asChild
              size="sm"
              className="h-8 px-3 text-xs gap-1.5 font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
            >
              <a
                href={resume.file_url}
                download={resume.file_name || "Resume.pdf"}
                title="Download resume PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Document Viewer Modal */}
      <ResumeViewerModal
        resume={resume}
        open={modalOpen}
        onOpenChange={setModalOpen}
        studentName={studentName}
      />
    </>
  );
}
