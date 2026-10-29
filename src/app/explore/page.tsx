"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  Users,
  Code2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExploreHero } from "@/components/explore/ExploreHero";
import { ExploreFilterBar } from "@/components/explore/ExploreFilterBar";
import { StudentCard } from "@/components/explore/StudentCard";
import { ExploreProjectCard } from "@/components/explore/ExploreProjectCard";
import { ExploreEmptyState } from "@/components/explore/ExploreEmptyState";
import { getExploreData } from "@/lib/explore-service";
import type { ExploreFilters, ExploreResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  const [filters, setFilters] = React.useState<ExploreFilters>({
    query: "",
    section: "all",
  });
  const [activeView, setActiveView] = React.useState<"students" | "projects">("students");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(9);
  const [isLoading, setIsLoading] = React.useState(true);
  const [exploreData, setExploreData] = React.useState<ExploreResponse>({
    students: [],
    projects: [],
    totalStudents: 0,
    totalProjects: 0,
    page: 1,
    limit: 9,
    hasMore: false,
    availableColleges: [],
    availableSkills: [],
    availableYears: [],
    availableCategories: [],
  });

  // Fetch explore data whenever filters or page changes
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getExploreData(filters, currentPage, pageSize);
      setExploreData(res);
    } catch (err) {
      console.error("Failed to load explore directory:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter updates
  const handleFilterChange = (updates: Partial<ExploreFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1); // reset to page 1 on filter modification
  };

  const handleClearFilters = () => {
    setFilters({ query: "", section: "all" });
    setCurrentPage(1);
  };

  const handleQuickTagSelect = (tag: string) => {
    if (filters.skill?.toLowerCase() === tag.toLowerCase()) {
      handleFilterChange({ skill: undefined });
    } else {
      handleFilterChange({ skill: tag });
    }
  };

  // Switch view tab
  const handleViewChange = (view: "students" | "projects") => {
    setActiveView(view);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    (activeView === "students" ? exploreData.totalStudents : exploreData.totalProjects) / pageSize
  );

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
                CC
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  CollegeCentre
                </span>
                <span className="hidden sm:inline-flex rounded-full bg-brand/10 border border-brand/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-brand">
                  Explore
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              <Link
                href="/explore"
                className="px-2.5 py-1 rounded-md text-foreground bg-muted font-semibold"
              >
                Directory
              </Link>
              <Link
                href="/"
                className="px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Header Utilities: Theme toggle, Sign In / Dashboard CTA */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                setTheme(
                  theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
                )
              }
              aria-label="Toggle color theme"
              className="h-8 w-8"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : theme === "system" ? (
                <Laptop className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </Button>

            {user ? (
              <Button asChild size="xs" className="h-8 px-3 text-xs gap-1.5 font-medium">
                <Link href="/dashboard">
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button asChild variant="ghost" size="xs" className="h-8 px-2.5 text-xs">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="xs" className="h-8 px-3 text-xs gap-1 font-semibold">
                  <Link href="/signup">
                    <span>Create Profile</span>
                    <Sparkles className="h-3 w-3 text-brand" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Search & Overview Header */}
      <ExploreHero
        searchQuery={filters.query || ""}
        onSearchChange={(q) => handleFilterChange({ query: q })}
        onSelectQuickTag={handleQuickTagSelect}
        selectedTag={filters.skill}
        totalStudentsCount={exploreData.totalStudents}
        totalProjectsCount={exploreData.totalProjects}
      />

      {/* 3. Main Explore Directory Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Discovery Filter & View Selector */}
        <ExploreFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          availableColleges={exploreData.availableColleges}
          availableSkills={exploreData.availableSkills}
          availableYears={exploreData.availableYears}
          availableCategories={exploreData.availableCategories}
          activeView={activeView}
          onViewChange={handleViewChange}
        />

        {/* Results Metadata Summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-2">
            <span>
              {activeView === "students" ? (
                <>
                  Showing{" "}
                  <strong className="text-foreground font-mono">
                    {exploreData.students.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-foreground font-mono">
                    {exploreData.totalStudents}
                  </strong>{" "}
                  builders
                </>
              ) : (
                <>
                  Showing{" "}
                  <strong className="text-foreground font-mono">
                    {exploreData.projects.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-foreground font-mono">
                    {exploreData.totalProjects}
                  </strong>{" "}
                  technical projects
                </>
              )}
            </span>

            {filters.query && (
              <Badge variant="outline" size="sm" className="font-mono text-[10px] py-0">
                &ldquo;{filters.query}&rdquo;
              </Badge>
            )}
          </div>

          <div className="text-[11px] font-mono text-muted-foreground/80 hidden sm:inline-block">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </div>
        </div>

        {/* Content Grids */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-64 rounded-2xl border border-border bg-card/60 animate-pulse"
              />
            ))}
          </div>
        ) : activeView === "students" ? (
          exploreData.students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exploreData.students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <ExploreEmptyState
              searchQuery={filters.query}
              onResetFilters={handleClearFilters}
            />
          )
        ) : exploreData.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exploreData.projects.map((project) => (
              <ExploreProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ExploreEmptyState
            searchQuery={filters.query}
            onResetFilters={handleClearFilters}
          />
        )}

        {/* 4. Pagination Navigation Bar */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="text-xs gap-1.5 h-8 font-medium"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-1 font-mono text-xs">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "h-7 w-7 rounded-lg text-xs font-medium transition-all select-none",
                      isCurrent
                        ? "bg-foreground text-background font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs gap-1.5 h-8 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </main>

      {/* 5. Minimal Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground space-y-2">
        <p className="font-mono text-[11px]">
          CollegeCentre 2.0 • The verified student network for builders, engineers &amp; researchers.
        </p>
        <div>
          <Link
            href="/signup"
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            Create your free student showcase →
          </Link>
        </div>
      </footer>
    </div>
  );
}
