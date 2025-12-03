import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

export async function GET() {
  try {
    // Get platform statistics
    const stats = await getPlatformStats();
    
    return NextResponse.json({
      totalVehicles: stats.vehicles || 0,
      totalAgencies: stats.agencies || 0,
      totalReservations: stats.reservations || 0,
      totalUsers: stats.users || 0,
      activeAgencies: stats.activeAgencies || 0,
      completedReservations: stats.completedReservations || 0,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    
    // Return fallback stats if database is not available
    return NextResponse.json({
      totalVehicles: 150,
      totalAgencies: 25,
      totalReservations: 1200,
      totalUsers: 500,
      activeAgencies: 20,
      completedReservations: 950,
      lastUpdated: new Date().toISOString(),
      note: 'Fallback data - database connection needed for real stats'
    });
  }
}

async function getPlatformStats() {
  try {
    // Count vehicles
    const vehicleCountResult = await query(
      `SELECT COUNT(*) as count FROM vehicles v 
       JOIN agencies a ON v.agency_id = a.id 
       WHERE v.is_available = 1 AND a.status = 'accepted'`
    );

    // Count agencies
    const agencyCountResult = await query(
      `SELECT COUNT(*) as count FROM agencies WHERE status = 'accepted' AND is_active = 1`
    );

    // Count reservations
    const reservationCountResult = await query(
      `SELECT COUNT(*) as count FROM reservations`
    );

    // Count users
    const userCountResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE is_active = 1`
    );

    // Count completed reservations
    const completedReservationsResult = await query(
      `SELECT COUNT(*) as count FROM reservations WHERE status = 'completed'`
    );

    return {
      vehicles: vehicleCountResult[0]?.count || 0,
      agencies: agencyCountResult[0]?.count || 0,
      reservations: reservationCountResult[0]?.count || 0,
      users: userCountResult[0]?.count || 0,
      activeAgencies: agencyCountResult[0]?.count || 0,
      completedReservations: completedReservationsResult[0]?.count || 0
    };
  } catch (error) {
    console.error('Database stats query error:', error);
    throw error;
  }
}
