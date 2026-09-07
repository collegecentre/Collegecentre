import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Lock,
  Unlock,
} from 'lucide-react'

export const PricingPage: React.FC = () => {
  const { setIsPaymentModalOpen, setCurrentView, isPassActive } = useApp()

  const faqs = [
    {
      q: 'How does the ₹199 / 24-Hour Job Hunt Pass work?',
      a: 'The 24-hour pass begins the moment your payment completes. During this window, you have unrestricted access to search, discover, match, and apply to all student & fresher jobs on CollegeCentre.',
    },
    {
      q: 'Will I lose my saved jobs and applications when the 24 hours expire?',
      a: 'Never. Under Rule 11 (Permanent Access Guarantee), your student account, saved jobs, applied companies, interview notes, and status tracker remain permanently yours. CollegeCentre will never delete or lock your personal application data.',
    },
    {
      q: 'Can I update application statuses (e.g. Applied → Shortlisted) after my pass expires?',
      a: 'Yes, absolutely. You can log back in days, weeks, or months later to update stages, add notes, and track your interview progress completely free without buying another pass.',
    },
    {
      q: 'When do I need to buy another pass?',
      a: 'Only when you want to discover and apply to new job openings. If you applied to 15 jobs during your 24 hours, you only need another pass when you are ready for a new job-hunting sprint.',
    },
    {
      q: 'Is there a free job search tier?',
      a: 'No. CollegeCentre has no free job-discovery tier. This ensures the platform remains clean, high-signal, free of spam, and focused strictly on high-intent students.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-block font-mono text-[11px] text-[#fe7141] font-bold border border-[#fe7141]/30 bg-[#fe7141]/10 px-2.5 py-1 rounded-xs uppercase">
          [PRICING_SPECIFICATION // NO_AUTO_DEBIT]
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight font-sans">
          ₹199 / 24-Hour Job Hunt Pass
        </h1>
        <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          No predatory monthly subscriptions. Pay once when you are ready to sprint. Keep your application records forever.
        </p>
      </div>

      {/* Editorial Pricing Card */}
      <div className="max-w-md mx-auto">
        <div className="border border-black/15 dark:border-white/20 shadow-xs overflow-hidden rounded-lg bg-card">
          <div className="bg-black dark:bg-white text-white dark:text-black p-6 text-center space-y-2 font-mono">
            <span className="text-[10px] uppercase font-bold tracking-widest border border-white/20 dark:border-black/20 px-2.5 py-0.5 rounded-xs">
              [DISCOVERY SPRINT PASS]
            </span>
            <div className="flex items-baseline justify-center gap-1 pt-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">₹199</span>
              <span className="text-xs opacity-75">/ 24 HOURS</span>
            </div>
            <p className="text-[11px] opacity-70">
              Starts immediately upon payment · Zero recurring trap
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3 font-mono text-xs text-foreground">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">+</span>
                <span><strong>24 Hours of Discovery:</strong> Search and filter 150+ fresher openings.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">+</span>
                <span><strong>AI Match Breakdown:</strong> Transparent fit scores per skill and degree.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">+</span>
                <span><strong>Direct Employer URLs:</strong> Apply straight to official company portals.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#fe7141] font-bold">✓</span>
                <span><strong>Permanent Retention:</strong> Saved jobs & application tracker stay forever.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (isPassActive ? setCurrentView('dashboard') : setIsPaymentModalOpen(true))}
              className="w-full py-3 text-xs font-mono font-bold bg-[#fe7141] hover:bg-[#e05828] text-white rounded-sm transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isPassActive ? '[ GO TO ACTIVE DASHBOARD ]' : '[ UNLOCK PASS — ₹199 ]'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="p-3 rounded-sm bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 font-mono text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>UPI QR & Card · No auto-debit · Rule 11 Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Active vs Expired Pass Breakdown */}
      <div className="space-y-4">
        <div className="border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs flex items-center justify-between">
          <span className="font-bold uppercase text-foreground">01 // ACCESS BOUNDARIES</span>
          <span className="text-muted-foreground">[SPRINT VS PERMANENT ARCHIVE]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground border-b border-black/10 dark:border-white/10 pb-2">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>DURING 24-HOUR PASS (ACTIVE)</span>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">✓ Browse all fresher & student jobs</li>
              <li className="flex items-center gap-2">✓ Keyword & location search filters</li>
              <li className="flex items-center gap-2">✓ AI match score calculations</li>
              <li className="flex items-center gap-2">✓ View detailed role requirements</li>
              <li className="flex items-center gap-2">✓ Save new job opportunities</li>
              <li className="flex items-center gap-2">✓ Apply to direct employer portals</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground border-b border-black/10 dark:border-white/10 pb-2">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>AFTER 24 HOURS (EXPIRED)</span>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400">✗ New job discovery & search locked</li>
              <li className="flex items-center gap-2 text-foreground font-bold">✓ Saved jobs remain 100% accessible</li>
              <li className="flex items-center gap-2 text-foreground font-bold">✓ Application tracker remains 100% accessible</li>
              <li className="flex items-center gap-2 text-foreground font-bold">✓ Update interview status freely</li>
              <li className="flex items-center gap-2 text-foreground font-bold">✓ Add notes, follow-up dates & reminders</li>
              <li className="flex items-center gap-2 text-foreground font-bold">✓ Student profile & skills intact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <div className="border-t border-b border-black/15 dark:border-white/20 py-2.5 font-mono text-xs flex items-center gap-2">
          <span className="font-bold text-[#fe7141]">02 //</span>
          <span className="font-bold text-foreground uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-lg border border-black/10 dark:border-white/15 bg-card space-y-1.5 font-mono">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-tight">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-sans">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
