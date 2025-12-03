import { NextResponse } from 'next/server';
import { getConnection } from '../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('active');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = (page - 1) * limit;

    const connection = await getConnection();

    let query = 'SELECT * FROM drivers WHERE 1=1';
    const queryParams = [];

    if (isActive !== null) {
      query += ' AND is_active = ?';
      queryParams.push(isActive === 'true' ? 1 : 0);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await connection.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM drivers WHERE 1=1';
    const countParams = [];

    if (isActive !== null) {
      countQuery += ' AND is_active = ?';
      countParams.push(isActive === 'true' ? 1 : 0);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total = countRows[0].total;

    await connection.end();

    // Parse JSON fields
    const drivers = rows.map(driver => ({
      ...driver,
      languages: driver.languages ? JSON.parse(driver.languages) : [],
      specializations: driver.specializations ? JSON.parse(driver.specializations) : []
    }));

    return NextResponse.json({
      success: true,
      drivers: drivers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch drivers'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      license_number,
      experience_years = 0,
      languages = [],
      specializations = [],
      profile_image = null
    } = body;

    if (!name || !phone || !email || !license_number) {
      return NextResponse.json({
        success: false,
        message: 'Name, phone, email, and license number are required'
      }, { status: 400 });
    }

    const connection = await getConnection();

    // Check if email already exists
    const [existingDrivers] = await connection.execute(
      'SELECT id FROM drivers WHERE email = ?',
      [email]
    );

    if (existingDrivers.length > 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'Driver with this email already exists'
      }, { status: 409 });
    }

    const query = `
      INSERT INTO drivers (
        name, phone, email, license_number, experience_years,
        languages, specializations, profile_image, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      phone,
      email,
      license_number,
      experience_years,
      JSON.stringify(languages),
      JSON.stringify(specializations),
      profile_image,
      new Date()
    ];

    const [result] = await connection.execute(query, values);
    
    await connection.end();

    return NextResponse.json({
      success: true,
      driver_id: result.insertId,
      message: 'Driver created successfully'
    });

  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create driver'
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { driver_id, updates } = body;

    if (!driver_id) {
      return NextResponse.json({
        success: false,
        message: 'Driver ID is required'
      }, { status: 400 });
    }

    const connection = await getConnection();

    const allowedFields = [
      'name', 'phone', 'email', 'license_number', 'experience_years',
      'rating', 'total_trips', 'is_active', 'profile_image', 'languages', 'specializations'
    ];

    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(field => {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = ?`);
        if (field === 'languages' || field === 'specializations') {
          updateValues.push(JSON.stringify(updates[field]));
        } else {
          updateValues.push(updates[field]);
        }
      }
    });

    if (updateFields.length === 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'No valid fields to update'
      }, { status: 400 });
    }

    updateFields.push('updated_at = ?');
    updateValues.push(new Date());
    updateValues.push(driver_id);

    const query = `UPDATE drivers SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const [result] = await connection.execute(query, updateValues);

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'Driver not found'
      }, { status: 404 });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Driver updated successfully'
    });

  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update driver'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driver_id');

    if (!driverId) {
      return NextResponse.json({
        success: false,
        message: 'Driver ID is required'
      }, { status: 400 });
    }

    const connection = await getConnection();

    // Check if driver has active bookings
    const [activeBookings] = await connection.execute(
      'SELECT COUNT(*) as count FROM bookings WHERE driver_id = ? AND booking_status IN (?, ?, ?)',
      [driverId, 'assigned', 'in_progress', 'confirmed']
    );

    if (activeBookings[0].count > 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'Cannot delete driver with active bookings'
      }, { status: 400 });
    }

    // Soft delete by setting is_active to false
    const [result] = await connection.execute(
      'UPDATE drivers SET is_active = ?, updated_at = ? WHERE id = ?',
      [false, new Date(), driverId]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        message: 'Driver not found'
      }, { status: 404 });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Driver deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete driver'
    }, { status: 500 });
  }
}

