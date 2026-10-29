"use client";

import * as React from "react";
import Link from "next/link";
import { Share2, QrCode, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileShareModal } from "./ProfileShareModal";
import type { Profile } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ProfileFooterProps {
  profile: Profile;
  themeConfig: ProfileThemeConfig;
}

export function ProfileFooter({ profile, themeConfig }: ProfileFooterProps) {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);

  return (
    <footer className="pt-6 pb-4 border-t border-border/50 text-center space-y-5">
      {/* Action Buttons: Share Showcase & QR */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareModalOpen(true)}
          className={cn(
            "text-xs font-medium shadow-xs transition-transform active:scale-95 gap-1.5",
            themeConfig.socialButton
          )}
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Profile</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareModalOpen(true)}
          className={cn(
            "text-xs font-medium shadow-xs transition-transform active:scale-95 gap-1.5",
            themeConfig.socialButton
          )}
        >
          <QrCode className="h-3.5 w-3.5" />
          <span>Show QR</span>
        </Button>
      </div>

      {/* CollegeCentre Branding & Pitch */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="h-6 w-6 rounded-md bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
            CC
          </div>
          <span className="font-semibold text-xs tracking-tight text-foreground">
            CollegeCentre
          </span>
        </Link>

        <p className={cn("text-[11px] leading-relaxed max-w-xs mx-auto", themeConfig.footerMuted)}>
          One link for everything you&apos;ve built, achieved, and are.
        </p>

        <div className="pt-1">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4 group"
          >
            <Sparkles className="h-3 w-3 text-brand" />
            <span>Create your free CollegeCentre page</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Full QR & Share Modal */}
      <ProfileShareModal
        profile={profile}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </footer>
  );
}
