import { query } from '@/lib/db';
import { validateApiSession, hasPermission } from '@/lib/auth';

// GET /api/vehicles - Get vehicles with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agency_id = searchParams.get('agency_id');
    const category = searchParams.get('category');
    const pickup_location = searchParams.get('pickup_location');
    const available_from = searchParams.get('available_from');
    const available_to = searchParams.get('available_to');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    let whereConditions = ['c.is_available = 1'];
    let params = [];
    
    if (agency_id) {
      whereConditions.push('c.agency_id = ?');
      params.push(agency_id);
    }
    
    if (category) {
      whereConditions.push('cc.name = ?');
      params.push(category);
    }
    
    // Check availability for date range
    if (available_from && available_to) {
      whereConditions.push(`
        c.id NOT IN (
          SELECT vehicle_id FROM reservations 
          WHERE status IN ('confirmed', 'pending') 
          AND ((pickup_date <= ? AND return_date >= ?) 
          OR (pickup_date <= ? AND return_date >= ?))
        )
      `);
      params.push(available_to, available_from, available_from, available_to);
    }
    
    const sql = `
      SELECT 
        c.*,
        cc.name as category_name,
        a.name as agency_name,
        a.rating as agency_rating,
        COUNT(r.id) as total_reviews,
        AVG(r.rating) as avg_rating
      FROM cars c
      LEFT JOIN car_categories cc ON c.category_id = cc.id
      LEFT JOIN agencies a ON c.agency_id = a.id
      LEFT JOIN reviews r ON r.reviewed_entity_id = c.id AND r.reviewed_entity_type = 'car'
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY c.id
      ORDER BY c.rating DESC, c.price_per_day ASC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limit, offset);
    const vehicles = await query(sql, params);
    
    // Get total count
    const countSql = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM cars c
      LEFT JOIN car_categories cc ON c.category_id = cc.id
      LEFT JOIN agencies a ON c.agency_id = a.id
      WHERE ${whereConditions.slice(0, -2).join(' AND ')}
    `;
    const [{ total }] = await query(countSql, params.slice(0, -2));
    
    return Response.json({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get vehicles error:', error);
    return Response.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// POST /api/vehicles - Add new vehicle (Agency only)
export async function POST(request) {
  try {
    const validation = await validateApiSession(request);
    if (validation.error) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }
    
    const user = validation.user;
    if (!hasPermission(user, 'manage_own_vehicles')) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    const vehicleData = await request.json();
    const {
      make, model, year, color, license_plate, seats, category_id,
      fuel_type, transmission, price_per_day, price_per_hour,
      features, description, location
    } = vehicleData;
    
    // Get agency_id for current user
    const [agency] = await query('SELECT id FROM agencies WHERE user_id = ?', [user.id]);
    if (!agency) {
      return Response.json({ error: 'Agency not found' }, { status: 404 });
    }
    
    const result = await query(`
      INSERT INTO cars (
        agency_id, category_id, make, model, year, color, license_plate,
        seats, fuel_type, transmission, price_per_day, price_per_hour,
        features, description, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      agency.id, category_id, make, model, year, color, license_plate,
      seats, fuel_type, transmission, price_per_day, price_per_hour || 0,
      JSON.stringify(features || []), description, location
    ]);
    
    return Response.json({
      message: 'Vehicle added successfully',
      vehicle_id: result.insertId
    }, { status: 201 });
    
  } catch (error) {
    console.error('Add vehicle error:', error);
    return Response.json({ error: 'Failed to add vehicle' }, { status: 500 });
  }
}