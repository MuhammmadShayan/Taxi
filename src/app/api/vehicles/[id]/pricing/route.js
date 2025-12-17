import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const vehicleId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    if (!vehicleId) {
      return NextResponse.json({
        error: 'Vehicle ID is required'
      }, { status: 400 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({
        error: 'Start date and end date are required'
      }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return NextResponse.json({
        error: 'End date must be after start date'
      }, { status: 400 });
    }

    if (start < new Date().setHours(0,0,0,0)) {
      return NextResponse.json({
        error: 'Start date cannot be in the past'
      }, { status: 400 });
    }

    // Get vehicle rate from agency_vehicles
    const vehicles = await query(
      'SELECT daily_rate FROM agency_vehicles WHERE vehicle_id = ?', 
      [vehicleId]
    );

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({
        error: 'Vehicle not found'
      }, { status: 404 });
    }

    const dailyRate = parseFloat(vehicles[0].daily_rate || 50);

    // Calculate number of days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simple pricing calculation
    const pricing = {
      days: diffDays,
      price_per_day: dailyRate,
      base_total: dailyRate * diffDays,
      is_holiday: false, // Defaulting to false as custom logic logic removed
      is_high_season: false
    };
    
    return NextResponse.json(pricing);

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json({
      error: 'Failed to calculate pricing',
      message: error.message
    }, { status: 500 });
  }
}
