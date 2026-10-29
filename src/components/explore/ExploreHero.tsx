"use client";

import * as React from "react";
import { Search, X, Sparkles, SlidersHorizontal, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExploreHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuickTag: (tag: string) => void;
  selectedTag?: string;
  totalStudentsCount: number;
  totalProjectsCount: number;
}

const QUICK_TAGS = [
  "Next.js",
  "Rust",
  "PyTorch",
  "Distributed Systems",
  "ROS2",
  "Design Systems",
  "CUDA",
  "TypeScript",
];

export function ExploreHero({
  searchQuery,
  onSearchChange,
  onSelectQuickTag,
  selectedTag,
  totalStudentsCount,
  totalProjectsCount,
}: ExploreHeroProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: pressing '/' focuses search input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative py-8 sm:py-12 border-b border-border/50 bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
        {/* Top Network Identity Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-medium">
          <Compass className="h-3.5 w-3.5" />
          <span>The CollegeCentre Network</span>
          <span>•</span>
          <span className="text-foreground/80 font-sans">
            {totalStudentsCount} Builders • {totalProjectsCount} Technical Artifacts
          </span>
        </div>

        {/* Hero Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Discover What Exceptional Students Are Building
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Search verified student portfolios, research preprints, and open source projects across engineering institutions.
          </p>
        </div>

        {/* Global Search Input Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
              <Search className="h-4 w-4" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student name, college, skill, research, or project..."
              className="w-full h-12 pl-10 pr-20 rounded-xl bg-card border border-border shadow-subtle text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all font-sans"
            />

            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/60 text-[10px] font-mono text-muted-foreground shadow-xs">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Quick Trending Skills Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-mono text-muted-foreground mr-1">Trending:</span>
          {QUICK_TAGS.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectQuickTag(tag)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-150 select-none",
                  isSelected
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
