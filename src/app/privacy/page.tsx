import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Lock, Eye, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy • CollegeCentre",
  description:
    "Learn how CollegeCentre protects your student identity, telemetry, and portfolio data with privacy-conscious engineering.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 md:py-20 px-4">
        <article className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-3">
            <Badge variant="outline" className="text-xs font-semibold gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy-First Architecture</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: October 29, 2026 &bull; Effective immediately for CollegeCentre 2.0
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3 p-5 rounded-2xl bg-muted/30 border border-border/80">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Our Core Privacy Principle</span>
              </h2>
              <p>
                CollegeCentre is built to showcase your engineering achievements, not to sell your data. We do not sell student data, we do not employ third-party advertising tracking networks, and we collect only the minimal telemetry necessary to provide link interaction metrics.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">1. Information You Provide to Us</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account Credentials:</strong> Email address, encrypted password, and username.</li>
                <li><strong>Profile Information:</strong> Full name, avatar, bio, college/university affiliation, course of study, graduation year, and technical skills.</li>
                <li><strong>Showcase Data:</strong> External links, GitHub repositories, live demo URLs, project cover images, hackathon achievements, and certificates.</li>
                <li><strong>Resume Documents:</strong> PDF resumes you voluntarily upload to showcase to recruiters and visitors.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">2. Privacy-Conscious Telemetry &amp; Analytics</h3>
              <p>
                When visitors view your public showcase, we record aggregate interaction events (profile views, project clicks, link clicks). Our analytics architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Does <strong>not</strong> track or store visitor IP addresses.</li>
                <li>Does <strong>not</strong> use invasive third-party tracking cookies or cross-site fingerprinting.</li>
                <li>Stores interaction timestamps and referrer domains purely for student traffic analysis.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">3. Student Visibility &amp; Privacy Controls</h3>
              <p>You have continuous control over your showcase visibility:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Public vs. Private Profile:</strong> Setting your profile to Private immediately blocks all public showcase views.</li>
                <li><strong>Explore Discoverability:</strong> You can hide your profile from the Explore network and campus directory while keeping a direct URL active.</li>
                <li><strong>Item-Level Toggles:</strong> Individual links, projects, honors, and resumes can be enabled or disabled at any time.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">4. Data Ownership &amp; Erasure</h3>
              <p>
                You retain complete ownership of all technical projects, code links, and resumes you publish on CollegeCentre. You may delete your uploaded content or request complete account deletion at any time by contacting support.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">5. Contact Information</h3>
              <p>
                For privacy inquiries or data rights requests, contact our privacy engineering team at <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">privacy@collegecentre.in</code>.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
