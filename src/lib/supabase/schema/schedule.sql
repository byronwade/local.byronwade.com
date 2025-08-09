-- ================================================================
-- Enhanced Schedule Management Schema for Supabase
-- Performance-optimized tables for field service scheduling
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- Core Tables
-- ================================================================

-- Jobs table for service appointments and tasks
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Job details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_type VARCHAR(100), -- 'service', 'maintenance', 'installation', 'repair'
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    
    -- Customer information
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Location and scheduling
    location TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Time scheduling
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    estimated_duration INTEGER, -- minutes
    
    -- Assignment and resources
    assigned_technician_id UUID REFERENCES technicians(id),
    required_skills TEXT[],
    equipment_needed TEXT[],
    
    -- Financial
    estimated_value DECIMAL(10, 2),
    actual_value DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Additional data
    notes TEXT,
    internal_notes TEXT,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT valid_schedule CHECK (scheduled_end > scheduled_start),
    CONSTRAINT valid_actual_times CHECK (actual_end IS NULL OR actual_start IS NULL OR actual_end >= actual_start)
);

-- Technicians table for service team management
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- Optional link to user account
    
    -- Personal information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    employee_id VARCHAR(50),
    
    -- Professional details
    role VARCHAR(100), -- 'technician', 'senior_technician', 'specialist', 'supervisor'
    department VARCHAR(100),
    hire_date DATE,
    
    -- Skills and certifications
    skills TEXT[],
    certifications JSONB DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    
    -- Current status and availability
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'on_job', 'traveling', 'break', 'offline', 'unavailable')),
    current_location POINT,
    last_location_update TIMESTAMPTZ,
    
    -- Vehicle and equipment
    vehicle_info JSONB DEFAULT '{}', -- {type, plate, model, etc}
    assigned_equipment TEXT[],
    
    -- Performance metrics
    jobs_completed INTEGER DEFAULT 0,
    customer_rating DECIMAL(3, 2),
    efficiency_score INTEGER, -- 0-100
    
    -- Schedule preferences
    work_schedule JSONB DEFAULT '{}', -- weekly schedule, preferences
    max_daily_jobs INTEGER DEFAULT 8,
    travel_radius_km INTEGER DEFAULT 50,
    
    -- Status tracking
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table for client management
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Basic information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    
    -- Address information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'US',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Customer details
    customer_type VARCHAR(50) DEFAULT 'residential', -- 'residential', 'commercial', 'industrial'
    preferred_contact_method VARCHAR(20) DEFAULT 'phone', -- 'phone', 'email', 'text'
    
    -- Service history
    first_service_date DATE,
    last_service_date DATE,
    total_jobs INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    
    -- Customer preferences
    service_notes TEXT,
    special_instructions TEXT,
    preferred_technician_id UUID REFERENCES technicians(id),
    
    -- Status and metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment and parts tracking
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Equipment details
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    manufacturer VARCHAR(100),
    
    -- Status and location
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'broken', 'retired')),
    current_location VARCHAR(255),
    assigned_to_technician UUID REFERENCES technicians(id),
    
    -- Maintenance
    purchase_date DATE,
    warranty_expiry DATE,
    last_maintenance DATE,
    next_maintenance_due DATE,
    maintenance_interval_days INTEGER,
    
    -- Financial
    purchase_price DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- Indexes for Performance
-- ================================================================

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_business_id ON jobs(business_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_start ON jobs(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_technician ON jobs(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_date_range ON jobs(business_id, scheduled_start, scheduled_end);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs USING GIST(ST_POINT(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Technicians table indexes
CREATE INDEX IF NOT EXISTS idx_technicians_business_id ON technicians(business_id);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_skills ON technicians USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_technicians_active ON technicians(business_id, active);

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_location ON customers USING GIST(ST_POINT(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(business_id, name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Equipment table indexes
CREATE INDEX IF NOT EXISTS idx_equipment_business_id ON equipment(business_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned ON equipment(assigned_to_technician);

-- ================================================================
-- Triggers for Updated_at Timestamps
-- ================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- Performance and Analytics Functions
-- ================================================================

-- Function to get job statistics for a business
CREATE OR REPLACE FUNCTION get_job_statistics(
    business_id UUID,
    start_date TIMESTAMPTZ DEFAULT CURRENT_DATE,
    end_date TIMESTAMPTZ DEFAULT CURRENT_DATE + INTERVAL '1 day'
)
RETURNS TABLE (
    total_jobs INTEGER,
    completed_jobs INTEGER,
    ongoing_jobs INTEGER,
    scheduled_jobs INTEGER,
    cancelled_jobs INTEGER,
    efficiency DECIMAL,
    avg_duration INTEGER,
    avg_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_jobs,
        COUNT(CASE WHEN j.status = 'completed' THEN 1 END)::INTEGER as completed_jobs,
        COUNT(CASE WHEN j.status = 'in_progress' THEN 1 END)::INTEGER as ongoing_jobs,
        COUNT(CASE WHEN j.status = 'scheduled' THEN 1 END)::INTEGER as scheduled_jobs,
        COUNT(CASE WHEN j.status = 'cancelled' THEN 1 END)::INTEGER as cancelled_jobs,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN j.status = 'completed' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0 
        END as efficiency,
        ROUND(AVG(EXTRACT(EPOCH FROM (j.actual_end - j.actual_start)) / 60))::INTEGER as avg_duration,
        ROUND(AVG(t.customer_rating), 2) as avg_rating
    FROM jobs j
    LEFT JOIN technicians t ON j.assigned_technician_id = t.id
    WHERE j.business_id = $1
    AND j.scheduled_start >= $2
    AND j.scheduled_start < $3;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby jobs for route optimization
CREATE OR REPLACE FUNCTION get_nearby_jobs(
    center_lat DECIMAL,
    center_lng DECIMAL,
    radius_km INTEGER DEFAULT 10,
    business_id UUID DEFAULT NULL,
    job_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    job_id UUID,
    title VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id as job_id,
        j.title,
        j.latitude,
        j.longitude,
        ROUND(
            ST_Distance(
                ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
                ST_GeogFromText('POINT(' || j.longitude || ' ' || j.latitude || ')')
            ) / 1000, 2
        ) as distance_km
    FROM jobs j
    WHERE j.latitude IS NOT NULL 
    AND j.longitude IS NOT NULL
    AND (business_id IS NULL OR j.business_id = $4)
    AND DATE(j.scheduled_start) = $5
    AND j.status IN ('scheduled', 'in_progress')
    AND ST_Distance(
        ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
        ST_GeogFromText('POINT(' || j.longitude || ' ' || j.latitude || ')')
    ) <= ($3 * 1000)
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Row Level Security (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Jobs
CREATE POLICY "Business owners can manage their jobs" ON jobs
    FOR ALL USING (
        business_id IN (
            SELECT id FROM businesses 
            WHERE owner_id = auth.uid()
            OR id IN (
                SELECT business_id FROM business_managers 
                WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for Technicians
CREATE POLICY "Business owners can manage their technicians" ON technicians
    FOR ALL USING (
        business_id IN (
            SELECT id FROM businesses 
            WHERE owner_id = auth.uid()
            OR id IN (
                SELECT business_id FROM business_managers 
                WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for Customers
CREATE POLICY "Business owners can manage their customers" ON customers
    FOR ALL USING (
        business_id IN (
            SELECT id FROM businesses 
            WHERE owner_id = auth.uid()
            OR id IN (
                SELECT business_id FROM business_managers 
                WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for Equipment
CREATE POLICY "Business owners can manage their equipment" ON equipment
    FOR ALL USING (
        business_id IN (
            SELECT id FROM businesses 
            WHERE owner_id = auth.uid()
            OR id IN (
                SELECT business_id FROM business_managers 
                WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
            )
        )
    );

-- ================================================================
-- Sample Data for Development (Optional)
-- ================================================================

-- Insert sample data function (for development environments only)
CREATE OR REPLACE FUNCTION create_sample_schedule_data(target_business_id UUID)
RETURNS VOID AS $$
DECLARE
    tech1_id UUID;
    tech2_id UUID;
    customer1_id UUID;
    customer2_id UUID;
BEGIN
    -- Create sample technicians
    INSERT INTO technicians (business_id, name, email, phone, role, skills, status)
    VALUES 
        (target_business_id, 'Mike Wilson', 'mike@example.com', '555-0101', 'Senior Technician', ARRAY['HVAC', 'Electrical'], 'available'),
        (target_business_id, 'Lisa Chen', 'lisa@example.com', '555-0102', 'Electrical Specialist', ARRAY['Electrical', 'Wiring'], 'on_job')
    RETURNING id INTO tech1_id, tech2_id;

    -- Create sample customers
    INSERT INTO customers (business_id, name, phone, address, customer_type)
    VALUES 
        (target_business_id, 'Sarah Johnson', '555-1001', '123 Main St, Downtown', 'residential'),
        (target_business_id, 'ABC Corporation', '555-1002', '456 Business Ave, Business District', 'commercial')
    RETURNING id INTO customer1_id, customer2_id;

    -- Create sample jobs
    INSERT INTO jobs (
        business_id, title, description, customer_id, assigned_technician_id,
        scheduled_start, scheduled_end, estimated_value, status, priority
    )
    VALUES 
        (
            target_business_id, 'HVAC Maintenance', 'Annual system maintenance and filter replacement',
            customer1_id, tech1_id, 
            CURRENT_DATE + INTERVAL '9 hours', CURRENT_DATE + INTERVAL '11 hours',
            320, 'scheduled', 'normal'
        ),
        (
            target_business_id, 'Emergency Electrical Repair', 'Fix electrical panel issue',
            customer2_id, tech2_id,
            CURRENT_DATE + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '10 hours',
            450, 'in_progress', 'urgent'
        );
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Comments and Documentation
-- ================================================================

COMMENT ON TABLE jobs IS 'Service jobs and appointments with scheduling and tracking';
COMMENT ON TABLE technicians IS 'Field service technicians and team members';
COMMENT ON TABLE customers IS 'Customer information and service history';
COMMENT ON TABLE equipment IS 'Equipment and tools tracking for field service';

COMMENT ON FUNCTION get_job_statistics IS 'Calculate job performance metrics for a business within a date range';
COMMENT ON FUNCTION get_nearby_jobs IS 'Find jobs within a geographic radius for route optimization';
