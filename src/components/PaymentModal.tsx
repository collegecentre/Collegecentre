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
  Clock,
  ArrowRight,
  Lock,
  Zap,
} from 'lucide-react'
import { openRazorpayCheckout } from '@/services/razorpay'

export const PaymentModal: React.FC = () => {
  const { student, isPaymentModalOpen, setIsPaymentModalOpen, activatePass, showToast } = useApp()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handlePay = async () => {
    setIsProcessing(true)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

    // If real Razorpay key is configured
    if (razorpayKey && razorpayKey.startsWith('rzp_') && razorpayKey !== 'rzp_test_placeholder') {
      try {
        await openRazorpayCheckout({
          amountInPaise: 19900, // ₹199
          prefill: {
            name: student?.name || 'Student Candidate',
            email: student?.email || 'student@collegecentre.in',
            contact: student?.phone || '',
          },
          notes: {
            student_id: student?.id || 'guest_student',
            purpose: '24-Hour Job Hunt Pass',
          },
          onSuccess: ({ paymentId, orderId }) => {
            setIsProcessing(false)
            activatePass('UPI', paymentId, orderId)
          },
          onError: (errorMessage) => {
            setIsProcessing(false)
            showToast?.(`Payment failed: ${errorMessage}`, 'warning')
          },
          onDismiss: () => {
            setIsProcessing(false)
            showToast?.('Payment checkout was cancelled', 'info')
          },
        })
        return
      } catch (err: any) {
        console.error('Razorpay Checkout Init Error:', err)
        setIsProcessing(false)
        showToast?.(err?.message || 'Failed to initialize payment checkout', 'warning')
        return
      }
    }

    // Fast activation with simulated authorization (fallback when test placeholder is active)
    setTimeout(() => {
      setIsProcessing(false)
      activatePass('UPI')
    }, 850)
  }

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent
        onClose={() => setIsPaymentModalOpen(false)}
        className="max-w-md p-0 border border-black/10 dark:border-white/15 bg-card flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Fixed Header */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3.5 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-muted-foreground uppercase tracking-widest font-bold">
              Pass Checkout
            </span>
            <span className="px-1.5 py-0.5 border border-vermilion/40 bg-vermilion/10 text-vermilion text-[10px] font-bold uppercase">
              24-Hour Pass
            </span>
          </div>
          <div className="font-mono text-xs font-black text-foreground">
            ₹199 FLAT
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Header & Plan Summary */}
          <DialogHeader className="text-left space-y-1 pb-2 border-b border-black/5 dark:border-white/10">
            <div className="flex items-baseline justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                24-Hour Job Hunt Pass
              </DialogTitle>
              <div className="text-right">
                <span className="text-2xl font-black text-vermilion font-mono">₹199</span>
                <span className="text-[10px] text-muted-foreground font-mono block">One-time payment</span>
              </div>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Unrestricted fresher discovery, company CTC verification, and direct employer application links for 24 continuous hours.
            </DialogDescription>
          </DialogHeader>

          {/* Inclusions summary */}
          <div className="border border-black/10 dark:border-white/15 p-3.5 bg-muted/10 font-mono text-xs space-y-2">
            <div className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>What You Get:</span>
              <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[10px]">
                <Clock className="w-3 h-3" /> 24 Hours Continuous
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-foreground/85">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>All Fresher Openings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>AI Match Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>Direct Apply Links</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span>Permanent Desk Archive</span>
              </div>
            </div>
          </div>

          {/* Razorpay Gateway Information Card */}
          <div className="border border-black/10 dark:border-white/15 p-4 bg-muted/5 font-mono space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground uppercase text-[10px] tracking-wider">Payment Gateway:</span>
              <span className="px-2 py-0.5 border border-black/15 dark:border-white/20 bg-background text-[11px] font-bold text-foreground">
                Razorpay Standard Checkout
              </span>
            </div>

            <div className="text-[11px] text-muted-foreground space-y-1.5 pt-1">
              <div className="text-[10px] uppercase font-bold text-foreground tracking-wider">
                Supported Payment Options in Razorpay:
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-sans text-xs">
                <div className="flex items-center gap-1.5 text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  <span><strong>UPI:</strong> GPay, PhonePe, Paytm, QR</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  <span><strong>Cards:</strong> Visa, Master, RuPay</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  <span><strong>Net Banking:</strong> All Indian Banks</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  <span><strong>Wallets:</strong> Amazon Pay, Mobikwik</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Ledger Breakdown */}
          <div className="border-t border-black/10 dark:border-white/15 pt-3 font-mono text-xs space-y-1">
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>Base Access Fee (24H Sprint)</span>
              <span>₹168.64</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>GST (18% Included)</span>
              <span>₹30.36</span>
            </div>
            <div className="flex justify-between font-bold text-xs text-foreground pt-1 border-t border-black/5 dark:border-white/10">
              <span>Total Amount Payable</span>
              <span className="text-vermilion">₹199.00</span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer - ALWAYS VISIBLE AT BOTTOM */}
        <div className="border-t border-black/10 dark:border-white/15 p-4 sm:p-5 bg-card shrink-0 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Total Billable:</span>
            <span className="text-base font-black text-foreground">
              ₹199.00 <span className="text-[10px] text-muted-foreground font-normal">(All-Inclusive)</span>
            </span>
          </div>

          <Button
            size="lg"
            className="w-full h-12 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white rounded-none border-0 transition-colors shadow-none flex items-center justify-center gap-2 cursor-pointer"
            onClick={handlePay}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Opening Razorpay Checkout...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pay ₹199 with Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-vermilion" /> Instant Activation
            </span>
            <span>•</span>
            <span>No Auto-Debit</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
