-- ===================================
-- LOCAL HUBS SUBDOMAIN SCHEMA
-- ===================================
-- This schema enables users to create custom subdomains for location-based business directories
-- Example: santacruz.localhub.com, raleigh.localhub.com, etc.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE;

-- Create enums for subdomain statuses
DO $$ BEGIN
    CREATE TYPE subdomain_status AS ENUM ('pending', 'active', 'suspended', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE local_hub_type AS ENUM ('city', 'region', 'neighborhood', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Local Hubs table - Core subdomain management
CREATE TABLE IF NOT EXISTS public.local_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Subdomain configuration
    subdomain TEXT UNIQUE NOT NULL, -- e.g., 'santacruz', 'raleigh-durham'
    domain_name TEXT NOT NULL DEFAULT 'localhub.com', -- allows future custom domains
    full_domain TEXT GENERATED ALWAYS AS (subdomain || '.' || domain_name) STORED,
    
    -- Hub details
    name TEXT NOT NULL, -- e.g., 'Santa Cruz Local Hub'
    description TEXT,
    tagline TEXT,
    
    -- Geographic information
    hub_type local_hub_type DEFAULT 'city',
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'US',
    region TEXT, -- For broader areas like 'Bay Area', 'Triangle'
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 50, -- Search radius for businesses
    
    -- Owner and management
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    
    -- Status and verification
    status subdomain_status DEFAULT 'pending',
    verified BOOLEAN DEFAULT FALSE,
    ssl_enabled BOOLEAN DEFAULT TRUE,
    
    -- Customization
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#1e40af',
    custom_css TEXT,
    social_links JSONB DEFAULT '{}',
    
    -- SEO and metadata
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Business filtering
    featured_categories UUID[] DEFAULT '{}', -- Array of category IDs
    excluded_categories UUID[] DEFAULT '{}',
    auto_approve_businesses BOOLEAN DEFAULT FALSE,
    
    -- Analytics and performance
    total_businesses INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    monthly_views INTEGER DEFAULT 0,
    last_updated_businesses TIMESTAMPTZ,
    
    -- Subscription and billing (for premium features)
    plan TEXT DEFAULT 'free', -- 'free', 'basic', 'premium'
    plan_expires_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_subdomain CHECK (
        subdomain ~ '^[a-z0-9-]+$' AND 
        LENGTH(subdomain) >= 3 AND 
        LENGTH(subdomain) <= 63 AND
        subdomain NOT LIKE '-%' AND 
        subdomain NOT LIKE '%-' AND
        subdomain NOT LIKE '%---%'
    ),
    CONSTRAINT valid_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
    )
);

-- Local Hub Managers - Multiple users can manage a hub
CREATE TABLE IF NOT EXISTS public.local_hub_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'manager', -- 'owner', 'admin', 'manager', 'editor'
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(local_hub_id, user_id)
);

-- Local Hub Business Associations - Which businesses belong to which hubs
CREATE TABLE IF NOT EXISTS public.local_hub_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Association details
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    added_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'active', -- 'active', 'pending', 'rejected'
    
    -- Geographic validation
    distance_km DECIMAL(8, 3), -- Distance from hub center
    within_boundary BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(local_hub_id, business_id)
);

-- Subdomain Analytics - Track usage and performance
CREATE TABLE IF NOT EXISTS public.local_hub_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    
    -- Date tracking
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Traffic metrics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5, 2),
    avg_session_duration INTEGER, -- seconds
    
    -- Business metrics
    business_views INTEGER DEFAULT 0,
    business_clicks INTEGER DEFAULT 0,
    search_queries INTEGER DEFAULT 0,
    
    -- Engagement metrics
    reviews_created INTEGER DEFAULT 0,
    photos_uploaded INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Geographic data
    top_cities TEXT[],
    referrer_domains TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(local_hub_id, date)
);

-- Reserved Subdomains - Prevent users from taking important subdomains
CREATE TABLE IF NOT EXISTS public.reserved_subdomains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subdomain TEXT UNIQUE NOT NULL,
    reason TEXT,
    reserved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Primary lookup indexes
CREATE INDEX IF NOT EXISTS idx_local_hubs_subdomain ON local_hubs(subdomain);
CREATE INDEX IF NOT EXISTS idx_local_hubs_full_domain ON local_hubs(full_domain);
CREATE INDEX IF NOT EXISTS idx_local_hubs_status ON local_hubs(status);
CREATE INDEX IF NOT EXISTS idx_local_hubs_owner ON local_hubs(owner_id);

-- Geographic indexes
CREATE INDEX IF NOT EXISTS idx_local_hubs_location ON local_hubs(city, state, country);
CREATE INDEX IF NOT EXISTS idx_local_hubs_coordinates ON local_hubs USING GIST(ST_Point(longitude, latitude));

-- Business association indexes
CREATE INDEX IF NOT EXISTS idx_hub_businesses_hub ON local_hub_businesses(local_hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_businesses_business ON local_hub_businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_hub_businesses_status ON local_hub_businesses(status);
CREATE INDEX IF NOT EXISTS idx_hub_businesses_featured ON local_hub_businesses(local_hub_id, is_featured);

-- Manager indexes
CREATE INDEX IF NOT EXISTS idx_hub_managers_hub ON local_hub_managers(local_hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_managers_user ON local_hub_managers(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_managers_role ON local_hub_managers(local_hub_id, role);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_hub_analytics_hub_date ON local_hub_analytics(local_hub_id, date);
CREATE INDEX IF NOT EXISTS idx_hub_analytics_date ON local_hub_analytics(date);

-- ===================================
-- FUNCTIONS AND TRIGGERS
-- ===================================

-- Function to update business count automatically
CREATE OR REPLACE FUNCTION update_local_hub_business_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total businesses count
    UPDATE local_hubs 
    SET 
        total_businesses = (
            SELECT COUNT(*) 
            FROM local_hub_businesses 
            WHERE local_hub_id = COALESCE(NEW.local_hub_id, OLD.local_hub_id)
            AND status = 'active'
        ),
        last_updated_businesses = NOW(),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.local_hub_id, OLD.local_hub_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for business count updates
DROP TRIGGER IF EXISTS trigger_update_hub_business_count ON local_hub_businesses;
CREATE TRIGGER trigger_update_hub_business_count
    AFTER INSERT OR UPDATE OR DELETE ON local_hub_businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_local_hub_business_count();

-- Function to validate subdomain availability
CREATE OR REPLACE FUNCTION is_subdomain_available(subdomain_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if subdomain exists in local_hubs
    IF EXISTS (SELECT 1 FROM local_hubs WHERE subdomain = LOWER(subdomain_name)) THEN
        RETURN FALSE;
    END IF;
    
    -- Check if subdomain is reserved
    IF EXISTS (SELECT 1 FROM reserved_subdomains WHERE subdomain = LOWER(subdomain_name)) THEN
        RETURN FALSE;
    END IF;
    
    -- Check basic validation
    IF NOT (subdomain_name ~ '^[a-z0-9-]+$' AND 
            LENGTH(subdomain_name) >= 3 AND 
            LENGTH(subdomain_name) <= 63 AND
            subdomain_name NOT LIKE '-%' AND 
            subdomain_name NOT LIKE '%-' AND
            subdomain_name NOT LIKE '%---%') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get businesses within hub radius
CREATE OR REPLACE FUNCTION get_hub_businesses_in_radius(
    hub_id UUID,
    limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
    business_id UUID,
    business_name TEXT,
    distance_km DECIMAL,
    rating DECIMAL,
    review_count INTEGER
) AS $$
DECLARE
    hub_lat DECIMAL;
    hub_lng DECIMAL;
    hub_radius INTEGER;
BEGIN
    -- Get hub coordinates and radius
    SELECT latitude, longitude, radius_km 
    INTO hub_lat, hub_lng, hub_radius
    FROM local_hubs 
    WHERE id = hub_id;
    
    IF hub_lat IS NULL OR hub_lng IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        ROUND(
            ST_Distance(
                ST_Point(hub_lng, hub_lat)::geography,
                ST_Point(b.longitude, b.latitude)::geography
            ) / 1000, 2
        )::DECIMAL as distance_km,
        b.rating,
        b.review_count
    FROM businesses b
    WHERE 
        b.latitude IS NOT NULL 
        AND b.longitude IS NOT NULL
        AND b.status = 'published'
        AND ST_DWithin(
            ST_Point(hub_lng, hub_lat)::geography,
            ST_Point(b.longitude, b.latitude)::geography,
            hub_radius * 1000
        )
    ORDER BY distance_km ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- INITIAL DATA
-- ===================================

-- Insert common reserved subdomains
INSERT INTO reserved_subdomains (subdomain, reason) VALUES
    ('www', 'Standard web prefix'),
    ('api', 'API endpoint'),
    ('admin', 'Administrative interface'),
    ('app', 'Application subdomain'),
    ('blog', 'Blog subdomain'),
    ('mail', 'Email services'),
    ('ftp', 'File transfer'),
    ('cdn', 'Content delivery'),
    ('static', 'Static assets'),
    ('assets', 'Asset storage'),
    ('media', 'Media files'),
    ('files', 'File storage'),
    ('support', 'Customer support'),
    ('help', 'Help documentation'),
    ('docs', 'Documentation'),
    ('test', 'Testing environment'),
    ('staging', 'Staging environment'),
    ('dev', 'Development environment'),
    ('demo', 'Demo environment'),
    ('beta', 'Beta testing'),
    ('alpha', 'Alpha testing'),
    ('sandbox', 'Sandbox environment'),
    ('localhost', 'Local development'),
    ('local', 'Local development'),
    ('thorbis', 'Main brand'),
    ('localhub', 'Service name'),
    ('directory', 'Service feature'),
    ('business', 'Core functionality'),
    ('businesses', 'Core functionality'),
    ('review', 'Core functionality'),
    ('reviews', 'Core functionality')
ON CONFLICT (subdomain) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE local_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_analytics ENABLE ROW LEVEL SECURITY;

-- ===================================
-- SECURITY POLICIES
-- ===================================

-- Local Hubs policies
CREATE POLICY "Public hubs are viewable by everyone"
    ON local_hubs FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can create their own hubs"
    ON local_hubs FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Hub owners can update their hubs"
    ON local_hubs FOR UPDATE
    USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM local_hub_managers 
            WHERE local_hub_id = id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Hub managers policies
CREATE POLICY "Hub managers can view team"
    ON local_hub_managers FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM local_hub_managers lhm2 
            WHERE lhm2.local_hub_id = local_hub_id 
            AND lhm2.user_id = auth.uid()
        )
    );

CREATE POLICY "Hub owners can manage team"
    ON local_hub_managers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM local_hubs 
            WHERE id = local_hub_id 
            AND owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM local_hub_managers 
            WHERE local_hub_id = local_hub_managers.local_hub_id 
            AND user_id = auth.uid() 
            AND role = 'owner'
        )
    );

-- Business associations policies
CREATE POLICY "Public business associations are viewable"
    ON local_hub_businesses FOR SELECT
    USING (status = 'active');

CREATE POLICY "Hub managers can manage business associations"
    ON local_hub_businesses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM local_hub_managers 
            WHERE local_hub_id = local_hub_businesses.local_hub_id 
            AND user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Hub managers can view analytics"
    ON local_hub_analytics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM local_hub_managers 
            WHERE local_hub_id = local_hub_analytics.local_hub_id 
            AND user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;