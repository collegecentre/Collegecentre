"use client";

import * as React from "react";
import {
  MapPin,
  Globe,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  Users,
  FolderGit2,
  Trophy,
  Compass,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { College, CollegeMember } from "@/types";
import { cn } from "@/lib/utils";

interface CollegeHeaderProps {
  college: College;
  stats: {
    totalStudents: number;
    totalProjects: number;
    totalAchievements: number;
    verifiedStudents: number;
  };
  currentUserMembership?: CollegeMember | null;
  onOpenAdminSettings?: () => void;
  onRequestVerification?: () => void;
}

export function CollegeHeader({
  college,
  stats,
  currentUserMembership,
  onOpenAdminSettings,
  onRequestVerification,
}: CollegeHeaderProps) {
  const isCollegeAdminOrOwner =
    currentUserMembership?.role === "owner" || currentUserMembership?.role === "admin";

  const initials = (college.short_name || college.name || "CC")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();

  const isVerified = college.verification_status === "verified";
  const isPending = college.verification_status === "pending";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card">
      {/* 1. Campus Banner Image with Ambient Overlay */}
      <div className="relative h-44 sm:h-64 w-full bg-muted/60 overflow-hidden">
        {college.banner_url ? (
          <img
            src={college.banner_url}
            alt={`${college.name} campus banner`}
            className="h-full w-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/15 via-background to-muted/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isVerified ? (
            <Badge
              variant="success"
              size="sm"
              className="font-mono text-xs shadow-md backdrop-blur-md bg-success/90 text-white gap-1.5 px-3 py-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Institution</span>
              {college.verified_domain && (
                <span className="opacity-80 font-normal">({college.verified_domain})</span>
              )}
            </Badge>
          ) : isPending ? (
            <Badge
              variant="warning"
              size="sm"
              className="font-mono text-xs shadow-md backdrop-blur-md gap-1.5 px-3 py-1"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Verification Pending</span>
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              size="sm"
              className="font-mono text-xs shadow-md backdrop-blur-md bg-background/80 border border-border/60 gap-1.5 px-3 py-1"
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>Community Listed</span>
            </Badge>
          )}

          {isCollegeAdminOrOwner && onOpenAdminSettings && (
            <Button
              size="xs"
              variant="secondary"
              onClick={onOpenAdminSettings}
              className="font-mono text-xs h-7 gap-1 shadow-md backdrop-blur-md bg-background/80"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>Campus Admin</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Emblem & Identity Details */}
      <div className="relative px-6 sm:px-10 pb-8 pt-0 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Campus Logo Emblem */}
            <Avatar
              size="2xl"
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl ring-4 ring-card bg-card shadow-modal shrink-0 border border-border/80"
            >
              {college.logo_url && (
                <AvatarImage
                  src={college.logo_url}
                  alt={college.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="rounded-2xl text-xl sm:text-2xl font-bold font-mono bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Titles & Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  {college.name}
                </h1>
                {college.short_name && (
                  <Badge variant="outline" size="sm" className="font-mono text-xs">
                    {college.short_name}
                  </Badge>
                )}
              </div>

              {/* Sub-meta (Location, Website, Verification Status Note) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
                {college.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{college.location}</span>
                  </span>
                )}

                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline hover:text-primary/90 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span>{college.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                )}

                {!isVerified && !isPending && onRequestVerification && (
                  <button
                    onClick={onRequestVerification}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 hover:text-amber-400 hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Claim or Verify Campus</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Description & Curated Campus Pillars */}
        {college.description && (
          <p className="pt-4 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl">
            {college.description}
          </p>
        )}

        {/* 4. Campus Quantitative Network Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Public Builders</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
              {stats.totalStudents}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
              <FolderGit2 className="h-3.5 w-3.5 text-brand" />
              <span>Projects Built</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
              {stats.totalProjects}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Verified Honors</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
              {stats.totalAchievements}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
              <Compass className="h-3.5 w-3.5 text-emerald-500" />
              <span>Campus Ecosystem</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
              Active Hub
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
