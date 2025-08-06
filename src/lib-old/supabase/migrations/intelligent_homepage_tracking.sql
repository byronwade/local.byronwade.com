-- Migration: Intelligent Homepage User Behavior Tracking
-- Creates tables and functions to support Amazon-style homepage personalization
-- Version: 1.0
-- Created: 2025-01-08

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- User Interactions Table
-- Tracks all user interactions for personalization
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN (
        'click', 'search', 'page_view', 'form_interaction', 
        'engagement', 'scroll_depth', 'attention', 'visibility'
    )),
    interaction_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_interactions_data_gin ON user_interactions USING GIN(interaction_data);

-- User Behavior Patterns Table
-- Stores analyzed patterns for fast personalization
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    patterns JSONB NOT NULL DEFAULT '{}',
    confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    last_analysis TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for behavior patterns
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_session_id ON user_behavior_patterns(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user_id ON user_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_confidence ON user_behavior_patterns(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_updated_at ON user_behavior_patterns(updated_at DESC);

-- User Preferences Table
-- Explicit user preferences for personalization
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL CHECK (preference_type IN (
        'business_category', 'location', 'price_range', 'features', 'communication'
    )),
    preference_value TEXT NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight >= 0.0 AND weight <= 1.0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_type, preference_value)
);

-- Indexes for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_type ON user_preferences(preference_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_active ON user_preferences(is_active) WHERE is_active = TRUE;

-- Homepage Personalization Cache Table
-- Caches generated homepage sections for performance
CREATE TABLE IF NOT EXISTS homepage_personalization_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cache_key TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    location_context TEXT,
    homepage_data JSONB NOT NULL,
    personalization_score DECIMAL(3,2) DEFAULT 0.0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for homepage cache
CREATE INDEX IF NOT EXISTS idx_homepage_cache_key ON homepage_personalization_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_homepage_cache_user_id ON homepage_personalization_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_homepage_cache_session_id ON homepage_personalization_cache(session_id);
CREATE INDEX IF NOT EXISTS idx_homepage_cache_expires_at ON homepage_personalization_cache(expires_at);

-- A/B Testing Assignments Table
-- Tracks A/B test assignments for homepage variations
CREATE TABLE IF NOT EXISTS homepage_ab_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    variant TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE,
    conversion_type TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(test_name, user_id, session_id)
);

-- Indexes for A/B tests
CREATE INDEX IF NOT EXISTS idx_ab_tests_name ON homepage_ab_tests(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON homepage_ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_session_id ON homepage_ab_tests(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_variant ON homepage_ab_tests(variant);

-- Performance Analytics Table
-- Tracks homepage performance metrics
CREATE TABLE IF NOT EXISTS homepage_performance_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    page_type TEXT NOT NULL DEFAULT 'homepage',
    personalization_score DECIMAL(3,2) DEFAULT 0.0,
    section_count INTEGER DEFAULT 0,
    load_time_ms INTEGER,
    interaction_count INTEGER DEFAULT 0,
    scroll_depth_percent INTEGER DEFAULT 0,
    time_on_page_ms INTEGER,
    bounce_rate DECIMAL(3,2),
    conversion_events JSONB DEFAULT '[]',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance analytics
CREATE INDEX IF NOT EXISTS idx_performance_analytics_session_id ON homepage_performance_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_user_id ON homepage_performance_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_created_at ON homepage_performance_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_personalization ON homepage_performance_analytics(personalization_score DESC);

-- Security Audit Log Table
-- Tracks security-related events for compliance
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for security audit
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_timestamp ON security_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_ip ON security_audit_log(ip_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_interactions_updated_at 
    BEFORE UPDATE ON user_interactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_behavior_patterns_updated_at 
    BEFORE UPDATE ON user_behavior_patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM homepage_personalization_cache 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze user behavior patterns
CREATE OR REPLACE FUNCTION analyze_user_behavior_patterns(p_session_id TEXT)
RETURNS JSONB AS $$
DECLARE
    patterns JSONB := '{}';
    business_types JSONB := '[]';
    locations JSONB := '[]';
    price_ranges JSONB := '[]';
    features JSONB := '[]';
    confidence DECIMAL(3,2) := 0.0;
BEGIN
    -- Analyze search patterns for business types
    SELECT COALESCE(jsonb_agg(DISTINCT business_type), '[]'::jsonb)
    INTO business_types
    FROM (
        SELECT jsonb_array_elements_text(
            interaction_data->'businessTypes'
        ) AS business_type
        FROM user_interactions
        WHERE session_id = p_session_id
        AND interaction_type = 'search'
        AND interaction_data ? 'businessTypes'
    ) bt;

    -- Analyze location patterns
    SELECT COALESCE(jsonb_agg(DISTINCT location), '[]'::jsonb)
    INTO locations
    FROM (
        SELECT jsonb_array_elements_text(
            interaction_data->'locations'
        ) AS location
        FROM user_interactions
        WHERE session_id = p_session_id
        AND interaction_type = 'search'
        AND interaction_data ? 'locations'
    ) loc;

    -- Analyze price range patterns
    SELECT COALESCE(jsonb_agg(DISTINCT price_range), '[]'::jsonb)
    INTO price_ranges
    FROM (
        SELECT jsonb_array_elements_text(
            interaction_data->'priceRanges'
        ) AS price_range
        FROM user_interactions
        WHERE session_id = p_session_id
        AND interaction_type = 'search'
        AND interaction_data ? 'priceRanges'
    ) pr;

    -- Analyze feature patterns
    SELECT COALESCE(jsonb_agg(DISTINCT feature), '[]'::jsonb)
    INTO features
    FROM (
        SELECT jsonb_array_elements_text(
            interaction_data->'features'
        ) AS feature
        FROM user_interactions
        WHERE session_id = p_session_id
        AND interaction_type = 'search'
        AND interaction_data ? 'features'
    ) f;

    -- Calculate confidence based on interaction count and diversity
    SELECT LEAST(1.0, GREATEST(0.0, 
        (COUNT(*) * 0.05) + 
        (CASE WHEN jsonb_array_length(business_types) > 0 THEN 0.3 ELSE 0 END) +
        (CASE WHEN jsonb_array_length(locations) > 0 THEN 0.2 ELSE 0 END) +
        (CASE WHEN jsonb_array_length(price_ranges) > 0 THEN 0.15 ELSE 0 END)
    ))
    INTO confidence
    FROM user_interactions
    WHERE session_id = p_session_id;

    -- Build patterns object
    patterns := jsonb_build_object(
        'businessTypes', business_types,
        'locations', locations,
        'priceRanges', price_ranges,
        'features', features,
        'confidence', confidence,
        'analyzedAt', extract(epoch from now())
    );

    -- Upsert patterns
    INSERT INTO user_behavior_patterns (session_id, patterns, confidence_score, last_analysis)
    VALUES (p_session_id, patterns, confidence, NOW())
    ON CONFLICT (session_id) 
    DO UPDATE SET 
        patterns = EXCLUDED.patterns,
        confidence_score = EXCLUDED.confidence_score,
        last_analysis = EXCLUDED.last_analysis,
        updated_at = NOW();

    RETURN patterns;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get personalized business recommendations
CREATE OR REPLACE FUNCTION get_personalized_business_recommendations(
    p_session_id TEXT,
    p_location TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    rating DECIMAL,
    review_count INTEGER,
    primary_image TEXT,
    address TEXT,
    phone TEXT,
    website TEXT,
    business_categories JSONB,
    personalization_score DECIMAL
) AS $$
DECLARE
    user_patterns JSONB;
    preferred_types TEXT[];
BEGIN
    -- Get user behavior patterns
    SELECT patterns INTO user_patterns
    FROM user_behavior_patterns
    WHERE session_id = p_session_id;

    -- Extract preferred business types
    IF user_patterns IS NOT NULL AND user_patterns ? 'businessTypes' THEN
        SELECT ARRAY(
            SELECT jsonb_array_elements_text(user_patterns->'businessTypes')
        ) INTO preferred_types;
    ELSE
        preferred_types := ARRAY[]::TEXT[];
    END IF;

    -- Return personalized recommendations
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.description,
        b.rating,
        b.review_count,
        b.primary_image,
        b.address,
        b.phone,
        b.website,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'category', jsonb_build_object(
                        'id', c.id,
                        'name', c.name,
                        'slug', c.slug
                    )
                )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::jsonb
        ) AS business_categories,
        CASE 
            WHEN array_length(preferred_types, 1) > 0 
            AND EXISTS (
                SELECT 1 FROM business_categories bc
                JOIN categories cat ON bc.category_id = cat.id
                WHERE bc.business_id = b.id
                AND cat.slug = ANY(preferred_types)
            ) THEN 0.8
            ELSE 0.2
        END AS personalization_score
    FROM businesses b
    LEFT JOIN business_categories bc ON b.id = bc.business_id
    LEFT JOIN categories c ON bc.category_id = c.id
    WHERE b.status = 'published'
    AND b.featured = true
    AND (p_location IS NULL OR b.address ILIKE '%' || p_location || '%')
    GROUP BY b.id, b.name, b.description, b.rating, b.review_count, 
             b.primary_image, b.address, b.phone, b.website
    ORDER BY 
        CASE 
            WHEN array_length(preferred_types, 1) > 0 
            AND EXISTS (
                SELECT 1 FROM business_categories bc2
                JOIN categories cat2 ON bc2.category_id = cat2.id
                WHERE bc2.business_id = b.id
                AND cat2.slug = ANY(preferred_types)
            ) THEN 1
            ELSE 2
        END,
        b.rating DESC,
        b.review_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track homepage performance
CREATE OR REPLACE FUNCTION track_homepage_performance(
    p_session_id TEXT,
    p_user_id UUID DEFAULT NULL,
    p_personalization_score DECIMAL DEFAULT 0.0,
    p_section_count INTEGER DEFAULT 0,
    p_performance_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    analytics_id UUID;
BEGIN
    INSERT INTO homepage_performance_analytics (
        session_id,
        user_id,
        personalization_score,
        section_count,
        load_time_ms,
        performance_metrics
    ) VALUES (
        p_session_id,
        p_user_id,
        p_personalization_score,
        p_section_count,
        COALESCE((p_performance_data->>'loadTime')::INTEGER, 0),
        p_performance_data
    ) RETURNING id INTO analytics_id;

    RETURN analytics_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_personalization_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- User interactions policies
CREATE POLICY "Users can insert their own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own interactions" ON user_interactions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- User behavior patterns policies
CREATE POLICY "Users can view their own patterns" ON user_behavior_patterns
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Homepage cache policies
CREATE POLICY "Users can access their own cache" ON homepage_personalization_cache
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- A/B testing policies
CREATE POLICY "Users can view their own test assignments" ON homepage_ab_tests
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Performance analytics policies
CREATE POLICY "Users can insert performance data" ON homepage_performance_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admin policies for security audit log
CREATE POLICY "Admins can view all security logs" ON security_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin'
        )
    );

-- Cleanup job (to be run via cron)
-- This would typically be scheduled to run daily
COMMENT ON FUNCTION cleanup_expired_cache() IS 
'Cleanup function for expired homepage cache entries. Schedule to run daily via pg_cron or external scheduler.';

-- Performance optimization: Partition large tables by date
-- This would be implemented based on data volume requirements

-- Grant necessary permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_session_created 
    ON user_interactions(session_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_featured_rating 
    ON businesses(featured, rating DESC) WHERE status = 'published';

-- Analytics views for reporting
CREATE OR REPLACE VIEW homepage_personalization_stats AS
SELECT 
    DATE_TRUNC('day', created_at) AS date,
    COUNT(*) AS total_sessions,
    AVG(personalization_score) AS avg_personalization_score,
    COUNT(*) FILTER (WHERE personalization_score > 0.5) AS high_personalization_sessions,
    AVG(section_count) AS avg_sections_per_page,
    AVG(load_time_ms) AS avg_load_time_ms
FROM homepage_performance_analytics
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Migration completion log
INSERT INTO migrations_log (name, executed_at) 
VALUES ('intelligent_homepage_tracking', NOW())
ON CONFLICT (name) DO UPDATE SET executed_at = NOW();