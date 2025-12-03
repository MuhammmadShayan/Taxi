import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? verifySessionToken(token) : null;
		if (!session || session.user_type !== 'customer') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user_id;

		// Get comprehensive user statistics
		const statsQueries = await Promise.all([
			// Bookings statistics
			query('SELECT COUNT(*) AS total_bookings FROM bookings WHERE user_id = ?', [userId]),
			query('SELECT COUNT(*) AS active_bookings FROM bookings WHERE user_id = ? AND status IN ("pending", "confirmed", "active")', [userId]),
			query('SELECT COUNT(*) AS completed_bookings FROM bookings WHERE user_id = ? AND status = "completed"', [userId]),
			query('SELECT COUNT(*) AS cancelled_bookings FROM bookings WHERE user_id = ? AND status = "cancelled"', [userId]),
			
			// Trips statistics
			query('SELECT COUNT(*) AS total_trips FROM trips WHERE user_id = ?', [userId]),
			query('SELECT COUNT(*) AS completed_trips FROM trips WHERE user_id = ? AND status = "completed"', [userId]),
			query('SELECT AVG(user_rating) AS avg_rating_given FROM trips WHERE user_id = ? AND user_rating IS NOT NULL', [userId]),
			query('SELECT AVG(driver_rating) AS avg_rating_received FROM trips WHERE user_id = ? AND driver_rating IS NOT NULL', [userId]),
			
			// Financial statistics
			query('SELECT SUM(total_amount) AS total_spent FROM bookings WHERE user_id = ? AND payment_status = "paid"', [userId]),
			query('SELECT SUM(total_amount) AS monthly_spent FROM bookings WHERE user_id = ? AND payment_status = "paid" AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)', [userId]),
			query('SELECT COUNT(*) AS saved_cars FROM wishlist WHERE user_id = ? AND item_type = "car"', [userId]),
			
			// Reviews statistics
			query('SELECT COUNT(*) AS reviews_given FROM trips WHERE user_id = ? AND user_review IS NOT NULL', [userId]),
			query('SELECT COUNT(*) AS reviews_received FROM trips WHERE user_id = ? AND driver_review IS NOT NULL', [userId]),
			
			// Recent activity
			query('SELECT COUNT(*) AS bookings_this_month FROM bookings WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)', [userId]),
			query('SELECT COUNT(*) AS trips_this_week FROM trips WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)', [userId]),
			
			// Wishlist
			query('SELECT COUNT(*) AS wishlist_items FROM wishlist WHERE user_id = ?', [userId]),
			query('SELECT COUNT(*) AS wishlist_cars FROM wishlist WHERE user_id = ? AND item_type = "car"', [userId]),
			query('SELECT COUNT(*) AS wishlist_destinations FROM wishlist WHERE user_id = ? AND item_type = "destination"', [userId])
		]);

		// Extract results
		const [
			[{ total_bookings }],
			[{ active_bookings }],
			[{ completed_bookings }],
			[{ cancelled_bookings }],
			[{ total_trips }],
			[{ completed_trips }],
			[{ avg_rating_given }],
			[{ avg_rating_received }],
			[{ total_spent }],
			[{ monthly_spent }],
			[{ saved_cars }],
			[{ reviews_given }],
			[{ reviews_received }],
			[{ bookings_this_month }],
			[{ trips_this_week }],
			[{ wishlist_items }],
			[{ wishlist_cars }],
			[{ wishlist_destinations }]
		] = statsQueries;

		// Calculate derived statistics
		const bookingCompletionRate = total_bookings > 0 ? Math.round((completed_bookings / total_bookings) * 100) : 0;
		const tripCompletionRate = total_trips > 0 ? Math.round((completed_trips / total_trips) * 100) : 0;
		const monthlyGrowth = total_bookings > 0 ? Math.round((bookings_this_month / total_bookings) * 100) : 0;

		return NextResponse.json({
			// Main stats
			totalBooking: total_bookings || 0,
			total_bookings: total_bookings || 0,
			active_bookings: active_bookings || 0,
			completed_bookings: completed_bookings || 0,
			cancelled_bookings: cancelled_bookings || 0,
			
			// Trips
			totalTravel: total_trips || 0,
			total_trips: total_trips || 0,
			completed_trips: completed_trips || 0,
			
			// Reviews
			reviews: reviews_given || 0,
			total_reviews: reviews_given || 0,
			reviews_given: reviews_given || 0,
			reviews_received: reviews_received || 0,
			avg_rating_given: avg_rating_given ? parseFloat(avg_rating_given).toFixed(1) : '0.0',
			avg_rating_received: avg_rating_received ? parseFloat(avg_rating_received).toFixed(1) : '0.0',
			
			// Financial
			total_spent: total_spent || 0,
			monthly_spent: monthly_spent || 0,
			
			// Wishlist
			wishlist: wishlist_items || 0,
			wishlist_items: wishlist_items || 0,
			wishlist_cars: wishlist_cars || 0,
			wishlist_destinations: wishlist_destinations || 0,
			saved_cars: saved_cars || 0,
			
			// Recent activity
			bookings_this_month: bookings_this_month || 0,
			trips_this_week: trips_this_week || 0,
			
			// Derived metrics
			booking_completion_rate: bookingCompletionRate,
			trip_completion_rate: tripCompletionRate,
			monthly_growth: monthlyGrowth,
			
			// Growth indicators for UI
			booking_change: bookings_this_month > 0 ? `+${bookings_this_month} this month` : 'No bookings this month',
			review_change: reviews_given > 0 ? `+${Math.min(reviews_given, 3)} new` : 'No reviews yet',
			wishlist_change: wishlist_items > 0 ? `+${Math.min(wishlist_items, 5)} added` : 'No items saved',
			spending_change: monthly_spent > 0 ? `+${Math.round((monthly_spent / (total_spent || 1)) * 100)}% increase` : 'No spending this month'
		});
	} catch (e) {
		console.error('GET /api/user/stats error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}