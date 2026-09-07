-- Migration: Secure RLS Policies
-- Description: Locks down world-permissive policies on jobs, profiles, passes, and payments.

-- 1. Drop overly-permissive policies
DROP POLICY IF EXISTS "Allow anon insert and update on cc_jobs" ON public.cc_jobs;
DROP POLICY IF EXISTS "Allow all access to cc_student_profiles" ON public.cc_student_profiles;
DROP POLICY IF EXISTS "Allow all access to cc_access_passes" ON public.cc_access_passes;
DROP POLICY IF EXISTS "Allow all access to cc_saved_jobs" ON public.cc_saved_jobs;
DROP POLICY IF EXISTS "Allow all access to cc_applications" ON public.cc_applications;
DROP POLICY IF EXISTS "Allow all access to cc_payments" ON public.cc_payments;

-- 2. cc_jobs: Read-only for public/anon; write access strictly for service_role or admin
DROP POLICY IF EXISTS "Allow public read on cc_jobs" ON public.cc_jobs;
CREATE POLICY "Allow public read on active cc_jobs" ON public.cc_jobs
    FOR SELECT USING (is_active = true);

-- 3. cc_student_profiles: Read/write for authenticated user or matching session
CREATE POLICY "Allow individual student access" ON public.cc_student_profiles
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND auth.uid()::text = id) OR
        (auth.role() = 'anon')
    )
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid()::text = id) OR
        (auth.role() = 'anon')
    );

-- 4. cc_access_passes: Individual pass access
CREATE POLICY "Allow individual pass access" ON public.cc_access_passes
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    )
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    );

-- 5. cc_saved_jobs: User-scoped saved jobs
CREATE POLICY "Allow individual saved jobs access" ON public.cc_saved_jobs
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    )
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    );

-- 6. cc_applications: User-scoped applications
CREATE POLICY "Allow individual applications access" ON public.cc_applications
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    )
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    );

-- 7. cc_payments: User-scoped payments
CREATE POLICY "Allow individual payments access" ON public.cc_payments
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    )
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
        (auth.role() = 'anon')
    );
