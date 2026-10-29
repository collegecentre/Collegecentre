import * as React from "react";
import {
  Compass,
  User,
  Link2,
  GitBranch,
  Award,
  FileCheck2,
  FileText,
  Palette,
  BarChart3,
  Settings,
} from "lucide-react";
import type { DashboardTab } from "./dashboard-types";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  className?: string;
}

const NAV_ITEMS: Array<{
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPlaceholder?: boolean;
}> = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "profile", label: "Profile", icon: User },
  { id: "links", label: "Links", icon: Link2 },
  { id: "projects", label: "Projects", icon: GitBranch },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "certificates", label: "Certificates", icon: FileCheck2 },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3, isPlaceholder: true },
  { id: "settings", label: "Settings", icon: Settings, isPlaceholder: true },
];

export function DashboardNav({ activeTab, onTabChange, className }: DashboardNavProps) {
  return (
    <nav
      aria-label="Dashboard Sections"
      className={cn("flex items-center gap-1 overflow-x-auto no-scrollbar py-1", className)}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 select-none",
              isActive
                ? "bg-foreground text-background font-semibold shadow-subtle"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{item.label}</span>
            {item.isPlaceholder && (
              <span
                className={cn(
                  "text-[9px] font-mono px-1 py-0.2 rounded uppercase",
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                P
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
