import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'

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

    // After sign up / profile creation, prompt for ₹199 unlock or direct to dashboard
    setCurrentView('dashboard')
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold dark:bg-indigo-950 dark:text-indigo-300">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-500" />
          <span>Get 24 Hours of Focused Job Hunting for ₹199</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          {isLogin ? 'Welcome Back to CollegeCentre' : 'Create Your Student Account'}
        </h1>
        <p className="text-xs text-muted-foreground">
          {isLogin
            ? 'Access your permanent tracker, saved jobs, and renewal options.'
            : 'Build your profile to unlock personalized 24-hour fresher job discovery.'}
        </p>
      </div>

      <Card className="border-indigo-100 shadow-xl dark:border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex border-b pb-3">
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all ${
                !isLogin
                  ? 'border-indigo-600 text-indigo-600 font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up & Profile
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all ${
                isLogin
                  ? 'border-indigo-600 text-indigo-600 font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Student Login
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">College Email ID</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu.in"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">College / University</label>
                  <Input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. NIT Surathkal / IIT / Delhi University"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Degree / Branch</label>
                    <Input
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.Tech CSE"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Grad Year</label>
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(parseInt(e.target.value))}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={2026}>2026 Batch</option>
                      <option value={2025}>2025 Batch</option>
                      <option value={2024}>2024 Batch</option>
                      <option value={2027}>2027 Batch</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="premium"
                className="w-full h-11 text-sm font-bold shadow-md shadow-indigo-500/25 gap-2"
              >
                <span>{isLogin ? 'Log In to Account' : 'Create Profile & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved jobs and tracking data remain permanent</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
