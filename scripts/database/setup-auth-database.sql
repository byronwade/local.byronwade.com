-- Authentication Database Setup Script
-- Run this in your Supabase SQL Editor to fix authentication issues

-- ============================================================================
-- 1. Create users table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional fields for business users
    business_name TEXT,
    business_type TEXT,
    business_verified BOOLEAN DEFAULT FALSE,
    
    -- Profile settings
    settings JSONB DEFAULT '{}',
    
    CONSTRAINT users_email_unique UNIQUE (email)
);

-- ============================================================================
-- 2. Enable Row Level Security
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. Drop existing policies (in case they conflict)
-- ============================================================================

DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Public can read confirmed users" ON public.users;

-- ============================================================================
-- 4. Create proper RLS policies
-- ============================================================================

-- Allow users to read their own data
CREATE POLICY "Users can read their own data" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own data (for profile creation)
CREATE POLICY "Users can insert their own data" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow service role to manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" 
ON public.users FOR ALL 
USING (auth.role() = 'service_role');

-- Allow public read access to confirmed users (for public profiles)
CREATE POLICY "Public can read confirmed users" 
ON public.users FOR SELECT 
USING (email_verified = TRUE);

-- ============================================================================
-- 5. Create user roles table if needed
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- Enable RLS for user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can read their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all roles" 
ON public.user_roles FOR ALL 
USING (auth.role() = 'service_role');

-- ============================================================================
-- 6. Create function to automatically create user profile
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        name,
        avatar_url,
        email_verified,
        phone,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email_confirmed_at IS NOT NULL,
        NEW.phone,
        NEW.created_at,
        NEW.updated_at
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        email_verified = EXCLUDED.email_verified,
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        updated_at = EXCLUDED.updated_at;

    -- Assign default role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. Create trigger for automatic profile creation
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. Create test user (optional - you can also do this via dashboard)
-- ============================================================================

-- Uncomment the following block to create a test user via SQL
-- WARNING: This creates a user directly in auth.users which bypasses normal validation

/*
DO $$
BEGIN
    -- Only create if no users exist
    IF NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'test@example.com',
            crypt('testpassword123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Test User"}',
            FALSE,
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Test user created: test@example.com / testpassword123';
    ELSE
        RAISE NOTICE 'Users already exist, skipping test user creation';
    END IF;
END $$;
*/

-- ============================================================================
-- 9. Grant necessary permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- ============================================================================
-- 10. Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ============================================================================
-- Verification queries (run these to check if setup worked)
-- ============================================================================

-- Check if tables exist
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_roles');

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_roles');

-- Check if trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Success message
SELECT 'Database setup completed successfully! You can now create users via the Supabase dashboard.' as message;