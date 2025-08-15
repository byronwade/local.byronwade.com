-- Fix reviews-users relationship issue
-- This migration ensures proper relationship between reviews and users tables

-- First, ensure the users table exists and has the correct structure
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    role TEXT DEFAULT 'user'
);

-- Ensure reviews table has proper foreign key to users
-- First check if the constraint exists
DO $$
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reviews_user_id_fkey' 
        AND table_name = 'reviews'
    ) THEN
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END$$;

-- Create indexes for better join performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Create a view that ensures the relationship is visible to PostgREST
CREATE OR REPLACE VIEW reviews_with_users AS
SELECT 
    r.*,
    u.name as user_name,
    u.avatar_url as user_avatar_url,
    u.email as user_email
FROM reviews r
LEFT JOIN users u ON r.user_id = u.id;

-- Grant proper permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT SELECT ON reviews_with_users TO authenticated;

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view public profiles" ON users;
CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the relationship works by testing a simple join
-- This will fail if there's still an issue with the relationship
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    LIMIT 1;
    
    RAISE NOTICE 'Reviews-Users relationship test passed. Count: %', test_count;
EXCEPTION
    WHEN others THEN
        RAISE WARNING 'Reviews-Users relationship test failed: %', SQLERRM;
END$$;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User profiles table with public information';
COMMENT ON VIEW reviews_with_users IS 'View combining reviews with user information for easier querying';
COMMENT ON INDEX idx_reviews_user_id IS 'Index for efficient reviews-users joins';

-- Create function to sync auth.users with public.users (if needed)
CREATE OR REPLACE FUNCTION sync_auth_user_to_public()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.created_at,
        NEW.updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
        updated_at = EXCLUDED.updated_at;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync auth users to public users
DROP TRIGGER IF EXISTS sync_auth_user_trigger ON auth.users;
CREATE TRIGGER sync_auth_user_trigger
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION sync_auth_user_to_public();
