/**
 * CollegeCentre 2.0 Core Types
 * Phase 0: Design System & Project Foundation
 * Phase 2: Authentication & Onboarding
 */

export type ThemeMode = "light" | "dark" | "system";

export type ComponentSize = "xs" | "sm" | "default" | "md" | "lg" | "xl" | "2xl";

export type StatusVariant =
  | "default"
  | "secondary"
  | "brand"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// -------------------------------------------------------------
// Phase 2: Profiles, Usernames & Social Links
// -------------------------------------------------------------

export type ProfileTheme = "obsidian" | "academic" | "cobalt" | "terminal";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  college: string | null;
  course: string | null;
  graduation_year: number | null;
  theme: ProfileTheme;
  is_public: boolean;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "x"
  | "website"
  | "instagram"
  | "youtube"
  | "email"
  | "substack"
  | "other";

export interface SocialLink {
  id?: string;
  profile_id?: string;
  platform: SocialPlatform;
  title?: string;
  url: string;
  order_index: number;
}

export type LinkCategory =
  | "engineering"
  | "research"
  | "writing"
  | "portfolio"
  | "social"
  | "other";

export interface StudentLink {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  thumbnail_url?: string | null;
  category?: string | null;
  is_enabled: boolean;
  order_index: number;
  clicks_count?: number;
  last_clicked_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type LinkItem = StudentLink;

export interface OnboardingState {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  college: string;
  course: string;
  graduationYear: number | null;
  socialLinks: SocialLink[];
  theme: ProfileTheme;
}

export interface UsernameValidationResult {
  valid: boolean;
  available: boolean;
  error?: string;
}
