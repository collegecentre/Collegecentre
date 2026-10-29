"use client";

import * as React from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export interface FinalCTAProps {
  onOpenClaim: (handle?: string) => void;
}

export function FinalCTA({ onOpenClaim }: FinalCTAProps) {
  const [handle, setHandle] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenClaim(handle || "yourname");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pt-16 pb-8 border-t border-border/70">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-14 text-center space-y-6 shadow-card relative overflow-hidden">
        {/* Subtle background glow/radial accent without generic gradient slop */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-mono font-medium text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          Join Thousands of Student Builders
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <Typography
            variant="h2"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Claim your student handle before it&apos;s taken.
          </Typography>

          <Typography
            variant="body"
            className="text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            Your college accomplishments deserve more than a PDF buried in an inbox. Create your verified student showcase in two minutes.
          </Typography>
        </div>

        {/* Claim Bar */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 rounded-lg border border-border bg-background p-1.5 shadow-subtle focus-within:ring-2 focus-within:ring-ring transition-all"
        >
          <div className="flex items-center px-3 py-2 w-full font-mono text-xs sm:text-sm text-foreground">
            <span className="text-muted-foreground select-none">collegecentre.id/</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              placeholder="yourname"
              className="w-full bg-transparent outline-none pl-0.5 font-semibold text-foreground placeholder:text-muted-foreground/40 text-xs sm:text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="brand"
            size="sm"
            className="w-full sm:w-auto shrink-0 text-xs font-semibold px-4 py-2 group shadow-subtle"
            rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
          >
            Reserve Handle
          </Button>
        </form>

        {/* Reassurance items */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Free Forever
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Zero Paywalls or Ads
          </span>
          <span>Fast Global CDN</span>
        </div>
      </div>
    </section>
  );
}
