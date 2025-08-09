-- ================================================================
-- Business Hours Management Schema for Supabase
-- Comprehensive system for managing business operating hours
-- Includes regular hours, special hours, holidays, and timezone support
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- Core Tables
-- ================================================================

-- Business Hours table for regular weekly operating hours
CREATE TABLE IF NOT EXISTS business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timezone information
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Weekly schedule stored as JSONB for flexibility
    -- Each day contains: {isOpen: boolean, openTime: "HH:mm", closeTime: "HH:mm", breaks: [{start: "HH:mm", end: "HH:mm"}]}
    monday_hours JSONB DEFAULT '{"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    tuesday_hours JSONB DEFAULT '{"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    wednesday_hours JSONB DEFAULT '{"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    thursday_hours JSONB DEFAULT '{"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    friday_hours JSONB DEFAULT '{"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    saturday_hours JSONB DEFAULT '{"isOpen": false, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    sunday_hours JSONB DEFAULT '{"isOpen": false, "openTime": "09:00", "closeTime": "17:00", "breaks": []}',
    
    -- Additional configuration
    auto_close_enabled BOOLEAN DEFAULT false,
    advance_booking_days INTEGER DEFAULT 30,
    same_day_booking_cutoff TIME DEFAULT '16:00:00',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_business_hours UNIQUE(business_id)
);

-- Special Hours table for holidays, events, and temporary schedule changes
CREATE TABLE IF NOT EXISTS special_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Event details
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g., "Christmas Day", "Summer Hours", "Maintenance Day"
    description TEXT,
    
    -- Special hours configuration
    is_closed BOOLEAN DEFAULT false,
    open_time TIME, -- NULL if closed
    close_time TIME, -- NULL if closed
    
    -- Special hour types
    event_type VARCHAR(50) DEFAULT 'holiday', -- 'holiday', 'event', 'maintenance', 'vacation', 'weather'
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB, -- For recurring events like "every Christmas"
    
    -- Priority and overrides
    priority INTEGER DEFAULT 0, -- Higher numbers take precedence
    overrides_regular_hours BOOLEAN DEFAULT true,
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT valid_special_hours CHECK (
        (is_closed = true) OR 
        (open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time)
    )
);

-- Business hour templates for quick setup
CREATE TABLE IF NOT EXISTS business_hour_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Template information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'retail', 'restaurant', 'medical', 'professional', 'custom'
    
    -- Template hours (same structure as business_hours)
    template_hours JSONB NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- Indexes for Performance
-- ================================================================

-- Business Hours table indexes
CREATE INDEX IF NOT EXISTS idx_business_hours_business_id ON business_hours(business_id);

-- Special Hours table indexes
CREATE INDEX IF NOT EXISTS idx_special_hours_business_id ON special_hours(business_id);
CREATE INDEX IF NOT EXISTS idx_special_hours_date ON special_hours(date);
CREATE INDEX IF NOT EXISTS idx_special_hours_business_date ON special_hours(business_id, date);
CREATE INDEX IF NOT EXISTS idx_special_hours_active ON special_hours(business_id, is_active);
CREATE INDEX IF NOT EXISTS idx_special_hours_event_type ON special_hours(event_type);

-- Business Hour Templates indexes
CREATE INDEX IF NOT EXISTS idx_hour_templates_category ON business_hour_templates(category);
CREATE INDEX IF NOT EXISTS idx_hour_templates_featured ON business_hour_templates(is_featured);

-- ================================================================
-- Triggers for Updated_at Timestamps
-- ================================================================

-- Apply updated_at triggers
CREATE TRIGGER update_business_hours_updated_at 
    BEFORE UPDATE ON business_hours 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_hours_updated_at 
    BEFORE UPDATE ON special_hours 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hour_templates_updated_at 
    BEFORE UPDATE ON business_hour_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- Business Hours Functions
-- ================================================================

-- Function to check if business is open at a specific time
CREATE OR REPLACE FUNCTION is_business_open(
    business_id UUID,
    check_time TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    is_open BOOLEAN,
    next_open_time TIMESTAMPTZ,
    next_close_time TIMESTAMPTZ,
    current_special_event VARCHAR
) AS $$
DECLARE
    biz_hours business_hours%ROWTYPE;
    special_event special_hours%ROWTYPE;
    day_name TEXT;
    local_time TIME;
    local_date DATE;
    day_hours JSONB;
BEGIN
    -- Get business hours
    SELECT * INTO biz_hours FROM business_hours WHERE business_hours.business_id = $1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Convert to business timezone
    local_time := (check_time AT TIME ZONE biz_hours.timezone)::TIME;
    local_date := (check_time AT TIME ZONE biz_hours.timezone)::DATE;
    
    -- Check for special hours first
    SELECT * INTO special_event 
    FROM special_hours sh
    WHERE sh.business_id = $1 
    AND sh.date = local_date 
    AND sh.is_active = true
    ORDER BY sh.priority DESC
    LIMIT 1;
    
    IF FOUND THEN
        IF special_event.is_closed THEN
            RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, special_event.name;
            RETURN;
        ELSIF special_event.open_time IS NOT NULL AND special_event.close_time IS NOT NULL THEN
            RETURN QUERY SELECT 
                (local_time >= special_event.open_time AND local_time <= special_event.close_time),
                CASE WHEN local_time < special_event.open_time THEN 
                    (local_date + special_event.open_time) AT TIME ZONE biz_hours.timezone
                ELSE NULL END,
                CASE WHEN local_time <= special_event.close_time THEN 
                    (local_date + special_event.close_time) AT TIME ZONE biz_hours.timezone
                ELSE NULL END,
                special_event.name;
            RETURN;
        END IF;
    END IF;
    
    -- Get day of week and corresponding hours
    day_name := LOWER(TO_CHAR(check_time AT TIME ZONE biz_hours.timezone, 'Day'));
    day_name := TRIM(day_name);
    
    CASE day_name
        WHEN 'monday' THEN day_hours := biz_hours.monday_hours;
        WHEN 'tuesday' THEN day_hours := biz_hours.tuesday_hours;
        WHEN 'wednesday' THEN day_hours := biz_hours.wednesday_hours;
        WHEN 'thursday' THEN day_hours := biz_hours.thursday_hours;
        WHEN 'friday' THEN day_hours := biz_hours.friday_hours;
        WHEN 'saturday' THEN day_hours := biz_hours.saturday_hours;
        WHEN 'sunday' THEN day_hours := biz_hours.sunday_hours;
        ELSE day_hours := '{"isOpen": false}'::JSONB;
    END CASE;
    
    -- Check if business is open today
    IF NOT (day_hours->>'isOpen')::BOOLEAN THEN
        RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Check if current time is within business hours
    RETURN QUERY SELECT 
        (local_time >= (day_hours->>'openTime')::TIME AND local_time <= (day_hours->>'closeTime')::TIME),
        CASE WHEN local_time < (day_hours->>'openTime')::TIME THEN 
            (local_date + (day_hours->>'openTime')::TIME) AT TIME ZONE biz_hours.timezone
        ELSE NULL END,
        CASE WHEN local_time <= (day_hours->>'closeTime')::TIME THEN 
            (local_date + (day_hours->>'closeTime')::TIME) AT TIME ZONE biz_hours.timezone
        ELSE NULL END,
        NULL::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- Function to get business hours for a specific date
CREATE OR REPLACE FUNCTION get_business_hours_for_date(
    business_id UUID,
    target_date DATE
)
RETURNS TABLE (
    is_open BOOLEAN,
    open_time TIME,
    close_time TIME,
    special_event VARCHAR,
    day_of_week VARCHAR
) AS $$
DECLARE
    biz_hours business_hours%ROWTYPE;
    special_event special_hours%ROWTYPE;
    day_name TEXT;
    day_hours JSONB;
BEGIN
    -- Get business hours
    SELECT * INTO biz_hours FROM business_hours WHERE business_hours.business_id = $1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TIME, NULL::TIME, NULL::VARCHAR, NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Check for special hours
    SELECT * INTO special_event 
    FROM special_hours sh
    WHERE sh.business_id = $1 
    AND sh.date = target_date 
    AND sh.is_active = true
    ORDER BY sh.priority DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT 
            NOT special_event.is_closed,
            special_event.open_time,
            special_event.close_time,
            special_event.name,
            TO_CHAR(target_date, 'Day');
        RETURN;
    END IF;
    
    -- Get regular hours for the day
    day_name := LOWER(TRIM(TO_CHAR(target_date, 'Day')));
    
    CASE day_name
        WHEN 'monday' THEN day_hours := biz_hours.monday_hours;
        WHEN 'tuesday' THEN day_hours := biz_hours.tuesday_hours;
        WHEN 'wednesday' THEN day_hours := biz_hours.wednesday_hours;
        WHEN 'thursday' THEN day_hours := biz_hours.thursday_hours;
        WHEN 'friday' THEN day_hours := biz_hours.friday_hours;
        WHEN 'saturday' THEN day_hours := biz_hours.saturday_hours;
        WHEN 'sunday' THEN day_hours := biz_hours.sunday_hours;
        ELSE day_hours := '{"isOpen": false}'::JSONB;
    END CASE;
    
    RETURN QUERY SELECT 
        (day_hours->>'isOpen')::BOOLEAN,
        (day_hours->>'openTime')::TIME,
        (day_hours->>'closeTime')::TIME,
        NULL::VARCHAR,
        TO_CHAR(target_date, 'Day');
END;
$$ LANGUAGE plpgsql;

-- Function to get next opening time
CREATE OR REPLACE FUNCTION get_next_opening_time(
    business_id UUID,
    from_time TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
    biz_hours business_hours%ROWTYPE;
    check_date DATE;
    max_check_date DATE;
    result TIMESTAMPTZ;
    day_name TEXT;
    day_hours JSONB;
    special_event special_hours%ROWTYPE;
BEGIN
    -- Get business hours
    SELECT * INTO biz_hours FROM business_hours WHERE business_hours.business_id = $1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    check_date := (from_time AT TIME ZONE biz_hours.timezone)::DATE;
    max_check_date := check_date + INTERVAL '14 days'; -- Look ahead 2 weeks max
    
    WHILE check_date <= max_check_date LOOP
        -- Check for special hours
        SELECT * INTO special_event 
        FROM special_hours sh
        WHERE sh.business_id = $1 
        AND sh.date = check_date 
        AND sh.is_active = true
        AND NOT sh.is_closed
        AND sh.open_time IS NOT NULL
        ORDER BY sh.priority DESC
        LIMIT 1;
        
        IF FOUND THEN
            result := (check_date + special_event.open_time) AT TIME ZONE biz_hours.timezone;
            IF result > from_time THEN
                RETURN result;
            END IF;
        ELSE
            -- Check regular hours
            day_name := LOWER(TRIM(TO_CHAR(check_date, 'Day')));
            
            CASE day_name
                WHEN 'monday' THEN day_hours := biz_hours.monday_hours;
                WHEN 'tuesday' THEN day_hours := biz_hours.tuesday_hours;
                WHEN 'wednesday' THEN day_hours := biz_hours.wednesday_hours;
                WHEN 'thursday' THEN day_hours := biz_hours.thursday_hours;
                WHEN 'friday' THEN day_hours := biz_hours.friday_hours;
                WHEN 'saturday' THEN day_hours := biz_hours.saturday_hours;
                WHEN 'sunday' THEN day_hours := biz_hours.sunday_hours;
                ELSE day_hours := '{"isOpen": false}'::JSONB;
            END CASE;
            
            IF (day_hours->>'isOpen')::BOOLEAN THEN
                result := (check_date + (day_hours->>'openTime')::TIME) AT TIME ZONE biz_hours.timezone;
                IF result > from_time THEN
                    RETURN result;
                END IF;
            END IF;
        END IF;
        
        check_date := check_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN NULL; -- No opening time found in the next 2 weeks
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Row Level Security (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hour_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Business Hours
CREATE POLICY "Business owners can manage their hours" ON business_hours
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

-- Public read access for business hours
CREATE POLICY "Public can view business hours" ON business_hours
    FOR SELECT USING (true);

-- RLS Policies for Special Hours
CREATE POLICY "Business owners can manage their special hours" ON special_hours
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

-- Public read access for special hours
CREATE POLICY "Public can view special hours" ON special_hours
    FOR SELECT USING (is_active = true);

-- RLS Policies for Hour Templates
CREATE POLICY "Anyone can view hour templates" ON business_hour_templates
    FOR SELECT USING (true);

-- Only admins can manage templates
CREATE POLICY "Admins can manage hour templates" ON business_hour_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- ================================================================
-- Sample Templates
-- ================================================================

-- Insert default business hour templates
INSERT INTO business_hour_templates (name, description, category, template_hours, is_featured) VALUES
(
    'Standard Business Hours',
    'Monday-Friday 9 AM to 5 PM',
    'professional',
    '{
        "monday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "tuesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "wednesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "thursday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "friday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "saturday": {"isOpen": false, "openTime": "09:00", "closeTime": "17:00", "breaks": []},
        "sunday": {"isOpen": false, "openTime": "09:00", "closeTime": "17:00", "breaks": []}
    }',
    true
),
(
    'Retail Store Hours',
    'Monday-Saturday 10 AM to 8 PM, Sunday 12 PM to 6 PM',
    'retail',
    '{
        "monday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "tuesday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "wednesday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "thursday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "friday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "saturday": {"isOpen": true, "openTime": "10:00", "closeTime": "20:00", "breaks": []},
        "sunday": {"isOpen": true, "openTime": "12:00", "closeTime": "18:00", "breaks": []}
    }',
    true
),
(
    'Restaurant Hours',
    'Tuesday-Sunday 11 AM to 10 PM, Closed Mondays',
    'restaurant',
    '{
        "monday": {"isOpen": false, "openTime": "11:00", "closeTime": "22:00", "breaks": []},
        "tuesday": {"isOpen": true, "openTime": "11:00", "closeTime": "22:00", "breaks": [{"start": "15:00", "end": "17:00"}]},
        "wednesday": {"isOpen": true, "openTime": "11:00", "closeTime": "22:00", "breaks": [{"start": "15:00", "end": "17:00"}]},
        "thursday": {"isOpen": true, "openTime": "11:00", "closeTime": "22:00", "breaks": [{"start": "15:00", "end": "17:00"}]},
        "friday": {"isOpen": true, "openTime": "11:00", "closeTime": "23:00", "breaks": []},
        "saturday": {"isOpen": true, "openTime": "11:00", "closeTime": "23:00", "breaks": []},
        "sunday": {"isOpen": true, "openTime": "11:00", "closeTime": "21:00", "breaks": []}
    }',
    true
),
(
    'Medical Office Hours',
    'Monday-Friday 8 AM to 5 PM with lunch break',
    'medical',
    '{
        "monday": {"isOpen": true, "openTime": "08:00", "closeTime": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "tuesday": {"isOpen": true, "openTime": "08:00", "closeTime": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "wednesday": {"isOpen": true, "openTime": "08:00", "closeTime": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "thursday": {"isOpen": true, "openTime": "08:00", "closeTime": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "friday": {"isOpen": true, "openTime": "08:00", "closeTime": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "saturday": {"isOpen": false, "openTime": "08:00", "closeTime": "17:00", "breaks": []},
        "sunday": {"isOpen": false, "openTime": "08:00", "closeTime": "17:00", "breaks": []}
    }',
    true
)
ON CONFLICT DO NOTHING;

-- ================================================================
-- Comments and Documentation
-- ================================================================

COMMENT ON TABLE business_hours IS 'Regular weekly business operating hours with timezone support';
COMMENT ON TABLE special_hours IS 'Special hours for holidays, events, and temporary schedule changes';
COMMENT ON TABLE business_hour_templates IS 'Predefined hour templates for quick business setup';

COMMENT ON FUNCTION is_business_open IS 'Check if business is currently open with special hours consideration';
COMMENT ON FUNCTION get_business_hours_for_date IS 'Get business hours for a specific date including special events';
COMMENT ON FUNCTION get_next_opening_time IS 'Find the next time a business will open';
