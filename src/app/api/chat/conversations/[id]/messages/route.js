import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req, { params }) {
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

    const conversationId = params.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');

    // Verify user is participant in this conversation
    const isParticipant = await query(`
      SELECT conversation_id 
      FROM chat_participants 
      WHERE conversation_id = ? AND user_id = ? AND is_active = 1
    `, [conversationId, user.user_id]);

    if (isParticipant.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get messages with sender information
    const messages = await query(`
      SELECT 
        cm.message_id,
        cm.conversation_id,
        cm.sender_id,
        cm.message_text,
        cm.message_type,
        cm.file_url,
        cm.file_name,
        cm.file_size,
        cm.reply_to_message_id,
        cm.is_edited,
        cm.reservation_id,
        cm.metadata,
        cm.created_at,
        cm.updated_at,
        u.first_name,
        u.last_name,
        u.profile_image,
        u.role,
        (
          SELECT COUNT(*)
          FROM chat_message_reads cmr
          WHERE cmr.message_id = cm.message_id
        ) as read_count,
        (
          SELECT cmr.read_at
          FROM chat_message_reads cmr
          WHERE cmr.message_id = cm.message_id AND cmr.user_id = ?
        ) as user_read_at,
        -- Reply message info if exists
        reply_msg.message_text as reply_message_text,
        reply_sender.first_name as reply_sender_name
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.user_id
      LEFT JOIN chat_messages reply_msg ON cm.reply_to_message_id = reply_msg.message_id
      LEFT JOIN users reply_sender ON reply_msg.sender_id = reply_sender.user_id
      WHERE cm.conversation_id = ? 
        AND cm.is_deleted = 0
        ${search ? 'AND cm.message_text LIKE ?' : ''}
      ORDER BY cm.created_at DESC
      LIMIT ? OFFSET ?
    `, search ? [user.user_id, conversationId, `%${search}%`, limit, offset] : [user.user_id, conversationId, limit, offset]);

    // Mark messages as read
    if (messages.length > 0) {
      const messageIds = messages
        .filter(msg => msg.sender_id !== user.user_id && !msg.user_read_at)
        .map(msg => msg.message_id);

      if (messageIds.length > 0) {
        const placeholders = messageIds.map(() => '(?, ?)').join(', ');
        const values = messageIds.flatMap(id => [id, user.user_id]);
        
        await query(`
          INSERT IGNORE INTO chat_message_reads (message_id, user_id)
          VALUES ${placeholders}
        `, values);

        // Update participant's last read timestamp
        await query(`
          UPDATE chat_participants 
          SET last_read_at = NOW()
          WHERE conversation_id = ? AND user_id = ?
        `, [conversationId, user.user_id]);
      }
    }

    // Reverse the array to show oldest messages first
    const sortedMessages = messages.reverse();

    return NextResponse.json({ 
      messages: sortedMessages,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
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

    const conversationId = params.id;
    const { message_text, message_type = 'text', reply_to_message_id, reservation_id, file_url, file_name, file_size } = await req.json();

    if (!message_text || message_text.trim() === '') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Verify user is participant in this conversation
    const isParticipant = await query(`
      SELECT conversation_id 
      FROM chat_participants 
      WHERE conversation_id = ? AND user_id = ? AND is_active = 1
    `, [conversationId, user.user_id]);

    if (isParticipant.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Insert message
    const messageResult = await query(`
      INSERT INTO chat_messages (
        conversation_id, 
        sender_id, 
        message_text, 
        message_type,
        reply_to_message_id,
        reservation_id,
        file_url,
        file_name,
        file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      conversationId, 
      user.user_id, 
      message_text.trim(), 
      message_type,
      reply_to_message_id || null,
      reservation_id || null,
      file_url || null,
      file_name || null,
      file_size || null
    ]);

    // Update conversation's last message timestamp
    await query(`
      UPDATE chat_conversations 
      SET last_message_at = NOW(), updated_at = NOW()
      WHERE conversation_id = ?
    `, [conversationId]);

    // Get the created message with sender info
    const newMessage = await query(`
      SELECT 
        cm.message_id,
        cm.conversation_id,
        cm.sender_id,
        cm.message_text,
        cm.message_type,
        cm.file_url,
        cm.file_name,
        cm.file_size,
        cm.reply_to_message_id,
        cm.is_edited,
        cm.reservation_id,
        cm.metadata,
        cm.created_at,
        cm.updated_at,
        u.first_name,
        u.last_name,
        u.profile_image,
        u.role
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.user_id
      WHERE cm.message_id = ?
    `, [messageResult.insertId]);

    return NextResponse.json({ 
      message: newMessage[0],
      status: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Error sending message:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json(
        { error: 'Chat tables are missing. Please run database migrations.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('session')?.value || req.cookies.get('holikey_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const conversationId = params.id;
    const { message_id } = await req.json();
    if (!message_id) {
      return NextResponse.json({ error: 'message_id is required' }, { status: 400 });
    }

    const ownership = await query(
      `SELECT sender_id FROM chat_messages WHERE message_id = ? AND conversation_id = ? AND is_deleted = 0`,
      [message_id, conversationId]
    );
    if (ownership.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    if (ownership[0].sender_id !== user.user_id) {
      return NextResponse.json({ error: 'Not authorized to delete this message' }, { status: 403 });
    }

    await query(`UPDATE chat_messages SET is_deleted = 1, updated_at = NOW() WHERE message_id = ?`, [message_id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
