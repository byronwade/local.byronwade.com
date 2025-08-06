import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';

/**
 * Business Setup API Route for Thorbis Platform
 * Handles the complete business onboarding process
 * Creates business profile and sets up field service features
 */

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const setupData = await request.json();

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'businessName', 
      'businessType', 
      'address', 
      'city', 
      'state', 
      'zipCode',
      'phone',
      'email'
    ];
    
    const missingFields = requiredFields.filter(field => !setupData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate business slug
    const slug = setupData.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single();

    let finalSlug = slug;
    if (existingBusiness) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    // Create business record
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        name: setupData.businessName,
        slug: finalSlug,
        description: setupData.description || '',
        address: setupData.address,
        city: setupData.city,
        state: setupData.state,
        zip_code: setupData.zipCode,
        country: 'US',
        phone: setupData.phone,
        email: setupData.email,
        website: setupData.website || null,
        hours: setupData.businessHours,
        owner_id: session.user.id,
        claimed_by: session.user.id,
        claimed_at: new Date().toISOString(),
        status: 'draft', // Will be published after verification
        verified: false,
        featured: false,
        metadata: {
          business_type: setupData.businessType,
          service_radius: setupData.serviceRadius,
          team_size: setupData.teamSize,
          hourly_rate: setupData.hourlyRate,
          emergency_service: setupData.emergencyService,
          platform_features: {
            booking_enabled: setupData.enableBooking,
            quotes_enabled: setupData.enableQuotes,
            payments_enabled: setupData.enablePayments,
            scheduling_enabled: setupData.enableScheduling
          },
          onboarding_completed: true,
          setup_date: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError);
      return NextResponse.json(
        { error: 'Failed to create business profile' },
        { status: 500 }
      );
    }

    // Add business categories
    if (setupData.serviceCategories && setupData.serviceCategories.length > 0) {
      // First, get or create categories
      const categoryPromises = setupData.serviceCategories.map(async (categoryName) => {
        const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Try to find existing category
        let { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        // Create category if it doesn't exist
        if (!category) {
          const { data: newCategory } = await supabase
            .from('categories')
            .insert({
              name: categoryName,
              slug: categorySlug,
              is_active: true
            })
            .select()
            .single();
          category = newCategory;
        }

        return category;
      });

      const categories = await Promise.all(categoryPromises);
      
      // Link business to categories
      const businessCategoryInserts = categories
        .filter(cat => cat) // Filter out any failed category creations
        .map(category => ({
          business_id: business.id,
          category_id: category.id
        }));

      if (businessCategoryInserts.length > 0) {
        await supabase
          .from('business_categories')
          .insert(businessCategoryInserts);
      }
    }

    // Add business owner as team member
    await supabase
      .from('business_team_members')
      .insert({
        business_id: business.id,
        user_id: session.user.id,
        role: 'owner',
        permissions: {
          all: true
        },
        hire_date: new Date().toISOString().split('T')[0],
        is_active: true,
        skills: setupData.serviceCategories || [],
        certifications: {}
      });

    // Create initial availability schedule (if scheduling enabled)
    if (setupData.enableScheduling && setupData.businessHours) {
      const schedules = [];
      const today = new Date();
      
      // Create schedules for the next 30 days
      for (let i = 0; i < 30; i++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i);
        
        const dayName = scheduleDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const dayHours = setupData.businessHours[dayName];
        
        if (dayHours && !dayHours.closed) {
          schedules.push({
            technician_id: session.user.id,
            business_id: business.id,
            schedule_date: scheduleDate.toISOString().split('T')[0],
            start_time: dayHours.open,
            end_time: dayHours.close,
            is_available: true,
            schedule_type: 'regular',
            max_jobs_per_day: 8,
            current_job_count: 0
          });
        }
      }

      if (schedules.length > 0) {
        await supabase
          .from('technician_schedules')
          .insert(schedules);
      }
    }

    // Initialize business analytics
    await supabase
      .from('business_analytics')
      .insert({
        business_id: business.id,
        date: new Date().toISOString().split('T')[0],
        booking_requests: 0,
        bookings_confirmed: 0,
        bookings_completed: 0,
        gross_revenue: 0,
        net_revenue: 0,
        jobs_completed: 0,
        new_customers: 0,
        leads_generated: 0
      });

    // Update user role to business_owner
    await supabase.auth.updateUser({
      data: {
        role: 'business_owner',
        business_id: business.id,
        business_name: business.name
      }
    });

    // Send welcome email (in production, use proper email service)
    console.log(`Welcome email would be sent to: ${setupData.email}`);
    console.log(`Business setup completed for: ${setupData.businessName}`);

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        status: business.status
      },
      message: 'Business setup completed successfully',
      nextSteps: [
        'Complete verification by uploading required documents',
        'Add photos and detailed service descriptions',
        'Set up payment processing',
        'Start receiving customer bookings'
      ]
    });

  } catch (error) {
    console.error('Business setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error during business setup' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's business profile
    const { data: business, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_categories(
          category:categories(id, name, slug)
        ),
        business_team_members(
          role, is_active
        )
      `)
      .eq('owner_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching business profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch business profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      business: business || null,
      hasBusinessProfile: !!business
    });

  } catch (error) {
    console.error('Get business profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const updateData = await request.json();
    const { businessId, ...updates } = updateData;

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify business ownership
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('owner_id')
      .eq('id', businessId)
      .single();

    if (fetchError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    if (business.owner_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this business' },
        { status: 403 }
      );
    }

    // Update business profile
    const { data: updatedBusiness, error: updateError } = await supabase
      .from('businesses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating business:', updateError);
      return NextResponse.json(
        { error: 'Failed to update business profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      business: updatedBusiness,
      message: 'Business profile updated successfully'
    });

  } catch (error) {
    console.error('Update business profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}