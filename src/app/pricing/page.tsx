"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  BarChart3,
  Palette,
  HelpCircle,
  Zap,
  Lock,
} from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import type { BillingInterval } from "@/types";

export default function PricingPage() {
  const { user, profile } = useAuth();
  const [interval, setInterval] = React.useState<BillingInterval>("yearly");
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false);

  const isPro = false; // public marketing page default view; modal checks active user if logged in

  const comparisonFeatures = [
    {
      category: "Portfolio & Identity",
      items: [
        { name: "Public Student Showcase", free: "collegecentre.in/username", pro: "Custom Domain or Subdomain" },
        { name: "Connect Personal Custom Domain", free: false, pro: "yourname.dev / portfolio.domain.com" },
        { name: "Remove CollegeCentre Branding", free: false, pro: true },
        { name: "Verified Pro Campus Badge", free: false, pro: true },
        { name: "QR Code Sharing & Open Graph Preview", free: true, pro: true },
      ],
    },
    {
      category: "Content & Showcase Capacity",
      items: [
        { name: "Technical Projects Capacity", free: "Up to 5 projects", pro: "Unlimited projects" },
        { name: "Verified Honors & Hackathons", free: "Up to 5 honors", pro: "Unlimited honors" },
        { name: "Certificates & Credentials", free: "Up to 5 certificates", pro: "Unlimited certificates" },
        { name: "Resume PDF Showcase & Download", free: true, pro: true },
        { name: "Social Links & Media Profiles", free: "Unlimited", pro: "Unlimited" },
      ],
    },
    {
      category: "Design & Themes",
      items: [
        { name: "Standard Themes (Minimal, Developer, Academic)", free: true, pro: true },
        { name: "Curated Pro Themes (Creative, Cobalt, Obsidian, Terminal)", free: false, pro: true },
        { name: "Custom Accent Colors & Button Styles", free: false, pro: true },
        { name: "Profile Layout Variants", free: false, pro: true },
      ],
    },
    {
      category: "Traffic Insights & Discovery",
      items: [
        { name: "Profile & Project Views Analytics", free: "7-Day Overview", pro: "90-Day & All-Time Traffic" },
        { name: "Referrer & Device Breakdown", free: false, pro: true },
        { name: "Explore Network & Campus Directory Listing", free: true, pro: "Priority Directory Placement" },
      ],
    },
  ];

  const faqs = [
    {
      q: "Will the free plan ever expire or force payment?",
      a: "Never. The Free Builder tier is permanently free. We believe every student deserves a clean, impressive portfolio to showcase what they've built without paywalls.",
    },
    {
      q: "Can I connect a domain I already bought from Namecheap, Cloudflare, or GoDaddy?",
      a: "Yes! Connecting your custom domain is simple. Just add a single CNAME record pointing to cname.collegecentre.in, and your showcase will instantly serve from your personal domain.",
    },
    {
      q: "What happens if I cancel my Pro subscription?",
      a: "You retain all Pro benefits until the end of your prepaid billing period. When it concludes, your profile smoothly transitions to the Free tier. None of your projects, achievements, or certificates will ever be deleted.",
    },
    {
      q: "How does the annual plan billing work?",
      a: "The annual plan is billed once a year at ₹2,499, which represents a 30% savings over the monthly rate of ₹299/mo (working out to approximately ₹208/month).",
    },
    {
      q: "Can colleges or clubs get group licenses?",
      a: "Yes! Colleges can claim their verified campus hub to provide managed directories and verified student credentials. Contact our campus partnership team for details.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 text-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent & Student-First</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Invest in your engineering identity, not generic templates.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential portfolio capabilities are free forever. Upgrade to Pro when you&apos;re ready for custom personal domains, advanced analytics, and curated aesthetics.
            </p>

            {/* Monthly / Yearly Switch */}
            <div className="pt-6 flex items-center justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-muted border border-border shadow-xs">
                <button
                  type="button"
                  onClick={() => setInterval("monthly")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                    interval === "monthly"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setInterval("yearly")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                    interval === "yearly"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Annual billing</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SAVE 30%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Tier Cards */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Card */}
            <div className="relative rounded-2xl border border-border/80 bg-card p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Free Builder</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Everything you need to prove your engineering skill, showcase projects, and get hired.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">₹0</span>
                  <span className="text-xs text-muted-foreground font-medium">/ forever</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/60">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What&apos;s included:
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Public showcase: <strong>collegecentre.in/you</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlimited links & social connections</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Up to 5 engineering projects</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Up to 5 verified honors & hackathons</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Certificates & PDF resume showcase</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Standard themes (Minimal, Developer, Academic)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>QR code sharing & Open Graph preview</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>7-day analytics overview</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={user ? "/dashboard" : "/signup"}>
                  <Button variant="outline" className="w-full justify-center">
                    {user ? "Current Free Plan" : "Get Started Free"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Card */}
            <div className="relative rounded-2xl border-2 border-indigo-500/50 bg-card p-8 flex flex-col justify-between shadow-xl shadow-indigo-500/5 overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">CollegeCentre Pro</h3>
                    <Badge variant="default" className="bg-indigo-600 hover:bg-indigo-600 text-white text-[10px] px-2 py-0.2">
                      PRO
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    For serious builders wanting personal domains, deep traffic insights, and white-label branding.
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground">
                    {interval === "yearly" ? "₹2,499" : "₹299"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {interval === "yearly" ? "/ year (₹208/mo)" : "/ month"}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/60">
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Everything in Free, plus:
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-foreground">
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span><strong>Personal Custom Domain</strong> (alexrivera.dev)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Curated Pro themes (Creative, Cobalt, Obsidian, Terminal)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Custom accent colors & layout styles</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Full 90-day & all-time traffic analytics with referrers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Remove CollegeCentre footer watermark</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Unlimited projects, honors & certificates</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Verified Pro badge on showcase & campus directory</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                {user ? (
                  <Button
                    variant="default"
                    className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
                    onClick={() => setUpgradeModalOpen(true)}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Upgrade to Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button
                      variant="default"
                      className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Get Started with Pro</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Detailed Entitlement Matrix */}
        <section className="border-t border-border/80 bg-muted/20 py-20 px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Detailed Feature Matrix
              </h2>
              <p className="text-sm text-muted-foreground">
                Compare every technical capability across Free and Pro tiers.
              </p>
            </div>

            <div className="border border-border/80 rounded-2xl overflow-hidden bg-background shadow-xs">
              {comparisonFeatures.map((cat, catIdx) => (
                <div key={cat.category} className={catIdx > 0 ? "border-t border-border/80" : ""}>
                  <div className="bg-muted/50 px-6 py-3 font-semibold text-xs tracking-wider uppercase text-foreground">
                    {cat.category}
                  </div>
                  <div className="divide-y divide-border/60">
                    {cat.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm"
                      >
                        <span className="font-medium text-foreground">{item.name}</span>
                        <div className="flex items-center gap-6 sm:gap-12 shrink-0">
                          <div className="w-36 text-muted-foreground">
                            {typeof item.free === "boolean" ? (
                              item.free ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <span className="text-muted-foreground/40 font-mono text-xs">&mdash;</span>
                              )
                            ) : (
                              <span>{item.free}</span>
                            )}
                          </div>
                          <div className="w-48 font-medium text-indigo-600 dark:text-indigo-400">
                            {typeof item.pro === "boolean" ? (
                              item.pro ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <span className="text-muted-foreground/40 font-mono text-xs">&mdash;</span>
                              )
                            ) : (
                              <span>{item.pro}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Frequently Asked Questions */}
        <section className="py-20 px-4 max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Straightforward answers about our subscriptions, billing, and policy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border/80 bg-card space-y-2.5 shadow-xs"
              >
                <h4 className="font-semibold text-foreground text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Upgrade modal for logged in users */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        userId={profile?.id || user?.id}
        onSuccess={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/dashboard?tab=settings";
          }
        }}
      />
    </div>
  );
}
