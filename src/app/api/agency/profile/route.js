import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
import { validateProfileData, sanitizeProfileData } from '../../../../lib/profileValidation';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.user_type !== 'agency_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user and agency data
    const userRows = await query(
      'SELECT * FROM users WHERE user_id = ?',
      [decoded.user_id]
    );

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRows[0];

    // Get agency data
    const agencyRows = await query(
      'SELECT * FROM agencies WHERE user_id = ?',
      [decoded.user_id]
    );

    const agency = agencyRows && agencyRows.length > 0 ? agencyRows[0] : null;

    return NextResponse.json({
      success: true,
      profile: {
        // User data
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        postal_code: user.postal_code,
        // Agency data
        business_name: agency?.business_name || '',
        description: agency?.description || '',
        contact_name: agency?.contact_name || '',
        business_phone: agency?.business_phone || '',
        business_email: agency?.business_email || '',
        business_address: agency?.business_address || '',
        business_city: agency?.business_city || '',
        business_state: agency?.business_state || '',
        business_country: agency?.business_country || '',
        business_postal_code: agency?.business_postal_code || '',
        license_number: agency?.license_number || '',
        tax_id: agency?.tax_id || ''
      }
    });

  } catch (error) {
    console.error('Error fetching agency profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.user_type !== 'agency_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let profileData = await request.json();

    // Sanitize input
    profileData = sanitizeProfileData(profileData);

    // Validate data
    const validation = validateProfileData(profileData, 'agency');
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Update user data
    await query(`
      UPDATE users SET 
        first_name = ?, last_name = ?, phone = ?, 
        address = ?, city = ?, state = ?, country = ?, postal_code = ?,
        updated_at = NOW()
      WHERE user_id = ?
    `, [
      profileData.first_name,
      profileData.last_name,
      profileData.phone,
      profileData.address,
      profileData.city,
      profileData.state,
      profileData.country,
      profileData.postal_code,
      decoded.user_id
    ]);

    // Check if agency record exists
    const agencyRows = await query(
      'SELECT agency_id FROM agencies WHERE user_id = ?',
      [decoded.user_id]
    );

    if (agencyRows && agencyRows.length > 0) {
      // Update existing agency
      await query(`
        UPDATE agencies SET 
          business_name = ?, description = ?, contact_name = ?,
          business_phone = ?, business_email = ?, business_address = ?,
          business_city = ?, business_state = ?, business_country = ?,
          business_postal_code = ?, license_number = ?, tax_id = ?,
          updated_at = NOW()
        WHERE user_id = ?
      `, [
        profileData.business_name,
        profileData.description,
        profileData.contact_name,
        profileData.business_phone,
        profileData.business_email,
        profileData.business_address,
        profileData.business_city,
        profileData.business_state,
        profileData.business_country,
        profileData.business_postal_code,
        profileData.license_number,
        profileData.tax_id,
        decoded.user_id
      ]);
    } else {
      // Create new agency record
      await query(`
        INSERT INTO agencies (
          user_id, business_name, description, contact_name,
          business_phone, business_email, business_address,
          business_city, business_state, business_country,
          business_postal_code, license_number, tax_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        decoded.user_id,
        profileData.business_name,
        profileData.description,
        profileData.contact_name,
        profileData.business_phone,
        profileData.business_email,
        profileData.business_address,
        profileData.business_city,
        profileData.business_state,
        profileData.business_country,
        profileData.business_postal_code,
        profileData.license_number,
        profileData.tax_id
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating agency profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !['agency_owner', 'agency_admin'].includes(decoded.user_type)) {
      return NextResponse.json(
        { success: false, error: 'Only agency owners can delete agency profiles' },
        { status: 403 }
      );
    }

    // Soft delete user account
    const userResult = await query(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE user_id = ?',
      [decoded.user_id]
    );

    if (userResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Also soft delete agency
    await query(
      'UPDATE agencies SET is_active = 0, updated_at = NOW() WHERE user_id = ?',
      [decoded.user_id]
    );

    const response = NextResponse.json({
      success: true,
      message: 'Agency profile deleted successfully'
    });

    response.cookies.set('session', '', { maxAge: 0 });
    return response;

  } catch (error) {
    console.error('Error deleting agency profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete agency profile' },
      { status: 500 }
    );
  }
}
