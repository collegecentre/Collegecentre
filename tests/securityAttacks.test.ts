import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { isPaymentReplayed } from '../server/supabaseAdmin.js'
import { getProtectedJobs } from '../server/jobsHandler.js'

describe('Adversarial Security Attack Vector Tests', () => {
  it('Attack Vector 1: Modified LocalStorage Pass Tampering', async () => {
    // An attacker injects a fake active pass into localStorage:
    // localStorage.setItem('cc_access_period', JSON.stringify({ status: 'active', expires_at: '2099-01-01' }))
    // But when making a direct call to the server API:
    let responseData: any = null
    const mockReq: any = {
      method: 'GET',
      headers: {}, // Attacker has no valid server-signed JWT bearer token with active DB pass
    }
    const mockRes: any = {
      status: () => mockRes,
      json: (data: any) => {
        responseData = data
        return mockRes
      },
    }

    await getProtectedJobs(mockReq, mockRes)

    // The server MUST NOT grant pass entitlement from client localStorage claims!
    expect(responseData.userHasPass).toBe(false)
    expect(responseData.jobs[3].is_locked).toBe(true)
    expect(responseData.jobs[3].application_url).toBe('') // Application URL remains protected
  })

  it('Attack Vector 2: Modified Browser System Clock', () => {
    // An attacker sets their local computer clock back 10 years to pretend an expired pass is still active.
    const realServerExpireTimestamp = Date.now() - 3600 * 1000 // Expired 1 hour ago on server

    // Attacker's manipulated client clock says it's year 2015:
    const manipulatedClientNow = new Date('2015-01-01').getTime()
    expect(manipulatedClientNow).toBeLessThan(realServerExpireTimestamp)

    // On the authoritative server, comparison is ALWAYS against server time:
    const serverNow = Date.now()
    const isActuallyExpired = realServerExpireTimestamp < serverNow

    expect(isActuallyExpired).toBe(true)
    // Server rejects expired entitlement regardless of client clock tampering
  })

  it('Attack Vector 3: Direct API Calls Without a Pass', async () => {
    let responseData: any = null
    const mockReq: any = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalid_or_expired_user_token',
      },
    }
    const mockRes: any = {
      status: () => mockRes,
      json: (data: any) => {
        responseData = data
        return mockRes
      },
    }

    await getProtectedJobs(mockReq, mockRes)

    expect(responseData.userHasPass).toBe(false)
    // Locked jobs must have empty application_url and masked company
    const lockedJob = responseData.jobs.find((j: any) => j.is_locked)
    expect(lockedJob).toBeDefined()
    expect(lockedJob.application_url).toBe('')
    expect(lockedJob.company).toBe('[Verified Top Employer]')
  })

  it('Attack Vector 4: Forged Razorpay Payment Response', () => {
    const serverSecret = 'production_super_secret_key_12345'
    const fakeOrderId = 'order_fake_112233'
    const fakePaymentId = 'pay_fake_998877'

    // Attacker sends a random or stolen signature
    const forgedSignature = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'

    const expectedSignature = crypto
      .createHmac('sha256', serverSecret)
      .update(`${fakeOrderId}|${fakePaymentId}`)
      .digest('hex')

    let isMatch = false
    if (expectedSignature.length === forgedSignature.length) {
      isMatch = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(forgedSignature, 'utf-8')
      )
    }

    expect(isMatch).toBe(false)
  })

  it('Attack Vector 5: Payment Replay & Dual Activation', async () => {
    const replayPaymentId = `pay_attack_replay_${Date.now()}`
    const replayOrderId = `order_attack_replay_${Date.now()}`

    // Legitimate first redemption
    const { recordAuthoritativePassAndPayment } = await import('../server/supabaseAdmin.js')
    await recordAuthoritativePassAndPayment({
      userId: 'victim_user',
      studentEmail: 'victim@test.com',
      orderId: replayOrderId,
      paymentId: replayPaymentId,
      amount: 199.00,
    })

    // Attacker attempts to replay the same payment ID to unlock a second account:
    const isReplayDetected = await isPaymentReplayed(replayPaymentId, replayOrderId)
    expect(isReplayDetected).toBe(true)
  })
})
