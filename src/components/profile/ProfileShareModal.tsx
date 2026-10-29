"use client";

import * as React from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  Eye,
  MessageSquare,
  ShieldCheck,
  Send,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64c0-.9-.74-1.64-1.64-1.64a1.64 1.64 0 0 0-1.64 1.64c0 .9.74 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ProfileShareModalProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileShareModal({
  profile,
  open,
  onOpenChange,
}: ProfileShareModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"qr" | "share" | "preview">("qr");
  const [copied, setCopied] = React.useState(false);
  const [svgString, setSvgString] = React.useState<string>("");
  const [pngDataUrl, setPngDataUrl] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState(true);

  // Compute clean vanity URL.
  // Note: ONLY the clean profile URL is encoded into the QR code per Phase 11 requirements.
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username}`
    : `https://collegecentre.in/${profile.username}`;

  const displayName = profile.full_name || `@${profile.username}`;
  const displayBio =
    profile.bio ||
    `Explore ${displayName}'s verified student portfolio, projects, and academic credentials on CollegeCentre.`;

  // Generate QR code (SVG + high-res PNG) whenever modal opens or profile changes
  React.useEffect(() => {
    let isCancelled = false;

    async function generateQRCodes() {
      try {
        setIsGenerating(true);

        // 1. Generate crisp vector SVG string
        const svg = await QRCode.toString(profileUrl, {
          type: "svg",
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#09090b",
            light: "#ffffff",
          },
        });

        // 2. Generate high-res 1024x1024 PNG data URL for print & download
        const png = await QRCode.toDataURL(profileUrl, {
          width: 1024,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#09090b",
            light: "#ffffff",
          },
        });

        if (!isCancelled) {
          setSvgString(svg);
          setPngDataUrl(png);
        }
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }

    if (open) {
      generateQRCodes();
    }

    return () => {
      isCancelled = true;
    };
  }, [open, profileUrl]);

  // Copy Profile URL to Clipboard
  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      trackAnalyticsEvent({
        profileId: profile.id,
        eventType: "share_event",
        resourceId: "copy_url",
        resourceTitle: "Copied Profile URL",
      });
      toast({
        title: "Profile URL Copied",
        description: `${profileUrl} copied to your clipboard.`,
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} • CollegeCentre`,
          text: `Explore ${displayName}'s student showcase and projects on CollegeCentre`,
          url: profileUrl,
        });
        trackAnalyticsEvent({
          profileId: profile.id,
          eventType: "share_event",
          resourceId: "web_share",
          resourceTitle: "Native Web Share",
        });
        toast({
          title: "Shared Successfully",
          variant: "success",
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Web share failed:", err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Download High-Resolution PNG
  const handleDownloadPng = () => {
    if (!pngDataUrl) return;
    const a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = `${profile.username}_collegecentre_qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    trackAnalyticsEvent({
      profileId: profile.id,
      eventType: "share_event",
      resourceId: "qr_download_png",
      resourceTitle: "Downloaded QR PNG",
    });

    toast({
      title: "QR Code Downloaded (PNG)",
      description: "Saved high-resolution 1024x1024 image for resumes and print.",
      variant: "success",
    });
  };

  // Download Vector SVG
  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.username}_collegecentre_qr.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackAnalyticsEvent({
      profileId: profile.id,
      eventType: "share_event",
      resourceId: "qr_download_svg",
      resourceTitle: "Downloaded QR SVG",
    });

    toast({
      title: "QR Code Downloaded (SVG)",
      description: "Saved vector SVG for infinite resolution scaling.",
      variant: "success",
    });
  };

  // Direct Social Share URLs
  const shareText = encodeURIComponent(
    `Check out ${displayName}'s verified student showcase on CollegeCentre:`
  );
  const encodedUrl = encodeURIComponent(profileUrl);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsAppShareUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(
    `${displayName} on CollegeCentre`
  )}&body=${encodeURIComponent(
    `Hi,\n\nCheck out my student showcase, projects, and achievements on CollegeCentre:\n${profileUrl}\n\nBest,\n${displayName}`
  )}`;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 border-border bg-card overflow-hidden shadow-modal">
        {/* Top Header */}
        <DialogHeader className="p-5 pb-3 border-b border-border/40 bg-muted/20 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Profile &amp; QR
              </Badge>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-brand" />
                Verified Sharing
              </span>
            </div>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground pt-1">
            Share Showcase &amp; QR
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Connect recruiters and peers directly to your personal CollegeCentre URL.
          </DialogDescription>

          {/* Segmented Tab Controls */}
          <div className="flex rounded-lg bg-muted p-1 border border-border/80 mt-3">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === "qr"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("share")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === "share"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Social Preview</span>
            </button>
          </div>
        </DialogHeader>

        {/* Tab 1: QR Code Card */}
        {activeTab === "qr" && (
          <div className="p-6 space-y-5 animate-in fade-in-50 duration-150">
            {/* Visual QR Poster Frame */}
            <div className="rounded-2xl border border-border bg-white text-zinc-950 p-6 flex flex-col items-center text-center shadow-sm space-y-4 relative">
              {/* Student Identity in Frame */}
              <div className="flex items-center gap-2.5">
                <Avatar size="sm" className="ring-2 ring-zinc-200">
                  {profile.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt={displayName} />
                  )}
                  <AvatarFallback className="bg-zinc-900 text-white font-bold text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <span className="text-xs font-bold text-zinc-900 block leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 block">
                    collegecentre.in/{profile.username}
                  </span>
                </div>
              </div>

              {/* Rendered QR Code */}
              <div className="relative p-3 rounded-xl bg-white border border-zinc-200 shadow-inner flex items-center justify-center">
                {isGenerating ? (
                  <div className="h-44 w-44 flex items-center justify-center text-xs text-zinc-400 font-mono">
                    Generating QR...
                  </div>
                ) : (
                  <div
                    className="h-44 w-44 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: svgString }}
                  />
                )}

                {/* Minimal Centered CC Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-9 w-9 rounded-lg bg-zinc-950 text-white border-2 border-white shadow-md flex items-center justify-center font-bold font-mono text-[10px] tracking-tight">
                    CC
                  </div>
                </div>
              </div>

              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-zinc-900 block">
                  Scan to View Verified Student Profile
                </span>
                <p className="text-[9px] font-mono text-zinc-400">
                  Direct destination • No tracking intermediaries
                </p>
              </div>
            </div>

            {/* QR Download & Export Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPng}
                  disabled={isGenerating}
                  className="h-9 text-xs gap-1.5 font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSvg}
                  disabled={isGenerating}
                  className="h-9 text-xs gap-1.5 font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download SVG</span>
                </Button>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="w-full h-9 text-xs gap-1.5 font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied URL to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Profile Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Share Link & Social Networks */}
        {activeTab === "share" && (
          <div className="p-6 space-y-5 animate-in fade-in-50 duration-150">
            {/* Vanity URL Copy Block */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block font-semibold">
                Your Public Showcase URL
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/60 border border-border">
                <span className="text-xs font-mono text-foreground font-medium truncate flex-1 px-1 select-all">
                  {profileUrl}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-7 px-3 text-xs shrink-0 gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Native OS Web Share */}
            {typeof navigator !== "undefined" && typeof (navigator as any).share === "function" && (
              <Button
                type="button"
                onClick={handleNativeShare}
                variant="outline"
                className="w-full h-10 text-xs font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Smartphone className="h-4 w-4" />
                <span>Share via Device (WhatsApp, AirDrop, Messages)</span>
              </Button>
            )}

            {/* Direct Social Shortcuts */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block font-semibold">
                Direct Channels
              </span>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsAppShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs font-medium text-foreground transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">WhatsApp</span>
                </a>

                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card hover:border-blue-500/40 hover:bg-blue-500/5 text-xs font-medium text-foreground transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">LinkedIn</span>
                </a>

                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card hover:border-foreground/40 hover:bg-muted text-xs font-medium text-foreground transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg bg-foreground/10 text-foreground flex items-center justify-center shrink-0">
                    <XIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">X (Twitter)</span>
                </a>

                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card hover:border-sky-500/40 hover:bg-sky-500/5 text-xs font-medium text-foreground transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Send className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">Telegram</span>
                </a>
              </div>

              <a
                href={emailShareUrl}
                className="flex items-center justify-center gap-2 p-2 rounded-xl border border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors w-full"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Send via Email</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 3: Open Graph Social Preview Card */}
        {activeTab === "preview" && (
          <div className="p-6 space-y-4 animate-in fade-in-50 duration-150">
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block font-semibold">
                Social Link Snippet Preview
              </span>
              <p className="text-[11px] text-muted-foreground">
                How your CollegeCentre link looks when shared on LinkedIn, X, or iMessage.
              </p>
            </div>

            {/* Realistic Social Share Snippet Card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-subtle group">
              {/* Media Banner */}
              <div className="h-32 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-4 flex flex-col justify-between text-white relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-[10px]">
                      CC
                    </div>
                    <span className="text-xs font-bold tracking-tight">CollegeCentre</span>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[9px] font-mono border-white/20 text-white/80">
                    Verified Showcase
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar size="md" className="ring-2 ring-white/30 shrink-0">
                    {profile.avatar_url && (
                      <AvatarImage src={profile.avatar_url} alt={displayName} />
                    )}
                    <AvatarFallback className="bg-white/20 text-white font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-sm font-bold truncate block">{displayName}</span>
                    <span className="text-[10px] text-white/70 font-mono truncate block">
                      {profile.college || "Verified Student"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Card Body */}
              <div className="p-4 space-y-1 bg-card">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                  collegecentre.in
                </span>
                <h4 className="text-sm font-bold text-foreground tracking-tight leading-snug">
                  {displayName} • CollegeCentre
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {displayBio}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="w-full h-9 text-xs gap-1.5 font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Verified Link</span>
              </Button>
            </div>
          </div>
        )}

        {/* Modal Bottom Branding Footer */}
        <div className="px-5 py-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>collegecentre.in/{profile.username}</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-brand" />
            Verified Student Platform
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
