-- ==============================================================================
-- Migration: Production Security Lockdown & RLS Enforcement
-- Date: 2026-09-11
-- Description:
--   1. Restricts cc_payments and cc_access_passes writes STRICTLY to service_role (server-only).
--   2. Enforces auth.uid() ownership on all student records (profiles, saved jobs, applications).
--   3. Eliminates all anon-write vulnerabilities.
-- ==============================================================================

-- 1. DROP ALL EXISTING PERMISSIVE / INSECURE POLICIES
DROP POLICY IF EXISTS "Allow all access to cc_jobs" ON public.cc_jobs;
DROP POLICY IF EXISTS "Allow anon insert and update on cc_jobs" ON public.cc_jobs;
DROP POLICY IF EXISTS "Allow public read on cc_jobs" ON public.cc_jobs;
DROP POLICY IF EXISTS "Allow public read on active cc_jobs" ON public.cc_jobs;

DROP POLICY IF EXISTS "Allow all access to cc_student_profiles" ON public.cc_student_profiles;
DROP POLICY IF EXISTS "Allow individual student access" ON public.cc_student_profiles;

DROP POLICY IF EXISTS "Allow all access to cc_access_passes" ON public.cc_access_passes;
DROP POLICY IF EXISTS "Allow individual pass access" ON public.cc_access_passes;

DROP POLICY IF EXISTS "Allow all access to cc_saved_jobs" ON public.cc_saved_jobs;
DROP POLICY IF EXISTS "Allow individual saved jobs access" ON public.cc_saved_jobs;

DROP POLICY IF EXISTS "Allow all access to cc_applications" ON public.cc_applications;
DROP POLICY IF EXISTS "Allow individual applications access" ON public.cc_applications;

DROP POLICY IF EXISTS "Allow all access to cc_payments" ON public.cc_payments;
DROP POLICY IF EXISTS "Allow individual payments access" ON public.cc_payments;

-- ENSURE RLS IS ACTIVATED ON ALL TABLES
ALTER TABLE public.cc_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_access_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_payments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. cc_jobs POLICIES
-- Read-only for public active jobs; modifications strictly restricted to service_role
-- ==============================================================================
CREATE POLICY "cc_jobs_public_read_active" ON public.cc_jobs
    FOR SELECT USING (is_active = true);

CREATE POLICY "cc_jobs_service_role_all" ON public.cc_jobs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 3. cc_student_profiles POLICIES
-- Authenticated users can only read and modify their own profile based on auth.uid()
-- ==============================================================================
CREATE POLICY "cc_student_profiles_read_own" ON public.cc_student_profiles
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = id
    );

CREATE POLICY "cc_student_profiles_insert_own" ON public.cc_student_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = id
    );

CREATE POLICY "cc_student_profiles_update_own" ON public.cc_student_profiles
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = id
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = id
    );

CREATE POLICY "cc_student_profiles_service_role_all" ON public.cc_student_profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 4. cc_access_passes POLICIES
-- Read-only for owner (auth.uid()); writes STRICTLY RESTRICTED to service_role.
-- Users CANNOT insert passes or modify expires_at!
-- ==============================================================================
CREATE POLICY "cc_access_passes_read_own" ON public.cc_access_passes
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_access_passes_service_role_all" ON public.cc_access_passes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 5. cc_payments POLICIES
-- Read-only for owner (auth.uid()); writes STRICTLY RESTRICTED to service_role.
-- Users CANNOT insert forged transaction receipts!
-- ==============================================================================
CREATE POLICY "cc_payments_read_own" ON public.cc_payments
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_payments_service_role_all" ON public.cc_payments
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 6. cc_saved_jobs POLICIES
-- Authenticated users can only manage their own saved jobs.
-- ==============================================================================
CREATE POLICY "cc_saved_jobs_read_own" ON public.cc_saved_jobs
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_saved_jobs_insert_own" ON public.cc_saved_jobs
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_saved_jobs_delete_own" ON public.cc_saved_jobs
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_saved_jobs_service_role_all" ON public.cc_saved_jobs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 7. cc_applications POLICIES
-- Authenticated users can only manage their own application tracker entries.
-- ==============================================================================
CREATE POLICY "cc_applications_read_own" ON public.cc_applications
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_applications_insert_own" ON public.cc_applications
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_applications_update_own" ON public.cc_applications
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_applications_delete_own" ON public.cc_applications
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = user_id
    );

CREATE POLICY "cc_applications_service_role_all" ON public.cc_applications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
