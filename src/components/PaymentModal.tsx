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
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  ShieldCheck,
  Check,
  QrCode,
  CreditCard,
  Building2,
  Sparkles,
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
      <DialogContent onClose={() => setIsPaymentModalOpen(false)} className="max-w-md">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <Badge variant="matchMid" className="px-3 py-1 text-xs uppercase tracking-wider font-bold">
              24-Hour Job Hunt Pass
            </Badge>
            <span className="text-2xl font-extrabold text-foreground">₹199</span>
          </div>
          <DialogTitle className="text-xl mt-2 text-foreground">
            Unlock 24 Hours of Focused Job Discovery
          </DialogTitle>
          <DialogDescription>
            The 24-hour sprint begins immediately upon payment. Find, save, and apply to curated fresher opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Highlights */}
          <div className="rounded-xl bg-indigo-50/70 p-3.5 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>What's included in this sprint:</span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full access to the fresher & college student job database</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Personalized AI Match scores and reasons breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Save unlimited jobs & apply directly via official employer links</span>
              </li>
              <li className="flex items-center gap-2 font-medium text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Permanent Access:</strong> Saved jobs & application tracker stay yours forever!</span>
              </li>
            </ul>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Payment Method (Simulated)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  selectedMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-xs dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                    : 'border-border hover:bg-accent text-muted-foreground'
                }`}
              >
                <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  selectedMethod === 'Card'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-xs dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                    : 'border-border hover:bg-accent text-muted-foreground'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NetBanking')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  selectedMethod === 'NetBanking'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold shadow-xs dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                    : 'border-border hover:bg-accent text-muted-foreground'
                }`}
              >
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Pass Duration:</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> 24 Hours from completion
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span>₹199.00</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform Fee & Taxes:</span>
              <span className="text-emerald-600 font-medium">Included (₹0.00)</span>
            </div>
            <div className="border-t pt-1.5 flex justify-between font-bold text-sm text-foreground">
              <span>Total Payable:</span>
              <span className="text-indigo-600 dark:text-indigo-400">₹199</span>
            </div>
          </div>
        </div>

        {/* CTA Pay Button */}
        <div className="pt-2">
          <Button
            variant="premium"
            className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-500/25 gap-2"
            onClick={handlePay}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Simulating Payment Confirmation...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                Pay ₹199 & Unlock 24 Hours
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground mt-2">
            Simulated Sandbox Payment Flow for MVP · Activates pass instantly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
