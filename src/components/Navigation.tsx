import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { ShinyText } from '@/components/reactbits/ShinyText'
import { StarBorder } from '@/components/reactbits/StarBorder'
import {
  Briefcase,
  Clock,
  Compass,
  Bookmark,
  CheckCircle2,
  User,
  Zap,
  SlidersHorizontal,
} from 'lucide-react'

interface NavigationProps {
  onOpenDemo: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenDemo }) => {
  const {
    currentView,
    setCurrentView,
    isPassActive,
    remainingTime,
    savedJobs,
    applications,
    setIsPaymentModalOpen,
  } = useApp()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'jobs', label: 'Discover Jobs', icon: Briefcase },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedJobs.length },
    { id: 'applications', label: 'Tracker', icon: CheckCircle2, badge: applications.length },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <>
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl shadow-xs">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo - Semantic Button */}
          <button
            type="button"
            className="flex items-center gap-3 text-left select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1"
            onClick={() => setCurrentView('landing')}
            aria-label="CollegeCentre Home"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-xl tracking-tighter">CC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-foreground">
                  CollegeCentre
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60">
                  Sprint
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                <ShinyText text="₹199 / 24-Hour Job Hunt Pass" speed={5} />
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links with visible focus rings and targeted transitions */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                currentView === 'landing'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('pricing')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                currentView === 'pricing'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                currentView === 'dashboard'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('jobs')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                currentView === 'jobs'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Find Jobs
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('saved')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative ${
                currentView === 'saved'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Saved
              {savedJobs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-bold">
                  {savedJobs.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('applications')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative ${
                currentView === 'applications'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Tracker
              {applications.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('profile')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                currentView === 'profile'
                  ? 'text-primary bg-primary/10 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Pass Simulator trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenDemo}
              className="text-xs gap-1.5 h-8 border-dashed border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
              title="Test pass expiration and timer simulator"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pass Simulator</span>
            </Button>

            {/* Pass Status / Unlock Button */}
            {isPassActive ? (
              <button
                type="button"
                onClick={() => setCurrentView('account')}
                aria-label={`Pass active: ${remainingTime.hours} hours and ${remainingTime.minutes} minutes remaining. View account details.`}
                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 text-xs font-bold shadow-xs hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="font-mono tabular-nums text-[11px] sm:text-xs tracking-tight">
                  {remainingTime.hours}h {remainingTime.minutes}m left
                </span>
              </button>
            ) : (
              <StarBorder
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-xs"
                color="#6366f1"
                speed="5s"
                aria-label="Unlock 24-hour job hunt pass for ₹199"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" aria-hidden="true" />
                <span className="font-bold text-xs">Unlock Pass ₹199</span>
              </StarBorder>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/80 px-2 py-1 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative min-h-[48px] ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 h-4 min-w-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
