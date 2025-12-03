import { NextResponse } from 'next/server';
import { query } from '../../../../../../lib/db';
import { verifySessionToken } from '../../../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    
    // Get vehicle reservations history
    const historyQuery = `
      SELECT 
        r.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone,
        CONCAT(u.first_name, ' ', u.last_name) as customer_full_name,
        av.brand,
        av.model,
        av.year,
        av.vehicle_number,
        DATEDIFF(r.end_date, r.start_date) as rental_days,
        DATE_FORMAT(r.start_date, '%M %d, %Y') as start_date_formatted,
        DATE_FORMAT(r.end_date, '%M %d, %Y') as end_date_formatted,
        DATE_FORMAT(r.created_at, '%M %d, %Y at %h:%i %p') as booking_date_formatted,
        CASE
          WHEN r.status = 'pending' THEN 'Pending Confirmation'
          WHEN r.status = 'confirmed' THEN 'Confirmed'
          WHEN r.status = 'active' THEN 'Active Rental'
          WHEN r.status = 'completed' THEN 'Completed'
          WHEN r.status = 'cancelled' THEN 'Cancelled'
          ELSE CONCAT(UPPER(SUBSTRING(r.status, 1, 1)), SUBSTRING(r.status, 2))
        END as status_display
      FROM reservations r
      LEFT JOIN users u ON r.customer_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      WHERE r.vehicle_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const history = await query(historyQuery, [vehicleId, limit, offset]);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reservations
      WHERE vehicle_id = ?
    `;
    
    const countResult = await query(countQuery, [vehicleId]);
    const totalReservations = countResult[0].total;
    const totalPages = Math.ceil(totalReservations / limit);
    
    // Get vehicle summary stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reservations,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_reservations,
        COUNT(CASE WHEN status IN ('confirmed', 'active') THEN 1 END) as active_reservations,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN total_price END), 0) as avg_revenue_per_booking,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN DATEDIFF(end_date, start_date) END), 0) as total_rental_days,
        MIN(created_at) as first_booking_date,
        MAX(created_at) as last_booking_date
      FROM reservations
      WHERE vehicle_id = ?
    `;
    
    const statsResult = await query(statsQuery, [vehicleId]);
    const stats = statsResult[0];
    
    const pagination = {
      page,
      pages: totalPages,
      total: totalReservations,
      limit
    };
    
    return NextResponse.json({
      success: true,
      history,
      stats: {
        ...stats,
        avg_revenue_per_booking: parseFloat(stats.avg_revenue_per_booking || 0).toFixed(2),
        total_revenue: parseFloat(stats.total_revenue || 0).toFixed(2)
      },
      pagination
    });

  } catch (error) {
    console.error('Error fetching vehicle history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicle history' },
      { status: 500 }
    );
  }
}
