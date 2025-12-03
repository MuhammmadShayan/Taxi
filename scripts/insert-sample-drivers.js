const mysql = require('mysql2/promise');

async function insertSampleDrivers() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kirastay',
      port: Number(process.env.DB_PORT || 3306),
    });

    console.log('Connected to database...');

    // First, create some sample users
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        password: '$2a$12$sample_hashed_password',
        user_type: 'driver',
        first_name: 'John',
        last_name: 'Doe',
        is_active: true,
        email_verified: true
      },
      {
        email: 'jane.smith@example.com',
        password: '$2a$12$sample_hashed_password',
        user_type: 'driver',
        first_name: 'Jane',
        last_name: 'Smith',
        is_active: true,
        email_verified: true
      },
      {
        email: 'mike.johnson@example.com',
        password: '$2a$12$sample_hashed_password',
        user_type: 'driver',
        first_name: 'Mike',
        last_name: 'Johnson',
        is_active: true,
        email_verified: true
      },
      {
        email: 'sarah.wilson@example.com',
        password: '$2a$12$sample_hashed_password',
        user_type: 'driver',
        first_name: 'Sarah',
        last_name: 'Wilson',
        is_active: true,
        email_verified: true
      },
      {
        email: 'david.brown@example.com',
        password: '$2a$12$sample_hashed_password',
        user_type: 'driver',
        first_name: 'David',
        last_name: 'Brown',
        is_active: true,
        email_verified: true
      }
    ];

    // Insert users
    console.log('Inserting sample users...');
    const userInsertQuery = `
      INSERT INTO users (email, password, user_type, first_name, last_name, is_active, email_verified) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      first_name = VALUES(first_name),
      last_name = VALUES(last_name)
    `;

    const userIds = [];
    for (const user of sampleUsers) {
      const [result] = await connection.execute(userInsertQuery, [
        user.email,
        user.password,
        user.user_type,
        user.first_name,
        user.last_name,
        user.is_active,
        user.email_verified
      ]);
      userIds.push(result.insertId || result.insertId);
    }

    // Get actual user IDs for existing users
    const existingUsers = await connection.execute(
      'SELECT id, email FROM users WHERE user_type = "driver" ORDER BY id LIMIT 5'
    );

    const actualUserIds = existingUsers[0].map(user => user.id);

    // Sample driver data
    const sampleDrivers = [
      {
        user_id: actualUserIds[0] || 1,
        license_number: 'DL123456789',
        license_expiry: '2025-12-31',
        license_class: 'Class A',
        commercial_license: true,
        phone: '+1-555-123-4567',
        address: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zip_code: '10001',
        date_of_birth: '1985-06-15',
        gender: 'male',
        experience_years: 8,
        previous_company: 'Yellow Cab Co.',
        has_own_vehicle: true,
        vehicle_make: 'Toyota',
        vehicle_model: 'Camry',
        vehicle_year: 2020,
        vehicle_plate: 'NYC-1234',
        vehicle_types: JSON.stringify(['sedan', 'suv']),
        services_offered: JSON.stringify(['airport_transfer', 'city_tour', 'business_trips']),
        languages_spoken: JSON.stringify(['English', 'Spanish']),
        emergency_contact_name: 'Mary Doe',
        emergency_contact_phone: '+1-555-987-6543',
        about: 'Professional driver with 8 years of experience. Safe and reliable.',
        why_join: 'Looking to provide excellent service to customers.',
        availability_hours: '24/7',
        preferred_areas: 'Manhattan, Brooklyn',
        application_status: 'approved',
        is_available: true,
        is_active: true,
        rating: 4.8,
        total_trips: 156,
        total_earnings: 15600.50,
        documents_verified: true,
        background_check_status: 'approved',
        background_check_consent: true,
        marketing_consent: true
      },
      {
        user_id: actualUserIds[1] || 2,
        license_number: 'DL987654321',
        license_expiry: '2026-06-30',
        license_class: 'Class B',
        commercial_license: false,
        phone: '+1-555-234-5678',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        zip_code: '90210',
        date_of_birth: '1990-03-22',
        gender: 'female',
        experience_years: 5,
        previous_company: 'Uber',
        has_own_vehicle: true,
        vehicle_make: 'Honda',
        vehicle_model: 'Civic',
        vehicle_year: 2019,
        vehicle_plate: 'CA-5678',
        vehicle_types: JSON.stringify(['sedan']),
        services_offered: JSON.stringify(['city_rides', 'airport_transfer']),
        languages_spoken: JSON.stringify(['English']),
        emergency_contact_name: 'Robert Smith',
        emergency_contact_phone: '+1-555-876-5432',
        about: 'Friendly and experienced driver focused on customer satisfaction.',
        why_join: 'Want to be part of a professional driving platform.',
        availability_hours: 'Monday-Friday 9AM-6PM',
        preferred_areas: 'West Hollywood, Beverly Hills',
        application_status: 'pending',
        is_available: false,
        is_active: true,
        rating: 4.6,
        total_trips: 89,
        total_earnings: 8900.25,
        documents_verified: false,
        background_check_status: 'pending',
        background_check_consent: true,
        marketing_consent: false
      },
      {
        user_id: actualUserIds[2] || 3,
        license_number: 'DL456789123',
        license_expiry: '2025-09-15',
        license_class: 'Class A',
        commercial_license: true,
        phone: '+1-555-345-6789',
        address: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        zip_code: '60601',
        date_of_birth: '1982-11-10',
        gender: 'male',
        experience_years: 12,
        previous_company: 'Chicago Transit',
        has_own_vehicle: true,
        vehicle_make: 'Ford',
        vehicle_model: 'Explorer',
        vehicle_year: 2021,
        vehicle_plate: 'IL-9012',
        vehicle_types: JSON.stringify(['suv', 'minivan']),
        services_offered: JSON.stringify(['airport_transfer', 'long_distance', 'family_trips']),
        languages_spoken: JSON.stringify(['English', 'French']),
        emergency_contact_name: 'Lisa Johnson',
        emergency_contact_phone: '+1-555-765-4321',
        about: 'Veteran driver with extensive experience in all types of trips.',
        why_join: 'Seeking new opportunities in the transportation industry.',
        availability_hours: 'Flexible schedule',
        preferred_areas: 'Downtown Chicago, O\'Hare Airport',
        application_status: 'approved',
        is_available: true,
        is_active: true,
        rating: 4.9,
        total_trips: 234,
        total_earnings: 23400.75,
        documents_verified: true,
        background_check_status: 'approved',
        background_check_consent: true,
        marketing_consent: true
      },
      {
        user_id: actualUserIds[3] || 4,
        license_number: 'DL789123456',
        license_expiry: '2024-12-01',
        license_class: 'Class B',
        commercial_license: false,
        phone: '+1-555-456-7890',
        address: '321 Elm Drive',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        zip_code: '33101',
        date_of_birth: '1988-08-18',
        gender: 'female',
        experience_years: 6,
        previous_company: 'Lyft',
        has_own_vehicle: true,
        vehicle_make: 'Nissan',
        vehicle_model: 'Altima',
        vehicle_year: 2018,
        vehicle_plate: 'FL-3456',
        vehicle_types: JSON.stringify(['sedan']),
        services_offered: JSON.stringify(['city_rides', 'beach_tours']),
        languages_spoken: JSON.stringify(['English', 'Spanish']),
        emergency_contact_name: 'Carlos Wilson',
        emergency_contact_phone: '+1-555-654-3210',
        about: 'Bilingual driver specializing in Miami area tours and transportation.',
        why_join: 'Love driving and meeting new people from around the world.',
        availability_hours: 'Weekends and evenings',
        preferred_areas: 'South Beach, Downtown Miami',
        application_status: 'under_review',
        is_available: false,
        is_active: true,
        rating: 4.7,
        total_trips: 127,
        total_earnings: 12700.00,
        documents_verified: true,
        background_check_status: 'pending',
        background_check_consent: true,
        marketing_consent: true
      },
      {
        user_id: actualUserIds[4] || 5,
        license_number: 'DL321654987',
        license_expiry: '2025-03-20',
        license_class: 'Class A',
        commercial_license: true,
        phone: '+1-555-567-8901',
        address: '654 Maple Lane',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        zip_code: '98101',
        date_of_birth: '1979-12-05',
        gender: 'male',
        experience_years: 15,
        previous_company: 'Seattle Metro',
        has_own_vehicle: true,
        vehicle_make: 'Chevrolet',
        vehicle_model: 'Suburban',
        vehicle_year: 2022,
        vehicle_plate: 'WA-7890',
        vehicle_types: JSON.stringify(['suv', 'luxury']),
        services_offered: JSON.stringify(['airport_transfer', 'corporate', 'events']),
        languages_spoken: JSON.stringify(['English']),
        emergency_contact_name: 'Jennifer Brown',
        emergency_contact_phone: '+1-555-543-2109',
        about: 'Premium service driver with focus on corporate and luxury transportation.',
        why_join: 'Excited to bring professional service to discerning clients.',
        availability_hours: 'Business hours plus special events',
        preferred_areas: 'Downtown Seattle, Airport corridor',
        application_status: 'rejected',
        is_available: false,
        is_active: false,
        rating: 3.8,
        total_trips: 45,
        total_earnings: 4500.00,
        documents_verified: false,
        background_check_status: 'rejected',
        background_check_consent: true,
        marketing_consent: false
      }
    ];

    // Insert drivers
    console.log('Inserting sample drivers...');
    const driverInsertQuery = `
      INSERT INTO drivers (
        user_id, license_number, license_expiry, license_class, commercial_license,
        phone, address, city, state, country, zip_code, date_of_birth, gender,
        experience_years, previous_company, has_own_vehicle, vehicle_make, vehicle_model,
        vehicle_year, vehicle_plate, vehicle_types, services_offered, languages_spoken,
        emergency_contact_name, emergency_contact_phone, about, why_join, availability_hours,
        preferred_areas, application_status, is_available, is_active, rating, total_trips,
        total_earnings, documents_verified, background_check_status, background_check_consent,
        marketing_consent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      phone = VALUES(phone),
        vehicle_make = VALUES(vehicle_make),
        rating = VALUES(rating),
        total_trips = VALUES(total_trips)
    `;

    for (const driver of sampleDrivers) {
      await connection.execute(driverInsertQuery, [
        driver.user_id, driver.license_number, driver.license_expiry, driver.license_class, driver.commercial_license,
        driver.phone, driver.address, driver.city, driver.state, driver.country, driver.zip_code, driver.date_of_birth, driver.gender,
        driver.experience_years, driver.previous_company, driver.has_own_vehicle, driver.vehicle_make, driver.vehicle_model,
        driver.vehicle_year, driver.vehicle_plate, driver.vehicle_types, driver.services_offered, driver.languages_spoken,
        driver.emergency_contact_name, driver.emergency_contact_phone, driver.about, driver.why_join, driver.availability_hours,
        driver.preferred_areas, driver.application_status, driver.is_available, driver.is_active, driver.rating, driver.total_trips,
        driver.total_earnings, driver.documents_verified, driver.background_check_status, driver.background_check_consent,
        driver.marketing_consent
      ]);
    }

    console.log('✅ Sample driver data inserted successfully!');
    console.log(`Inserted ${sampleDrivers.length} drivers`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

insertSampleDrivers();
