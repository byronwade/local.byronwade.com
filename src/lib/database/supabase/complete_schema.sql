-- ===============================
-- COMPLETE SUPABASE SCHEMA
-- For Business Directory Website with Full Features
-- ===============================
-- Based on the Supabase documentation: https://supabase.com/docs/guides/api/generating-types
-- Run this entire script in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===============================
-- CUSTOM TYPES
-- ===============================

-- Basic enums
CREATE TYPE user_role AS ENUM ('user', 'business_owner', 'admin', 'moderator');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE business_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Extended enums for new features
CREATE TYPE job_status AS ENUM ('draft', 'published', 'filled', 'closed', 'expired');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interviewed', 'rejected', 'hired');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'scheduled');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'paused');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE support_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE support_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');
CREATE TYPE ad_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'active', 'paused', 'expired');
CREATE TYPE certification_status AS ENUM ('pending', 'verified', 'expired', 'revoked');

-- ===============================
-- CORE TABLES
-- ===============================

-- Users table with performance optimizations
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'active',
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Categories table with hierarchical support
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES categories(id),
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Businesses table with spatial indexing
CREATE TABLE businesses (
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
    hours JSONB,
    rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    price_range TEXT,
    status business_status DEFAULT 'draft',
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES users(id),
    claimed_by UUID REFERENCES users(id),
    claimed_at TIMESTAMPTZ,
    photos TEXT[],
    social_media JSONB DEFAULT '{}',
    amenities TEXT[],
    payment_methods TEXT[]
);

-- Business categories junction table
CREATE TABLE business_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, category_id)
);

-- Business photos table
CREATE TABLE business_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Local Hubs table for subdomain management
CREATE TABLE local_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    subdomain TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 50,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'
    
    -- Customization data
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#1e40af',
    logo_url TEXT,
    banner_url TEXT,
    custom_css TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Business filtering preferences
    auto_approve_businesses BOOLEAN DEFAULT TRUE,
    featured_categories TEXT[] DEFAULT '{}',
    excluded_categories TEXT[] DEFAULT '{}',
    min_business_rating DECIMAL(3, 2) DEFAULT 0,
    
    -- Analytics and metrics
    total_businesses INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    monthly_views INTEGER DEFAULT 0,
    
    -- Domain settings
    is_primary_domain BOOLEAN DEFAULT FALSE,
    custom_domain TEXT UNIQUE,
    ssl_enabled BOOLEAN DEFAULT FALSE,
    
    -- Vercel integration
    vercel_domain_id TEXT,
    domain_verified BOOLEAN DEFAULT FALSE,
    domain_created_at TIMESTAMPTZ,
    domain_removed_at TIMESTAMPTZ,
    
    -- Social links
    social_links JSONB DEFAULT '{}',
    contact_email TEXT,
    contact_phone TEXT
);

-- Local Hub Managers table for team management
CREATE TABLE local_hub_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'manager', -- 'owner', 'admin', 'manager', 'editor'
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(local_hub_id, user_id)
);

-- Local Hub Business Associations
CREATE TABLE local_hub_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'active', 'rejected'
    is_featured BOOLEAN DEFAULT FALSE,
    added_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    display_order INTEGER DEFAULT 0,
    custom_description TEXT,
    UNIQUE(local_hub_id, business_id)
);

-- Local Hub Analytics table
CREATE TABLE local_hub_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_hub_id UUID NOT NULL REFERENCES local_hubs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    business_views INTEGER DEFAULT 0,
    search_queries INTEGER DEFAULT 0,
    contact_clicks INTEGER DEFAULT 0,
    referral_sources JSONB DEFAULT '{}',
    popular_searches TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(local_hub_id, date)
);

-- Reserved Subdomains table
CREATE TABLE reserved_subdomains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    subdomain TEXT UNIQUE NOT NULL,
    reason TEXT NOT NULL, -- 'system', 'brand', 'explicit', 'security'
    reserved_by UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ
);

-- Reviews table with performance optimizations
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    text TEXT NOT NULL,
    photos TEXT[],
    helpful_count INTEGER DEFAULT 0,
    status review_status DEFAULT 'pending',
    is_flagged BOOLEAN DEFAULT FALSE,
    response TEXT,
    response_date TIMESTAMPTZ,
    visit_date DATE,
    verified_purchase BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    UNIQUE(business_id, user_id)
);

-- ===============================
-- JOBS & EMPLOYMENT TABLES
-- ===============================

-- Companies table for job postings
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT,
    company_size TEXT,
    founded_year INTEGER,
    headquarters TEXT,
    culture JSONB DEFAULT '{}',
    benefits TEXT[],
    owner_id UUID REFERENCES users(id),
    verified BOOLEAN DEFAULT FALSE,
    status content_status DEFAULT 'draft'
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id),
    location TEXT,
    remote_ok BOOLEAN DEFAULT FALSE,
    job_type job_type NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'USD',
    experience_level TEXT,
    skills TEXT[],
    benefits TEXT[],
    application_deadline DATE,
    status job_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    external_url TEXT,
    apply_instructions TEXT
);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    status application_status DEFAULT 'pending',
    notes TEXT,
    interview_date TIMESTAMPTZ,
    salary_expectation INTEGER,
    additional_info JSONB DEFAULT '{}',
    UNIQUE(job_id, applicant_id)
);

-- User resumes/profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    headline TEXT,
    summary TEXT,
    experience JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    skills TEXT[],
    certifications JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    portfolio_url TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    availability TEXT,
    open_to_work BOOLEAN DEFAULT FALSE
);

-- ===============================
-- BLOG & CONTENT TABLES
-- ===============================

-- Blog categories
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    parent_id UUID REFERENCES blog_categories(id),
    "order" INTEGER DEFAULT 0
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES blog_categories(id),
    tags TEXT[],
    status content_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    seo_title TEXT,
    seo_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Blog comments
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id),
    content TEXT NOT NULL,
    status content_status DEFAULT 'published',
    like_count INTEGER DEFAULT 0
);

-- ===============================
-- EVENTS TABLES
-- ===============================

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    timezone TEXT DEFAULT 'UTC',
    location TEXT,
    venue TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_url TEXT,
    organizer_id UUID NOT NULL REFERENCES users(id),
    business_id UUID REFERENCES businesses(id),
    category_id UUID REFERENCES categories(id),
    featured_image TEXT,
    gallery JSONB DEFAULT '[]',
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    status event_status DEFAULT 'upcoming',
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    requirements TEXT
);

-- Event attendees
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered',
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- ===============================
-- LEARNING & COURSES TABLES
-- ===============================

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    featured_image TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    duration_minutes INTEGER,
    difficulty_level TEXT,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    status content_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    certificate_template TEXT
);

-- Course lessons
CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    "order" INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    resources JSONB DEFAULT '[]'
);

-- Course enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    progress DECIMAL(5, 2) DEFAULT 0,
    completed_lessons JSONB DEFAULT '[]',
    last_accessed TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    UNIQUE(course_id, student_id)
);

-- ===============================
-- NETWORKING & SOCIAL TABLES
-- ===============================

-- User connections/network
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    connected_at TIMESTAMPTZ,
    message TEXT,
    UNIQUE(requester_id, recipient_id)
);

-- Posts/updates for social feed
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[],
    post_type TEXT DEFAULT 'text',
    visibility TEXT DEFAULT 'public',
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    hashtags TEXT[],
    mentions TEXT[]
);

-- Post interactions
CREATE TABLE post_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like', 'comment', 'share'
    content TEXT,
    UNIQUE(post_id, user_id, type)
);

-- ===============================
-- SHORTS & VIDEO CONTENT TABLES
-- ===============================

-- Shorts videos
CREATE TABLE shorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    creator_id UUID NOT NULL REFERENCES users(id),
    business_id UUID REFERENCES businesses(id),
    title TEXT,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    tags TEXT[],
    status content_status DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE
);

-- Shorts interactions
CREATE TABLE shorts_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    short_id UUID NOT NULL REFERENCES shorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like', 'comment', 'share', 'view'
    content TEXT,
    UNIQUE(short_id, user_id, type)
);

-- ===============================
-- BUSINESS ADVERTISING TABLES
-- ===============================

-- Advertising campaigns
CREATE TABLE ad_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    daily_budget DECIMAL(10, 2),
    total_budget DECIMAL(10, 2),
    target_audience JSONB DEFAULT '{}',
    placement_types TEXT[],
    status ad_status DEFAULT 'draft',
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0
);

-- Individual ads
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    call_to_action TEXT,
    landing_url TEXT,
    ad_type TEXT NOT NULL,
    placement TEXT[],
    status ad_status DEFAULT 'draft'
);

-- ===============================
-- BILLING & SUBSCRIPTIONS TABLES
-- ===============================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    billing_interval TEXT NOT NULL, -- 'month', 'year'
    features JSONB DEFAULT '[]',
    max_businesses INTEGER,
    max_ads INTEGER,
    max_events INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_price_id TEXT,
    "order" INTEGER DEFAULT 0
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status subscription_status DEFAULT 'active',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE
);

-- Payment history
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id),
    subscription_id UUID REFERENCES user_subscriptions(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    description TEXT,
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- ===============================
-- SUPPORT & HELP TABLES
-- ===============================

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority support_priority DEFAULT 'medium',
    status support_status DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    email TEXT,
    phone TEXT,
    attachments TEXT[]
);

-- Support ticket messages
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    sender_type TEXT DEFAULT 'user', -- 'user', 'admin', 'system'
    message TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT FALSE
);

-- ===============================
-- ADDITIONAL UTILITY TABLES
-- ===============================

-- Business certifications
CREATE TABLE business_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_authority TEXT,
    certificate_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    certificate_url TEXT,
    status certification_status DEFAULT 'pending',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    notes TEXT
);

-- User reports (for content moderation)
CREATE TABLE user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reporter_id UUID REFERENCES users(id),
    reported_content_type TEXT NOT NULL, -- 'business', 'review', 'user', 'post', etc.
    reported_content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    action_taken TEXT
);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET
);

-- Generic form submissions
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    form_type TEXT NOT NULL,
    data JSONB NOT NULL,
    user_id UUID REFERENCES users(id),
    email TEXT,
    status TEXT DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES users(id)
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active',
    source TEXT,
    interests TEXT[],
    unsubscribed_at TIMESTAMPTZ
);

-- Restaurant tables for booking
CREATE TABLE restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    location TEXT, -- 'indoor', 'outdoor', 'private'
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(business_id, table_number)
);

-- Table reservations
CREATE TABLE table_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    table_id UUID NOT NULL REFERENCES restaurant_tables(id),
    customer_id UUID REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    party_size INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    status TEXT DEFAULT 'confirmed',
    special_requests TEXT,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Notifications table for real-time features
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ
);

-- Security audit log
CREATE TABLE security_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT
);

-- Performance monitoring table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    operation TEXT NOT NULL,
    duration_ms DECIMAL(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- ===============================
-- PERFORMANCE INDEXES
-- ===============================

-- Core table indexes
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_last_login ON users (last_login);
CREATE INDEX idx_users_created_at ON users (created_at);

CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_parent_id ON categories (parent_id);
CREATE INDEX idx_categories_is_active ON categories (is_active);
CREATE INDEX idx_categories_order ON categories ("order");

CREATE INDEX idx_businesses_status ON businesses (status);
CREATE INDEX idx_businesses_verified ON businesses (verified);
CREATE INDEX idx_businesses_featured ON businesses (featured);
CREATE INDEX idx_businesses_rating ON businesses (rating DESC);
CREATE INDEX idx_businesses_city ON businesses (city);
CREATE INDEX idx_businesses_state ON businesses (state);
CREATE INDEX idx_businesses_owner_id ON businesses (owner_id);
CREATE INDEX idx_businesses_claimed_by ON businesses (claimed_by);
CREATE INDEX idx_businesses_created_at ON businesses (created_at);
CREATE INDEX idx_businesses_updated_at ON businesses (updated_at);

-- Spatial index for location-based queries
CREATE INDEX idx_businesses_location ON businesses USING GIST (ST_Point(longitude, latitude));

-- Full-text search indexes
CREATE INDEX idx_businesses_name_fts ON businesses USING GIN (to_tsvector('english', name));
CREATE INDEX idx_businesses_description_fts ON businesses USING GIN (to_tsvector('english', description));

CREATE INDEX idx_business_categories_business_id ON business_categories (business_id);
CREATE INDEX idx_business_categories_category_id ON business_categories (category_id);
CREATE INDEX idx_business_categories_is_primary ON business_categories (is_primary);

CREATE INDEX idx_business_photos_business_id ON business_photos (business_id);
CREATE INDEX idx_business_photos_is_primary ON business_photos (is_primary);
CREATE INDEX idx_business_photos_order ON business_photos ("order");

-- Local Hubs indexes
CREATE INDEX idx_local_hubs_subdomain ON local_hubs (subdomain);
CREATE INDEX idx_local_hubs_location ON local_hubs (location_city, location_state);
CREATE INDEX idx_local_hubs_owner_id ON local_hubs (owner_id);
CREATE INDEX idx_local_hubs_status ON local_hubs (status);
CREATE INDEX idx_local_hubs_created_at ON local_hubs (created_at);
CREATE INDEX idx_local_hubs_name_fts ON local_hubs USING GIN (to_tsvector('english', name));
CREATE INDEX idx_local_hubs_description_fts ON local_hubs USING GIN (to_tsvector('english', description));

CREATE INDEX idx_local_hub_managers_hub_id ON local_hub_managers (local_hub_id);
CREATE INDEX idx_local_hub_managers_user_id ON local_hub_managers (user_id);
CREATE INDEX idx_local_hub_managers_role ON local_hub_managers (role);

CREATE INDEX idx_local_hub_businesses_hub_id ON local_hub_businesses (local_hub_id);
CREATE INDEX idx_local_hub_businesses_business_id ON local_hub_businesses (business_id);
CREATE INDEX idx_local_hub_businesses_status ON local_hub_businesses (status);
CREATE INDEX idx_local_hub_businesses_is_featured ON local_hub_businesses (is_featured);
CREATE INDEX idx_local_hub_businesses_display_order ON local_hub_businesses (display_order);

CREATE INDEX idx_local_hub_analytics_hub_id ON local_hub_analytics (local_hub_id);
CREATE INDEX idx_local_hub_analytics_date ON local_hub_analytics (date DESC);

CREATE INDEX idx_reserved_subdomains_subdomain ON reserved_subdomains (subdomain);
CREATE INDEX idx_reserved_subdomains_expires_at ON reserved_subdomains (expires_at);

CREATE INDEX idx_reviews_business_id ON reviews (business_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);
CREATE INDEX idx_reviews_status ON reviews (status);
CREATE INDEX idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX idx_reviews_helpful_count ON reviews (helpful_count DESC);
CREATE INDEX idx_reviews_text_fts ON reviews USING GIN (to_tsvector('english', text));

-- Jobs indexes
CREATE INDEX idx_jobs_status ON jobs (status);
CREATE INDEX idx_jobs_company_id ON jobs (company_id);
CREATE INDEX idx_jobs_job_type ON jobs (job_type);
CREATE INDEX idx_jobs_created_at ON jobs (created_at DESC);
CREATE INDEX idx_jobs_salary_min ON jobs (salary_min);
CREATE INDEX idx_jobs_location ON jobs (location);
CREATE INDEX idx_jobs_title_fts ON jobs USING GIN (to_tsvector('english', title));
CREATE INDEX idx_jobs_description_fts ON jobs USING GIN (to_tsvector('english', description));

CREATE INDEX idx_job_applications_job_id ON job_applications (job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications (applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications (status);

-- Blog indexes
CREATE INDEX idx_blog_posts_status ON blog_posts (status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts (author_id);
CREATE INDEX idx_blog_posts_category_id ON blog_posts (category_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts (published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX idx_blog_posts_title_fts ON blog_posts USING GIN (to_tsvector('english', title));
CREATE INDEX idx_blog_posts_content_fts ON blog_posts USING GIN (to_tsvector('english', content));
CREATE INDEX idx_blog_comments_post_id ON blog_comments (post_id);

-- Events indexes
CREATE INDEX idx_events_start_date ON events (start_date);
CREATE INDEX idx_events_status ON events (status);
CREATE INDEX idx_events_organizer_id ON events (organizer_id);
CREATE INDEX idx_events_business_id ON events (business_id);
CREATE INDEX idx_events_location ON events USING GIST (ST_Point(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_events_title_fts ON events USING GIN (to_tsvector('english', title));

-- Courses indexes
CREATE INDEX idx_courses_instructor_id ON courses (instructor_id);
CREATE INDEX idx_courses_status ON courses (status);
CREATE INDEX idx_courses_category_id ON courses (category_id);
CREATE INDEX idx_courses_title_fts ON courses USING GIN (to_tsvector('english', title));
CREATE INDEX idx_course_enrollments_student_id ON course_enrollments (student_id);
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments (course_id);

-- Social indexes
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX idx_user_connections_requester_id ON user_connections (requester_id);
CREATE INDEX idx_user_connections_recipient_id ON user_connections (recipient_id);

-- Other indexes
CREATE INDEX idx_shorts_creator_id ON shorts (creator_id);
CREATE INDEX idx_shorts_business_id ON shorts (business_id);
CREATE INDEX idx_shorts_created_at ON shorts (created_at DESC);
CREATE INDEX idx_shorts_view_count ON shorts (view_count DESC);

CREATE INDEX idx_ad_campaigns_business_id ON ad_campaigns (business_id);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns (status);
CREATE INDEX idx_ads_campaign_id ON ads (campaign_id);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions (user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions (status);
CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_status ON payments (status);

CREATE INDEX idx_support_tickets_user_id ON support_tickets (user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets (status);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets (assigned_to);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);

CREATE INDEX idx_security_audit_log_user_id ON security_audit_log (user_id);
CREATE INDEX idx_security_audit_log_created_at ON security_audit_log (created_at DESC);
CREATE INDEX idx_security_audit_log_action ON security_audit_log (action);

CREATE INDEX idx_performance_metrics_operation ON performance_metrics (operation);
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics (created_at DESC);
CREATE INDEX idx_performance_metrics_duration ON performance_metrics (duration_ms DESC);

CREATE INDEX idx_analytics_events_user_id ON analytics_events (user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events (event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events (created_at DESC);

CREATE INDEX idx_table_reservations_business_id ON table_reservations (business_id);
CREATE INDEX idx_table_reservations_customer_id ON table_reservations (customer_id);
CREATE INDEX idx_table_reservations_date ON table_reservations (reservation_date);
CREATE INDEX idx_table_reservations_status ON table_reservations (status);

-- ===============================
-- FUNCTIONS FOR OPTIMIZED QUERIES
-- ===============================

-- Get nearby businesses using spatial indexing
CREATE OR REPLACE FUNCTION get_nearby_businesses(
    lat DECIMAL,
    lng DECIMAL,
    radius_km DECIMAL DEFAULT 10,
    result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    rating DECIMAL,
    review_count INTEGER,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.address,
        b.city,
        b.state,
        b.latitude,
        b.longitude,
        b.rating,
        b.review_count,
        ROUND(
            ST_Distance(
                ST_Point(lng, lat)::geography,
                ST_Point(b.longitude, b.latitude)::geography
            ) / 1000, 2
        ) AS distance
    FROM businesses b
    WHERE 
        b.status = 'published'
        AND b.verified = TRUE
        AND b.latitude IS NOT NULL 
        AND b.longitude IS NOT NULL
        AND ST_DWithin(
            ST_Point(lng, lat)::geography,
            ST_Point(b.longitude, b.latitude)::geography,
            radius_km * 1000
        )
    ORDER BY distance
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Search businesses with full-text search
CREATE OR REPLACE FUNCTION search_businesses(
    search_term TEXT,
    location TEXT DEFAULT NULL,
    category TEXT DEFAULT NULL,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    rating DECIMAL,
    review_count INTEGER,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.description,
        b.address,
        b.city,
        b.state,
        b.rating,
        b.review_count,
        ts_rank(
            to_tsvector('english', b.name || ' ' || COALESCE(b.description, '')),
            plainto_tsquery('english', search_term)
        ) AS relevance_score
    FROM businesses b
    LEFT JOIN business_categories bc ON b.id = bc.business_id
    LEFT JOIN categories c ON bc.category_id = c.id
    WHERE 
        b.status = 'published'
        AND b.verified = TRUE
        AND (
            to_tsvector('english', b.name || ' ' || COALESCE(b.description, '')) 
            @@ plainto_tsquery('english', search_term)
        )
        AND (location IS NULL OR b.city ILIKE '%' || location || '%' OR b.state ILIKE '%' || location || '%')
        AND (category IS NULL OR c.slug = category)
    ORDER BY relevance_score DESC, b.rating DESC NULLS LAST
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Search jobs with filters
CREATE OR REPLACE FUNCTION search_jobs(
    search_term TEXT DEFAULT NULL,
    job_type_filter job_type DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    remote_filter BOOLEAN DEFAULT NULL,
    min_salary INTEGER DEFAULT NULL,
    max_salary INTEGER DEFAULT NULL,
    company_filter UUID DEFAULT NULL,
    result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company_name TEXT,
    location TEXT,
    job_type job_type,
    salary_min INTEGER,
    salary_max INTEGER,
    created_at TIMESTAMPTZ,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        c.name as company_name,
        j.location,
        j.job_type,
        j.salary_min,
        j.salary_max,
        j.created_at,
        CASE 
            WHEN search_term IS NOT NULL THEN
                ts_rank(
                    to_tsvector('english', j.title || ' ' || COALESCE(j.description, '') || ' ' || c.name),
                    plainto_tsquery('english', search_term)
                )
            ELSE 1.0
        END AS relevance_score
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE 
        j.status = 'published'
        AND (search_term IS NULL OR 
             to_tsvector('english', j.title || ' ' || COALESCE(j.description, '') || ' ' || c.name) 
             @@ plainto_tsquery('english', search_term))
        AND (job_type_filter IS NULL OR j.job_type = job_type_filter)
        AND (location_filter IS NULL OR j.location ILIKE '%' || location_filter || '%')
        AND (remote_filter IS NULL OR j.remote_ok = remote_filter)
        AND (min_salary IS NULL OR j.salary_min >= min_salary)
        AND (max_salary IS NULL OR j.salary_max <= max_salary)
        AND (company_filter IS NULL OR j.company_id = company_filter)
    ORDER BY relevance_score DESC, j.created_at DESC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Get user analytics summary
CREATE OR REPLACE FUNCTION get_user_analytics(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_businesses', (SELECT COUNT(*) FROM businesses WHERE owner_id = user_uuid),
        'total_reviews', (SELECT COUNT(*) FROM reviews WHERE user_id = user_uuid),
        'total_posts', (SELECT COUNT(*) FROM posts WHERE author_id = user_uuid),
        'total_courses', (SELECT COUNT(*) FROM courses WHERE instructor_id = user_uuid),
        'total_events', (SELECT COUNT(*) FROM events WHERE organizer_id = user_uuid),
        'avg_business_rating', (SELECT AVG(rating) FROM businesses WHERE owner_id = user_uuid),
        'total_connections', (SELECT COUNT(*) FROM user_connections 
                             WHERE (requester_id = user_uuid OR recipient_id = user_uuid) 
                             AND status = 'connected')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- TRIGGERS
-- ===============================

-- Update business rating trigger
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE businesses 
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews 
            WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
            AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews 
            WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
            AND status = 'approved'
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.business_id, OLD.business_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_business_rating();

-- Updated timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON businesses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_hub_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserved_subdomains ENABLE ROW LEVEL SECURITY;

-- Core policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read access to published businesses" ON businesses
    FOR SELECT USING (status = 'published' AND verified = TRUE);

CREATE POLICY "Business owners can manage their businesses" ON businesses
    FOR ALL USING (
        auth.uid() = owner_id 
        OR auth.uid() = claimed_by
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Public read access to approved reviews" ON reviews
    FOR SELECT USING (status = 'approved' AND NOT is_flagged);

CREATE POLICY "Users can manage their own reviews" ON reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Business photos follow business permissions" ON business_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = business_id
            AND (
                b.status = 'published' 
                OR auth.uid() = b.owner_id 
                OR auth.uid() = b.claimed_by
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            )
        )
    );

-- Local Hubs RLS Policies
CREATE POLICY "Public read access to active local hubs" ON local_hubs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create local hubs" ON local_hubs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Hub owners can manage their hubs" ON local_hubs
    FOR ALL USING (
        auth.uid() = owner_id 
        OR EXISTS (
            SELECT 1 FROM local_hub_managers lhm
            WHERE lhm.local_hub_id = id
            AND lhm.user_id = auth.uid()
            AND lhm.role IN ('owner', 'admin')
        )
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Hub managers can view their hub teams" ON local_hub_managers
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM local_hub_managers lhm2
            WHERE lhm2.local_hub_id = local_hub_id
            AND lhm2.user_id = auth.uid()
            AND lhm2.role IN ('owner', 'admin')
        )
        OR EXISTS (
            SELECT 1 FROM local_hubs lh
            WHERE lh.id = local_hub_id AND lh.owner_id = auth.uid()
        )
    );

CREATE POLICY "Hub owners can manage their team" ON local_hub_managers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM local_hubs lh
            WHERE lh.id = local_hub_id AND lh.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM local_hub_managers lhm
            WHERE lhm.local_hub_id = local_hub_id
            AND lhm.user_id = auth.uid()
            AND lhm.role = 'owner'
        )
    );

CREATE POLICY "Public can view active hub business associations" ON local_hub_businesses
    FOR SELECT USING (
        status = 'active'
        AND EXISTS (
            SELECT 1 FROM local_hubs lh
            WHERE lh.id = local_hub_id AND lh.status = 'active'
        )
    );

CREATE POLICY "Hub managers can manage business associations" ON local_hub_businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM local_hub_managers lhm
            WHERE lhm.local_hub_id = local_hub_id
            AND lhm.user_id = auth.uid()
            AND lhm.role IN ('owner', 'admin', 'manager')
        )
        OR EXISTS (
            SELECT 1 FROM local_hubs lh
            WHERE lh.id = local_hub_id AND lh.owner_id = auth.uid()
        )
    );

CREATE POLICY "Hub managers can view analytics" ON local_hub_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM local_hub_managers lhm
            WHERE lhm.local_hub_id = local_hub_id
            AND lhm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM local_hubs lh
            WHERE lh.id = local_hub_id AND lh.owner_id = auth.uid()
        )
    );

CREATE POLICY "System can insert analytics" ON local_hub_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view reserved subdomains" ON reserved_subdomains
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Admins can manage reserved subdomains" ON reserved_subdomains
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Extended policies for new features
CREATE POLICY "Public can view published companies" ON companies
    FOR SELECT USING (status = 'published');

CREATE POLICY "Company owners can manage their companies" ON companies
    FOR ALL USING (auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Public can view published jobs" ON jobs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Company owners and admins can manage jobs" ON jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM companies c 
            WHERE c.id = company_id 
            AND (c.owner_id = auth.uid() OR auth.uid() = posted_by)
        )
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Applicants can view their applications" ON job_applications
    FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Company owners can view applications for their jobs" ON job_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs j 
            JOIN companies c ON j.company_id = c.id 
            WHERE j.id = job_id AND c.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can view public profiles" ON user_profiles
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their posts" ON blog_posts
    FOR ALL USING (
        auth.uid() = author_id 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

CREATE POLICY "Public can view upcoming events" ON events
    FOR SELECT USING (status IN ('upcoming', 'ongoing'));

CREATE POLICY "Organizers can manage their events" ON events
    FOR ALL USING (
        auth.uid() = organizer_id 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Public can view published courses" ON courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage their courses" ON courses
    FOR ALL USING (
        auth.uid() = instructor_id 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can view public posts" ON posts
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can manage their own posts" ON posts
    FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Public can view published shorts" ON shorts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can manage their shorts" ON shorts
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Support staff can view all tickets" ON support_tickets
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

-- ===============================
-- SAMPLE DATA
-- ===============================

-- Insert sample categories
INSERT INTO categories (name, slug, description, "order") VALUES
    ('Restaurants', 'restaurants', 'Food and dining establishments', 1),
    ('Shopping', 'shopping', 'Retail stores and shopping centers', 2),
    ('Services', 'services', 'Professional and personal services', 3),
    ('Healthcare', 'healthcare', 'Medical and healthcare providers', 4),
    ('Entertainment', 'entertainment', 'Entertainment and leisure activities', 5),
    ('Automotive', 'automotive', 'Car services and automotive businesses', 6),
    ('Home & Garden', 'home-garden', 'Home improvement and garden services', 7),
    ('Beauty & Wellness', 'beauty-wellness', 'Beauty salons and wellness centers', 8);

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, billing_interval, features, max_businesses, max_ads, max_events) VALUES
    ('Free', 'Basic features for individuals', 0, 'month', '["Basic listing", "Limited photos"]', 1, 0, 1),
    ('Business', 'Perfect for small businesses', 29.99, 'month', '["Priority listing", "Unlimited photos", "Basic analytics"]', 3, 5, 5),
    ('Professional', 'Advanced features for growing businesses', 79.99, 'month', '["Premium listing", "Advanced analytics", "Priority support"]', 10, 20, 15),
    ('Enterprise', 'Full-featured plan for large organizations', 199.99, 'month', '["Everything included", "Custom integrations", "Dedicated support"]', 50, 100, 50);

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
    ('Business Tips', 'business-tips', 'Helpful tips for running a successful business'),
    ('Industry News', 'industry-news', 'Latest news and trends in various industries'),
    ('Success Stories', 'success-stories', 'Inspiring stories from local businesses'),
    ('Technology', 'technology', 'Technology trends affecting local businesses'),
    ('Marketing', 'marketing', 'Marketing strategies and tips');

-- ===============================
-- PERFORMANCE OPTIMIZATION
-- ===============================

-- Analyze all tables for query optimization
ANALYZE users;
ANALYZE businesses;
ANALYZE reviews;
ANALYZE categories;
ANALYZE business_categories;
ANALYZE business_photos;
ANALYZE notifications;
ANALYZE companies;
ANALYZE jobs;
ANALYZE job_applications;
ANALYZE user_profiles;
ANALYZE blog_posts;
ANALYZE blog_comments;
ANALYZE events;
ANALYZE event_attendees;
ANALYZE courses;
ANALYZE course_lessons;
ANALYZE course_enrollments;
ANALYZE user_connections;
ANALYZE posts;
ANALYZE post_interactions;
ANALYZE shorts;
ANALYZE shorts_interactions;
ANALYZE ad_campaigns;
ANALYZE ads;
ANALYZE subscription_plans;
ANALYZE user_subscriptions;
ANALYZE payments;
ANALYZE support_tickets;
ANALYZE support_messages;
ANALYZE business_certifications;
ANALYZE user_reports;
ANALYZE analytics_events;
ANALYZE form_submissions;
ANALYZE newsletter_subscriptions;
ANALYZE restaurant_tables;
ANALYZE table_reservations;
ANALYZE security_audit_log;
ANALYZE performance_metrics; 