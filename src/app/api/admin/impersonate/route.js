import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import { verifySessionTokenEdge } from '../../../../lib/jwt-edge';
import { signSessionEdge } from '../../../../lib/jwt-edge';

// POST /api/admin/impersonate
// Body: { user_id: number }
// Sets a new session cookie to impersonate the target user and stores the original admin session in a backup cookie
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id } = body || {};

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'user_id is required' }, { status: 400 });
    }

    // Validate requester is admin
    const currentToken = request.cookies.get('session')?.value;
    const requester = currentToken ? await verifySessionTokenEdge(currentToken) : null;

    if (!requester || !(requester.user_type === 'admin' || requester.role === 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch target user from DB
    const rows = await query(
      `SELECT user_id, email, first_name, last_name, role
       FROM users
       WHERE user_id = ?
       LIMIT 1`,
      [user_id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const target = rows[0];

    // Build target user payload for session
    const targetUser = {
      id: target.user_id,
      email: target.email,
      first_name: target.first_name,
      last_name: target.last_name,
      user_type: target.role,
      role: target.role,
    };

    // Create impersonated token with markers
    const impersonatedToken = await signSessionEdge(targetUser, {
      impersonated: true,
      impersonated_by: requester.id || requester.user_id,
      original_admin_email: requester.email,
    });

    // Determine redirect based on role
    const redirectTo = mapRoleToDashboard(target.role);

    // Build response and set cookies
    const res = NextResponse.json({ success: true, redirectTo });

    // Backup original admin token for later restoration
    if (currentToken) {
      res.cookies.set('admin_backup_session', currentToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1, // 1 hour backup
      });
    }

    // Replace session with impersonated token
    res.cookies.set('session', impersonatedToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day for safety
    });

    return res;
  } catch (error) {
    console.error('Impersonation failed:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

function mapRoleToDashboard(role) {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return '/admin/dashboard';
    case 'agency_owner':
    case 'agency_admin':
      return '/agency/dashboard';
    case 'driver':
      return '/driver/dashboard';
    case 'customer':
    case 'client':
    case 'passenger':
      return '/customer/dashboard';
    default:
      return '/customer/dashboard';
  }
}