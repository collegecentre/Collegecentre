import * as React from "react";
import {
  Globe,
  Mail,
  Share2,
  ExternalLink,
} from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface SocialLinksRowProps {
  socialLinks: SocialLink[];
  themeConfig: ProfileThemeConfig;
}

// Crisp SVGs for platforms that don't have dedicated lucide icons or need branded shapes
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.9-.74-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .9.74 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  github: { label: "GitHub", icon: GitHubIcon },
  linkedin: { label: "LinkedIn", icon: LinkedInIcon },
  x: { label: "X (Twitter)", icon: XIcon },
  instagram: { label: "Instagram", icon: InstagramIcon },
  website: { label: "Personal Website", icon: Globe },
  email: { label: "Email", icon: Mail },
  youtube: { label: "YouTube", icon: Share2 },
  substack: { label: "Substack", icon: Share2 },
  other: { label: "Link", icon: ExternalLink },
};

function formatUrl(platform: SocialPlatform, url: string): string {
  const clean = (url || "").trim();
  if (!clean) return "#";
  if (platform === "email") {
    return clean.startsWith("mailto:") ? clean : `mailto:${clean}`;
  }
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return `https://${clean}`;
  }
  return clean;
}

export function SocialLinksRow({ socialLinks, themeConfig }: SocialLinksRowProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <nav aria-label="Social Profiles" className="flex flex-wrap items-center justify-center gap-2 pt-1">
      {socialLinks.map((link) => {
        const meta = PLATFORM_META[link.platform] || PLATFORM_META.other;
        const IconComponent = meta.icon;
        const href = formatUrl(link.platform, link.url);

        return (
          <a
            key={link.id || `${link.platform}-${link.url}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={meta.label}
            title={meta.label}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 group shadow-xs",
              themeConfig.socialButton
            )}
          >
            <IconComponent className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span className="hidden xs:inline sm:inline capitalize">
              {link.platform === "x" ? "X" : link.platform}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
