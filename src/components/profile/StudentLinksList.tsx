import * as React from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import type { StudentLink } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface StudentLinksListProps {
  links: StudentLink[];
  themeConfig: ProfileThemeConfig;
  profileId?: string;
}

function extractDomain(rawUrl: string): string {
  try {
    const url = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? new URL(rawUrl)
      : new URL(`https://${rawUrl}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}

function ensureValidUrl(rawUrl: string): string {
  const clean = (rawUrl || "").trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("mailto:")) {
    return clean;
  }
  return `https://${clean}`;
}

export function StudentLinksList({ links, themeConfig, profileId }: StudentLinksListProps) {
  const enabledLinks = (links || [])
    .filter((l) => l.is_enabled !== false)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  if (enabledLinks.length === 0) {
    return null;
  }

  const handleLinkClick = (link: StudentLink) => {
    const targetProfileId = profileId || link.profile_id;
    if (targetProfileId) {
      trackAnalyticsEvent({
        profileId: targetProfileId,
        eventType: "link_click",
        resourceId: link.id,
        resourceTitle: link.title,
      });
    }
  };

  return (
    <section aria-labelledby="showcase-links-heading" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2
          id="showcase-links-heading"
          className={cn("tracking-wider", themeConfig.sectionTitle)}
        >
          Selected Links &amp; Resources
        </h2>
        <span className="text-[11px] font-mono text-muted-foreground">
          {enabledLinks.length} {enabledLinks.length === 1 ? "Link" : "Links"}
        </span>
      </div>

      <div className="flex flex-col space-y-2.5">
        {enabledLinks.map((link) => {
          const domain = extractDomain(link.url);
          const href = ensureValidUrl(link.url);

          return (
            <a
              key={link.id || link.title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className={cn(
                "group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                themeConfig.linkCard
              )}
            >
              <div className="flex items-center gap-3.5 pr-3 min-w-0">
                {/* Optional Thumbnail / Icon */}
                {link.thumbnail_url ? (
                  <div className="h-10 w-10 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-muted">
                    <img
                      src={link.thumbnail_url}
                      alt={link.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-lg border border-border/50 bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
                    <Globe className="h-4 w-4" />
                  </div>
                )}

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                      {link.title}
                    </span>
                    {link.category && (
                      <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground uppercase">
                        {link.category}
                      </span>
                    )}
                  </div>

                  {link.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {link.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                    <span className="truncate">{domain}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <div className="h-7 w-7 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
