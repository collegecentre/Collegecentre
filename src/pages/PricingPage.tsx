import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
      a: 'Yes, absolutely! You can log back in days, weeks, or months later to update stages, add notes, and track your interview progress completely free.',
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
        <Badge variant="matchMid" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          Transparent Student Pricing
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          ₹199 Per 24-Hour Job Hunt Sprint
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          No predatory recurring subscriptions. Pay for intense discovery sprints when you need them. Keep your tracker forever.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-indigo-500 shadow-xl overflow-hidden relative">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-3 py-0.5 rounded-full">
              Full Discovery Pass
            </span>
            <div className="flex items-baseline justify-center gap-1 pt-1">
              <span className="text-5xl font-black">₹199</span>
              <span className="text-sm text-indigo-100 font-medium">/ 24 Hours</span>
            </div>
            <p className="text-xs text-indigo-100">
              Pass activates immediately upon payment
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>24 Hours of Unlimited Discovery:</strong> Browse all fresher jobs & internships.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>AI Match Algorithm:</strong> Tailored percentage breakdown against your college profile.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>Direct Employer Applications:</strong> Verified official links and career portals.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-foreground">
                  <strong>Permanent Data Guarantee:</strong> Saved jobs and application tracker stay permanent.
                </span>
              </div>
            </div>

            <Button
              variant="premium"
              size="lg"
              onClick={() => (isPassActive ? setCurrentView('dashboard') : setIsPaymentModalOpen(true))}
              className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-500/25 gap-2"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{isPassActive ? 'Go to Active Dashboard' : 'Unlock Pass for ₹199'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="p-3 rounded-xl bg-muted/50 border text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No auto-debit · No unexpected renewals · 100% Student friendly</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison: Active vs Expired Pass Breakdown */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            What Happens During vs After Your 24-Hour Pass
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete transparency on our access boundaries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Pass */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800 space-y-3">
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

          {/* After Expiry */}
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>AFTER 24 HOURS (EXPIRED)</span>
            </div>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400">✗ New job discovery & search locked</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">✓ Saved jobs remain 100% accessible</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">✓ Application tracker remains 100% accessible</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">✓ Update interview status freely</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">✓ Add notes, follow-up dates & reminders</li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">✓ Student profile & resume data intact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-xl border bg-card space-y-1.5 shadow-xs">
              <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
