export type DashboardTab =
  | "overview"
  | "profile"
  | "links"
  | "projects"
  | "achievements"
  | "certificates"
  | "resume"
  | "appearance"
  | "analytics"
  | "settings";

export interface DashboardNavSection {
  id: DashboardTab;
  label: string;
  badge?: string;
  isPlaceholder?: boolean;
  phase?: string;
}
