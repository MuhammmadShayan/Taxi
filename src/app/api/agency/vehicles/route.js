import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import { verifySessionTokenEdge } from '../../../../lib/jwt-edge';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionTokenEdge(token);
    if (!decoded || !['agency_owner', 'agency_admin', 'driver'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = decoded.id || decoded.user_id;

    // Get the actual agency_id from agencies table
    const agency = await query(
      'SELECT agency_id FROM agencies WHERE user_id = ? AND status = "approved"',
      [userId]
    );

    if (agency.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Agency not found or not approved' },
        { status: 403 }
      );
    }

    const agencyId = agency[0].agency_id;

    // Get vehicles for this agency from agency_vehicles table
    const vehicles = await query(`
      SELECT 
        av.*,
        COUNT(r.reservation_id) as total_bookings,
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN 1 END) as active_bookings
      FROM agency_vehicles av
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id AND r.agency_id = av.agency_id
      WHERE av.agency_id = ?
      GROUP BY av.vehicle_id
      ORDER BY av.created_at DESC
    `, [agencyId]);

    // Format the vehicles data
    const formattedVehicles = vehicles.map(vehicle => {
      // Parse images if they exist
      let parsedImages = [];
      if (vehicle.images) {
        try {
          parsedImages = JSON.parse(vehicle.images);
          // Ensure it's an array
          if (!Array.isArray(parsedImages)) {
            parsedImages = [parsedImages];
          }
        } catch (e) {
          console.log('Could not parse vehicle images:', e.message);
          parsedImages = [];
        }
      }
      
      return {
        ...vehicle,
        vehicle_display_name: `${vehicle.brand} ${vehicle.model}`,
        daily_rate_formatted: `$${parseFloat(vehicle.daily_rate || 0).toFixed(2)}`,
        status_display: vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1),
        type_display: vehicle.type.replace('_', ' ').toUpperCase(),
        year_display: vehicle.year,
        booking_rate: vehicle.total_bookings > 0 ? Math.round((vehicle.active_bookings / vehicle.total_bookings) * 100) : 0,
        parsed_images: parsedImages,
        first_image: parsedImages.length > 0 ? parsedImages[0] : null
      };
    });

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles || []
    });

  } catch (error) {
    console.error('Error fetching agency vehicles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifySessionTokenEdge(token);
    if (!decoded || !['agency_owner', 'agency_admin'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = decoded.id || decoded.user_id;

    // Get the actual agency_id from agencies table
    const agency = await query(
      'SELECT agency_id FROM agencies WHERE user_id = ? AND status = "approved"',
      [userId]
    );

    if (agency.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Agency not found or not approved' },
        { status: 403 }
      );
    }

    const agencyId = agency[0].agency_id;
    const vehicleData = await request.json();

    // Validate required fields
    const required = ['vehicle_number', 'type', 'brand', 'model', 'year', 'daily_rate'];
    for (const field of required) {
      if (!vehicleData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // If catalog_vehicle_id is provided, get images from catalog
    let imagesJson = '[]';
    if (vehicleData.catalog_vehicle_id) {
      const catalogVehicle = await query(
        'SELECT images FROM vehicles WHERE id = ?',
        [vehicleData.catalog_vehicle_id]
      );
      if (catalogVehicle.length > 0 && catalogVehicle[0].images) {
        // Store the images JSON directly
        imagesJson = typeof catalogVehicle[0].images === 'string' 
          ? catalogVehicle[0].images 
          : JSON.stringify(catalogVehicle[0].images);
      }
    }

    // Insert new vehicle into agency_vehicles table
    const result = await query(
      `INSERT INTO agency_vehicles (
        agency_id, category_id, vehicle_number, type, brand, model, year,
        energy, gear_type, doors, seats, air_conditioning, airbags,
        navigation_system, bluetooth, wifi,
        price_low, price_high, price_holiday, daily_rate, weekly_rate, monthly_rate, 
        deposit_amount, mileage_limit, extra_mileage_cost, description, images, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agencyId,
        vehicleData.category_id || 1,
        vehicleData.vehicle_number,
        vehicleData.type,
        vehicleData.brand,
        vehicleData.model,
        vehicleData.year,
        vehicleData.energy || 'petrol',
        vehicleData.gear_type || 'manual',
        vehicleData.doors || 4,
        vehicleData.seats || 5,
        vehicleData.air_conditioning ? 1 : 0,
        vehicleData.airbags ? 1 : 0,
        vehicleData.navigation_system ? 1 : 0,
        vehicleData.bluetooth ? 1 : 0,
        vehicleData.wifi ? 1 : 0,
        vehicleData.price_low || vehicleData.daily_rate,
        vehicleData.price_high || vehicleData.daily_rate * 1.5,
        vehicleData.price_holiday || vehicleData.daily_rate * 1.2,
        vehicleData.daily_rate,
        vehicleData.weekly_rate || null,
        vehicleData.monthly_rate || null,
        vehicleData.deposit_amount || 200,
        vehicleData.mileage_limit || 200,
        vehicleData.extra_mileage_cost || 0.15,
        vehicleData.description || null,
        imagesJson,
        'available'
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle_id: result.insertId
    });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
