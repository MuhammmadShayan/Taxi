import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { verifySessionToken } from '../../../lib/auth';

export async function GET(request) {
  try {
    // Try multiple cookie names for compatibility
    const token = request.cookies.get('session')?.value || 
                 request.cookies.get('holikey_session')?.value;
    const session = token ? verifySessionToken(token) : null;
    
    // For demo purposes, provide fallback data if no authentication
    if (!session) {
      console.log('Messages: No valid session, returning demo data');
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit')) || 10;
      const offset = parseInt(searchParams.get('offset')) || 0;
      
      // Demo messages
      const demoMessages = [
        {
          id: 1,
          sender_name: 'Steve Wonder',
          avatar: '/html-folder/images/team8.jpg',
          message: 'Hello! I have a question about my booking.',
          time: '3 min ago',
          isUnread: true,
          conversation_id: 1,
          created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          sender_name: 'Marc Twain', 
          avatar: '/html-folder/images/team9.jpg',
          message: 'Thank you for the excellent service!',
          time: '1 hrs ago',
          isUnread: true,
          conversation_id: 2,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          sender_name: 'Enzo Ferrari',
          avatar: '/html-folder/images/team10.jpg',
          message: 'Is my vehicle ready for pickup?',
          time: '2 hrs ago',
          isUnread: true,
          conversation_id: 3,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          sender_name: 'Lucas Swing',
          avatar: '/html-folder/images/team11.jpg',
          message: 'I need to modify my reservation.',
          time: '3 hrs ago',
          isUnread: true,
          conversation_id: 4,
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // Apply pagination
      const paginatedMessages = demoMessages.slice(offset, offset + limit);
      
      return NextResponse.json({
        messages: paginatedMessages,
        total: demoMessages.length,
        unread_count: demoMessages.filter(m => m.isUnread).length,
        has_more: (offset + limit) < demoMessages.length,
        _demo: true
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const userId = session.user_id || session.id;

    // Get conversations for the user with the latest message from each
    let conversationQuery = `
      SELECT DISTINCT
        cc.conversation_id,
        cc.title,
        cc.type,
        cc.status,
        cc.last_message_at,
        cm.message_text as latest_message,
        cm.created_at as message_created_at,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        sender.profile_image as sender_avatar,
        cm.sender_id,
        -- Check if user has unread messages in this conversation
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM chat_messages cm2 
            LEFT JOIN chat_message_reads cmr ON cm2.message_id = cmr.message_id AND cmr.user_id = ?
            WHERE cm2.conversation_id = cc.conversation_id 
            AND cm2.sender_id != ? 
            AND cmr.message_id IS NULL
            AND cm2.is_deleted = 0
          ) THEN 1 
          ELSE 0 
        END as has_unread
      FROM chat_conversations cc
      INNER JOIN chat_participants cp ON cc.conversation_id = cp.conversation_id
      LEFT JOIN chat_messages cm ON cc.conversation_id = cm.conversation_id
      LEFT JOIN users sender ON cm.sender_id = sender.user_id
      WHERE cp.user_id = ? 
      AND cp.is_active = 1
      AND cc.status = 'active'
      AND cm.created_at = (
        SELECT MAX(cm2.created_at) 
        FROM chat_messages cm2 
        WHERE cm2.conversation_id = cc.conversation_id 
        AND cm2.is_deleted = 0
      )
    `;

    let queryParams = [userId, userId, userId];
    
    if (unreadOnly) {
      conversationQuery += ' AND has_unread = 1';
    }
    
    conversationQuery += ` ORDER BY cc.last_message_at DESC, cm.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    let conversations = [];
    let unread_count = 0;
    
    try {
      conversations = await query(conversationQuery, queryParams);
    } catch (dbError) {
      console.error('Database error fetching conversations:', dbError);
      // Return empty result if database error
      return NextResponse.json({
        messages: [],
        total: 0,
        unread_count: 0,
        has_more: false,
        error: 'Database connection error'
      });
    }

    // Get total unread messages count
    try {
      const unreadResult = await query(`
        SELECT COUNT(DISTINCT cm.message_id) as unread_count
        FROM chat_messages cm
        INNER JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
        INNER JOIN chat_participants cp ON cc.conversation_id = cp.conversation_id
        LEFT JOIN chat_message_reads cmr ON cm.message_id = cmr.message_id AND cmr.user_id = ?
        WHERE cp.user_id = ? 
        AND cp.is_active = 1
        AND cc.status = 'active'
        AND cm.sender_id != ?
        AND cmr.message_id IS NULL
        AND cm.is_deleted = 0
      `, [userId, userId, userId]);
      unread_count = unreadResult[0]?.unread_count || 0;
    } catch (dbError) {
      console.error('Database error fetching unread count:', dbError);
      unread_count = 0;
    }

    // Format messages for frontend
    const formattedMessages = conversations.map(conv => {
      // Create display name based on conversation type
      let displayName = '';
      if (conv.type === 'support') {
        displayName = 'Support Team';
      } else if (conv.title) {
        displayName = conv.title;
      } else {
        displayName = `${conv.sender_first_name || 'User'} ${conv.sender_last_name || ''}`.trim();
      }

      return {
        id: conv.conversation_id,
        conversation_id: conv.conversation_id,
        sender_name: displayName,
        avatar: conv.sender_avatar || '/html-folder/images/team8.jpg',
        message: conv.latest_message ? 
          (conv.latest_message.length > 50 ? conv.latest_message.substring(0, 50) + '...' : conv.latest_message) : 
          'No messages yet',
        time: formatTimeAgo(conv.message_created_at || conv.last_message_at),
        isUnread: conv.has_unread === 1,
        type: conv.type,
        status: conv.status,
        created_at: conv.message_created_at || conv.last_message_at
      };
    });

    return NextResponse.json({
      messages: formattedMessages,
      total: conversations.length,
      unread_count: unread_count || 0,
      has_more: (parseInt(offset) + parseInt(limit)) < conversations.length
    });

  } catch (e) {
    console.error('GET /api/messages error', e);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value || 
                 request.cookies.get('holikey_session')?.value;
    const session = token ? verifySessionToken(token) : null;
    
    if (!session) {
      return NextResponse.json({ 
        success: true, 
        message: 'Demo mode - action simulated',
        _demo: true 
      });
    }

    const body = await request.json();
    const { action, conversation_id, message_id, recipient_id, message_text, type = 'direct' } = body;

    if (action === 'mark_read') {
      if (conversation_id) {
        // Mark all messages in conversation as read
        await query(`
          INSERT INTO chat_message_reads (message_id, user_id, read_at)
          SELECT cm.message_id, ?, NOW()
          FROM chat_messages cm
          LEFT JOIN chat_message_reads cmr ON cm.message_id = cmr.message_id AND cmr.user_id = ?
          WHERE cm.conversation_id = ?
          AND cm.sender_id != ?
          AND cmr.message_id IS NULL
          AND cm.is_deleted = 0
        `, [session.user_id, session.user_id, conversation_id, session.user_id]);
      } else if (message_id) {
        // Mark specific message as read
        await query(`
          INSERT IGNORE INTO chat_message_reads (message_id, user_id, read_at)
          VALUES (?, ?, NOW())
        `, [message_id, session.user_id]);
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'send_message') {
      if (!conversation_id || !message_text) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Insert new message
      const result = await query(`
        INSERT INTO chat_messages (conversation_id, sender_id, message_text, message_type, created_at)
        VALUES (?, ?, ?, 'text', NOW())
      `, [conversation_id, session.user_id || session.id, message_text]);

      // Update conversation last message time
      await query(`
        UPDATE chat_conversations 
        SET last_message_at = NOW() 
        WHERE conversation_id = ?
      `, [conversation_id]);

      return NextResponse.json({ 
        success: true, 
        message_id: result.insertId 
      });
    }

    if (action === 'create_conversation') {
      if (!recipient_id && type !== 'support') {
        return NextResponse.json({ error: 'Recipient ID required for direct messages' }, { status: 400 });
      }

      // Create conversation
      const convResult = await query(`
        INSERT INTO chat_conversations (type, status, created_by, created_at)
        VALUES (?, 'active', ?, NOW())
      `, [type, session.user_id || session.id]);

      const conversationId = convResult.insertId;

      // Add participants
      await query(`
        INSERT INTO chat_participants (conversation_id, user_id, role, joined_at)
        VALUES (?, ?, 'admin', NOW())
      `, [conversationId, session.user_id || session.id]);

      if (recipient_id && type === 'direct') {
        await query(`
          INSERT INTO chat_participants (conversation_id, user_id, role, joined_at)
          VALUES (?, ?, 'member', NOW())
        `, [conversationId, recipient_id]);
      }

      // Send initial message if provided
      if (message_text) {
        await query(`
          INSERT INTO chat_messages (conversation_id, sender_id, message_text, message_type, created_at)
          VALUES (?, ?, ?, 'text', NOW())
        `, [conversationId, session.user_id || session.id, message_text]);

        await query(`
          UPDATE chat_conversations 
          SET last_message_at = NOW() 
          WHERE conversation_id = ?
        `, [conversationId]);
      }

      return NextResponse.json({ 
        success: true, 
        conversation_id: conversationId 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (e) {
    console.error('POST /api/messages error', e);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Helper function to format time ago
function formatTimeAgo(date) {
  if (!date) return 'No date';
  
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

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
    return messageDate.toLocaleDateString();
  }
}