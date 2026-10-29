import * as React from "react";
import { School, BookOpen, Calendar, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
  themeConfig: ProfileThemeConfig;
}

export function ProfileHeader({ profile, themeConfig }: ProfileHeaderProps) {
  // Get initials for fallback avatar
  const initials = (profile.full_name || profile.username || "CC")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const gradYear = profile.graduation_year
    ? `'${String(profile.graduation_year).slice(-2)}`
    : null;

  return (
    <header className="text-center space-y-4 pt-2">
      {/* Avatar Container */}
      <div className="relative inline-block">
        <Avatar
          size="2xl"
          status="verified"
          className={cn(
            "ring-4 shadow-card transition-all duration-300",
            themeConfig.avatarRing
          )}
        >
          {profile.avatar_url && (
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              className="object-cover"
            />
          )}
          <AvatarFallback
            className={cn(
              "text-xl tracking-tight select-none",
              themeConfig.avatarFallback
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Verified Badge */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h1
            className={cn(
              "text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
              themeConfig.fontFamily
            )}
          >
            {profile.full_name || `@${profile.username}`}
          </h1>
          <Badge
            variant={themeConfig.accentBadgeVariant}
            size="sm"
            dot
            className="text-[11px] font-mono tracking-tight shadow-sm"
          >
            Verified Student
          </Badge>
        </div>

        {/* Academic Identity Bar */}
        {(profile.college || profile.course || gradYear) && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium pt-0.5">
            {profile.college && (
              <span className="inline-flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 opacity-70 shrink-0" />
                <span>{profile.college}</span>
              </span>
            )}
            {profile.course && (
              <>
                <span className="text-border hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 opacity-70 shrink-0" />
                  <span>{profile.course}</span>
                </span>
              </>
            )}
            {gradYear && (
              <>
                <span className="text-border hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                  <Calendar className="h-3.5 w-3.5 opacity-70 shrink-0" />
                  <span>Class of {profile.graduation_year}</span>
                </span>
              </>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm sm:text-base text-foreground/85 max-w-lg mx-auto leading-relaxed pt-1.5 px-2">
            {profile.bio}
          </p>
        )}
      </div>
    </header>
  );
}
