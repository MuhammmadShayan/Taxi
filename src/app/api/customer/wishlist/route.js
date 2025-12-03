import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customer_email');

    let userEmail = customerEmail;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userEmail = decoded.email || userEmail;
      } catch {}
    }

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'Customer email is required' }, { status: 400 });
    }

    const userRows = await query(
      'SELECT u.user_id, c.customer_id FROM users u LEFT JOIN customers c ON c.user_id = u.user_id WHERE u.email = ? LIMIT 1',
      [userEmail]
    );

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ success: true, items: [] });
    }

    const userId = userRows[0].user_id;

    let items = [];
    try {
      items = await query(
        `SELECT 
           w.wishlist_id AS id,
           COALESCE(v.id, av.vehicle_id) AS vehicle_id,
           COALESCE(CONCAT(v.make, ' ', v.model, ' ', v.year), CONCAT(av.brand, ' ', av.model, ' ', av.year)) AS vehicleName,
           COALESCE(v.body_type, av.type) AS vehicleType,
           0 AS rating,
           COALESCE(v.location, '') AS location,
           COALESCE(v.daily_rate, v.price_per_day, av.low_price, 0) AS pricePerDay,
           CASE 
             WHEN v.images IS NOT NULL AND v.images != '[]' THEN JSON_UNQUOTE(JSON_EXTRACT(v.images, '$[0]'))
             WHEN av.images IS NOT NULL AND av.images != '[]' THEN JSON_UNQUOTE(JSON_EXTRACT(av.images, '$[0]'))
             ELSE NULL
           END AS image
         FROM wishlists w
         LEFT JOIN vehicles v ON w.vehicle_id = v.id
         LEFT JOIN agency_vehicles av ON w.vehicle_id = av.vehicle_id
         WHERE w.user_id = ?
         ORDER BY w.created_at DESC`,
        [userId]
      );
    } catch (wishlistError) {
      const msg = wishlistError?.message || '';
      const code = wishlistError?.code || '';
      const isMissingTable = code === 'ER_NO_SUCH_TABLE' || /wishlists/i.test(msg);
      const isUnknownColumn = code === 'ER_BAD_FIELD_ERROR';
      if (!isMissingTable && !isUnknownColumn) throw wishlistError;
      items = [];
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

