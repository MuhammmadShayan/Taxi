import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db.js';
import { getBookingWithDetails } from '../../../../lib/optimizedQueries.js';
import { handleAPIError } from '../../../../lib/errorHandler.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('Fetching booking with optimized function, ID:', id);

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required'
      }, { status: 400 });
    }

    // Use optimized single-query booking retrieval
    const booking = await getBookingWithDetails(id);
    
    console.log('✅ Optimized booking retrieval completed:', {
      id: booking.reservation_id,
      vehicle: booking.vehicle_name,
      status: booking.status,
      extrasCount: booking.extras?.length || 0
    });

    return NextResponse.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    return handleAPIError(error, 'Failed to fetch booking details');
  }
}
