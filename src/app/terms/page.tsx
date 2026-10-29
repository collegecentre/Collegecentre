import * as React from "react";
import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Service • CollegeCentre",
  description:
    "Review the terms governing the use of CollegeCentre, student showcase profiles, and platform policies.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 md:py-20 px-4">
        <article className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-3">
            <Badge variant="outline" className="text-xs font-semibold gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-3.5 h-3.5" />
              <span>Platform Guidelines</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: October 29, 2026 &bull; Effective immediately for CollegeCentre
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h3>
              <p>
                By creating an account, publishing a showcase, or visiting CollegeCentre (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">2. Student Ownership of Content</h3>
              <p>
                <strong>You own everything you create.</strong> CollegeCentre does not claim intellectual property rights over the software code, project demonstrations, resumes, honors, or certificates you link or upload. You grant CollegeCentre a limited, worldwide license solely to host, display, and serve your showcase to your chosen audience.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">3. Acceptable Use &amp; Code of Conduct</h3>
              <p>As an engineering community member, you agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Upload malicious software, viruses, phishing links, or spyware.</li>
                <li>Misrepresent credentials, awards, degrees, or academic achievements dishonestly.</li>
                <li>Engage in automated scraping, denial-of-service attempts, or security tampering.</li>
                <li>Upload content that infringes upon third-party copyrights or proprietary source code.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">4. Free Tier &amp; Pro Subscriptions</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Free Builder:</strong> Provided at no monetary charge. Essential showcase features are permanently free.</li>
                <li><strong>Pro Subscription:</strong> Billed on a recurring monthly or annual basis. You may cancel at any time, retaining Pro benefits until the end of your prepaid period.</li>
                <li><strong>Refunds:</strong> If you experience technical issues with a Pro subscription, contact support within 7 days for review.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">5. Disclaimer of Warranties</h3>
              <p>
                The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. While we aim for 99.9% uptime and reliable performance, CollegeCentre does not warrant uninterrupted or error-free operation.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">6. Contact</h3>
              <p>
                Questions regarding these terms may be sent to <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">legal@collegecentre.in</code>.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
