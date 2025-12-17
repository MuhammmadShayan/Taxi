import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const vehicleId = resolvedParams.id;
    
    if (!vehicleId) {
      return NextResponse.json({
        error: 'Vehicle ID is required'
      }, { status: 400 });
    }

    // Get vehicle details from agency_vehicles table (same as trending list)
    const vehicles = await query(`
      SELECT 
        av.*,
        u.first_name as agency_first_name,
        u.last_name as agency_last_name,
        u.email as agency_email,
        COUNT(r.reservation_id) as total_bookings,
        CASE 
          WHEN COUNT(r.reservation_id) >= 10 THEN 'Bestseller'
          WHEN av.daily_rate >= 500 THEN 'Premium'
          WHEN COUNT(r.reservation_id) >= 5 THEN 'Popular'
          ELSE NULL
        END as badge
      FROM agency_vehicles av
      LEFT JOIN users u ON av.agency_id = u.id
      LEFT JOIN reservations r ON av.vehicle_id = r.vehicle_id 
      WHERE av.vehicle_id = ?
      GROUP BY av.vehicle_id, av.agency_id, u.first_name, u.last_name, u.email
    `, [vehicleId]);
    
    const vehicleData = vehicles[0];

    if (!vehicleData) {
      return NextResponse.json({
        error: 'Vehicle not found'
      }, { status: 404 });
    }

    // Parse images if needed
    let images = [];
    try {
      if (vehicleData.images && vehicleData.images !== '[]') {
        const parsed = typeof vehicleData.images === 'string' ? JSON.parse(vehicleData.images) : vehicleData.images;
        if (Array.isArray(parsed)) {
          images = parsed;
        }
      }
    } catch (e) {
      // Keep empty array or default
    }
    
    if (images.length === 0) {
      images = [vehicleData.image_url || vehicleData.image || '/html-folder/images/car-img.png'];
    }

    // Format the response to match what the frontend expects
    const formattedVehicle = {
      id: vehicleData.vehicle_id,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      category_name: vehicleData.type ? vehicleData.type.replace('_', ' ').toUpperCase() : 'Standard',
      seats: vehicleData.seats || 4,
      doors: vehicleData.doors || 4,
      gear_type: vehicleData.gear_type || 'manual',
      energy: vehicleData.energy || 'petrol',
      air_conditioning: vehicleData.air_conditioning,
      bluetooth: vehicleData.bluetooth,
      navigation_system: vehicleData.navigation_system,
      wifi: vehicleData.wifi,
      description: vehicleData.description,
      
      // Pricing
      low_price: parseFloat(vehicleData.daily_rate || 50),
      daily_rate: parseFloat(vehicleData.daily_rate || 50),
      pricing: {
        price_per_day: parseFloat(vehicleData.daily_rate || 50),
        // Simple default values for now since we're pulling from agency_vehicles
        days: 1,
        total: parseFloat(vehicleData.daily_rate || 50)
      },
      
      // Agency info
      agency_id: vehicleData.agency_id,
      agency_name: `${vehicleData.agency_first_name || ''} ${vehicleData.agency_last_name || ''}`.trim() || 'Unknown Agency',
      agency_rating: 4.5, // Default for now
      
      // Images
      images: images,
      
      // Stats
      rating: '4.5',
      reviews: vehicleData.total_bookings > 0 ? `${vehicleData.total_bookings} Bookings` : 'New',
      badge: vehicleData.badge
    };
    
    return NextResponse.json(formattedVehicle);

  } catch (error) {
    console.error('Vehicle fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch vehicle details',
      message: error.message
    }, { status: 500 });
  }
}
