-- FIX BUSINESS SCHEMA - Create proper table structure in public schema
-- This script creates the business tables that the application expects

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE;

-- Create enums for business statuses
CREATE TYPE business_status AS ENUM ('draft', 'pending', 'published', 'suspended', 'inactive');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE user_role AS ENUM ('user', 'business_owner', 'admin', 'moderator');

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES categories(id),
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create businesses table with spatial indexing
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    website TEXT,
    hours JSONB DEFAULT '{}',
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    price_range TEXT,
    status business_status DEFAULT 'draft',
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES auth.users(id),
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMPTZ,
    photos TEXT[] DEFAULT '{}',
    social_media JSONB DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    payment_methods TEXT[] DEFAULT '{}'
);

-- Create business categories junction table
CREATE TABLE IF NOT EXISTS public.business_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, category_id)
);

-- Create business photos table
CREATE TABLE IF NOT EXISTS public.business_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    text TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    helpful_count INTEGER DEFAULT 0,
    status review_status DEFAULT 'pending',
    is_flagged BOOLEAN DEFAULT FALSE,
    response TEXT,
    response_date TIMESTAMPTZ,
    visit_date DATE,
    verified_purchase BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    UNIQUE(business_id, user_id)
);

-- Create business hours table for more structured hours
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    is_24_hours BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, day_of_week)
);

-- Create business certifications table
CREATE TABLE IF NOT EXISTS public.business_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_authority TEXT,
    certificate_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'active',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(featured);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_businesses_city_state ON businesses(city, state);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST(ll_to_earth(latitude, longitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

CREATE INDEX IF NOT EXISTS idx_business_categories_business_id ON business_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_business_categories_category_id ON business_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_business_categories_primary ON business_categories(is_primary);

CREATE INDEX IF NOT EXISTS idx_business_photos_business_id ON business_photos(business_id);
CREATE INDEX IF NOT EXISTS idx_business_photos_primary ON business_photos(is_primary);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_hours_business_id ON business_hours(business_id);
CREATE INDEX IF NOT EXISTS idx_business_certifications_business_id ON business_certifications(business_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_businesses_name_fts ON businesses USING GIN(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_businesses_description_fts ON businesses USING GIN(to_tsvector('english', description));

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for businesses
CREATE POLICY "Published businesses are viewable by everyone" ON businesses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Business owners can manage their businesses" ON businesses
    FOR ALL USING (
        auth.uid() = owner_id OR 
        auth.uid() = claimed_by OR
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for categories (public read)
CREATE POLICY "Categories are publicly viewable" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for business_categories
CREATE POLICY "Business categories are publicly viewable" ON business_categories
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their business categories" ON business_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_categories.business_id 
            AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for business_photos
CREATE POLICY "Business photos are publicly viewable" ON business_photos
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their business photos" ON business_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_photos.business_id 
            AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
        ) OR
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for reviews
CREATE POLICY "Approved reviews are publicly viewable" ON reviews
    FOR SELECT USING (status = 'approved' AND NOT is_flagged);

CREATE POLICY "Users can manage their own reviews" ON reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view all reviews of their business" ON reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = reviews.business_id 
            AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
        )
    );

-- Create RLS policies for business_hours
CREATE POLICY "Business hours are publicly viewable" ON business_hours
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their business hours" ON business_hours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_hours.business_id 
            AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create RLS policies for business_certifications
CREATE POLICY "Business certifications are publicly viewable" ON business_certifications
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their certifications" ON business_certifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_certifications.business_id 
            AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON businesses TO anon, authenticated;
GRANT SELECT ON business_categories TO anon, authenticated;
GRANT SELECT ON business_photos TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;
GRANT SELECT ON business_hours TO anon, authenticated;
GRANT SELECT ON business_certifications TO anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON businesses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, "order") VALUES
('Restaurants', 'restaurants', 'Dining and food establishments', '🍽️', 1),
('Retail & Shopping', 'retail-shopping', 'Stores and shopping centers', '🛍️', 2),
('Services', 'services', 'Professional and personal services', '🔧', 3),
('Healthcare', 'healthcare', 'Medical and health services', '⚕️', 4),
('Entertainment', 'entertainment', 'Entertainment and recreational activities', '🎭', 5),
('Automotive', 'automotive', 'Car services and dealerships', '🚗', 6),
('Beauty & Wellness', 'beauty-wellness', 'Salons, spas, and wellness centers', '💆', 7),
('Education', 'education', 'Schools and educational services', '📚', 8),
('Real Estate', 'real-estate', 'Real estate and property services', '🏠', 9),
('Technology', 'technology', 'Tech companies and IT services', '💻', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample businesses for testing
INSERT INTO businesses (
    name, slug, description, address, city, state, zip_code, 
    latitude, longitude, phone, email, website, rating, review_count, 
    price_range, status, verified, featured
) VALUES
(
    'Demo Restaurant', 'demo-restaurant', 
    'A great local restaurant serving delicious food.',
    '123 Main St', 'San Francisco', 'CA', '94102',
    37.7749, -122.4194, '(555) 123-4567', 'info@demorestaurant.com',
    'https://demorestaurant.com', 4.5, 127, '$$', 'published', true, true
),
(
    'Sample Coffee Shop', 'sample-coffee-shop',
    'Best coffee in town with a cozy atmosphere.',
    '456 Oak Ave', 'Portland', 'OR', '97201',
    45.5152, -122.6784, '(555) 987-6543', 'hello@samplecoffee.com',
    'https://samplecoffee.com', 4.2, 89, '$', 'published', true, false
)
ON CONFLICT (slug) DO NOTHING;

-- Link businesses to categories
INSERT INTO business_categories (business_id, category_id, is_primary)
SELECT b.id, c.id, true
FROM businesses b, categories c
WHERE b.slug = 'demo-restaurant' AND c.slug = 'restaurants'
ON CONFLICT (business_id, category_id) DO NOTHING;

INSERT INTO business_categories (business_id, category_id, is_primary)
SELECT b.id, c.id, true
FROM businesses b, categories c
WHERE b.slug = 'sample-coffee-shop' AND c.slug = 'restaurants'
ON CONFLICT (business_id, category_id) DO NOTHING;

-- Success message
SELECT 'BUSINESS SCHEMA FIXED! All tables created in public schema with proper structure.' as message;