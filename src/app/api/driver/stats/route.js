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

		// Get comprehensive driver statistics
		const statsQueries = await Promise.all([
			// Trip statistics
			query('SELECT COUNT(*) AS total_trips FROM trips WHERE driver_id = ?', [driverId]),
			query('SELECT COUNT(*) AS active_trips FROM trips WHERE driver_id = ? AND status IN ("pending", "accepted", "in_progress")', [driverId]),
			query('SELECT COUNT(*) AS completed_trips FROM trips WHERE driver_id = ? AND status = "completed"', [driverId]),
			query('SELECT COUNT(*) AS cancelled_trips FROM trips WHERE driver_id = ? AND status = "cancelled"', [driverId]),
			query('SELECT COUNT(*) AS pending_trips FROM trips WHERE driver_id = ? AND status = "pending"', [driverId]),
			query('SELECT COUNT(*) AS accepted_trips FROM trips WHERE driver_id = ? AND status = "accepted"', [driverId]),
			query('SELECT COUNT(*) AS in_progress_trips FROM trips WHERE driver_id = ? AND status = "in_progress"', [driverId]),
			
			// Earnings statistics
			query('SELECT SUM(net_amount) AS total_earnings FROM earnings WHERE driver_id = ? AND status = "processed"', [driverId]),
			query('SELECT SUM(net_amount) AS today_earnings FROM earnings WHERE driver_id = ? AND status = "processed" AND earning_date = CURDATE()', [driverId]),
			query('SELECT SUM(net_amount) AS week_earnings FROM earnings WHERE driver_id = ? AND status = "processed" AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)', [driverId]),
			query('SELECT SUM(net_amount) AS month_earnings FROM earnings WHERE driver_id = ? AND status = "processed" AND earning_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)', [driverId]),
			query('SELECT SUM(net_amount) AS available_balance FROM earnings WHERE driver_id = ? AND status = "processed" AND earning_id NOT IN (SELECT earning_id FROM payouts WHERE status = "completed")', [driverId]),
			
			// Rating and reviews
			query('SELECT AVG(driver_rating) AS avg_rating FROM trips WHERE driver_id = ? AND driver_rating IS NOT NULL', [driverId]),
			query('SELECT COUNT(*) AS total_reviews FROM trips WHERE driver_id = ? AND driver_review IS NOT NULL', [driverId]),
			query('SELECT COUNT(*) AS five_star_reviews FROM trips WHERE driver_id = ? AND driver_rating = 5', [driverId]),
			
			// Time and activity
			query('SELECT SUM(trip_duration) AS total_hours_driven FROM trips WHERE driver_id = ? AND status = "completed" AND trip_duration IS NOT NULL', [driverId]),
			query('SELECT SUM(trip_duration) AS weekly_hours FROM trips WHERE driver_id = ? AND status = "completed" AND trip_duration IS NOT NULL AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)', [driverId]),
			query('SELECT SUM(distance) AS total_distance FROM trips WHERE driver_id = ? AND status = "completed"', [driverId]),
			
			// Recent activity
			query('SELECT COUNT(*) AS trips_today FROM trips WHERE driver_id = ? AND DATE(created_at) = CURDATE()', [driverId]),
			query('SELECT COUNT(*) AS trips_this_week FROM trips WHERE driver_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)', [driverId]),
			query('SELECT COUNT(*) AS completed_this_week FROM trips WHERE driver_id = ? AND status = "completed" AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)', [driverId]),
			
			// Payouts
			query('SELECT COUNT(*) AS total_payouts FROM payouts WHERE driver_id = ?', [driverId]),
			query('SELECT COUNT(*) AS pending_payouts FROM payouts WHERE driver_id = ? AND status = "pending"', [driverId]),
			query('SELECT SUM(net_amount) AS total_paid_out FROM payouts WHERE driver_id = ? AND status = "completed"', [driverId])
		]);

		// Extract results
		const [
			[{ total_trips }],
			[{ active_trips }],
			[{ completed_trips }],
			[{ cancelled_trips }],
			[{ pending_trips }],
			[{ accepted_trips }],
			[{ in_progress_trips }],
			[{ total_earnings }],
			[{ today_earnings }],
			[{ week_earnings }],
			[{ month_earnings }],
			[{ available_balance }],
			[{ avg_rating }],
			[{ total_reviews }],
			[{ five_star_reviews }],
			[{ total_hours_driven }],
			[{ weekly_hours }],
			[{ total_distance }],
			[{ trips_today }],
			[{ trips_this_week }],
			[{ completed_this_week }],
			[{ total_payouts }],
			[{ pending_payouts }],
			[{ total_paid_out }]
		] = statsQueries;

		// Calculate derived statistics
		const completionRate = total_trips > 0 ? Math.round((completed_trips / total_trips) * 100) : 0;
		const weeklyGrowth = total_trips > 0 ? Math.round((trips_this_week / total_trips) * 100) : 0;
		const averageEarningsPerTrip = completed_trips > 0 ? (total_earnings / completed_trips) : 0;
		const hoursInMinutes = total_hours_driven || 0;
		const hoursFormatted = Math.round(hoursInMinutes / 60); // Convert minutes to hours
		const weeklyHoursFormatted = Math.round((weekly_hours || 0) / 60);

		return NextResponse.json({
			// Trip statistics
			totalTrips: total_trips || 0,
			total_trips: total_trips || 0,
			activeTrips: active_trips || 0,
			active_trips: active_trips || 0,
			completedTrips: completed_trips || 0,
			completed_trips: completed_trips || 0,
			cancelledTrips: cancelled_trips || 0,
			cancelled_trips: cancelled_trips || 0,
			pending_trips: pending_trips || 0,
			accepted_trips: accepted_trips || 0,
			in_progress_trips: in_progress_trips || 0,
			
			// Earnings
			totalEarnings: total_earnings || 0,
			total_earnings: total_earnings || 0,
			todayEarnings: today_earnings || 0,
			today_earnings: today_earnings || 0,
			weekEarnings: week_earnings || 0,
			week_earnings: week_earnings || 0,
			monthEarnings: month_earnings || 0,
			month_earnings: month_earnings || 0,
			availableBalance: available_balance || 0,
			available_balance: available_balance || 0,
			
			// Rating and reviews
			rating: avg_rating ? parseFloat(avg_rating).toFixed(1) : '0.0',
			avg_rating: avg_rating ? parseFloat(avg_rating).toFixed(1) : '0.0',
			total_reviews: total_reviews || 0,
			five_star_reviews: five_star_reviews || 0,
			
			// Time and distance
			totalHoursDriven: hoursFormatted,
			total_hours_driven: hoursFormatted,
			weekly_hours: weeklyHoursFormatted,
			total_distance: total_distance || 0,
			
			// Recent activity
			trips_today: trips_today || 0,
			trips_this_week: trips_this_week || 0,
			completed_this_week: completed_this_week || 0,
			
			// Payouts
			total_payouts: total_payouts || 0,
			pending_payouts: pending_payouts || 0,
			total_paid_out: total_paid_out || 0,
			
			// Derived metrics
			completion_rate: completionRate,
			weekly_growth: weeklyGrowth,
			average_earnings_per_trip: averageEarningsPerTrip,
			
			// Growth indicators for UI
			trip_change: trips_this_week > 0 ? `+${trips_this_week} this week` : 'No trips this week',
			earning_change: week_earnings > 0 ? `+$${week_earnings} this week` : 'No earnings this week',
			rating_change: avg_rating ? `+${(parseFloat(avg_rating) - 4.0).toFixed(1)} points` : 'No rating yet',
			hours_change: weekly_hours > 0 ? `+${weeklyHoursFormatted}h this week` : 'No hours logged'
		});
	} catch (e) {
		console.error('GET /api/driver/stats error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}