import { NextResponse } from 'next/server';
import { query } from '../../../../../../lib/db';
import { verifySessionToken } from '../../../../../../lib/auth';

export async function POST(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { vehicleId } = await params;

    // Get vehicle and agency details
    const vehicle = await query(`
      SELECT v.*, a.business_name, a.business_email, u.email as owner_email, u.first_name, u.last_name
      FROM agency_vehicles v 
      JOIN agencies a ON v.agency_id = a.agency_id 
      JOIN users u ON a.user_id = u.user_id 
      WHERE v.vehicle_id = ?
    `, [vehicleId]);

    if (vehicle.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const vehicleData = vehicle[0];

    // Create notification for agency owner
    await query(`
      INSERT INTO notifications (user_id, type, title, message, data, created_at)
      VALUES (?, 'maintenance', 'Maintenance Reminder', ?, ?, NOW())
    `, [
      vehicleData.user_id,
      `Your vehicle ${vehicleData.brand} ${vehicleData.model} (${vehicleData.vehicle_number}) requires maintenance attention.`,
      JSON.stringify({
        vehicle_id: vehicleId,
        agency_id: vehicleData.agency_id,
        vehicle_details: `${vehicleData.brand} ${vehicleData.model}`,
        action: 'maintenance_reminder'
      })
    ]);

    // You could also send an email here using your email service
    // await sendMaintenanceReminderEmail(vehicleData);

    return NextResponse.json({ 
      success: true, 
      message: 'Maintenance reminder sent successfully' 
    });
  } catch (error) {
    console.error('Error sending maintenance reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}