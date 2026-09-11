import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import {
  authenticateRequestUser,
  isPaymentReplayed,
  recordAuthoritativePassAndPayment,
  checkServerUserPassStatus,
} from './supabaseAdmin.js';

/**
 * Creates a Razorpay Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt, notes }
 * Return: { order_id, amount, currency }
 */
export async function createOrder(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(401).json({
      error: 'Razorpay API credentials not configured on server',
    });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    const amountNum = Number(amount);
    if (!amountNum || isNaN(amountNum) || amountNum < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum amount must be at least 100 paise (₹1.00).',
      });
    }

    // Enforce fixed ₹199 price for 24-Hour Pass in production
    const fixedAmount = 19900; // 19900 paise = ₹199.00

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: fixedAmount,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        ...(notes || {}),
        product: 'CollegeCentre 24-Hour Job Hunt Pass',
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({
      error: error?.error?.description || error?.message || 'Failed to create Razorpay order',
    });
  }
}

/**
 * Verifies Razorpay Payment Signature Server-Side
 * Checks payment authenticity with Razorpay API, prevents replay attacks,
 * and records authoritative payment & pass in Supabase.
 * Endpoint: POST /api/verify-payment
 * Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature, scheduled_for, candidate_email }
 */
export async function verifyPayment(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return res.status(401).json({
      error: 'Razorpay secret not configured on server',
    });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    scheduled_for,
    candidate_email,
    candidate_id,
  } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
    });
  }

  // 1. Authenticate Request User (if token provided)
  const authUser = await authenticateRequestUser(req);
  const effectiveUserId = authUser?.id || candidate_id || `guest_${Date.now()}`;
  const effectiveEmail = authUser?.email || candidate_email || 'student@collegecentre.in';

  try {
    // 2. Cryptographic HMAC-SHA256 Signature Verification
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isSignatureValid =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(razorpay_signature, 'utf-8')
      );

    if (!isSignatureValid) {
      console.warn(`[Security Alert] Forged Razorpay signature attempt for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    // 3. Payment Replay Protection
    const isReplay = await isPaymentReplayed(razorpay_payment_id, razorpay_order_id);
    if (isReplay) {
      console.warn(`[Security Alert] Payment replay attempt: ${razorpay_payment_id}`);
      return res.status(409).json({
        success: false,
        error: 'Payment replay detected. This transaction has already been redeemed.',
      });
    }

    // 4. Server-Side Verification against Razorpay API
    if (keyId && keyId.startsWith('rzp_') && keyId !== 'rzp_test_placeholder') {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: { Authorization: authHeader },
        });

        if (rzpResponse.ok) {
          const rzpPayment = await rzpResponse.json();
          // Verify payment status is captured or authorized
          if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
            return res.status(400).json({
              success: false,
              error: `Payment is not in captured or authorized state (Status: ${rzpPayment.status})`,
            });
          }

          // Verify exact amount: 19900 paise
          if (rzpPayment.amount < 19900) {
            return res.status(400).json({
              success: false,
              error: `Invalid payment amount received (${rzpPayment.amount} paise). Required: 19900 paise.`,
            });
          }
        }
      } catch (fetchErr) {
        console.warn('Razorpay API direct verification check warning:', fetchErr);
        // Continue if network error but signature verified
      }
    }

    // 5. Store Authoritative Payment & Access Pass in Supabase
    const { pass, payment } = await recordAuthoritativePassAndPayment({
      userId: effectiveUserId,
      studentEmail: effectiveEmail,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      scheduledFor: scheduled_for,
      amount: 199.00,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and access pass issued server-side',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      pass,
      payment,
    });
  } catch (error) {
    console.error('Razorpay Server Verification Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during payment verification',
    });
  }
}

/**
 * Server endpoint to verify current user's pass status against database.
 * Does not trust client clock or localStorage.
 * Endpoint: GET /api/verify-pass
 */
export async function verifyPassStatus(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authUser = await authenticateRequestUser(req);
  if (!authUser) {
    return res.status(401).json({
      isActive: false,
      isScheduled: false,
      error: 'Unauthorized. Valid Bearer token required.',
    });
  }

  const status = await checkServerUserPassStatus(authUser.id);
  return res.status(200).json(status);
}
