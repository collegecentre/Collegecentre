import * as React from "react";
import { GitBranch, Layers, Sparkles, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface FeaturedProjectsPlaceholderProps {
  themeConfig: ProfileThemeConfig;
  studentName?: string | null;
}

export function FeaturedProjectsPlaceholder({
  themeConfig,
  studentName: _studentName,
}: FeaturedProjectsPlaceholderProps) {
  return (
    <section aria-labelledby="featured-projects-heading" className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2
            id="featured-projects-heading"
            className={cn("tracking-wider", themeConfig.sectionTitle)}
          >
            Featured Projects &amp; Work
          </h2>
        </div>
        <Badge
          variant="outline"
          size="sm"
          className="text-[10px] font-mono text-muted-foreground border-border/80"
        >
          Phase 4 Ready
        </Badge>
      </div>

      {/* Future-Ready Showcase Container */}
      <div
        className={cn(
          "rounded-xl border p-5 sm:p-6 transition-all duration-200 relative overflow-hidden",
          themeConfig.featuredCard
        )}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Pinned Student Repositories &amp; Artifacts
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Highlight your most ambitious technical projects, research papers, and live deployments.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
              <Sparkles className="h-3 w-3 text-brand" />
              <span>Coming in Phase 4</span>
            </div>
          </div>

          {/* Sample Architecture Preview of future project cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-80 pointer-events-none select-none">
            <div className="p-3.5 rounded-lg border border-border/60 bg-background/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs tracking-tight text-foreground truncate">
                  distributed-kv-engine
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <GitBranch className="h-3 w-3" /> Raft
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                Log-structured merge tree with distributed consensus and sub-millisecond p99 latency.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                  Rust
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                  gRPC
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-border/60 bg-background/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs tracking-tight text-foreground truncate">
                  agentic-compiler-pass
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                  <Layers className="h-3 w-3" /> LLVM
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                Automated vectorization optimization pass using graph neural network cost models.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                  C++20
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                  MLIR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
