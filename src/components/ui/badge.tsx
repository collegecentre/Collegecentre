import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border text-foreground hover:bg-muted/50",
        brand:
          "border-brand/30 bg-brand/10 text-brand dark:text-brand font-semibold hover:bg-brand/15",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive font-medium",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] leading-tight",
        default: "px-2.5 py-0.5 text-xs leading-normal",
        lg: "px-3 py-1 text-xs font-semibold leading-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColor ||
              (variant === "success"
                ? "bg-emerald-500"
                : variant === "warning"
                ? "bg-amber-500"
                : variant === "brand"
                ? "bg-brand"
                : variant === "destructive"
                ? "bg-destructive"
                : "bg-current")
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
