"use client";

import * as React from "react";
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  FileCheck2,
  Download,
  Sparkles,
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
import type { Certificate } from "@/types";

interface CertificateViewerModalProps {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateViewerModal({
  certificate,
  open,
  onOpenChange,
}: CertificateViewerModalProps) {
  if (!certificate) return null;

  const hasImage = Boolean(certificate.image_url);
  const hasPdf = Boolean(certificate.pdf_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* 1. Header Media Banner or Credential Seal */}
        {hasImage ? (
          <div className="relative w-full aspect-[16/10] max-h-64 bg-muted overflow-hidden border-b border-border">
            <img
              src={certificate.image_url!}
              alt={`${certificate.name} certificate`}
              className="w-full h-full object-cover"
            />
            {certificate.is_featured && (
              <div className="absolute top-3 left-3">
                <Badge
                  variant="brand"
                  size="sm"
                  className="bg-brand text-brand-foreground shadow-subtle gap-1 font-mono text-[10px]"
                >
                  <Sparkles className="h-3 w-3" />
                  Featured Credential
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full p-6 bg-gradient-to-br from-muted/60 via-muted/30 to-muted/80 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-xs">
                <ShieldCheck className="h-6 w-6 text-brand" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Certificate Credential
                </span>
                <span className="text-sm font-bold text-foreground block">
                  {certificate.issuer}
                </span>
              </div>
            </div>

            {certificate.is_featured && (
              <Badge
                variant="brand"
                size="sm"
                className="bg-brand text-brand-foreground shadow-subtle gap-1 font-mono text-[10px]"
              >
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
        )}

        {/* 2. Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          <DialogHeader className="text-left space-y-1.5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {certificate.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="font-medium text-foreground/80 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 opacity-70" />
                    <span>{certificate.issuer}</span>
                  </span>
                  <span>•</span>
                  <span className="font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3 opacity-60" />
                    <span>Issued: {certificate.issue_date}</span>
                  </span>
                  {certificate.expiration_date && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-muted-foreground">
                        Expires: {certificate.expiration_date}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {certificate.credential_id && (
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                  <FileCheck2 className="h-3.5 w-3.5 text-brand" />
                  <span>ID: {certificate.credential_id}</span>
                </div>
              )}
            </div>

            <DialogDescription className="sr-only">
              Verified certificate details for {certificate.name} issued by {certificate.issuer}
            </DialogDescription>
          </DialogHeader>

          {/* Description narrative if available */}
          {certificate.description && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Credential Overview &amp; Competencies
              </span>
              <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed border-l-2 border-primary/20 pl-3 py-0.5">
                {certificate.description}
              </p>
            </div>
          )}

          {/* PDF Certificate Action if available */}
          {hasPdf && (
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-foreground block truncate">
                    Official Certificate PDF Document
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Digitally signed document
                  </span>
                </div>
              </div>

              <a
                href={certificate.pdf_url!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="xs"
                  className="gap-1 text-xs h-7.5"
                >
                  <Download className="h-3 w-3" />
                  <span>Open PDF</span>
                </Button>
              </a>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-border/60">
            {certificate.credential_url && (
              <a
                href={certificate.credential_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs h-9"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Credential at {certificate.issuer}</span>
                  <ExternalLink className="h-3 w-3" />
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
