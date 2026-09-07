import React from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Clock,
  Compass,
  Bookmark,
  CheckCircle2,
  User,
  Zap,
  SlidersHorizontal,
  ChevronRight,
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
    { id: 'dashboard', label: 'Dashboard', icon: Compass, protected: false },
    { id: 'jobs', label: 'Discover Jobs', icon: Briefcase, protected: false },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedJobs.length, permanent: true },
    { id: 'applications', label: 'Tracker', icon: CheckCircle2, badge: applications.length, permanent: true },
    { id: 'profile', label: 'Profile', icon: User, permanent: true },
  ]

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => setCurrentView('landing')}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">CC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  CollegeCentre
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Sprint
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                ₹199 / 24-Hour Fresher Job Discovery
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'landing'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'pricing'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Pricing (₹199)
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'jobs'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Find Jobs
            </button>
            <button
              onClick={() => setCurrentView('saved')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors relative ${
                currentView === 'saved'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Saved
              {savedJobs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-semibold">
                  {savedJobs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('applications')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors relative ${
                currentView === 'applications'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Tracker
              {applications.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'profile'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Controller Button */}
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

            {/* 24-Hour Pass Status Pill */}
            {isPassActive ? (
              <div
                onClick={() => setCurrentView('account')}
                className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs hover:bg-emerald-100 transition-colors dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-[11px] sm:text-xs">
                  {remainingTime.hours}h {remainingTime.minutes}m left
                </span>
              </div>
            ) : (
              <Button
                variant="premium"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
                className="h-8 text-xs font-semibold gap-1"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Unlock Pass ₹199</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/80 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 h-4 min-w-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
