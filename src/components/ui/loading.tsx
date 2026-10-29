import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    spinnerColor: {
      default: "text-muted-foreground",
      primary: "text-primary",
      brand: "text-brand",
      current: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    spinnerColor: "default",
  },
});

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof spinnerVariants> {
  color?: "default" | "primary" | "brand" | "current";
}

export function Spinner({ className, size, spinnerColor, color, ...props }: SpinnerProps) {
  const chosenColor = color || spinnerColor || "default";

  return (
    <Loader2
      className={cn(spinnerVariants({ size, spinnerColor: chosenColor }), className)}
      aria-label="Loading"
      {...props}
    />
  );
}

export function ProgressBar({
  value,
  max = 100,
  indeterminate = false,
  className,
}: {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  className?: string;
}) {
  const percentage = indeterminate
    ? undefined
    : Math.min(100, Math.max(0, ((value || 0) / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-muted/80",
        className
      )}
    >
      {indeterminate ? (
        <div className="h-full w-1/3 rounded-full bg-primary animate-[pulse_1.5s_ease-in-out_infinite]" />
      ) : (
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  );
}

export function LoadingOverlay({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] transition-all duration-200",
        className
      )}
    >
      <Spinner size="lg" color="primary" />
      {message && (
        <p className="mt-2 text-xs font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
