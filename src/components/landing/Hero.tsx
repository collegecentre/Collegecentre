"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export interface HeroProps {
  onOpenClaim: (handle?: string) => void;
  onOpenExplore: () => void;
}

export function Hero({ onOpenClaim, onOpenExplore }: HeroProps) {
  const [handleInput, setHandleInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenClaim(handleInput || "yourname");
  };

  return (
    <section id="overview" className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Hero Headline */}
      <div className="space-y-4">
        <Typography
          variant="display"
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08]"
        >
          Your college life. <br className="hidden sm:inline" />
          <span className="text-foreground">One link.</span>
        </Typography>

        <Typography
          variant="lead"
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          One link for everything you build, achieve, and share. Replace generic bio-links with a verified student showcase of your projects, hackathons, research, and certificates.
        </Typography>
      </div>

      {/* Interactive Handle Claim Form */}
      <div className="max-w-md mx-auto pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-2 rounded-lg border border-border/80 bg-card p-1.5 shadow-card focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-ring transition-all"
        >
          <div className="flex items-center px-3 py-2 w-full font-mono text-xs sm:text-sm text-foreground">
            <span className="text-muted-foreground select-none">collegecentre.in/</span>
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              placeholder="yourname"
              className="w-full bg-transparent outline-none pl-0.5 font-semibold text-foreground placeholder:text-muted-foreground/40 text-xs sm:text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="sm"
            className="w-full sm:w-auto shrink-0 text-xs font-semibold px-4 py-2 group shadow-subtle"
            rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
          >
            Claim Link
          </Button>
        </form>

        <p className="mt-2.5 text-[11px] text-muted-foreground flex items-center justify-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3 w-3" /> 100% Free Forever
          </span>
          <span>•</span>
          <span>Free core features</span>
          <span>•</span>
          <span>No credit card required</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          size="default"
          variant="brand"
          onClick={() => onOpenClaim(handleInput)}
          className="text-xs sm:text-sm shadow-subtle"
        >
          Create your CollegeCentre
        </Button>

        <Button
          size="default"
          variant="outline"
          onClick={onOpenExplore}
          leftIcon={<Compass className="h-4 w-4" />}
          className="text-xs sm:text-sm"
        >
          Explore profiles
        </Button>
      </div>

      {/* Subtle University Builder Trust Line */}
      <div className="pt-6 border-t border-border/60 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          Verified Student Profiles
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/80">
          Stanford • MIT • IITs • Berkeley • ETH • 250+ campuses
        </span>
      </div>
    </section>
  );
}
