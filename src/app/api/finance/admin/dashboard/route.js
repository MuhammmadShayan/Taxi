import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const dateFrom = url.searchParams.get('from') || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    const dateTo = url.searchParams.get('to') || new Date().toISOString().split('T')[0];
    
    // Platform-wide Revenue Summary
    const [platformSummary] = await query(`
      SELECT 
        COUNT(r.reservation_id) as total_bookings,
        COUNT(DISTINCT r.agency_id) as active_agencies,
        COUNT(DISTINCT r.customer_id) as total_customers,
        
        -- Revenue metrics
        SUM(r.total_price) as total_revenue,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as total_commission,
        SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)) as total_agency_earnings,
        
        -- Payment status breakdown
        SUM(CASE WHEN r.payment_type = 'deposit' AND r.balance_due > 0 THEN r.balance_due ELSE 0 END) as pending_balances,
        SUM(CASE WHEN r.status = 'cancelled' THEN IFNULL(r.refund_amount, 0) ELSE 0 END) as total_refunds,
        
        -- Today's statistics
        COUNT(CASE WHEN DATE(r.created_at) = CURDATE() THEN 1 END) as today_bookings,
        SUM(CASE WHEN DATE(r.created_at) = CURDATE() AND r.status = 'confirmed' THEN r.total_price ELSE 0 END) as today_revenue,
        SUM(CASE WHEN DATE(r.created_at) = CURDATE() AND r.status = 'confirmed' THEN IFNULL(r.platform_commission, r.total_price * 0.125) ELSE 0 END) as today_commission,
        COUNT(CASE WHEN DATE(r.created_at) = CURDATE() AND r.status = 'pending' THEN 1 END) as today_pending,
        
        -- Averages
        AVG(r.total_price) as avg_booking_value,
        AVG(IFNULL(r.platform_commission, r.total_price * 0.125)) as avg_commission
        
      FROM reservations r
      WHERE r.created_at BETWEEN ? AND ?
    `, [dateFrom, dateTo]);
    
    // Vehicle fleet statistics across all agencies
    const [vehicleStats] = await query(`
      SELECT 
        COUNT(DISTINCT av.vehicle_id) as total_vehicles,
        COUNT(DISTINCT r.vehicle_id) as vehicles_with_bookings,
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN r.vehicle_id END) as currently_rented
      FROM agency_vehicles av
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id 
        AND r.created_at BETWEEN ? AND ?
    `, [dateFrom, dateTo]);
    
    // Agency performance breakdown
    const agencyBreakdown = await query(`
      SELECT 
        a.agency_id,
        a.name as agency_name,
        a.email as agency_email,
        a.phone as agency_phone,
        a.city,
        a.commission_rate,
        a.financial_status,
        
        -- Performance metrics
        COUNT(r.reservation_id) as bookings_count,
        SUM(r.total_price) as revenue,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as commission,
        SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)) as agency_earnings,
        AVG(r.total_price) as avg_booking_value,
        
        -- Vehicle count
        COUNT(DISTINCT av.vehicle_id) as vehicle_count,
        
        -- Status breakdown
        COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_bookings,
        SUM(CASE WHEN r.status = 'cancelled' THEN IFNULL(r.refund_amount, 0) ELSE 0 END) as refunds_issued
        
      FROM agencies a
      LEFT JOIN reservations r ON a.agency_id = r.agency_id 
        AND r.created_at BETWEEN ? AND ?
      LEFT JOIN agency_vehicles av ON a.agency_id = av.agency_id
      GROUP BY a.agency_id, a.name, a.email, a.phone, a.city, a.commission_rate, a.financial_status
      HAVING bookings_count > 0 OR vehicle_count > 0
      ORDER BY revenue DESC
    `, [dateFrom, dateTo]);
    
    // Monthly platform trends
    const monthlyTrends = await query(`
      SELECT 
        DATE_FORMAT(r.created_at, '%Y-%m') as month,
        DATE_FORMAT(r.created_at, '%M %Y') as month_name,
        COUNT(r.reservation_id) as bookings,
        SUM(r.total_price) as revenue,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as commission,
        COUNT(DISTINCT r.agency_id) as active_agencies,
        AVG(r.total_price) as avg_booking_value
      FROM reservations r
      WHERE r.created_at >= DATE_SUB(?, INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(r.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, [dateTo]);
    
    // Recent platform-wide transactions
    const recentTransactions = await query(`
      SELECT 
        r.reservation_id,
        r.total_price,
        r.status,
        r.payment_type,
        r.payment_status,
        r.created_at,
        r.start_date,
        r.end_date,
        IFNULL(r.platform_commission, r.total_price * 0.125) as platform_commission,
        IFNULL(r.agency_earnings, r.total_price * 0.875) as agency_earnings,
        
        -- Customer info
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email,
        
        -- Agency info
        a.name as agency_name,
        a.agency_id,
        
        -- Vehicle info
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        av.vehicle_number as license_plate
        
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      ORDER BY r.created_at DESC
      LIMIT 20
    `);
    
    // Payment method analysis
    const paymentMethods = await query(`
      SELECT 
        p.method as payment_method,
        COUNT(*) as count,
        SUM(p.amount) as total_amount,
        AVG(p.amount) as avg_amount
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.reservation_id
      WHERE r.created_at BETWEEN ? AND ?
      GROUP BY p.method
      ORDER BY total_amount DESC
    `, [dateFrom, dateTo]);
    
    // Commission analysis by agency tier
    const commissionAnalysis = await query(`
      SELECT 
        CASE 
          WHEN COUNT(r.reservation_id) >= 50 THEN 'High Volume (50+)'
          WHEN COUNT(r.reservation_id) >= 20 THEN 'Medium Volume (20-49)'
          WHEN COUNT(r.reservation_id) >= 5 THEN 'Low Volume (5-19)'
          ELSE 'New Agency (0-4)'
        END as agency_tier,
        COUNT(DISTINCT r.agency_id) as agency_count,
        SUM(r.total_price) as total_revenue,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as total_commission,
        AVG(IFNULL(r.platform_commission, r.total_price * 0.125)) as avg_commission_per_booking
      FROM reservations r
      JOIN (
        SELECT agency_id, COUNT(*) as booking_count
        FROM reservations 
        WHERE created_at BETWEEN ? AND ?
        GROUP BY agency_id
      ) agency_bookings ON r.agency_id = agency_bookings.agency_id
      WHERE r.created_at BETWEEN ? AND ?
      GROUP BY agency_tier
      ORDER BY total_commission DESC
    `, [dateFrom, dateTo, dateFrom, dateTo]);
    
    // Format the data
    const summary = platformSummary[0] || {};
    const vehicles = vehicleStats[0] || {};
    
    // Calculate utilization and other metrics
    const utilizationPercentage = vehicles.total_vehicles > 0 
      ? Math.round((vehicles.currently_rented / vehicles.total_vehicles) * 100)
      : 0;
    
    const netPlatformRevenue = (summary.total_commission || 0) - (summary.total_commission * 0.029 || 0); // Assuming 2.9% processing fee
    
    // Format recent transactions
    const formattedTransactions = (recentTransactions || []).map(transaction => ({
      ...transaction,
      customer_name: transaction.customer_name || 'N/A',
      agency_name: transaction.agency_name || 'Direct Booking',
      vehicle_display_name: transaction.vehicle_display_name || 'N/A',
      start_date_formatted: new Date(transaction.start_date).toLocaleDateString(),
      end_date_formatted: new Date(transaction.end_date).toLocaleDateString(),
      created_at_formatted: new Date(transaction.created_at).toLocaleDateString(),
      total_price_formatted: `$${parseFloat(transaction.total_price || 0).toFixed(2)}`,
      platform_commission_formatted: `$${parseFloat(transaction.platform_commission || 0).toFixed(2)}`,
      status_display: transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1) || 'Unknown'
    }));
    
    // Format agency breakdown
    const formattedAgencyBreakdown = (agencyBreakdown || []).map(agency => ({
      ...agency,
      revenue_formatted: `$${parseFloat(agency.revenue || 0).toFixed(2)}`,
      commission_formatted: `$${parseFloat(agency.commission || 0).toFixed(2)}`,
      agency_earnings_formatted: `$${parseFloat(agency.agency_earnings || 0).toFixed(2)}`,
      avg_booking_value_formatted: `$${parseFloat(agency.avg_booking_value || 0).toFixed(2)}`,
      refunds_issued_formatted: `$${parseFloat(agency.refunds_issued || 0).toFixed(2)}`
    }));
    
    return NextResponse.json({
      success: true,
      platform_summary: {
        total_bookings: summary.total_bookings || 0,
        active_agencies: summary.active_agencies || 0,
        total_customers: summary.total_customers || 0,
        total_vehicles: vehicles.total_vehicles || 0,
        
        // Revenue metrics
        total_revenue: `$${parseFloat(summary.total_revenue || 0).toFixed(2)}`,
        total_commission: `$${parseFloat(summary.total_commission || 0).toFixed(2)}`,
        total_agency_earnings: `$${parseFloat(summary.total_agency_earnings || 0).toFixed(2)}`,
        net_platform_revenue: `$${parseFloat(netPlatformRevenue).toFixed(2)}`,
        
        // Today's performance
        today_bookings: summary.today_bookings || 0,
        today_revenue: `$${parseFloat(summary.today_revenue || 0).toFixed(2)}`,
        today_commission: `$${parseFloat(summary.today_commission || 0).toFixed(2)}`,
        today_pending: summary.today_pending || 0,
        
        // Fleet metrics
        vehicle_utilization: utilizationPercentage,
        currently_rented: vehicles.currently_rented || 0,
        available_vehicles: (vehicles.total_vehicles || 0) - (vehicles.currently_rented || 0),
        
        // Averages
        avg_booking_value: `$${parseFloat(summary.avg_booking_value || 0).toFixed(2)}`,
        avg_commission: `$${parseFloat(summary.avg_commission || 0).toFixed(2)}`,
        
        // Other metrics
        pending_balances: `$${parseFloat(summary.pending_balances || 0).toFixed(2)}`,
        total_refunds: `$${parseFloat(summary.total_refunds || 0).toFixed(2)}`
      },
      agency_breakdown: formattedAgencyBreakdown,
      recent_bookings: formattedTransactions,
      monthly_trends: monthlyTrends || [],
      payment_methods: paymentMethods || [],
      commission_analysis: commissionAnalysis || [],
      period: { from: dateFrom, to: dateTo }
    });
    
  } catch (error) {
    console.error('Admin finance dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin finance data', details: error.message },
      { status: 500 }
    );
  }
}
