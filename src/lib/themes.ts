import type { ProfileTheme } from "@/types";

export interface ProfileThemeConfig {
  id: ProfileTheme;
  name: string;
  tagline: string;
  fontFamily: string;
  pageBackground: string;
  containerClass: string;
  cardBg: string;
  cardBorder: string;
  headerBorder: string;
  accentText: string;
  accentBadgeVariant: "default" | "secondary" | "brand" | "success" | "warning" | "destructive" | "outline";
  avatarRing: string;
  avatarFallback: string;
  sectionTitle: string;
  linkCard: string;
  featuredCard: string;
  socialButton: string;
  footerMuted: string;
}

export const PROFILE_THEMES: Record<ProfileTheme, ProfileThemeConfig> = {
  obsidian: {
    id: "obsidian",
    name: "Obsidian Minimal",
    tagline: "Ultra-restrained monochrome with razor-sharp hairline borders",
    fontFamily: "font-sans",
    pageBackground: "bg-background text-foreground",
    containerClass: "bg-card border-border shadow-subtle",
    cardBg: "bg-card",
    cardBorder: "border-border",
    headerBorder: "border-border/60",
    accentText: "text-foreground",
    accentBadgeVariant: "brand",
    avatarRing: "ring-foreground/15 dark:ring-white/20",
    avatarFallback: "bg-muted text-foreground font-semibold",
    sectionTitle: "text-muted-foreground font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-card/80 hover:bg-muted/50 border-border/80 hover:border-foreground/30 text-foreground transition-all duration-200 shadow-sm hover:shadow-subtle",
    featuredCard:
      "bg-muted/20 border-border/70 hover:border-foreground/40 text-foreground transition-all duration-200",
    socialButton:
      "border-border hover:border-foreground/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors",
    footerMuted: "text-muted-foreground",
  },

  academic: {
    id: "academic",
    name: "Academic Editorial",
    tagline: "Warm paper aesthetic, serif editorial typography & scholarly dignity",
    fontFamily: "font-serif",
    pageBackground: "bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100",
    containerClass:
      "bg-stone-50/90 dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 shadow-subtle",
    cardBg: "bg-stone-50/90 dark:bg-stone-900/90",
    cardBorder: "border-stone-200 dark:border-stone-800",
    headerBorder: "border-stone-200/80 dark:border-stone-800/80",
    accentText: "text-amber-900 dark:text-amber-300",
    accentBadgeVariant: "secondary",
    avatarRing: "ring-amber-900/20 dark:ring-amber-400/20",
    avatarFallback: "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-serif",
    sectionTitle: "text-stone-500 dark:text-stone-400 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-white/80 dark:bg-stone-900/80 hover:bg-amber-50/60 dark:hover:bg-stone-850 border-stone-200/90 dark:border-stone-800 hover:border-amber-900/40 dark:hover:border-amber-400/40 text-stone-900 dark:text-stone-100 transition-all duration-200 shadow-sm",
    featuredCard:
      "bg-white/60 dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 hover:border-amber-900/30 dark:hover:border-amber-400/30 transition-all duration-200",
    socialButton:
      "border-stone-200 dark:border-stone-800 hover:border-amber-900/40 dark:hover:border-amber-400/40 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors",
    footerMuted: "text-stone-500 dark:text-stone-400",
  },

  cobalt: {
    id: "cobalt",
    name: "Cobalt Dynamic",
    tagline: "High-contrast technical aesthetic with electric cobalt accents",
    fontFamily: "font-sans",
    pageBackground: "bg-slate-950 text-slate-100",
    containerClass:
      "bg-slate-900/90 border-blue-500/25 text-slate-100 shadow-subtle ring-1 ring-blue-500/10",
    cardBg: "bg-slate-900/90",
    cardBorder: "border-blue-500/25",
    headerBorder: "border-blue-500/20",
    accentText: "text-blue-400",
    accentBadgeVariant: "brand",
    avatarRing: "ring-blue-500/30",
    avatarFallback: "bg-slate-800 text-blue-400 font-semibold",
    sectionTitle: "text-blue-400/80 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-slate-900/80 hover:bg-blue-950/40 border-blue-500/20 hover:border-blue-400/50 text-slate-100 transition-all duration-200 shadow-sm hover:shadow-subtle",
    featuredCard:
      "bg-blue-950/20 border-blue-500/25 hover:border-blue-400/40 transition-all duration-200",
    socialButton:
      "border-blue-500/25 hover:border-blue-400/60 hover:bg-blue-950/50 text-slate-400 hover:text-blue-300 transition-colors",
    footerMuted: "text-slate-500",
  },

  terminal: {
    id: "terminal",
    name: "Terminal Mono",
    tagline: "True black cybernetic terminal with emerald green syntax cues",
    fontFamily: "font-mono",
    pageBackground: "bg-black text-zinc-100",
    containerClass:
      "bg-zinc-950 border-emerald-500/25 text-zinc-100 shadow-subtle ring-1 ring-emerald-500/10 font-mono",
    cardBg: "bg-zinc-950",
    cardBorder: "border-emerald-500/25",
    headerBorder: "border-zinc-800",
    accentText: "text-emerald-400",
    accentBadgeVariant: "success",
    avatarRing: "ring-emerald-500/30",
    avatarFallback: "bg-zinc-900 text-emerald-400 font-mono",
    sectionTitle: "text-emerald-500/80 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 text-zinc-100 transition-all duration-200 font-mono",
    featuredCard:
      "bg-zinc-900/40 border-zinc-800 hover:border-emerald-500/40 transition-all duration-200 font-mono",
    socialButton:
      "border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-zinc-400 hover:text-emerald-400 transition-colors font-mono",
    footerMuted: "text-zinc-600 font-mono",
  },
};

/**
 * Returns theme configuration for a given theme id with fallback to obsidian
 */
export function getProfileTheme(themeId?: string | null): ProfileThemeConfig {
  if (themeId && themeId in PROFILE_THEMES) {
    return PROFILE_THEMES[themeId as ProfileTheme];
  }
  return PROFILE_THEMES.obsidian;
}

/**
 * Returns all available themes
 */
export function getAllProfileThemes(): ProfileThemeConfig[] {
  return Object.values(PROFILE_THEMES);
}
