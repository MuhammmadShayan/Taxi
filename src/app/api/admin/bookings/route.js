import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getBookingsList, batchUpdateBookings } from '../../../../lib/optimizedQueries.js';
import { handleAPIError } from '../../../../lib/errorHandler.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    // Use optimized booking list function
    const filters = {
      status,
      page,
      limit,
      sortBy,
      sortOrder
    };

    const result = await getBookingsList(filters);

    return NextResponse.json({
      success: true,
      bookings: result.bookings,
      pagination: result.pagination
    });

  } catch (error) {
    return handleAPIError(error, 'Failed to fetch admin bookings');
  }
}

// Add batch update capability
export async function PUT(request) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Updates array is required'
      }, { status: 400 });
    }

    // Use optimized batch update function
    const result = await batchUpdateBookings(updates);

    return NextResponse.json({
      success: true,
      updated_count: result.updatedCount,
      message: `Successfully updated ${result.updatedCount} bookings`
    });

  } catch (error) {
    return handleAPIError(error, 'Failed to batch update bookings');
  }
}

