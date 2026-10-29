"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, UserCheck, Palette, Share2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export interface HowItWorksProps {
  onOpenClaim: () => void;
}

export function HowItWorks({ onOpenClaim }: HowItWorksProps) {
  const steps = [
    {
      step: "01",
      title: "Create & Claim",
      subtitle: "30 seconds setup",
      description:
        "Reserve your custom vanity handle (e.g. collegecentre.id/alex) and connect your university email or GitHub profile.",
      icon: <UserCheck className="h-5 w-5 text-brand" />,
      features: ["Custom vanity URL", ".edu institutional verification", "Instant student onboarding"],
    },
    {
      step: "02",
      title: "Customize & Pin",
      subtitle: "Effortless curation",
      description:
        "Select your visual aesthetic, import your top GitHub repos, highlight hackathon trophies, and paste research links.",
      icon: <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      features: ["4 aesthetic profile themes", "One-click repo sync", "Drag-and-drop hierarchy"],
    },
    {
      step: "03",
      title: "Share Everywhere",
      subtitle: "The universal student link",
      description:
        "Put your link at the top of your one-page resume, GitHub profile README, LinkedIn bio, and job applications.",
      icon: <Share2 className="h-5 w-5 text-foreground" />,
      features: ["Mobile-first responsive design", "Fast global CDN", "Zero paywalls or ads"],
    },
  ];

  return (
    <section className="space-y-12 max-w-5xl mx-auto px-4 pt-16 border-t border-border/70">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Typography variant="eyebrow" className="text-brand">
          Workflow
        </Typography>
        <Typography variant="h2" as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
          How it works
        </Typography>
        <Typography variant="body" className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          From zero to a published student identity showcase in under two minutes.
        </Typography>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 shadow-subtle hover:border-foreground/30 hover:shadow-card transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border border-border/80">
                  {item.icon}
                </div>
                <span className="font-mono text-xs font-bold text-muted-foreground/60 tracking-wider">
                  STEP {item.step}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-brand font-medium block">
                  {item.subtitle}
                </span>
                <Typography variant="h4" className="text-lg font-semibold text-foreground">
                  {item.title}
                </Typography>
                <Typography variant="caption" className="text-xs text-muted-foreground leading-relaxed pt-1 block">
                  {item.description}
                </Typography>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2">
              {item.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-foreground/85">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Micro CTA */}
      <div className="text-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenClaim}
          className="text-xs group"
          rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
        >
          Claim your student handle now
        </Button>
      </div>
    </section>
  );
}
