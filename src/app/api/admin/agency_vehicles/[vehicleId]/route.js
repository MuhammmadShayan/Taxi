import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/database.js';

export async function PATCH(request, { params }) {
  try {
    const { vehicleId } = params;
    const { status } = await request.json();

    if (!vehicleId) {
      return NextResponse.json({ success: false, message: 'Missing vehicleId' }, { status: 400 });
    }
    if (!status || !['available','rented','maintenance','inactive'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    await query(
      'UPDATE agency_vehicles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE vehicle_id = ?',
      [status, vehicleId]
    );

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating agency vehicle status:', error);
    return NextResponse.json({ success: false, message: 'Failed to update status' }, { status: 500 });
  }
}
