import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

// GET /api/admin/pickup-locations
export async function GET(request) {
  try {
    // Require admin session
    const token = request.cookies.get('holikey_session')?.value || request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Attempt to fetch from pickup_locations table
    let locations = [];
    try {
      locations = await query(`
        SELECT 
          id,
          name,
          address,
          city,
          country,
          type,
          latitude,
          longitude,
          contact_phone,
          contact_email,
          opening_hours,
          is_active,
          created_at
        FROM pickup_locations
        ORDER BY created_at DESC
        LIMIT 1000
      `);
    } catch (e) {
      // Table might not exist or schema differs; return empty list without throwing demo data
      console.warn('pickup_locations query failed or table missing:', e.message);
      locations = [];
    }

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('GET /api/admin/pickup-locations error:', error);
    return NextResponse.json({ error: 'Failed to load pickup locations' }, { status: 500 });
  }
}
