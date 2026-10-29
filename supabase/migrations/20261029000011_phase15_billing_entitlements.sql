-- ====================================================================
-- CollegeCentre 2.0 - Phase 15 Schema: Plans, Subscriptions & Entitlements
-- ====================================================================

-- 1. Create plans table (Configurable pricing & feature tiers)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL CHECK (slug IN ('free', 'pro')),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  price_yearly INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  limits JSONB NOT NULL DEFAULT '{"max_projects": 5, "max_achievements": 5, "max_certificates": 5, "analytics_days": 7}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  plan_slug TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  billing_interval TEXT NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create entitlements table for granular capability authorization
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_profile_entitlement UNIQUE (profile_id, feature_key)
);

-- 4. Create billing events audit log
CREATE TABLE IF NOT EXISTS public.billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Extend profiles table with custom domain and branding toggle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS remove_branding BOOLEAN NOT NULL DEFAULT FALSE;

-- 6. Indexes for real-time entitlement resolution
CREATE INDEX IF NOT EXISTS idx_plans_slug ON public.plans(slug);
CREATE INDEX IF NOT EXISTS idx_subscriptions_profile ON public.subscriptions(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_profile ON public.entitlements(profile_id, feature_key);
CREATE INDEX IF NOT EXISTS idx_billing_events_profile ON public.billing_events(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON public.profiles(custom_domain) WHERE custom_domain IS NOT NULL;

-- 7. Seed standard configurable plans
INSERT INTO public.plans (slug, name, description, price_monthly, price_yearly, currency, features, limits)
VALUES
  (
    'free',
    'Free Builder',
    'Essential portfolio capabilities for every ambitious student. Free forever.',
    0,
    0,
    'INR',
    '["Public student showcase", "Configurable links & social icons", "Up to 5 engineering projects", "Up to 5 verified honors", "Certificates & PDF resume", "Standard themes (Minimal, Developer, Academic)", "QR code sharing", "7-day analytics overview"]'::jsonb,
    '{"max_projects": 5, "max_achievements": 5, "max_certificates": 5, "analytics_days": 7}'::jsonb
  ),
  (
    'pro',
    'CollegeCentre Pro',
    'Custom domain, advanced analytics, custom colors, and priority builder presence.',
    299,
    2499,
    'INR',
    '["Connect your personal custom domain (yourname.dev)", "Advanced curated themes (Creative, Cobalt, Obsidian, Terminal)", "Custom theme accents, layouts, and button aesthetics", "Full 90-day & all-time traffic analytics with referrers", "Remove CollegeCentre footer watermark", "Unlimited projects, honors & certificates", "Verified Pro badge on showcase & campus directory"]'::jsonb,
    '{"max_projects": 9999, "max_achievements": 9999, "max_certificates": 9999, "analytics_days": 90}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- 8. Row Level Security Policies
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- Server-side helper to verify if an account is Pro
CREATE OR REPLACE FUNCTION public.is_pro_user(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE profile_id = check_user_id
      AND plan_slug = 'pro'
      AND status IN ('active', 'trialing')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Plans: Public read
DROP POLICY IF EXISTS "Public read plans" ON public.plans;
CREATE POLICY "Public read plans" ON public.plans
  FOR SELECT USING (is_active = TRUE);

-- Subscriptions: User read own
DROP POLICY IF EXISTS "User read own subscription" ON public.subscriptions;
CREATE POLICY "User read own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = profile_id);

-- Entitlements: User read own
DROP POLICY IF EXISTS "User read own entitlements" ON public.entitlements;
CREATE POLICY "User read own entitlements" ON public.entitlements
  FOR SELECT USING (auth.uid() = profile_id);

-- Billing Events: User read own
DROP POLICY IF EXISTS "User read own billing events" ON public.billing_events;
CREATE POLICY "User read own billing events" ON public.billing_events
  FOR SELECT USING (auth.uid() = profile_id);
