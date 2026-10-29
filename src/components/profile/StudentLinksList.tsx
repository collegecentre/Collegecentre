import * as React from "react";
import { ArrowUpRight, Globe, Link as LinkIcon } from "lucide-react";
import type { StudentLink } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface StudentLinksListProps {
  links: StudentLink[];
  themeConfig: ProfileThemeConfig;
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

export function StudentLinksList({ links, themeConfig }: StudentLinksListProps) {
  if (!links || links.length === 0) {
    return null;
  }

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
          {links.length} {links.length === 1 ? "Link" : "Links"}
        </span>
      </div>

      <div className="flex flex-col space-y-2.5">
        {links.map((link) => {
          const domain = extractDomain(link.url);
          const href = ensureValidUrl(link.url);

          return (
            <a
              key={link.id || link.title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                themeConfig.linkCard
              )}
            >
              <div className="space-y-1 pr-4 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                    {link.title}
                  </span>
                </div>

                {link.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {link.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-mono text-muted-foreground">
                  <Globe className="h-3 w-3 shrink-0 opacity-60" />
                  <span className="truncate">{domain}</span>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <div className="h-8 w-8 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
