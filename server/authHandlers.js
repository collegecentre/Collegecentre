import { supabaseAdmin } from './supabaseAdmin.js';

export async function handleRegisterUser(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, password } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database service unavailable' });
  }

  try {
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const cleanPhone = String(phone || '').trim();

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        phone: cleanPhone,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
        return res.status(400).json({ error: 'This email is already registered. Please sign in instead.' });
      }
      return res.status(400).json({ error: error.message });
    }

    try {
      await supabaseAdmin.from('cc_student_profiles').upsert(
        {
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          education_level: 'Undergraduate',
          degree: '',
          college: '',
          graduation_year: 2026,
          skills: [],
          experience_level: 'Fresher',
          preferred_categories: ['Software Development', 'Data & AI'],
          preferred_locations: ['Bengaluru', 'Remote'],
          preferred_work_mode: ['Remote', 'Hybrid'],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
    } catch (profileErr) {
      console.warn('Could not pre-create cloud profile:', profileErr.message);
    }

    return res.status(200).json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: cleanName,
        phone: cleanPhone,
      },
    });
  } catch (err) {
    console.error('Registration server error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

export async function handleLoginUser(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ error: 'Database service configuration missing' });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await client.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    console.error('Login server error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}

