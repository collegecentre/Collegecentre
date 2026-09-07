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
import {
  TermsPage,
  PrivacyPolicyPage,
  RefundPolicyPage,
  ContactPage,
} from '@/pages/LegalPages'
import { BackgroundGrid } from '@/components/reactbits/BackgroundGrid'

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
      case 'terms':
        return <TermsPage />
      case 'privacy':
        return <PrivacyPolicyPage />
      case 'refunds':
        return <RefundPolicyPage />
      case 'contact':
        return <ContactPage />
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
      <footer className="border-t border-black/10 dark:border-white/15 bg-card/60 py-8 px-4 text-xs text-muted-foreground mt-auto font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs">
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
              className="text-vermilion font-semibold hover:underline"
            >
              Pass Simulator
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="hover:text-foreground transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={() => setCurrentView('account')}
              className="hover:text-foreground transition-colors"
            >
              Account
            </button>
            <span className="text-black/20 dark:text-white/20 hidden sm:inline">|</span>
            <button
              onClick={() => setCurrentView('terms')}
              className="hover:text-foreground transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => setCurrentView('privacy')}
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setCurrentView('refunds')}
              className="hover:text-foreground transition-colors"
            >
              Refund Policy
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>ENGINEERED FOR 2024–2027 BATCHES</span>
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
