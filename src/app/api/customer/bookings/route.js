import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get the customer's email from the Authorization header or query params
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customer_email');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    let userEmail = customerEmail;

    // If we have an authorization header, verify JWT and get user email
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userEmail = decoded.email;
      } catch (jwtError) {
        console.log('JWT verification failed, using query params');
      }
    }

    if (!userEmail) {
      return NextResponse.json({
        success: false,
        message: 'Customer email is required'
      }, { status: 400 });
    }

    // Build the query to fetch customer reservations with all related data
    let bookingsQuery = `
      SELECT 
        r.reservation_id,
        r.start_date,
        r.end_date,
        r.pickup_time,
        r.dropoff_time,
        r.status,
        r.total_days,
        r.subtotal,
        r.extras_total,
        r.tax_amount,
        r.total_price,
        r.deposit_paid,
        r.amount_paid,
        r.payment_status,
        r.special_requests,
        r.created_at,
        r.updated_at,
        -- Vehicle details from vehicles table
        v2.make,
        v2.model,
        v2.year,
        -- Vehicle details from agency_vehicles table
        av.brand,
        av.type as vehicle_type,
        av.energy,
        av.gear_type,
        av.doors,
        av.seats,
        av.air_conditioning,
        av.images,
        vc.name as category_name,
        -- Agency details
        a.business_name as agency_name,
        a.business_phone as agency_phone,
        a.business_email as agency_email,
        -- Pickup location details
        pl.location_name as pickup_location_name,
        pl.address as pickup_address,
        pl.city as pickup_city,
        pl.country as pickup_country,
        -- Dropoff location details
        dl.location_name as dropoff_location_name,
        dl.address as dropoff_address,
        dl.city as dropoff_city,
        dl.country as dropoff_country,
        -- Customer details
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN vehicles v2 ON r.vehicle_id = v2.id
      LEFT JOIN vehicle_categories vc ON av.category_id = vc.category_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
      LEFT JOIN pickup_locations dl ON r.dropoff_location_id = dl.location_id
      WHERE u.email = ?
    `;

    const queryParams = [userEmail];

    // Add status filter if provided
    if (status && status !== 'all') {
      bookingsQuery += ' AND r.status = ?';
      queryParams.push(status);
    }

    // Add ordering and pagination
    bookingsQuery += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Execute the query
    const bookings = await query(bookingsQuery, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE u.email = ?
    `;
    const countParams = [userEmail];

    if (status && status !== 'all') {
      countQuery += ' AND r.status = ?';
      countParams.push(status);
    }

    const countResult = await query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    // For each booking, get the extras if any
    for (let booking of bookings) {
      const extrasQuery = `
        SELECT 
          re.quantity,
          re.unit_price,
          re.total_price,
          e.name as extra_name,
          e.description as extra_description,
          e.category as extra_category
        FROM reservation_extras re
        LEFT JOIN extras e ON re.extra_id = e.extra_id
        WHERE re.reservation_id = ?
      `;
      
      const extras = await query(extrasQuery, [booking.reservation_id]);
      booking.extras = extras;

      // Parse images if they exist
      if (booking.images) {
        try {
          booking.images = JSON.parse(booking.images);
        } catch (e) {
          booking.images = [];
        }
      } else {
        booking.images = [];
      }

      // Generate booking reference
      booking.booking_reference = `HLK-${String(booking.reservation_id).padStart(4, '0')}`;
      
      // Format dates for display
      if (booking.start_date) {
        booking.start_date_formatted = new Date(booking.start_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      if (booking.end_date) {
        booking.end_date_formatted = new Date(booking.end_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Format vehicle display name
      booking.vehicle_display_name = `${booking.brand || booking.make || 'Unknown'} ${booking.model || 'Vehicle'} ${booking.year || ''}`.trim();
      
      // Format pickup location
      booking.pickup_location_display = booking.pickup_location_name || 
        `${booking.pickup_city || ''}, ${booking.pickup_country || ''}`.replace(', ,', ',').replace(/^,|,$/g, '');
      
      // Status display formatting
      booking.status_display = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
      
      // Price formatting
      booking.total_price_formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0
      }).format(booking.total_price || 0).replace('MAD', '') + ' MAD';
    }

    return NextResponse.json({
      success: true,
      bookings: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings. Please try again.'
    }, { status: 500 });
  }
}
