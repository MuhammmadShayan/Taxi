import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET() {
  try {
    // Get driver statistics
    const [
      totalDrivers,
      activeDrivers,
      pendingDrivers,
      avgRating,
      totalTrips,
      approvedDrivers,
      rejectedDrivers,
      underReviewDrivers
    ] = await Promise.all([
      // Total drivers
      query('SELECT COUNT(*) as count FROM drivers'),
      
      // Active drivers (approved and available)
      query('SELECT COUNT(*) as count FROM drivers WHERE application_status = "approved" AND is_available = 1'),
      
      // Pending approval
      query('SELECT COUNT(*) as count FROM drivers WHERE application_status = "pending"'),
      
      // Average rating
      query('SELECT ROUND(AVG(rating), 1) as avg_rating FROM drivers WHERE rating > 0'),
      
      // Total trips
      query('SELECT SUM(total_trips) as total FROM drivers'),
      
      // Approved drivers
      query('SELECT COUNT(*) as count FROM drivers WHERE application_status = "approved"'),
      
      // Rejected drivers
      query('SELECT COUNT(*) as count FROM drivers WHERE application_status = "rejected"'),
      
      // Under review drivers
      query('SELECT COUNT(*) as count FROM drivers WHERE application_status = "under_review"')
    ]);

    const stats = {
      totalDrivers: totalDrivers[0]?.count || 0,
      activeDrivers: activeDrivers[0]?.count || 0,
      pendingDrivers: pendingDrivers[0]?.count || 0,
      approvedDrivers: approvedDrivers[0]?.count || 0,
      rejectedDrivers: rejectedDrivers[0]?.count || 0,
      underReviewDrivers: underReviewDrivers[0]?.count || 0,
      averageRating: avgRating[0]?.avg_rating || 0,
      totalTrips: totalTrips[0]?.total || 0
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Driver stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch driver statistics' },
      { status: 500 }
    );
  }
}
