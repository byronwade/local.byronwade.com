-- Create missing Supabase tables that are causing 404 errors
-- This script creates user_security_metrics and user_activity tables

-- Create user_security_metrics table
CREATE TABLE IF NOT EXISTS user_security_metrics (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP WITH TIME ZONE,
    trusted_devices JSONB DEFAULT '[]',
    mfa_enabled BOOLEAN DEFAULT false,
    security_level TEXT DEFAULT 'standard' CHECK (security_level IN ('basic', 'standard', 'high')),
    last_password_change TIMESTAMP WITH TIME ZONE,
    login_attempts_reset_at TIMESTAMP WITH TIME ZONE,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    security_questions_set BOOLEAN DEFAULT false,
    backup_codes_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_security_metrics UNIQUE(user_id)
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_fingerprint TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT,
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better query performance
    CONSTRAINT valid_activity_type CHECK (
        type IN ('login', 'logout', 'page_view', 'search', 'business_view', 'review', 'booking', 'profile_update', 'security_change', 'error')
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_security_metrics_user_id ON user_security_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(type);
CREATE INDEX IF NOT EXISTS idx_user_activity_last_activity ON user_activity(last_activity DESC);

-- Enable Row Level Security
ALTER TABLE user_security_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_security_metrics
CREATE POLICY "Users can view their own security metrics" ON user_security_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security metrics" ON user_security_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert security metrics" ON user_security_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all security metrics" ON user_security_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for user_activity
CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user activity" ON user_activity
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user activity" ON user_activity
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_security_metrics
CREATE TRIGGER update_user_security_metrics_updated_at 
    BEFORE UPDATE ON user_security_metrics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON user_security_metrics TO authenticated;
GRANT ALL ON user_activity TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE user_security_metrics IS 'Stores security-related metrics and settings for users';
COMMENT ON TABLE user_activity IS 'Tracks user activity for analytics and security purposes';

COMMENT ON COLUMN user_security_metrics.failed_login_attempts IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN user_security_metrics.trusted_devices IS 'JSON array of trusted device fingerprints';
COMMENT ON COLUMN user_security_metrics.security_level IS 'User security level: basic, standard, or high';

COMMENT ON COLUMN user_activity.type IS 'Type of activity: login, logout, page_view, search, etc.';
COMMENT ON COLUMN user_activity.metadata IS 'Additional activity-specific data in JSON format';
COMMENT ON COLUMN user_activity.device_fingerprint IS 'Unique device identifier for security tracking';