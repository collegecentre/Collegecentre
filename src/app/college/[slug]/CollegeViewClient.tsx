"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  FolderGit2,
  Trophy,
  Calendar,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Award,
  Search,
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CollegeHeader } from "@/components/college/CollegeHeader";
import { CollegeFilterBar } from "@/components/college/CollegeFilterBar";
import { CollegeEventsSection } from "@/components/college/CollegeEventsSection";
import { CollegeClubsSection } from "@/components/college/CollegeClubsSection";
import { CollegeAdminModal } from "@/components/college/CollegeAdminModal";
import { RequestVerificationModal } from "@/components/college/RequestVerificationModal";
import { StudentCard } from "@/components/explore/StudentCard";
import { ExploreProjectCard } from "@/components/explore/ExploreProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCollegeProfileData } from "@/lib/college-service";
import type {
  CollegeProfileData,
  CollegeDirectoryFilters,
  College,
} from "@/types";
import { cn } from "@/lib/utils";

interface CollegeViewClientProps {
  slug: string;
  initialData: CollegeProfileData;
}

type CollegeTab = "students" | "projects" | "achievements" | "events" | "clubs";

export function CollegeViewClient({ slug, initialData }: CollegeViewClientProps) {
  const { user } = useAuth();
  const [data, setData] = React.useState<CollegeProfileData>(initialData);
  const [activeTab, setActiveTab] = React.useState<CollegeTab>("students");
  const [filters, setFilters] = React.useState<CollegeDirectoryFilters>({});
  const [isAdminModalOpen, setIsAdminModalOpen] = React.useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = React.useState(false);

  // Refresh directory whenever filters change
  const handleFilterChange = React.useCallback(
    async (newFilters: CollegeDirectoryFilters) => {
      setFilters(newFilters);
      const updated = await getCollegeProfileData(slug, newFilters, user?.id);
      if (updated) {
        setData(updated);
      }
    },
    [slug, user?.id]
  );

  const handleCollegeUpdated = (updatedCollege: College) => {
    setData((prev) => ({
      ...prev,
      college: updatedCollege,
    }));
  };

  const handleVerificationSubmitted = async () => {
    const updated = await getCollegeProfileData(slug, filters, user?.id);
    if (updated) {
      setData(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Global Landing Header with Navigation */}
      <Header />

      <main className="flex-1 pb-24 pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Network Explore</span>
            </Link>

            <div className="flex items-center gap-1.5 truncate">
              <span>collegecentre.in</span>
              <span>/</span>
              <span>college</span>
              <span>/</span>
              <span className="text-foreground font-semibold">{data.college.slug}</span>
            </div>
          </div>

          {/* 1. College Hero & Profile Header */}
          <CollegeHeader
            college={data.college}
            stats={data.stats}
            currentUserMembership={data.currentUserMembership}
            onOpenAdminSettings={() => setIsAdminModalOpen(true)}
            onRequestVerification={() => setIsVerificationModalOpen(true)}
          />

          {/* 2. Campus Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
            <button
              onClick={() => setActiveTab("students")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0",
                activeTab === "students"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Student Builders</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeTab === "students"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {data.stats.totalStudents}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0",
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Campus Projects</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeTab === "projects"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {data.stats.totalProjects}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("achievements")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0",
                activeTab === "achievements"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Honors & Awards</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeTab === "achievements"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {data.stats.totalAchievements}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0",
                activeTab === "events"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Campus Events</span>
              <Badge variant="outline" size="sm" className="font-mono text-[9px] px-1 py-0">
                New
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("clubs")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-medium transition-all shrink-0",
                activeTab === "clubs"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Guilds</span>
            </button>
          </div>

          {/* 3. Tab Contents */}
          {activeTab === "students" && (
            <div className="space-y-6">
              {/* Directory Filter Bar */}
              <CollegeFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                availableCourses={data.availableCourses}
                availableYears={data.availableYears}
                availableSkills={data.availableSkills}
                totalMatches={data.students.length}
              />

              {/* Student Cards Grid */}
              {data.students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border/80 rounded-3xl p-8 space-y-3">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <h3 className="text-base font-semibold text-foreground">No Students Found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    No discoverable students from this campus matched your filter criteria. Try clearing some filters.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFilterChange({})}
                    className="font-mono text-xs mt-2"
                  >
                    Reset Directory Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Campus Engineering Projects</h2>
                  <p className="text-xs text-muted-foreground">
                    Public technical projects and open-source software authored by students from {data.college.name}.
                  </p>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-xs">
                  {data.projects.length} Project{data.projects.length === 1 ? "" : "s"}
                </Badge>
              </div>

              {data.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.projects.map((project) => (
                    <ExploreProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border/80 rounded-3xl p-8 space-y-3">
                  <FolderGit2 className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <h3 className="text-base font-semibold text-foreground">No Public Projects Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Students from this campus haven't published any public project showcases yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Honors, Awards & Hackathon Wins</h2>
                  <p className="text-xs text-muted-foreground">
                    Verified achievements and technical competitions won by {data.college.name} students.
                  </p>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-xs">
                  {data.achievements.length} Verified Honor{data.achievements.length === 1 ? "" : "s"}
                </Badge>
              </div>

              {data.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="rounded-2xl border border-border/80 bg-card p-5 shadow-card hover:border-primary/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={ach.is_featured ? "brand" : "secondary"}
                          size="sm"
                          className="capitalize font-mono text-[10px]"
                        >
                          {ach.type}
                        </Badge>
                        {ach.date && (
                          <span className="text-xs font-mono text-muted-foreground">
                            {ach.date}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-foreground">{ach.title}</h3>
                        {ach.organization && (
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            {ach.organization}
                          </p>
                        )}
                      </div>

                      {ach.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {ach.description}
                        </p>
                      )}

                      {ach.verification_url && (
                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <a
                            href={ach.verification_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border/80 rounded-3xl p-8 space-y-3">
                  <Trophy className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <h3 className="text-base font-semibold text-foreground">No Public Honors Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Verified student awards and hackathon trophies from this campus will be showcased here.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <CollegeEventsSection events={data.events} collegeName={data.college.name} />
          )}

          {activeTab === "clubs" && (
            <CollegeClubsSection clubs={data.clubs} collegeName={data.college.name} />
          )}
        </div>
      </main>

      {/* Global Minimal Footer */}
      <Footer />

      {/* Admin Modals */}
      {user && (
        <>
          <CollegeAdminModal
            college={data.college}
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            adminUserId={user.id}
            onCollegeUpdated={handleCollegeUpdated}
            onRequestVerification={() => setIsVerificationModalOpen(true)}
          />

          <RequestVerificationModal
            college={data.college}
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            adminUserId={user.id}
            onVerificationSubmitted={handleVerificationSubmitted}
          />
        </>
      )}
    </div>
  );
}
