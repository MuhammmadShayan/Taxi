import { query } from '@/lib/db';
import { validateApiSession, hasPermission } from '@/lib/auth';

// GET /api/analytics - Get analytics data
export async function GET(request) {
  try {
    const validation = await validateApiSession(request);
    if (validation.error) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }
    
    const user = validation.user;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'overview', 'vehicles', 'reservations', 'revenue'
    const timeframe = searchParams.get('timeframe') || '30'; // days
    const agency_id = searchParams.get('agency_id');
    
    let whereClause = '';
    let params = [];
    
    // Filter by agency for agency users or specific agency for admin
    if (user.user_type === 'agency') {
      const [agency] = await query('SELECT id FROM agencies WHERE user_id = ?', [user.id]);
      if (agency) {
        whereClause = 'WHERE r.agency_id = ?';
        params.push(agency.id);
      }
    } else if (agency_id && user.user_type === 'admin') {
      whereClause = 'WHERE r.agency_id = ?';
      params.push(agency_id);
    }
    
    let data = {};
    
    switch (type) {
      case 'overview':
        data = await getOverviewData(whereClause, params, timeframe);
        break;
      case 'vehicles':
        data = await getVehicleAnalytics(whereClause, params, timeframe);
        break;
      case 'reservations':
        data = await getReservationAnalytics(whereClause, params, timeframe);
        break;
      case 'revenue':
        data = await getRevenueAnalytics(whereClause, params, timeframe);
        break;
      default:
        data = await getOverviewData(whereClause, params, timeframe);
    }
    
    return Response.json({ success: true, data, timeframe });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

// Get overview analytics
async function getOverviewData(whereClause, params, timeframe) {
  const timeCondition = `AND r.created_at >= DATE_SUB(NOW(), INTERVAL ${timeframe} DAY)`;
  
  // Total stats
  const [stats] = await query(`
    SELECT 
      COUNT(DISTINCT r.id) as total_reservations,
      COUNT(DISTINCT r.client_id) as total_clients,
      COUNT(DISTINCT c.id) as total_vehicles,
      SUM(r.total_amount) as total_revenue,
      AVG(r.total_amount) as avg_reservation_value
    FROM reservations r
    LEFT JOIN cars c ON r.vehicle_id = c.id
    ${whereClause} ${timeCondition}
  `, params);
  
  // Status breakdown
  const statusBreakdown = await query(`
    SELECT status, COUNT(*) as count
    FROM reservations r
    ${whereClause} ${timeCondition}
    GROUP BY status
  `, params);
  
  // Daily trend for chart
  const dailyTrend = await query(`
    SELECT 
      DATE(r.created_at) as date,
      COUNT(*) as reservations,
      SUM(r.total_amount) as revenue
    FROM reservations r
    ${whereClause} ${timeCondition}
    GROUP BY DATE(r.created_at)
    ORDER BY date
  `, params);
  
  return {
    stats,
    status_breakdown: statusBreakdown,
    daily_trend: dailyTrend
  };
}

// Get vehicle analytics
async function getVehicleAnalytics(whereClause, params, timeframe) {
  const timeCondition = `AND r.created_at >= DATE_SUB(NOW(), INTERVAL ${timeframe} DAY)`;
  
  // Most popular vehicles
  const popularVehicles = await query(`
    SELECT 
      c.make, c.model, c.id,
      COUNT(r.id) as reservation_count,
      SUM(r.total_amount) as total_revenue,
      AVG(r.total_amount) as avg_revenue
    FROM cars c
    LEFT JOIN reservations r ON c.id = r.vehicle_id
    ${whereClause.replace('r.agency_id', 'c.agency_id')} ${timeCondition}
    GROUP BY c.id
    ORDER BY reservation_count DESC
    LIMIT 10
  `, params);
  
  // Vehicle type performance
  const vehicleTypes = await query(`
    SELECT 
      cc.name as category,
      COUNT(r.id) as reservations,
      SUM(r.total_amount) as revenue
    FROM cars c
    LEFT JOIN car_categories cc ON c.category_id = cc.id
    LEFT JOIN reservations r ON c.id = r.vehicle_id
    ${whereClause.replace('r.agency_id', 'c.agency_id')} ${timeCondition}
    GROUP BY cc.name
    ORDER BY reservations DESC
  `, params);
  
  return {
    popular_vehicles: popularVehicles,
    vehicle_types: vehicleTypes
  };
}

// Get reservation analytics
async function getReservationAnalytics(whereClause, params, timeframe) {
  const timeCondition = `AND r.created_at >= DATE_SUB(NOW(), INTERVAL ${timeframe} DAY)`;
  
  // Reservation trends by month
  const monthlyTrend = await query(`
    SELECT 
      DATE_FORMAT(r.created_at, '%Y-%m') as month,
      COUNT(*) as reservations,
      SUM(r.total_amount) as revenue
    FROM reservations r
    ${whereClause} ${timeCondition}
    GROUP BY DATE_FORMAT(r.created_at, '%Y-%m')
    ORDER BY month
  `, params);
  
  // Average booking duration
  const [bookingStats] = await query(`
    SELECT 
      AVG(DATEDIFF(r.return_date, r.pickup_date)) as avg_duration,
      MIN(DATEDIFF(r.return_date, r.pickup_date)) as min_duration,
      MAX(DATEDIFF(r.return_date, r.pickup_date)) as max_duration
    FROM reservations r
    ${whereClause} ${timeCondition}
  `, params);
  
  return {
    monthly_trend: monthlyTrend,
    booking_stats: bookingStats
  };
}

// Get revenue analytics
async function getRevenueAnalytics(whereClause, params, timeframe) {
  const timeCondition = `AND r.created_at >= DATE_SUB(NOW(), INTERVAL ${timeframe} DAY)`;
  
  // Revenue by payment status
  const revenueByStatus = await query(`
    SELECT 
      r.payment_status,
      COUNT(*) as count,
      SUM(r.total_amount) as total_amount,
      SUM(r.paid_amount) as paid_amount
    FROM reservations r
    ${whereClause} ${timeCondition}
    GROUP BY r.payment_status
  `, params);
  
  // Weekly revenue trend
  const weeklyRevenue = await query(`
    SELECT 
      WEEK(r.created_at) as week,
      YEAR(r.created_at) as year,
      SUM(r.total_amount) as total_revenue,
      SUM(r.paid_amount) as paid_revenue,
      COUNT(*) as reservations
    FROM reservations r
    ${whereClause} ${timeCondition}
    GROUP BY YEAR(r.created_at), WEEK(r.created_at)
    ORDER BY year, week
  `, params);
  
  return {
    revenue_by_status: revenueByStatus,
    weekly_revenue: weeklyRevenue
  };
}"