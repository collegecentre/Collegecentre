"use client";

import * as React from "react";
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export interface HeaderProps {
  onOpenClaim: () => void;
  onOpenLogin: () => void;
  onOpenExplore: () => void;
}

export function Header({ onOpenClaim, onOpenLogin, onOpenExplore }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container flex h-15 items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
          >
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform duration-150">
              CC
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
                CollegeCentre
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-brand/10 border border-brand/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-brand">
                2.0
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              onClick={onOpenExplore}
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Explore
            </button>
            <a
              href="#why-collegecentre"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Why CollegeCentre
            </a>
            <a
              href="#showcase"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Features
            </a>
            <a
              href="#themes"
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Themes
            </a>
            <a
              href="/design-system"
              className="px-3 py-1.5 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors font-mono text-[11px]"
            >
              Tokens & System
            </a>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setTheme(
                    theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
                  )
                }
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Theme: {theme}</TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenLogin}
            className="text-xs"
          >
            Login
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onOpenClaim}
            className="text-xs shadow-subtle group"
            rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
          >
            Create your page
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setTheme(
                theme === "dark" ? "light" : theme === "light" ? "system" : "dark"
              )
            }
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="default"
            size="xs"
            onClick={onOpenClaim}
            className="text-xs px-2.5"
          >
            Create page
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenExplore();
              }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors"
            >
              Explore Showcases
            </button>
            <a
              href="#why-collegecentre"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors"
            >
              Why CollegeCentre
            </a>
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors"
            >
              Showcase Modules
            </a>
            <a
              href="#themes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors"
            >
              Profile Themes
            </a>
            <a
              href="/design-system"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-mono text-muted-foreground hover:bg-muted transition-colors"
            >
              Design Tokens & System
            </a>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
            >
              Login
            </Button>
            <Button
              variant="brand"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClaim();
              }}
            >
              Create your CollegeCentre
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
