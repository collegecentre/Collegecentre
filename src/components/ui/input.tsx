import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: boolean | string;
  helperText?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      prefixElement,
      suffixElement,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-foreground select-none"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-md border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:border-primary/80",
            hasError && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
            disabled && "cursor-not-allowed opacity-50 bg-muted/40"
          )}
        >
          {prefixElement && (
            <div className="flex shrink-0 items-center pl-3 text-muted-foreground select-none">
              {prefixElement}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed",
              prefixElement && "pl-2",
              suffixElement && "pr-2",
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError || helperText ? `${inputId}-desc` : undefined
            }
            {...props}
          />

          {suffixElement && (
            <div className="flex shrink-0 items-center pr-3 text-muted-foreground select-none">
              {suffixElement}
            </div>
          )}
        </div>

        {(errorMessage || helperText) && (
          <p
            id={`${inputId}-desc`}
            className={cn(
              "text-xs leading-none transition-colors",
              hasError ? "text-destructive font-medium" : "text-muted-foreground"
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
