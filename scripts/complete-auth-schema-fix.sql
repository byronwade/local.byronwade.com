-- COMPLETE AUTHENTICATION SCHEMA FIX
-- This script creates the proper table structure with ALL necessary columns

-- Drop existing problematic tables and policies
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create comprehensive users table with ALL columns referenced in the codebase
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Business-related columns (prevents the business_id error)
    business_id UUID,
    business_name TEXT,
    business_role TEXT,
    
    -- Profile columns
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    
    -- Settings and preferences
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    -- Status and verification
    status TEXT DEFAULT 'active',
    verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_expires_at TIMESTAMPTZ,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_business_id ON public.users(business_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create VERY permissive RLS policies (we'll tighten them later)
CREATE POLICY "Allow all operations for authenticated users on users" 
ON public.users FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users on users" 
ON public.users FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Allow all operations for authenticated users on user_roles" 
ON public.user_roles FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users on user_roles" 
ON public.user_roles FOR SELECT 
TO anon
USING (true);

-- Grant comprehensive permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.user_roles TO anon;

-- Sync existing auth.users to public.users with comprehensive data
INSERT INTO public.users (
    id, 
    email, 
    name, 
    avatar_url,
    phone,
    email_verified, 
    phone_verified,
    role, 
    created_at, 
    updated_at,
    last_login_at
)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        raw_user_meta_data->>'display_name',
        split_part(email, '@', 1)
    ) as name,
    raw_user_meta_data->>'avatar_url',
    phone,
    email_confirmed_at IS NOT NULL,
    phone_confirmed_at IS NOT NULL,
    'user',
    created_at,
    updated_at,
    last_sign_in_at
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    email_verified = EXCLUDED.email_verified,
    phone_verified = EXCLUDED.phone_verified,
    updated_at = EXCLUDED.updated_at,
    last_login_at = EXCLUDED.last_login_at;

-- Sync user roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM public.users
ON CONFLICT (user_id, role) DO NOTHING;

-- Create trigger to auto-sync new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        name,
        avatar_url,
        phone,
        email_verified,
        phone_verified,
        role,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'display_name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.phone,
        NEW.email_confirmed_at IS NOT NULL,
        NEW.phone_confirmed_at IS NOT NULL,
        'user',
        NEW.created_at,
        NEW.updated_at
    ) ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'COMPLETE AUTH SCHEMA CREATED! All columns included, very permissive policies set.' as message;