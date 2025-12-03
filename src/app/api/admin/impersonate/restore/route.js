import { NextResponse } from 'next/server';
import { verifySessionTokenEdge } from '../../../../../lib/jwt-edge';

// POST /api/admin/impersonate/restore
// Restores the original admin session from admin_backup_session cookie
export async function POST(request) {
  try {
    console.log('🔙 Restore impersonation: Starting...');
    
    const currentToken = request.cookies.get('session')?.value;
    console.log('🔑 Current session token exists:', !!currentToken);
    
    const session = currentToken ? await verifySessionTokenEdge(currentToken) : null;
    console.log('👤 Current session:', session ? `${session.email} (impersonated: ${session.impersonated})` : 'none');

    // Optional check: ensure we are impersonating
    if (!session || !session.impersonated) {
      console.error('❌ Not in impersonation mode');
      return NextResponse.json({ success: false, error: 'Not in impersonation mode' }, { status: 400 });
    }

    const backup = request.cookies.get('admin_backup_session')?.value;
    console.log('📦 Backup session exists:', !!backup);
    
    if (!backup) {
      console.error('❌ No admin backup session found');
      return NextResponse.json({ success: false, error: 'No admin backup session found' }, { status: 400 });
    }
    
    // Verify the backup token to see who we're restoring to
    const backupSession = await verifySessionTokenEdge(backup);
    console.log('👤 Restoring to admin:', backupSession ? backupSession.email : 'unknown');

    const res = NextResponse.json({ success: true, redirectTo: '/admin/dashboard' });
    console.log('✅ Preparing to restore session...');

    // Restore session cookie to backup admin token
    res.cookies.set('session', backup, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    console.log('🍪 Set session cookie to backup admin token');

    // Clear the backup cookie
    res.cookies.set('admin_backup_session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
    console.log('🧹 Cleared backup session cookie');
    
    console.log('🎉 Restore impersonation successful! Redirecting to /admin/dashboard');
    return res;
  } catch (error) {
    console.error('Restore impersonation failed:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}