"use client";

import * as React from "react";
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  FileCheck2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CertificateViewerModal } from "./CertificateViewerModal";
import type { ProfileThemeConfig } from "@/lib/themes";
import type { Certificate } from "@/types";
import { cn } from "@/lib/utils";

interface CertificatesShowcaseProps {
  certificates: Certificate[];
  themeConfig: ProfileThemeConfig;
  studentName?: string | null;
  className?: string;
}

export function CertificatesShowcase({
  certificates,
  themeConfig,
  studentName,
  className,
}: CertificatesShowcaseProps) {
  const [selectedCertificate, setSelectedCertificate] = React.useState<Certificate | null>(null);

  // Filter out disabled certificates
  const visibleCertificates = certificates.filter((c) => c.is_enabled !== false);

  if (visibleCertificates.length === 0) {
    return (
      <section aria-labelledby="certificates-heading" className={cn("space-y-3 pt-2", className)}>
        <div className="flex items-center justify-between px-1">
          <h2
            id="certificates-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Certificates &amp; Credentials
          </h2>
          <Badge
            variant="outline"
            size="sm"
            className="text-[10px] font-mono text-muted-foreground border-border/80"
          >
            0 credentials
          </Badge>
        </div>

        <div
          className={cn(
            "rounded-xl border p-5 text-center space-y-2",
            themeConfig.featuredCard
          )}
        >
          <div className="h-9 w-9 rounded-full bg-muted/80 flex items-center justify-center mx-auto text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium text-foreground">
            No certificates added yet
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            {studentName ? `${studentName}'s` : "This"} professional licenses, cloud credentials, and accredited course certificates will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="certificates-heading" className={cn("space-y-3 pt-2", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2
            id="certificates-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Certificates &amp; Credentials
          </h2>
        </div>
        <Badge
          variant="outline"
          size="sm"
          className="text-[10px] font-mono text-muted-foreground border-border/80"
        >
          {visibleCertificates.length}{" "}
          {visibleCertificates.length === 1 ? "credential" : "credentials"}
        </Badge>
      </div>

      {/* Professional Credential Cards */}
      <div className="space-y-3">
        {visibleCertificates.map((cert) => {
          const hasImage = Boolean(cert.image_url);
          const hasPdf = Boolean(cert.pdf_url);

          return (
            <div
              key={cert.id}
              className={cn(
                "group rounded-xl border p-4 sm:p-4.5 transition-all duration-200 relative overflow-hidden space-y-3 shadow-xs",
                themeConfig.featuredCard,
                cert.is_featured && "ring-1 ring-brand/30"
              )}
            >
              {/* Top Row: Issuer Logo/Badge + Certificate Title & Dates */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Issuer Emblem or Avatar */}
                  <div
                    onClick={() => setSelectedCertificate(cert)}
                    className="w-10 h-10 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group-hover:opacity-90 transition-opacity"
                  >
                    {hasImage ? (
                      <img
                        src={cert.image_url!}
                        alt={cert.issuer}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-brand" />
                    )}
                  </div>

                  {/* Name & Issuer Metadata */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cert.is_featured && (
                        <Badge
                          variant="brand"
                          size="sm"
                          className="text-[9px] font-mono px-1 py-0 gap-0.5 bg-brand text-brand-foreground"
                        >
                          <Sparkles className="h-2 w-2" />
                          Featured
                        </Badge>
                      )}
                      <h3
                        onClick={() => setSelectedCertificate(cert)}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer leading-snug"
                      >
                        {cert.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground/80 flex items-center gap-1">
                        <Building2 className="h-3 w-3 opacity-70" />
                        <span>{cert.issuer}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] flex items-center gap-1">
                        <Calendar className="h-3 w-3 opacity-60" />
                        <span>Issued {cert.issue_date}</span>
                      </span>
                      {cert.expiration_date && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            Expires {cert.expiration_date}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional Media Indicator Badge */}
                {hasPdf && (
                  <Badge
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-[9px] font-mono gap-1 text-red-500 border-red-500/30 bg-red-500/5 px-1.5 py-0.5"
                  >
                    <FileText className="h-2.5 w-2.5" />
                    <span>PDF</span>
                  </Badge>
                )}
              </div>

              {/* Description preview if present */}
              {cert.description && (
                <p
                  onClick={() => setSelectedCertificate(cert)}
                  className="text-xs text-muted-foreground line-clamp-2 leading-relaxed cursor-pointer pl-13"
                >
                  {cert.description}
                </p>
              )}

              {/* Footer Metadata & Verification Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px]">
                {cert.credential_id ? (
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
                    <FileCheck2 className="h-3 w-3 opacity-70 text-brand" />
                    <span>ID: {cert.credential_id}</span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:text-brand-hover hover:underline transition-colors p-1"
                      aria-label={`Verify credential for ${cert.name}`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify Credential</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedCertificate(cert)}
                    className="text-[11px] h-6 px-2 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <span>View</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        certificate={selectedCertificate}
        open={Boolean(selectedCertificate)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCertificate(null);
        }}
      />
    </section>
  );
}
