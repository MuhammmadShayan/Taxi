import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getSession } from '../../../../lib/auth';

// GET /api/reviews/stats - Aggregate review statistics with filters
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'approved';
    const agencyId = url.searchParams.get('agency_id');
    const vehicleId = url.searchParams.get('vehicle_id');
    const customerId = url.searchParams.get('customer_id');

    // Session is optional when requesting only approved reviews for public pages
    let session = null;
    try { session = await getSession(request); } catch {}

    const where = [];
    const params = [];

    // Role-based access control if session exists
    if (session?.user?.role === 'agency') {
      where.push('r.agency_id = ?');
      params.push(session.user.agency_id);
    } else if (session?.user?.role === 'customer') {
      where.push('r.customer_id = ?');
      params.push(session.user.customer_id);
    } else if (!session) {
      // No session: only allow approved reviews
      if (status !== 'approved') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Extra optional filters
    if (agencyId) { where.push('r.agency_id = ?'); params.push(agencyId); }
    if (vehicleId) { where.push('r.vehicle_id = ?'); params.push(vehicleId); }
    if (customerId) { where.push('r.customer_id = ?'); params.push(customerId); }

    // Status filter
    if (status !== 'all') { where.push('r.status = ?'); params.push(status); }

    where.push('r.deleted_at IS NULL');
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const statsSql = `
      SELECT 
        COUNT(*) AS total_reviews,
        AVG(r.overall_rating) AS average_rating,
        SUM(CASE WHEN r.status = 'submitted' THEN 1 ELSE 0 END) AS pending_reviews,
        SUM(CASE WHEN r.overall_rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews,
        SUM(CASE WHEN r.overall_rating = 4 THEN 1 ELSE 0 END) AS four_star_reviews,
        SUM(CASE WHEN r.overall_rating = 3 THEN 1 ELSE 0 END) AS three_star_reviews,
        SUM(CASE WHEN r.overall_rating = 2 THEN 1 ELSE 0 END) AS two_star_reviews,
        SUM(CASE WHEN r.overall_rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews
      FROM reviews r
      ${whereClause}
    `;

    const [row] = await query(statsSql, params);

    return NextResponse.json({
      success: true,
      stats: {
        total_reviews: Number(row?.total_reviews || 0),
        average_rating: row?.average_rating ? Number(row.average_rating.toFixed(2)) : 0,
        pending_reviews: Number(row?.pending_reviews || 0),
        breakdown: {
          5: Number(row?.five_star_reviews || 0),
          4: Number(row?.four_star_reviews || 0),
          3: Number(row?.three_star_reviews || 0),
          2: Number(row?.two_star_reviews || 0),
          1: Number(row?.one_star_reviews || 0)
        }
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review stats', details: error.message },
      { status: 500 }
    );
  }
}