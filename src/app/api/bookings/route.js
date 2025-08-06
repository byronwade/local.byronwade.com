import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';

/**
 * Service Booking API Route
 * Handles booking requests for the unified Thorbis platform
 * Integrates with business field service management tools
 */

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const bookingData = await request.json();

    // Validate required fields
    const requiredFields = [
      'businessId', 
      'serviceType', 
      'scheduledDate', 
      'scheduledTime', 
      'customerInfo'
    ];
    
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the current user (optional - booking can be anonymous)
    const { data: { session } } = await supabase.auth.getSession();

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .insert({
        business_id: bookingData.businessId,
        customer_id: session?.user?.id || null,
        service_type: bookingData.serviceType,
        scheduled_date: bookingData.scheduledDate,
        scheduled_time: bookingData.scheduledTime,
        customer_name: bookingData.customerInfo.name,
        customer_phone: bookingData.customerInfo.phone,
        customer_email: bookingData.customerInfo.email,
        service_address: bookingData.customerInfo.address,
        description: bookingData.description || '',
        estimated_duration: bookingData.estimatedDuration,
        estimated_price: bookingData.estimatedPrice,
        status: 'pending_confirmation',
        booking_source: 'platform',
        metadata: {
          priority: bookingData.priority || 'normal',
          urgency: bookingData.urgency || 'standard',
          special_instructions: bookingData.specialInstructions || ''
        }
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Get business info for notifications
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('name, email, phone, owner_id')
      .eq('id', bookingData.businessId)
      .single();

    if (businessError) {
      console.error('Error fetching business:', businessError);
    }

    // Create notification for business owner
    if (business) {
      await supabase
        .from('notifications')
        .insert({
          user_id: business.owner_id,
          type: 'new_booking_request',
          title: 'New Service Booking Request',
          message: `${bookingData.customerInfo.name} has requested ${bookingData.serviceType} service`,
          data: {
            booking_id: booking.id,
            customer_name: bookingData.customerInfo.name,
            service_type: bookingData.serviceType,
            scheduled_date: bookingData.scheduledDate,
            scheduled_time: bookingData.scheduledTime
          },
          is_read: false
        });
    }

    // Send email notifications (in real app, use email service)
    // For now, just log the notification
    console.log('Booking notification would be sent to:', business?.email);
    console.log('Customer confirmation would be sent to:', bookingData.customerInfo.email);

    // Update business analytics
    await supabase
      .from('business_analytics')
      .upsert({
        business_id: bookingData.businessId,
        date: new Date().toISOString().split('T')[0],
        booking_requests: 1,
        leads_generated: 1
      }, {
        onConflict: 'business_id,date',
        ignoreDuplicates: false
      });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: 'Booking request submitted successfully',
      estimatedResponse: '2 hours',
      nextSteps: [
        'Business will contact you within 2 hours to confirm',
        'You will receive email confirmation',
        'Service provider will call 30 minutes before arrival'
      ]
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let query = supabase
      .from('service_bookings')
      .select(`
        *,
        business:businesses(name, phone, email),
        customer:users(name, email, phone)
      `)
      .order('created_at', { ascending: false });

    // Filter by business (for business owners)
    if (businessId) {
      // Verify business ownership
      const { data: business } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', businessId)
        .eq('owner_id', session.user.id)
        .single();

      if (!business) {
        return NextResponse.json(
          { error: 'Unauthorized access to business bookings' },
          { status: 403 }
        );
      }

      query = query.eq('business_id', businessId);
    }

    // Filter by customer (for customers)
    if (customerId) {
      if (customerId !== session.user.id) {
        return NextResponse.json(
          { error: 'Unauthorized access to customer bookings' },
          { status: 403 }
        );
      }

      query = query.eq('customer_id', customerId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || []
    });

  } catch (error) {
    console.error('Get bookings API error:', error);
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
    const { bookingId, status, businessNotes, estimatedPrice } = updateData;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify booking exists and user has permission to update
    const { data: booking, error: fetchError } = await supabase
      .from('service_bookings')
      .select(`
        *,
        business:businesses(owner_id)
      `)
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user is business owner or customer
    const isBusinessOwner = booking.business.owner_id === session.user.id;
    const isCustomer = booking.customer_id === session.user.id;

    if (!isBusinessOwner && !isCustomer) {
      return NextResponse.json(
        { error: 'Unauthorized to update this booking' },
        { status: 403 }
      );
    }

    // Build update object based on user role
    const updates = {
      updated_at: new Date().toISOString()
    };

    if (isBusinessOwner) {
      // Business owner can update status, notes, pricing
      if (status) updates.status = status;
      if (businessNotes) updates.business_notes = businessNotes;
      if (estimatedPrice) updates.estimated_price = estimatedPrice;
      updates.last_updated_by = 'business';
    } else if (isCustomer) {
      // Customer can update their info or cancel
      if (status === 'cancelled_by_customer') {
        updates.status = status;
        updates.last_updated_by = 'customer';
      }
      // Add other customer-allowed updates here
    }

    // Update the booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('service_bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    // Create notification for the other party
    const notificationUserId = isBusinessOwner ? booking.customer_id : booking.business.owner_id;
    if (notificationUserId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: notificationUserId,
          type: 'booking_updated',
          title: 'Booking Status Updated',
          message: `Your service booking has been updated to: ${status || 'modified'}`,
          data: {
            booking_id: bookingId,
            new_status: status,
            updated_by: isBusinessOwner ? 'business' : 'customer'
          },
          is_read: false
        });
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Update booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}