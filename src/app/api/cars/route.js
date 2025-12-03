import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		
		// Extract filter parameters
		const filters = {
			category: searchParams.get('category') || '',
			transmission: searchParams.get('transmission') || '',
			fuel_type: searchParams.get('fuel_type') || '',
			min_price: searchParams.get('min_price') || '',
			max_price: searchParams.get('max_price') || '',
			seats: searchParams.get('seats') || '',
			location: searchParams.get('location') || ''
		};

		// Get vehicles from database using agency_vehicles table
		let sql = `
			SELECT av.*, 
			       a.business_name as agency_name,
			       vc.name as category_name
			FROM agency_vehicles av 
			LEFT JOIN agencies a ON av.agency_id = a.agency_id
			LEFT JOIN vehicle_categories vc ON av.category_id = vc.category_id
			WHERE av.status = 'available'
		`;
		const params = [];

		// Apply filters
		if (filters.category && filters.category !== 'all') {
			sql += ' AND vc.name = ?';
			params.push(filters.category);
		}

		if (filters.transmission && filters.transmission !== 'all') {
			sql += ' AND av.gear_type = ?';
			params.push(filters.transmission);
		}

		if (filters.fuel_type && filters.fuel_type !== 'all') {
			sql += ' AND av.energy = ?';
			params.push(filters.fuel_type);
		}

		if (filters.min_price) {
			sql += ' AND av.price_low >= ?';
			params.push(parseFloat(filters.min_price));
		}

		if (filters.max_price) {
			sql += ' AND av.price_low <= ?';
			params.push(parseFloat(filters.max_price));
		}

		if (filters.seats) {
			sql += ' AND av.seats >= ?';
			params.push(parseInt(filters.seats));
		}

		sql += ' ORDER BY av.created_at DESC';

		const vehicles = await query(sql, params);

		// Map vehicles to cars format for backward compatibility
		const cars = vehicles.map(v => ({
			id: v.vehicle_id,
			make: v.brand,
			model: v.model,
			year: v.year,
			price_per_day: v.price_low || v.daily_rate,
			price_per_hour: Math.round((v.price_low || v.daily_rate) / 24),
			seats: v.seats,
			energy: v.energy,
			gear_type: v.gear_type,
			images: v.images,
			features: v.description, // Using description as features for now
			description: v.description,
			is_available: v.status === 'available',
			category_name: v.category_name,
			agency_name: v.agency_name,
			created_at: v.created_at
		}));

		return NextResponse.json({
			success: true,
			cars: cars,
			count: cars.length
		});

	} catch (error) {
		console.error('Cars API error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch cars' },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const body = await request.json();
		const {
			category_id,
			agency_id = 1, // Default agency
			make,
			model,
			year,
			seats,
			fuel_type,
			transmission,
			price_per_day,
			features = null,
			images = null,
			description = null,
			is_available = 1
		} = body;

		// Map fuel_type to energy enum
		let energy = 'petrol';
		if (fuel_type) {
			switch (fuel_type.toLowerCase()) {
				case 'gasoline':
				case 'petrol':
					energy = 'petrol';
					break;
				case 'diesel':
					energy = 'diesel';
					break;
				case 'electric':
					energy = 'electric';
					break;
				case 'hybrid':
					energy = 'hybrid';
					break;
				default:
					energy = 'petrol';
			}
		}

		// Map transmission to gear_type enum
		let gear_type = 'manual';
		if (transmission) {
			switch (transmission.toLowerCase()) {
				case 'automatic':
				case 'cvt':
					gear_type = 'automatic';
					break;
				case 'manual':
				default:
					gear_type = 'manual';
			}
		}

		const result = await query(
			`INSERT INTO vehicles (agency_id, vehicle_number, category_id, brand, model, year, energy, gear_type, doors, seats, air_conditioning, air_bags, navigation_system, low_price, high_price, holidays_price, description, features, images, is_available)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				agency_id,
				`VEHICLE-${Date.now()}`, // Generate unique vehicle number
				category_id,
				make, // brand
				model,
				year,
				energy,
				gear_type,
				4, // doors (default)
				seats,
				1, // air_conditioning (default yes)
				1, // air_bags (default yes)
				1, // navigation_system (default yes)
				price_per_day, // low_price
				price_per_day * 1.5, // high_price (50% higher)
				price_per_day * 2, // holidays_price (double)
				description,
				features ? JSON.stringify(features) : null,
				images ? JSON.stringify(images) : null,
				is_available
			]
		);

		return NextResponse.json({ id: result.insertId }, { status: 201 });
	} catch (error) {
		console.error('POST /api/cars error', error);
		return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
	}
}


