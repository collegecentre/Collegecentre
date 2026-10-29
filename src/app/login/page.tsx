"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const { signIn, signInWithGoogle, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Invalid email or password.");
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Welcome back!",
      description: "Successfully signed in to CollegeCentre.",
      variant: "success",
    });

    router.replace(redirectTo);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      setErrorMsg(error.message || "Failed to sign in with Google.");
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "error",
      });
      return;
    }

    toast({
      title: "Authenticated with Google",
      description: "Redirecting to your student dashboard...",
      variant: "success",
    });
    router.replace(redirectTo);
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
          Sign in to your account
        </Typography>

        <Typography variant="bodySm" className="text-muted-foreground">
          Access your student showcase, edit your links, and view your verified profile.
        </Typography>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-5 border-border shadow-card bg-card">
          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive leading-relaxed"
            >
              {errorMsg}
            </div>
          )}

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-semibold h-10 border-border hover:bg-muted/60"
            isLoading={isGoogleLoading}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-card px-2 text-muted-foreground">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@email.com"
              prefixElement={<Mail className="h-4 w-4 text-muted-foreground" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Password</span>
                <Link
                  href="/forgot-password"
                  className="font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                prefixElement={<Lock className="h-4 w-4 text-muted-foreground" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full text-xs font-semibold h-10 mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/60">
            Don&apos;t have a student showcase yet?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
            >
              Create your CollegeCentre
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
