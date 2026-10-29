-- ====================================================================
-- CollegeCentre 2.0 - Phase 7 Schema: Verified Student Achievements
-- ====================================================================

-- 1. Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  organization TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other',
  date TEXT NOT NULL,
  image_url TEXT,
  verification_url TEXT,
  credential_id TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_achievements_profile_id ON public.achievements(profile_id);
CREATE INDEX IF NOT EXISTS idx_achievements_order_index ON public.achievements(order_index);
CREATE INDEX IF NOT EXISTS idx_achievements_is_featured ON public.achievements(is_featured);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.achievements(type);

-- 3. Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view enabled achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view all their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can delete their own achievements" ON public.achievements;

-- Public can view enabled achievements
CREATE POLICY "Public can view enabled achievements"
  ON public.achievements FOR SELECT
  USING (is_enabled = true);

-- Owners can view all their achievements
CREATE POLICY "Users can view all their own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = profile_id);

-- Owners can insert their own achievements
CREATE POLICY "Users can insert their own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Owners can update their own achievements
CREATE POLICY "Users can update their own achievements"
  ON public.achievements FOR UPDATE
  USING (auth.uid() = profile_id);

-- Owners can delete their own achievements
CREATE POLICY "Users can delete their own achievements"
  ON public.achievements FOR DELETE
  USING (auth.uid() = profile_id);
