"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "collegecentre-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  // Subscribe to system theme changes & initialize from storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored && (stored === "dark" || stored === "light" || stored === "system")) {
        setTheme(stored);
      }
    } catch {
      // Ignore storage access errors
    }
  }, [storageKey]);

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light");

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const nextResolved = theme === "system" ? getSystemTheme() : theme;
    root.classList.add(nextResolved);
    setResolvedTheme(nextResolved);

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) => {
        const sys = e.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(sys);
        setResolvedTheme(sys);
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const handleSetTheme = React.useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Ignore
      }
      setTheme(newTheme);
    },
    [storageKey]
  );

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: handleSetTheme,
    }),
    [theme, resolvedTheme, handleSetTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
