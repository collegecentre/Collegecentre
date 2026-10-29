/**
 * CollegeCentre 2.0 Core Types
 * Phase 0: Design System & Project Foundation
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
