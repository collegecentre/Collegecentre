import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Globe } from "lucide-react";
import { getStudentProfileByUsername } from "@/lib/profile-service";
import { getProfileTheme } from "@/lib/themes";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SocialLinksRow } from "@/components/profile/SocialLinksRow";
import { StudentLinksList } from "@/components/profile/StudentLinksList";
import { ProjectsShowcase } from "@/components/profile/ProjectsShowcase";
import { AchievementsShowcase } from "@/components/profile/AchievementsShowcase";
import { CertificatesShowcase } from "@/components/profile/CertificatesShowcase";
import { ResumeShowcase } from "@/components/profile/ResumeShowcase";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { PrivateProfileView } from "@/components/profile/PrivateProfileView";
import { ProfileViewTracker } from "@/components/profile/ProfileViewTracker";
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

  const defaultOgImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&q=80";
  const shareImage = profile.avatar_url || defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: profile.is_public ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "CollegeCentre",
      type: "profile",
      locale: "en_US",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${displayName} on CollegeCentre`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
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

  const { profile, socialLinks, studentLinks, projects, achievements, certificates, resume } = data;

  // 2. Private profile state
  if (profile.is_public === false) {
    return <PrivateProfileView profile={profile} />;
  }

  // 3. Theme resolution with custom appearance layer
  const themeConfig = getProfileTheme(profile.theme, {
    accentColor: profile.theme_accent,
    layoutVariant: profile.theme_layout,
    buttonStyle: profile.theme_button,
    backgroundStyle: profile.theme_background,
  });

  const layoutWidthClass =
    profile.theme_layout === "compact"
      ? "max-w-lg"
      : profile.theme_layout === "editorial"
      ? "max-w-2xl"
      : "max-w-xl";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name || profile.username,
    alternateName: `@${profile.username}`,
    url: profile.custom_domain
      ? `https://${profile.custom_domain}`
      : `https://collegecentre.in/${profile.username}`,
    image: profile.avatar_url || undefined,
    description: profile.bio || undefined,
    alumniOf: profile.college
      ? {
          "@type": "EducationalOrganization",
          name: profile.college,
        }
      : undefined,
    sameAs: socialLinks.map((s) => s.url).filter(Boolean),
  };

  return (
    <div
      className={cn(
        "min-h-screen py-8 sm:py-16 px-4 sm:px-6 transition-colors duration-200 selection:bg-primary selection:text-primary-foreground",
        themeConfig.pageBackground
      )}
    >
      {/* Schema.org Person Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className={cn(
          "mx-auto rounded-2xl border p-6 sm:p-10 space-y-8 backdrop-blur-sm transition-all duration-200",
          layoutWidthClass,
          themeConfig.containerClass
        )}
      >
        {/* Top Minimal Identity Meta Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-xs">
            {profile.custom_domain ? (
              <span className="font-semibold text-foreground/90 flex items-center gap-1">
                <Globe className="h-3 w-3 text-brand" />
                {profile.custom_domain}
              </span>
            ) : (
              <>
                <span className="font-semibold text-foreground/80">collegecentre.in</span>
                <span>/</span>
                <span className="text-foreground font-medium truncate">{profile.username}</span>
              </>
            )}
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
        <StudentLinksList
          links={studentLinks}
          themeConfig={themeConfig}
          profileId={profile.id}
        />

        {/* 4. Projects Showcase */}
        <ProjectsShowcase
          projects={projects || []}
          themeConfig={themeConfig}
          studentName={profile.full_name}
          profileId={profile.id}
        />

        {/* 5. Honors & Achievements Showcase */}
        <AchievementsShowcase
          achievements={achievements || []}
          themeConfig={themeConfig}
          studentName={profile.full_name}
        />

        {/* 6. Professional & Academic Certificates */}
        <CertificatesShowcase
          certificates={certificates || []}
          themeConfig={themeConfig}
          studentName={profile.full_name}
        />

        {/* 7. Verified Resume & Curriculum Vitae */}
        <ResumeShowcase
          resume={resume}
          themeConfig={themeConfig}
          studentName={profile.full_name}
          profileId={profile.id}
        />

        {/* 8. Profile Footer & Share Action */}
        <ProfileFooter profile={profile} themeConfig={themeConfig} />

        {/* 9. Silent, Privacy-Preserving Profile View Tracker */}
        <ProfileViewTracker profileId={profile.id} />
      </main>
    </div>
  );
}
