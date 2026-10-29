"use client";

import * as React from "react";
import { GitBranch, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-muted/20 pt-12 pb-14 mt-16 transition-colors">
      <div className="container max-w-5xl space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-xs tracking-tighter shadow-subtle">
                CC
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                CollegeCentre
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              &ldquo;One link for everything you&apos;ve built, achieved, and are.&rdquo;
              Built for builders, researchers, and graduates.
            </p>

            <div className="flex items-center gap-3 pt-1 text-muted-foreground">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="GitHub"
              >
                <GitBranch className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1 text-xs font-mono font-semibold"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block font-mono">
              Product
            </span>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="/#overview" className="hover:text-foreground transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="/#preview" className="hover:text-foreground transition-colors">
                  Live Showcase
                </a>
              </li>
              <li>
                <a href="/#why-collegecentre" className="hover:text-foreground transition-colors">
                  Why CollegeCentre
                </a>
              </li>
              <li>
                <a href="/#showcase" className="hover:text-foreground transition-colors">
                  Showcase Modules
                </a>
              </li>
              <li>
                <a href="/#themes" className="hover:text-foreground transition-colors">
                  Visual Themes
                </a>
              </li>
              <li>
                <a href="/design-system" className="hover:text-foreground transition-colors font-mono text-[11px] text-brand">
                  Design System →
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Campus */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block font-mono">
              Community
            </span>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Campus Leads
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-foreground transition-colors">
                  For Hackathons
                </a>
              </li>
              <li>
                <a href="/college" className="hover:text-foreground transition-colors">
                  Student Clubs
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-foreground transition-colors">
                  Fellowships
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-foreground transition-colors">
                  Changelog &amp; Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block font-mono">
              Legal &amp; Trust
            </span>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-foreground transition-colors">
                  Contact &amp; Support
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-foreground transition-colors">
                  Plans &amp; Pricing
                </a>
              </li>
              <li>
                <a href="/api/health" target="_blank" className="hover:text-foreground transition-colors font-mono text-[11px]">
                  System Status ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CollegeCentre. Built with precision for student creators.</p>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Verified Student Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
