import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const range = url.searchParams.get('range') || 'this_month';
    const agencyId = url.searchParams.get('agency_id'); // Filter by specific agency
    const status = url.searchParams.get('status'); // Filter by status
    const search = url.searchParams.get('search'); // Search by customer name or booking ID
    
    const offset = (page - 1) * limit;
    
    // Calculate date range using reservation start_date (business-facing date filter)
    const dateColumn = 'r.start_date';
    let dateFilter = '';
    let dateParams = [];
    
    const today = new Date();
    let startDate, endDate;
    
    switch (range) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'this_week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'last_month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate = lastMonth.toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      case 'this_year':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'last_year':
        startDate = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
        break;
      default:
        // Default to last 30 days
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
    }
    
    if (startDate && endDate) {
      dateFilter = `AND ${dateColumn} BETWEEN ? AND ?`;
      dateParams = [startDate, endDate + ' 23:59:59'];
    }
    
    // Build dynamic WHERE clause
    let whereConditions = ['1=1'];
    let queryParams = [];
    
    if (agencyId) {
      whereConditions.push('r.agency_id = ?');
      queryParams.push(agencyId);
    }
    
    if (status) {
      // Support multiple statuses separated by comma and normalize synonyms (cancelled -> canceled)
      const rawStatuses = status.split(',').map(s => s.trim()).filter(Boolean);
      const normalized = rawStatuses.map(s => (s.toLowerCase() === 'cancelled' ? 'canceled' : s.toLowerCase()));
      const placeholders = normalized.map(() => '?').join(',');
      whereConditions.push(`r.status IN (${placeholders})`);
      queryParams.push(...normalized);
    }
    
    if (search) {
      whereConditions.push('(CONCAT(u.first_name, " ", u.last_name) LIKE ? OR r.reservation_id LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Add date filter params
    queryParams.push(...dateParams);
    
    // Get total count for pagination
    const totalCountResult = await query(`
      SELECT COUNT(*) as total
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE ${whereConditions.join(' AND ')} ${dateFilter}
    `, queryParams);
    
    const totalCount = totalCountResult && totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    
    // Get earnings summary for all agencies
    const earningsSummaryResult = await query(`
      SELECT 
        COALESCE(COUNT(r.reservation_id), 0) as total_bookings,
        COALESCE(COUNT(DISTINCT r.agency_id), 0) as total_agencies,
        COALESCE(SUM(r.total_price), 0) as total_revenue,
        COALESCE(SUM(IFNULL(r.platform_commission, r.total_price * 0.125)), 0) as total_commission,
        COALESCE(SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)), 0) as total_agency_earnings,
        COALESCE(SUM(CASE WHEN r.status = 'completed' THEN r.total_price ELSE 0 END), 0) as completed_revenue,
        COALESCE(SUM(CASE WHEN r.status = 'pending' THEN r.total_price ELSE 0 END), 0) as pending_revenue,
        COALESCE(SUM(CASE WHEN r.status IN ('cancelled','canceled') THEN IFNULL(r.refund_amount, 0) ELSE 0 END), 0) as refunded_amount,
        COALESCE(AVG(r.total_price), 0) as avg_booking_value
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE ${whereConditions.join(' AND ')} ${dateFilter}
    `, queryParams);
    
    console.log('Earnings Summary Result:', earningsSummaryResult);
    const earningsSummary = earningsSummaryResult && earningsSummaryResult.length > 0 ? earningsSummaryResult[0] : null;
    
    // Add pagination params
    queryParams.push(limit, offset);
    
    // Get detailed transactions
    const transactions = await query(`
      SELECT 
        r.reservation_id,
        r.total_price,
        r.deposit_amount,
        r.balance_due,
        r.status,
        r.payment_type,
        r.payment_status,
        r.start_date,
        r.end_date,
        r.total_days,
        r.created_at,
        IFNULL(r.platform_commission, r.total_price * 0.125) as commission,
        IFNULL(r.agency_earnings, r.total_price * 0.875) as agency_net_earnings,
        IFNULL(r.refund_amount, 0) as refund_amount,
        
        -- Customer information
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        
        -- Agency information
        a.business_name as agency_name,
        a.agency_id,
        a.business_email as agency_email,
        a.business_phone as agency_phone,
        a.business_city as agency_city,
        
        -- Vehicle information
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_name,
        av.vehicle_number,
        
        -- Payment information
        p.amount as payment_amount,
        p.method as payment_method,
        p.status as payment_status,
        p.payment_date,
        p.transaction_id
        
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN payments p ON r.reservation_id = p.reservation_id AND p.payment_type IN ('deposit', 'full_payment')
      WHERE ${whereConditions.join(' AND ')} ${dateFilter}
      ORDER BY r.updated_at DESC
      LIMIT ? OFFSET ?
    `, queryParams);
    
    // Get agency breakdown for current filter
    const agencyBreakdown = await query(`
      SELECT 
        a.agency_id,
        a.business_name as agency_name,
        COUNT(r.reservation_id) as bookings_count,
        SUM(r.total_price) as revenue,
        SUM(IFNULL(r.platform_commission, r.total_price * 0.125)) as commission,
        SUM(IFNULL(r.agency_earnings, r.total_price * 0.875)) as net_earnings,
        AVG(r.total_price) as avg_booking_value,
        SUM(CASE WHEN r.status = 'completed' THEN r.total_price ELSE 0 END) as completed_revenue,
        SUM(CASE WHEN r.status IN ('cancelled','canceled') THEN IFNULL(r.refund_amount, 0) ELSE 0 END) as refunds
      FROM agencies a
      LEFT JOIN reservations r ON a.agency_id = r.agency_id
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE ${whereConditions.join(' AND ')} ${dateFilter}
      GROUP BY a.agency_id, a.business_name
      HAVING bookings_count > 0
      ORDER BY revenue DESC
    `, queryParams.slice(0, -2)); // Remove limit and offset params
    
    // Helper function to safely parse numbers
    const safeParseFloat = (value) => {
      if (value === null || value === undefined || value === '' || isNaN(value)) {
        return 0;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Format the data
    const summary = earningsSummary || {
      total_bookings: 0,
      total_agencies: 0,
      total_revenue: 0,
      total_commission: 0,
      total_agency_earnings: 0,
      completed_revenue: 0,
      pending_revenue: 0,
      refunded_amount: 0,
      avg_booking_value: 0
    };

    // Ensure all summary values are valid numbers
    summary.total_bookings = safeParseFloat(summary.total_bookings);
    summary.total_agencies = safeParseFloat(summary.total_agencies);
    summary.total_revenue = safeParseFloat(summary.total_revenue);
    summary.total_commission = safeParseFloat(summary.total_commission);
    summary.total_agency_earnings = safeParseFloat(summary.total_agency_earnings);
    summary.completed_revenue = safeParseFloat(summary.completed_revenue);
    summary.pending_revenue = safeParseFloat(summary.pending_revenue);
    summary.refunded_amount = safeParseFloat(summary.refunded_amount);
    summary.avg_booking_value = safeParseFloat(summary.avg_booking_value);
    
    // Format transactions
    const formattedTransactions = (transactions || []).map(transaction => {
      const totalPrice = safeParseFloat(transaction.total_price);
      const commission = safeParseFloat(transaction.commission);
      const agencyNetEarnings = safeParseFloat(transaction.agency_net_earnings);
      const refundAmount = safeParseFloat(transaction.refund_amount);
      const paymentAmount = safeParseFloat(transaction.payment_amount);
      
      return {
        reservation_id: transaction.reservation_id,
        customer_name: transaction.customer_name || 'N/A',
        customer_email: transaction.customer_email || '',
        customer_phone: transaction.customer_phone || '',
        
        agency_name: transaction.agency_name || 'Direct',
        agency_id: transaction.agency_id,
        agency_email: transaction.agency_email || '',
        agency_city: transaction.agency_city || '',
        
        vehicle_name: transaction.vehicle_name || 'N/A',
        vehicle_number: transaction.vehicle_number || '',
        
        start_date: transaction.start_date ? new Date(transaction.start_date).toLocaleDateString() : 'N/A',
        end_date: transaction.end_date ? new Date(transaction.end_date).toLocaleDateString() : 'N/A',
        total_days: safeParseFloat(transaction.total_days),
        
        total_price: totalPrice,
        commission: commission,
        agency_net_earnings: agencyNetEarnings,
        refund_amount: refundAmount,
        
        payment_amount: paymentAmount,
        payment_method: transaction.payment_method || 'N/A',
        payment_status: transaction.payment_status || 'pending',
        payment_date: transaction.payment_date ? new Date(transaction.payment_date).toLocaleDateString() : '',
        
        status: transaction.status || 'pending',
        payment_type: transaction.payment_type || 'deposit',
        created_at: transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A',
        
        // Formatted currency fields
        total_price_formatted: `$${totalPrice.toFixed(2)}`,
        commission_formatted: `$${commission.toFixed(2)}`,
        agency_net_earnings_formatted: `$${agencyNetEarnings.toFixed(2)}`,
        refund_amount_formatted: `$${refundAmount.toFixed(2)}`
      };
    });
    
    // Format agency breakdown
    const formattedAgencyBreakdown = (agencyBreakdown || []).map(agency => {
      const revenue = safeParseFloat(agency.revenue);
      const commission = safeParseFloat(agency.commission);
      const netEarnings = safeParseFloat(agency.net_earnings);
      const avgBookingValue = safeParseFloat(agency.avg_booking_value);
      const completedRevenue = safeParseFloat(agency.completed_revenue);
      const refunds = safeParseFloat(agency.refunds);
      
      return {
        ...agency,
        revenue: revenue,
        commission: commission,
        net_earnings: netEarnings,
        avg_booking_value: avgBookingValue,
        completed_revenue: completedRevenue,
        refunds: refunds,
        
        // Formatted versions
        revenue_formatted: `$${revenue.toFixed(2)}`,
        commission_formatted: `$${commission.toFixed(2)}`,
        net_earnings_formatted: `$${netEarnings.toFixed(2)}`,
        avg_booking_value_formatted: `$${avgBookingValue.toFixed(2)}`,
        completed_revenue_formatted: `$${completedRevenue.toFixed(2)}`,
        refunds_formatted: `$${refunds.toFixed(2)}`
      };
    });
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      earnings: {
        total: summary.total_revenue,
        thisMonth: summary.total_revenue, // This will be the filtered amount
        commission: summary.total_commission,
        agencyEarnings: summary.total_agency_earnings,
        completedRevenue: summary.completed_revenue,
        pendingRevenue: summary.pending_revenue,
        refundedAmount: summary.refunded_amount,
        avgBookingValue: summary.avg_booking_value,
        
        // Formatted versions
        total_formatted: `$${summary.total_revenue.toFixed(2)}`,
        commission_formatted: `$${summary.total_commission.toFixed(2)}`,
        agency_earnings_formatted: `$${summary.total_agency_earnings.toFixed(2)}`,
        avg_booking_value_formatted: `$${summary.avg_booking_value.toFixed(2)}`
      },
      transactions: formattedTransactions,
      agency_breakdown: formattedAgencyBreakdown,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: totalCount,
        per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      },
      filters: {
        range,
        agency_id: agencyId,
        status,
        search,
        date_range: {
          start: startDate,
          end: endDate.split(' ')[0] // Remove time part
        }
      },
      summary: {
        total_bookings: summary.total_bookings,
        total_agencies: summary.total_agencies,
        date_range: `${startDate} to ${endDate.split(' ')[0]}`
      }
    });
    
  } catch (error) {
    console.error('Error fetching admin earnings:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
