import { NextResponse } from 'next/server';
import { saveCarBookingSearch } from '../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { pickup_location, pickup_date, pickup_time, dropoff_date, dropoff_time } = body;

    // Validate required fields
    if (!pickup_location || !pickup_date || !pickup_time || !dropoff_date || !dropoff_time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate dates
    const pickupDateTime = new Date(`${pickup_date}T${pickup_time}`);
    const dropoffDateTime = new Date(`${dropoff_date}T${dropoff_time}`);
    const now = new Date();

    if (pickupDateTime < now) {
      return NextResponse.json(
        { error: 'Pickup date and time cannot be in the past' },
        { status: 400 }
      );
    }

    if (dropoffDateTime <= pickupDateTime) {
      return NextResponse.json(
        { error: 'Drop-off date and time must be after pickup date and time' },
        { status: 400 }
      );
    }

    // Save to database
    const searchId = await saveCarBookingSearch({
      pickup_location,
      pickup_date,
      pickup_time,
      dropoff_date,
      dropoff_time
    });

    return NextResponse.json({
      success: true,
      message: 'Search saved successfully',
      search_id: searchId
    });

  } catch (error) {
    console.error('Car search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
