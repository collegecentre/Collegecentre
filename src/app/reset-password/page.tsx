"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Failed to update password.");
      return;
    }

    toast({
      title: "Password updated",
      description: "You can now sign in with your new credentials.",
      variant: "success",
    });

    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group transition-opacity hover:opacity-90">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center text-background font-bold text-sm tracking-tighter shadow-subtle group-hover:scale-105 transition-transform">
            CC
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            CollegeCentre
          </span>
        </Link>

        <Typography variant="h2" as="h1" className="text-2xl font-bold tracking-tight">
          Create new password
        </Typography>

        <Typography variant="bodySm" className="text-muted-foreground">
          Enter a secure password for your student identity account.
        </Typography>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-5 border-border shadow-card bg-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              prefixElement={<Lock className="h-4 w-4 text-muted-foreground" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              prefixElement={<Lock className="h-4 w-4 text-muted-foreground" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="default"
              className="w-full text-xs font-semibold h-10 mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
