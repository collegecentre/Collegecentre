-- ====================================================================
-- CollegeCentre 2.0 - Phase 12 Schema: Privacy-Conscious Student Analytics
-- ====================================================================

-- 1. Create the analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  resource_id TEXT,
  resource_title TEXT,
  referrer_host TEXT,
  device_type TEXT DEFAULT 'desktop',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Add validation constraints on allowed event types and device types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_analytics_event_type'
  ) THEN
    ALTER TABLE public.analytics_events
      ADD CONSTRAINT check_analytics_event_type
      CHECK (event_type IN (
        'profile_view',
        'link_click',
        'project_view',
        'project_click',
        'resume_view',
        'resume_download',
        'share_event'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_analytics_device_type'
  ) THEN
    ALTER TABLE public.analytics_events
      ADD CONSTRAINT check_analytics_device_type
      CHECK (device_type IS NULL OR device_type IN ('desktop', 'mobile', 'tablet', 'other'));
  END IF;
END $$;

-- 3. High-performance composite indexes for real-time aggregation
CREATE INDEX IF NOT EXISTS idx_analytics_profile_created 
  ON public.analytics_events(profile_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_profile_event_created 
  ON public.analytics_events(profile_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_resource_id 
  ON public.analytics_events(resource_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies:
-- Any public visitor (anon or auth) can log an interaction event
DROP POLICY IF EXISTS "Allow public event logging" ON public.analytics_events;
CREATE POLICY "Allow public event logging"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Only profile owner can view their own analytics events
DROP POLICY IF EXISTS "Allow owners to view their analytics" ON public.analytics_events;
CREATE POLICY "Allow owners to view their analytics"
  ON public.analytics_events
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Explicitly disallow client-side updates or deletions to preserve audit integrity
DROP POLICY IF EXISTS "Disallow updates to analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Disallow deletes to analytics" ON public.analytics_events;
