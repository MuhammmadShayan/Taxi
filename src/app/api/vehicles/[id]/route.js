import { NextResponse } from 'next/server';
import { Vehicle } from '../../../../models/Vehicle.js';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const vehicleId = resolvedParams.id;
    
    if (!vehicleId) {
      return NextResponse.json({
        error: 'Vehicle ID is required'
      }, { status: 400 });
    }

    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return NextResponse.json({
        error: 'Vehicle not found'
      }, { status: 404 });
    }

    // Calculate pricing for today's date to give an example
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const pricing = await Vehicle.getPrice(vehicleId, todayStr, tomorrowStr);
    
    return NextResponse.json({
      ...vehicle,
      pricing
    });

  } catch (error) {
    console.error('Vehicle fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch vehicle details',
      message: error.message
    }, { status: 500 });
  }
}
