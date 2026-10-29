"use client";

import * as React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExploreEmptyStateProps {
  onResetFilters: () => void;
  searchQuery?: string;
}

export function ExploreEmptyState({
  onResetFilters,
  searchQuery,
}: ExploreEmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 max-w-lg mx-auto space-y-4">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
        <SearchX className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground tracking-tight">
          No matches found
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {searchQuery
            ? `No discoverable student profiles or projects matched "${searchQuery}".`
            : "No student portfolios matched your selected combination of filters."}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onResetFilters}
        className="text-xs gap-1.5 h-8 font-medium"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset Search &amp; Filters</span>
      </Button>
    </div>
  );
}
