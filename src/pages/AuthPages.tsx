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

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) {
        showToast(error.message, 'warning')
      }
    } catch {
      showToast('Google authentication error', 'warning')
    } finally {
      setIsAuthenticating(false)
    }
  }

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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        })

        if (error) {
          showToast(error.message || 'Invalid credentials. Please check your email and password.', 'warning')
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
              id: data?.user?.id || student.id,
              email: cleanEmail,
              name: data?.user?.user_metadata?.full_name || student.name || 'Fresher Student',
              phone: data?.user?.user_metadata?.phone || student.phone || '',
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
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        })

        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            showToast('This email is already registered. Please sign in instead.', 'warning')
            setIsLogin(true)
            setIsAuthenticating(false)
            return
          }
          showToast(error.message, 'warning')
          setIsAuthenticating(false)
          return
        }

        // Register student in local & cloud store with empty college/skills
        // so user will proceed to fill their job profile next
        const newStudent = {
          ...student,
          id: data?.user?.id || student.id || `cand_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          college: '',
          degree: '',
          skills: [],
        }

        updateStudent(newStudent, null)

        showToast('Account registered successfully! Now update your job profile.', 'success')
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
                : 'Register with your name, number, email, and password to begin.'}
            </p>
          </div>

          {!isLogin && (
            <div className="border border-[#fe7141]/30 bg-[#fe7141]/10 p-3 flex items-start gap-2.5 font-mono text-xs text-foreground">
              <Sparkles className="w-4 h-4 text-[#fe7141] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Two-Step Setup:</strong> Register your credentials here, then update your college and technical skills in Step 2 to unlock matches.
              </div>
            </div>
          )}

          {/* One-Click Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isAuthenticating}
            className="w-full h-11 px-4 border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white bg-card hover:bg-muted/30 transition-colors flex items-center justify-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isAuthenticating ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center font-mono text-[10px] text-muted-foreground uppercase">
            <span className="bg-card px-2 z-10">OR CONTINUE WITH EMAIL</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
          </div>

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
