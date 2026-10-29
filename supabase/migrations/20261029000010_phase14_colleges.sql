-- ====================================================================
-- CollegeCentre 2.0 - Phase 14 Schema: College Profiles & Campus Directories
-- ====================================================================

-- 1. Create colleges table
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  location TEXT,
  website TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create college_members association table with RBAC roles
CREATE TABLE IF NOT EXISTS public.college_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('owner', 'admin', 'moderator', 'student')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'pending', 'declined')),
  show_in_directory BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_college_member UNIQUE (college_id, profile_id)
);

-- 3. Extend profiles with college foreign key and student privacy controls
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS show_college_on_profile BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_in_college_directory BOOLEAN NOT NULL DEFAULT TRUE;

-- 4. High-performance composite indexes
CREATE INDEX IF NOT EXISTS idx_colleges_slug 
  ON public.colleges(slug);

CREATE INDEX IF NOT EXISTS idx_colleges_verification 
  ON public.colleges(verification_status);

CREATE INDEX IF NOT EXISTS idx_college_members_college 
  ON public.college_members(college_id, status);

CREATE INDEX IF NOT EXISTS idx_college_members_profile 
  ON public.college_members(profile_id);

CREATE INDEX IF NOT EXISTS idx_profiles_college_id 
  ON public.profiles(college_id) 
  WHERE college_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_college_privacy 
  ON public.profiles(college_id, is_public, is_discoverable, show_in_college_directory) 
  WHERE college_id IS NOT NULL;

-- 5. Row Level Security Policies
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_members ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an admin or owner of a college
CREATE OR REPLACE FUNCTION public.is_college_admin(check_user_id UUID, check_college_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.college_members
    WHERE profile_id = check_user_id
      AND college_id = check_college_id
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Colleges RLS:
-- Anyone can view colleges
DROP POLICY IF EXISTS "Public read colleges" ON public.colleges;
CREATE POLICY "Public read colleges"
  ON public.colleges
  FOR SELECT
  USING (true);

-- Authenticated users can create new campus communities (unverified by default)
DROP POLICY IF EXISTS "Authenticated users can create college" ON public.colleges;
CREATE POLICY "Authenticated users can create college"
  ON public.colleges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only verified college admins/owners can update college details
DROP POLICY IF EXISTS "College admins can update their college" ON public.colleges;
CREATE POLICY "College admins can update their college"
  ON public.colleges
  FOR UPDATE
  TO authenticated
  USING (public.is_college_admin(auth.uid(), id));

-- College Members RLS:
-- Public can view members who allow directory listing
DROP POLICY IF EXISTS "Public read college members in directory" ON public.college_members;
CREATE POLICY "Public read college members in directory"
  ON public.college_members
  FOR SELECT
  USING (
    (show_in_directory = true AND status = 'active')
    OR (auth.uid() = profile_id)
    OR public.is_college_admin(auth.uid(), college_id)
  );

-- Students can join a college
DROP POLICY IF EXISTS "Students can create own college membership" ON public.college_members;
CREATE POLICY "Students can create own college membership"
  ON public.college_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

-- Students can update their own membership privacy (show_in_directory)
DROP POLICY IF EXISTS "Students can update own membership privacy" ON public.college_members;
CREATE POLICY "Students can update own membership privacy"
  ON public.college_members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

-- College Admins can update member roles
DROP POLICY IF EXISTS "College admins can manage members" ON public.college_members;
CREATE POLICY "College admins can manage members"
  ON public.college_members
  FOR UPDATE
  TO authenticated
  USING (public.is_college_admin(auth.uid(), college_id));

-- SECURITY ENFORCEMENT:
-- College admins CANNOT edit student personal profiles.
-- The existing profiles RLS policy strictly restricts profile updates to `auth.uid() = id`.
