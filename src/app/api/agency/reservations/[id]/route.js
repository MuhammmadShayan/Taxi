import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Verify token from session cookie
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !['agency_owner', 'agency_admin', 'driver'].includes(decoded.user_type)) {
      return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    // Resolve agency_id (prefer token.agency_id, else resolve by user)
    let agencyId = decoded.agency_id;
    if (!agencyId) {
      const rows = await query('SELECT agency_id FROM agencies WHERE user_id = ? LIMIT 1', [decoded.user_id]);
      agencyId = rows?.[0]?.agency_id || decoded.user_id;
    }

    // Get specific reservation details for this agency
    const rows = await query(`
      SELECT 
        r.*,
        av.brand AS make, av.model, av.year, av.type AS category_name, av.images AS vehicle_images,
        u.first_name, u.last_name, u.email, u.phone AS customer_phone,
        CONCAT(u.first_name, ' ', IFNULL(u.last_name, '')) AS customer_name,
        pl_pickup.name AS pickup_location_name,
        pl_pickup.address AS pickup_location_address,
        pl_dropoff.name AS dropoff_location_name,
        pl_dropoff.address AS dropoff_location_address,
        DATE_FORMAT(r.start_date, '%M %d, %Y') AS start_date_formatted,
        DATE_FORMAT(r.end_date, '%M %d, %Y') AS end_date_formatted,
        CONCAT(av.brand, ' ', av.model) AS vehicle_name,
        DATEDIFF(r.end_date, r.start_date) AS rental_days
      FROM reservations r
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN pickup_locations pl_pickup ON r.pickup_location_id = pl_pickup.location_id
      LEFT JOIN pickup_locations pl_dropoff ON r.dropoff_location_id = pl_dropoff.location_id
      WHERE r.reservation_id = ? 
        AND r.agency_id = ?
      ORDER BY r.updated_at DESC
    `, [id, agencyId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking not found or you do not have permission to view this booking' 
      }, { status: 404 });
    }

    const booking = rows[0];

    // Process vehicle images
    if (booking.vehicle_images) {
      try { booking.images = JSON.parse(booking.vehicle_images); } catch { booking.images = []; }
    }

    return NextResponse.json({ success: true, booking });

  } catch (error) {
    console.error('Error fetching agency booking detail:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch booking details', details: error.message }, { status: 500 });
  }
}
