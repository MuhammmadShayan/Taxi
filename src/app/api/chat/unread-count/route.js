import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    // Verify user authentication from cookie
    const token = req.cookies.get('session')?.value || req.cookies.get('holikey_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Query total unread count
    // Count messages where:
    // 1. User is a participant in the conversation
    // 2. Message is not sent by the user
    // 3. Message is not deleted
    // 4. Message has NOT been read by the user (no entry in chat_message_reads)
    
    const result = await query(`
      SELECT COUNT(*) as total_unread
      FROM chat_messages cm
      INNER JOIN chat_conversations c ON cm.conversation_id = c.conversation_id
      INNER JOIN chat_participants cp ON c.conversation_id = cp.conversation_id
      LEFT JOIN chat_message_reads cmr ON cm.message_id = cmr.message_id AND cmr.user_id = ?
      WHERE cp.user_id = ?
        AND cp.is_active = 1
        AND cm.sender_id != ?
        AND cm.is_deleted = 0
        AND cmr.message_id IS NULL
    `, [user.user_id, user.user_id, user.user_id]);

    const unreadCount = result[0]?.total_unread || 0;

    return NextResponse.json({ unreadCount });

  } catch (error) {
    console.error('🔥 Chat: Error fetching unread count:', error);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json({ unreadCount: 0 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}
