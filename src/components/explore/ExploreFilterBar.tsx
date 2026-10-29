"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  X,
  GraduationCap,
  Sparkles,
  Layers,
  Users,
  Code2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExploreSection, ExploreFilters } from "@/types";
import { cn } from "@/lib/utils";

interface ExploreFilterBarProps {
  filters: ExploreFilters;
  onFilterChange: (updates: Partial<ExploreFilters>) => void;
  onClearFilters: () => void;
  availableColleges: string[];
  availableSkills: string[];
  availableYears: number[];
  availableCategories: string[];
  activeView: "students" | "projects";
  onViewChange: (view: "students" | "projects") => void;
}

const SECTIONS: Array<{ id: ExploreSection; label: string; icon?: React.ComponentType<{ className?: string }> }> = [
  { id: "all", label: "All Network", icon: Layers },
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "popular", label: "Popular", icon: Users },
  { id: "recent", label: "Newest", icon: Calendar },
  { id: "projects", label: "Projects", icon: Code2 },
];

export function ExploreFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  availableColleges,
  availableSkills,
  availableYears,
  availableCategories,
  activeView,
  onViewChange,
}: ExploreFilterBarProps) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Count active filters
  const activeFilterCount = [
    Boolean(filters.college),
    Boolean(filters.course),
    Boolean(filters.graduationYear),
    Boolean(filters.category && filters.category !== "all"),
    Boolean(filters.skill),
    Boolean(filters.location),
  ].filter(Boolean).length;

  return (
    <div className="space-y-3.5">
      {/* 1. Main Bar: Section Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
        {/* Discovery Sections */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = (filters.section || "all") === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  if (sec.id === "projects") {
                    onViewChange("projects");
                  }
                  onFilterChange({ section: sec.id });
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 select-none",
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher & Filter Toggle Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Students vs Projects Segmented Toggle */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-muted border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => onViewChange("students")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-all",
                activeView === "students"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Students
            </button>
            <button
              type="button"
              onClick={() => onViewChange("projects")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-all",
                activeView === "projects"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Projects
            </button>
          </div>

          {/* Toggle Filters Drawer/Panel */}
          <Button
            variant={activeFilterCount > 0 ? "outline" : "ghost"}
            size="xs"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "h-8 gap-1.5 text-xs font-medium",
              activeFilterCount > 0 && "border-primary/50 text-primary"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="brand" size="sm" className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={cn("h-3 w-3 transition-transform", filtersOpen && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* 2. Expanded Filter Dropdowns Panel */}
      {filtersOpen && (
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs animate-in fade-in-50 slide-in-from-top-1 duration-150 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* College Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider block">
                College / Institution
              </label>
              <select
                value={filters.college || ""}
                onChange={(e) => onFilterChange({ college: e.target.value })}
                className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              >
                <option value="">All Institutions</option>
                {availableColleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Category / Discipline */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider block">
                Discipline / Category
              </label>
              <select
                value={filters.category || "all"}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans capitalize"
              >
                <option value="all">All Disciplines</option>
                <option value="engineering">Engineering</option>
                <option value="research">Research</option>
                <option value="design">Design &amp; UI</option>
                <option value="product">Product</option>
                <option value="writing">Writing &amp; Tech</option>
              </select>
            </div>

            {/* Graduation Year */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider block">
                Graduation Year
              </label>
              <select
                value={filters.graduationYear || ""}
                onChange={(e) =>
                  onFilterChange({
                    graduationYear: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              >
                <option value="">All Graduation Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Skill Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground font-semibold uppercase tracking-wider block">
                Primary Skill
              </label>
              <select
                value={filters.skill || ""}
                onChange={(e) => onFilterChange({ skill: e.target.value })}
                className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              >
                <option value="">All Skills</option>
                {availableSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-muted-foreground">Active:</span>

                {filters.college && (
                  <Badge variant="outline" size="sm" className="gap-1 text-[11px] py-0.5">
                    <span>{filters.college}</span>
                    <button onClick={() => onFilterChange({ college: undefined })} aria-label="Remove college filter">
                      <X className="h-3 w-3 hover:text-foreground" />
                    </button>
                  </Badge>
                )}

                {filters.category && filters.category !== "all" && (
                  <Badge variant="outline" size="sm" className="gap-1 text-[11px] py-0.5 capitalize">
                    <span>{filters.category}</span>
                    <button onClick={() => onFilterChange({ category: undefined })} aria-label="Remove category filter">
                      <X className="h-3 w-3 hover:text-foreground" />
                    </button>
                  </Badge>
                )}

                {filters.graduationYear && (
                  <Badge variant="outline" size="sm" className="gap-1 text-[11px] py-0.5">
                    <span>&apos;{String(filters.graduationYear).slice(-2)}</span>
                    <button onClick={() => onFilterChange({ graduationYear: undefined })} aria-label="Remove graduation year filter">
                      <X className="h-3 w-3 hover:text-foreground" />
                    </button>
                  </Badge>
                )}

                {filters.skill && (
                  <Badge variant="outline" size="sm" className="gap-1 text-[11px] py-0.5">
                    <span>{filters.skill}</span>
                    <button onClick={() => onFilterChange({ skill: undefined })} aria-label="Remove skill filter">
                      <X className="h-3 w-3 hover:text-foreground" />
                    </button>
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="xs"
                onClick={onClearFilters}
                className="text-xs h-6 px-2 text-muted-foreground hover:text-destructive"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
