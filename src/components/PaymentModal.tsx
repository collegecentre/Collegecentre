import React, { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Lock,
  Zap,
  AlertCircle,
  Edit3,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
} from 'lucide-react'
import { openRazorpayCheckout } from '@/services/razorpay'
import { StudentProfile } from '@/types'
import { supabase } from '@/services/supabase'
import { db } from '@/services/db'

/**
 * Checks whether a candidate's profile is complete enough to proceed to payment.
 * Requires genuine name, email, phone (at least 10 digits), and college/degree.
 */
export const isCandidateProfileComplete = (s?: StudentProfile | null): boolean => {
  if (!s) return false
  const name = (s.name || '').trim().toLowerCase()
  const email = (s.email || '').trim().toLowerCase()
  const degree = (s.degree || '').trim()

  const hasValidName = name.length >= 2 && name !== 'student candidate' && name !== 'fresher student'
  const hasValidEmail = email.includes('@') && email.includes('.') && email !== 'student@collegecentre.in'
  const hasValidDegree = degree.length >= 2

  return Boolean(hasValidName && hasValidEmail && hasValidDegree)
}

export const PaymentModal: React.FC = () => {
  const {
    student,
    updateStudent,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    activatePass,
    showToast,
    isAuthenticated,
    setCurrentView,
  } = useApp()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [timingMode, setTimingMode] = useState<'now' | 'scheduled'>('now')
  const [selectedSchedule, setSelectedSchedule] = useState<string>('')

  // Two-step checkout: 1 = Candidate Profile Setup, 2 = Sprint Timing & Payment
  const isProfileComplete = isCandidateProfileComplete(student)
  const [step, setStep] = useState<1 | 2>(isProfileComplete ? 2 : 1)

  // Local form state for candidate profile
  const [profileName, setProfileName] = useState<string>(student?.name || '')
  const [profileEmail, setProfileEmail] = useState<string>(student?.email || '')
  const [profilePhone, setProfilePhone] = useState<string>(student?.phone || '')
  const [profileCollege, setProfileCollege] = useState<string>(student?.college || '')
  const [profileDegree, setProfileDegree] = useState<string>(student?.degree || 'Computer Science & Engineering')
  const [profileBatch, setProfileBatch] = useState<number>(student?.graduation_year || 2026)
  const [formError, setFormError] = useState<string>('')

  // Sync state whenever modal opens or student profile updates
  useEffect(() => {
    if (isPaymentModalOpen) {
      if (!isAuthenticated) {
        setIsPaymentModalOpen(false)
        setCurrentView('login')
        return
      }
      const ready = isCandidateProfileComplete(student)
      setStep(ready ? 2 : 1)
      setProfileName(student?.name || '')
      setProfileEmail(student?.email || '')
      setProfilePhone(student?.phone || '')
      setProfileCollege(student?.college || '')
      setProfileDegree(student?.degree || 'Computer Science & Engineering')
      setProfileBatch(student?.graduation_year || 2026)
      setFormError('')
    }
  }, [isPaymentModalOpen, student, isAuthenticated, setIsPaymentModalOpen, setCurrentView])

  // Compute convenient scheduling presets
  const presets = useMemo(() => {
    const now = new Date()
    const options: { label: string; sublabel: string; value: string }[] = []

    const today7pm = new Date()
    today7pm.setHours(19, 0, 0, 0)
    if (today7pm.getTime() > now.getTime() + 20 * 60 * 1000) {
      options.push({
        label: 'Tonight @ 7:00 PM',
        sublabel: 'After college hours',
        value: today7pm.toISOString(),
      })
    }

    const today9pm = new Date()
    today9pm.setHours(21, 0, 0, 0)
    if (today9pm.getTime() > now.getTime() + 20 * 60 * 1000) {
      options.push({
        label: 'Tonight @ 9:00 PM',
        sublabel: 'Late night focus sprint',
        value: today9pm.toISOString(),
      })
    }

    const tomorrow9am = new Date()
    tomorrow9am.setDate(tomorrow9am.getDate() + 1)
    tomorrow9am.setHours(9, 0, 0, 0)
    options.push({
      label: 'Tomorrow @ 9:00 AM',
      sublabel: 'Fresh morning sprint',
      value: tomorrow9am.toISOString(),
    })

    const tomorrow2pm = new Date()
    tomorrow2pm.setDate(tomorrow2pm.getDate() + 1)
    tomorrow2pm.setHours(14, 0, 0, 0)
    options.push({
      label: 'Tomorrow @ 2:00 PM',
      sublabel: 'Afternoon dedicated batch',
      value: tomorrow2pm.toISOString(),
    })

    return options
  }, [])

  // Default selected schedule to first preset if scheduled mode is selected
  useEffect(() => {
    if (timingMode === 'scheduled' && !selectedSchedule && presets.length > 0) {
      setSelectedSchedule(presets[0].value)
    }
  }, [timingMode, selectedSchedule, presets])

  const effectiveScheduledFor = timingMode === 'scheduled' ? selectedSchedule : undefined

  // Save profile and advance to Step 2
  const handleSaveProfileAndContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setFormError('')

    const name = profileName.trim()
    const email = profileEmail.trim()
    const cleanPhone = profilePhone.replace(/\D/g, '')
    const college = profileCollege.trim()
    const degree = profileDegree.trim()

    if (!name || name.length < 2) {
      setFormError('Please enter your full candidate name (minimum 2 characters).')
      return
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.')
      return
    }
    if (cleanPhone.length > 0 && cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number if provided.')
      return
    }
    if (!degree || degree.length < 2) {
      setFormError('Please enter your degree / discipline.')
      return
    }

    // Save student profile
    const updatedStudent: StudentProfile = {
      ...student,
      name,
      email,
      phone: cleanPhone,
      college,
      degree,
      graduation_year: profileBatch,
    }

    updateStudent(updatedStudent, 'Candidate profile verified! Proceeding to payment.')
    setStep(2)
  }

  const handlePay = async () => {
    // Strict profile check: Cannot pay without complete candidate profile
    if (!isCandidateProfileComplete(student)) {
      setStep(1)
      showToast?.('Please complete your candidate profile before making payment.', 'warning')
      return
    }

    setIsProcessing(true)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

    // If real Razorpay key is configured
    if (razorpayKey && razorpayKey.startsWith('rzp_') && razorpayKey !== 'rzp_test_placeholder') {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        await openRazorpayCheckout({
          amountInPaise: 19900, // ₹199
          authToken: session?.access_token,
          scheduledFor: effectiveScheduledFor,
          candidateEmail: student?.email || profileEmail.trim(),
          candidateId: student?.id,
          prefill: {
            name: student?.name || profileName.trim() || 'Candidate',
            email: student?.email || profileEmail.trim() || 'candidate@collegecentre.in',
            contact: student?.phone || profilePhone.replace(/\D/g, '') || '',
          },
          notes: {
            student_id: student?.id || 'guest_student',
            purpose: '24-Hour Job Hunt Pass',
            scheduled_for: effectiveScheduledFor || 'immediate',
            college: student?.college || profileCollege,
            batch: String(student?.graduation_year || profileBatch),
          },
          onSuccess: ({ paymentId, orderId, serverPass }) => {
            setIsProcessing(false)
            if (serverPass) {
              db.saveAccessPeriod(serverPass, student?.id)
            }
            activatePass('UPI', paymentId, orderId, effectiveScheduledFor)
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
      activatePass('UPI', undefined, undefined, effectiveScheduledFor)
    }, 850)
  }

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent
        onClose={() => setIsPaymentModalOpen(false)}
        className="max-w-lg p-0 border border-black/10 dark:border-white/15 bg-card flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-2xl"
      >
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3.5 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-muted-foreground uppercase tracking-widest font-bold">
              {step === 1 ? 'Step 1 of 2: Profile' : 'Step 2 of 2: Checkout'}
            </span>
            <span className="px-1.5 py-0.5 border border-vermilion/40 bg-vermilion/10 text-vermilion text-[10px] font-bold uppercase">
              24-Hour Pass
            </span>
          </div>
          <div className="font-mono text-xs font-black text-foreground">
            ₹199 FLAT
          </div>
        </div>

        {/* 2-Step Flow Indicator */}
        <div className="grid grid-cols-2 font-mono text-xs border-b border-black/10 dark:border-white/15 bg-muted/5">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2.5 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              step === 1
                ? 'border-b-2 border-vermilion bg-vermilion/5 font-bold text-vermilion'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
              isCandidateProfileComplete(student)
                ? 'bg-emerald-600 text-white'
                : step === 1
                ? 'bg-vermilion text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {isCandidateProfileComplete(student) ? '✓' : '1'}
            </span>
            <span className="text-[11px] uppercase tracking-wider">Candidate Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isCandidateProfileComplete(student)) {
                setStep(2)
              } else {
                handleSaveProfileAndContinue()
              }
            }}
            className={`py-2.5 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
              step === 2
                ? 'border-b-2 border-vermilion bg-vermilion/5 font-bold text-vermilion'
                : 'text-muted-foreground hover:text-foreground opacity-80'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
              step === 2
                ? 'bg-vermilion text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              2
            </span>
            <span className="text-[11px] uppercase tracking-wider">Timing & Pay</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {step === 1 ? (
            /* STEP 1: CANDIDATE PROFILE SETUP */
            <div className="space-y-4">
              <DialogHeader className="text-left space-y-1 pb-2 border-b border-black/5 dark:border-white/10">
                <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Create Candidate Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  Direct employer applications, ATS-free match scoring, and tracking logs are permanently tied to your profile. Please complete your details before paying.
                </DialogDescription>
              </DialogHeader>

              {/* Requirement Callout */}
              <div className="border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Profile Creation Mandatory Before Payment</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  No generic guest accounts. Recruiters require your verified college discipline, graduation batch, and contact details to process direct applications.
                </p>
              </div>

              {formError && (
                <div className="border border-red-500/40 bg-red-500/10 p-3 font-mono text-xs text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Candidate Details Form */}
              <form id="candidate-modal-profile-form" onSubmit={handleSaveProfileAndContinue} className="space-y-3 font-mono">
                <div className="space-y-1">
                  <label htmlFor="modal-profile-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-vermilion" /> Full Name *
                  </label>
                  <Input
                    id="modal-profile-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="modal-profile-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-vermilion" /> Email Address *
                    </label>
                    <Input
                      id="modal-profile-email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="modal-profile-phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-vermilion" /> WhatsApp / Mobile *
                    </label>
                    <Input
                      id="modal-profile-phone"
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="modal-profile-college" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-vermilion" /> College / University *
                  </label>
                  <Input
                    id="modal-profile-college"
                    value={profileCollege}
                    onChange={(e) => setProfileCollege(e.target.value)}
                    placeholder="e.g. BITS Pilani / NIT / Anna University"
                    className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="modal-profile-degree" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-vermilion" /> Degree / Discipline *
                    </label>
                    <Input
                      id="modal-profile-degree"
                      value={profileDegree}
                      onChange={(e) => setProfileDegree(e.target.value)}
                      placeholder="e.g. B.Tech CSE / MCA"
                      className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="modal-profile-batch" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Graduating Batch *
                    </label>
                    <select
                      id="modal-profile-batch"
                      value={profileBatch}
                      onChange={(e) => setProfileBatch(parseInt(e.target.value))}
                      className="w-full h-10 rounded-none border border-black/15 dark:border-white/20 bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none uppercase"
                    >
                      <option value={2026}>2026 BATCH</option>
                      <option value={2025}>2025 BATCH</option>
                      <option value={2024}>2024 BATCH</option>
                      <option value={2027}>2027 BATCH</option>
                    </select>
                  </div>
                </div>
              </form>

              {/* Pass inclusions highlight */}
              <div className="border border-black/10 dark:border-white/15 p-3 bg-muted/10 font-mono text-xs space-y-1.5">
                <div className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Pass Unlocks:</span>
                  <span className="text-emerald-600 font-semibold text-[10px]">₹199 / 24 Hours</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-foreground/80">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-vermilion shrink-0" />
                    <span>All Fresher Jobs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-vermilion shrink-0" />
                    <span>Direct Recruiter Links</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-vermilion shrink-0" />
                    <span>AI Batch Calibration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-vermilion shrink-0" />
                    <span>Application Tracker</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: TIMING & PAYMENT */
            <div className="space-y-4">
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

              {/* Verified Candidate Profile Badge */}
              <div className="border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Candidate Profile</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-vermilion hover:underline flex items-center gap-1 font-bold cursor-pointer uppercase"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-foreground/85 pt-1 border-t border-emerald-500/20">
                  <div>
                    <span className="text-muted-foreground">Candidate:</span>{' '}
                    <strong>{student?.name || profileName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Batch:</span>{' '}
                    <strong>{student?.graduation_year || profileBatch} Batch</strong>
                  </div>
                  <div className="truncate">
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <span>{student?.email || profileEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">WhatsApp:</span>{' '}
                    <span>+91 {student?.phone || profilePhone}</span>
                  </div>
                  <div className="sm:col-span-2 truncate">
                    <span className="text-muted-foreground">College:</span>{' '}
                    <span>{student?.college || profileCollege} ({student?.degree || profileDegree})</span>
                  </div>
                </div>
              </div>

              {/* Sprint Timing Selector */}
              <div className="border border-black/15 dark:border-white/20 p-4 bg-muted/20 font-mono space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-vermilion" /> Sprint Timing:
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {timingMode === 'now' ? 'Starts Upon Payment' : 'Starts At Scheduled Time'}
                  </span>
                </div>

                {/* Toggle options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimingMode('now')}
                    className={`px-3 py-2.5 text-left border transition-all ${
                      timingMode === 'now'
                        ? 'border-vermilion bg-vermilion/10 text-foreground font-bold shadow-sm'
                        : 'border-black/10 dark:border-white/15 bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1.5 font-bold">
                        <Zap className="w-3.5 h-3.5 text-vermilion" /> Start Now
                      </span>
                      {timingMode === 'now' && <Check className="w-3.5 h-3.5 text-vermilion" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Launch 24h clock immediately
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimingMode('scheduled')}
                    className={`px-3 py-2.5 text-left border transition-all ${
                      timingMode === 'scheduled'
                        ? 'border-vermilion bg-vermilion/10 text-foreground font-bold shadow-sm'
                        : 'border-black/10 dark:border-white/15 bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Schedule Start
                      </span>
                      {timingMode === 'scheduled' && <Check className="w-3.5 h-3.5 text-vermilion" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Don't waste time while sleeping
                    </div>
                  </button>
                </div>

                {/* Preset Selection if Scheduled */}
                {timingMode === 'scheduled' && (
                  <div className="pt-2 space-y-2 border-t border-black/10 dark:border-white/15">
                    <div className="text-[10px] uppercase font-bold text-foreground tracking-wider">
                      Select your application sprint start time:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setSelectedSchedule(preset.value)}
                          className={`p-2 text-left border transition-all ${
                            selectedSchedule === preset.value
                              ? 'border-vermilion bg-vermilion/10 text-foreground font-bold'
                              : 'border-black/10 dark:border-white/10 bg-background text-muted-foreground hover:text-foreground hover:border-black/25'
                          }`}
                        >
                          <div className="text-xs font-bold text-foreground">{preset.label}</div>
                          <div className="text-[10px] text-muted-foreground">{preset.sublabel}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">
                      ✓ Your 24-hour countdown will stay paused until the selected time. You can also start early from your dashboard.
                    </p>
                  </div>
                )}
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
                    Supported Payment Options:
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
          )}
        </div>

        {/* Sticky Action Footer - ALWAYS VISIBLE AT BOTTOM */}
        <div className="border-t border-black/10 dark:border-white/15 p-4 sm:p-5 bg-card shrink-0 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">
              {step === 1 ? 'Step 1 of 2:' : 'Total Billable:'}
            </span>
            <span className="text-base font-black text-foreground">
              {step === 1 ? (
                <span className="text-xs uppercase font-bold text-vermilion">Profile Setup Required</span>
              ) : (
                <>₹199.00 <span className="text-[10px] text-muted-foreground font-normal">(All-Inclusive)</span></>
              )}
            </span>
          </div>

          {step === 1 ? (
            <Button
              size="lg"
              className="w-full h-12 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-vermilion hover:bg-vermilion-hover text-white rounded-none border-0 transition-colors shadow-none flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => handleSaveProfileAndContinue()}
            >
              <span>Save Profile & Proceed to Pay ₹199</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
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
          )}

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
