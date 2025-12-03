import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;

    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      sessionData: session ? { 
        user_id: session.user_id, 
        user_type: session.user_type,
        email: session.email 
      } : null,
      cookies: {
        session: !!request.cookies.get('session')?.value,
        holikey_session: !!request.cookies.get('holikey_session')?.value
      }
    };

    // Test database connection
    try {
      const testQuery = await query('SELECT 1 as test');
      debugInfo.databaseConnection = 'OK';
      debugInfo.databaseTest = testQuery;
    } catch (dbError) {
      debugInfo.databaseConnection = 'ERROR';
      debugInfo.databaseError = dbError.message;
    }

    // If we have a session, test notification queries
    if (session) {
      try {
        const notifications = await query(`
          SELECT notification_id, title, message, is_read, created_at
          FROM notifications 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT 5
        `, [session.user_id]);
        
        debugInfo.userNotifications = notifications;
      } catch (dbError) {
        debugInfo.notificationQueryError = dbError.message;
      }

      try {
        const unreadCount = await query(`
          SELECT COUNT(*) as unread_count 
          FROM notifications 
          WHERE user_id = ? AND is_read = 0
        `, [session.user_id]);
        
        debugInfo.unreadCount = unreadCount[0]?.unread_count || 0;
      } catch (dbError) {
        debugInfo.unreadCountError = dbError.message;
      }
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: 'Debug information collected successfully'
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// POST endpoint to create test notifications
export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No valid session for creating test notifications'
      }, { status: 401 });
    }

    const body = await request.json();
    const { count = 1, type = 'system' } = body;

    const createdNotifications = [];

    for (let i = 0; i < Math.min(count, 5); i++) {
      try {
        const result = await query(`
          INSERT INTO notifications (user_id, type, title, message, created_at)
          VALUES (?, ?, ?, ?, NOW())
        `, [
          session.user_id,
          type,
          `Test Notification ${i + 1}`,
          `This is a test notification created at ${new Date().toLocaleString()}`
        ]);

        createdNotifications.push({
          notification_id: result.insertId,
          title: `Test Notification ${i + 1}`,
          type: type
        });
      } catch (dbError) {
        console.error('Error creating test notification:', dbError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create test notification: ' + dbError.message
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdNotifications.length} test notifications`,
      notifications: createdNotifications
    });

  } catch (error) {
    console.error('Error creating test notifications:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}