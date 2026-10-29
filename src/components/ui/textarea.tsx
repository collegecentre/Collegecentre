import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
  helperText?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helperText,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    const [charCount, setCharCount] = React.useState<number>(() => {
      if (typeof value === "string") return value.length;
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary/80 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={
            hasError || helperText || showCount ? `${textareaId}-desc` : undefined
          }
          {...props}
        />

        <div
          id={`${textareaId}-desc`}
          className="flex items-center justify-between text-xs"
        >
          {errorMessage || helperText ? (
            <p
              className={cn(
                "transition-colors",
                hasError ? "text-destructive font-medium" : "text-muted-foreground"
              )}
            >
              {errorMessage || helperText}
            </p>
          ) : (
            <span />
          )}

          {showCount && maxLength && (
            <span
              className={cn(
                "ml-auto font-mono text-[11px] tabular-nums",
                charCount >= maxLength ? "text-destructive font-medium" : "text-muted-foreground"
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
