-- ====================================================================
-- CollegeCentre 2.0 - Phase 8 Schema: Verified Student Certificates
-- ====================================================================

-- 1. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiration_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  pdf_url TEXT,
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_certificates_profile_id ON public.certificates(profile_id);
CREATE INDEX IF NOT EXISTS idx_certificates_order_index ON public.certificates(order_index);
CREATE INDEX IF NOT EXISTS idx_certificates_is_featured ON public.certificates(is_featured);
CREATE INDEX IF NOT EXISTS idx_certificates_issuer ON public.certificates(issuer);

-- 3. Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view enabled certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can view all their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can insert their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.certificates;

-- Public can view enabled certificates
CREATE POLICY "Public can view enabled certificates"
  ON public.certificates FOR SELECT
  USING (is_enabled = true);

-- Owners can view all their own certificates
CREATE POLICY "Users can view all their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = profile_id);

-- Owners can insert their own certificates
CREATE POLICY "Users can insert their own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Owners can update their own certificates
CREATE POLICY "Users can update their own certificates"
  ON public.certificates FOR UPDATE
  USING (auth.uid() = profile_id);

-- Owners can delete their own certificates
CREATE POLICY "Users can delete their own certificates"
  ON public.certificates FOR DELETE
  USING (auth.uid() = profile_id);
