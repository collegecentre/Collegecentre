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

import { loadRazorpayScript } from '@/services/razorpay'

export const PaymentModal: React.FC = () => {
  const { student, isPaymentModalOpen, setIsPaymentModalOpen, activatePass } = useApp()
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handlePay = async () => {
    setIsProcessing(true)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

    // If real Razorpay key is provided
    if (razorpayKey && razorpayKey.startsWith('rzp_') && razorpayKey !== 'rzp_test_placeholder') {
      const isLoaded = await loadRazorpayScript()
      if (isLoaded && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: 19900, // ₹199 in paise
          currency: 'INR',
          name: 'CollegeCentre',
          description: '₹199 / 24-Hour Job Hunt Pass',
          prefill: {
            name: student?.name || 'Student Candidate',
            email: student?.email || 'student@collegecentre.in',
            contact: student?.phone || '',
          },
          theme: {
            color: '#fe7141',
          },
          handler: function () {
            setIsProcessing(false)
            activatePass(selectedMethod)
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false)
            },
          },
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
        return
      }
    }

    // Process payment and activate pass
    setTimeout(() => {
      setIsProcessing(false)
      activatePass(selectedMethod)
    }, 900)
  }

  const [upiId, setUpiId] = useState<string>('')
  const [selectedBank, setSelectedBank] = useState<string>('HDFC')

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent onClose={() => setIsPaymentModalOpen(false)} className="max-w-lg p-0 overflow-hidden border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-4 bg-muted/20 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Pass Checkout
          </span>
          <span className="font-mono text-[11px] font-bold text-vermilion uppercase tracking-wider">
            24-Hour Sprint Window
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
                  Flat Rate • No Renewal
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
                <span>Full access to all verified fresher openings</span>
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
                <span>Permanent Retention: Saved jobs & tracker stay accessible forever</span>
              </li>
            </ul>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Payment Method
              </label>
              <span className="font-mono text-[10px] text-muted-foreground">INSTANT ACTIVATION</span>
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

            {/* Method-specific input details */}
            {selectedMethod === 'UPI' && (
              <div className="p-3 border border-black/10 dark:border-white/15 bg-muted/5 space-y-2 font-mono text-xs">
                <label className="text-[10px] text-muted-foreground uppercase block">Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground rounded-xs focus:outline-none focus:border-[#fe7141]"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Supported: Google Pay, PhonePe, Paytm, CRED, BHIM
                </span>
              </div>
            )}

            {selectedMethod === 'Card' && (
              <div className="p-3 border border-black/10 dark:border-white/15 bg-muted/5 space-y-2.5 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase block">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 •••• •••• 1111"
                    maxLength={19}
                    className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground rounded-xs focus:outline-none focus:border-[#fe7141]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground rounded-xs focus:outline-none focus:border-[#fe7141]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground rounded-xs focus:outline-none focus:border-[#fe7141]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'NetBanking' && (
              <div className="p-3 border border-black/10 dark:border-white/15 bg-muted/5 space-y-2 font-mono text-xs">
                <label className="text-[10px] text-muted-foreground uppercase block">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`px-2.5 py-2 text-left border text-[11px] transition-colors rounded-xs ${
                        selectedBank === b
                          ? 'border-black dark:border-white bg-foreground text-background font-bold'
                          : 'border-black/10 dark:border-white/15 bg-background text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Ledger */}
          <div className="border-t border-b border-black/10 dark:border-white/15 py-3 font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Active Period</span>
              <span className="text-foreground font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-vermilion" /> 24 Hours (starts immediately)
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Base Amount</span>
              <span className="text-foreground">₹168.64</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST (18% included)</span>
              <span className="text-foreground">₹30.36</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-black/5 dark:border-white/10">
              <span>Total Amount</span>
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
              Instant Activation • Secure Payment
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
