import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/database.js';
import { verifySessionTokenEdge } from '../../../../../lib/jwt-edge';

async function getAgencyIdFromSession(request) {
  const token = request.cookies.get('session')?.value;
  if (!token) return { error: 'Unauthorized', status: 401 };
  const decoded = await verifySessionTokenEdge(token).catch(() => null);
  if (!decoded || !['agency_owner', 'agency_admin', 'driver'].includes(decoded.user_type)) {
    return { error: 'Forbidden', status: 403 };
  }
  const userId = decoded.id || decoded.user_id;
  const agencyRows = await query('SELECT agency_id FROM agencies WHERE user_id = ? AND status = "approved"', [userId]);
  if (!agencyRows?.length) return { error: 'Agency not found or not approved', status: 403 };
  return { agency_id: agencyRows[0].agency_id };
}

export async function GET(request, { params }) {
  try {
    const { agency_id, error, status } = await getAgencyIdFromSession(request);
    if (error) return NextResponse.json({ success: false, error }, { status });

    const vehicleId = params?.id;
    if (!vehicleId) return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });

    const rows = await query(
      `SELECT * FROM agency_vehicles WHERE agency_id = ? AND vehicle_id = ? LIMIT 1`,
      [agency_id, vehicleId]
    );
    if (!rows?.length) return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });

    const v = rows[0];
    let images = [];
    try { images = v.images ? JSON.parse(v.images) : []; } catch {}

    return NextResponse.json({
      success: true,
      vehicle: {
        ...v,
        images,
        vehicle_display_name: `${v.brand} ${v.model}`,
        daily_rate_formatted: `$${parseFloat(v.daily_rate || 0).toFixed(2)}`,
      }
    });
  } catch (e) {
    console.error('Agency vehicle GET error:', e);
    return NextResponse.json({ success: false, error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { agency_id, error, status } = await getAgencyIdFromSession(request);
    if (error) return NextResponse.json({ success: false, error }, { status });

    const vehicleId = params?.id;
    if (!vehicleId) return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });

    const body = await request.json();
    const allowed = ['daily_rate','weekly_rate','monthly_rate','status','description','price_low','price_high','price_holiday'];
    const updates = [];
    const paramsArr = [];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        updates.push(`${key} = ?`);
        paramsArr.push(body[key]);
      }
    }
    if (!updates.length) return NextResponse.json({ success: false, error: 'No updatable fields provided' }, { status: 400 });

    paramsArr.push(agency_id, vehicleId);
    const sql = `UPDATE agency_vehicles SET ${updates.join(', ')}, updated_at = NOW() WHERE agency_id = ? AND vehicle_id = ?`;
    await query(sql, paramsArr);

    return NextResponse.json({ success: true, message: 'Vehicle updated successfully' });
  } catch (e) {
    console.error('Agency vehicle PUT error:', e);
    return NextResponse.json({ success: false, error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { agency_id, error, status } = await getAgencyIdFromSession(request);
    if (error) return NextResponse.json({ success: false, error }, { status });

    const vehicleId = params?.id;
    if (!vehicleId) return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });

    const body = await request.json();
    if (!body.status) return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });

    const validStatuses = ['available', 'rented', 'maintenance', 'inactive'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await query(
      `UPDATE agency_vehicles SET status = ?, updated_at = NOW() WHERE agency_id = ? AND vehicle_id = ?`,
      [body.status, agency_id, vehicleId]
    );

    return NextResponse.json({ success: true, message: 'Vehicle status updated successfully' });
  } catch (e) {
    console.error('Agency vehicle PATCH error:', e);
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { agency_id, error, status } = await getAgencyIdFromSession(request);
    if (error) return NextResponse.json({ success: false, error }, { status });

    const vehicleId = params?.id;
    if (!vehicleId) return NextResponse.json({ success: false, error: 'Vehicle ID required' }, { status: 400 });

    // Ensure no active bookings block deletion
    const [{ cnt }] = await query(
      `SELECT COUNT(*) as cnt FROM reservations WHERE vehicle_id = ? AND agency_id = ? AND status IN ('confirmed','active')`,
      [vehicleId, agency_id]
    );
    if (cnt > 0) {
      return NextResponse.json({ success: false, error: 'Cannot delete: vehicle has active/confirmed bookings' }, { status: 400 });
    }

    await query(`DELETE FROM agency_vehicles WHERE agency_id = ? AND vehicle_id = ?`, [agency_id, vehicleId]);
    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (e) {
    console.error('Agency vehicle DELETE error:', e);
    return NextResponse.json({ success: false, error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
