"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg(null);
    setIsSubmitting(true);
    const { error } = await resetPassword(email);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Failed to send reset email.");
      return;
    }

    setSubmitted(true);
    toast({
      title: "Reset link dispatched",
      description: `Instructions sent to ${email}`,
      variant: "info",
    });
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
          Reset your password
        </Typography>

        <Typography variant="bodySm" className="text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your credentials.
        </Typography>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-5 border-border shadow-card bg-card">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                  {errorMsg}
                </div>
              )}

              <Input
                label="Registered Email"
                type="email"
                placeholder="you@email.com"
                prefixElement={<Mail className="h-4 w-4 text-muted-foreground" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="default"
                className="w-full text-xs font-semibold h-10 mt-2"
                isLoading={isSubmitting}
              >
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Check your inbox</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If an account exists for <span className="font-mono text-foreground">{email}</span>, you will receive password reset instructions.
              </p>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/60">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
