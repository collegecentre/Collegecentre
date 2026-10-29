import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { getAllColleges } from "@/lib/college-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Globe, ExternalLink, ArrowRight, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Colleges & Campus Hubs | CollegeCentre",
  description: "Browse verified colleges and university campus directories across the student builder network.",
};

export default async function CollegesDirectoryPage() {
  const colleges = await getAllColleges();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Hero */}
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" size="sm" className="font-mono text-xs">
              Campus Ecosystem
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Colleges & University Hubs
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover student builders, open source projects, and campus technical societies organized by institution.
            </p>
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const initials = (college.short_name || college.name)
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 3)
                .join("")
                .toUpperCase();

              const isVerified = college.verification_status === "verified";

              return (
                <Link
                  key={college.id}
                  href={`/college/${college.slug}`}
                  className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-card hover:border-primary/50 hover:shadow-modal transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Emblem & Verification Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <Avatar size="lg" className="rounded-2xl border border-border/80 shadow-sm">
                        {college.logo_url && (
                          <AvatarImage src={college.logo_url} alt={college.name} />
                        )}
                        <AvatarFallback className="rounded-2xl font-mono font-bold text-xs bg-muted">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {isVerified ? (
                        <Badge variant="success" size="sm" className="font-mono text-[10px] gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verified</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="sm" className="font-mono text-[10px]">
                          Community
                        </Badge>
                      )}
                    </div>

                    {/* Title & Short name */}
                    <div>
                      <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {college.name}
                      </h2>
                      {college.short_name && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {college.short_name}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {college.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {college.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="space-y-1 text-xs text-muted-foreground font-medium pt-1">
                      {college.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{college.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer link */}
                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-primary font-medium">
                    <span>Explore Campus Hub</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
