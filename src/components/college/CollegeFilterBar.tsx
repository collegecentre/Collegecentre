"use client";

import * as React from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CollegeDirectoryFilters } from "@/types";

interface CollegeFilterBarProps {
  filters: CollegeDirectoryFilters;
  onFilterChange: (filters: CollegeDirectoryFilters) => void;
  availableCourses: string[];
  availableYears: number[];
  availableSkills: string[];
  totalMatches: number;
}

export function CollegeFilterBar({
  filters,
  onFilterChange,
  availableCourses,
  availableYears,
  availableSkills,
  totalMatches,
}: CollegeFilterBarProps) {
  const [searchInput, setSearchInput] = React.useState(filters.query || "");

  // Debounced search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== (filters.query || "")) {
        onFilterChange({ ...filters, query: searchInput || undefined });
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput, filters, onFilterChange]);

  const activeFiltersCount =
    (filters.query ? 1 : 0) +
    (filters.course && filters.course !== "all" ? 1 : 0) +
    (filters.graduationYear && filters.graduationYear !== "all" ? 1 : 0) +
    (filters.skill && filters.skill !== "all" ? 1 : 0);

  const handleReset = () => {
    setSearchInput("");
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search students by name, handle, or bio..."
            className="pl-9 pr-8 h-10 bg-card border-border/80 focus-visible:ring-primary/40 rounded-xl"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Course Dropdown */}
          {availableCourses.length > 0 && (
            <select
              value={filters.course || "all"}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  course: e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className="h-10 px-3 text-xs font-mono rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Graduation Year Dropdown */}
          {availableYears.length > 0 && (
            <select
              value={filters.graduationYear || "all"}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  graduationYear: e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className="h-10 px-3 text-xs font-mono rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Class Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Class of {y}
                </option>
              ))}
            </select>
          )}

          {/* Skills Dropdown */}
          {availableSkills.length > 0 && (
            <select
              value={filters.skill || "all"}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  skill: e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className="h-10 px-3 text-xs font-mono rounded-xl bg-card border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Skills</option>
              {availableSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-10 font-mono text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset ({activeFiltersCount})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
        <span>
          Showing {totalMatches} student{totalMatches === 1 ? "" : "s"} in directory
        </span>
        {activeFiltersCount > 0 && (
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            Filtered Directory
          </Badge>
        )}
      </div>
    </div>
  );
}
