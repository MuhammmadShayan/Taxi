import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    // Get all available vehicles from agency_vehicles table with agency info
    const trendingVehicles = await query(`
      SELECT 
        av.*,
        u.first_name as agency_first_name,
        u.last_name as agency_last_name,
        u.email as agency_email,
        COUNT(r.reservation_id) as total_bookings,
        COUNT(CASE WHEN r.status IN ('confirmed', 'active') THEN 1 END) as active_bookings,
        CASE 
          WHEN COUNT(r.reservation_id) >= 10 THEN 'Bestseller'
          WHEN av.daily_rate >= 500 THEN 'Premium'
          WHEN COUNT(r.reservation_id) >= 5 THEN 'Popular'
          ELSE NULL
        END as badge
      FROM agency_vehicles av
      LEFT JOIN users u ON av.agency_id = u.user_id
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id 
        AND r.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      WHERE av.status = 'available'
        AND av.daily_rate IS NOT NULL
        AND av.daily_rate > 0
        AND u.user_id IS NOT NULL
      GROUP BY av.vehicle_id, av.agency_id, u.first_name, u.last_name, u.email
      ORDER BY 
        total_bookings DESC,
        av.daily_rate DESC,
        av.created_at DESC
    `);

    // Format the data for display
    const formattedVehicles = trendingVehicles.map(vehicle => {
      let image = null;
      try {
        if (vehicle.images && vehicle.images !== '[]') {
          const parsed = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images;
          if (Array.isArray(parsed) && parsed.length > 0) {
            image = parsed[0];
          }
        }
      } catch {}
      if (!image) {
        image = vehicle.image_url || vehicle.image || '/html-folder/images/car-img.png';
      }

      return {
        id: vehicle.vehicle_id,
        name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}` || 'Unknown Vehicle',
        category: vehicle.type ? vehicle.type.replace('_', ' ').toUpperCase() : 'Standard',
        rating: '4.5/5',
        reviews: vehicle.total_bookings > 0 ? `${vehicle.total_bookings} Bookings` : 'New',
        passengers: vehicle.seats || 4,
        luggage: Math.floor((vehicle.seats || 4) / 2),
        price: parseFloat(vehicle.daily_rate || 0),
        image,
        badge: vehicle.badge,
        year: vehicle.year,
        brand: vehicle.brand,
        model: vehicle.model,
        vehicle_number: vehicle.vehicle_number,
        air_conditioning: vehicle.air_conditioning,
        bluetooth: vehicle.bluetooth,
        navigation_system: vehicle.navigation_system,
        wifi: vehicle.wifi,
        energy: vehicle.energy || 'petrol',
        gear_type: vehicle.gear_type || 'manual',
        total_bookings: vehicle.total_bookings,
        active_bookings: vehicle.active_bookings,
        agency_id: vehicle.agency_id,
        agency_name: `${vehicle.agency_first_name || ''} ${vehicle.agency_last_name || ''}`.trim() || 'Unknown Agency',
        agency_email: vehicle.agency_email
      };
    });

    // Group vehicles by agency for easier frontend handling
    const agenciesMap = new Map();
    formattedVehicles.forEach(vehicle => {
      const agencyId = vehicle.agency_id;
      if (!agenciesMap.has(agencyId)) {
        agenciesMap.set(agencyId, {
          id: agencyId,
          name: vehicle.agency_name,
          email: vehicle.agency_email,
          vehicles: []
        });
      }
      agenciesMap.get(agencyId).vehicles.push(vehicle);
    });

    const agencies = Array.from(agenciesMap.values());

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles,
      agencies: agencies,
      total: formattedVehicles.length
    });

  } catch (error) {
    console.error('Error fetching trending vehicles:', error);
    
    return NextResponse.json({
      success: false,
      vehicles: [],
      total: 0,
      error: 'Failed to fetch vehicles from database'
    });
  }
}
