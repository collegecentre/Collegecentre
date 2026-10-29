"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";

export interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenClaim?: () => void;
}

export function LoginModal({ open, onOpenChange, onOpenClaim }: LoginModalProps) {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);
    if (!error) {
      onOpenChange(false);
      router.push("/dashboard");
    } else {
      toast({ title: "Google login failed", description: error.message, variant: "error" });
    }
  };

  const handleNavigateLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">
              Student Identity Portal
            </Badge>
          </div>
          <DialogTitle className="text-xl">Sign in to CollegeCentre</DialogTitle>
          <DialogDescription>
            Access your student showcase, edit your links, and view your verified profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            variant="default"
            className="w-full justify-center text-xs font-semibold h-10"
            onClick={handleNavigateLogin}
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Sign in with Email &amp; Password
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-center text-xs font-semibold h-10 border-border hover:bg-muted/60"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="pt-4 border-t border-border/60 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have a student showcase yet?
          </p>
          <Button
            variant="link"
            size="sm"
            className="text-xs font-semibold text-primary"
            onClick={() => {
              onOpenChange(false);
              if (onOpenClaim) onOpenClaim();
            }}
          >
            Claim your free student link <ArrowRight className="ml-1 h-3 w-3 inline" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
