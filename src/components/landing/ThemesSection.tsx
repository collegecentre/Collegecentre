"use client";

import * as React from "react";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

const themes = [
  {
    id: "obsidian",
    name: "Obsidian Minimal",
    tagline: "Minimal dark mode with clean hairline borders",
    audience: "Systems engineers, backend builders & designers",
    accentColor: "bg-zinc-100 text-zinc-950",
    previewBorder: "border-zinc-800 bg-zinc-950 text-zinc-100",
    avatarBg: "bg-zinc-800 text-zinc-100",
    tags: ["Rust", "Distributed Systems", "C++"],
    font: "Sans & Monospace",
  },
  {
    id: "academic",
    name: "Academic Editorial",
    tagline: "Warm parchment tones with timeless serif typography",
    audience: "Researchers, preprints, fellows & humanities",
    accentColor: "bg-amber-900 text-amber-50 dark:bg-amber-200 dark:text-amber-950",
    previewBorder: "border-amber-900/20 bg-amber-50/50 dark:bg-zinc-900 text-amber-950 dark:text-zinc-100",
    avatarBg: "bg-amber-200 text-amber-950",
    tags: ["NeurIPS", "arXiv:2609", "ACM Fellow"],
    font: "Editorial Serif",
  },
  {
    id: "cobalt",
    name: "Electric Cobalt",
    tagline: "Modern high-contrast theme with electric blue accents",
    audience: "Student founders, hackathon winners & product leads",
    accentColor: "bg-blue-600 text-white",
    previewBorder: "border-blue-500/30 bg-card text-foreground",
    avatarBg: "bg-blue-600 text-white",
    tags: ["Product", "React 19", "HackMIT '26"],
    font: "Neo-Grotesque",
  },
  {
    id: "terminal",
    name: "Midnight Terminal",
    tagline: "Console aesthetic with syntax markers and glowing status",
    audience: "Hardware hackers, robotics & security researchers",
    accentColor: "bg-emerald-500 text-zinc-950",
    previewBorder: "border-emerald-500/30 bg-black text-emerald-400 font-mono",
    avatarBg: "bg-zinc-900 text-emerald-400 border border-emerald-500/40",
    tags: ["ROS2", "Ghidra", "KiCad PCB"],
    font: "Pure Monospace",
  },
];

export function ThemesSection() {
  const [selectedTheme, setSelectedTheme] = React.useState<string>("obsidian");

  return (
    <section id="themes" className="space-y-10 max-w-5xl mx-auto px-4 pt-16 border-t border-border/70">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Typography variant="eyebrow" className="text-brand">
          Personal Expression
        </Typography>
        <Typography variant="h2" as="h2" className="text-3xl sm:text-4xl font-bold tracking-tight">
          Crafted themes for every discipline.
        </Typography>
        <Typography variant="body" className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Switch aesthetic in one click. Whether you&apos;re submitting a research fellowship or sharing your latest hardware build with YC founders.
        </Typography>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;

          return (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "ring-2 ring-brand border-brand shadow-card"
                  : "border-border bg-card hover:border-foreground/30 shadow-subtle"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{theme.name}</span>
                  {isSelected && (
                    <Badge variant="brand" size="sm" dot>Active</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {theme.tagline}
                </p>

                {/* Visual Theme Card Mockup */}
                <div className={`rounded-lg border p-3.5 space-y-2.5 text-xs transition-colors ${theme.previewBorder}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${theme.avatarBg}`}>
                      AR
                    </div>
                    <div>
                      <div className="font-semibold text-[11px] leading-tight">Alex Rivera</div>
                      <div className="text-[9px] opacity-70">Berkeley &apos;26</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {theme.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[9px] border border-current/20 bg-current/5 opacity-90 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-mono text-[10px]">{theme.font}</span>
                <span className="text-foreground font-medium text-[10px]">
                  {isSelected ? "Selected" : "Click to test"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
