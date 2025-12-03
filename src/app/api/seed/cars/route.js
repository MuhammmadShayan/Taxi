import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

// Seeds a handful of realistic cars if the cars table is empty
export async function POST() {
	try {
		const existing = await query('SELECT COUNT(*) as cnt FROM cars');
		if (existing[0].cnt > 0) {
			return NextResponse.json({ skipped: true, reason: 'Cars already exist' });
		}

		const cars = [
			{
				category_id: 1,
				make: 'Toyota',
				model: 'Corolla',
				year: 2021,
				color: 'White',
				license_plate: 'KRA-101',
				seats: 5,
				luggage_capacity: 2,
				fuel_type: 'petrol',
				transmission: 'automatic',
				price_per_day: 35,
				price_per_hour: 6,
				features: ['Air Conditioning', 'Bluetooth', 'USB'],
				images: ['/html-folder/images/car-img.png'],
				description: 'Reliable and fuel-efficient sedan',
				is_available: 1,
				location: 'Nairobi',
				mileage: 32000,
				rating: 4.5,
			},
			{
				category_id: 10,
				make: 'Toyota',
				model: 'RAV4',
				year: 2022,
				color: 'Silver',
				license_plate: 'KRA-202',
				seats: 5,
				luggage_capacity: 3,
				fuel_type: 'hybrid',
				transmission: 'automatic',
				price_per_day: 65,
				price_per_hour: 11,
				features: ['AWD', 'Adaptive Cruise', 'Apple CarPlay'],
				images: ['/html-folder/images/car-img.png'],
				description: 'Spacious SUV for city or safari',
				is_available: 1,
				location: 'Mombasa',
				mileage: 18000,
				rating: 4.7,
			},
			{
				category_id: 6,
				make: 'Mercedes-Benz',
				model: 'E200',
				year: 2020,
				color: 'Black',
				license_plate: 'KRA-303',
				seats: 5,
				luggage_capacity: 3,
				fuel_type: 'petrol',
				transmission: 'automatic',
				price_per_day: 120,
				price_per_hour: 20,
				features: ['Leather Seats', 'Sunroof', 'GPS'],
				images: ['/html-folder/images/car-img.png'],
				description: 'Premium executive sedan',
				is_available: 1,
				location: 'Nairobi',
				mileage: 45000,
				rating: 4.8,
			},
		];

		for (const c of cars) {
			await query(
				`INSERT INTO cars (category_id, make, model, year, color, license_plate, seats, luggage_capacity, fuel_type, transmission, price_per_day, price_per_hour, features, images, description, is_available, location, mileage, rating)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					c.category_id,
					c.make,
					c.model,
					c.year,
					c.color,
					c.license_plate,
					c.seats,
					c.luggage_capacity,
					c.fuel_type,
					c.transmission,
					c.price_per_day,
					c.price_per_hour,
					JSON.stringify(c.features),
					JSON.stringify(c.images),
					c.description,
					c.is_available,
					c.location,
					c.mileage,
					c.rating,
				]
			);
		}

		return NextResponse.json({ inserted: cars.length });
	} catch (error) {
		console.error('POST /api/seed/cars error', error);
		return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
	}
}


