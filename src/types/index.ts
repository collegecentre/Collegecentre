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
  is_discoverable?: boolean;
  location?: string | null;
  category?: string | null;
  skills?: string[];
  is_featured?: boolean;
  views_count?: number;
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

// -------------------------------------------------------------
// Phase 12: Privacy-Conscious Student Analytics & Insights
// -------------------------------------------------------------

export type AnalyticsEventType =
  | "profile_view"
  | "link_click"
  | "project_view"
  | "project_click"
  | "resume_view"
  | "resume_download"
  | "share_event";

export type AnalyticsDeviceType = "desktop" | "mobile" | "tablet" | "other";

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  event_type: AnalyticsEventType;
  resource_id?: string | null;
  resource_title?: string | null;
  referrer_host?: string | null;
  device_type?: AnalyticsDeviceType | null;
  created_at: string;
}

export type AnalyticsTimeFilter = "7d" | "30d" | "90d" | "all";

export interface AnalyticsOverviewMetrics {
  totalProfileViews: number;
  totalLinkClicks: number;
  totalProjectInteractions: number;
  totalResumeInteractions: number;
  totalShareEvents: number;
  clickThroughRate: number; // percentage (clicks / views * 100)
  viewsChangePercent?: number | null;
  clicksChangePercent?: number | null;
}

export interface AnalyticsDailyPoint {
  date: string; // YYYY-MM-DD
  label: string; // "Oct 24"
  profileViews: number;
  linkClicks: number;
  projectInteractions: number;
  resumeInteractions: number;
  totalEvents: number;
}

export interface AnalyticsTopContentItem {
  id: string;
  title: string;
  subtitle?: string | null;
  count: number;
  percentage: number;
  category?: string | null;
}

export interface AnalyticsReferrerItem {
  host: string;
  count: number;
  percentage: number;
}

export interface AnalyticsDeviceBreakdown {
  device: AnalyticsDeviceType;
  label: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  timeFilter: AnalyticsTimeFilter;
  metrics: AnalyticsOverviewMetrics;
  dailyPoints: AnalyticsDailyPoint[];
  topLinks: AnalyticsTopContentItem[];
  topProjects: AnalyticsTopContentItem[];
  topReferrers: AnalyticsReferrerItem[];
  deviceBreakdown: AnalyticsDeviceBreakdown[];
  totalEventsCount: number;
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

// -------------------------------------------------------------
// Phase 13: Student Network Explore & Discovery
// -------------------------------------------------------------

export type ExploreCategory =
  | "all"
  | "engineering"
  | "research"
  | "design"
  | "product"
  | "writing"
  | "other";

export type ExploreSection = "all" | "featured" | "popular" | "recent" | "projects";

export interface ExploreFilters {
  query?: string;
  college?: string;
  course?: string;
  graduationYear?: number | string;
  skill?: string;
  category?: string;
  location?: string;
  section?: ExploreSection;
  view?: "all" | "students" | "projects";
}

export interface ExploreStudentCardData {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  college: string | null;
  course: string | null;
  graduation_year: number | null;
  location?: string | null;
  category?: string | null;
  skills: string[];
  theme: ProfileTheme;
  is_featured: boolean;
  views_count: number;
  projects_count: number;
  achievements_count: number;
  top_project?: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    github_url?: string | null;
    demo_url?: string | null;
    cover_image_url?: string | null;
  } | null;
  created_at: string;
}

export interface ExploreProject extends Project {
  author?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    college: string | null;
  } | null;
}

export interface ExploreResponse {
  students: ExploreStudentCardData[];
  projects: ExploreProject[];
  totalStudents: number;
  totalProjects: number;
  page: number;
  limit: number;
  hasMore: boolean;
  availableColleges: string[];
  availableSkills: string[];
  availableYears: number[];
  availableCategories: string[];
}
