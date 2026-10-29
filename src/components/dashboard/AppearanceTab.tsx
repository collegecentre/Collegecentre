"use client";

import * as React from "react";
import {
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  Smartphone,
  Monitor,
  Eye,
  Layers,
  CircleDot,
  Square,
  Grid,
  Maximize2,
  Minimize2,
  Sliders,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { LiveProfileCard } from "./LiveProfileCard";
import {
  OFFICIAL_THEMES,
  getProfileTheme,
  type ProfileThemeConfig,
} from "@/lib/themes";
import { supabase } from "@/lib/supabase";
import type {
  Profile,
  SocialLink,
  ProfileTheme,
  ThemeAccentColor,
  ThemeLayoutVariant,
  ThemeButtonStyle,
  ThemeBackgroundStyle,
} from "@/types";
import { cn } from "@/lib/utils";

interface AppearanceTabProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onProfileUpdated?: (updatedProfile: Profile) => void;
}

const ACCENT_OPTIONS: Array<{
  id: ThemeAccentColor;
  label: string;
  colorClass: string;
  bgClass: string;
}> = [
  { id: "default", label: "Theme Default", colorClass: "bg-foreground", bgClass: "bg-muted" },
  { id: "emerald", label: "Terminal Emerald", colorClass: "bg-emerald-500", bgClass: "bg-emerald-500/10" },
  { id: "blue", label: "Cobalt Blue", colorClass: "bg-blue-600", bgClass: "bg-blue-500/10" },
  { id: "violet", label: "Creative Violet", colorClass: "bg-violet-600", bgClass: "bg-violet-500/10" },
  { id: "amber", label: "Oxford Amber", colorClass: "bg-amber-600", bgClass: "bg-amber-500/10" },
  { id: "rose", label: "Modern Rose", colorClass: "bg-rose-500", bgClass: "bg-rose-500/10" },
];

const BUTTON_OPTIONS: Array<{
  id: ThemeButtonStyle;
  label: string;
  sampleClass: string;
  description: string;
}> = [
  { id: "rounded", label: "Modern Rounded", sampleClass: "rounded-xl", description: "Balanced modern corners" },
  { id: "pill", label: "Curved Pill", sampleClass: "rounded-full", description: "Smooth full radius" },
  { id: "sharp", label: "Structured Sharp", sampleClass: "rounded-sm", description: "Crisp technical corners" },
];

const BACKGROUND_OPTIONS: Array<{
  id: ThemeBackgroundStyle;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "solid", label: "Solid Surface", description: "Pure flat surface canvas", icon: Square },
  { id: "gradient", label: "Atmospheric", description: "Soft directional tint", icon: Layers },
  { id: "dots", label: "Matrix Dots", description: "Subtle micro-grid dots", icon: CircleDot },
  { id: "grid", label: "Hairline Grid", description: "Engineering graph grid", icon: Grid },
];

const LAYOUT_OPTIONS: Array<{
  id: ThemeLayoutVariant;
  label: string;
  widthText: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "centered", label: "Balanced Centered", widthText: "576px", description: "Classic showcase width (max-w-xl)", icon: Maximize2 },
  { id: "compact", label: "Focus Compact", widthText: "512px", description: "Tighter single-column flow (max-w-lg)", icon: Minimize2 },
  { id: "editorial", label: "Studio Editorial", widthText: "672px", description: "Expanded portfolio canvas (max-w-2xl)", icon: Layers },
];

export function AppearanceTab({
  profile,
  socialLinks,
  onProfileUpdated,
}: AppearanceTabProps) {
  const { toast } = useToast();

  // Local editing state for instant live preview
  const [selectedTheme, setSelectedTheme] = React.useState<ProfileTheme>(
    profile.theme || "minimal"
  );
  const [selectedAccent, setSelectedAccent] = React.useState<ThemeAccentColor>(
    profile.theme_accent || "default"
  );
  const [selectedLayout, setSelectedLayout] = React.useState<ThemeLayoutVariant>(
    profile.theme_layout || "centered"
  );
  const [selectedButton, setSelectedButton] = React.useState<ThemeButtonStyle>(
    profile.theme_button || "rounded"
  );
  const [selectedBackground, setSelectedBackground] = React.useState<ThemeBackgroundStyle>(
    profile.theme_background || "solid"
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  // Keep state in sync if profile updates externally
  React.useEffect(() => {
    setSelectedTheme(profile.theme || "minimal");
    setSelectedAccent(profile.theme_accent || "default");
    setSelectedLayout(profile.theme_layout || "centered");
    setSelectedButton(profile.theme_button || "rounded");
    setSelectedBackground(profile.theme_background || "solid");
  }, [
    profile.theme,
    profile.theme_accent,
    profile.theme_layout,
    profile.theme_button,
    profile.theme_background,
  ]);

  // Derived transient profile object for instant live preview
  const previewProfile: Profile = React.useMemo(() => {
    return {
      ...profile,
      theme: selectedTheme,
      theme_accent: selectedAccent,
      theme_layout: selectedLayout,
      theme_button: selectedButton,
      theme_background: selectedBackground,
    };
  }, [
    profile,
    selectedTheme,
    selectedAccent,
    selectedLayout,
    selectedButton,
    selectedBackground,
  ]);

  // Dirty detection
  const hasChanges =
    selectedTheme !== (profile.theme || "minimal") ||
    selectedAccent !== (profile.theme_accent || "default") ||
    selectedLayout !== (profile.theme_layout || "centered") ||
    selectedButton !== (profile.theme_button || "rounded") ||
    selectedBackground !== (profile.theme_background || "solid");

  // Save Appearance Changes
  const handleSaveAppearance = async () => {
    if (!profile?.id) return;
    try {
      setIsSaving(true);

      const updates = {
        theme: selectedTheme,
        theme_accent: selectedAccent,
        theme_layout: selectedLayout,
        theme_button: selectedButton,
        theme_background: selectedBackground,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) throw error;

      const updated = {
        ...profile,
        ...updates,
      };

      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }

      toast({
        title: "Appearance Saved",
        description: `Your profile theme is now set to ${
          OFFICIAL_THEMES.find((t) => t.id === selectedTheme)?.name || selectedTheme
        }.`,
        variant: "success",
      });
    } catch (err: any) {
      console.error("Failed to save appearance:", err);
      toast({
        title: "Save Failed",
        description: err?.message || "Could not save appearance settings.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Theme Defaults
  const handleReset = () => {
    setSelectedTheme("minimal");
    setSelectedAccent("default");
    setSelectedLayout("centered");
    setSelectedButton("rounded");
    setSelectedBackground("solid");

    toast({
      title: "Reset to Default Preset",
      description: "Reverted appearance controls to the clean Minimal preset.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header with Actions and Mobile View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Themes &amp; Appearance
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              Phase 10
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personalize your showcase with curated design presets and controlled tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Mobile Segments */}
          <div className="flex lg:hidden rounded-lg bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "edit"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Customize</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                mobileView === "preview"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Reset Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Reset to default Minimal theme"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          {/* Save Action */}
          <Button
            type="button"
            size="sm"
            disabled={!hasChanges || isSaving}
            onClick={handleSaveAppearance}
            className={cn(
              "h-8 gap-1.5 text-xs font-semibold shadow-sm transition-all",
              hasChanges
                ? "bg-foreground text-background hover:bg-foreground/90 scale-[1.02]"
                : "opacity-60"
            )}
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Theme"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Theme Picker & Customization Controls */}
        <div
          className={cn(
            "lg:col-span-7 space-y-8",
            mobileView === "preview" ? "hidden lg:block" : "block"
          )}
        >
          {/* SECTION A: Curated Theme Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <span>Curated Theme Presets</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Professionally designed design systems tailored for student disciplines.
                </p>
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                6 Presets
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {OFFICIAL_THEMES.map((themePreset) => {
                const isSelected = selectedTheme === themePreset.id;
                const { previewColors } = themePreset;

                return (
                  <div
                    key={themePreset.id}
                    onClick={() => setSelectedTheme(themePreset.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 text-left group relative",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-card shadow-subtle"
                        : "border-border/80 bg-card/60 hover:bg-card hover:border-foreground/30 hover:shadow-sm"
                    )}
                  >
                    {/* Visual Mini Mockup Header */}
                    <div
                      className="w-full h-20 rounded-xl p-3 border flex flex-col justify-between overflow-hidden relative shadow-inner"
                      style={{
                        backgroundColor: previewColors.bg,
                        borderColor: previewColors.border,
                      }}
                    >
                      {/* Mini Identity Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-5 w-5 rounded-full border flex items-center justify-center font-bold text-[8px]"
                            style={{
                              backgroundColor: previewColors.surface,
                              borderColor: previewColors.border,
                              color: previewColors.text,
                            }}
                          >
                            CC
                          </div>
                          <div
                            className="h-2 w-16 rounded-full"
                            style={{ backgroundColor: previewColors.text, opacity: 0.8 }}
                          />
                        </div>

                        <div
                          className="h-2 w-6 rounded-full"
                          style={{ backgroundColor: previewColors.accent }}
                        />
                      </div>

                      {/* Mini Link Pill Mock */}
                      <div
                        className="w-full h-5 rounded-md border flex items-center justify-between px-2"
                        style={{
                          backgroundColor: previewColors.surface,
                          borderColor: previewColors.border,
                        }}
                      >
                        <div
                          className="h-1.5 w-20 rounded-full"
                          style={{ backgroundColor: previewColors.text, opacity: 0.6 }}
                        />
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: previewColors.accent }}
                        />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {themePreset.name}
                        </span>
                        <Badge
                          variant="outline"
                          size="sm"
                          className="text-[9px] font-mono uppercase px-1.5 py-0"
                        >
                          {themePreset.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {themePreset.tagline}
                      </p>
                    </div>

                    {/* Radio Check Indicator */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] font-mono">
                      <span className="text-muted-foreground">
                        {themePreset.fontFamily === "font-mono"
                          ? "Monospace"
                          : themePreset.fontFamily === "font-serif"
                          ? "Serif Editorial"
                          : "Clean Sans"}
                      </span>
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border text-transparent"
                        )}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION B: Controlled Accent Palette */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Accent Color Treatment
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Applies refined chromatic focus to verification badges, active links, and highlights.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ACCENT_OPTIONS.map((opt) => {
                const isActive = selectedAccent === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedAccent(opt.id)}
                    className={cn(
                      "p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left group",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border-border bg-card/60 hover:bg-card hover:border-foreground/30"
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full shrink-0 flex items-center justify-center shadow-xs",
                        opt.colorClass
                      )}
                    >
                      {isActive && <Check className="h-3 w-3 text-white stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION C: Button Geometry */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Interactive Button Style
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controls the corner radius and visual silhouette of links, chips, and actions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {BUTTON_OPTIONS.map((btn) => {
                const isActive = selectedButton === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedButton(btn.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left space-y-2 transition-all",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card/60 hover:bg-card hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {btn.label}
                      </span>
                      {isActive && <Check className="h-3 w-3 text-primary stroke-[3]" />}
                    </div>

                    {/* Visual Pill Sample */}
                    <div
                      className={cn(
                        "h-6 border border-border bg-muted/60 flex items-center justify-center text-[10px] font-mono text-muted-foreground",
                        btn.sampleClass
                      )}
                    >
                      Sample Link
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION D: Background Texture Treatment */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Background Texture
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Subtle mathematical grid patterns or solid clean canvas.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BACKGROUND_OPTIONS.map((bg) => {
                const Icon = bg.icon;
                const isActive = selectedBackground === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBackground(bg.id)}
                    className={cn(
                      "p-3 rounded-xl border text-center space-y-1.5 transition-all flex flex-col items-center justify-center",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border-border bg-card/60 hover:bg-card hover:border-foreground/30"
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground block">
                      {bg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION E: Layout Canvas Variant */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Profile Layout Width
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Adjust showcase canvas width while preserving strict responsive typography.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {LAYOUT_OPTIONS.map((layout) => {
                const isActive = selectedLayout === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => setSelectedLayout(layout.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left space-y-1 transition-all",
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card/60 hover:bg-card hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {layout.label}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {layout.widthText}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {layout.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Live Profile Showcase Preview */}
        <div
          className={cn(
            "lg:col-span-5 sticky top-24 space-y-3",
            mobileView === "edit" ? "hidden lg:block" : "block"
          )}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
              Real-Time Dynamic Preview
            </span>
            <Badge variant="outline" size="sm" className="font-mono text-[10px] capitalize">
              {selectedTheme}
            </Badge>
          </div>

          <LiveProfileCard
            profile={previewProfile}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </div>
  );
}
