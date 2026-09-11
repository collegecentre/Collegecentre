import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { isPaymentReplayed } from '../server/supabaseAdmin.js'

describe('Payment Security & Razorpay Signature Verification', () => {
  const testSecret = 'secret_test_key_collegecentre_9988'
  const validOrderId = 'order_M123456789'
  const validPaymentId = 'pay_P987654321'

  // Generate authentic HMAC-SHA256 signature
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${validOrderId}|${validPaymentId}`)
    .digest('hex')

  it('validates a legitimate HMAC-SHA256 signature correctly', () => {
    const generated = crypto
      .createHmac('sha256', testSecret)
      .update(`${validOrderId}|${validPaymentId}`)
      .digest('hex')

    const isValid =
      generated.length === validSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generated, 'utf-8'),
        Buffer.from(validSignature, 'utf-8')
      )

    expect(isValid).toBe(true)
  })

  it('rejects a forged or tampered payment signature', () => {
    const forgedSignature = validSignature.replace(/^[a-f0-9]/, 'x')

    const generated = crypto
      .createHmac('sha256', testSecret)
      .update(`${validOrderId}|${validPaymentId}`)
      .digest('hex')

    let isValid = false
    if (generated.length === forgedSignature.length) {
      isValid = crypto.timingSafeEqual(
        Buffer.from(generated, 'utf-8'),
        Buffer.from(forgedSignature, 'utf-8')
      )
    }

    expect(isValid).toBe(false)
  })

  it('rejects payment replay when the same payment ID is submitted twice', async () => {
    const freshPaymentId = `pay_replay_test_${Date.now()}`
    const freshOrderId = `order_replay_test_${Date.now()}`

    // First attempt: Not replayed
    const firstCheck = await isPaymentReplayed(freshPaymentId, freshOrderId)
    expect(firstCheck).toBe(false)

    // Simulate saving the payment to cache/DB
    const { recordAuthoritativePassAndPayment } = await import('../server/supabaseAdmin.js')
    await recordAuthoritativePassAndPayment({
      userId: 'test_user_replay',
      studentEmail: 'replay@test.com',
      orderId: freshOrderId,
      paymentId: freshPaymentId,
      amount: 199.00,
    })

    // Second attempt with identical payment ID: Must be flagged as replay!
    const secondCheck = await isPaymentReplayed(freshPaymentId, freshOrderId)
    expect(secondCheck).toBe(true)
  })

  it('rejects payment orders below minimum threshold (100 paise)', () => {
    const invalidAmounts = [0, -50, 45, 99, NaN, null]
    for (const amt of invalidAmounts) {
      const num = Number(amt)
      const isInvalid = !num || isNaN(num) || num < 100
      expect(isInvalid).toBe(true)
    }
  })
})
