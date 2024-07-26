-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users_schema;
CREATE SCHEMA IF NOT EXISTS business_schema;
CREATE SCHEMA IF NOT EXISTS admin_schema;

-- Users Table (linked with Supabase auth users)
CREATE TABLE users_schema.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles Table
CREATE TABLE users_schema.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL
);

-- User Permissions Table
CREATE TABLE users_schema.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES users_schema.roles(id) ON DELETE CASCADE,
    permission VARCHAR NOT NULL
);

-- User Roles Linking Table
CREATE TABLE users_schema.user_roles (
    user_id UUID REFERENCES users_schema.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES users_schema.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Company Types Table
CREATE TABLE business_schema.company_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL
);

-- Businesses Table
CREATE TABLE business_schema.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    alias VARCHAR,
    url VARCHAR,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    phone VARCHAR,
    display_phone VARCHAR,
    email VARCHAR,
    website VARCHAR,
    rating DECIMAL(2,1),
    review_count INT,
    price VARCHAR,
    transactions VARCHAR[],
    is_claimed BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN,
    company_type_id UUID REFERENCES business_schema.company_types(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Business Claims Table
CREATE TABLE business_schema.business_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_schema.users(id) ON DELETE CASCADE,
    status VARCHAR CHECK (status IN ('pending', 'approved', 'rejected')),
    claim_requested_at TIMESTAMPTZ DEFAULT NOW(),
    claim_approved_at TIMESTAMPTZ,
    claim_rejected_at TIMESTAMPTZ
);

-- Audit Logs Table
CREATE TABLE admin_schema.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES users_schema.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins Table
CREATE TABLE admin_schema.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_schema.users(id) ON DELETE CASCADE,
    role VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE business_schema.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    alias VARCHAR,
    title VARCHAR
);

-- Location Table
CREATE TABLE business_schema.locations (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    address1 VARCHAR,
    address2 VARCHAR,
    address3 VARCHAR,
    city VARCHAR,
    zip_code VARCHAR,
    country VARCHAR,
    state VARCHAR,
    cross_streets VARCHAR,
    neighborhood VARCHAR,
    display_address TEXT[]
);

-- Hours Table
CREATE TABLE business_schema.hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    day VARCHAR,
    start TIME,
    "end" TIME,
    is_overnight BOOLEAN
);

-- Special Hours Table
CREATE TABLE business_schema.special_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    date DATE,
    is_closed BOOLEAN
);

-- Attributes Table
CREATE TABLE business_schema.attributes (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    good_for_kids BOOLEAN,
    good_for_groups BOOLEAN,
    outdoor_seating BOOLEAN,
    takeout BOOLEAN,
    delivery BOOLEAN,
    wifi VARCHAR,
    parking JSONB,
    alcohol VARCHAR,
    bike_parking BOOLEAN,
    business_accepts_credit_cards BOOLEAN,
    business_accepts_bitcoin BOOLEAN,
    byob BOOLEAN,
    byob_corkage VARCHAR,
    cater BOOLEAN,
    coat_check BOOLEAN,
    dogs_allowed BOOLEAN,
    drivethru BOOLEAN,
    gender_neutral_restrooms BOOLEAN,
    happy_hour BOOLEAN,
    has_tv BOOLEAN,
    music JSONB,
    open_24_hours BOOLEAN,
    reservations BOOLEAN,
    romantic BOOLEAN,
    smoking VARCHAR,
    wheelchair_accessible BOOLEAN,
    business_accepts_apple_pay BOOLEAN,
    business_accepts_google_pay BOOLEAN
);

-- Payment Types Table
CREATE TABLE business_schema.payment_types (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    credit_cards BOOLEAN,
    bitcoin BOOLEAN,
    apple_pay BOOLEAN,
    google_pay BOOLEAN,
    cash BOOLEAN,
    paypal BOOLEAN
);

-- Media Table
CREATE TABLE business_schema.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    logo VARCHAR,
    featured_image VARCHAR,
    gallery TEXT[],
    portfolio JSONB,
    videos JSONB
);

-- Menus Table (Specific to Restaurants)
CREATE TABLE business_schema.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    name VARCHAR
);

-- Menu Sections Table
CREATE TABLE business_schema.menu_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES business_schema.menus(id) ON DELETE CASCADE,
    name VARCHAR
);

-- Menu Items Table
CREATE TABLE business_schema.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES business_schema.menu_sections(id) ON DELETE CASCADE,
    name VARCHAR,
    description TEXT,
    price VARCHAR,
    photos TEXT[]
);

-- Deals Table
CREATE TABLE business_schema.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    title VARCHAR,
    url VARCHAR,
    start_date DATE,
    end_date DATE,
    is_popular BOOLEAN,
    what_you_get TEXT,
    important_restrictions TEXT,
    additional_restrictions TEXT
);

-- Events Table
CREATE TABLE business_schema.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    name VARCHAR,
    category VARCHAR,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    cost VARCHAR,
    is_canceled BOOLEAN,
    is_free BOOLEAN,
    tickets_url VARCHAR
);

-- Services Table
CREATE TABLE business_schema.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    name VARCHAR,
    description TEXT,
    price VARCHAR
);

-- Social Media Table
CREATE TABLE business_schema.social_media (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    facebook VARCHAR,
    twitter VARCHAR,
    instagram VARCHAR,
    linkedin VARCHAR
);

-- Certifications Table
CREATE TABLE business_schema.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    name VARCHAR,
    issuing_organization VARCHAR,
    issue_date DATE,
    expiry_date DATE
);

-- Products Table
CREATE TABLE business_schema.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    name VARCHAR,
    description TEXT,
    price VARCHAR,
    category VARCHAR,
    image_url VARCHAR
);

-- AI Content Table
CREATE TABLE business_schema.ai_content (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    overview TEXT,
    highlights TEXT[],
    customer_reviews_summary TEXT
);

-- Posts Table
CREATE TABLE business_schema.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    author VARCHAR,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Comments Table
CREATE TABLE business_schema.post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES business_schema.posts(id) ON DELETE CASCADE,
    author VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Table
CREATE TABLE business_schema.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    author VARCHAR,
    title VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Comments Table
CREATE TABLE business_schema.blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID REFERENCES business_schema.blogs(id) ON DELETE CASCADE,
    author VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE business_schema.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    url VARCHAR,
    text TEXT,
    rating DECIMAL(2,1),
    time_created TIMESTAMPTZ,
    "user" JSONB
);

-- Review Comments Table
CREATE TABLE business_schema.review_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES business_schema.reviews(id) ON DELETE CASCADE,
    author VARCHAR,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example of specific table for a type of company, e.g., Restaurants
CREATE TABLE business_schema.restaurants (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    cuisine_type VARCHAR,
    average_cost_for_two DECIMAL(5,2),
    reservations BOOLEAN
);

-- Example of specific table for another type of company, e.g., Construction Companies
CREATE TABLE business_schema.construction_companies (
    business_id UUID PRIMARY KEY REFERENCES business_schema.businesses(id) ON DELETE CASCADE,
    license_number VARCHAR,
    bonding_information TEXT,
    insurance_information TEXT
);
