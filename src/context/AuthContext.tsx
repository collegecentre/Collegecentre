import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { StudentProfile } from '@/types'
import { db } from '@/services/db'
import { supabase } from '@/services/supabase'

interface AuthContextType {
  student: StudentProfile
  updateStudent: (updated: StudentProfile, customToast?: string | null) => void
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{
  children: React.ReactNode
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void
}> = ({ children, showToast }) => {
  const [student, setStudent] = useState<StudentProfile>(() => db.getStudent())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Supabase Auth session synchronization across devices
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      const session = data?.session
      if (session?.user) {
        setIsAuthenticated(true)
        setStudent((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.name,
        }))
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setStudent((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.name,
        }))
      } else {
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateStudent = useCallback(
    (updated: StudentProfile, customToast?: string | null) => {
      db.saveStudent(updated)
      setStudent(updated)
      if (customToast !== null) {
        showToast(customToast || 'Profile updated successfully! Criteria match recalculated.', 'success')
      }
    },
    [showToast]
  )

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    const freshGuest = db.getStudent()
    setStudent(freshGuest)
    setIsAuthenticated(false)
    showToast('Signed out of student profile', 'info')
  }, [showToast])

  return (
    <AuthContext.Provider value={{ student, updateStudent, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
