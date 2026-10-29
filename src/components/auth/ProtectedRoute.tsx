"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/loading";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({
  children,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireOnboarding && profile && !profile.onboarding_completed && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [user, profile, isLoading, requireOnboarding, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-3">
        <Spinner size="lg" color="brand" />
        <p className="text-xs font-mono text-muted-foreground animate-pulse">
          Verifying student session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
