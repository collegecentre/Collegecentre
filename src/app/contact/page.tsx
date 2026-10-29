import * as React from "react";
import type { Metadata } from "next";
import { MessageSquare, ShieldAlert, School, Sparkles, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact & Support • CollegeCentre",
  description:
    "Get in touch with the CollegeCentre team for student support, campus partnerships, or security disclosures.",
};

export default function ContactPage() {
  const contactChannels = [
    {
      title: "Student Support",
      icon: MessageSquare,
      description: "Questions about your showcase, themes, custom domain connection, or billing.",
      contact: "support@collegecentre.in",
      sla: "Within 24 hours",
    },
    {
      title: "Campus Hubs & Partnerships",
      icon: School,
      description: "For student council leads, department heads, and campus placement coordinators.",
      contact: "campus@collegecentre.in",
      sla: "Priority business queue",
    },
    {
      title: "Security & Vulnerability Disclosure",
      icon: ShieldAlert,
      description: "Report responsible disclosure vulnerabilities, bug reports, or safety incidents.",
      contact: "security@collegecentre.in",
      sla: "PGP encrypted / within 4 hours",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs font-semibold gap-1.5 border-brand/30 text-brand">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Channels</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get in Touch with CollegeCentre
            </h1>
            <p className="text-sm text-muted-foreground">
              Whether you are an ambitious student builder, campus representative, or technical reviewer, we are here to help.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 border-border/80 bg-card space-y-4 flex flex-col justify-between shadow-xs hover:border-foreground/30 transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {channel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/60">
                    <a
                      href={`mailto:${channel.contact}`}
                      className="text-xs font-mono font-semibold text-brand hover:underline block truncate"
                    >
                      {channel.contact}
                    </a>
                    <span className="text-[10px] text-muted-foreground block">
                      Response: {channel.sla}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Office Hours / Campus Note */}
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>
                Based in Bengaluru, India. Serving engineering students and university builders nationwide.
              </span>
            </div>
            <span className="font-mono text-[11px] text-foreground font-semibold shrink-0">
              IST (UTC+5:30)
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
