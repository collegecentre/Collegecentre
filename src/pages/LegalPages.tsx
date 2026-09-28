import React from 'react'
import { useApp } from '@/context/AppContext'
import { ArrowLeft } from 'lucide-react'

export const TermsPage: React.FC = () => {
  const { setCurrentView } = useApp()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-mono">
      <button
        onClick={() => setCurrentView('landing')}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Legal & Compliance</div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Effective Date: January 1, 2026 · CollegeCentre Operations
        </p>
      </div>

      <div className="space-y-6 text-xs text-foreground/90 leading-relaxed bg-card p-6 border border-black/10 dark:border-white/15">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">1. Free Service Specification</h2>
          <p className="font-sans">
            CollegeCentre is a 100% free fresher career discovery platform. We empower college candidates and recent graduates to explore verified fresher opportunities, calculate criteria match scores, and apply directly without paywalls or fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Permanent Candidate Pipeline</h2>
          <p className="font-sans">
            Candidate job bookmarks and application records (Saved, Applied, Shortlisted, Assessment, Interviewing, Offered) remain permanently available at all times without restrictions or subscriptions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">3. Candidate Credentials & Accuracy</h2>
          <p className="font-sans">
            Students agree to provide accurate educational batch years, degree programs, and technical competencies. Direct links redirect candidates to official company careers portals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">4. Governing Law</h2>
          <p className="font-sans">
            These terms are governed by the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
          </p>
        </section>
      </div>
    </div>
  )
}

export const PrivacyPolicyPage: React.FC = () => {
  const { setCurrentView } = useApp()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-mono">
      <button
        onClick={() => setCurrentView('landing')}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Privacy & Data Protection</div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Compliant with Digital Personal Data Protection (DPDP) Act · Updated 2026
        </p>
      </div>

      <div className="space-y-6 text-xs text-foreground/90 leading-relaxed bg-card p-6 border border-black/10 dark:border-white/15">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">1. Information Collected</h2>
          <p className="font-sans">
            We collect only candidate-provided profile attributes: full name, college/university, degree discipline, graduation batch, technical skill tags, and location preferences. We do not sell or trade student data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Zero Payment Data</h2>
          <p className="font-sans">
            CollegeCentre is completely free for candidates. We do not collect, process, or store financial credentials, card numbers, UPI handles, or bank accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">3. Cookies & Storage</h2>
          <p className="font-sans">
            We use secure local storage and session cookies solely to preserve student preferences (such as dark/light interface theme and authentication state).
          </p>
        </section>
      </div>
    </div>
  )
}

export const RefundPolicyPage: React.FC = () => {
  const { setCurrentView } = useApp()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-mono">
      <button
        onClick={() => setCurrentView('landing')}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Pricing & Policies</div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
          Policy Notice
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          100% Free Platform for College Freshers
        </p>
      </div>

      <div className="space-y-6 text-xs text-foreground/90 leading-relaxed bg-card p-6 border border-black/10 dark:border-white/15">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">1. Free Access Guarantee</h2>
          <p className="font-sans">
            CollegeCentre is entirely free of charge for students and job seekers. There are no paid passes, fees, charges, subscriptions, or paywalls for any fresher job listing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Non-Applicability of Billing or Refunds</h2>
          <p className="font-sans">
            Because our services are 100% free, no payment processing or billing occurs on CollegeCentre. No purchases or financial transactions are conducted on this site.
          </p>
        </section>
      </div>
    </div>
  )
}

export const ContactPage: React.FC = () => {
  const { setCurrentView } = useApp()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-mono">
      <button
        onClick={() => setCurrentView('landing')}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </button>

      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Communications & Help Desk</div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
          Contact & Support
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Direct operational contacts for students, university TPOs, and employer partners
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-card border border-black/10 dark:border-white/15 space-y-3">
          <div className="text-xs font-bold uppercase text-vermilion">Student Support</div>
          <p className="font-sans text-xs text-muted-foreground">
            For questions about job listings, candidate profiles, or application tracking:
          </p>
          <div className="text-xs font-bold text-foreground">
            Email: support@collegecentre.in
          </div>
          <div className="text-[11px] text-muted-foreground">
            Response SLA: Under 4 hours on business days
          </div>
        </div>

        <div className="p-6 bg-card border border-black/10 dark:border-white/15 space-y-3">
          <div className="text-xs font-bold uppercase text-foreground">Employer Partnerships</div>
          <p className="font-sans text-xs text-muted-foreground">
            To post verified fresher hiring openings for 2024–2027 graduates:
          </p>
          <div className="text-xs font-bold text-foreground">
            Email: partners@collegecentre.in
          </div>
          <div className="text-[11px] text-muted-foreground">
            Location: Bengaluru, Karnataka, India
          </div>
        </div>
      </div>
    </div>
  )
}
