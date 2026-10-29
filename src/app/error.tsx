"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/lib/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled route error captured by error boundary", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Brand mark */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
            CC
          </div>
          <span className="font-bold tracking-tight text-lg">CollegeCentre</span>
        </Link>

        <Card className="p-8 border-border shadow-subtle space-y-5 text-center">
          <div className="inline-flex items-center justify-center">
            <Badge variant="outline" className="font-mono text-xs px-3 py-1 border-rose-500/30 text-rose-600 dark:text-rose-400 gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Application Error</span>
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We encountered an unexpected error while loading this page. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-muted-foreground/60 pt-1">
                Reference ID: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="default"
              size="sm"
              onClick={() => reset()}
              className="flex-1 justify-center text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </Button>

            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          CollegeCentre 2.0 • Reliability &amp; Production Hardening
        </p>
      </div>
    </div>
  );
}
