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
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">1. Service Specification</h2>
          <p className="font-sans">
            CollegeCentre is a student-first fresher career discovery platform. We provide a focused ₹199 flat-rate 24-Hour Job Hunt Sprint Pass that enables candidates to browse verified fresher openings and receive real-time AI suitability match scores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Rule 11 Permanent Access Guarantee</h2>
          <p className="font-sans">
            Once an application is logged or a job opening is saved during an active sprint, access to the Application Tracker (Applied, Shortlisted, Interviewing, Offered) and saved job bookmarks shall remain permanently available and will never be locked behind any recurring renewal fee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">3. Candidate Credentials & Zero Resume Policy</h2>
          <p className="font-sans">
            Students agree to provide accurate educational batch years, degree programs, and technical competencies. CollegeCentre operates on direct parameter matching without retaining unsolicited third-party document parsers.
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
            We collect only candidate-provided profile attributes: full name, college/university, degree discipline, graduation batch, technical skill tags, and location preferences. We do not sell or trade student data to third-party telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Payment Data Privacy</h2>
          <p className="font-sans">
            All payments (UPI, Cards, NetBanking) are processed via PCI-DSS certified Indian payment gateways (such as Razorpay). CollegeCentre never handles or stores sensitive credit card numbers or banking passwords on its servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">3. Cookies & Storage</h2>
          <p className="font-sans">
            We use secure local storage and session cookies solely to preserve student preferences (such as dark/light interface theme, active sprint countdowns, and authentication state).
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
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Commerce & Settlement</div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-sans">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Standard Indian Payment Gateway & Banking Compliance Guidelines
        </p>
      </div>

      <div className="space-y-6 text-xs text-foreground/90 leading-relaxed bg-card p-6 border border-black/10 dark:border-white/15">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">1. Sprint Pass Non-Recurring Nature</h2>
          <p className="font-sans">
            The ₹199 Sprint Pass is a one-time, flat-rate digital access ticket valid for 24 continuous hours. There are NO recurring subscriptions or unexpected auto-debits on your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">2. Digital Delivery & Cancellation</h2>
          <p className="font-sans">
            Due to the immediate digital unlock of active fresher contacts and AI match scores upon payment confirmation, cancellation is generally not accepted once access is granted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-vermilion">3. Duplicate & Erroneous Charges</h2>
          <p className="font-sans">
            If your account was debited multiple times due to a banking network glitch, or if payment succeeded but pass access was not provisioned, please email support@collegecentre.in with your UPI transaction ID. Full refunds will be credited within 5–7 working days via original payment mode.
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
          <div className="text-xs font-bold uppercase text-vermilion">Support & Grievances</div>
          <p className="font-sans text-xs text-muted-foreground">
            For sprint pass activation issues, payment receipt inquiries, or student data updates:
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
