import * as React from "react";
import { FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-border/80 bg-muted/10",
        compact ? "py-8 px-4" : "py-12 sm:py-16 px-6",
        className
      )}
      {...props}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted border border-border/60 text-muted-foreground mb-3.5 shadow-subtle">
        {icon || <FolderKanban className="h-5 w-5" />}
      </div>

      <h4 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h4>

      {description && (
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {action && (
            <Button
              size="sm"
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
