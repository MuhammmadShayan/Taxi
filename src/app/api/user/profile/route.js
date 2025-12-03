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
    if (!decoded) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userRows = await query(
      'SELECT user_id, first_name, last_name, email, phone, address, city, country, state, postal_code FROM users WHERE user_id = ?',
      [decoded.user_id]
    );

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: userRows[0]
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
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
    if (!decoded) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let profileData = await request.json();

    // Sanitize input
    profileData = sanitizeProfileData(profileData);

    // Validate data
    const validation = validateProfileData(profileData, 'user');
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid session token' },
        { status: 403 }
      );
    }

    // Soft delete - mark as inactive instead of hard delete for data integrity
    const result = await query(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE user_id = ?',
      [decoded.user_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully. Redirecting to home page...'
    });

    response.cookies.set('session', '', { maxAge: 0 });
    return response;

  } catch (error) {
    console.error('Error deleting user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
