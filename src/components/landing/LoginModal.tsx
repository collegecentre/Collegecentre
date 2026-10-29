"use client";

import * as React from "react";
import { Mail, GitBranch, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenClaim?: () => void;
}

export function LoginModal({ open, onOpenChange, onOpenClaim }: LoginModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSimulateLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: `${provider} Connected`,
        description: "Authentication preview mode. Full account onboarding arrives in Phase 2.",
        variant: "info",
      });
    }, 700);
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
            variant="outline"
            className="w-full justify-start text-sm h-10"
            disabled={isLoading}
            onClick={() => handleSimulateLogin("Email Magic Link")}
            leftIcon={<Mail className="h-4 w-4 text-brand" />}
          >
            Continue with Email
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-sm h-10"
            disabled={isLoading}
            onClick={() => handleSimulateLogin("GitHub Student")}
            leftIcon={<GitBranch className="h-4 w-4" />}
          >
            Continue with GitHub
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
