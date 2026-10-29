"use client";

import * as React from "react";
import { X, ShieldCheck, Mail, Loader2, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import type { College } from "@/types";
import { requestCollegeVerification } from "@/lib/college-service";

interface RequestVerificationModalProps {
  college: College;
  isOpen: boolean;
  onClose: () => void;
  adminUserId: string;
  onVerificationSubmitted: () => void;
}

export function RequestVerificationModal({
  college,
  isOpen,
  onClose,
  adminUserId,
  onVerificationSubmitted,
}: RequestVerificationModalProps) {
  const { toast } = useToast();
  const [domain, setDomain] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    if (!cleanDomain || !cleanDomain.includes(".")) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid academic or institutional domain (e.g. mit.edu, nitc.ac.in).",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestCollegeVerification(college.id, adminUserId, cleanDomain);
      if (res.error) {
        toast({
          title: "Request Failed",
          description: res.error,
          variant: "error",
        });
      } else {
        toast({
          title: "Verification Request Submitted",
          description: `Domain ${cleanDomain} queued for academic accreditation review.`,
          variant: "success",
        });
        onVerificationSubmitted();
        onClose();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit verification request.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-modal space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <div>
              <h2 className="text-base font-bold text-foreground">Request Campus Verification</h2>
              <p className="text-xs text-muted-foreground font-mono">{college.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          CollegeCentre officially verifies institutions to guarantee trusted student directory listings and
          prevent spoofing. Provide your accredited academic domain below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-muted-foreground">
              Institutional Academic Domain *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. nitc.ac.in or berkeley.edu"
                className="pl-9 font-mono text-sm rounded-xl"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Campus admin ownership will be confirmed via DNS verification or an institutional email challenge.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Submit for Review</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
