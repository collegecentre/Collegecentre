import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Briefcase,
  Compass,
  CheckCircle2,
  User,
  Zap,
  Clock,
  SlidersHorizontal,
  Sun,
  Moon,
} from 'lucide-react'

interface NavigationProps {
  onOpenDemo: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenDemo }) => {
  const {
    student,
    currentView,
    setCurrentView,
    isPassActive,
    isPassScheduled,
    startSprintNow,
    remainingTime,
    savedJobs,
    applications,
    setIsPaymentModalOpen,
    resolvedTheme,
    toggleTheme,
    isAuthenticated,
    signOut,
  } = useApp()

  const publicNavItems = [
    { id: 'landing', label: 'HOME' },
    { id: 'jobs', label: 'DISCOVER JOBS' },
    { id: 'pricing', label: 'PRICING' },
  ]

  const portalNavItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'applications', label: 'TRACKER', count: applications.length },
    { id: 'saved', label: 'SAVED', count: savedJobs.length },
  ]

  const mobileNavItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'dashboard', label: 'Desk', icon: SlidersHorizontal },
    { id: 'applications', label: 'Tracker', icon: CheckCircle2, badge: applications.length },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <>
      {/* Top Editorial Masthead (State of AI Design Style) */}
      <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/15 bg-white/95 dark:bg-black/95 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Brand Mark */}
          <button
            type="button"
            className="flex items-center gap-2.5 text-left select-none group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white p-1 -m-1 cursor-pointer"
            onClick={() => setCurrentView('landing')}
            aria-label="CollegeCentre Home"
          >
            <div className="h-7 w-7 rounded-sm bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-mono font-bold text-xs">
              CC
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-sm tracking-tight text-black dark:text-white uppercase">
                COLLEGECENTRE
              </span>
            </div>
          </button>

          {/* Monospace Editorial Nav Links: Separated into Public & App Portal */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px] tracking-tight" aria-label="Main Navigation">
            {/* Public Section */}
            {publicNavItems.map((item) => {
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-2.5 py-1 transition-colors relative flex items-center gap-1.5 rounded-sm cursor-pointer ${
                    isActive
                      ? 'text-black dark:text-white font-bold bg-slate-100 dark:bg-slate-900'
                      : 'text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}

            {/* Subtle Vertical Divider */}
            <span className="h-3.5 w-px bg-black/15 dark:bg-white/20 mx-1.5" />

            {/* Student App Portal Section */}
            {portalNavItems.map((item) => {
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-2.5 py-1 transition-colors relative flex items-center gap-1.5 rounded-sm cursor-pointer ${
                    isActive
                      ? 'text-black dark:text-white font-bold bg-slate-100 dark:bg-slate-900'
                      : 'text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] px-1 py-0.2 rounded-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Sign In / Profile Quick Link */}
            {isAuthenticated && student.name ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentView('profile')}
                  className="font-mono text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-2.5 py-1 border border-black/10 dark:border-white/15 rounded-sm cursor-pointer"
                  title="View and edit profile"
                >
                  <User className="w-3 h-3" />
                  <span>{student.name.split(' ')[0]}</span>
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="font-mono text-[10px] text-muted-foreground hover:text-red-500 uppercase px-1 cursor-pointer"
                  title="Sign Out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="font-mono text-[11px] font-bold text-foreground hover:text-[#fe7141] hidden sm:flex items-center gap-1.5 px-3 py-1 border border-black/15 dark:border-white/20 hover:border-[#fe7141] rounded-sm transition-colors cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              aria-label={`Current mode: ${resolvedTheme}. Click to switch theme.`}
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                  <span className="hidden sm:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-slate-800" />
                  <span className="hidden sm:inline">DARK</span>
                </>
              )}
            </button>

            {/* Demo Pass Simulator trigger - DEV ONLY */}
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={onOpenDemo}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-black dark:hover:border-white transition-colors flex items-center gap-1"
                title="Test pass timer and expiration simulator (Dev only)"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span className="hidden sm:inline">Dev Simulator</span>
              </button>
            )}

            {/* Pass Status / Unlock Button */}
            {isPassActive ? (
              <button
                type="button"
                onClick={() => setCurrentView('account')}
                aria-label={`Pass active: ${remainingTime.hours} hours and ${remainingTime.minutes} minutes remaining.`}
                className="font-mono text-xs px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 font-bold flex items-center gap-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tabular-nums">
                  {remainingTime.hours}H {remainingTime.minutes}M
                </span>
              </button>
            ) : isPassScheduled ? (
              <button
                type="button"
                onClick={() => startSprintNow()}
                className="font-mono text-xs px-2.5 py-1 rounded-sm bg-blue-50 text-blue-800 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-bold flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
                title="Your sprint is scheduled. Click to start early now!"
              >
                <Clock className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="hidden sm:inline">Scheduled •</span>
                <span>Start Now</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="font-mono text-xs font-bold px-3 py-1.5 rounded-sm bg-[#fe7141] hover:bg-[#e05828] text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                aria-label="Unlock 24-hour job hunt pass for ₹199"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Unlock Pass (₹199)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-black/10 dark:border-white/15 px-2 py-1">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id as any)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-sm transition-colors relative min-h-[48px] ${
                  isActive
                    ? 'text-black dark:text-white font-bold'
                    : 'text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] rounded-full text-[9px] bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono mt-1 tracking-tight">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
