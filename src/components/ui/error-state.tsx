import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  errorDetails?: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section. Please try again.",
  errorDetails,
  onRetry,
  retryLabel = "Try again",
  compact = false,
  className,
  ...props
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-lg border border-destructive/20 bg-destructive/5 text-foreground",
        compact ? "p-4 sm:p-6" : "p-8 sm:p-12",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>

      <h4 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h4>

      {message && (
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          {message}
        </p>
      )}

      {errorDetails && (
        <div className="mt-3 w-full max-w-md">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground underline"
          >
            {showDetails ? "Hide technical error" : "Show technical details"}
          </button>
          {showDetails && (
            <pre className="mt-2 text-left p-3 rounded bg-muted/80 text-[11px] font-mono text-foreground/80 overflow-x-auto border border-border/60">
              {errorDetails}
            </pre>
          )}
        </div>
      )}

      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ErrorBanner({
  message,
  onDismiss,
  className,
}: {
  message: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive font-medium",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-destructive/80 hover:text-destructive underline text-[11px]"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
