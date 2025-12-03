import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signSession } from '../../../../lib/auth.js';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Extract all the comprehensive driver data
        const {
            // Basic Information
            first_name,
            last_name,
            email,
            password,
            phone,
            city,
            state,
            country,
            zip_code,
            date_of_birth,
            gender,
            address,
            
            // Professional Information
            license_number,
            license_expiry,
            license_class,
            experience_years,
            previous_company,
            commercial_license,
            
            // Vehicle & Services
            has_own_vehicle,
            vehicle_make,
            vehicle_model,
            vehicle_year,
            vehicle_plate,
            vehicle_types,
            services,
            
            // Additional Information
            languages,
            emergency_contact_name,
            emergency_contact_phone,
            background_check_consent,
            terms_accepted,
            marketing_consent,
            about,
            why_join,
            availability_hours,
            preferred_areas
        } = body;

        // Validation
        if (!first_name || !last_name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' }, 
                { status: 400 }
            );
        }

        if (!phone || !date_of_birth || !address || !city || !state || !country || !zip_code) {
            return NextResponse.json(
                { error: 'Complete personal information is required' }, 
                { status: 400 }
            );
        }

        if (!license_number || !license_expiry || !license_class || !experience_years) {
            return NextResponse.json(
                { error: 'Complete license information is required' }, 
                { status: 400 }
            );
        }

        if (!emergency_contact_name || !emergency_contact_phone) {
            return NextResponse.json(
                { error: 'Emergency contact information is required' }, 
                { status: 400 }
            );
        }

        if (!background_check_consent || !terms_accepted) {
            return NextResponse.json(
                { error: 'Background check and terms consent are required' }, 
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert into users table
        const userResult = await query(
            `INSERT INTO users (
                email, password, user_type, first_name, last_name, 
                is_active, email_verified, created_at
            ) VALUES (?, ?, 'driver', ?, ?, 0, 0, NOW())`,
            [email, hashedPassword, first_name, last_name]
        );

        const userId = userResult.insertId;

        // Insert into drivers table with comprehensive information
        await query(`
            INSERT INTO drivers (
                user_id, license_number, license_expiry, license_class,
                experience_years, previous_company, commercial_license,
                phone, address, city, state, country, zip_code,
                date_of_birth, gender, 
                has_own_vehicle, vehicle_make, vehicle_model, vehicle_year, vehicle_plate,
                vehicle_types, services_offered, languages_spoken,
                emergency_contact_name, emergency_contact_phone,
                background_check_consent, marketing_consent,
                about, why_join, availability_hours, preferred_areas,
                application_status, is_available, rating, total_trips,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 0.0, 0, NOW(), NOW())
        `, [
            userId,
            license_number,
            license_expiry,
            license_class,
            experience_years || 0,
            previous_company || null,
            commercial_license || false,
            phone,
            address,
            city,
            state,
            country,
            zip_code,
            date_of_birth,
            gender || null,
            has_own_vehicle || false,
            vehicle_make || null,
            vehicle_model || null,
            vehicle_year || null,
            vehicle_plate || null,
            JSON.stringify(vehicle_types || []),
            JSON.stringify(services || []),
            JSON.stringify(languages || []),
            emergency_contact_name,
            emergency_contact_phone,
            background_check_consent || false,
            marketing_consent || false,
            about || null,
            why_join || null,
            availability_hours || null,
            preferred_areas || null
        ]);

        // Create session for the user (but account is not active yet)
        const user = { 
            id: userId, 
            email, 
            first_name, 
            last_name, 
            user_type: 'driver',
            is_active: false
        };

        const token = signSession(user);
        const response = NextResponse.json({ 
            success: true,
            message: 'Driver application submitted successfully! Your application is under review.',
            user: {
                id: userId,
                first_name,
                last_name,
                email,
                application_status: 'pending'
            }
        });

        // Set session cookie
        response.cookies.set('session', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Driver registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}

// GET endpoint to check registration requirements
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Driver registration endpoint ready',
        required_fields: {
            personal: [
                'first_name', 'last_name', 'email', 'password', 'phone',
                'date_of_birth', 'address', 'city', 'state', 'country', 'zip_code'
            ],
            professional: [
                'license_number', 'license_expiry', 'license_class', 'experience_years'
            ],
            emergency: [
                'emergency_contact_name', 'emergency_contact_phone'
            ],
            consent: [
                'background_check_consent', 'terms_accepted'
            ],
            additional: [
                'about', 'availability_hours'
            ]
        },
        optional_fields: [
            'gender', 'previous_company', 'commercial_license', 'vehicle_make',
            'vehicle_model', 'vehicle_year', 'vehicle_plate', 'vehicle_types',
            'services', 'languages', 'marketing_consent', 'why_join', 'preferred_areas'
        ]
    });
}
