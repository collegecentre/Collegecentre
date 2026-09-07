import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium",
        warning:
          "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium",
        matchHigh:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-bold shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        matchMid:
          "border-indigo-200 bg-indigo-50 text-indigo-700 font-bold shadow-xs dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
        matchNormal:
          "border-slate-200 bg-slate-100 text-slate-700 font-medium dark:bg-slate-800 dark:text-slate-300",
        passActive:
          "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
        passExpired:
          "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
