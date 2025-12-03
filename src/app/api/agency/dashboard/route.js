import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import { verifySessionTokenEdge } from '../../../../lib/jwt-edge';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionTokenEdge(token);
    if (!decoded || !['agency_owner', 'agency_admin', 'agency', 'driver'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = decoded.id || decoded.user_id;

    // Get the actual agency_id from agencies table
    const agency = await query(
      'SELECT agency_id FROM agencies WHERE user_id = ? AND status = "approved"',
      [userId]
    );

    if (agency.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Agency not found or not approved' },
        { status: 403 }
      );
    }

    const agencyId = agency[0].agency_id;

    // Get dashboard statistics using agency_vehicles table
    const statsQuery = await query(`
      SELECT 
        COUNT(DISTINCT av.vehicle_id) as total_vehicles,
        COUNT(DISTINCT r.reservation_id) as total_bookings,
        COUNT(DISTINCT CASE WHEN r.status = 'pending' THEN r.reservation_id END) as pending_bookings,
        COUNT(DISTINCT CASE WHEN r.status = 'confirmed' THEN r.reservation_id END) as confirmed_bookings,
        COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.reservation_id END) as completed_bookings,
        SUM(CASE WHEN r.status = 'completed' THEN r.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN r.status IN ('confirmed', 'active') THEN r.total_price ELSE 0 END) as upcoming_revenue
      FROM agency_vehicles av
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id
      WHERE av.agency_id = ?
    `, [agencyId]);

    // Get recent bookings using agency_vehicles table
    const recentBookings = await query(`
      SELECT 
        r.*,
        u.first_name, u.last_name, u.email,
        av.brand as make, av.model, av.year, av.vehicle_number as license_plate,
        av.type as category_name
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      WHERE r.agency_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [agencyId]);

    const stats = statsQuery[0] || {
      total_vehicles: 0,
      total_bookings: 0,
      pending_bookings: 0,
      confirmed_bookings: 0,
      completed_bookings: 0,
      total_revenue: 0,
      upcoming_revenue: 0
    };

    // Format recent bookings
    const formattedBookings = (recentBookings || []).map(booking => ({
      ...booking,
      customer_name: `${booking.first_name} ${booking.last_name}`,
      vehicle_display_name: `${booking.make} ${booking.model}`,
      start_date_formatted: new Date(booking.start_date).toLocaleDateString(),
      end_date_formatted: new Date(booking.end_date).toLocaleDateString(),
      total_price_formatted: `$${parseFloat(booking.total_price).toFixed(2)}`,
      status_display: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    }));

    return NextResponse.json({
      success: true,
      statistics: {
        total_vehicles: stats.total_vehicles,
        total_bookings: stats.total_bookings,
        pending_bookings: stats.pending_bookings,
        confirmed_bookings: stats.confirmed_bookings,
        completed_bookings: stats.completed_bookings,
        total_revenue: `$${parseFloat(stats.total_revenue || 0).toFixed(2)}`,
        upcoming_revenue: `$${parseFloat(stats.upcoming_revenue || 0).toFixed(2)}`
      },
      recent_bookings: formattedBookings
    });

  } catch (error) {
    console.error('Error fetching agency dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
