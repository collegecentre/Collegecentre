import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/ui/input'
import { ShieldCheck, ArrowRight } from 'lucide-react'

interface AuthPagesProps {
  initialMode?: 'login' | 'signup'
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'signup' }) => {
  const { student, updateStudent, setCurrentView, setIsPaymentModalOpen } = useApp()
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login')

  const [name, setName] = useState<string>(student.name)
  const [email, setEmail] = useState<string>(student.email)
  const [college, setCollege] = useState<string>(student.college)
  const [degree, setDegree] = useState<string>(student.degree)
  const [gradYear, setGradYear] = useState<number>(student.graduation_year)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudent({
      ...student,
      name,
      email,
      college,
      degree,
      graduation_year: gradYear,
    })

    setCurrentView('dashboard')
    setIsPaymentModalOpen(true)
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
