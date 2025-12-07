import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { verifySessionToken } from '../../../lib/auth';

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
		const userType = searchParams.get('user_type') || session.user_type;

		let whereClause = '';
		let queryParams = [];

		// Build query based on user type
		if (userType === 'driver') {
			// Get driver ID
			const driverResult = await query('SELECT id FROM drivers WHERE user_id = ?', [session.user_id]);
			if (!driverResult.length) {
				return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
			}
			const driverId = driverResult[0].id;
			whereClause = 'WHERE t.driver_id = ?';
			queryParams.push(driverId);
		} else if (userType === 'customer') {
			whereClause = 'WHERE t.user_id = ?';
			queryParams.push(session.user_id);
		} else if (userType === 'admin') {
			whereClause = 'WHERE 1=1'; // Admin can see all trips
		}

		// Add status filter
		if (status !== 'all') {
			whereClause += ` AND t.status = ?`;
			queryParams.push(status);
		}

		// Get trips with related data
		const trips = await query(`
			SELECT 
				t.id,
				t.trip_id,
				t.pickup_location,
				t.destination_location,
				t.scheduled_pickup_time,
				t.actual_pickup_time,
				t.actual_arrival_time,
				t.distance,
				t.fare_amount,
				t.tip_amount,
				t.total_amount,
				t.status,
				t.user_rating,
				t.driver_rating,
				t.passenger_count,
				t.created_at,
				u.first_name as customer_first_name,
				u.last_name as customer_last_name,
				u.email as customer_email,
				d.user_id as driver_user_id,
				du.first_name as driver_first_name,
				du.last_name as driver_last_name,
				c.make as car_make,
				c.model as car_model,
				c.year as car_year
			FROM trips t
			LEFT JOIN users u ON t.user_id = u.id
			LEFT JOIN drivers d ON t.driver_id = d.id
			LEFT JOIN users du ON d.user_id = du.id
			LEFT JOIN cars c ON t.car_id = c.id
			${whereClause}
			ORDER BY t.created_at DESC
			LIMIT ? OFFSET ?
		`, [...queryParams, parseInt(limit), parseInt(offset)]);

		// Get total count
		const [{ total }] = await query(`
			SELECT COUNT(*) as total 
			FROM trips t
			${whereClause}
		`, queryParams);

		// Get status counts
		const statusCounts = await query(`
			SELECT 
				status,
				COUNT(*) as count
			FROM trips t
			${whereClause}
			GROUP BY status
		`, queryParams.slice(0, userType === 'admin' ? 0 : 1)); // Remove status filter for counts

		return NextResponse.json({
			trips: trips.map(trip => ({
				id: trip.id,
				tripId: trip.trip_id,
				pickupLocation: trip.pickup_location,
				destinationLocation: trip.destination_location,
				scheduledPickupTime: trip.scheduled_pickup_time,
				actualPickupTime: trip.actual_pickup_time,
				actualArrivalTime: trip.actual_arrival_time,
				distance: trip.distance,
				fareAmount: parseFloat(trip.fare_amount),
				tipAmount: parseFloat(trip.tip_amount || 0),
				totalAmount: parseFloat(trip.total_amount),
				status: trip.status,
				userRating: trip.user_rating,
				driverRating: trip.driver_rating,
				passengerCount: trip.passenger_count,
				createdAt: trip.created_at,
				customer: {
					firstName: trip.customer_first_name,
					lastName: trip.customer_last_name,
					email: trip.customer_email,
					fullName: `${trip.customer_first_name} ${trip.customer_last_name}`
				},
				driver: trip.driver_user_id ? {
					firstName: trip.driver_first_name,
					lastName: trip.driver_last_name,
					fullName: `${trip.driver_first_name} ${trip.driver_last_name}`
				} : null,
				car: trip.car_make ? {
					make: trip.car_make,
					model: trip.car_model,
					year: trip.car_year,
					fullName: `${trip.car_year} ${trip.car_make} ${trip.car_model}`
				} : null
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
		console.error('GET /api/trips error', e);
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
		const { action, trip_id, rating, review, status } = body;

		if (action === 'update_status' && session.user_type === 'driver') {
			// Driver updating trip status
			const driverResult = await query('SELECT id FROM drivers WHERE user_id = ?', [session.user_id]);
			if (!driverResult.length) {
				return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
			}
			const driverId = driverResult[0].id;

			await query(`
				UPDATE trips 
				SET status = ?, updated_at = NOW()
				WHERE trip_id = ? AND driver_id = ?
			`, [status, trip_id, driverId]);

			return NextResponse.json({ success: true });
		}

		if (action === 'rate_trip') {
			// User or driver rating a trip
			const userType = session.user_type;
			let updateField = '';
			let reviewField = '';
			let whereField = '';

			if (userType === 'driver') {
				updateField = 'driver_rating = ?';
				reviewField = ', driver_review = ?';
				whereField = 'driver_id = (SELECT id FROM drivers WHERE user_id = ?)';
			} else {
				updateField = 'user_rating = ?';
				reviewField = ', user_review = ?';
				whereField = 'user_id = ?';
			}

			await query(`
				UPDATE trips 
				SET ${updateField}${review ? reviewField : ''}, updated_at = NOW()
				WHERE trip_id = ? AND ${whereField}
			`, review ? [rating, review, trip_id, session.user_id] : [rating, trip_id, session.user_id]);

			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
	} catch (e) {
		console.error('POST /api/trips error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}
