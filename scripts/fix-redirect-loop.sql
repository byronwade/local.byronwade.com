-- EMERGENCY FIX: Resolve Authentication Redirect Loop
-- Run this IMMEDIATELY in your Supabase SQL Editor

-- ============================================================================
-- 1. IMMEDIATE FIX: Sync existing auth users to public.users
-- ============================================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. SYNC EXISTING AUTH USERS TO PUBLIC.USERS (FIXES THE LOOP)
-- ============================================================================

-- Insert missing users from auth.users to public.users
INSERT INTO public.users (
    id,
    email,
    name,
    avatar_url,
    email_verified,
    phone_verified,
    phone,
    created_at,
    updated_at
)
SELECT 
    auth_users.id,
    auth_users.email,
    COALESCE(
        auth_users.raw_user_meta_data->>'full_name',
        auth_users.raw_user_meta_data->>'name',
        split_part(auth_users.email, '@', 1)
    ) as name,
    auth_users.raw_user_meta_data->>'avatar_url',
    auth_users.email_confirmed_at IS NOT NULL,
    auth_users.phone_confirmed_at IS NOT NULL,
    auth_users.phone,
    auth_users.created_at,
    auth_users.updated_at
FROM auth.users auth_users
WHERE NOT EXISTS (
    SELECT 1 FROM public.users public_users 
    WHERE public_users.id = auth_users.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    email_verified = EXCLUDED.email_verified,
    phone_verified = EXCLUDED.phone_verified,
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();

-- Create default user roles for existing users
INSERT INTO public.user_roles (user_id, role)
SELECT 
    users.id,
    'user' as role
FROM public.users users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = users.id
)
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- 3. CREATE PROPER RLS POLICIES
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Users table policies
CREATE POLICY "Users can read their own data" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage all users" 
ON public.users FOR ALL 
USING (auth.role() = 'service_role');

-- User roles policies
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;

CREATE POLICY "Users can read their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all roles" 
ON public.user_roles FOR ALL 
USING (auth.role() = 'service_role');

-- ============================================================================
-- 4. CREATE AUTO-SYNC TRIGGER FOR FUTURE USERS
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into public.users
    INSERT INTO public.users (
        id,
        email,
        name,
        avatar_url,
        email_verified,
        phone_verified,
        phone,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email_confirmed_at IS NOT NULL,
        NEW.phone_confirmed_at IS NOT NULL,
        NEW.phone,
        NEW.created_at,
        NEW.updated_at
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        email_verified = EXCLUDED.email_verified,
        phone_verified = EXCLUDED.phone_verified,
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        updated_at = EXCLUDED.updated_at;

    -- Insert default role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- ============================================================================
-- 6. VERIFICATION
-- ============================================================================

-- Verify the fix worked
SELECT 
    'SUCCESS: Fixed redirect loop!' as status,
    COUNT(u.*) as users_in_public_table,
    COUNT(ur.*) as user_roles_created
FROM public.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id;

-- Check if your specific user exists
SELECT 
    'User profile status' as check_type,
    u.id,
    u.email,
    u.name,
    u.email_verified,
    ur.role
FROM auth.users au
LEFT JOIN public.users u ON u.id = au.id  
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE au.email = 'bcw1995@gmail.com';  -- Replace with your email

SELECT 'Database sync completed successfully!' as message;