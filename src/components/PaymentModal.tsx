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
  Lock,
  Smartphone,
  Copy,
} from 'lucide-react'

import { openRazorpayCheckout } from '@/services/razorpay'

export const PaymentModal: React.FC = () => {
  const { student, isPaymentModalOpen, setIsPaymentModalOpen, activatePass, showToast } = useApp()
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI')
  const [upiMode, setUpiMode] = useState<'qr' | 'apps' | 'id'>('qr')
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay')
  const [upiId, setUpiId] = useState<string>('')
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardExpiry, setCardExpiry] = useState<string>('')
  const [cardCvv, setCardCvv] = useState<string>('')
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('collegecentre@icici')
    setCopiedUpi(true)
    showToast?.('UPI ID copied to clipboard', 'info')
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setCardExpiry(raw)
    }
  }

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
            method: selectedMethod,
          },
          onSuccess: ({ paymentId, orderId }) => {
            setIsProcessing(false)
            activatePass(selectedMethod, paymentId, orderId)
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
      activatePass(selectedMethod)
    }, 850)
  }

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent
        onClose={() => setIsPaymentModalOpen(false)}
        className="max-w-lg p-0 border border-black/10 dark:border-white/15 bg-card flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl"
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Header & Plan Summary */}
          <DialogHeader className="text-left space-y-1 pb-2 border-b border-black/5 dark:border-white/10">
            <div className="flex items-baseline justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                24-Hour Discovery Sprint
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-foreground/85">
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

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Select Payment Option
              </label>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                ● Instant Activation
              </span>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-2 font-mono">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-2.5 border text-center flex flex-col items-center justify-center gap-1 transition-colors ${
                  selectedMethod === 'UPI'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground bg-card'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-2.5 border text-center flex flex-col items-center justify-center gap-1 transition-colors ${
                  selectedMethod === 'Card'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground bg-card'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NetBanking')}
                className={`p-2.5 border text-center flex flex-col items-center justify-center gap-1 transition-colors ${
                  selectedMethod === 'NetBanking'
                    ? 'border-black dark:border-white bg-foreground text-background font-bold shadow-xs'
                    : 'border-black/10 dark:border-white/15 hover:bg-muted/40 text-muted-foreground bg-card'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px] tracking-wider uppercase">NetBank</span>
              </button>
            </div>

            {/* Method Detail Views */}
            {selectedMethod === 'UPI' && (
              <div className="border border-black/10 dark:border-white/15 bg-muted/5 p-4 space-y-3 font-mono">
                {/* UPI Submode buttons */}
                <div className="flex border border-black/10 dark:border-white/15 text-[11px] p-0.5 bg-background">
                  <button
                    type="button"
                    onClick={() => setUpiMode('qr')}
                    className={`flex-1 py-1.5 text-center font-bold transition-colors ${
                      upiMode === 'qr'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode('apps')}
                    className={`flex-1 py-1.5 text-center font-bold transition-colors ${
                      upiMode === 'apps'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    UPI Apps
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiMode('id')}
                    className={`flex-1 py-1.5 text-center font-bold transition-colors ${
                      upiMode === 'id'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    UPI ID
                  </button>
                </div>

                {/* Submode 1: Scan QR Code */}
                {upiMode === 'qr' && (
                  <div className="p-4 bg-card border border-black/10 dark:border-white/15 text-center space-y-3">
                    <div className="inline-block p-3 bg-white text-black border border-black/10 rounded-sm shadow-xs">
                      {/* Stylized high-contrast SVG QR Code */}
                      <svg
                        viewBox="0 0 160 160"
                        className="w-36 h-36 mx-auto"
                        fill="currentColor"
                        shapeRendering="crispEdges"
                      >
                        {/* Finder Pattern: Top-Left */}
                        <rect x="10" y="10" width="40" height="40" rx="3" fill="none" stroke="#000" strokeWidth="6" />
                        <rect x="22" y="22" width="16" height="16" rx="2" fill="#000" />
                        {/* Finder Pattern: Top-Right */}
                        <rect x="110" y="10" width="40" height="40" rx="3" fill="none" stroke="#000" strokeWidth="6" />
                        <rect x="122" y="22" width="16" height="16" rx="2" fill="#000" />
                        {/* Finder Pattern: Bottom-Left */}
                        <rect x="10" y="110" width="40" height="40" rx="3" fill="none" stroke="#000" strokeWidth="6" />
                        <rect x="22" y="122" width="16" height="16" rx="2" fill="#000" />
                        {/* Timing and data modules */}
                        <rect x="58" y="16" width="8" height="8" fill="#000" />
                        <rect x="74" y="16" width="8" height="8" fill="#000" />
                        <rect x="90" y="16" width="8" height="8" fill="#000" />
                        <rect x="58" y="32" width="8" height="8" fill="#000" />
                        <rect x="82" y="32" width="8" height="8" fill="#000" />
                        <rect x="16" y="58" width="8" height="8" fill="#000" />
                        <rect x="32" y="58" width="8" height="8" fill="#000" />
                        <rect x="64" y="58" width="8" height="8" fill="#000" />
                        <rect x="88" y="58" width="8" height="8" fill="#000" />
                        <rect x="112" y="58" width="8" height="8" fill="#000" />
                        <rect x="136" y="58" width="8" height="8" fill="#000" />
                        <rect x="24" y="74" width="8" height="8" fill="#000" />
                        <rect x="48" y="74" width="8" height="8" fill="#000" />
                        <rect x="72" y="74" width="8" height="8" fill="#000" />
                        <rect x="96" y="74" width="8" height="8" fill="#000" />
                        <rect x="120" y="74" width="8" height="8" fill="#000" />
                        <rect x="144" y="74" width="8" height="8" fill="#000" />
                        <rect x="16" y="90" width="8" height="8" fill="#000" />
                        <rect x="40" y="90" width="8" height="8" fill="#000" />
                        <rect x="64" y="90" width="8" height="8" fill="#000" />
                        <rect x="88" y="90" width="8" height="8" fill="#000" />
                        <rect x="112" y="90" width="8" height="8" fill="#000" />
                        <rect x="58" y="112" width="8" height="8" fill="#000" />
                        <rect x="82" y="112" width="8" height="8" fill="#000" />
                        <rect x="106" y="112" width="8" height="8" fill="#000" />
                        <rect x="130" y="112" width="8" height="8" fill="#000" />
                        <rect x="58" y="136" width="8" height="8" fill="#000" />
                        <rect x="74" y="136" width="8" height="8" fill="#000" />
                        <rect x="98" y="136" width="8" height="8" fill="#000" />
                        <rect x="122" y="136" width="8" height="8" fill="#000" />
                        {/* Center Badge */}
                        <rect x="60" y="60" width="40" height="40" rx="4" fill="#fff" stroke="#000" strokeWidth="2" />
                        <text x="80" y="85" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fe7141" fontFamily="sans-serif">₹199</text>
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                        <span>UPI ID: <strong className="text-foreground">collegecentre@icici</strong></span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-vermilion hover:underline inline-flex items-center gap-0.5 ml-1"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Submode 2: Popular UPI Apps */}
                {upiMode === 'apps' && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase block">
                      Choose Your Preferred UPI App:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay', handle: '@okhdfcbank' },
                        { id: 'phonepe', name: 'PhonePe', handle: '@ybl' },
                        { id: 'paytm', name: 'Paytm UPI', handle: '@paytm' },
                        { id: 'cred', name: 'CRED UPI', handle: '@cred' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 border text-left flex items-center justify-between transition-colors ${
                            selectedUpiApp === app.id
                              ? 'border-black dark:border-white bg-foreground text-background font-bold'
                              : 'border-black/10 dark:border-white/15 bg-card hover:bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>{app.name}</span>
                            </div>
                            <div className={`text-[10px] ${selectedUpiApp === app.id ? 'text-background/80' : 'text-muted-foreground'}`}>
                              Instant Checkout
                            </div>
                          </div>
                          {selectedUpiApp === app.id && <Check className="w-4 h-4 text-vermilion" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submode 3: Enter UPI ID */}
                {upiMode === 'id' && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase block">
                      Enter UPI ID / VPA:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@paytm or user@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground focus:outline-none focus:border-vermilion"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      A payment request of ₹199 will be sent to your UPI app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Method View: Card */}
            {selectedMethod === 'Card' && (
              <div className="border border-black/10 dark:border-white/15 bg-muted/5 p-4 space-y-3 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-muted-foreground uppercase">Card Number</label>
                    <span className="text-[10px] text-muted-foreground">Visa • Mastercard • RuPay</span>
                  </div>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground focus:outline-none focus:border-vermilion font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground focus:outline-none focus:border-vermilion font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs border border-black/15 dark:border-white/20 bg-background text-foreground focus:outline-none focus:border-vermilion font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Method View: NetBanking */}
            {selectedMethod === 'NetBanking' && (
              <div className="border border-black/10 dark:border-white/15 bg-muted/5 p-4 space-y-2.5 font-mono text-xs">
                <label className="text-[10px] text-muted-foreground uppercase block">
                  Select Your Bank:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'HDFC Bank',
                    'State Bank of India',
                    'ICICI Bank',
                    'Axis Bank',
                    'Kotak Mahindra',
                    'Punjab National Bank',
                  ].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 text-left border text-[11px] transition-colors ${
                        selectedBank === b
                          ? 'border-black dark:border-white bg-foreground text-background font-bold'
                          : 'border-black/10 dark:border-white/15 bg-card text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <div className="truncate font-semibold">{b}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Ledger Breakdown */}
          <div className="border-t border-black/10 dark:border-white/15 pt-3 font-mono text-xs space-y-1">
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>Base Amount (24H Sprint)</span>
              <span>₹168.64</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>GST (18% Included)</span>
              <span>₹30.36</span>
            </div>
            <div className="flex justify-between font-bold text-xs text-foreground pt-1 border-t border-black/5 dark:border-white/10">
              <span>Total Billable</span>
              <span className="text-vermilion">₹199.00</span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer - ALWAYS VISIBLE AT BOTTOM */}
        <div className="border-t border-black/10 dark:border-white/15 p-4 sm:p-5 bg-card shrink-0 space-y-2 shadow-lg">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">Amount to Pay:</span>
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
                <span>Authorizing ₹199 Payment...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pay ₹199 & Unlock 24 Hours</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Instant 24H Activation</span>
            <span>•</span>
            <span>Rule 11 Guaranteed</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
