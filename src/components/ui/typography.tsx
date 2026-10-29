import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display:
        "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]",
      h1: "text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight",
      h2: "text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug",
      h3: "text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug",
      h4: "text-base sm:text-lg font-medium tracking-normal text-foreground leading-normal",
      lead: "text-lg sm:text-xl text-muted-foreground leading-relaxed font-normal",
      body: "text-sm sm:text-base leading-relaxed text-foreground/90",
      bodySm: "text-xs sm:text-sm leading-normal text-muted-foreground",
      caption: "text-xs text-muted-foreground leading-tight",
      eyebrow:
        "text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/90 font-mono",
      code: "font-mono text-xs sm:text-sm bg-muted/70 px-1.5 py-0.5 rounded border border-border/50 text-foreground tabular-nums",
      link: "text-sm font-medium text-foreground underline-offset-4 hover:underline cursor-pointer transition-colors",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type ElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "code" | "a";

const defaultElementMap: Record<NonNullable<VariantProps<typeof typographyVariants>["variant"]>, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  body: "p",
  bodySm: "p",
  caption: "span",
  eyebrow: "div",
  code: "code",
  link: "a",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: ElementType;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, children, ...props }, ref) => {
    const Component = (as || defaultElementMap[variant || "body"] || "p") as React.ElementType;

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Typography.displayName = "Typography";
