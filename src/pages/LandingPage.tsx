import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/reactbits/SpotlightCard'
import { ShinyText } from '@/components/reactbits/ShinyText'
import { StarBorder } from '@/components/reactbits/StarBorder'
import {
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  GraduationCap,
  SlidersHorizontal,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsPaymentModalOpen, isPassActive } = useApp()

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Top Sprint Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 text-indigo-700 text-xs sm:text-sm font-bold mb-6 shadow-xs dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <ShinyText text="₹199 / 24-Hour Job Hunt Pass for Freshers" speed={4} />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Find Relevant Jobs Faster. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Apply From One Place.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CollegeCentre is a focused 24-hour job discovery platform built exclusively for college students and freshers. Aggregated openings, transparent AI matching, and zero subscription traps.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-sm border border-border text-xs sm:text-sm text-foreground shadow-sm">
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
              ₹199 = 24 Hours of Discovery
            </span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-muted-foreground font-medium">
              Saved jobs & applications remain permanent forever
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {isPassActive ? (
              <Button
                variant="premium"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-lg shadow-indigo-500/25 gap-2"
                onClick={() => setCurrentView('dashboard')}
              >
                <span>Go to Active Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <StarBorder
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full sm:w-auto"
                color="#6366f1"
                speed="4s"
              >
                <div className="flex items-center gap-2 py-1 px-4 text-base font-bold">
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Unlock 24 Hours for ₹199</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </StarBorder>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm font-semibold border-border hover:bg-accent/70"
              onClick={() => setCurrentView('pricing')}
            >
              How It Works
            </Button>
          </div>

          <p className="text-[12px] text-muted-foreground mt-3">
            No recurring monthly charges · Instant access · Guaranteed permanent tracker
          </p>
        </div>
      </section>

      {/* Core Principle Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <SpotlightCard
          spotlightColor="rgba(99, 102, 241, 0.2)"
          className="rounded-3xl border-indigo-200/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden"
        >
          <div className="max-w-2xl relative z-10 space-y-4">
            <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30 text-xs uppercase tracking-wider font-bold">
              The CollegeCentre Principle
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              “I pay ₹199, spend 24 focused hours finding the right opportunities, apply to them, and keep my tracker forever.”
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Traditional job boards lock your account behind recurring monthly subscriptions. With CollegeCentre, you purchase access for high-intensity 24-hour sprints. Your applications, status tracking, and interview notes never expire.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  <strong>₹199 / 24h:</strong> Unlocks NEW job discovery, search & matching algorithms.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">
                  <strong>Student Account:</strong> Permanent lifetime access to your saved & applied jobs.
                </span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* How the Student Journey Works */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Simple 4-Step Student Journey
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From setup to landing interviews, engineered around student focus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-sm dark:bg-indigo-950 dark:text-indigo-400">
              01
            </div>
            <h3 className="font-bold text-base text-foreground">Create Profile</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Input your college, degree, graduation year, and top technical or business skills.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center text-sm dark:bg-emerald-950 dark:text-emerald-400">
              02
            </div>
            <h3 className="font-bold text-base text-foreground">₹199 Unlock</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Activate your 24-hour job discovery pass. Instant start, zero auto-renewal traps.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold flex items-center justify-center text-sm dark:bg-amber-950 dark:text-amber-400">
              03
            </div>
            <h3 className="font-bold text-base text-foreground">Find & Apply</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse matched opportunities sorted by AI relevance and apply directly to employers.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold flex items-center justify-center text-sm dark:bg-purple-950 dark:text-purple-400">
              04
            </div>
            <h3 className="font-bold text-base text-foreground">Track Forever</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pass expires after 24h, but your saved jobs and application pipeline stay permanent forever.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* Transparent AI Matching Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border bg-card/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="matchHigh" className="text-xs font-bold px-3 py-1">
                Transparent AI Matching
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Know exactly why a job fits your profile before applying
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No opaque black-box scoring. We compute transparent percentages based on your specific technical skills, degree, batch year, and work mode preferences.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Skills match with keyword & synonym normalization</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Degree & branch alignment (B.Tech, BCA, MCA, etc.)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fresher eligibility and batch filter (2025/2026 graduates)</span>
                </div>
              </div>
            </div>

            {/* Visual Match Preview Card */}
            <SpotlightCard className="p-5 rounded-2xl border bg-muted/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-foreground">Junior Software Developer</h4>
                  <p className="text-xs text-muted-foreground">TechNova · Bengaluru / Remote</p>
                </div>
                <Badge variant="matchHigh" className="text-sm font-black px-3 py-1">
                  92% Match
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skills match:</span>
                  <span className="font-bold text-foreground">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education match:</span>
                  <span className="font-bold text-foreground">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience match:</span>
                  <span className="font-bold text-foreground">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fresher eligibility:</span>
                  <span className="font-bold text-emerald-600">100% Eligible</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-extrabold text-foreground text-sm">₹4–6 LPA</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold dark:bg-emerald-950 dark:text-emerald-300">
                  Fresher Eligible
                </span>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto text-center px-4 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">
          Ready for your next 24-hour job hunt?
        </h2>
        <p className="text-sm text-muted-foreground">
          ₹199 unlocks the complete fresher database and AI matching engine instantly.
        </p>
        <StarBorder
          onClick={() => setIsPaymentModalOpen(true)}
          className="mx-auto"
          color="#6366f1"
          speed="4s"
        >
          <div className="flex items-center gap-2 py-1 px-6 text-base font-bold">
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Get 24 Hours for ₹199</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </StarBorder>
      </section>
    </div>
  )
}
