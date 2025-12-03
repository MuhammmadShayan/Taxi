import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.user_type !== 'agency_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get agency ID for this user
    const agencyRows = await query(
      'SELECT agency_id FROM agencies WHERE user_id = ?',
      [decoded.user_id]
    );

    if (!agencyRows || agencyRows.length === 0) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    const agencyId = agencyRows[0].agency_id;

    // Get URL parameters for date filtering
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    let dateFilter = '';
    let queryParams = [agencyId];

    if (startDate && endDate) {
      dateFilter = 'AND r.start_date BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    // Get earnings summary
    const earningsSummary = await query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN r.status = 'completed' THEN r.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN r.status = 'completed' THEN r.amount_paid ELSE 0 END) as total_paid,
        SUM(CASE WHEN r.status = 'pending' THEN r.total_price ELSE 0 END) as pending_revenue,
        AVG(CASE WHEN r.status = 'completed' THEN r.total_price ELSE NULL END) as avg_booking_value
      FROM reservations r
      WHERE r.agency_id = ? ${dateFilter}
    `, queryParams);

    // Get recent transactions
    const recentTransactions = await query(`
      SELECT 
        r.reservation_id,
        r.total_price,
        r.amount_paid,
        r.status,
        r.start_date,
        r.end_date,
        r.created_at,
        u.first_name,
        u.last_name,
        v.make,
        v.model
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      WHERE r.agency_id = ? ${dateFilter}
      ORDER BY r.created_at DESC
      LIMIT 20
    `, queryParams);

    // Format the data
    const summary = earningsSummary[0] || {
      total_bookings: 0,
      total_revenue: 0,
      total_paid: 0,
      pending_revenue: 0,
      avg_booking_value: 0
    };

    const transactions = (recentTransactions || []).map(transaction => ({
      ...transaction,
      customer_name: `${transaction.first_name} ${transaction.last_name}`,
      vehicle_name: `${transaction.brand} ${transaction.model}`,
      start_date_formatted: new Date(transaction.start_date).toLocaleDateString(),
      end_date_formatted: new Date(transaction.end_date).toLocaleDateString(),
      created_at_formatted: new Date(transaction.created_at).toLocaleDateString(),
      total_price_formatted: `$${parseFloat(transaction.total_price).toFixed(2)}`,
      amount_paid_formatted: `$${parseFloat(transaction.amount_paid).toFixed(2)}`
    }));

    return NextResponse.json({
      success: true,
      summary: {
        total_bookings: summary.total_bookings,
        total_revenue: `$${parseFloat(summary.total_revenue || 0).toFixed(2)}`,
        total_paid: `$${parseFloat(summary.total_paid || 0).toFixed(2)}`,
        pending_revenue: `$${parseFloat(summary.pending_revenue || 0).toFixed(2)}`,
        avg_booking_value: `$${parseFloat(summary.avg_booking_value || 0).toFixed(2)}`
      },
      transactions
    });

  } catch (error) {
    console.error('Error fetching agency earnings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
