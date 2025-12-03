import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request) {
  try {
    // Extract agency_id from session/headers (you may need to implement session handling)
    const url = new URL(request.url);
    const agencyId = url.searchParams.get('agency_id') || 1; // Default for testing
    const dateFrom = url.searchParams.get('from') || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    const dateTo = url.searchParams.get('to') || new Date().toISOString().split('T')[0];
    
    // Revenue Summary with comprehensive financial data
    const [revenueSummary] = await query(`
      SELECT 
        COUNT(r.reservation_id) as total_bookings,
        SUM(r.total_price) as total_revenue,
        SUM(CASE WHEN r.payment_type = 'deposit' AND r.balance_due > 0 THEN r.balance_due ELSE 0 END) as pending_balances,
        SUM(CASE WHEN r.status = 'cancelled' THEN IFNULL(r.refund_amount, 0) ELSE 0 END) as total_refunds,
        SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)) as net_earnings,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as total_commission,
        AVG(r.total_price) as avg_booking_value,
        
        -- Today's statistics
        COUNT(CASE WHEN DATE(r.created_at) = CURDATE() THEN 1 END) as today_bookings,
        SUM(CASE WHEN DATE(r.created_at) = CURDATE() AND r.status = 'confirmed' THEN r.total_price ELSE 0 END) as today_revenue,
        COUNT(CASE WHEN DATE(r.created_at) = CURDATE() AND r.status = 'pending' THEN 1 END) as today_pending,
        
        -- Vehicle utilization
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN 1 END) as active_bookings,
        COUNT(DISTINCT r.vehicle_id) as vehicles_used
      FROM reservations r
      WHERE r.agency_id = ? AND r.created_at BETWEEN ? AND ?
    `, [agencyId, dateFrom, dateTo]);
    
    // Monthly Trends for the last 12 months
    const monthlyTrends = await query(`
      SELECT 
        DATE_FORMAT(r.created_at, '%Y-%m') as month,
        DATE_FORMAT(r.created_at, '%M %Y') as month_name,
        SUM(r.total_price) as revenue,
        COUNT(r.reservation_id) as bookings,
        SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)) as net_earnings,
        AVG(r.total_price) as avg_booking_value
      FROM reservations r
      WHERE r.agency_id = ? AND r.created_at >= DATE_SUB(?, INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(r.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, [agencyId, dateTo]);
    
    // Recent Transactions with detailed information
    const recentTransactions = await query(`
      SELECT 
        r.reservation_id,
        r.total_price,
        r.deposit_amount,
        r.balance_due,
        r.status,
        r.payment_type,
        r.payment_status,
        r.created_at,
        r.start_date,
        r.end_date,
        r.total_days,
        IFNULL(r.agency_earnings, r.total_price * 0.875) as agency_earnings,
        IFNULL(r.platform_commission, r.total_price * 0.125) as platform_commission,
        
        -- Customer information
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        
        -- Vehicle information
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        av.vehicle_number as license_plate,
        
        -- Payment information
        p.amount as payment_amount,
        p.status as payment_status,
        p.method as payment_method,
        p.payment_date
        
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN vehicles v ON av.vehicle_id = v.id
      LEFT JOIN payments p ON r.reservation_id = p.reservation_id AND p.payment_type IN ('deposit', 'full_payment')
      WHERE r.agency_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [agencyId]);
    
    // Payment method breakdown
    const paymentMethods = await query(`
      SELECT 
        p.method as payment_method,
        COUNT(*) as count,
        SUM(p.amount) as total_amount
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.reservation_id
      WHERE r.agency_id = ? AND r.created_at BETWEEN ? AND ?
      GROUP BY p.method
    `, [agencyId, dateFrom, dateTo]);
    
    // Vehicle performance
    const vehicleStats = await query(`
      SELECT 
        COUNT(DISTINCT av.vehicle_id) as total_vehicles,
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN r.vehicle_id END) as rented_vehicles
      FROM agency_vehicles av
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id 
        AND r.created_at BETWEEN ? AND ?
        AND r.agency_id = ?
      WHERE av.agency_id = ?
    `, [dateFrom, dateTo, agencyId, agencyId]);
    
    // Format the data
    const summary = revenueSummary[0] || {};
    const vehicleData = vehicleStats[0] || {};
    
    // Calculate utilization percentage
    const utilizationPercentage = vehicleData.total_vehicles > 0 
      ? Math.round((vehicleData.rented_vehicles / vehicleData.total_vehicles) * 100)
      : 0;
    
    // Format transactions with proper date formatting and currency
    const formattedTransactions = (recentTransactions || []).map(transaction => ({
      ...transaction,
      customer_name: transaction.customer_name || 'N/A',
      vehicle_display_name: transaction.vehicle_display_name || 'N/A',
      start_date_formatted: new Date(transaction.start_date).toLocaleDateString(),
      end_date_formatted: new Date(transaction.end_date).toLocaleDateString(),
      created_at_formatted: new Date(transaction.created_at).toLocaleDateString(),
      total_price_formatted: `$${parseFloat(transaction.total_price || 0).toFixed(2)}`,
      agency_earnings_formatted: `$${parseFloat(transaction.agency_earnings || 0).toFixed(2)}`,
      status_display: transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1) || 'Unknown'
    }));
    
    return NextResponse.json({
      success: true,
      statistics: {
        total_bookings: summary.total_bookings || 0,
        total_vehicles: vehicleData.total_vehicles || 0,
        total_revenue: parseFloat(summary.total_revenue || 0).toFixed(2),
        net_earnings: parseFloat(summary.net_earnings || 0).toFixed(2),
        pending_balances: parseFloat(summary.pending_balances || 0).toFixed(2),
        total_refunds: parseFloat(summary.total_refunds || 0).toFixed(2),
        total_commission: parseFloat(summary.total_commission || 0).toFixed(2),
        avg_booking_value: parseFloat(summary.avg_booking_value || 0).toFixed(2),
        
        // Today's stats
        today_bookings: summary.today_bookings || 0,
        today_revenue: parseFloat(summary.today_revenue || 0).toFixed(2),
        today_pending: summary.today_pending || 0,
        
        // Vehicle stats
        available_vehicles: (vehicleData.total_vehicles || 0) - (vehicleData.rented_vehicles || 0),
        rented_vehicles: vehicleData.rented_vehicles || 0,
        vehicle_utilization: utilizationPercentage
      },
      recent_bookings: formattedTransactions,
      monthly_trends: monthlyTrends || [],
      payment_methods: paymentMethods || [],
      period: { from: dateFrom, to: dateTo }
    });
    
  } catch (error) {
    console.error('Agency finance dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance data', details: error.message },
      { status: 500 }
    );
  }
}
