import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifySessionToken } from '../../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    
    // Get vehicle details with agency info
    const vehicleQuery = `
      SELECT 
        av.*,
        a.business_name as agency_name,
        a.business_email as agency_email,
        a.business_phone as agency_phone,
        au.first_name as agency_owner_name,
        au.last_name as agency_owner_last_name,
        au.email as agency_owner_email,
        CONCAT(au.first_name, ' ', au.last_name) as agency_owner_full_name,
        COUNT(r.reservation_id) as total_bookings,
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN 1 END) as active_bookings,
        COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_bookings,
        COALESCE(SUM(CASE WHEN r.status = 'completed' THEN r.total_price END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN r.status = 'completed' THEN r.total_price END), 0) as avg_booking_value,
        MAX(r.created_at) as last_booking_date
      FROM agency_vehicles av
      LEFT JOIN agencies a ON av.agency_id = a.agency_id
      LEFT JOIN users au ON a.user_id = au.user_id
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id
      WHERE av.vehicle_id = ?
      GROUP BY av.vehicle_id
    `;
    
    const vehicles = await query(vehicleQuery, [vehicleId]);
    
    if (vehicles.length === 0) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const vehicle = vehicles[0];
    
    // Parse images
    vehicle.images = vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : [];
    
    return NextResponse.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicle details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    const updateData = await request.json();
    
    // Build update query dynamically based on provided fields
    const allowedFields = [
      'category_id', 'brand', 'model', 'year', 'vehicle_number', 'type', 'energy', 
      'gear_type', 'seats', 'daily_rate', 'status', 'description', 'images'
    ];
    
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(key === 'images' ? JSON.stringify(value) : value);
      }
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    updateValues.push(vehicleId);
    
    const updateQuery = `
      UPDATE agency_vehicles 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE vehicle_id = ?
    `;
    
    await query(updateQuery, updateValues);
    
    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully'
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    
    await query(
      'UPDATE agency_vehicles SET status = ?, updated_at = NOW() WHERE vehicle_id = ?',
      [status, vehicleId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Vehicle status updated successfully'
    });

  } catch (error) {
    console.error('Error updating vehicle status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vehicle status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    
    // Check if vehicle has active bookings
    const activeBookingsQuery = `
      SELECT COUNT(*) as active_count
      FROM reservations 
      WHERE vehicle_id = ? AND status IN ('confirmed', 'active')
    `;
    
    const bookingsResult = await query(activeBookingsQuery, [vehicleId]);
    
    if (bookingsResult[0].active_count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete vehicle with active bookings' 
      }, { status: 400 });
    }
    
    // Soft delete by setting status to inactive
    await query(
      'UPDATE agency_vehicles SET status = ?, updated_at = NOW() WHERE vehicle_id = ?',
      ['inactive', vehicleId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Vehicle deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}
