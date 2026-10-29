"use client";

import * as React from "react";
import Link from "next/link";
import { Share2, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Profile } from "@/types";
import type { ProfileThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ProfileFooterProps {
  profile: Profile;
  themeConfig: ProfileThemeConfig;
}

export function ProfileFooter({ profile, themeConfig }: ProfileFooterProps) {
  const { toast } = useToast();
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username}`
    : `https://collegecentre.in/${profile.username}`;

  const handleShareClick = async () => {
    // If native mobile sharing is available, prefer it
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name || profile.username} | CollegeCentre`,
          text: `Check out ${profile.full_name || profile.username}'s student showcase on CollegeCentre`,
          url: profileUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setShareModalOpen(true);
        }
        return;
      }
    }
    // Otherwise open desktop share modal
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "Showcase Link Copied",
      description: `${profileUrl} copied to clipboard.`,
      variant: "default",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Check out ${profile.full_name || `@${profile.username}`}'s student showcase on CollegeCentre:`
  );
  const encodedUrl = encodeURIComponent(profileUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;

  return (
    <footer className="pt-6 pb-4 border-t border-border/50 text-center space-y-5">
      {/* Action Buttons: Share Showcase */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareClick}
          className={cn(
            "text-xs font-medium shadow-xs transition-transform active:scale-95",
            themeConfig.socialButton
          )}
          leftIcon={<Share2 className="h-3.5 w-3.5" />}
        >
          Share Profile
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

      {/* Share Dialog Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-md p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Share Student Showcase
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share {profile.full_name || profile.username}&apos;s profile across networks or copy the direct vanity URL.
            </DialogDescription>
          </DialogHeader>

          {/* Vanity URL Copy Field */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
            <span className="text-xs font-mono text-muted-foreground truncate flex-1 px-1">
              {profileUrl}
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              Share on X
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
