import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.user_type !== 'agency_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get agency settings (you can customize these based on your needs)
    const defaultSettings = {
      default_commission: 15,
      booking_cancellation_hours: 24,
      min_driver_age: 21,
      max_rental_days: 30,
      notifications: {
        booking: true,
        payment: true,
        review: true,
        system: true
      }
    };

    return NextResponse.json({
      success: true,
      settings: defaultSettings
    });

  } catch (error) {
    console.error('Error fetching agency settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.user_type !== 'agency_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await request.json();

    // Validate settings
    if (settings.default_commission < 0 || settings.default_commission > 100) {
      return NextResponse.json({ error: 'Commission must be between 0 and 100' }, { status: 400 });
    }

    if (settings.min_driver_age < 18 || settings.min_driver_age > 80) {
      return NextResponse.json({ error: 'Driver age must be between 18 and 80' }, { status: 400 });
    }

    // Here you could save to database if you have an agency_settings table
    // For now, we'll just return success
    console.log('Agency settings updated:', settings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating agency settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
