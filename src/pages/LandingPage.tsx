import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BentoGrid, BentoGridItem } from '@/components/aceternity/BentoGrid'
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams'
import { MovingBorder } from '@/components/aceternity/MovingBorder'
import { ShinyText } from '@/components/reactbits/ShinyText'
import { MetricStatCard } from '@/components/enterprise/MetricStatCard'
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
  Bookmark,
  Target,
  FileCheck2,
  Users,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsPaymentModalOpen, isPassActive } = useApp()

  return (
    <div className="relative space-y-20 pb-24 overflow-hidden">
      {/* Aceternity Ambient Background Beams */}
      <BackgroundBeams />

      {/* Hero Section */}
      <section className="relative z-10 pt-10 md:pt-20 pb-8 px-4 max-w-5xl mx-auto text-center">
        {/* Top Sprint Announcement Chip (HeroUI / DaisyUI style) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 text-indigo-700 text-xs sm:text-sm font-bold mb-6 shadow-xs dark:bg-indigo-950/70 dark:border-indigo-800 dark:text-indigo-300">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          <ShinyText text="₹199 / 24-Hour Job Hunt Pass for Freshers" speed={4} />
          <span className="hidden sm:inline text-muted-foreground">• Zero Auto-Debit</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.12]">
          Find Relevant Jobs Faster. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            Apply From One Place.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          CollegeCentre is the first time-boxed job discovery engine built strictly for college students and freshers. No subscription traps, no resume uploads—just transparent AI matching and permanent career tracking.
        </p>

        {/* Pricing Highlights Bar */}
        <div className="mt-7 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border text-xs sm:text-sm text-foreground shadow-xs">
          <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">
            ₹199 = 24 Hours of Discovery
          </span>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Permanent lifetime access to your saved jobs & applications
          </span>
        </div>

        {/* Hero CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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
            <MovingBorder
              onClick={() => setIsPaymentModalOpen(true)}
              duration={3500}
              className="px-6 py-2.5"
            >
              <div className="flex items-center gap-2 text-base font-bold">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Unlock 24 Hours for ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </MovingBorder>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-6 text-sm font-semibold border-border hover:bg-accent/70"
            onClick={() => setCurrentView('pricing')}
          >
            How the 24-Hour Pass Works
          </Button>
        </div>

        <p className="text-[12px] text-muted-foreground mt-3.5">
          No monthly subscription · Starts immediately upon payment · Keep application history forever
        </p>

        {/* Live Metrics Row (Mantine-inspired) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-12 max-w-4xl mx-auto text-left">
          <MetricStatCard
            title="Active Fresher Roles"
            value="150+"
            subtext="Curated & verified daily"
            badge="Live"
            trend="up"
            icon={<Briefcase className="w-4 h-4" />}
          />
          <MetricStatCard
            title="Avg. Salary Offered"
            value="₹5.8 LPA"
            subtext="Engineering & BCA/MCA"
            badge="Market High"
            trend="up"
            icon={<Zap className="w-4 h-4" />}
          />
          <MetricStatCard
            title="AI Match Accuracy"
            value="94.6%"
            subtext="Degree + skill alignment"
            badge="Transparent"
            trend="up"
            icon={<Target className="w-4 h-4" />}
          />
          <MetricStatCard
            title="Discovery Pass"
            value="₹199"
            subtext="24 hours of full access"
            badge="Single Flat Fee"
            trend="neutral"
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* The Core Business Model Principle Bento Showcase */}
      <section className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="secondary" className="px-3 py-1 font-bold text-xs">
            The CollegeCentre Model
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Designed for Student Focus, Not Subscription Traps
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Traditional platforms charge monthly auto-renewals for idle accounts. CollegeCentre activates focused 24-hour sprints when you are ready to apply.
          </p>
        </div>

        <BentoGrid className="max-w-5xl">
          {/* Card 1: 2-column span with gradient */}
          <BentoGridItem
            className="md:col-span-2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-indigo-700/60"
            title="The 24-Hour Intensive Job Hunt Pass"
            description="When you are ready to hunt, ₹199 gives you full access to search, filter, match, and apply for 24 continuous hours. No auto-debit, no unexpected card charges."
            icon={<Clock className="w-5 h-5 text-indigo-400" />}
            header={
              <div className="flex flex-col justify-center h-full p-4 space-y-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-300">PASS SIMULATION</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[11px]">
                    24:00:00 Countdown
                  </Badge>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  Payment: Today, 10:30 AM <br />
                  <span className="text-emerald-400">Search Active Until: Tomorrow, 10:30 AM</span>
                </div>
              </div>
            }
          />

          {/* Card 2: Permanent Access Guarantee */}
          <BentoGridItem
            className="md:col-span-1"
            title="Permanent Career Tracker"
            description="Your application pipeline, shortlisted jobs, and interview notes never expire. Even after 24 hours, you keep complete access to track every submission."
            icon={<Bookmark className="w-5 h-5 text-emerald-600" />}
            header={
              <div className="flex flex-col items-center justify-center h-full bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/40">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Rule 11: Permanent Retention
                </span>
              </div>
            }
          />

          {/* Card 3: 100% Resume-Free Matching */}
          <BentoGridItem
            className="md:col-span-1"
            title="Zero Resume Uploads"
            description="No parsing failures or formatted document hassles. CollegeCentre matches opportunities directly from your college degree, batch year, and selected skills."
            icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
            header={
              <div className="flex flex-col items-center justify-center h-full bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/40">
                <FileCheck2 className="w-12 h-12 text-indigo-600 mb-2" />
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  Instant Profile Alignment
                </span>
              </div>
            }
          />

          {/* Card 4: Transparent AI Match Percentage */}
          <BentoGridItem
            className="md:col-span-2"
            title="Transparent Match Breakdown"
            description="See exactly why each opening matches you: Skills match (40%), Degree & branch (20%), Experience level (15%), Location (15%), and Fresher eligibility (10%)."
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
            header={
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-full items-center p-3 bg-muted/40 rounded-2xl border border-border/80 text-xs">
                <div className="p-2.5 bg-card rounded-xl border text-center">
                  <span className="text-muted-foreground block text-[10px]">Skills</span>
                  <span className="font-extrabold text-foreground">40% Weight</span>
                </div>
                <div className="p-2.5 bg-card rounded-xl border text-center">
                  <span className="text-muted-foreground block text-[10px]">Degree</span>
                  <span className="font-extrabold text-foreground">20% Weight</span>
                </div>
                <div className="p-2.5 bg-card rounded-xl border text-center">
                  <span className="text-muted-foreground block text-[10px]">Work Mode</span>
                  <span className="font-extrabold text-foreground">15% Weight</span>
                </div>
                <div className="p-2.5 bg-card rounded-xl border text-center">
                  <span className="text-muted-foreground block text-[10px]">Fresher</span>
                  <span className="font-extrabold text-emerald-600">10% Weight</span>
                </div>
              </div>
            }
          />
        </BentoGrid>
      </section>

      {/* Simple 4-Step Student Journey */}
      <section className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="secondary" className="px-3 py-1 font-bold text-xs">
            Step-by-Step
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            How CollegeCentre Works
          </h2>
          <p className="text-sm text-muted-foreground">
            Four easy steps designed around student time management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 relative hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-sm dark:bg-indigo-950 dark:text-indigo-400">
              01
            </div>
            <h3 className="font-bold text-base text-foreground">Set Up Profile</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Specify your college degree, branch, passing year, and technical skills in under 2 minutes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 relative hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center text-sm dark:bg-emerald-950 dark:text-emerald-400">
              02
            </div>
            <h3 className="font-bold text-base text-foreground">Unlock for ₹199</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pay via UPI, QR code, or Card. Your 24-hour job search window starts immediately.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 relative hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-extrabold flex items-center justify-center text-sm dark:bg-amber-950 dark:text-amber-400">
              03
            </div>
            <h3 className="font-bold text-base text-foreground">Find & Apply</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore high-match fresher roles, inspect AI match reasons, and submit applications directly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 relative hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 font-extrabold flex items-center justify-center text-sm dark:bg-purple-950 dark:text-purple-400">
              04
            </div>
            <h3 className="font-bold text-base text-foreground">Track Forever</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              After 24 hours, new discovery locks, but your saved jobs, pipeline stages, and notes remain permanent.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/70 via-background to-emerald-50/50 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-emerald-950/30 space-y-6 shadow-sm">
          <Badge className="bg-indigo-600 text-white px-3 py-1 font-bold text-xs mx-auto">
            Ready to Sprint?
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground">
            Activate Your ₹199 / 24-Hour Job Hunt Pass
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Unlock verified fresher openings, detailed match percentages, and direct employer application links right now.
          </p>

          <div className="pt-2 flex justify-center">
            <MovingBorder
              onClick={() => setIsPaymentModalOpen(true)}
              duration={3000}
              className="px-8 py-3"
            >
              <div className="flex items-center gap-2 text-base font-bold">
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>Get 24 Hours for ₹199</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </MovingBorder>
          </div>
        </div>
      </section>
    </div>
  )
}
