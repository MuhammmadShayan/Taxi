import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? verifySessionToken(token) : null;
		if (!session || session.user_type !== 'driver') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get driver ID from user session
		const driverResult = await query('SELECT id FROM drivers WHERE user_id = ?', [session.user_id]);
		if (!driverResult.length) {
			return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
		}
		const driverId = driverResult[0].id;

		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'week'; // week, month, quarter, year
		const limit = searchParams.get('limit') || '10';
		const offset = searchParams.get('offset') || '0';

		// Get earnings data based on period
		let dateFilter = '';
		switch (period) {
			case 'today':
				dateFilter = 'AND earning_date = CURDATE()';
				break;
			case 'week':
				dateFilter = 'AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
				break;
			case 'month':
				dateFilter = 'AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
				break;
			case 'quarter':
				dateFilter = 'AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)';
				break;
			case 'year':
				dateFilter = 'AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
				break;
			default:
				dateFilter = '';
		}

		// Get detailed earnings
		const earnings = await query(`
			SELECT 
				e.id,
				e.earning_type,
				e.gross_amount,
				e.platform_fee,
				e.net_amount,
				e.currency,
				e.earning_date,
				e.status,
				e.description,
				t.trip_id,
				t.pickup_location,
				t.destination_location,
				t.distance
			FROM earnings e
			LEFT JOIN trips t ON e.trip_id = t.id
			WHERE e.driver_id = ? ${dateFilter}
			ORDER BY e.earning_date DESC, e.created_at DESC
			LIMIT ? OFFSET ?
		`, [driverId, parseInt(limit), parseInt(offset)]);

		// Get earnings summary for the period
		const summary = await query(`
			SELECT 
				SUM(gross_amount) as total_gross,
				SUM(platform_fee) as total_fees,
				SUM(net_amount) as total_net,
				COUNT(*) as total_transactions,
				COUNT(DISTINCT earning_date) as active_days,
				AVG(net_amount) as avg_per_transaction
			FROM earnings 
			WHERE driver_id = ? AND status = 'processed' ${dateFilter}
		`, [driverId]);

		// Get earnings breakdown by type
		const breakdown = await query(`
			SELECT 
				earning_type,
				SUM(net_amount) as amount,
				COUNT(*) as count
			FROM earnings 
			WHERE driver_id = ? AND status = 'processed' ${dateFilter}
			GROUP BY earning_type
		`, [driverId]);

		// Get total count
		const [{ total }] = await query(`
			SELECT COUNT(*) as total 
			FROM earnings 
			WHERE driver_id = ? ${dateFilter}
		`, [driverId]);

		return NextResponse.json({
			earnings: earnings.map(earning => ({
				id: earning.id,
				type: earning.earning_type,
				grossAmount: parseFloat(earning.gross_amount),
				platformFee: parseFloat(earning.platform_fee),
				netAmount: parseFloat(earning.net_amount),
				currency: earning.currency,
				date: earning.earning_date,
				status: earning.status,
				description: earning.description,
				trip: earning.trip_id ? {
					tripId: earning.trip_id,
					pickupLocation: earning.pickup_location,
					destinationLocation: earning.destination_location,
					distance: earning.distance
				} : null
			})),
			summary: {
				totalGross: summary[0]?.total_gross || 0,
				totalFees: summary[0]?.total_fees || 0,
				totalNet: summary[0]?.total_net || 0,
				totalTransactions: summary[0]?.total_transactions || 0,
				activeDays: summary[0]?.active_days || 0,
				avgPerTransaction: summary[0]?.avg_per_transaction || 0
			},
			breakdown: breakdown.map(item => ({
				type: item.earning_type,
				amount: parseFloat(item.amount),
				count: item.count
			})),
			total: total || 0,
			has_more: (parseInt(offset) + parseInt(limit)) < (total || 0),
			period: period
		});
	} catch (e) {
		console.error('GET /api/driver/earnings error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}