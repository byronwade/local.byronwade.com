-- QUICK FIX: Stop the redirect loop immediately
-- Copy and paste this into Supabase Dashboard > SQL Editor

-- Create users table if missing
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync your auth user to public.users (FIXES THE LOOP)
INSERT INTO public.users (id, email, name, email_verified, role, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name', 
        split_part(email, '@', 1)
    ) as name,
    email_confirmed_at IS NOT NULL,
    'user',
    created_at,
    updated_at
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE public.users.id = auth.users.id)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- Add default user role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM public.users
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = public.users.id)
ON CONFLICT (user_id, role) DO NOTHING;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop any overly restrictive existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create proper RLS policies (less restrictive for authenticated users)
CREATE POLICY "Allow authenticated users to read all users" 
ON public.users FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Allow anon users to read users by ID" 
ON public.users FOR SELECT 
TO anon
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data" 
ON public.users FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own data" 
ON public.users FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Allow authenticated users to read all roles" 
ON public.user_roles FOR SELECT 
TO authenticated
USING (true);

-- Grant proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO authenticated, anon;
GRANT INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- Success message
SELECT 'REDIRECT LOOP FIXED! Try logging in now.' as message;