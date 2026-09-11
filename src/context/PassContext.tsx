import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { AccessPeriod, Payment } from '@/types'
import { db } from '@/services/db'
import { supabase } from '@/services/supabase'
import confetti from 'canvas-confetti'

export interface RemainingTime {
  totalSeconds: number
  hours: number
  minutes: number
  seconds: number
  formatted: string
  isExpired: boolean
  isInactive?: boolean
}

interface PassContextType {
  accessPeriod: AccessPeriod | null
  payments: Payment[]
  isPassActive: boolean
  isPassScheduled: boolean
  scheduledStartTime?: string
  remainingTime: RemainingTime
  activatePass: (
    method?: 'UPI' | 'Card' | 'NetBanking',
    transactionId?: string,
    orderId?: string,
    scheduledFor?: string
  ) => void
  startSprintNow: () => void
  simulatePassExpiry: () => void
  simulateRemainingTime: (minutes: number) => void
  syncPassWithServer: () => Promise<void>
}

const PassContext = createContext<PassContextType | null>(null)

export const PassProvider: React.FC<{
  children: React.ReactNode
  studentId: string
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void
}> = ({ children, studentId, showToast }) => {
  const [accessPeriod, setAccessPeriod] = useState<AccessPeriod | null>(() => db.getAccessPeriod(studentId))
  const [payments, setPayments] = useState<Payment[]>(() => db.getPayments(studentId))
  const [now, setNow] = useState<number>(() => Date.now())

  // Reload pass and payment records whenever studentId changes (e.g. login or logout)
  useEffect(() => {
    setAccessPeriod(db.getAccessPeriod(studentId))
    setPayments(db.getPayments(studentId))
  }, [studentId])

  // Ticker for display-only countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync pass state from Supabase / server
  const syncPassWithServer = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (token) {
        const res = await fetch('/api/verify-pass', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const serverStatus = await res.json()
          if (serverStatus.pass) {
            setAccessPeriod(serverStatus.pass)
            db.saveAccessPeriod(serverStatus.pass, studentId)
          }
        }
      } else {
        // Local DB sync
        setAccessPeriod(db.getAccessPeriod(studentId))
      }
    } catch (err) {
      console.warn('Server pass sync warning:', err)
      setAccessPeriod(db.getAccessPeriod(studentId))
    }
  }, [studentId])

  useEffect(() => {
    syncPassWithServer()
  }, [syncPassWithServer, studentId])

  // Determine active vs scheduled vs expired strictly using timestamps
  const isPassScheduled = useMemo(() => {
    if (!accessPeriod) return false
    const startTime = new Date(accessPeriod.started_at).getTime()
    return startTime > now
  }, [accessPeriod, now])

  const isPassActive = useMemo(() => {
    if (!accessPeriod) return false
    const startTime = new Date(accessPeriod.started_at).getTime()
    const expireTime = new Date(accessPeriod.expires_at).getTime()
    return startTime <= now && expireTime > now
  }, [accessPeriod, now])

  const scheduledStartTime = useMemo(() => {
    if (!accessPeriod || !isPassScheduled) return undefined
    return accessPeriod.started_at
  }, [accessPeriod, isPassScheduled])

  const remainingTime = useMemo((): RemainingTime => {
    if (!accessPeriod) {
      return {
        totalSeconds: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        formatted: '00:00:00',
        isExpired: true,
        isInactive: true,
      }
    }

    const startTime = new Date(accessPeriod.started_at).getTime()
    const expireTime = new Date(accessPeriod.expires_at).getTime()

    // If pass is scheduled for the future, show countdown until start
    if (startTime > now) {
      const diffUntilStart = Math.max(0, Math.floor((startTime - now) / 1000))
      const h = Math.floor(diffUntilStart / 3600)
      const m = Math.floor((diffUntilStart % 3600) / 60)
      const s = diffUntilStart % 60
      return {
        totalSeconds: diffUntilStart,
        hours: h,
        minutes: m,
        seconds: s,
        formatted: `Starts in ${h}h ${m}m ${s}s`,
        isExpired: false,
        isInactive: false,
      }
    }

    const totalSeconds = Math.max(0, Math.floor((expireTime - now) / 1000))
    const isExpired = totalSeconds <= 0

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')
    const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

    return {
      totalSeconds,
      hours,
      minutes,
      seconds,
      formatted,
      isExpired,
      isInactive: false,
    }
  }, [accessPeriod, now])

  const activatePass = useCallback(
    (
      method: 'UPI' | 'Card' | 'NetBanking' = 'UPI',
      transactionId?: string,
      orderId?: string,
      scheduledFor?: string
    ) => {
      const result = db.activatePass(studentId, method, undefined, transactionId, orderId, scheduledFor)
      setAccessPeriod(result.accessPeriod)
      setPayments(db.getPayments())

      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch {
        // ignore
      }

      if (scheduledFor) {
        showToast('24-Hour Job Hunt Pass scheduled successfully!', 'success')
      } else {
        showToast('24-Hour Job Hunt Pass activated! Your application sprint has begun.', 'success')
      }
    },
    [showToast, studentId]
  )

  const startSprintNow = useCallback(() => {
    const updated = db.startScheduledPassNow(studentId)
    if (updated) {
      setAccessPeriod(updated)
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
      } catch {
        // ignore
      }
      showToast('24-Hour Job Hunt Sprint launched! Clock running now.', 'success')
    }
  }, [showToast, studentId])

  const simulatePassExpiry = useCallback(() => {
    db.simulateExpirePass(studentId)
    setAccessPeriod(db.getAccessPeriod(studentId))
    showToast('Simulated 24-hour pass expiration (Testing Mode)', 'info')
  }, [showToast, studentId])

  const simulateRemainingTime = useCallback(
    (minutes: number) => {
      db.setPassRemainingMinutes(minutes, studentId)
      setAccessPeriod(db.getAccessPeriod(studentId))
      showToast(`Pass timer calibrated to ${minutes} minutes remaining`, 'info')
    },
    [showToast, studentId]
  )

  return (
    <PassContext.Provider
      value={{
        accessPeriod,
        payments,
        isPassActive,
        isPassScheduled,
        scheduledStartTime,
        remainingTime,
        activatePass,
        startSprintNow,
        simulatePassExpiry,
        simulateRemainingTime,
        syncPassWithServer,
      }}
    >
      {children}
    </PassContext.Provider>
  )
}

export const usePass = (): PassContextType => {
  const ctx = useContext(PassContext)
  if (!ctx) throw new Error('usePass must be used within a PassProvider')
  return ctx
}
