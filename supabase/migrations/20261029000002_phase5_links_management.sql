-- ====================================================================
-- CollegeCentre 2.0 - Phase 5 Schema: Link Management & Tracking
-- ====================================================================

-- 1. Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  thumbnail_url TEXT,
  category TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  clicks_count INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_order_index ON public.links(order_index);

-- 3. Prepare future click tracking table
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON public.link_clicks(clicked_at);

-- 4. Row Level Security for links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view enabled links" ON public.links;
DROP POLICY IF EXISTS "Users can view all their own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;

-- Public can view enabled links
CREATE POLICY "Public can view enabled links"
  ON public.links FOR SELECT
  USING (is_enabled = true);

-- Owners can view all their links (including disabled drafts)
CREATE POLICY "Users can view all their own links"
  ON public.links FOR SELECT
  USING (auth.uid() = profile_id);

-- Owners can insert their own links
CREATE POLICY "Users can insert their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Owners can update their own links
CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = profile_id);

-- Owners can delete their own links
CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = profile_id);

-- 5. Atomic click increment stored procedure
CREATE OR REPLACE FUNCTION public.increment_link_click(target_link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.links
  SET clicks_count = clicks_count + 1,
      last_clicked_at = timezone('utc'::text, now())
  WHERE id = target_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
