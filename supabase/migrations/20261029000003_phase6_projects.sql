-- ====================================================================
-- CollegeCentre 2.0 - Phase 6 Schema: Verified Student Projects
-- ====================================================================

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  start_date TEXT,
  end_date TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_order_index ON public.projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);

-- 3. Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view enabled projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view all their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Public can view enabled projects
CREATE POLICY "Public can view enabled projects"
  ON public.projects FOR SELECT
  USING (is_enabled = true);

-- Owners can view all their projects
CREATE POLICY "Users can view all their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = profile_id);

-- Owners can insert their own projects
CREATE POLICY "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Owners can update their own projects
CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = profile_id);

-- Owners can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = profile_id);
