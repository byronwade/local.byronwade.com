-- ===============================
-- THORBIS UNIFIED PLATFORM - FIELD SERVICE TABLES
-- Database schema for the unified local discovery & field service platform
-- ===============================

-- ===============================
-- SERVICE BOOKING & SCHEDULING TABLES
-- ===============================

-- Service bookings table for customer requests
CREATE TABLE service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Business and customer relationships
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Service details
    service_type TEXT NOT NULL,
    service_category TEXT,
    description TEXT,
    priority service_priority DEFAULT 'medium',
    urgency TEXT DEFAULT 'standard',
    
    -- Scheduling information
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration INTERVAL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    
    -- Customer information (for non-registered customers)
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    service_address TEXT NOT NULL,
    service_location GEOGRAPHY(POINT),
    
    -- Pricing and billing
    estimated_price DECIMAL(10,2),
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    payment_status payment_status DEFAULT 'pending',
    
    -- Status tracking
    status TEXT DEFAULT 'pending_confirmation' CHECK (status IN (
        'pending_confirmation', 'confirmed', 'in_progress', 'completed', 
        'cancelled_by_customer', 'cancelled_by_business', 'rescheduled'
    )),
    
    -- Additional details
    special_instructions TEXT,
    business_notes TEXT,
    customer_notes TEXT,
    internal_notes TEXT,
    
    -- Assignment and tracking
    assigned_technician_id UUID REFERENCES users(id),
    team_lead_id UUID REFERENCES users(id),
    
    -- Source tracking
    booking_source TEXT DEFAULT 'platform' CHECK (booking_source IN (
        'platform', 'phone', 'website', 'referral', 'repeat_customer'
    )),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    last_updated_by TEXT,
    
    -- Performance tracking
    response_time_hours DECIMAL(5,2),
    customer_satisfaction_score INTEGER CHECK (customer_satisfaction_score >= 1 AND customer_satisfaction_score <= 5),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(service_type, '') || ' ' ||
            COALESCE(description, '') || ' ' ||
            COALESCE(customer_name, '') || ' ' ||
            COALESCE(service_address, '')
        )
    ) STORED
);

-- ===============================
-- BUSINESS OPERATIONS TABLES
-- ===============================

-- Business team members and roles
CREATE TABLE business_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN (
        'owner', 'admin', 'manager', 'dispatcher', 'technician', 'assistant'
    )),
    permissions JSONB DEFAULT '{}',
    hire_date DATE,
    hourly_rate DECIMAL(8,2),
    is_active BOOLEAN DEFAULT TRUE,
    skills TEXT[],
    certifications JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    UNIQUE(business_id, user_id)
);

-- Work schedules and availability
CREATE TABLE technician_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Schedule details
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Break times
    break_start_time TIME,
    break_end_time TIME,
    
    -- Location constraints
    service_radius_km INTEGER DEFAULT 50,
    preferred_areas TEXT[],
    
    -- Capacity
    max_jobs_per_day INTEGER DEFAULT 8,
    current_job_count INTEGER DEFAULT 0,
    
    -- Status
    schedule_type TEXT DEFAULT 'regular' CHECK (schedule_type IN (
        'regular', 'overtime', 'emergency', 'vacation', 'sick_leave'
    )),
    
    notes TEXT,
    UNIQUE(technician_id, schedule_date)
);

-- Equipment and inventory tracking
CREATE TABLE business_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    serial_number TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    
    -- Status and condition
    status TEXT DEFAULT 'available' CHECK (status IN (
        'available', 'in_use', 'maintenance', 'retired', 'lost'
    )),
    condition TEXT DEFAULT 'good' CHECK (condition IN (
        'excellent', 'good', 'fair', 'poor', 'needs_repair'
    )),
    
    -- Assignment
    assigned_to_technician UUID REFERENCES users(id),
    current_location TEXT,
    
    -- Maintenance tracking
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    maintenance_interval_days INTEGER,
    maintenance_notes TEXT,
    
    -- Photos and documentation
    photos TEXT[],
    documentation_urls TEXT[],
    
    metadata JSONB DEFAULT '{}'
);

-- ===============================
-- CUSTOMER RELATIONSHIP MANAGEMENT
-- ===============================

-- Customer profiles for repeat business
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Basic information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    
    -- Addresses (can have multiple service locations)
    primary_address TEXT,
    primary_location GEOGRAPHY(POINT),
    addresses JSONB DEFAULT '[]',
    
    -- Preferences
    preferred_contact_method TEXT DEFAULT 'phone' CHECK (preferred_contact_method IN (
        'phone', 'email', 'sms', 'app_notification'
    )),
    preferred_time_slots TEXT[],
    special_instructions TEXT,
    
    -- Business relationship
    customer_since DATE DEFAULT CURRENT_DATE,
    total_jobs_completed INTEGER DEFAULT 0,
    total_amount_paid DECIMAL(12,2) DEFAULT 0,
    average_job_value DECIMAL(10,2),
    last_service_date DATE,
    
    -- Customer classification
    customer_type TEXT DEFAULT 'residential' CHECK (customer_type IN (
        'residential', 'commercial', 'property_management', 'government'
    )),
    customer_tier TEXT DEFAULT 'standard' CHECK (customer_tier IN (
        'standard', 'premium', 'vip'
    )),
    
    -- Communication preferences
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    reminder_preferences JSONB DEFAULT '{}',
    
    -- Notes and tags
    notes TEXT,
    tags TEXT[],
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(name, '') || ' ' ||
            COALESCE(phone, '') || ' ' ||
            COALESCE(email, '') || ' ' ||
            COALESCE(primary_address, '')
        )
    ) STORED,
    
    -- Unique constraint on phone to prevent duplicates
    UNIQUE(phone)
);

-- ===============================
-- INVOICING AND PAYMENTS
-- ===============================

-- Service invoices
CREATE TABLE service_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Invoice details
    invoice_number TEXT UNIQUE NOT NULL,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES service_bookings(id) ON DELETE SET NULL,
    customer_profile_id UUID REFERENCES customer_profiles(id) ON DELETE SET NULL,
    
    -- Customer information (snapshot for invoice)
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    billing_address TEXT NOT NULL,
    service_address TEXT,
    
    -- Invoice dates
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    service_date DATE,
    
    -- Financial details
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Payment tracking
    amount_paid DECIMAL(10,2) DEFAULT 0,
    amount_due DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status payment_status DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'viewed', 'overdue', 'paid', 'cancelled', 'refunded'
    )),
    
    -- Terms and notes
    terms_and_conditions TEXT,
    notes TEXT,
    internal_notes TEXT,
    
    -- Late fees
    late_fee_rate DECIMAL(5,4) DEFAULT 0,
    late_fee_amount DECIMAL(10,2) DEFAULT 0,
    
    metadata JSONB DEFAULT '{}'
);

-- Invoice line items
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES service_invoices(id) ON DELETE CASCADE,
    
    -- Item details
    description TEXT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    
    -- Item classification
    item_type TEXT DEFAULT 'service' CHECK (item_type IN (
        'service', 'material', 'equipment', 'labor', 'travel', 'other'
    )),
    
    -- Tax information
    is_taxable BOOLEAN DEFAULT TRUE,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Sorting
    sort_order INTEGER DEFAULT 0,
    
    metadata JSONB DEFAULT '{}'
);

-- ===============================
-- ANALYTICS AND REPORTING TABLES
-- ===============================

-- Business performance metrics
CREATE TABLE business_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Booking metrics
    booking_requests INTEGER DEFAULT 0,
    bookings_confirmed INTEGER DEFAULT 0,
    bookings_completed INTEGER DEFAULT 0,
    bookings_cancelled INTEGER DEFAULT 0,
    
    -- Revenue metrics
    gross_revenue DECIMAL(12,2) DEFAULT 0,
    net_revenue DECIMAL(12,2) DEFAULT 0,
    average_job_value DECIMAL(10,2) DEFAULT 0,
    
    -- Operational metrics
    jobs_completed INTEGER DEFAULT 0,
    average_job_duration_hours DECIMAL(5,2) DEFAULT 0,
    technician_utilization_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Customer metrics
    new_customers INTEGER DEFAULT 0,
    repeat_customers INTEGER DEFAULT 0,
    customer_satisfaction_avg DECIMAL(3,2) DEFAULT 0,
    
    -- Lead generation metrics
    leads_generated INTEGER DEFAULT 0,
    lead_conversion_rate DECIMAL(5,4) DEFAULT 0,
    cost_per_lead DECIMAL(8,2) DEFAULT 0,
    
    -- Response time metrics
    avg_response_time_hours DECIMAL(5,2) DEFAULT 0,
    avg_quote_turnaround_hours DECIMAL(5,2) DEFAULT 0,
    
    -- Reviews and ratings
    reviews_received INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    
    UNIQUE(business_id, date)
);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================

-- Service bookings indexes
CREATE INDEX idx_service_bookings_business_id ON service_bookings(business_id);
CREATE INDEX idx_service_bookings_customer_id ON service_bookings(customer_id);
CREATE INDEX idx_service_bookings_scheduled_date ON service_bookings(scheduled_date);
CREATE INDEX idx_service_bookings_status ON service_bookings(status);
CREATE INDEX idx_service_bookings_search ON service_bookings USING GIN(search_vector);
CREATE INDEX idx_service_bookings_location ON service_bookings USING GIST(service_location);

-- Team members indexes
CREATE INDEX idx_business_team_members_business_id ON business_team_members(business_id);
CREATE INDEX idx_business_team_members_user_id ON business_team_members(user_id);
CREATE INDEX idx_business_team_members_role ON business_team_members(role);

-- Schedule indexes
CREATE INDEX idx_technician_schedules_technician_id ON technician_schedules(technician_id);
CREATE INDEX idx_technician_schedules_date ON technician_schedules(schedule_date);
CREATE INDEX idx_technician_schedules_business_id ON technician_schedules(business_id);

-- Customer profiles indexes
CREATE INDEX idx_customer_profiles_phone ON customer_profiles(phone);
CREATE INDEX idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX idx_customer_profiles_search ON customer_profiles USING GIN(search_vector);

-- Invoice indexes
CREATE INDEX idx_service_invoices_business_id ON service_invoices(business_id);
CREATE INDEX idx_service_invoices_booking_id ON service_invoices(booking_id);
CREATE INDEX idx_service_invoices_invoice_date ON service_invoices(invoice_date);
CREATE INDEX idx_service_invoices_status ON service_invoices(status);
CREATE INDEX idx_service_invoices_payment_status ON service_invoices(payment_status);

-- Analytics indexes
CREATE INDEX idx_business_analytics_business_date ON business_analytics(business_id, date);
CREATE INDEX idx_business_analytics_date ON business_analytics(date);

-- ===============================
-- ROW LEVEL SECURITY POLICIES
-- ===============================

-- Enable RLS on all tables
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;

-- Service bookings policies
CREATE POLICY "Business owners can manage their bookings" ON service_bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = service_bookings.business_id 
            AND businesses.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM business_team_members
            WHERE business_team_members.business_id = service_bookings.business_id
            AND business_team_members.user_id = auth.uid()
            AND business_team_members.is_active = TRUE
        )
    );

CREATE POLICY "Customers can view their own bookings" ON service_bookings
    FOR SELECT USING (customer_id = auth.uid());

-- Team members policies
CREATE POLICY "Business owners can manage team members" ON business_team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_team_members.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

CREATE POLICY "Team members can view their own record" ON business_team_members
    FOR SELECT USING (user_id = auth.uid());

-- Schedules policies
CREATE POLICY "Technicians can manage their own schedules" ON technician_schedules
    FOR ALL USING (
        technician_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = technician_schedules.business_id 
            AND businesses.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM business_team_members
            WHERE business_team_members.business_id = technician_schedules.business_id
            AND business_team_members.user_id = auth.uid()
            AND business_team_members.role IN ('owner', 'admin', 'manager', 'dispatcher')
        )
    );

-- Equipment policies
CREATE POLICY "Business team can manage equipment" ON business_equipment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_equipment.business_id 
            AND businesses.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM business_team_members
            WHERE business_team_members.business_id = business_equipment.business_id
            AND business_team_members.user_id = auth.uid()
            AND business_team_members.is_active = TRUE
        )
    );

-- Customer profiles policies (businesses can access their customers)
CREATE POLICY "Businesses can manage their customer profiles" ON customer_profiles
    FOR ALL USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM service_bookings
            JOIN businesses ON businesses.id = service_bookings.business_id
            WHERE service_bookings.customer_phone = customer_profiles.phone
            AND (
                businesses.owner_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM business_team_members
                    WHERE business_team_members.business_id = businesses.id
                    AND business_team_members.user_id = auth.uid()
                    AND business_team_members.is_active = TRUE
                )
            )
        )
    );

-- Invoice policies
CREATE POLICY "Business owners can manage their invoices" ON service_invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = service_invoices.business_id 
            AND businesses.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM business_team_members
            WHERE business_team_members.business_id = service_invoices.business_id
            AND business_team_members.user_id = auth.uid()
            AND business_team_members.role IN ('owner', 'admin', 'manager')
        )
    );

-- Invoice line items policies
CREATE POLICY "Users can manage line items for their invoices" ON invoice_line_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM service_invoices
            JOIN businesses ON businesses.id = service_invoices.business_id
            WHERE service_invoices.id = invoice_line_items.invoice_id
            AND (
                businesses.owner_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM business_team_members
                    WHERE business_team_members.business_id = businesses.id
                    AND business_team_members.user_id = auth.uid()
                    AND business_team_members.role IN ('owner', 'admin', 'manager')
                )
            )
        )
    );

-- Analytics policies
CREATE POLICY "Business owners can view their analytics" ON business_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_analytics.business_id 
            AND businesses.owner_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM business_team_members
            WHERE business_team_members.business_id = business_analytics.business_id
            AND business_team_members.user_id = auth.uid()
            AND business_team_members.role IN ('owner', 'admin', 'manager')
        )
    );

-- ===============================
-- FUNCTIONS AND TRIGGERS
-- ===============================

-- Function to update customer profile stats
CREATE OR REPLACE FUNCTION update_customer_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer profile when booking is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE customer_profiles 
        SET 
            total_jobs_completed = total_jobs_completed + 1,
            total_amount_paid = total_amount_paid + COALESCE(NEW.final_price, 0),
            last_service_date = NEW.scheduled_date,
            updated_at = NOW()
        WHERE phone = NEW.customer_phone;
        
        -- Calculate average job value
        UPDATE customer_profiles 
        SET average_job_value = CASE 
            WHEN total_jobs_completed > 0 THEN total_amount_paid / total_jobs_completed 
            ELSE 0 
        END
        WHERE phone = NEW.customer_phone;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customer profile updates
CREATE TRIGGER trigger_update_customer_profile_stats
    AFTER UPDATE ON service_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_profile_stats();

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
    invoice_subtotal DECIMAL(10,2);
    invoice_tax DECIMAL(10,2);
    invoice_total DECIMAL(10,2);
BEGIN
    -- Calculate totals from line items
    SELECT 
        COALESCE(SUM(line_total), 0),
        COALESCE(SUM(line_total * tax_rate), 0)
    INTO invoice_subtotal, invoice_tax
    FROM invoice_line_items 
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    -- Update invoice totals
    UPDATE service_invoices 
    SET 
        subtotal = invoice_subtotal,
        tax_amount = invoice_tax,
        total_amount = invoice_subtotal + invoice_tax - COALESCE(discount_amount, 0),
        amount_due = invoice_subtotal + invoice_tax - COALESCE(discount_amount, 0) - COALESCE(amount_paid, 0),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for invoice calculations
CREATE TRIGGER trigger_calculate_invoice_totals_insert
    AFTER INSERT ON invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_invoice_totals();

CREATE TRIGGER trigger_calculate_invoice_totals_update
    AFTER UPDATE ON invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_invoice_totals();

CREATE TRIGGER trigger_calculate_invoice_totals_delete
    AFTER DELETE ON invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_invoice_totals();