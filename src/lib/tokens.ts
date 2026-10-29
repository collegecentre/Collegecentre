/**
 * CollegeCentre Design Tokens
 * Programmatic source of truth for design constants
 */

export const tokens = {
  typography: {
    fonts: {
      sans: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Consolas, monospace",
    },
    sizes: {
      display: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
      h1: "text-3xl sm:text-4xl font-semibold tracking-tight",
      h2: "text-2xl sm:text-3xl font-semibold tracking-tight",
      h3: "text-xl sm:text-2xl font-semibold tracking-tight",
      h4: "text-lg font-medium tracking-normal",
      lead: "text-lg sm:text-xl text-muted-foreground leading-relaxed",
      body: "text-sm sm:text-base leading-normal",
      bodySm: "text-xs sm:text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
      eyebrow: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
      mono: "font-mono text-xs sm:text-sm tabular-nums",
    },
  },
  spacing: {
    1: "0.25rem", // 4px
    2: "0.5rem",  // 8px
    3: "0.75rem", // 12px
    4: "1rem",    // 16px
    5: "1.25rem", // 20px
    6: "1.5rem",  // 24px
    8: "2rem",    // 32px
    10: "2.5rem", // 40px
    12: "3rem",   // 48px
    16: "4rem",   // 64px
    20: "5rem",   // 80px
  },
  radii: {
    xs: "calc(var(--radius) - 6px)", // 2px
    sm: "calc(var(--radius) - 4px)", // 4px
    md: "calc(var(--radius) - 2px)", // 6px
    lg: "var(--radius)",             // 8px
    xl: "calc(var(--radius) + 4px)", // 12px
    full: "9999px",
  },
  shadows: {
    subtle: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
    card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    hover: "0 6px 16px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
} as const;
