"use client";

import * as React from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  brandTag?: string;
  items?: NavItem[];
  actions?: React.ReactNode;
}

export function Navbar({
  brandName = "CollegeCentre",
  brandTag = "2.0",
  items = [],
  actions,
  className,
  ...props
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors",
        className
      )}
      {...props}
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-xs tracking-tighter">
              CC
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              {brandName}
            </span>
            {brandTag && (
              <span className="rounded-full bg-brand/10 border border-brand/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-brand">
                {brandTag}
              </span>
            )}
          </a>

          {/* Desktop Nav Items */}
          {items.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    item.active
                      ? "text-foreground bg-muted font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">{actions}</div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {actions}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden space-y-2 animate-in slide-in-from-top-2 duration-150">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 text-sm rounded-md transition-colors",
                item.active
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={item.label}>
            {idx > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />}
            {isLast || !item.href ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
