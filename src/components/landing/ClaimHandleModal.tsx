"use client";

import * as React from "react";
import { CheckCircle2, Sparkles, ArrowRight, School, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export interface ClaimHandleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialHandle?: string;
}

export function ClaimHandleModal({
  open,
  onOpenChange,
  initialHandle = "",
}: ClaimHandleModalProps) {
  const [handle, setHandle] = React.useState(() => initialHandle || "yourname");
  const [college, setCollege] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReserved, setIsReserved] = React.useState(false);
  const { toast } = useToast();

  // Reset handle when modal opens with a new initial handle
  React.useEffect(() => {
    if (open && initialHandle) {
      setHandle(initialHandle.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
    }
  }, [open, initialHandle]);

  const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanHandle) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsReserved(true);

    toast({
      title: "Handle Reserved!",
      description: `collegecentre.in/${cleanHandle} is reserved for your student onboarding.`,
      variant: "success",
    });
  };

  const handleClose = () => {
    setIsReserved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        {!isReserved ? (
          <form onSubmit={handleClaim} className="space-y-5">
            <DialogHeader className="text-left space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="brand" dot size="sm">
                  Limited Student Beta
                </Badge>
              </div>
              <DialogTitle className="text-xl">Claim your student link</DialogTitle>
              <DialogDescription>
                Reserve your unique vanity URL. One link for your projects, achievements, and identity.
              </DialogDescription>
            </DialogHeader>

            {/* Handle Preview */}
            <div className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">Your public link:</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Available
                </span>
              </div>
              <div className="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus-within:ring-2 focus-within:ring-ring">
                <span className="text-muted-foreground select-none">collegecentre.in/</span>
                <input
                  type="text"
                  value={cleanHandle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="alex"
                  className="w-full bg-transparent outline-none pl-0.5 font-semibold text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            {/* Quick Details */}
            <div className="space-y-3">
              <Input
                label="College / University"
                placeholder="e.g. UC Berkeley, IIT Bombay, MIT"
                prefixElement={<School className="h-4 w-4 text-muted-foreground" />}
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@email.com"
                prefixElement={<User className="h-4 w-4 text-muted-foreground" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Used to set up your account and verify your profile."
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Claim Handle
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-xl">Handle reserved!</DialogTitle>
              <DialogDescription className="text-sm">
                <span className="font-mono font-semibold text-foreground">
                  collegecentre.in/{cleanHandle}
                </span>{" "}
                is locked for you. When Phase 2 authentication opens, you&apos;ll be first in line to publish your showcase.
              </DialogDescription>
            </div>

            <div className="pt-2">
              <Button variant="default" className="w-full" onClick={handleClose}>
                Done & Return to Preview
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
