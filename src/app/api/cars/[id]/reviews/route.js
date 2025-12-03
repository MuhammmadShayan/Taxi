import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(_request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

		// Get reviews for the car
		const rows = await query(
			`SELECT * FROM car_reviews WHERE car_id = ? ORDER BY created_at DESC`,
			[id]
		);

		return NextResponse.json({ reviews: rows });
	} catch (error) {
		console.error('GET /api/cars/[id]/reviews error', error);
		return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
	}
}

export async function POST(request, { params }) {
	try {
		const { id: paramId } = await params;
		const id = Number(paramId);
		if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

		const body = await request.json();
		const { name, email, message, service, location, value_for_money, cleanliness, facilities } = body;

		if (!name || !email || !message) {
			return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
		}

		// Calculate overall rating
		const ratings = [service, location, value_for_money, cleanliness, facilities].filter(r => r > 0);
		const overall_rating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

		// Insert the review
		const result = await query(
			`INSERT INTO car_reviews (car_id, name, email, message, service, location, value_for_money, cleanliness, facilities, overall_rating, created_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
			[id, name, email, message, service || 0, location || 0, value_for_money || 0, cleanliness || 0, facilities || 0, overall_rating]
		);

		return NextResponse.json({ 
			message: 'Review submitted successfully', 
			reviewId: result.insertId 
		}, { status: 201 });
	} catch (error) {
		console.error('POST /api/cars/[id]/reviews error', error);
		return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
	}
}
