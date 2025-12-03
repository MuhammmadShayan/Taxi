import { NextResponse } from 'next/server';
import { scrapeAllSources, scrapeCarsComToVehicles } from '../../../../lib/vehicles-scraper.js';
import { query } from '../../../../lib/database.js';

export async function POST(request) {
    try {
        const { 
            sources = ['cars.com'], 
            pages = 2, 
            enableAllSources = false 
        } = await request.json();

        console.log('🚀 Starting vehicle scraping with options:', { sources, pages, enableAllSources });

        let results;
        
        if (enableAllSources || sources.length > 1) {
            // Use comprehensive multi-source scraper
            results = await scrapeAllSources({
                carsdotcomPages: pages,
                autotraderPages: pages,
                cargurusPages: pages,
                enableAllSources
            });
        } else {
            // Use single source scraper (Cars.com by default)
            results = await scrapeCarsComToVehicles({
                carsdotcomPages: pages
            });
        }

        // Get updated vehicle count
        const totalVehicles = await query('SELECT COUNT(*) as count FROM vehicles');
        const vehicleCount = totalVehicles[0]?.count || 0;

        console.log('✅ Scraping completed:', results);

        return NextResponse.json({
            success: true,
            message: `Vehicle scraping completed successfully`,
            results: {
                ...results,
                totalInDatabase: vehicleCount,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Vehicle scraping failed:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Vehicle scraping failed', 
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const source = searchParams.get('source');
        const make = searchParams.get('make');

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (source) {
            whereClause += ' AND source = ?';
            params.push(source);
        }

        if (make) {
            whereClause += ' AND make LIKE ?';
            params.push(`%${make}%`);
        }

        // Get vehicles with pagination
        const vehicles = await query(
            `SELECT id, make, model, year, daily_rate, price_usd, mileage, 
                    location, energy, gear_type, seats, doors, images, source, 
                    created_at, updated_at 
             FROM vehicles 
             ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        // Get total count
        const totalCount = await query(
            `SELECT COUNT(*) as count FROM vehicles ${whereClause}`,
            params
        );

        // Parse images field for each vehicle
        const vehiclesWithImages = vehicles.map(vehicle => ({
            ...vehicle,
            images: vehicle.images ? JSON.parse(vehicle.images) : []
        }));

        return NextResponse.json({
            success: true,
            vehicles: vehiclesWithImages,
            pagination: {
                total: totalCount[0]?.count || 0,
                limit,
                offset,
                hasMore: (offset + limit) < (totalCount[0]?.count || 0)
            }
        });

    } catch (error) {
        console.error('❌ Failed to fetch vehicles:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch vehicles', 
                message: error.message 
            },
            { status: 500 }
        );
    }
}
