import Link from "next/link";
import { Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
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
            <Badge variant="outline" className="font-mono text-xs px-3 py-1">
              404 • Not Found
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Student Handle Not Found
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This username hasn&apos;t been claimed yet, or the student profile is no longer available.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link href="/signup" className="w-full">
              <Button
                variant="brand"
                size="sm"
                className="w-full justify-center text-xs shadow-subtle"
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Claim This Student Handle
              </Button>
            </Link>

            <Link href="/explore" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs"
                leftIcon={<Compass className="h-3.5 w-3.5" />}
              >
                Explore CollegeCentre
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          CollegeCentre • One link for everything you&apos;ve built, achieved, and are.
        </p>
      </div>
    </div>
  );
}
