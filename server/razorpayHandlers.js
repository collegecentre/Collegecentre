import Razorpay from 'razorpay';
import crypto from 'node:crypto';

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

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amountNum),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: notes || {},
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
 * Verifies Razorpay Payment Signature
 * Endpoint: POST /api/verify-payment
 * Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export async function verifyPayment(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(401).json({
      error: 'Razorpay secret not configured on server',
    });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
    });
  }

  try {
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isMatch =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(razorpay_signature, 'utf-8')
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during payment verification',
    });
  }
}
