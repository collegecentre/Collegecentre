import React from 'react'
import { useApp } from '@/context/AppContext'
import {
  Clock,
  ShieldCheck,
  Calendar,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react'

export const AccountPage: React.FC = () => {
  const {
    student,
    accessPeriod,
    isPassActive,
    remainingTime,
    payments,
    setIsPaymentModalOpen,
    resetData,
    theme,
    resolvedTheme,
    setTheme,
  } = useApp()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-black/10 dark:border-white/15 pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          [STUDENT_ACCOUNT // SPRINT_LEDGER]
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Account & Subscription Ledger
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your 24-hour sprint passes, verified transactions, and account guarantees.
            </p>
          </div>

          <div className="font-mono text-xs px-3 py-1.5 border border-black/10 dark:border-white/15 bg-muted/20 text-foreground">
            [{student.email}]
          </div>
        </div>
      </div>

      {/* Current Pass Status Box */}
      <div className="border border-black/10 dark:border-white/15 bg-card">
        <div className="p-6 border-b border-black/10 dark:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 border font-bold uppercase tracking-wider ${
                  isPassActive
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                    : 'border-black/20 dark:border-white/20 text-muted-foreground'
                }`}
              >
                {isPassActive ? '[PASS_ACTIVE]' : '[PASS_EXPIRED]'}
              </span>
              <span className="text-muted-foreground">// ₹199 FLAT 24-HOUR SPRINT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground font-sans tracking-tight">
              {isPassActive ? '24-Hour Job Hunt In Progress' : 'Job Hunt Discovery Concluded'}
            </h2>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-6 py-2.5 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            {isPassActive ? '[RENEW / EXTEND 24H]' : '[UNLOCK 24H PASS — ₹199]'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15 font-mono">
            <div className="p-4 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-vermilion" /> REMAINING_TIME
              </span>
              <p className="text-sm font-bold text-foreground">
                {isPassActive ? remainingTime.formatted : '00h 00m 00s (EXPIRED)'}
              </p>
            </div>

            <div className="p-4 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-foreground" /> ACTIVATION_TIMESTAMP
              </span>
              <p className="text-xs font-bold text-foreground">
                {accessPeriod
                  ? new Date(accessPeriod.started_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-foreground" /> EXPIRATION_TIMESTAMP
              </span>
              <p className="text-xs font-bold text-foreground">
                {accessPeriod
                  ? new Date(accessPeriod.expires_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="border border-black/10 dark:border-white/15 p-4 bg-muted/10 font-mono text-xs flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground uppercase tracking-wider">
                RULE 11 // PERMANENT RECORD GUARANTEE
              </span>
              <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                The ₹199 pass controls active search querying and AI scoring for new openings. Your student account, past applications, saved jobs, and interview stages remain yours forever.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipts & Transaction History */}
      <div className="border border-black/10 dark:border-white/15 bg-card">
        <div className="p-5 border-b border-black/10 dark:border-white/15 font-mono">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            TRANSACTION_LEDGER // PAYMENT RECEIPTS
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Verified simulated ₹199 transaction logs for this account
          </div>
        </div>

        <div className="p-5 font-mono">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-black/10 dark:border-white/15 bg-muted/10 uppercase">
              NO TRANSACTIONS RECORDED YET.
            </div>
          ) : (
            <div className="divide-y divide-black/10 dark:divide-white/10 text-xs">
              {payments.map((p) => (
                <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">₹{p.amount}.00</span>
                      <span className="px-1.5 py-0.2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
                        [{p.status}]
                      </span>
                      <span className="text-muted-foreground">
                        METHOD: [{p.payment_method}]
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      TXN_ID: {p.transaction_id} // {new Date(p.created_at).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-vermilion font-bold uppercase">
                    [24-HR PASS GRANTED]
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Theme Preference Box */}
      <div className="border border-black/10 dark:border-white/15 bg-card">
        <div className="p-5 border-b border-black/10 dark:border-white/15 bg-muted/20 font-mono flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">
              APPEARANCE // INTERFACE THEME
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Select your visual presentation mode for CollegeCentre
            </div>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase hidden sm:inline">
            [ACTIVE: {resolvedTheme.toUpperCase()}]
          </span>
        </div>

        <div className="p-6 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'LIGHT EDITORIAL', desc: 'Crisp white canvas with hairline dark rules', icon: Sun },
              { id: 'dark', label: 'DARK EDITORIAL', desc: 'Pitch black #0a0a0a with high-contrast text', icon: Moon },
              { id: 'system', label: 'SYSTEM ADAPTIVE', desc: 'Syncs automatically with your OS preference', icon: Laptop },
            ].map((option) => {
              const isSelected = theme === option.id
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id as any)}
                  className={`p-4 border text-left space-y-2 transition-colors ${
                    isSelected
                      ? 'border-black dark:border-white bg-muted/30 ring-1 ring-black dark:ring-white'
                      : 'border-black/10 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40 bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-foreground" />
                    {isSelected && (
                      <span className="text-[10px] font-bold text-vermilion uppercase">[ACTIVE]</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-foreground uppercase">{option.label}</div>
                  <p className="text-[11px] text-muted-foreground font-sans">{option.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reset Data option */}
      <div className="pt-2 flex justify-between items-center font-mono text-xs text-muted-foreground border-t border-black/10 dark:border-white/15">
        <span>AUTHENTICATED: {student.email}</span>
        <button
          onClick={resetData}
          className="text-xs text-muted-foreground hover:text-red-600 flex items-center gap-1 uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          <span>[RESET DEMO DATA]</span>
        </button>
      </div>
    </div>
  )
}

