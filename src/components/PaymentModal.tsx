import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Check,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
} from 'lucide-react'

export const PaymentModal: React.FC = () => {
  const { isPaymentModalOpen, setIsPaymentModalOpen, activatePass } = useApp()
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handlePay = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      activatePass(selectedMethod)
    }, 1200)
  }

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent onClose={() => setIsPaymentModalOpen(false)} className="max-w-lg p-0 overflow-hidden border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-4 bg-muted/20 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            [CHECKOUT // PASS_ACTIVATION]
          </span>
          <span className="font-mono text-[11px] font-bold text-vermilion uppercase tracking-wider">
            [24-HR SPRINT WINDOW]
          </span>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="text-left space-y-2">
            <div className="flex items-baseline justify-between">
              <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                24-Hour Pass
              </DialogTitle>
              <div className="text-right">
                <div className="text-3xl font-black text-foreground font-mono">₹199</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  Flat Rate // No Renewal
                </div>
              </div>
            </div>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Begins immediately upon completion. Provides 24 continuous hours of unrestricted fresher job discovery and AI match breakdown.
            </DialogDescription>
          </DialogHeader>

          {/* Included Features Grid */}
          <div className="border border-black/10 dark:border-white/15 p-4 bg-muted/10 space-y-2.5">
            <div className="font-mono text-[11px] font-bold text-foreground uppercase tracking-wider mb-2">
              Sprint Inclusions:
            </div>
            <ul className="text-xs space-y-2 text-foreground/90 font-mono">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>Full access to 150+ verified fresher openings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>AI score & requirement compatibility matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>Direct employer application links & verified CTC</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground pt-1 border-t border-black/5 dark:border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>RULE 11: Saved jobs & tracker stay accessible forever</span>
              </li>
            </ul>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Payment Channel (Simulated)
              </label>
              <span className="font-mono text-[10px] text-muted-foreground">SELECT 1 OF 3</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 border text-left flex flex-col items-center justify-center gap-1.5 transition-colors font-mono ${
                  selectedMethod === 'UPI'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-3 border text-left flex flex-col items-center justify-center gap-1.5 transition-colors font-mono ${
                  selectedMethod === 'Card'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">CARD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NetBanking')}
                className={`p-3 border text-left flex flex-col items-center justify-center gap-1.5 transition-colors font-mono ${
                  selectedMethod === 'NetBanking'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">NETBANK</span>
              </button>
            </div>
          </div>

          {/* Pricing Ledger */}
          <div className="border-t border-b border-black/10 dark:border-white/15 py-3 font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>ACTIVE_PERIOD</span>
              <span className="text-foreground font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-vermilion" /> 24:00:00 (TIMER STARTS ON CONFIRM)
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>BASE_FEE</span>
              <span className="text-foreground">₹199.00</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>TAX_SURCHARGE</span>
              <span className="text-emerald-600 font-medium">₹0.00 (INCLUDED)</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-black/5 dark:border-white/10">
              <span>TOTAL DUE</span>
              <span className="text-vermilion">₹199.00</span>
            </div>
          </div>

          {/* CTA Pay Button */}
          <div>
            <Button
              size="lg"
              className="w-full h-12 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white rounded-none border-0 transition-colors shadow-none gap-2"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING TRANSACTION...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>PAY ₹199 & UNLOCK 24 HOURS</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <p className="font-mono text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-wider">
              [SANDBOX ENVIRONMENT · INSTANT DEMO ACTIVATION]
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
