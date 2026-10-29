import * as React from "react";
import Link from "next/link";
import { Lock, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

interface PrivateProfileViewProps {
  profile: Profile;
}

export function PrivateProfileView({ profile }: PrivateProfileViewProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Brand mark */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
            CC
          </div>
          <span className="font-bold tracking-tight text-base">CollegeCentre</span>
        </Link>

        <Card className="p-8 border-border shadow-subtle space-y-5 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                This Profile is Private
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <span className="font-mono text-foreground font-medium">@{profile.username}</span> has set their student showcase to private mode. Only the owner can view or edit this profile.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link href="/login" className="w-full">
              <Button
                variant="default"
                size="sm"
                className="w-full justify-center text-xs shadow-subtle"
                leftIcon={<LogIn className="h-3.5 w-3.5" />}
              >
                Log In to Dashboard
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs"
                leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              >
                Back to CollegeCentre
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          CollegeCentre 2.0 • Premium Student Identity
        </p>
      </div>
    </div>
  );
}
