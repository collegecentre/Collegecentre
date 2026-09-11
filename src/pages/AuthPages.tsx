import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ArrowRight, Lock, Mail, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { db } from '@/services/db'

interface AuthPagesProps {
  initialMode?: 'login' | 'signup'
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'signup' }) => {
  const { student, updateStudent, setCurrentView, showToast } = useApp()
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login')

  const [name, setName] = useState<string>(student.name || '')
  const [phone, setPhone] = useState<string>(student.phone || '')
  const [email, setEmail] = useState<string>(student.email || '')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // ----------------------------------------------------
      // SIGN IN (Existing User)
      // ----------------------------------------------------
      const cleanEmail = email.trim().toLowerCase()
      if (!cleanEmail) {
        showToast('Please enter your email address.', 'warning')
        return
      }
      if (!password) {
        showToast('Please enter your account password.', 'warning')
        return
      }

      setIsAuthenticating(true)
      try {
        let authUser: any = null

        // 1. Attempt client direct authentication
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          })

          if (error) {
            // If explicit credential rejection, don't fallback
            if (!error.message.toLowerCase().includes('fetch')) {
              showToast(error.message || 'Invalid credentials. Please check your email and password.', 'warning')
              setIsAuthenticating(false)
              return
            }
            throw error // Trigger same-origin proxy fallback
          }

          authUser = data?.user
        } catch (directErr: any) {
          // 2. Same-Origin Fallback (/api/login)
          // Bypasses browser ad-blockers, third-party cookie restrictions, and CORS
          const proxyRes = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password }),
          })
          const proxyData = await proxyRes.json()

          if (!proxyRes.ok) {
            showToast(proxyData.error || 'Invalid credentials. Please check your email and password.', 'warning')
            setIsAuthenticating(false)
            return
          }

          if (proxyData.session) {
            await supabase.auth.setSession({
              access_token: proxyData.session.access_token,
              refresh_token: proxyData.session.refresh_token,
            })
            authUser = proxyData.user
          }
        }

        if (!authUser) {
          showToast('Could not establish session. Please check your connection.', 'warning')
          setIsAuthenticating(false)
          return
        }

        // Fetch cloud profile
        const cloudStudent = await db.fetchCloudStudentByEmail(cleanEmail)
        if (cloudStudent) {
          updateStudent(cloudStudent, null)
          showToast(`Welcome back, ${cloudStudent.name || 'Candidate'}!`, 'success')
          if (!cloudStudent.college?.trim() || !cloudStudent.skills?.length) {
            showToast('Please complete your job profile to unlock matched openings.', 'info')
            setCurrentView('profile')
          } else {
            setCurrentView('dashboard')
          }
        } else {
          updateStudent(
            {
              ...student,
              id: authUser?.id || student.id,
              email: cleanEmail,
              name: authUser?.user_metadata?.full_name || student.name || 'Fresher Student',
              phone: authUser?.user_metadata?.phone || student.phone || '',
            },
            null
          )
          showToast('Signed in! Please update your job profile.', 'info')
          setCurrentView('profile')
        }
      } catch (err: any) {
        showToast(err?.message || 'Login failed. Please check your credentials.', 'warning')
      } finally {
        setIsAuthenticating(false)
      }
    } else {
      // ----------------------------------------------------
      // REGISTER NEW USER (Name, Number, Email, Password)
      // Direct registration without email confirmation requirement
      // ----------------------------------------------------
      const cleanName = name.trim()
      const cleanPhone = phone.trim()
      const cleanEmail = email.trim().toLowerCase()

      if (!cleanName) {
        showToast('Please enter your full name.', 'warning')
        return
      }
      const digitsOnly = cleanPhone.replace(/\D/g, '')
      if (digitsOnly.length < 10) {
        showToast('Please enter a valid 10-digit mobile number.', 'warning')
        return
      }
      if (!cleanEmail || !cleanEmail.includes('@')) {
        showToast('Please enter a valid email address.', 'warning')
        return
      }
      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'warning')
        return
      }

      setIsAuthenticating(true)
      try {
        // Register via server endpoint to auto-confirm email and suppress Supabase confirmation mail
        let userId = ''
        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: cleanName,
              phone: cleanPhone,
              email: cleanEmail,
              password: password,
            }),
          })

          const json = await res.json()

          if (!res.ok || json.error) {
            if (json.error?.toLowerCase().includes('already registered')) {
              showToast('This email is already registered. Please sign in instead.', 'warning')
              setIsLogin(true)
              setIsAuthenticating(false)
              return
            }
            throw new Error(json.error || 'Server registration failed')
          }

          userId = json.user?.id || ''
        } catch (serverErr: any) {
          // Fallback to client signUp if endpoint is unavailable
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
              data: {
                full_name: cleanName,
                phone: cleanPhone,
              },
            },
          })

          if (signUpError) {
            if (signUpError.message.toLowerCase().includes('already registered')) {
              showToast('This email is already registered. Please sign in instead.', 'warning')
              setIsLogin(true)
              setIsAuthenticating(false)
              return
            }
            showToast(signUpError.message, 'warning')
            setIsAuthenticating(false)
            return
          }
          userId = signUpData?.user?.id || ''
        }

        // Sign in immediately to establish active authenticated session
        try {
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          })
        } catch {
          // Session will be picked up by AuthContext
        }

        // Register student in local & cloud store with empty college/skills
        // so user will proceed directly to fill their job profile next
        const newStudent = {
          ...student,
          id: userId || student.id || `cand_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          college: '',
          degree: '',
          skills: [],
        }

        updateStudent(newStudent, null)

        showToast('Account registered successfully! Now complete your job profile.', 'success')
        // CRITICAL: Immediately navigate user to Job Profile page
        setCurrentView('profile')
      } catch (err: any) {
        showToast(err?.message || 'Registration failed. Please try again.', 'warning')
      } finally {
        setIsAuthenticating(false)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="border border-black/10 dark:border-white/15 bg-card shadow-sm">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3 bg-muted/20 flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground uppercase tracking-widest">
            {isLogin ? 'Candidate Login' : 'New User Registration'}
          </span>
          <span className="font-bold text-[#fe7141] uppercase tracking-wider">
            ₹199 / 24-Hour Pass
          </span>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 border-b border-black/10 dark:border-white/15 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setIsLogin(false)
              setPassword('')
            }}
            className={`py-3 text-center uppercase tracking-wider transition-colors cursor-pointer ${
              !isLogin
                ? 'bg-foreground text-background font-bold'
                : 'text-muted-foreground hover:text-foreground bg-muted/10'
            }`}
          >
            Register New User
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(true)
              setPassword('')
            }}
            className={`py-3 text-center uppercase tracking-wider transition-colors cursor-pointer ${
              isLogin
                ? 'bg-foreground text-background font-bold'
                : 'text-muted-foreground hover:text-foreground bg-muted/10'
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLogin
                ? 'Access your permanent desk, saved jobs, and pipeline tracker.'
                : 'Enter your credentials to create an account and access job matching.'}
            </p>
          </div>

          {!isLogin && (
            <div className="border border-[#fe7141]/30 bg-[#fe7141]/10 p-3 flex items-start gap-2.5 font-mono text-xs text-foreground">
              <Sparkles className="w-4 h-4 text-[#fe7141] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Instant Account Creation:</strong> No email confirmation link needed. Register below, then update your college and technical skills in Step 2.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {/* Field 1: Name (for registration) */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  <span>Full Name</span>
                </label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>
            )}

            {/* Field 2: Number / Phone (for registration) */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="auth-phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  <span>Mobile / WhatsApp Number</span>
                </label>
                <Input
                  id="auth-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>
            )}

            {/* Field 3: Email */}
            <div className="space-y-1">
              <label htmlFor="auth-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                <span>Email Address</span>
              </label>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu.in"
                className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                required
              />
            </div>

            {/* Field 4: Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Password</span>
                </label>
                {!isLogin && (
                  <span className="text-[10px] text-muted-foreground">Min. 6 chars</span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full h-11 px-4 bg-[#fe7141] hover:bg-[#e05828] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isAuthenticating
                    ? 'Processing...'
                    : isLogin
                    ? 'Sign In & Enter'
                    : 'Register & Update Job Profile'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Switch Mode Prompt */}
            <div className="pt-1 text-center font-mono text-xs">
              {isLogin ? (
                <p className="text-muted-foreground">
                  New to CollegeCentre?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false)
                      setPassword('')
                    }}
                    className="font-bold text-[#fe7141] hover:underline cursor-pointer uppercase"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true)
                      setPassword('')
                    }}
                    className="font-bold text-foreground hover:underline cursor-pointer uppercase"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground text-center uppercase tracking-wider border-t border-black/5 dark:border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rule 11: Saved data & records remain permanent</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

