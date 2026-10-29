-- ====================================================================
-- CollegeCentre 2.0 - Phase 9 Schema: Student Resume & Professional Documents
-- ====================================================================

-- 1. Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_resumes_profile UNIQUE (profile_id)
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_resumes_profile_id ON public.resumes(profile_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_visible ON public.resumes(is_visible);

-- 3. Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible resumes of public profiles" ON public.resumes;
DROP POLICY IF EXISTS "Users can view their own resume" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert their own resume" ON public.resumes;
DROP POLICY IF EXISTS "Users can update their own resume" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete their own resume" ON public.resumes;

-- Public can view visible resumes of public profiles
CREATE POLICY "Public can view visible resumes of public profiles"
  ON public.resumes FOR SELECT
  USING (
    is_visible = true 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = public.resumes.profile_id 
      AND public.profiles.is_public = true
    )
  );

-- Owners can view their own resume even if hidden or profile is private
CREATE POLICY "Users can view their own resume"
  ON public.resumes FOR SELECT
  USING (auth.uid() = profile_id);

-- Owners can insert/upload their own resume
CREATE POLICY "Users can insert their own resume"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Owners can update their own resume
CREATE POLICY "Users can update their own resume"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = profile_id);

-- Owners can delete their own resume
CREATE POLICY "Users can delete their own resume"
  ON public.resumes FOR DELETE
  USING (auth.uid() = profile_id);

-- 4. Supabase Storage: 'resumes' bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes', 
  'resumes', 
  true, 
  10485760, -- 10MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- Storage bucket RLS policies
DROP POLICY IF EXISTS "Users can upload their own resume file" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resume file" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resume file" ON storage.objects;
DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;

CREATE POLICY "Users can upload their own resume file"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own resume file"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own resume file"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');
