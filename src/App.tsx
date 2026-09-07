import React, { useState } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { Navigation } from '@/components/Navigation'
import { DemoController } from '@/components/DemoController'
import { PaymentModal } from '@/components/PaymentModal'
import { JobDetailsModal } from '@/components/JobDetailsModal'
import { LandingPage } from '@/pages/LandingPage'
import { PricingPage } from '@/pages/PricingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { JobSearchPage } from '@/pages/JobSearchPage'
import { SavedJobsPage } from '@/pages/SavedJobsPage'
import { ApplicationsPage } from '@/pages/ApplicationsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AccountPage } from '@/pages/AccountPage'
import { AuthPages } from '@/pages/AuthPages'
import { BackgroundGrid } from '@/components/reactbits/BackgroundGrid'
import { ShieldCheck, Heart } from 'lucide-react'

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, selectedJob, setSelectedJob } = useApp()
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false)

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />
      case 'pricing':
        return <PricingPage />
      case 'dashboard':
        return <DashboardPage onSelectJob={(job) => setSelectedJob(job)} />
      case 'jobs':
        return <JobSearchPage onSelectJob={(job) => setSelectedJob(job)} />
      case 'saved':
        return <SavedJobsPage onSelectJob={(job) => setSelectedJob(job)} />
      case 'applications':
        return <ApplicationsPage />
      case 'profile':
        return <ProfilePage />
      case 'account':
        return <AccountPage />
      case 'login':
        return <AuthPages initialMode="login" />
      case 'signup':
        return <AuthPages initialMode="signup" />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-indigo-600 selection:text-white pb-16 md:pb-0 relative">
      <BackgroundGrid />
      {/* Top and Mobile Navigation */}
      <Navigation onOpenDemo={() => setIsDemoOpen(true)} />

      {/* Main Page Area */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Global Modals */}
      <DemoController open={isDemoOpen} onOpenChange={setIsDemoOpen} />
      <PaymentModal />
      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      {/* Footer */}
      <footer className="border-t border-border/80 bg-muted/30 py-8 px-4 text-xs text-muted-foreground mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CC
            </div>
            <span className="font-bold text-foreground">CollegeCentre</span>
            <span>— The ₹199 / 24-Hour Fresher Job Discovery Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-foreground transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className="hover:text-foreground transition-colors"
            >
              Pricing & Model
            </button>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Pass Simulator
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="hover:text-foreground transition-colors"
            >
              My Profile
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed for college students</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>& verified careers</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
