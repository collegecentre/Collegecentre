-- Migration: Remove payments and access passes
-- CollegeCentre is now 100% free with zero paywalls and zero payment processing.

DROP TABLE IF EXISTS public.cc_payments CASCADE;
DROP TABLE IF EXISTS public.cc_access_passes CASCADE;
