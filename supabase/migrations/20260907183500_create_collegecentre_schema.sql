-- 1. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.cc_jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL,
    salary TEXT NOT NULL,
    experience TEXT NOT NULL,
    education TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL,
    job_type TEXT NOT NULL DEFAULT 'Full-time',
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TEXT,
    description TEXT,
    fresher_eligibility BOOLEAN DEFAULT TRUE,
    application_url TEXT NOT NULL,
    source TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.cc_student_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    education_level TEXT,
    degree TEXT,
    college TEXT,
    graduation_year INTEGER,
    skills TEXT[] DEFAULT '{}',
    experience_level TEXT,
    preferred_categories TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    preferred_work_mode TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACCESS PASSES TABLE (₹199 / 24-HOUR SPRINT)
CREATE TABLE IF NOT EXISTS public.cc_access_passes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    student_email TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    amount NUMERIC(10,2) DEFAULT 199.00,
    status TEXT NOT NULL DEFAULT 'active',
    payment_method TEXT DEFAULT 'UPI',
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAVED JOBS TABLE (RULE 11 PERMANENT GUARANTEE)
CREATE TABLE IF NOT EXISTS public.cc_saved_jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_id TEXT NOT NULL REFERENCES public.cc_jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- 5. APPLICATIONS TRACKER TABLE (APPLIED -> SHORTLISTED -> SELECTED)
CREATE TABLE IF NOT EXISTS public.cc_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_id TEXT NOT NULL REFERENCES public.cc_jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Applied',
    notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- 6. PAYMENTS & TRANSACTION RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS public.cc_payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 199.00,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    transaction_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.cc_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_access_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cc_payments ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE RLS POLICIES FOR ANON & AUTH ACCESS
CREATE POLICY "Allow public read on cc_jobs" ON public.cc_jobs FOR SELECT USING (true);
CREATE POLICY "Allow anon insert and update on cc_jobs" ON public.cc_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cc_student_profiles" ON public.cc_student_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cc_access_passes" ON public.cc_access_passes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cc_saved_jobs" ON public.cc_saved_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cc_applications" ON public.cc_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cc_payments" ON public.cc_payments FOR ALL USING (true) WITH CHECK (true);
