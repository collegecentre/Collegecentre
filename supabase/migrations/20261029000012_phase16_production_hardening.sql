-- ====================================================================
-- CollegeCentre 2.0 - Phase 16: Production Hardening, Security & Indexes
-- ====================================================================

-- 1. HARDEN ROW LEVEL SECURITY POLICIES (DATA PRIVACY ISOLATION)
-- Ensure public queries cannot inspect private student projects, honors, certificates, or links

-- Projects
DROP POLICY IF EXISTS "Public can view enabled projects" ON public.projects;
CREATE POLICY "Public can view enabled projects of public profiles"
  ON public.projects FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.projects.profile_id
      AND public.profiles.is_public = true
    )
  );

-- Achievements
DROP POLICY IF EXISTS "Public can view enabled achievements" ON public.achievements;
CREATE POLICY "Public can view enabled achievements of public profiles"
  ON public.achievements FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.achievements.profile_id
      AND public.profiles.is_public = true
    )
  );

-- Certificates
DROP POLICY IF EXISTS "Public can view enabled certificates" ON public.certificates;
CREATE POLICY "Public can view enabled certificates of public profiles"
  ON public.certificates FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.certificates.profile_id
      AND public.profiles.is_public = true
    )
  );

-- Student Links
DROP POLICY IF EXISTS "Public can view enabled links" ON public.student_links;
CREATE POLICY "Public can view enabled links of public profiles"
  ON public.student_links FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.student_links.profile_id
      AND public.profiles.is_public = true
    )
  );

-- Basic Social Links
DROP POLICY IF EXISTS "Public can view basic social links" ON public.basic_social_links;
CREATE POLICY "Public can view basic social links of public profiles"
  ON public.basic_social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = public.basic_social_links.profile_id
      AND public.profiles.is_public = true
    )
  );

-- 2. PERFORMANCE & COMPOSITE QUERY INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_discovery_composite 
  ON public.profiles(is_public, is_discoverable) 
  WHERE is_public = true AND is_discoverable = true;

CREATE INDEX IF NOT EXISTS idx_profiles_college_directory 
  ON public.profiles(college_id, show_in_college_directory) 
  WHERE show_in_college_directory = true;

CREATE INDEX IF NOT EXISTS idx_projects_profile_order 
  ON public.projects(profile_id, order_index) 
  WHERE is_enabled = true;

CREATE INDEX IF NOT EXISTS idx_achievements_profile_order 
  ON public.achievements(profile_id, order_index) 
  WHERE is_enabled = true;

CREATE INDEX IF NOT EXISTS idx_certificates_profile_order 
  ON public.certificates(profile_id, order_index) 
  WHERE is_enabled = true;

CREATE INDEX IF NOT EXISTS idx_analytics_profile_composite 
  ON public.analytics_events(profile_id, event_type, created_at);

-- 3. STORAGE BUCKET HARDENING & MIME RESTRICTIONS
-- Avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Projects
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Certificates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- Resumes
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

-- Storage folder ownership security policy for all upload buckets
DROP POLICY IF EXISTS "Users can only upload to their own user directory" ON storage.objects;
CREATE POLICY "Users can only upload to their own user directory"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.uid()::text = (storage.foldername(name))[1]
  );
