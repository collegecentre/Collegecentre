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
// Phase 2 & 10: Profiles, Appearance & Curated Themes
// -------------------------------------------------------------

export type ProfileTheme =
  | "minimal"
  | "developer"
  | "creative"
  | "academic"
  | "professional"
  | "dark"
  // Legacy aliases supported for backward compatibility:
  | "obsidian"
  | "cobalt"
  | "terminal";

export type ThemeAccentColor = "default" | "emerald" | "blue" | "violet" | "amber" | "rose";
export type ThemeLayoutVariant = "centered" | "compact" | "editorial";
export type ThemeButtonStyle = "rounded" | "pill" | "sharp";
export type ThemeBackgroundStyle = "solid" | "gradient" | "dots" | "grid";

export interface ProfileAppearanceCustomization {
  theme?: ProfileTheme;
  theme_accent?: ThemeAccentColor | null;
  theme_layout?: ThemeLayoutVariant | null;
  theme_button?: ThemeButtonStyle | null;
  theme_background?: ThemeBackgroundStyle | null;
}

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
  theme_accent?: ThemeAccentColor | null;
  theme_layout?: ThemeLayoutVariant | null;
  theme_button?: ThemeButtonStyle | null;
  theme_background?: ThemeBackgroundStyle | null;
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

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  cover_image_url?: string | null;
  technologies: string[];
  github_url?: string | null;
  demo_url?: string | null;
  video_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_featured: boolean;
  is_enabled: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// -------------------------------------------------------------
// Phase 7: Verified Student Achievements & Honors
// -------------------------------------------------------------

export type AchievementType =
  | "hackathon"
  | "competition"
  | "award"
  | "open_source"
  | "academic"
  | "leadership"
  | "certification"
  | "other";

export interface Achievement {
  id: string;
  profile_id: string;
  title: string;
  description?: string | null;
  organization: string;
  type: AchievementType;
  date: string;
  image_url?: string | null;
  verification_url?: string | null;
  credential_id?: string | null;
  is_featured: boolean;
  is_enabled: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// -------------------------------------------------------------
// Phase 8: Verified Professional & Academic Certificates
// -------------------------------------------------------------

export interface Certificate {
  id: string;
  profile_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  image_url?: string | null;
  pdf_url?: string | null;
  description?: string | null;
  is_featured: boolean;
  is_enabled: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// -------------------------------------------------------------
// Phase 9: Student Resume & Professional Documents
// -------------------------------------------------------------

export interface Resume {
  id: string;
  profile_id: string;
  file_url: string;
  file_path: string;
  file_name: string;
  file_size: number; // in bytes
  title?: string | null;
  is_visible: boolean;
  uploaded_at: string;
  updated_at?: string;
}

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
