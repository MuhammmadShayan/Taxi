import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/database.js';
import { verifySessionTokenEdge } from '../../../../../lib/jwt-edge';

export async function POST(request) {
    try {
        const { vehicleId, agencyVehicleData } = await request.json();
        
        // Get session token: prefer Authorization bearer, fallback to cookie
        const authHeader = request.headers.get('Authorization');
        const cookieToken = request.cookies.get('session')?.value;
        if ((!authHeader || !authHeader.startsWith('Bearer ')) && !cookieToken) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : cookieToken;
        const decoded = await verifySessionTokenEdge(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }
        const userId = decoded.id || decoded.user_id;

        // Verify user is an agency
        const agency = await query(
            'SELECT agency_id FROM agencies WHERE user_id = ? AND status = "approved"',
            [userId]
        );

        if (agency.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Agency not found or not approved' },
                { status: 403 }
            );
        }

        const agencyId = agency[0].agency_id;

        // Get vehicle details from vehicles catalog
        const vehicle = await query(
            'SELECT * FROM vehicles WHERE id = ?',
            [vehicleId]
        );

        if (vehicle.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Vehicle not found' },
                { status: 404 }
            );
        }

        const selectedVehicle = vehicle[0];

        // Parse images if they exist
        let images = [];
        if (selectedVehicle.images) {
            try {
                images = JSON.parse(selectedVehicle.images);
            } catch (e) {
                console.log('Could not parse vehicle images:', e.message);
            }
        }

        // Generate vehicle number for agency
        const vehicleNumber = `${agencyId}-${Date.now()}`;

        // Insert into agency_vehicles table
        const insertResult = await query(
            `INSERT INTO agency_vehicles (
                agency_id, category_id, vehicle_number, type, brand, model, year,
                energy, gear_type, doors, seats, air_conditioning, airbags,
                navigation_system, bluetooth, wifi, price_low, price_high, 
                price_holiday, daily_rate, weekly_rate, monthly_rate,
                deposit_amount, mileage_limit, extra_mileage_cost,
                description, images, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                agencyId,
                agencyVehicleData.category_id || 1, // Default to economy
                vehicleNumber,
                agencyVehicleData.type || 'small_car',
                selectedVehicle.make,
                selectedVehicle.model,
                selectedVehicle.year,
                selectedVehicle.energy || 'petrol',
                selectedVehicle.gear_type || 'manual',
                selectedVehicle.doors || 4,
                selectedVehicle.seats || 5,
                agencyVehicleData.air_conditioning || 1,
                agencyVehicleData.airbags || 1,
                agencyVehicleData.navigation_system || 0,
                agencyVehicleData.bluetooth || 0,
                agencyVehicleData.wifi || 0,
                agencyVehicleData.price_low || selectedVehicle.daily_rate || 50.00,
                agencyVehicleData.price_high || (selectedVehicle.daily_rate ? selectedVehicle.daily_rate * 1.3 : 65.00),
                agencyVehicleData.price_holiday || (selectedVehicle.daily_rate ? selectedVehicle.daily_rate * 1.5 : 75.00),
                agencyVehicleData.daily_rate || selectedVehicle.daily_rate || 50.00,
                agencyVehicleData.weekly_rate || (selectedVehicle.daily_rate ? selectedVehicle.daily_rate * 6 : 300.00),
                agencyVehicleData.monthly_rate || (selectedVehicle.daily_rate ? selectedVehicle.daily_rate * 25 : 1250.00),
                agencyVehicleData.deposit_amount || 200.00,
                agencyVehicleData.mileage_limit || 200,
                agencyVehicleData.extra_mileage_cost || 0.15,
                agencyVehicleData.description || `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`,
                JSON.stringify(images),
                'available'
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Vehicle added to agency fleet successfully',
            agencyVehicleId: insertResult.insertId,
            vehicleNumber,
            vehicle: {
                id: insertResult.insertId,
                ...selectedVehicle,
                vehicle_number: vehicleNumber,
                agency_id: agencyId
            }
        });

    } catch (error) {
        console.error('❌ Failed to add vehicle to agency:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to add vehicle to agency', 
                message: error.message 
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        // Get JWT token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (error) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        const userId = decoded.userId;

        // Get agency info
        const agency = await query(
            'SELECT agency_id, business_name FROM agencies WHERE user_id = ?',
            [userId]
        );

        if (agency.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Agency not found' },
                { status: 404 }
            );
        }

        const agencyId = agency[0].agency_id;

        // Get agency's vehicles
        const agencyVehicles = await query(
            `SELECT av.*, vc.name as category_name 
             FROM agency_vehicles av
             LEFT JOIN vehicle_categories vc ON av.category_id = vc.category_id
             WHERE av.agency_id = ?
             ORDER BY av.created_at DESC`,
            [agencyId]
        );

        // Parse images for each vehicle
        const vehiclesWithImages = agencyVehicles.map(vehicle => ({
            ...vehicle,
            images: vehicle.images ? JSON.parse(vehicle.images) : []
        }));

        return NextResponse.json({
            success: true,
            agency: agency[0],
            vehicles: vehiclesWithImages
        });

    } catch (error) {
        console.error('❌ Failed to fetch agency vehicles:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to fetch agency vehicles', 
                message: error.message 
            },
            { status: 500 }
        );
    }
}
