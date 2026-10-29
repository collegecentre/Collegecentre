-- ====================================================================
-- CollegeCentre 2.0 - Phase 13 Schema: Explore & Student Network Discovery
-- ====================================================================

-- 1. Add discoverability, location, and primary discipline category to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_discoverable BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'engineering';

-- 2. Validation constraint for category
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profile_category'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT check_profile_category
      CHECK (category IS NULL OR category IN ('engineering', 'research', 'design', 'product', 'writing', 'other'));
  END IF;
END $$;

-- 3. High-performance composite indexes for real-time search & filters
CREATE INDEX IF NOT EXISTS idx_profiles_explore 
  ON public.profiles(is_public, is_discoverable, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_college 
  ON public.profiles(college) 
  WHERE is_public = TRUE AND is_discoverable = TRUE;

CREATE INDEX IF NOT EXISTS idx_profiles_graduation_year 
  ON public.profiles(graduation_year) 
  WHERE is_public = TRUE AND is_discoverable = TRUE;

CREATE INDEX IF NOT EXISTS idx_profiles_category 
  ON public.profiles(category) 
  WHERE is_public = TRUE AND is_discoverable = TRUE;

CREATE INDEX IF NOT EXISTS idx_projects_explore 
  ON public.projects(is_enabled, is_featured, created_at DESC) 
  WHERE is_enabled = TRUE;

-- 4. RLS Explore Policies
-- Public visitors can browse discoverable profiles
DROP POLICY IF EXISTS "Public explore discoverable profiles" ON public.profiles;
CREATE POLICY "Public explore discoverable profiles"
  ON public.profiles
  FOR SELECT
  USING (
    (is_public = TRUE AND is_discoverable = TRUE) 
    OR (auth.uid() = id)
  );

-- Public visitors can browse enabled projects
DROP POLICY IF EXISTS "Public explore enabled projects" ON public.projects;
CREATE POLICY "Public explore enabled projects"
  ON public.projects
  FOR SELECT
  USING (is_enabled = TRUE);
