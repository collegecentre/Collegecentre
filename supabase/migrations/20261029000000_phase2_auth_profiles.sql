-- ====================================================================
-- CollegeCentre 2.0 - Phase 2 Schema: Profiles, Usernames & Onboarding
-- ====================================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  college TEXT,
  course TEXT,
  graduation_year INTEGER,
  theme TEXT NOT NULL DEFAULT 'obsidian',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  -- Username constraints: lowercase alphanumeric, dashes, underscores, length 3-30
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9_-]{3,30}$'),
  CONSTRAINT username_lowercase CHECK (username = lower(username))
);

-- 2. Create basic_social_links table
CREATE TABLE IF NOT EXISTS public.basic_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'github', 'linkedin', 'x', 'website', 'instagram', 'youtube', 'email', 'other'
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.basic_social_links(profile_id);

-- 4. Reserved usernames table for preventing system URL collisions
CREATE TABLE IF NOT EXISTS public.reserved_usernames (
  username TEXT PRIMARY KEY
);

INSERT INTO public.reserved_usernames (username) VALUES
  ('admin'), ('api'), ('auth'), ('login'), ('signup'), ('logout'),
  ('dashboard'), ('onboarding'), ('explore'), ('settings'), ('terms'),
  ('privacy'), ('about'), ('help'), ('support'), ('collegecentre'),
  ('root'), ('null'), ('undefined'), ('design-system'), ('status'),
  ('profiles'), ('profile'), ('user'), ('users'), ('app'), ('reset-password'),
  ('forgot-password'), ('verify'), ('legal')
ON CONFLICT (username) DO NOTHING;

-- 5. Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basic_social_links ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Social links are viewable by everyone" ON public.basic_social_links;
DROP POLICY IF EXISTS "Users can insert their own social links" ON public.basic_social_links;
DROP POLICY IF EXISTS "Users can update their own social links" ON public.basic_social_links;
DROP POLICY IF EXISTS "Users can delete their own social links" ON public.basic_social_links;

-- Profiles:
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Basic Social Links:
CREATE POLICY "Social links are viewable by everyone"
  ON public.basic_social_links FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own social links"
  ON public.basic_social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own social links"
  ON public.basic_social_links FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own social links"
  ON public.basic_social_links FOR DELETE
  USING (auth.uid() = profile_id);

-- 6. Trigger for updated_at on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
