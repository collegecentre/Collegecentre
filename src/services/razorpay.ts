export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image?: string
  order_id?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  handler?: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayOrderResponse {
  order_id: string
  amount: number
  currency: string
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  scheduled_for?: string
  candidate_email?: string
  candidate_id?: string
}

export interface RazorpayVerifyResponse {
  success: boolean
  message: string
  order_id?: string
  payment_id?: string
  pass?: any
  payment?: any
  error?: string
}

export interface CheckoutParams {
  amountInPaise: number // e.g. 19900 for ₹199
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  authToken?: string
  scheduledFor?: string
  candidateEmail?: string
  candidateId?: string
  onSuccess: (response: { paymentId: string; orderId: string; signature: string; serverPass?: any }) => void
  onError: (error: string) => void
  onDismiss?: () => void
}

/**
 * Ensures checkout.js is loaded into the browser window.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Calls backend POST /api/create-order to create an authentic Razorpay Order
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  notes?: Record<string, string>
): Promise<RazorpayOrderResponse> {
  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      notes: notes || {},
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create payment order on server')
  }
  return data
}

/**
 * Calls backend POST /api/verify-payment to verify the cryptographic HMAC-SHA256 signature
 */
export async function verifyRazorpayPayment(
  payload: RazorpayVerifyPayload,
  authToken?: string
): Promise<RazorpayVerifyResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed')
  }
  return data
}

/**
 * Complete Standard Razorpay Web Checkout workflow
 * 1. Loads SDK
 * 2. Creates order on server
 * 3. Opens Razorpay modal with order_id
 * 4. Verifies HMAC-SHA256 signature on server
 * 5. Calls onSuccess callback with authoritative server pass
 */
export async function openRazorpayCheckout(params: CheckoutParams): Promise<void> {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  if (!keyId) {
    throw new Error('Razorpay Key ID is not configured in environment variables (VITE_RAZORPAY_KEY_ID)')
  }

  const isLoaded = await loadRazorpayScript()
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error('Failed to load Razorpay Checkout SDK. Please check your internet connection.')
  }

  // Step 1: Create Order on backend
  const order = await createRazorpayOrder(params.amountInPaise, params.notes)

  // Step 2: Open Razorpay modal with order_id
  const options: RazorpayOptions = {
    key: keyId,
    amount: order.amount,
    currency: order.currency,
    name: 'CollegeCentre',
    description: '₹199 / 24-Hour Job Hunt Pass',
    order_id: order.order_id,
    prefill: {
      name: params.prefill?.name || 'Student Candidate',
      email: params.prefill?.email || 'student@collegecentre.in',
      contact: params.prefill?.contact || '',
    },
    theme: {
      color: '#fe7141',
    },
    handler: async function (response: any) {
      try {
        // Step 3: Verify signature and issue pass on backend
        const verifyRes = await verifyRazorpayPayment(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            scheduled_for: params.scheduledFor,
            candidate_email: params.candidateEmail || params.prefill?.email,
            candidate_id: params.candidateId,
          },
          params.authToken
        )

        params.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          serverPass: verifyRes.pass,
        })
      } catch (verifyErr: any) {
        console.error('Signature verification error:', verifyErr)
        params.onError(verifyErr?.message || 'Payment signature verification failed. Please contact support.')
      }
    },
    modal: {
      ondismiss: function () {
        params.onDismiss?.()
      },
    },
  }

  const rzp = new (window as any).Razorpay(options)

  // Handle payment.failed event
  rzp.on('payment.failed', function (failureResponse: any) {
    console.error('Razorpay Payment Failed:', failureResponse)
    const errMessage =
      failureResponse.error?.description ||
      failureResponse.error?.reason ||
      'Payment transaction was not completed'
    params.onError(errMessage)
  })

  rzp.open()
}
