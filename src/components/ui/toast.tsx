"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000, action }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, variant, duration, action };

      setToasts((prev) => [...prev.slice(-4), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 pointer-events-none w-full sm:w-auto"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-card transition-all duration-200 animate-in slide-in-from-bottom-3 fade-in-0 bg-background text-foreground",
              item.variant === "success" && "border-emerald-500/30 bg-background text-foreground",
              item.variant === "error" && "border-destructive/30 bg-background text-foreground",
              item.variant === "warning" && "border-amber-500/30 bg-background text-foreground",
              item.variant === "info" && "border-brand/30 bg-background text-foreground",
              item.variant === "default" && "border-border"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {item.variant === "success" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {item.variant === "error" && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {item.variant === "warning" && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              {item.variant === "info" && (
                <Info className="h-4 w-4 text-brand" />
              )}
              {item.variant === "default" && (
                <div className="h-2 w-2 rounded-full bg-primary mt-1" />
              )}
            </div>

            <div className="grid flex-1 gap-0.5">
              <p className="text-sm font-medium leading-tight">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.action && (
                <button
                  type="button"
                  onClick={item.action.onClick}
                  className="mt-1.5 self-start text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {item.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
