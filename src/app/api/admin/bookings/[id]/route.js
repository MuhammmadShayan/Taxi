import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifySessionToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      status,
      start_date,
      end_date,
      total_price,
      payment_status,
      special_requests,
      admin_notes
    } = body;

    // Validate required fields
    if (!status || !start_date || !end_date || !total_price) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid status value' 
      }, { status: 400 });
    }

    // Calculate total days
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Update the booking (reservations table schema)
    await query(
      `UPDATE reservations SET 
        status = ?,
        start_date = ?,
        end_date = ?,
        total_days = ?,
        total_price = ?,
        payment_status = ?,
        special_requests = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE reservation_id = ?`,
      [
        status,
        start_date,
        end_date,
        diffDays,
        total_price,
        payment_status || 'pending',
        special_requests || null,
        id
      ]
    );

    return NextResponse.json({ 
      success: true,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update booking',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bookings = await query(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email as customer_email,
        u.phone as customer_phone,
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        a.business_name as agency_name,
        av.brand,
        av.model,
        av.year,
        av.license_plate,
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        CONCAT(av.brand, ' ', av.model) as vehicle_name,
        pl.location_name as pickup_location,
        dl.location_name as dropoff_location
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
      LEFT JOIN pickup_locations dl ON r.dropoff_location_id = dl.location_id
      WHERE r.reservation_id = ?
    `, [id]);

    if (bookings.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Booking not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      booking: bookings[0] 
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch booking details',
      message: error.message
    }, { status: 500 });
  }
}
