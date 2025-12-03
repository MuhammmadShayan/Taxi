import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(_request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
		const rows = await query(
			`SELECT c.*, cc.name AS category FROM cars c LEFT JOIN car_categories cc ON cc.id = c.category_id WHERE c.id = ? LIMIT 1`,
			[id]
		);
		if (!rows || rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
		return NextResponse.json({ car: rows[0] });
	} catch (error) {
		console.error('GET /api/cars/[id] error', error);
		return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
		
		const body = await request.json();
		const {
			category_id,
			make,
			model,
			year,
			color,
			license_plate,
			seats,
			luggage_capacity,
			fuel_type,
			transmission,
			price_per_day,
			price_per_hour,
			features,
			images,
			description,
			is_available,
			location,
			mileage,
			rating
		} = body;

		const result = await query(
			`UPDATE cars SET 
				category_id = ?, make = ?, model = ?, year = ?, color = ?, 
				license_plate = ?, seats = ?, luggage_capacity = ?, fuel_type = ?, 
				transmission = ?, price_per_day = ?, price_per_hour = ?, 
				features = ?, images = ?, description = ?, is_available = ?, 
				location = ?, mileage = ?, rating = ?, updated_at = NOW()
			WHERE id = ?`,
			[
				category_id, make, model, year, color, license_plate,
				seats, luggage_capacity, fuel_type, transmission,
				price_per_day, price_per_hour,
				features ? JSON.stringify(features) : null,
				images ? JSON.stringify(images) : null,
				description, is_available, location, mileage, rating, id
			]
		);

		if (result.affectedRows === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true, message: 'Car updated successfully' });
	} catch (error) {
		console.error('PUT /api/cars/[id] error', error);
		return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
	}
}

export async function DELETE(_request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

		// Check if car exists
		const existingCar = await query('SELECT id FROM cars WHERE id = ?', [id]);
		if (!existingCar || existingCar.length === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 });
		}

		// Soft delete by setting is_available to false
		const result = await query(
			'UPDATE cars SET is_available = FALSE, updated_at = NOW() WHERE id = ?',
			[id]
		);

		return NextResponse.json({ success: true, message: 'Car deleted successfully' });
	} catch (error) {
		console.error('DELETE /api/cars/[id] error', error);
		return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
	}
}


