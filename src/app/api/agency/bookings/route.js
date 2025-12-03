import { NextResponse } from 'next/server';
import { query, getDbPool } from '../../../../lib/database.js';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['agency_owner', 'agency_admin'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status_filter = searchParams.get('status') || 'all';
    
    const connection = await getDbPool();

    // Get agency ID for this user - using user ID directly as agency ID for now
    // This assumes the user_id is the agency_id - adjust as needed based on your schema
    const agencyId = decoded.user_id;

    // Build query based on status filter
    let statusCondition = '';
    let queryParams = [agencyId];
    
    if (status_filter !== 'all') {
      statusCondition = 'AND r.status = ?';
      queryParams.push(status_filter);
    }

    // Get reservations for this agency with all necessary joins
    const reservationsQuery = `
      SELECT 
        r.reservation_id,
        r.customer_id,
        r.vehicle_id,
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
        r.payment_status,
        r.special_requests,
        r.created_at,
        r.updated_at,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone,
        v.make as vehicle_make,
        v.model as vehicle_model,
        v.year as vehicle_year,
        v.vehicle_number,
        pl.location_name as pickup_location_name,
        pl.address as pickup_address
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
      WHERE r.agency_id = ? ${statusCondition}
      ORDER BY r.created_at DESC
    `;

    const [reservations] = await connection.execute(reservationsQuery, queryParams);

    // Get booking statistics for this agency
    const statsQuery = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as active_bookings,
        COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_bookings,
        SUM(CASE WHEN r.status = 'completed' THEN r.total_price ELSE 0 END) as total_revenue
      FROM reservations r
      WHERE r.agency_id = ?
    `;

    const [stats] = await connection.execute(statsQuery, [agencyId]);
    const statistics = stats[0] || {
      total_bookings: 0,
      pending_bookings: 0,
      active_bookings: 0,
      completed_bookings: 0,
      cancelled_bookings: 0,
      total_revenue: 0
    };

    // Format the reservations data for frontend
    const formattedReservations = reservations.map(reservation => {
      const startDate = new Date(reservation.start_date);
      const endDate = new Date(reservation.end_date);
      
      return {
        id: reservation.reservation_id,
        booking_id: `#BK${reservation.reservation_id.toString().padStart(6, '0')}`,
        customer: {
          name: `${reservation.customer_first_name || 'Guest'} ${reservation.customer_last_name || 'Customer'}`,
          email: reservation.customer_email,
          phone: reservation.customer_phone
        },
        vehicle: {
          name: `${reservation.vehicle_make || 'Unknown'} ${reservation.vehicle_model || 'Vehicle'}`,
          year: reservation.vehicle_year,
          number: reservation.vehicle_number,
          display: `${reservation.vehicle_make} ${reservation.vehicle_model}${reservation.vehicle_year ? ` (${reservation.vehicle_year})` : ''}`
        },
        period: {
          start_date: startDate.toLocaleDateString(),
          end_date: endDate.toLocaleDateString(),
          duration: `${reservation.total_days} day${reservation.total_days > 1 ? 's' : ''}`,
          pickup_time: reservation.pickup_time
        },
        amount: {
          subtotal: parseFloat(reservation.subtotal || 0),
          extras: parseFloat(reservation.extras_total || 0),
          tax: parseFloat(reservation.tax_amount || 0),
          total: parseFloat(reservation.total_price || 0),
          formatted: `MAD ${parseFloat(reservation.total_price || 0).toFixed(2)}`
        },
        status: {
          value: reservation.status,
          label: reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1),
          badge_class: getStatusBadgeClass(reservation.status)
        },
        pickup_location: reservation.pickup_location_name || reservation.pickup_address || 'TBD',
        special_requests: reservation.special_requests,
        payment_status: reservation.payment_status,
        created_at: reservation.created_at,
        updated_at: reservation.updated_at
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        reservations: formattedReservations,
        statistics: {
          total_bookings: parseInt(statistics.total_bookings),
          pending_bookings: parseInt(statistics.pending_bookings),
          active_bookings: parseInt(statistics.active_bookings),
          completed_bookings: parseInt(statistics.completed_bookings),
          cancelled_bookings: parseInt(statistics.cancelled_bookings),
          total_revenue: parseFloat(statistics.total_revenue).toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching agency bookings:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'pending':
      return 'bg-warning';
    case 'confirmed':
    case 'active':
      return 'bg-primary';
    case 'completed':
      return 'bg-secondary';
    case 'cancelled':
      return 'bg-danger';
    default:
      return 'bg-info';
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['agency_owner', 'agency_admin'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reservation_id, status, notes } = await request.json();

    if (!reservation_id || !status) {
      return NextResponse.json({ error: 'Reservation ID and status are required' }, { status: 400 });
    }

    const connection = await getDbPool();
    const agencyId = decoded.user_id;

    // Update reservation status
    const updateQuery = `
      UPDATE reservations 
      SET status = ?, updated_at = NOW() 
      WHERE reservation_id = ? AND agency_id = ?
    `;

    const [result] = await connection.execute(updateQuery, [status, reservation_id, agencyId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Reservation not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation status updated successfully'
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
