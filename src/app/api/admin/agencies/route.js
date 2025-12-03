import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const agencies = await query(`
			SELECT 
				a.agency_id, 
				a.business_name, 
				a.contact_name, 
				a.business_email, 
				a.business_phone, 
				a.business_city, 
				a.business_country, 
				a.commission_rate, 
				a.status, 
				a.created_at,
				u.first_name,
				u.last_name,
				u.email as owner_email
			FROM agencies a
			LEFT JOIN users u ON a.user_id = u.user_id
			ORDER BY a.created_at DESC
		`);
		return NextResponse.json({ agencies });
	} catch (error) {
		console.error('Error fetching agencies:', error);
		return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 });
	}
}

export async function POST(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const data = await request.json();
		const { 
			business_name, 
			contact_name, 
			business_email, 
			business_phone, 
			business_address, 
			business_city, 
			business_country, 
			commission_rate, 
			status 
		} = data;

		// Validate required fields
		if (!business_name || !business_email) {
			return NextResponse.json({ error: 'Business name and email are required' }, { status: 400 });
		}

    // Determine owner user id correctly
    const ownerUserId = session.id;
    if (!ownerUserId) {
        return NextResponse.json({ error: 'Owner user not resolved from session' }, { status: 401 });
    }

    // If an agency with this email exists but belongs to the same owner, allow update
    const existingByEmail = await query(
        'SELECT agency_id, user_id FROM agencies WHERE business_email = ? LIMIT 1',
        [business_email]
    );
    if (existingByEmail.length > 0 && existingByEmail[0].user_id !== ownerUserId) {
        return NextResponse.json({ error: 'An agency with this email already exists' }, { status: 400 });
    }

    // If an agency already exists for this user, update it; otherwise insert new
    const existingByUser = await query(
        'SELECT agency_id FROM agencies WHERE user_id = ? LIMIT 1',
        [ownerUserId]
    );

    if (existingByUser.length > 0) {
        const agencyId = existingByUser[0].agency_id;
        await query(
            `UPDATE agencies SET 
                business_name = ?,
                contact_name = ?,
                business_email = ?,
                business_phone = ?,
                business_address = ?,
                business_city = ?,
                business_country = ?,
                commission_rate = ?,
                status = ?,
                updated_at = NOW()
             WHERE agency_id = ?`,
            [
                business_name,
                contact_name || null,
                business_email,
                business_phone || null,
                business_address || null,
                business_city || null,
                business_country || null,
                commission_rate || 10,
                status || 'pending',
                agencyId
            ]
        );
        return NextResponse.json({ 
            success: true,
            agency_id: agencyId,
            message: 'Agency updated successfully'
        });
    }

    const result = await query(
        `INSERT INTO agencies (
            user_id,
            business_name, 
            contact_name, 
            business_email, 
            business_phone, 
            business_address, 
            business_city, 
            business_country, 
            commission_rate, 
            status,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
            ownerUserId,
            business_name,
            contact_name || null,
            business_email,
            business_phone || null,
            business_address || null,
            business_city || null,
            business_country || null,
            commission_rate || 10,
            status || 'pending'
        ]
    );

    return NextResponse.json({ 
        success: true, 
        agency_id: result.insertId,
        message: 'Agency created successfully' 
    });
	} catch (error) {
		console.error('Error creating agency:', error);
		return NextResponse.json({ error: 'Failed to create agency' }, { status: 500 });
	}
}
