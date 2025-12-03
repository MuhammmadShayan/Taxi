import { NextResponse } from 'next/server';
import { Vehicle } from '../../../../../models/Vehicle.js';

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

    // Get vehicle to ensure it exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json({
        error: 'Vehicle not found'
      }, { status: 404 });
    }

    // Skip availability check for now (can be added later)
    // TODO: Implement proper availability checking

    // Calculate pricing
    const pricing = await Vehicle.getPrice(vehicleId, startDate, endDate);
    
    if (!pricing) {
      return NextResponse.json({
        error: 'Unable to calculate pricing'
      }, { status: 500 });
    }

    return NextResponse.json(pricing);

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json({
      error: 'Failed to calculate pricing',
      message: error.message
    }, { status: 500 });
  }
}
