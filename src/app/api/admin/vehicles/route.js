import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const agency_id = searchParams.get('agency_id');
    const vehicle_type = searchParams.get('type');
    const offset = (page - 1) * limit;

    // Build WHERE clause for filters
    let whereClause = '';
    const queryParams = [];
    const conditions = [];
    
    if (status && status !== 'all') {
      conditions.push('av.status = ?');
      queryParams.push(status);
    }

    if (agency_id && agency_id !== 'all') {
      conditions.push('av.agency_id = ?');
      queryParams.push(agency_id);
    }

    if (vehicle_type && vehicle_type !== 'all') {
      conditions.push('av.type = ?');
      queryParams.push(vehicle_type);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM agency_vehicles av
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, queryParams);
    const totalVehicles = countResult[0].total;
    const totalPages = Math.ceil(totalVehicles / limit);

    // Get vehicles with all details including agency info and booking statistics
    const vehiclesQuery = `
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
        MAX(r.created_at) as last_booking_date,
        DATEDIFF(CURDATE(), MAX(r.created_at)) as days_since_last_booking,
        DATE_FORMAT(av.created_at, '%M %d, %Y') as created_date_formatted,
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        CASE
          WHEN av.status = 'available' THEN 'Available'
          WHEN av.status = 'rented' THEN 'Currently Rented'
          WHEN av.status = 'maintenance' THEN 'Under Maintenance'
          WHEN av.status = 'inactive' THEN 'Inactive'
          ELSE CONCAT(UPPER(SUBSTRING(av.status, 1, 1)), SUBSTRING(av.status, 2))
        END as status_display,
        CONCAT('$', FORMAT(av.daily_rate, 2)) as daily_rate_formatted,
        av.type as vehicle_type_raw,
        CASE
          WHEN av.type = 'small_car' THEN 'Small Car'
          WHEN av.type = 'suv' THEN 'SUV'
          WHEN av.type = 'luxury' THEN 'Luxury'
          WHEN av.type = 'van' THEN 'Van'
          WHEN av.type = 'truck' THEN 'Truck'
          WHEN av.type = 'motorcycle' THEN 'Motorcycle'
          WHEN av.type = 'transporter' THEN 'Transporter'
          ELSE CONCAT(UPPER(SUBSTRING(av.type, 1, 1)), SUBSTRING(av.type, 2))
        END as vehicle_type_display
      FROM agency_vehicles av
      LEFT JOIN agencies a ON av.agency_id = a.agency_id
      LEFT JOIN users au ON a.user_id = au.user_id
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id
      ${whereClause}
      GROUP BY av.vehicle_id
      ORDER BY av.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const finalParams = [...queryParams, limit, offset];
    const vehicles = await query(vehiclesQuery, finalParams);
    
    // Parse images and add computed fields for each vehicle
    const processedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      images: vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : [],
      utilization_rate: vehicle.total_bookings > 0 ? Math.round((vehicle.completed_bookings / vehicle.total_bookings) * 100) : 0,
      revenue_per_day: vehicle.completed_bookings > 0 ? (vehicle.total_revenue / vehicle.completed_bookings).toFixed(2) : 0,
      is_popular: vehicle.total_bookings >= 5,
      is_new: (new Date() - new Date(vehicle.created_at)) / (1000 * 60 * 60 * 24) <= 30, // Less than 30 days old
      booking_frequency: vehicle.total_bookings > 0 && vehicle.last_booking_date ? 
        Math.round(vehicle.total_bookings / Math.max(1, (new Date() - new Date(vehicle.created_at)) / (1000 * 60 * 60 * 24 * 30))) : 0 // Bookings per month
    }));

    // Get additional statistics for the filtered results
    const statsQuery = `
      SELECT 
        COUNT(*) as filtered_total,
        COUNT(CASE WHEN av.status = 'available' THEN 1 END) as available_count,
        COUNT(CASE WHEN av.status = 'rented' THEN 1 END) as rented_count,
        COUNT(CASE WHEN av.status = 'maintenance' THEN 1 END) as maintenance_count,
        AVG(av.daily_rate) as avg_daily_rate,
        MIN(av.daily_rate) as min_daily_rate,
        MAX(av.daily_rate) as max_daily_rate
      FROM agency_vehicles av
      ${whereClause}
    `;

    const statsResult = await query(statsQuery, queryParams);
    const statistics = {
      ...statsResult[0],
      avg_daily_rate: parseFloat(statsResult[0]?.avg_daily_rate || 0).toFixed(2),
      min_daily_rate: parseFloat(statsResult[0]?.min_daily_rate || 0).toFixed(2),
      max_daily_rate: parseFloat(statsResult[0]?.max_daily_rate || 0).toFixed(2)
    };

    const pagination = {
      page,
      pages: totalPages,
      total: totalVehicles,
      limit
    };

    return NextResponse.json({
      success: true,
      vehicles: processedVehicles,
      pagination,
      statistics
    });

  } catch (error) {
    console.error('Error fetching admin vehicles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST request to create new vehicle or handle actions
export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();
    const { action } = requestData;

    // Handle creating new vehicle
    if (!action) {
      const {
        agency_id, category_id, brand, model, year, vehicle_number, type, energy,
        gear_type, seats, daily_rate, status, description, images
      } = requestData;
      
      // Validate required fields
      if (!agency_id || !category_id || !brand || !model || !vehicle_number || !daily_rate) {
        return NextResponse.json(
          { error: 'Missing required fields: agency_id, category_id, brand, model, vehicle_number, daily_rate' },
          { status: 400 }
        );
      }
      
      // Check if vehicle number already exists
      const existingVehicle = await query(
        'SELECT vehicle_id FROM agency_vehicles WHERE vehicle_number = ?',
        [vehicle_number]
      );
      
      if (existingVehicle.length > 0) {
        return NextResponse.json(
          { error: 'Vehicle number already exists' },
          { status: 400 }
        );
      }
      
      // Insert new vehicle
      const insertQuery = `
        INSERT INTO agency_vehicles (
          agency_id, category_id, brand, model, year, vehicle_number, type, energy,
          gear_type, seats, daily_rate, status, description, images, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await query(insertQuery, [
        agency_id, category_id, brand, model, year, vehicle_number, type, energy,
        gear_type, seats, daily_rate, status || 'available', description || '',
        JSON.stringify(images || []), 
      ]);
      
      return NextResponse.json({
        success: true,
        message: 'Vehicle added successfully',
        vehicle_id: result.insertId
      });
    }

    if (action === 'get_filter_options') {
      // Get agencies for filtering
      const agenciesQuery = `
        SELECT 
          a.agency_id,
          a.business_name,
          COUNT(av.vehicle_id) as vehicle_count
        FROM agencies a
        LEFT JOIN agency_vehicles av ON a.agency_id = av.agency_id
        GROUP BY a.agency_id, a.business_name
        HAVING vehicle_count > 0
        ORDER BY a.business_name ASC
      `;

      const agencies = await query(agenciesQuery);

      // Get vehicle types
      const typesQuery = `
        SELECT 
          av.type as value,
          COUNT(*) as count,
          CASE
            WHEN av.type = 'small_car' THEN 'Small Car'
            WHEN av.type = 'suv' THEN 'SUV'
            WHEN av.type = 'luxury' THEN 'Luxury'
            WHEN av.type = 'van' THEN 'Van'
            WHEN av.type = 'truck' THEN 'Truck'
            WHEN av.type = 'motorcycle' THEN 'Motorcycle'
            WHEN av.type = 'transporter' THEN 'Transporter'
            ELSE CONCAT(UPPER(SUBSTRING(av.type, 1, 1)), SUBSTRING(av.type, 2))
          END as label
        FROM agency_vehicles av
        GROUP BY av.type
        ORDER BY count DESC
      `;

      const types = await query(typesQuery);

      return NextResponse.json({
        success: true,
        filter_options: {
          agencies,
          types
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing admin vehicles request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
