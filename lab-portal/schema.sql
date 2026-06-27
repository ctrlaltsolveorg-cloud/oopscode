-- ====================================================================
-- SUPABASE SCHEMA FOR C-LAB PORTAL
-- 
-- Copy and execute this script inside the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/boqbligtmjlsrawpffjh/sql
-- ====================================================================

-- 1. Create labs table
CREATE TABLE IF NOT EXISTS public.labs (
    "labNum" integer PRIMARY KEY,
    tutorial text NOT NULL,
    title text NOT NULL,
    problems jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create theory table
CREATE TABLE IF NOT EXISTS public.theory (
    "labNum" integer PRIMARY KEY,
    concept text NOT NULL,
    summary text NOT NULL,
    "keyPoints" jsonb NOT NULL DEFAULT '[]'::jsonb,
    explanation text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    "labNum" integer PRIMARY KEY,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables to lock them down
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to ensure clean slate)
DROP POLICY IF EXISTS "Allow public read access" ON public.labs;
DROP POLICY IF EXISTS "Allow admin write access" ON public.labs;
DROP POLICY IF EXISTS "Allow public read access" ON public.theory;
DROP POLICY IF EXISTS "Allow admin write access" ON public.theory;
DROP POLICY IF EXISTS "Allow public read access" ON public.quizzes;
DROP POLICY IF EXISTS "Allow admin write access" ON public.quizzes;

-- 6. Create Read Policies: Allow anyone (even unauthenticated users) to select/read the data
CREATE POLICY "Allow public read access" ON public.labs
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.theory
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.quizzes
    FOR SELECT USING (true);

-- 7. Create Write Policies: Allow only authenticated users to insert, update, or delete data
CREATE POLICY "Allow admin write access" ON public.labs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write access" ON public.theory
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin write access" ON public.quizzes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
