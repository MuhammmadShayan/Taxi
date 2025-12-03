import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

// Seeds sample vehicles if the vehicles table is empty
export async function POST() {
  try {
    const existing = await query('SELECT COUNT(*) as cnt FROM vehicles');
    if (existing[0].cnt > 0) {
      return NextResponse.json({ skipped: true, reason: 'Vehicles already exist' });
    }

    // First, make sure we have agencies
    let agencies = await query('SELECT agency_id FROM agencies LIMIT 1');
    
    // Create a sample agency if none exists
    if (agencies.length === 0) {
      await query(`
        INSERT INTO users (role, first_name, last_name, email, password_hash, phone, city, country, status)
        VALUES ('agency_owner', 'Premium', 'Rentals', 'agency@example.com', '$2b$10$hash_here', '+212600123456', 'Casablanca', 'Morocco', 'active')
      `);
      
      const agencyUserId = (await query('SELECT LAST_INSERT_ID() as id'))[0].id;
      
      await query(`
        INSERT INTO agencies (user_id, business_name, description, contact_name, business_phone, business_email, 
        business_address, business_city, business_state, business_country, status)
        VALUES (?, 'Premium Car Rentals', 'Premium quality vehicles for rent', 'Ahmed Hassan', '+212600123456', 
        'info@premiumrentals.com', '123 Hassan II Boulevard', 'Casablanca', 'Casablanca-Settat', 'Morocco', 'approved')
      `, [agencyUserId]);
      
      agencies = await query('SELECT agency_id FROM agencies LIMIT 1');
    }

    const agencyId = agencies[0].agency_id;

    // Sample vehicles data
    const vehicles = [
      {
        agency_id: agencyId,
        category_id: 1, // Economy
        vehicle_number: 'MAR-001-A',
        type: 'small_car',
        brand: 'Renault',
        model: 'Clio',
        year: 2022,
        energy: 'petrol',
        gear_type: 'manual',
        doors: 5,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 0,
        bluetooth: 1,
        wifi: 0,
        price_low: 35,
        price_high: 45,
        price_holiday: 55,
        daily_rate: 35,
        weekly_rate: 220,
        monthly_rate: 800,
        deposit_amount: 200,
        mileage_limit: 200,
        extra_mileage_cost: 0.15,
        description: 'Compact and fuel-efficient car perfect for city driving',
        images: JSON.stringify(['/html-folder/images/car-img.jpg', '/html-folder/images/car-img2.jpg']),
        status: 'available'
      },
      {
        agency_id: agencyId,
        category_id: 2, // Compact
        vehicle_number: 'MAR-002-A',
        type: 'small_car',
        brand: 'Peugeot',
        model: '208',
        year: 2023,
        energy: 'petrol',
        gear_type: 'automatic',
        doors: 5,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 1,
        bluetooth: 1,
        wifi: 0,
        price_low: 45,
        price_high: 55,
        price_holiday: 65,
        daily_rate: 45,
        weekly_rate: 280,
        monthly_rate: 1000,
        deposit_amount: 250,
        mileage_limit: 200,
        extra_mileage_cost: 0.15,
        description: 'Modern compact car with automatic transmission and GPS',
        images: JSON.stringify(['/html-folder/images/car-img2.jpg', '/html-folder/images/car-img3.jpg']),
        status: 'available'
      },
      {
        agency_id: agencyId,
        category_id: 3, // SUV
        vehicle_number: 'MAR-003-A',
        type: 'suv',
        brand: 'Toyota',
        model: 'RAV4',
        year: 2023,
        energy: 'hybrid',
        gear_type: 'automatic',
        doors: 5,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 1,
        bluetooth: 1,
        wifi: 1,
        price_low: 75,
        price_high: 95,
        price_holiday: 115,
        daily_rate: 75,
        weekly_rate: 480,
        monthly_rate: 1800,
        deposit_amount: 400,
        mileage_limit: 200,
        extra_mileage_cost: 0.20,
        description: 'Spacious hybrid SUV perfect for families and long trips',
        images: JSON.stringify(['/html-folder/images/car-img3.jpg', '/html-folder/images/car-img4.jpg']),
        status: 'available'
      },
      {
        agency_id: agencyId,
        category_id: 4, // Luxury
        vehicle_number: 'MAR-004-A',
        type: 'luxury',
        brand: 'BMW',
        model: 'X3',
        year: 2023,
        energy: 'petrol',
        gear_type: 'automatic',
        doors: 5,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 1,
        bluetooth: 1,
        wifi: 1,
        price_low: 120,
        price_high: 150,
        price_holiday: 180,
        daily_rate: 120,
        weekly_rate: 750,
        monthly_rate: 2800,
        deposit_amount: 600,
        mileage_limit: 200,
        extra_mileage_cost: 0.25,
        description: 'Luxury SUV with premium features and excellent comfort',
        images: JSON.stringify(['/html-folder/images/car-img4.jpg', '/html-folder/images/car-img.jpg']),
        status: 'available'
      },
      {
        agency_id: agencyId,
        category_id: 1, // Economy
        vehicle_number: 'MAR-005-A',
        type: 'small_car',
        brand: 'Dacia',
        model: 'Logan',
        year: 2021,
        energy: 'petrol',
        gear_type: 'manual',
        doors: 4,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 0,
        bluetooth: 0,
        wifi: 0,
        price_low: 28,
        price_high: 38,
        price_holiday: 48,
        daily_rate: 28,
        weekly_rate: 180,
        monthly_rate: 650,
        deposit_amount: 150,
        mileage_limit: 200,
        extra_mileage_cost: 0.12,
        description: 'Budget-friendly reliable sedan for economical travel',
        images: JSON.stringify(['/html-folder/images/car-img.jpg', '/html-folder/images/car-img2.jpg']),
        status: 'available'
      },
      {
        agency_id: agencyId,
        category_id: 4, // Luxury
        vehicle_number: 'MAR-006-A',
        type: 'luxury',
        brand: 'Mercedes',
        model: 'E-Class',
        year: 2023,
        energy: 'diesel',
        gear_type: 'automatic',
        doors: 4,
        seats: 5,
        air_conditioning: 1,
        airbags: 1,
        navigation_system: 1,
        bluetooth: 1,
        wifi: 1,
        price_low: 140,
        price_high: 170,
        price_holiday: 200,
        daily_rate: 140,
        weekly_rate: 900,
        monthly_rate: 3200,
        deposit_amount: 700,
        mileage_limit: 200,
        extra_mileage_cost: 0.30,
        description: 'Premium executive sedan with luxury appointments',
        images: JSON.stringify(['/html-folder/images/car-img3.jpg', '/html-folder/images/car-img4.jpg']),
        status: 'available'
      }
    ];

    // Insert vehicles
    for (const vehicle of vehicles) {
      await query(`
        INSERT INTO vehicles (
          agency_id, category_id, vehicle_number, type, brand, model, year,
          energy, gear_type, doors, seats, air_conditioning, airbags,
          navigation_system, bluetooth, wifi, price_low, price_high, price_holiday,
          daily_rate, weekly_rate, monthly_rate, deposit_amount, mileage_limit,
          extra_mileage_cost, description, images, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        vehicle.agency_id, vehicle.category_id, vehicle.vehicle_number, vehicle.type,
        vehicle.brand, vehicle.model, vehicle.year, vehicle.energy, vehicle.gear_type,
        vehicle.doors, vehicle.seats, vehicle.air_conditioning, vehicle.airbags,
        vehicle.navigation_system, vehicle.bluetooth, vehicle.wifi, vehicle.price_low,
        vehicle.price_high, vehicle.price_holiday, vehicle.daily_rate, vehicle.weekly_rate,
        vehicle.monthly_rate, vehicle.deposit_amount, vehicle.mileage_limit,
        vehicle.extra_mileage_cost, vehicle.description, vehicle.images, vehicle.status
      ]);
    }

    return NextResponse.json({ 
      inserted: vehicles.length,
      message: `Successfully seeded ${vehicles.length} vehicles`
    });
  } catch (error) {
    console.error('POST /api/seed/vehicles error', error);
    return NextResponse.json({ 
      error: 'Seeding failed',
      message: error.message 
    }, { status: 500 });
  }
}
