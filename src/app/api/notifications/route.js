import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { verifySessionToken } from '../../../lib/auth';

export async function GET(request) {
	try {
		// Try multiple cookie names for compatibility
		const token = request.cookies.get('session')?.value || 
		             request.cookies.get('holikey_session')?.value;
		const session = token ? verifySessionToken(token) : null;
		
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    // Support both offset and page (1-based) for pagination
    const page = parseInt(searchParams.get('page') || '0');
    const offset = searchParams.has('offset')
      ? parseInt(searchParams.get('offset') || '0')
      : (page > 0 ? (page - 1) * limit : 0);
    // Support both unread_only and filter=unread
    const unreadOnly = searchParams.get('unread_only') === 'true' || searchParams.get('filter') === 'unread';
    // Optional type filter via filter param (e.g., booking, payment, system, user, review, promotion)
    const typeFilter = (() => {
      const f = searchParams.get('filter');
      if (!f) return null;
      const known = new Set(['booking','payment','system','user','review','promotion']);
      return known.has(f) ? f : null;
    })();
    // Allow skipping total count for performance-sensitive callers (e.g., header)
    const includeTotal = (searchParams.get('include_total') ?? 'true') !== 'false';

    // For demo/fallback when no session but user_id provided via URL
    if (!session && !user_id) {
      console.log('Notifications: No session and no user_id provided');
      return NextResponse.json({
        notifications: [],
        total: 0,
        unread_count: 0,
        has_more: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const userId = session?.user_id || session?.id || user_id;


    try {
      // Build query based on filters
      let whereClause = 'WHERE user_id = ?';
      let queryParams = [userId];

      if (unreadOnly) {
        whereClause += ' AND is_read = 0';
      }
      if (typeFilter) {
        whereClause += ' AND type = ?';
        queryParams.push(typeFilter);
      }

      let notifications = [];
      let total = 0;
      let unread_count = 0;

      try {
        // Get notifications for the user
        notifications = await query(`
          SELECT 
            notification_id,
            user_id,
            type,
            title,
            message,
            data,
            is_read,
            created_at,
            CASE 
              WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) THEN 'Just now'
              WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN CONCAT(TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' min ago')
              WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' hours ago')
              WHEN created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN CONCAT(TIMESTAMPDIFF(DAY, created_at, NOW()), ' days ago')
              ELSE DATE_FORMAT(created_at, '%b %d, %Y')
            END as time_ago
          FROM notifications 
          ${whereClause}
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `, [...queryParams, limit, offset]);
      } catch (dbError) {
        console.error('Database error fetching notifications:', dbError);
        // Return error response if database connection fails
        return NextResponse.json({
          success: false,
          error: 'Database connection error',
          notifications: [],
          total: 0,
          unread_count: 0,
          has_more: false
        }, { status: 500 });
      }

      try {
        // Get total count if requested
        if (includeTotal) {
          const totalResult = await query(`
            SELECT COUNT(*) as total 
            FROM notifications 
            ${whereClause}
          `, queryParams);
          total = totalResult[0]?.total || 0;
        } else {
          total = notifications.length;
        }
      } catch (dbError) {
        console.error('Database error fetching total count:', dbError);
        total = notifications.length;
      }

      try {
        // Get unread count
        const unreadResult = await query(`
          SELECT COUNT(*) as unread_count 
          FROM notifications 
          WHERE user_id = ? AND is_read = 0
        `, [userId]);
        unread_count = unreadResult[0]?.unread_count || 0;
      } catch (dbError) {
        console.error('Database error fetching unread count:', dbError);
        unread_count = notifications.filter(n => !n.is_read).length;
      }

      // Format notifications for frontend
      const formattedNotifications = notifications.map(notification => ({
        notification_id: notification.notification_id,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        time_ago: notification.time_ago,
        type: notification.type,
        is_read: Boolean(notification.is_read),
        data: notification.data ? JSON.parse(notification.data) : null,
        created_at: notification.created_at
      }));

      return NextResponse.json({
        success: true,
        notifications: formattedNotifications,
        total: total,
        unread_count: unread_count,
        has_more: (parseInt(offset) + parseInt(limit)) < total
      });
    } catch (error) {
      console.error('Database error in notifications:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Database error', 
        notifications: [],
        total: 0,
        unread_count: 0 
      }, { status: 500 });
    }
	} catch (e) {
		console.error('GET /api/notifications error', e);
		return NextResponse.json({ error: 'Failed' }, { status: 500 });
	}
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { notification_id, notification_ids, is_read, user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (notification_id) {
      // Mark single notification as read/unread
      await query(`
        UPDATE notifications 
        SET is_read = ? 
        WHERE notification_id = ? AND user_id = ?
      `, [is_read ? 1 : 0, notification_id, user_id]);
    } else if (notification_ids && Array.isArray(notification_ids)) {
      // Mark multiple notifications as read/unread
      const placeholders = notification_ids.map(() => '?').join(',');
      await query(`
        UPDATE notifications 
        SET is_read = ? 
        WHERE notification_id IN (${placeholders}) AND user_id = ?
      `, [is_read ? 1 : 0, ...notification_ids, user_id]);
    } else {
      // Mark all notifications as read
      await query(`
        UPDATE notifications 
        SET is_read = 1 
        WHERE user_id = ? AND is_read = 0
      `, [user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PUT /api/notifications error', e);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, type, title, message, data } = body;

    if (!user_id || !type || !title || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: user_id, type, title, message' 
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, data, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, type, title, message, data ? JSON.stringify(data) : null]
    );

    return NextResponse.json({
      success: true,
      notification_id: result.insertId,
      message: 'Notification created successfully'
    });
  } catch (e) {
    console.error('POST /api/notifications error', e);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const notification_id = searchParams.get('notification_id');
    const user_id = searchParams.get('user_id');

    if (!notification_id || !user_id) {
      return NextResponse.json({ error: 'Notification ID and User ID are required' }, { status: 400 });
    }

    const result = await query(`
      DELETE FROM notifications 
      WHERE notification_id = ? AND user_id = ?
    `, [notification_id, user_id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification deleted successfully' });
  } catch (e) {
    console.error('DELETE /api/notifications error', e);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}

// Helper function to format time ago
function formatTimeAgo(date) {
	const now = new Date();
	const notificationDate = new Date(date);
	const diffInSeconds = Math.floor((now - notificationDate) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} seconds ago`;
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	} else if (diffInSeconds < 604800) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	} else {
		return notificationDate.toLocaleDateString();
	}
}