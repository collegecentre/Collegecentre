import * as React from "react";
import { Compass, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardTab } from "./dashboard-types";

interface PlaceholderTabProps {
  tab: DashboardTab;
  onNavigateTab: (tab: DashboardTab) => void;
}

export function PlaceholderTab({ tab, onNavigateTab }: PlaceholderTabProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 animate-in fade-in duration-150 text-center">
      <Card className="p-8 sm:p-12 border-border shadow-subtle space-y-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border text-foreground">
          <Compass className="h-6 w-6 text-brand" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Section Not Found
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The tab &ldquo;{tab}&rdquo; is not available or is currently being updated. Return to your overview to continue managing your student profile.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => onNavigateTab("overview")}
            className="text-xs"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Back to Overview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab("profile")}
            className="text-xs"
          >
            Edit Profile
          </Button>
        </div>
      </Card>
    </div>
  );
}
