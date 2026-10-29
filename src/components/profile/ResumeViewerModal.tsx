"use client";

import * as React from "react";
import {
  Download,
  ExternalLink,
  Calendar,
  HardDrive,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Resume } from "@/types";

interface ResumeViewerModalProps {
  resume: Resume | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName?: string | null;
  profileId?: string;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "PDF Document";
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

export function ResumeViewerModal({
  resume,
  open,
  onOpenChange,
  studentName,
  profileId,
}: ResumeViewerModalProps) {
  const [iframeError, setIframeError] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIframeError(false);
    }
  }, [open]);

  if (!resume) return null;

  const targetPid = profileId || resume.profile_id;

  const handleDownload = () => {
    if (targetPid) {
      trackAnalyticsEvent({
        profileId: targetPid,
        eventType: "resume_download",
        resourceId: resume.id,
        resourceTitle: resume.title || resume.file_name,
      });
    }
  };

  const handleOpenTab = () => {
    if (targetPid) {
      trackAnalyticsEvent({
        profileId: targetPid,
        eventType: "resume_view",
        resourceId: resume.id,
        resourceTitle: resume.title || resume.file_name,
      });
    }
  };

  const displayTitle = resume.title || "Curriculum Vitae / Resume";
  const sizeText = formatBytes(resume.file_size);
  const uploadDate = formatDate(resume.uploaded_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] flex flex-col p-0 gap-0 border-border bg-card overflow-hidden">
        {/* Top Header Bar */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm" className="font-mono text-[10px] text-red-500 border-red-500/30 bg-red-500/10">
                  PDF Document
                </Badge>
                {studentName && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {studentName}
                  </span>
                )}
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                {displayTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="h-3 w-3 text-muted-foreground/70" />
                  {sizeText}
                </span>
                {uploadDate && (
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3 w-3 text-muted-foreground/70" />
                    Updated {uploadDate}
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  PDF Document
                </span>
              </DialogDescription>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenTab}
                  title="Open resume in full browser tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Tab</span>
                </a>
              </Button>
              <Button asChild size="sm" className="h-8 gap-1 text-xs bg-foreground text-background hover:bg-foreground/90">
                <a
                  href={resume.file_url}
                  download={resume.file_name || "Resume.pdf"}
                  onClick={handleDownload}
                  title="Download resume PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Embedded PDF Viewer Frame */}
        <div className="flex-1 min-h-[460px] sm:min-h-[560px] max-h-[70vh] bg-muted/20 relative flex items-center justify-center">
          {!iframeError ? (
            <iframe
              src={`${resume.file_url}#toolbar=0&navpanes=0`}
              title={`${displayTitle} - PDF Preview`}
              className="w-full h-full border-0"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="p-8 text-center space-y-3 max-w-sm">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Inline Preview Unavailable</p>
                <p className="text-xs text-muted-foreground">
                  Your browser or device does not support embedded PDF previews. You can safely download or open the resume directly.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <Button asChild size="sm">
                  <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Open PDF in New Window
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2.5 border-t border-border bg-card flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span className="truncate max-w-[240px] sm:max-w-md">{resume.file_name}</span>
          <span>Student Resume Document</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
