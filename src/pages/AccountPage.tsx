import React from 'react'
import { useApp } from '@/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Zap,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Receipt,
  RotateCcw,
} from 'lucide-react'

export const AccountPage: React.FC = () => {
  const {
    student,
    accessPeriod,
    isPassActive,
    remainingTime,
    payments,
    setIsPaymentModalOpen,
    resetData,
  } = useApp()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Account & Pass Subscription
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your ₹199 / 24-hour job hunt passes and view payment receipts.
        </p>
      </div>

      {/* Current Pass Status Box */}
      <Card className="border-indigo-200 overflow-hidden shadow-sm dark:border-indigo-900">
        <div className="bg-gradient-to-r from-indigo-50 via-background to-emerald-50/40 p-5 border-b border-border dark:from-indigo-950/30 dark:to-emerald-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={isPassActive ? 'passActive' : 'passExpired'} className="font-bold">
                  {isPassActive ? '● Active Pass' : '○ Pass Expired'}
                </Badge>
                <span className="text-xs text-muted-foreground">₹199 / 24-Hour Tier</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-1">
                {isPassActive ? '24-Hour Job Hunt In Progress' : 'Job Hunt Discovery Locked'}
              </h2>
            </div>

            <Button
              variant={isPassActive ? 'outline' : 'premium'}
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="gap-2 text-xs font-bold h-9"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{isPassActive ? 'Renew / Extend 24h' : 'Unlock 24h Pass (₹199)'}</span>
            </Button>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Remaining Time
              </span>
              <p className="text-sm font-extrabold font-mono text-foreground">
                {isPassActive ? remainingTime.formatted : '00h 00m (Expired)'}
              </p>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Activated At
              </span>
              <p className="text-xs font-semibold text-foreground">
                {accessPeriod
                  ? new Date(accessPeriod.started_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'No active pass'}
              </p>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Expiration Time
              </span>
              <p className="text-xs font-semibold text-foreground">
                {accessPeriod
                  ? new Date(accessPeriod.expires_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Rule 11 Enforced:</strong> The 24-hour pass strictly controls access to discovering
              and applying to <em>new</em> jobs. Your student account, past applications, saved bookmarks,
              and interview status stages will never be locked or deleted.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Receipts & Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg">Payment History & Invoices</CardTitle>
          </div>
          <CardDescription>
            All simulated ₹199 passes purchased under this student profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {payments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">₹{p.amount}.00</span>
                      <Badge variant="success" className="text-[10px] px-1.5 py-0">
                        {p.status}
                      </Badge>
                      <span className="text-muted-foreground font-mono">
                        {p.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Txn: <span className="font-mono">{p.transaction_id}</span> •{' '}
                      {new Date(p.created_at).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      24h Pass Granted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Data option */}
      <div className="pt-4 flex justify-between items-center text-xs text-muted-foreground border-t">
        <span>Logged in as: <strong>{student.email}</strong></span>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetData}
          className="text-xs text-muted-foreground hover:text-destructive gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </Button>
      </div>
    </div>
  )
}
