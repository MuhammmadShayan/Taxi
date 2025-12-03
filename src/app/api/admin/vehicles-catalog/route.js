import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const search = searchParams.get('search') || '';
    const source = searchParams.get('source') || '';
    const make = searchParams.get('make') || '';
    const status = searchParams.get('status') || 'all';
    const offset = (page - 1) * limit;

    // Build WHERE clause for filters
    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (search) {
      whereClause += ' AND (make LIKE ? OR model LIKE ? OR CONCAT(make, " ", model) LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (source) {
      whereClause += ' AND source = ?';
      queryParams.push(source);
    }

    if (make) {
      whereClause += ' AND make = ?';
      queryParams.push(make);
    }

    if (status !== 'all') {
      whereClause += ' AND status = ?';
      queryParams.push(status);
    }

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM vehicles ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const totalVehicles = countResult[0].total;
    const totalPages = Math.ceil(totalVehicles / limit);

    // Get vehicles
    const vehiclesQuery = `
      SELECT 
        id,
        make,
        model,
        year,
        daily_rate,
        price_usd,
        mileage,
        location,
        energy,
        gear_type,
        seats,
        doors,
        color,
        body_type,
        trim,
        images,
        description,
        source,
        source_url,
        status,
        created_at,
        updated_at,
        CONCAT(make, ' ', model, ' ', year) as display_name,
        CASE 
          WHEN images IS NOT NULL AND images != '[]' THEN 'Yes'
          ELSE 'No'
        END as has_images,
        CASE
          WHEN daily_rate IS NOT NULL THEN CONCAT('$', FORMAT(daily_rate, 2), '/day')
          WHEN price_usd IS NOT NULL THEN CONCAT('$', FORMAT(price_usd, 0))
          ELSE 'N/A'
        END as price_display
      FROM vehicles 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const finalParams = [...queryParams, limit, offset];
    const vehicles = await query(vehiclesQuery, finalParams);
    
    // Process vehicles data
    const processedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      images: vehicle.images ? JSON.parse(vehicle.images) : [],
      is_new: (new Date() - new Date(vehicle.created_at)) / (1000 * 60 * 60 * 24) <= 7 // Less than 7 days old
    }));

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_vehicles,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_vehicles,
        COUNT(CASE WHEN images IS NOT NULL AND images != '[]' THEN 1 END) as vehicles_with_images,
        COUNT(CASE WHEN daily_rate IS NOT NULL THEN 1 END) as vehicles_with_pricing,
        COUNT(DISTINCT make) as unique_makes,
        COUNT(DISTINCT source) as unique_sources,
        AVG(CASE WHEN daily_rate IS NOT NULL THEN daily_rate END) as avg_daily_rate,
        MIN(year) as oldest_year,
        MAX(year) as newest_year
      FROM vehicles 
      ${whereClause}
    `;

    const statsResult = await query(statsQuery, queryParams);
    const statistics = {
      ...statsResult[0],
      avg_daily_rate: parseFloat(statsResult[0]?.avg_daily_rate || 0).toFixed(2),
      image_coverage: totalVehicles > 0 ? ((statsResult[0].vehicles_with_images / totalVehicles) * 100).toFixed(1) : 0,
      pricing_coverage: totalVehicles > 0 ? ((statsResult[0].vehicles_with_pricing / totalVehicles) * 100).toFixed(1) : 0
    };

    // Get unique makes and sources for filters
    const makesQuery = `SELECT DISTINCT make FROM vehicles WHERE make IS NOT NULL ORDER BY make`;
    const sourcesQuery = `SELECT DISTINCT source FROM vehicles WHERE source IS NOT NULL ORDER BY source`;
    
    const [makes, sources] = await Promise.all([
      query(makesQuery),
      query(sourcesQuery)
    ]);

    const pagination = {
      page,
      pages: totalPages,
      total: totalVehicles,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    return NextResponse.json({
      success: true,
      vehicles: processedVehicles,
      pagination,
      statistics,
      filters: {
        makes: makes.map(m => m.make),
        sources: sources.map(s => s.source)
      }
    });

  } catch (error) {
    console.error('Error fetching vehicles catalog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicles catalog' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();

    if (action === 'scrape') {
      // Trigger vehicle scraping
      const { scrapeAllSources } = await import('../../../../lib/vehicles-scraper.js');
      
      const results = await scrapeAllSources({
        carsdotcomPages: data.pages || 2,
        autotraderPages: data.pages || 2,
        cargurusPages: data.pages || 2,
        enableAllSources: data.enableAllSources || false
      });

      return NextResponse.json({
        success: true,
        message: 'Vehicle scraping completed',
        results
      });
    }

    if (action === 'update_status') {
      const { vehicleId, status } = data;
      
      await query(
        'UPDATE vehicles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, vehicleId]
      );

      return NextResponse.json({
        success: true,
        message: 'Vehicle status updated successfully'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in vehicles catalog POST:', error);
    return NextResponse.json(
      { success: false, message: 'Operation failed', error: error.message },
      { status: 500 }
    );
  }
}
