"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate = false, label, description, id, checked, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  const isChecked = indeterminate ? "indeterminate" : checked;

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      checked={isChecked}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-input bg-background shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus className="h-3 w-3 stroke-[3]" />
        ) : (
          <Check className="h-3 w-3 stroke-[3]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !description) {
    return checkboxElement;
  }

  return (
    <div className="flex items-start space-x-2.5">
      <div className="pt-0.5">{checkboxElement}</div>
      <div className="grid gap-1 leading-none select-none">
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
