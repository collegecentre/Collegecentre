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


