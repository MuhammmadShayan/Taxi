import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? verifySessionToken(token) : null;
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status') || 'all';
		const limit = searchParams.get('limit') || '10';
		const offset = searchParams.get('offset') || '0';
		const userType = session.user_type;

		let whereClause = '';
		let queryParams = [];

		// Build query based on user type
		if (userType === 'customer') {
			whereClause = 'WHERE b.user_id = ?';
			queryParams.push(session.user_id);
		} else if (userType === 'admin') {
			whereClause = 'WHERE 1=1'; // Admin can see all bookings
		} else {
			return NextResponse.json({ error: 'Invalid user type for bookings' }, { status: 403 });
		}

		// Add status filter
		if (status !== 'all') {
			whereClause += ` AND b.status = ?`;
			queryParams.push(status);
		}

		// Get bookings with related data
		const bookings = await query(`
			SELECT 
				b.id,
				b.booking_id,
				b.pickup_location,
				b.dropoff_location,
				b.pickup_date,
				b.pickup_time,
				b.return_date,
				b.return_time,
				b.duration_days,
				b.base_price,
				b.taxes,
				b.fees,
				b.total_amount,
				b.currency,
				b.status,
				b.payment_status,
				b.cancellation_reason,
				b.special_requests,
				b.customer_rating,
				b.customer_review,
				b.created_at,
				c.make as car_make,
				c.model as car_model,
				c.year as car_year,
				c.images as car_images,
				c.price_per_day,
				u.first_name as customer_first_name,
				u.last_name as customer_last_name,
				u.email as customer_email
			FROM bookings b
			LEFT JOIN cars c ON b.car_id = c.id
			LEFT JOIN users u ON b.user_id = u.id
			${whereClause}
			ORDER BY b.created_at DESC
			LIMIT ? OFFSET ?
		`, [...queryParams, parseInt(limit), parseInt(offset)]);

		// Get total count
		const [{ total }] = await query(`
			SELECT COUNT(*) as total 
			FROM bookings b
			${whereClause}
		`, queryParams);

		// Get status counts for the user
		const statusCounts = await query(`
			SELECT 
				status,
				COUNT(*) as count
			FROM bookings b
			${whereClause.replace(/AND b\.status = \?/, '')} -- Remove status filter for counts
			GROUP BY status
		`, queryParams.slice(0, userType === 'admin' ? 0 : 1)); // Remove status param for counts

		// Get recent activity for dashboard
		const recentBookings = await query(`
			SELECT 
				b.booking_id,
				b.pickup_location,
				b.dropoff_location,
				b.pickup_date,
				b.total_amount,
				b.status,
				c.make as car_make,
				c.model as car_model
			FROM bookings b
			LEFT JOIN cars c ON b.car_id = c.id
			${whereClause}
			ORDER BY b.created_at DESC
			LIMIT 5
		`, queryParams.slice(0, userType === 'admin' ? 0 : 1));

		return NextResponse.json({
			bookings: bookings.map(booking => ({
				id: booking.id,
				bookingId: booking.booking_id,
				service: `${booking.car_make} ${booking.car_model}`,
				pickupLocation: booking.pickup_location,
				dropoffLocation: booking.dropoff_location,
				pickupDate: booking.pickup_date,
				pickupTime: booking.pickup_time,
				returnDate: booking.return_date,
				returnTime: booking.return_time,
				durationDays: booking.duration_days,
				amount: parseFloat(booking.total_amount),
				currency: booking.currency,
				status: booking.status,
				paymentStatus: booking.payment_status,
				cancellationReason: booking.cancellation_reason,
				specialRequests: booking.special_requests,
				customerRating: booking.customer_rating,
				customerReview: booking.customer_review,
				createdAt: booking.created_at,
				car: {
					make: booking.car_make,
					model: booking.car_model,
					year: booking.car_year,
					images: booking.car_images ? JSON.parse(booking.car_images) : [],
					pricePerDay: booking.price_per_day
				},
				customer: userType === 'admin' ? {
					firstName: booking.customer_first_name,
					lastName: booking.customer_last_name,
					email: booking.customer_email,
					fullName: `${booking.customer_first_name} ${booking.customer_last_name}`
				} : null
			})),
			recentBookings: recentBookings.map(booking => ({
				bookingId: booking.booking_id,
				service: `${booking.car_make} ${booking.car_model}`,
				date: booking.pickup_date,
				status: booking.status,
				amount: parseFloat(booking.total_amount),
				location: booking.pickup_location
			})),
			statusCounts: statusCounts.reduce((acc, item) => {
				acc[item.status] = item.count;
				return acc;
			}, {}),
			total: total || 0,
			has_more: (parseInt(offset) + parseInt(limit)) < (total || 0),
			current_status: status,
			user_type: userType
		});
	} catch (e) {
		console.error('GET /api/user/bookings error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? verifySessionToken(token) : null;
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { action, booking_id, rating, review, cancellation_reason } = body;

		if (action === 'rate_booking') {
			// User rating a booking
			await query(`
				UPDATE bookings 
				SET customer_rating = ?, customer_review = ?, updated_at = NOW()
				WHERE booking_id = ? AND user_id = ?
			`, [rating, review || null, booking_id, session.user_id]);

			return NextResponse.json({ success: true });
		}

		if (action === 'cancel_booking') {
			// User cancelling a booking
			await query(`
				UPDATE bookings 
				SET status = 'cancelled', cancellation_reason = ?, updated_at = NOW()
				WHERE booking_id = ? AND user_id = ? AND status IN ('pending', 'confirmed')
			`, [cancellation_reason || 'Cancelled by customer', booking_id, session.user_id]);

			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
	} catch (e) {
		console.error('POST /api/user/bookings error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}