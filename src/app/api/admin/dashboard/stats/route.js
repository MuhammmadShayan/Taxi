import { NextResponse } from 'next/server';
import { getBookingStats } from '../../../../../lib/optimizedQueries.js';
import { handleAPIError } from '../../../../../lib/errorHandler.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agency_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Use optimized booking statistics function
    const filters = {};
    
    if (agencyId) filters.agencyId = parseInt(agencyId);
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    const stats = await getBookingStats(filters);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return handleAPIError(error, 'Failed to fetch booking statistics');
  }
}
