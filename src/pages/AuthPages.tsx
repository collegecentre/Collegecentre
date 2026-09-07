import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { supabase } from '@/services/supabase'

interface AuthPagesProps {
  initialMode?: 'login' | 'signup'
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'signup' }) => {
  const { student, updateStudent, setCurrentView, showToast } = useApp()
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login')

  const [name, setName] = useState<string>(student.name)
  const [email, setEmail] = useState<string>(student.email)
  const [college, setCollege] = useState<string>(student.college)
  const [degree, setDegree] = useState<string>(student.degree)
  const [gradYear, setGradYear] = useState<number>(student.graduation_year)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudent({
      ...student,
      name: name.trim() || student.name || 'Fresher Student',
      email: email.trim() || student.email,
      college: college.trim() || student.college,
      degree: degree.trim() || student.degree,
      graduation_year: gradYear,
    })

    showToast(isLogin ? 'Logged into student profile!' : 'Account registered successfully!', 'success')
    setCurrentView('dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="border border-black/10 dark:border-white/15 bg-card">
        {/* Editorial Top Bar */}
        <div className="border-b border-black/10 dark:border-white/15 px-6 py-3 bg-muted/20 flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground uppercase tracking-widest">
            [AUTH // IDENTITY_SYSTEM]
          </span>
          <span className="font-bold text-vermilion uppercase tracking-wider">
            [₹199 / 24H SPRINT]
          </span>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 border-b border-black/10 dark:border-white/15 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-3 text-center uppercase tracking-wider transition-colors ${
              !isLogin
                ? 'bg-foreground text-background font-bold'
                : 'text-muted-foreground hover:text-foreground bg-muted/10'
            }`}
          >
            [01] NEW RECORD
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-3 text-center uppercase tracking-wider transition-colors ${
              isLogin
                ? 'bg-foreground text-background font-bold'
                : 'text-muted-foreground hover:text-foreground bg-muted/10'
            }`}
          >
            [02] STUDENT LOGIN
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Student Profile'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLogin
                ? 'Access your permanent desk, saved jobs, and pipeline tracker.'
                : 'No resume parser needed. Matched directly on verified criteria.'}
            </p>
          </div>

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
            <span>{isAuthenticating ? '[CONNECTING...]' : '[ CONTINUE WITH GOOGLE ]'}</span>
          </button>

          <div className="relative flex items-center justify-center font-mono text-[10px] text-muted-foreground uppercase">
            <span className="bg-card px-2 z-10">OR EMAIL CREDENTIALS</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="auth-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                College Email ID
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

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label htmlFor="auth-college" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    College / University
                  </label>
                  <Input
                    id="auth-college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="NIT Surathkal / IIT / Delhi Univ"
                    className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor="auth-degree" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Degree
                    </label>
                    <Input
                      id="auth-degree"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.Tech CSE"
                      className="h-10 rounded-none border-black/15 dark:border-white/20 font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="auth-grad-year" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Batch Year
                    </label>
                    <select
                      id="auth-grad-year"
                      value={gradYear}
                      onChange={(e) => setGradYear(parseInt(e.target.value))}
                      className="w-full h-10 rounded-none border border-black/15 dark:border-white/20 bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none uppercase"
                    >
                      <option value={2026}>2026 BATCH</option>
                      <option value={2025}>2025 BATCH</option>
                      <option value={2024}>2024 BATCH</option>
                      <option value={2027}>2027 BATCH</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 px-4 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>{isLogin ? 'AUTHENTICATE & ENTER' : 'CREATE PROFILE & CONTINUE'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground text-center uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rule 11: Saved data & records remain permanent</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
