import '../../../../lib/polyfills/runtime.js';
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import { scrapeCarsComToVehicles, enrichExistingVehicles, checkTargetReachability } from '../../../../lib/vehicles-scraper.js';

// Supported scraping sources
const SUPPORTED_SOURCES = ['pakwheels', 'carscom', 'autotrader', 'cargurus', 'carmax', 'vroom'];
const MAX_PAGES_PER_SITE = 200;

/**
 * POST - Start car scraping process
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      pakwheelsPages = 2, 
      carsdotcomPages = 2,
      autotraderPages = 2,
      cargurusPages = 2,
      carmaxPages = 2,
      vroomPages = 2,
      includeAllSources = false,
      apiKey,
      action = 'scrape' // 'scrape' or 'enrich'
    } = body;
    const headerApiKey = request.headers.get('x-api-key');
    const effectiveApiKey = apiKey || headerApiKey;
    
    // Verify API key (basic security check)
    if (!effectiveApiKey || effectiveApiKey !== "AIzaSyA760-E0vJztYtAzbhKgcs8rf6EOhMm-bk") {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    console.log('Starting car scraping process...');
    console.log('PakWheels pages:', pakwheelsPages);
    console.log('Cars.com pages:', carsdotcomPages);
    if (includeAllSources) {
      console.log('AutoTrader pages:', autotraderPages);
      console.log('CarGurus pages:', cargurusPages);
      console.log('CarMax pages:', carmaxPages);
      console.log('Vroom pages:', vroomPages);
    }
    
    // Validate page limits for all sources
    const pageValidations = [
      { value: pakwheelsPages, name: 'PakWheels' },
      { value: carsdotcomPages, name: 'Cars.com' }
    ];
    
    if (includeAllSources) {
      pageValidations.push(
        { value: autotraderPages, name: 'AutoTrader' },
        { value: cargurusPages, name: 'CarGurus' },
        { value: carmaxPages, name: 'CarMax' },
        { value: vroomPages, name: 'Vroom' }
      );
    }
    
    for (const page of pageValidations) {
      if (page.value < 1 || page.value > MAX_PAGES_PER_SITE) {
        return NextResponse.json(
          { error: `${page.name} pages must be between 1 and ${MAX_PAGES_PER_SITE}` },
          { status: 400 }
        );
      }
    }

    // Light existence check; schema will be ensured by scraper
    try { await query('SELECT 1 FROM vehicles LIMIT 1'); } catch (e) {}

    // Handle different actions
    if (action === 'enrich') {
      console.log('Starting vehicle data enrichment process...');
      const reach = await checkTargetReachability('https://www.cars.com');
      console.log('Reachability', reach);
      const enrichmentResult = await enrichExistingVehicles({
        batchSize: 50,
        maxVehicles: carsdotcomPages * 20 // Use pages as multiplier for max vehicles to enrich
      });
      
      return NextResponse.json({
        success: true,
        message: 'Vehicle data enrichment completed successfully',
        data: {
          totalProcessed: enrichmentResult.totalProcessed,
          totalEnriched: enrichmentResult.totalEnriched,
          totalFailed: enrichmentResult.totalFailed,
          enrichedVehicles: enrichmentResult.enriched.slice(0, 20).map(vehicle => ({
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            fieldsAdded: vehicle.fieldsAdded,
            hasImage: vehicle.hasImage
          })),
          failedVehicles: enrichmentResult.failed.slice(0, 10).map(vehicle => ({
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            error: vehicle.error
          })),
          warnings: reach.reachable ? [] : [`Target site ${reach.url} not reachable via ${reach.method || 'N/A'} (${reach.reason || 'unknown'})`]
        }
      });
    } else {
      // Default scraping action - only scrape vehicles that don't exist
      console.log('Starting smart car scraping process (existing vehicles will be skipped)...');
      const reach = await checkTargetReachability('https://www.cars.com');
      console.log('Reachability', reach);
      const scrapingResult = await scrapeCarsComToVehicles({
        carsdotcomPages,
        skipExisting: true,
        maxVehicles: carsdotcomPages * 20
      });

      return NextResponse.json({
        success: true,
        message: 'Smart car scraping completed successfully',
        data: {
          totalScraped: scrapingResult.totalScraped,
          uniqueCars: scrapingResult.uniqueCars,
          totalSaved: scrapingResult.totalSaved,
          totalFailed: scrapingResult.totalFailed,
          totalSkipped: scrapingResult.totalSkipped || 0,
          savedCars: scrapingResult.saved.slice(0, 20).map(car => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year,
            source: car.source,
            daily_rate: car.daily_rate,
            location: car.location,
            image_path: car.image_path
          })),
          failedCars: scrapingResult.failed.slice(0, 10).map(car => ({
            make: car.make,
            model: car.model,
            year: car.year,
            source: car.source,
            error: car.error
          })),
          warnings: reach.reachable ? [] : [`Target site ${reach.url} not reachable via ${reach.method || 'N/A'} (${reach.reason || 'unknown'})`]
        }
      });
    }

  } catch (error) {
    console.error('Car scraping error:', error);
    return NextResponse.json({
      error: 'Failed to scrape cars',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET - Get scraping status/info
 */
export async function GET() {
  try {
    // Get vehicle count
    const vehicleCountResult = await query('SELECT COUNT(*) as count FROM vehicles');
    const vehicleCount = vehicleCountResult[0]?.count || 0;

    // Get recent vehicles (last 10)
    const recentVehicles = await query(`
      SELECT id, make as brand, model, year, daily_rate as price_per_day
      FROM vehicles 
      ORDER BY id DESC 
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      message: 'Car scraping API is ready',
      data: {
        carCount: vehicleCount,
        recentCars: recentVehicles,
        supportedSources: SUPPORTED_SOURCES,
        maxPagesPerSite: MAX_PAGES_PER_SITE,
        maxCarsRecommended: 100
      }
    });

  } catch (error) {
    console.error('Get scraping info error:', error);
    return NextResponse.json({
      error: 'Failed to get scraping information',
      details: error.message
    }, { status: 500 });
  }
}
