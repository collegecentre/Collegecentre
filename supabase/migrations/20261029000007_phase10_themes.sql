-- ====================================================================
-- CollegeCentre 2.0 - Phase 10 Schema: Themes & Appearance Customization
-- ====================================================================

-- 1. Add theme customization columns to profiles table if they don't exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme_accent TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS theme_layout TEXT DEFAULT 'centered',
  ADD COLUMN IF NOT EXISTS theme_button TEXT DEFAULT 'rounded',
  ADD COLUMN IF NOT EXISTS theme_background TEXT DEFAULT 'solid';

-- 2. Add validation constraints on allowed values (controlled customization > arbitrary values)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profile_theme_accent'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT check_profile_theme_accent
      CHECK (theme_accent IN ('default', 'emerald', 'blue', 'violet', 'amber', 'rose'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profile_theme_layout'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT check_profile_theme_layout
      CHECK (theme_layout IN ('centered', 'compact', 'editorial'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profile_theme_button'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT check_profile_theme_button
      CHECK (theme_button IN ('rounded', 'pill', 'sharp'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_profile_theme_background'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT check_profile_theme_background
      CHECK (theme_background IN ('solid', 'gradient', 'dots', 'grid'));
  END IF;
END $$;

-- 3. Create index on theme for performance analytics & lookups
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);
