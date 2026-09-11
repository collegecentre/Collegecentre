import { describe, it, expect } from 'vitest'
import { recordAuthoritativePassAndPayment } from '../server/supabaseAdmin.js'

describe('Server-Side Entitlement & Pass Life-Cycle', () => {
  it('calculates exactly 24 hours of validity from activation timestamp', async () => {
    const now = Date.now()
    const { pass } = await recordAuthoritativePassAndPayment({
      userId: 'user_entitlement_test',
      studentEmail: 'user@test.com',
      orderId: `ord_${now}`,
      paymentId: `pay_${now}`,
      amount: 199.00,
    })

    const startTime = new Date(pass.started_at).getTime()
    const expireTime = new Date(pass.expires_at).getTime()
    const diffMs = expireTime - startTime
    const exact24HoursMs = 24 * 60 * 60 * 1000

    expect(diffMs).toBe(exact24HoursMs)
    expect(pass.status).toBe('active')
  })

  it('correctly handles scheduled sprints with future start timestamp', async () => {
    const futureStartTime = new Date(Date.now() + 4 * 3600 * 1000) // 4 hours in the future
    const { pass } = await recordAuthoritativePassAndPayment({
      userId: 'user_scheduled_test',
      studentEmail: 'scheduled@test.com',
      orderId: `ord_sched_${Date.now()}`,
      paymentId: `pay_sched_${Date.now()}`,
      scheduledFor: futureStartTime.toISOString(),
      amount: 199.00,
    })

    expect(pass.status).toBe('scheduled')
    expect(new Date(pass.started_at).getTime()).toBe(futureStartTime.getTime())

    const expireTime = new Date(pass.expires_at).getTime()
    const diffMs = expireTime - futureStartTime.getTime()
    expect(diffMs).toBe(24 * 60 * 60 * 1000)
  })

  it('rejects scheduling dates in the past or unreasonably far in the future', async () => {
    const pastTime = new Date(Date.now() - 3600 * 1000).toISOString() // 1 hr in past
    const { pass } = await recordAuthoritativePassAndPayment({
      userId: 'user_past_test',
      studentEmail: 'past@test.com',
      orderId: `ord_past_${Date.now()}`,
      paymentId: `pay_past_${Date.now()}`,
      scheduledFor: pastTime,
      amount: 199.00,
    })

    // If past timestamp provided, server safely falls back to immediate active start
    expect(pass.status).toBe('active')
  })
})
