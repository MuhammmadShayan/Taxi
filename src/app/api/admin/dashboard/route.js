import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    // Execute all queries in parallel for better performance
    const [totalStats, todayStats, recentBookings] = await Promise.all([
      // Optimized single query for all statistics
      query(`
        SELECT 
          COALESCE((SELECT COUNT(*) FROM reservations), 0) as total_bookings,
          COALESCE((SELECT COUNT(*) FROM agency_vehicles), 0) as total_agency_vehicles,
          COALESCE((SELECT COUNT(*) FROM vehicles), 0) as total_vehicles,
          COALESCE((SELECT COUNT(*) FROM agencies), 0) as total_agencies,
          COALESCE((SELECT COUNT(*) FROM users), 0) as total_customers,
          COALESCE((SELECT SUM(total_price) FROM reservations WHERE status IN ('confirmed', 'completed')), 0) as total_revenue,
          COALESCE((SELECT COUNT(*) FROM agency_vehicles WHERE status = 'available'), 0) as available_vehicles,
          COALESCE((SELECT COUNT(*) FROM agency_vehicles WHERE status = 'rented'), 0) as rented_vehicles
      `),
      
      // Optimized today's statistics
      query(`
        SELECT 
          COALESCE(COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END), 0) as today_bookings,
          COALESCE(COUNT(CASE WHEN DATE(created_at) = CURDATE() AND status = 'confirmed' THEN 1 END), 0) as today_confirmed,
          COALESCE(COUNT(CASE WHEN DATE(created_at) = CURDATE() AND status = 'pending' THEN 1 END), 0) as today_pending,
          COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() AND status IN ('confirmed', 'completed') THEN total_price ELSE 0 END), 0) as today_revenue
        FROM reservations
      `),
      
      // Simplified recent bookings query - get basic info only
      query(`
        SELECT 
          r.reservation_id,
          r.customer_id,
          r.vehicle_id,
          r.agency_id,
          r.status,
          r.total_price,
          r.created_at,
          r.start_date,
          r.end_date
        FROM reservations r
        ORDER BY r.created_at DESC
        LIMIT 10
      `)
    ]);
    
    // Simplified booking processing
    const processedBookings = recentBookings.map(booking => ({
      ...booking,
      status_display: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      total_price_formatted: `$${Number(booking.total_price || 0).toFixed(2)}`
    }));

    const statistics = {
      ...totalStats[0],
      ...todayStats[0],
      total_revenue: `$${Number(totalStats[0]?.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      today_revenue: `$${Number(todayStats[0]?.today_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      vehicle_utilization: totalStats[0]?.total_agency_vehicles > 0 ? Math.round((totalStats[0]?.rented_vehicles || 0) / totalStats[0]?.total_agency_vehicles * 100) : 0
    };

    return NextResponse.json({
      success: true,
      statistics,
      recent_bookings: processedBookings
    });

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
