import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  Check,
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
      a: 'Never. Your student account, saved jobs, applied companies, interview notes, and status tracker remain permanently yours. CollegeCentre will never delete or lock your personal application data.',
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
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
          Transparent Pricing
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ₹199 Per 24-Hour Job Hunt Sprint
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          No predatory recurring subscriptions. Pay for intense discovery sprints when you need them. Keep your tracker forever.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto">
        <div className="border border-slate-300 dark:border-slate-700 shadow-lg overflow-hidden rounded-3xl bg-card">
          <div className="bg-indigo-600 text-white p-7 text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3.5 py-1 rounded-full">
              Full Discovery Pass
            </span>
            <div className="flex items-baseline justify-center gap-1 pt-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight">₹199</span>
              <span className="text-sm text-indigo-100 font-bold">/ 24 Hours</span>
            </div>
            <p className="text-xs text-indigo-100">
              Pass activates immediately upon payment
            </p>
          </div>

          <div className="p-6 sm:p-7 space-y-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  <strong>24 Hours of Unlimited Discovery:</strong> Browse all fresher jobs & internships.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  <strong>AI Match Algorithm:</strong> Tailored percentage breakdown against your college profile.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  <strong>Direct Employer Applications:</strong> Verified official links and career portals.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  <strong>Permanent Data Guarantee:</strong> Saved jobs and application tracker stay permanent.
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-11 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs gap-2"
              onClick={() => (isPassActive ? setCurrentView('dashboard') : setIsPaymentModalOpen(true))}
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{isPassActive ? 'Go to Active Dashboard' : 'Unlock Pass for ₹199'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No auto-debit · No unexpected renewals · 100% Student friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Active vs Expired Pass Breakdown */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            What Happens During vs After Your 24-Hour Pass
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Complete transparency on our access boundaries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <Unlock className="w-4 h-4" />
              <span>DURING 24-HOUR PASS (ACTIVE)</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">✓ Browse all fresher & student jobs</li>
              <li className="flex items-center gap-2">✓ Keyword & location search filters</li>
              <li className="flex items-center gap-2">✓ AI match score calculations</li>
              <li className="flex items-center gap-2">✓ View detailed role requirements</li>
              <li className="flex items-center gap-2">✓ Save new job opportunities</li>
              <li className="flex items-center gap-2">✓ Apply to direct employer portals</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>AFTER 24 HOURS (EXPIRED)</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">✗ New job discovery & search locked</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">✓ Saved jobs remain 100% accessible</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">✓ Application tracker remains 100% accessible</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">✓ Update interview status freely</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">✓ Add notes, follow-up dates & reminders</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">✓ Student profile & skills intact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card space-y-1.5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
