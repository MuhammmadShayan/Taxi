import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Build the WHERE clause based on status filter
    let whereClause = '';
    let params = [];

    if (status && status !== 'all') {
      if (status === 'active') {
        whereClause = 'WHERE d.application_status = "approved" AND d.is_available = 1';
      } else if (status === 'inactive') {
        whereClause = 'WHERE d.is_available = 0 OR d.is_active = 0';
      } else if (status === 'verified') {
        whereClause = 'WHERE d.documents_verified = 1 AND d.background_check_status = "approved"';
      } else if (status === 'pending') {
        whereClause = 'WHERE d.application_status = "pending"';
      } else {
        whereClause = 'WHERE d.application_status = ?';
        params.push(status);
      }
    }

    // Get drivers with user information
    const driversQuery = `
      SELECT 
        d.id,
        d.user_id,
        u.first_name,
        u.last_name,
        u.email,
        d.phone,
        d.license_number,
        d.vehicle_make,
        d.vehicle_model,
        d.vehicle_plate,
        d.rating,
        d.total_trips,
        d.application_status,
        d.is_available,
        d.is_active,
        d.documents_verified,
        d.background_check_status,
        d.city,
        d.state,
        d.experience_years,
        d.created_at
      FROM drivers d
      INNER JOIN users u ON d.user_id = u.id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM drivers d
      INNER JOIN users u ON d.user_id = u.id
      ${whereClause}
    `;

    const [drivers, countResult] = await Promise.all([
      query(driversQuery, [...params, limit, offset]),
      query(countQuery, params)
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      drivers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Fetch drivers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { driverId, action, status } = await request.json();

    if (!driverId) {
      return NextResponse.json(
        { success: false, error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    let updateQuery = '';
    let params = [];

    switch (action) {
      case 'approve':
        updateQuery = 'UPDATE drivers SET application_status = "approved", is_active = 1 WHERE id = ?';
        params = [driverId];
        break;
      case 'reject':
        updateQuery = 'UPDATE drivers SET application_status = "rejected", is_active = 0 WHERE id = ?';
        params = [driverId];
        break;
      case 'suspend':
        updateQuery = 'UPDATE drivers SET is_available = 0, is_active = 0 WHERE id = ?';
        params = [driverId];
        break;
      case 'activate':
        updateQuery = 'UPDATE drivers SET is_available = 1, is_active = 1 WHERE id = ?';
        params = [driverId];
        break;
      case 'update_status':
        updateQuery = 'UPDATE drivers SET application_status = ? WHERE id = ?';
        params = [status, driverId];
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: `Driver ${action} successfully`
    });
  } catch (error) {
    console.error('Update driver error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}
