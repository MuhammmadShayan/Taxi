import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(_request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

		// Get the current car's category first
		const currentCarResult = await query(
			`SELECT category_id FROM cars WHERE id = ? LIMIT 1`,
			[id]
		);

		if (!currentCarResult || currentCarResult.length === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 });
		}

		const categoryId = currentCarResult[0].category_id;

		// Get related cars from the same category, excluding the current car
		const rows = await query(
			`SELECT c.*, cc.name AS category 
			 FROM cars c 
			 LEFT JOIN car_categories cc ON cc.id = c.category_id 
			 WHERE c.category_id = ? AND c.id != ? 
			 ORDER BY c.rating DESC 
			 LIMIT 6`,
			[categoryId, id]
		);

		return NextResponse.json({ cars: rows });
	} catch (error) {
		console.error('GET /api/cars/related/[id] error', error);
		return NextResponse.json({ error: 'Failed to fetch related cars' }, { status: 500 });
	}
}
