import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getStudentProfileByUsername } from "@/lib/profile-service";
import { getProfileTheme } from "@/lib/themes";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinksRow } from "@/components/profile/SocialLinksRow";
import { StudentLinksList } from "@/components/profile/StudentLinksList";
import { ProjectsShowcase } from "@/components/profile/ProjectsShowcase";
import { AchievementsShowcase } from "@/components/profile/AchievementsShowcase";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getStudentProfileByUsername(username);

  if (!data || !data.profile) {
    return {
      title: "Student Not Found | CollegeCentre",
      description: "The requested CollegeCentre student showcase does not exist.",
    };
  }

  const { profile } = data;
  const displayName = profile.full_name || `@${profile.username}`;
  const academicContext = profile.college ? ` (${profile.college})` : "";
  const title = `${displayName}${academicContext} • CollegeCentre`;
  const description =
    profile.bio ||
    `Explore ${displayName}'s verified student portfolio, projects, and academic background on CollegeCentre.`;

  const canonicalUrl = `https://collegecentre.in/${profile.username}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CollegeCentre",
      type: "profile",
      locale: "en_US",
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 800,
              height: 800,
              alt: displayName,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getStudentProfileByUsername(username);

  // 1. Nonexistent username: trigger 404
  if (!data || !data.profile) {
    notFound();
  }

  const { profile, socialLinks, studentLinks, projects, achievements } = data;

  // 2. Private profile state
  if (profile.is_public === false) {
    return <PrivateProfileView profile={profile} />;
  }

  // 3. Theme resolution
  const themeConfig = getProfileTheme(profile.theme);

  return (
    <div
      className={cn(
        "min-h-screen py-8 sm:py-16 px-4 sm:px-6 transition-colors duration-200 selection:bg-primary selection:text-primary-foreground",
        themeConfig.pageBackground
      )}
    >
      <main
        className={cn(
          "max-w-xl mx-auto rounded-2xl border p-6 sm:p-10 space-y-8 backdrop-blur-sm transition-all duration-200",
          themeConfig.containerClass
        )}
      >
        {/* Top Minimal Identity Meta Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-xs">
            <span className="font-semibold text-foreground/80">collegecentre.in</span>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{profile.username}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-brand" />
              <span className="hidden sm:inline">Verified Showcase</span>
            </span>
            <Badge variant="outline" size="sm" className="text-[10px] uppercase font-mono px-1.5 py-0">
              {themeConfig.name.split(" ")[0]}
            </Badge>
          </div>
        </div>

        {/* 1. Profile Header */}
        <ProfileHeader profile={profile} themeConfig={themeConfig} />

        {/* 2. Social Links Row */}
        <SocialLinksRow socialLinks={socialLinks} themeConfig={themeConfig} />

        {/* 3. Configured Student Links */}
        <StudentLinksList links={studentLinks} themeConfig={themeConfig} />

        {/* 4. Projects Showcase */}
        <ProjectsShowcase
          projects={projects || []}
          themeConfig={themeConfig}
          studentName={profile.full_name}
        />

        {/* 5. Honors & Achievements Showcase */}
        <AchievementsShowcase
          achievements={achievements || []}
          themeConfig={themeConfig}
          studentName={profile.full_name}
        />

        {/* 6. Profile Footer & Share Action */}
        <ProfileFooter profile={profile} themeConfig={themeConfig} />
      </main>
    </div>
  );
}
