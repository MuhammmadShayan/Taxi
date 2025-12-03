import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const agencyId = searchParams.get('agency_id') || 'all';
    const type = searchParams.get('type') || 'all';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(av.brand LIKE ? OR av.model LIKE ? OR av.vehicle_number LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (status !== 'all') {
      conditions.push('av.status = ?');
      params.push(status);
    }
    if (agencyId !== 'all') {
      conditions.push('av.agency_id = ?');
      params.push(agencyId);
    }
    if (type !== 'all') {
      conditions.push('av.type = ?');
      params.push(type);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countRows = await query(
      `SELECT COUNT(*) AS total FROM agency_vehicles av ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Fetch vehicles with agency info
    const vehicles = await query(
      `SELECT 
         av.*, 
         a.business_name AS agency_name,
         u.first_name AS agency_owner_first_name,
         u.last_name AS agency_owner_last_name,
         CONCAT(u.first_name, ' ', u.last_name) AS agency_owner_full_name,
         DATE_FORMAT(av.created_at, '%Y-%m-%d %H:%i:%s') AS created_at_str
       FROM agency_vehicles av
       LEFT JOIN agencies a ON av.agency_id = a.agency_id
       LEFT JOIN users u ON a.user_id = u.user_id
       ${whereClause}
       ORDER BY av.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Parse images JSON and add computed display fields
    const processed = vehicles.map(v => {
      const images = v.images ? (typeof v.images === 'string' ? safeJsonParse(v.images) : v.images) : [];
      const isNew = (() => {
        try {
          const createdAt = new Date(v.created_at);
          return (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        } catch {
          return false;
        }
      })();
      const vehicleTypeDisplay = v.type ? String(v.type).replace('_', ' ').toUpperCase() : '';
      return {
        ...v,
        images,
        is_new: isNew,
        vehicle_type_display: vehicleTypeDisplay,
      };
    });

    const statsRows = await query(
      `SELECT 
         COUNT(*) AS filtered_total,
         COUNT(CASE WHEN status='available' THEN 1 END) AS available_count,
         COUNT(CASE WHEN status='rented' THEN 1 END) AS rented_count,
         COUNT(CASE WHEN status='maintenance' THEN 1 END) AS maintenance_count,
         AVG(daily_rate) AS avg_daily_rate,
         MIN(daily_rate) AS min_daily_rate,
         MAX(daily_rate) AS max_daily_rate
       FROM agency_vehicles av
       ${whereClause}`,
      params
    );

    const statistics = {
      ...statsRows[0],
      avg_daily_rate: Number(parseFloat(statsRows[0]?.avg_daily_rate || 0).toFixed(2)),
      min_daily_rate: Number(parseFloat(statsRows[0]?.min_daily_rate || 0).toFixed(2)),
      max_daily_rate: Number(parseFloat(statsRows[0]?.max_daily_rate || 0).toFixed(2)),
    };

    return NextResponse.json({
      success: true,
      vehicles: processed,
      pagination: { page, pages: totalPages, total, limit },
      statistics,
    });
  } catch (error) {
    console.error('Error fetching agency vehicles:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch agency vehicles' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { vehicleId, status } = await request.json();
    
    await query(
      'UPDATE agency_vehicles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE vehicle_id = ?',
      [status, vehicleId]
    );

    return NextResponse.json({
      success: true,
      message: 'Vehicle status updated successfully'
    });
  } catch (error) {
    console.error('Error updating agency vehicle status:', error);
    return NextResponse.json({ success: false, message: 'Failed to update status' }, { status: 500 });
  }
}

function safeJsonParse(s) {
  try { return JSON.parse(s); } catch { return []; }
}

