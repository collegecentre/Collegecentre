import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
// In production, SUPABASE_SERVICE_ROLE_KEY is required to bypass RLS for server operations.
// Falls back to anon key if service role is not yet provided in local dev.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

export const supabaseAdmin = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

async function withDbTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase network timeout')), ms)
    ),
  ]);
}

/**
 * Extracts and verifies the Supabase Auth user from the request Authorization header.
 * Header format: "Bearer <access_token>"
 */
export async function authenticateRequestUser(req) {
  if (!supabaseAdmin) return null;

  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1]?.trim();
  if (!token) return null;

  try {
    const { data, error } = await withDbTimeout(supabaseAdmin.auth.getUser(token));
    if (error || !data?.user) {
      return null;
    }
    return data.user;
  } catch (err) {
    console.warn('Error validating auth token:', err.message);
    return null;
  }
}

/**
 * In-memory replay cache to prevent duplicate rapid submissions
 * even before database write finishes.
 */
const processedPaymentsCache = new Set();

/**
 * Verifies if payment has already been redeemed (Payment Replay Protection).
 */
export async function isPaymentReplayed(paymentId, orderId) {
  if (processedPaymentsCache.has(paymentId) || processedPaymentsCache.has(orderId)) {
    return true;
  }

  if (!supabaseAdmin) return false;

  try {
    const { data: existingPayment } = await withDbTimeout(
      supabaseAdmin
        .from('cc_payments')
        .select('id, transaction_id')
        .or(`transaction_id.eq.${paymentId},id.eq.${orderId}`)
        .limit(1)
        .maybeSingle()
    );

    if (existingPayment) {
      processedPaymentsCache.add(paymentId);
      processedPaymentsCache.add(orderId);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Replay check DB warning:', err.message);
    return false;
  }
}

/**
 * Server-side authoritative entitlement creation.
 * Writes to cc_payments and cc_access_passes in Supabase.
 */
export async function recordAuthoritativePassAndPayment({
  userId,
  studentEmail,
  orderId,
  paymentId,
  scheduledFor,
  amount = 199.00,
}) {
  const now = new Date();
  let startedAt = now;
  let status = 'active';

  // Validate scheduledFor if provided
  if (scheduledFor) {
    const scheduledDate = new Date(scheduledFor);
    const minScheduleTime = new Date(now.getTime() + 5 * 60 * 1000); // at least 5 mins in future
    const maxScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // within 7 days

    if (scheduledDate > minScheduleTime && scheduledDate < maxScheduleTime) {
      startedAt = scheduledDate;
      status = 'scheduled';
    }
  }

  const expiresAt = new Date(startedAt.getTime() + 24 * 60 * 60 * 1000);

  const paymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    amount,
    currency: 'INR',
    payment_method: 'UPI/Razorpay',
    status: 'COMPLETED',
    transaction_id: paymentId,
    created_at: now.toISOString(),
  };

  const passRecord = {
    id: `pass_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    student_email: studentEmail || 'student@collegecentre.in',
    started_at: startedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    amount,
    status,
    payment_method: 'UPI/Razorpay',
    transaction_id: paymentId,
    created_at: now.toISOString(),
  };

  // Add to in-memory cache
  processedPaymentsCache.add(paymentId);
  processedPaymentsCache.add(orderId);

  if (supabaseAdmin) {
    try {
      // 1. Record payment in cc_payments with timeout
      await withDbTimeout(supabaseAdmin.from('cc_payments').insert(paymentRecord), 2500)
    } catch (err) {
      console.warn('Supabase cc_payments insert notice:', err?.message)
    }

    try {
      // 2. Record pass in cc_access_passes with timeout
      await withDbTimeout(supabaseAdmin.from('cc_access_passes').insert(passRecord), 2500)
    } catch (err) {
      console.warn('Supabase cc_access_passes insert notice:', err?.message)
    }
  }

  return {
    payment: paymentRecord,
    pass: {
      id: passRecord.id,
      user_id: passRecord.user_id,
      started_at: passRecord.started_at,
      expires_at: passRecord.expires_at,
      status: passRecord.status,
      scheduled_for: status === 'scheduled' ? passRecord.started_at : undefined,
    },
  };
}

/**
 * Checks whether a given user has an active pass according to the server/database.
 * Does NOT trust client clock.
 */
export async function checkServerUserPassStatus(userId) {
  if (!userId || !supabaseAdmin) return { isActive: false, isScheduled: false };

  try {
    // 1. Check for active pass: status = 'active' AND started_at <= NOW() AND expires_at > NOW()
    const { data: activePasses } = await supabaseAdmin
      .from('cc_access_passes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!activePasses || activePasses.length === 0) {
      return { isActive: false, isScheduled: false };
    }

    const nowTime = Date.now();

    for (const pass of activePasses) {
      const startTime = new Date(pass.started_at).getTime();
      const expireTime = new Date(pass.expires_at).getTime();

      // If scheduled time has arrived, it should auto-activate
      if (startTime <= nowTime && expireTime > nowTime) {
        return {
          isActive: true,
          isScheduled: false,
          pass,
          remainingSeconds: Math.floor((expireTime - nowTime) / 1000),
        };
      }

      if (startTime > nowTime && expireTime > nowTime) {
        return {
          isActive: false,
          isScheduled: true,
          scheduledStartTime: pass.started_at,
          pass,
        };
      }
    }

    return { isActive: false, isScheduled: false, isExpired: true };
  } catch (err) {
    console.error('Server pass check error:', err);
    return { isActive: false, isScheduled: false };
  }
}
