import type {
  ProfileTheme,
  ThemeAccentColor,
  ThemeLayoutVariant,
  ThemeButtonStyle,
  ThemeBackgroundStyle,
} from "@/types";

export interface ProfileThemeConfig {
  id: ProfileTheme;
  name: string;
  tagline: string;
  description: string;
  category: "Minimal" | "Technical" | "Design" | "Scholarly" | "Corporate" | "OLED";
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
  previewColors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface ThemeCustomizationOptions {
  accentColor?: ThemeAccentColor | null;
  layoutVariant?: ThemeLayoutVariant | null;
  buttonStyle?: ThemeButtonStyle | null;
  backgroundStyle?: ThemeBackgroundStyle | null;
}

// -------------------------------------------------------------
// Official Curated Theme Presets
// -------------------------------------------------------------

export const PROFILE_THEMES: Record<ProfileTheme, ProfileThemeConfig> = {
  // 1. Minimal: Crisp, restrained monochrome with hairline borders & generous whitespace
  minimal: {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean monochrome with subtle borders and balanced spacing",
    description: "Simple, high-contrast monochrome layout with clean typography.",
    category: "Minimal",
    fontFamily: "font-sans",
    pageBackground: "bg-background text-foreground",
    containerClass: "bg-card border-border/80 shadow-subtle",
    cardBg: "bg-card",
    cardBorder: "border-border/80",
    headerBorder: "border-border/60",
    accentText: "text-foreground",
    accentBadgeVariant: "brand",
    avatarRing: "ring-foreground/15 dark:ring-white/20",
    avatarFallback: "bg-muted text-foreground font-semibold",
    sectionTitle: "text-muted-foreground font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-card hover:bg-muted/50 border-border/80 hover:border-foreground/30 text-foreground transition-all duration-200 shadow-sm hover:shadow-subtle rounded-xl",
    featuredCard:
      "bg-muted/20 border-border/70 hover:border-foreground/40 text-foreground transition-all duration-200 rounded-xl",
    socialButton:
      "border-border/80 hover:border-foreground/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors rounded-lg",
    footerMuted: "text-muted-foreground",
    previewColors: {
      bg: "#fafafa",
      surface: "#ffffff",
      border: "#e4e4e7",
      text: "#18181b",
      accent: "#18181b",
    },
  },

  // 2. Developer: Code-editor aesthetic, monospace hierarchy, and terminal prompts
  developer: {
    id: "developer",
    name: "Developer",
    tagline: "Terminal-inspired monospace layout with green syntax accents",
    description: "Designed for systems engineers, developers, and command-line lovers.",
    category: "Technical",
    fontFamily: "font-mono",
    pageBackground: "bg-zinc-950 text-zinc-100",
    containerClass:
      "bg-zinc-950 border-emerald-500/25 text-zinc-100 shadow-subtle ring-1 ring-emerald-500/10 font-mono",
    cardBg: "bg-zinc-900/90",
    cardBorder: "border-emerald-500/25",
    headerBorder: "border-zinc-800",
    accentText: "text-emerald-400",
    accentBadgeVariant: "success",
    avatarRing: "ring-emerald-500/30",
    avatarFallback: "bg-zinc-900 text-emerald-400 font-mono border border-emerald-500/30",
    sectionTitle: "text-emerald-500/80 font-mono uppercase tracking-wider text-xs flex items-center gap-1.5 before:content-['//'] before:text-emerald-500/50",
    linkCard:
      "bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 text-zinc-100 transition-all duration-200 font-mono rounded-lg shadow-sm",
    featuredCard:
      "bg-zinc-900/40 border-zinc-800 hover:border-emerald-500/40 transition-all duration-200 font-mono rounded-lg",
    socialButton:
      "border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-zinc-400 hover:text-emerald-400 transition-colors font-mono rounded-md",
    footerMuted: "text-zinc-500 font-mono",
    previewColors: {
      bg: "#09090b",
      surface: "#18181b",
      border: "#27272a",
      text: "#f4f4f5",
      accent: "#10b981",
    },
  },

  // 3. Creative: Expressive layout, warm studio paper, and electric violet accents
  creative: {
    id: "creative",
    name: "Creative",
    tagline: "Contemporary layout with soft ambient gradients and rounded cards",
    description: "Designed for designers, creators, and visual portfolios.",
    category: "Design",
    fontFamily: "font-sans",
    pageBackground: "bg-gradient-to-br from-violet-50/40 via-background to-rose-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950/20 text-foreground",
    containerClass:
      "bg-card/90 backdrop-blur-md border-violet-500/20 dark:border-violet-500/30 shadow-card rounded-3xl",
    cardBg: "bg-card/90",
    cardBorder: "border-violet-500/20",
    headerBorder: "border-violet-500/15",
    accentText: "text-violet-600 dark:text-violet-400",
    accentBadgeVariant: "secondary",
    avatarRing: "ring-violet-500/30",
    avatarFallback: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold",
    sectionTitle: "text-violet-600/80 dark:text-violet-400/80 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-card/85 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 border-violet-500/20 hover:border-violet-500/50 text-foreground transition-all duration-200 shadow-sm rounded-2xl",
    featuredCard:
      "bg-violet-500/5 border-violet-500/20 hover:border-violet-500/40 transition-all duration-200 rounded-2xl",
    socialButton:
      "border-violet-500/25 hover:border-violet-500/60 hover:bg-violet-50/60 dark:hover:bg-violet-950/40 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-300 transition-colors rounded-full",
    footerMuted: "text-muted-foreground",
    previewColors: {
      bg: "#fbfbfe",
      surface: "#ffffff",
      border: "#ddd6fe",
      text: "#1e1b4b",
      accent: "#8b5cf6",
    },
  },

  // 4. Academic: Scholarly dignity, serif editorial typography & heraldic structure
  academic: {
    id: "academic",
    name: "Academic",
    tagline: "Warm paper aesthetic with classic serif editorial typography",
    description: "Designed for researchers, writers, and academic scholars.",
    category: "Scholarly",
    fontFamily: "font-serif",
    pageBackground: "bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100",
    containerClass:
      "bg-stone-50/90 dark:bg-stone-900/90 border-stone-300 dark:border-stone-800 shadow-subtle rounded-xl",
    cardBg: "bg-stone-50/90 dark:bg-stone-900/90",
    cardBorder: "border-stone-300 dark:border-stone-800",
    headerBorder: "border-stone-300/80 dark:border-stone-800/80",
    accentText: "text-amber-900 dark:text-amber-300",
    accentBadgeVariant: "secondary",
    avatarRing: "ring-amber-900/20 dark:ring-amber-400/20",
    avatarFallback: "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-serif",
    sectionTitle: "text-stone-600 dark:text-stone-400 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-white/90 dark:bg-stone-900/90 hover:bg-amber-50/60 dark:hover:bg-stone-800 border-stone-300/90 dark:border-stone-800 hover:border-amber-900/40 dark:hover:border-amber-400/40 text-stone-900 dark:text-stone-100 transition-all duration-200 shadow-sm rounded-lg",
    featuredCard:
      "bg-white/60 dark:bg-stone-900/60 border-stone-300/80 dark:border-stone-800 hover:border-amber-900/30 dark:hover:border-amber-400/30 transition-all duration-200 rounded-lg",
    socialButton:
      "border-stone-300 dark:border-stone-800 hover:border-amber-900/40 dark:hover:border-amber-400/40 hover:bg-stone-200/50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors rounded-md",
    footerMuted: "text-stone-500 dark:text-stone-400",
    previewColors: {
      bg: "#f5f5f4",
      surface: "#fafaf9",
      border: "#d6d3d1",
      text: "#292524",
      accent: "#78350f",
    },
  },

  // 5. Professional: Executive corporate polish, cool slate & cobalt authority
  professional: {
    id: "professional",
    name: "Professional",
    tagline: "Clean corporate aesthetic with cool slate and blue highlights",
    description: "Structured for consulting, finance, management, and industry roles.",
    category: "Corporate",
    fontFamily: "font-sans",
    pageBackground: "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
    containerClass:
      "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-card rounded-xl",
    cardBg: "bg-white dark:bg-slate-900",
    cardBorder: "border-slate-200 dark:border-slate-800",
    headerBorder: "border-slate-200 dark:border-slate-800",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBadgeVariant: "brand",
    avatarRing: "ring-blue-600/25 dark:ring-blue-400/25",
    avatarFallback: "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold",
    sectionTitle: "text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-slate-50/60 dark:bg-slate-900/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 text-slate-900 dark:text-slate-100 transition-all duration-200 shadow-sm rounded-xl",
    featuredCard:
      "bg-slate-100/50 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-200 rounded-xl",
    socialButton:
      "border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg",
    footerMuted: "text-slate-500",
    previewColors: {
      bg: "#f8fafc",
      surface: "#ffffff",
      border: "#cbd5e1",
      text: "#0f172a",
      accent: "#2563eb",
    },
  },

  // 6. Dark: True midnight OLED black, luminous borders & silver typography
  dark: {
    id: "dark",
    name: "Dark",
    tagline: "Pitch-black dark mode with subtle border contrast",
    description: "Designed for low-light environments and OLED displays.",
    category: "OLED",
    fontFamily: "font-sans",
    pageBackground: "bg-black text-zinc-100",
    containerClass:
      "bg-zinc-950/95 border-zinc-800/90 shadow-2xl ring-1 ring-white/10 rounded-2xl",
    cardBg: "bg-zinc-950",
    cardBorder: "border-zinc-800/90",
    headerBorder: "border-zinc-800/80",
    accentText: "text-zinc-100",
    accentBadgeVariant: "outline",
    avatarRing: "ring-white/20",
    avatarFallback: "bg-zinc-900 text-zinc-100 font-bold border border-zinc-700/50",
    sectionTitle: "text-zinc-400 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-100 transition-all duration-200 shadow-sm rounded-xl",
    featuredCard:
      "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-200 transition-all duration-200 rounded-xl",
    socialButton:
      "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors rounded-lg",
    footerMuted: "text-zinc-500",
    previewColors: {
      bg: "#000000",
      surface: "#09090b",
      border: "#27272a",
      text: "#fafafa",
      accent: "#ffffff",
    },
  },

  // -------------------------------------------------------------
  // Legacy Aliases (Supported for backward compatibility)
  // -------------------------------------------------------------
  obsidian: {
    id: "obsidian",
    name: "Obsidian Minimal",
    tagline: "Clean monochrome with subtle borders",
    description: "Monochrome aesthetic with balanced spacing.",
    category: "Minimal",
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
      "bg-card/80 hover:bg-muted/50 border-border/80 hover:border-foreground/30 text-foreground transition-all duration-200 shadow-sm hover:shadow-subtle rounded-xl",
    featuredCard:
      "bg-muted/20 border-border/70 hover:border-foreground/40 text-foreground transition-all duration-200 rounded-xl",
    socialButton:
      "border-border hover:border-foreground/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors rounded-lg",
    footerMuted: "text-muted-foreground",
    previewColors: {
      bg: "#09090b",
      surface: "#18181b",
      border: "#27272a",
      text: "#fafafa",
      accent: "#fafafa",
    },
  },

  cobalt: {
    id: "cobalt",
    name: "Cobalt Dynamic",
    tagline: "High-contrast technical aesthetic with electric cobalt accents",
    description: "High-contrast technical aesthetic.",
    category: "Corporate",
    fontFamily: "font-sans",
    pageBackground: "bg-slate-950 text-slate-100",
    containerClass:
      "bg-slate-900/90 border-blue-500/25 text-slate-100 shadow-subtle ring-1 ring-blue-500/10 rounded-xl",
    cardBg: "bg-slate-900/90",
    cardBorder: "border-blue-500/25",
    headerBorder: "border-blue-500/20",
    accentText: "text-blue-400",
    accentBadgeVariant: "brand",
    avatarRing: "ring-blue-500/30",
    avatarFallback: "bg-slate-800 text-blue-400 font-semibold",
    sectionTitle: "text-blue-400/80 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-slate-900/80 hover:bg-blue-950/40 border-blue-500/20 hover:border-blue-400/50 text-slate-100 transition-all duration-200 shadow-sm hover:shadow-subtle rounded-xl",
    featuredCard:
      "bg-blue-950/20 border-blue-500/25 hover:border-blue-400/40 transition-all duration-200 rounded-xl",
    socialButton:
      "border-blue-500/25 hover:border-blue-400/60 hover:bg-blue-950/50 text-slate-400 hover:text-blue-300 transition-colors rounded-lg",
    footerMuted: "text-slate-500",
    previewColors: {
      bg: "#020617",
      surface: "#0f172a",
      border: "#1e3a8a",
      text: "#f8fafc",
      accent: "#3b82f6",
    },
  },

  terminal: {
    id: "terminal",
    name: "Terminal Mono",
    tagline: "Terminal layout with emerald green syntax cues",
    description: "Monospace terminal aesthetic.",
    category: "Technical",
    fontFamily: "font-mono",
    pageBackground: "bg-black text-zinc-100",
    containerClass:
      "bg-zinc-950 border-emerald-500/25 text-zinc-100 shadow-subtle ring-1 ring-emerald-500/10 font-mono rounded-lg",
    cardBg: "bg-zinc-950",
    cardBorder: "border-emerald-500/25",
    headerBorder: "border-zinc-800",
    accentText: "text-emerald-400",
    accentBadgeVariant: "success",
    avatarRing: "ring-emerald-500/30",
    avatarFallback: "bg-zinc-900 text-emerald-400 font-mono",
    sectionTitle: "text-emerald-500/80 font-mono uppercase tracking-wider text-xs",
    linkCard:
      "bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 text-zinc-100 transition-all duration-200 font-mono rounded-lg",
    featuredCard:
      "bg-zinc-900/40 border-zinc-800 hover:border-emerald-500/40 transition-all duration-200 font-mono rounded-lg",
    socialButton:
      "border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-zinc-400 hover:text-emerald-400 transition-colors font-mono rounded-md",
    footerMuted: "text-zinc-600 font-mono",
    previewColors: {
      bg: "#000000",
      surface: "#09090b",
      border: "#10b981",
      text: "#10b981",
      accent: "#10b981",
    },
  },
};

/**
 * The 6 primary official theme presets for CollegeCentre
 */
export const OFFICIAL_THEMES: ProfileThemeConfig[] = [
  PROFILE_THEMES.minimal,
  PROFILE_THEMES.developer,
  PROFILE_THEMES.creative,
  PROFILE_THEMES.academic,
  PROFILE_THEMES.professional,
  PROFILE_THEMES.dark,
];

/**
 * Returns theme configuration for a given theme id with dynamic layering of optional customizations
 */
export function getProfileTheme(
  themeId?: string | null,
  customization?: ThemeCustomizationOptions | null
): ProfileThemeConfig {
  let baseTheme = PROFILE_THEMES.obsidian;

  if (themeId && themeId in PROFILE_THEMES) {
    baseTheme = PROFILE_THEMES[themeId as ProfileTheme];
  }

  // Clone base config to apply customizations without mutation
  const config: ProfileThemeConfig = { ...baseTheme };

  if (!customization) {
    return config;
  }

  // 1. Accent color overlay
  if (customization.accentColor && customization.accentColor !== "default") {
    switch (customization.accentColor) {
      case "emerald":
        config.accentText = "text-emerald-500 dark:text-emerald-400";
        config.accentBadgeVariant = "success";
        break;
      case "blue":
        config.accentText = "text-blue-500 dark:text-blue-400";
        config.accentBadgeVariant = "brand";
        break;
      case "violet":
        config.accentText = "text-violet-500 dark:text-violet-400";
        config.accentBadgeVariant = "secondary";
        break;
      case "amber":
        config.accentText = "text-amber-500 dark:text-amber-400";
        config.accentBadgeVariant = "warning";
        break;
      case "rose":
        config.accentText = "text-rose-500 dark:text-rose-400";
        config.accentBadgeVariant = "destructive";
        break;
    }
  }

  // 2. Button style overlay
  if (customization.buttonStyle) {
    if (customization.buttonStyle === "pill") {
      config.linkCard = config.linkCard.replace(/rounded-(xl|2xl|3xl|lg|md)/g, "rounded-full");
      config.socialButton = config.socialButton.replace(/rounded-(xl|2xl|3xl|lg|md)/g, "rounded-full");
      config.featuredCard = config.featuredCard.replace(/rounded-(xl|2xl|3xl|lg|md)/g, "rounded-2xl");
    } else if (customization.buttonStyle === "sharp") {
      config.linkCard = config.linkCard.replace(/rounded-(xl|2xl|3xl|lg|full)/g, "rounded-sm");
      config.socialButton = config.socialButton.replace(/rounded-(xl|2xl|3xl|lg|full)/g, "rounded-sm");
      config.featuredCard = config.featuredCard.replace(/rounded-(xl|2xl|3xl|lg|full)/g, "rounded-sm");
    } else if (customization.buttonStyle === "rounded") {
      config.linkCard = config.linkCard.replace(/rounded-(2xl|3xl|full|sm|md)/g, "rounded-xl");
    }
  }

  // 3. Background style overlay
  if (customization.backgroundStyle) {
    if (customization.backgroundStyle === "dots") {
      config.pageBackground = `${config.pageBackground} bg-[radial-gradient(#80808020_1px,transparent_1px)] [background-size:16px_16px]`;
    } else if (customization.backgroundStyle === "grid") {
      config.pageBackground = `${config.pageBackground} bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]`;
    } else if (customization.backgroundStyle === "gradient") {
      config.pageBackground = `${config.pageBackground} bg-gradient-to-b from-transparent via-muted/10 to-muted/30`;
    }
  }

  return config;
}

/**
 * Returns all available themes (including official presets and legacy aliases)
 */
export function getAllProfileThemes(): ProfileThemeConfig[] {
  return Object.values(PROFILE_THEMES);
}
