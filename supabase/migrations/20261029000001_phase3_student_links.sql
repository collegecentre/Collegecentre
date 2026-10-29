-- ====================================================================
-- CollegeCentre 2.0 - Phase 3 Schema: Profile Privacy & Student Links
-- ====================================================================

-- 1. Add is_public column to profiles table if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Create student_links table for student configured showcase links
CREATE TABLE IF NOT EXISTS public.student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Index for performance
CREATE INDEX IF NOT EXISTS idx_student_links_profile_id ON public.student_links(profile_id);

-- 4. Row Level Security (RLS)
ALTER TABLE public.student_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public student links are viewable by everyone" ON public.student_links;
CREATE POLICY "Public student links are viewable by everyone"
  ON public.student_links FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own student links" ON public.student_links;
CREATE POLICY "Users can insert their own student links"
  ON public.student_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update their own student links" ON public.student_links;
CREATE POLICY "Users can update their own student links"
  ON public.student_links FOR UPDATE
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete their own student links" ON public.student_links;
CREATE POLICY "Users can delete their own student links"
  ON public.student_links FOR DELETE
  USING (auth.uid() = profile_id);
