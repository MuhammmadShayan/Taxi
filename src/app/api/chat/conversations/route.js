import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    console.log('💬 Chat: Fetching conversations...');
    
    // Verify user authentication from cookie
    const token = req.cookies.get('session')?.value || req.cookies.get('holikey_session')?.value;
    if (!token) {
      console.log('❌ Chat: No session token found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      console.log('❌ Chat: Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.log('✅ Chat: User authenticated:', user.user_id);

    // Get user's conversations with unread message counts
    console.log('📊 Chat: Querying conversations for user:', user.user_id);
    
    let conversations;
    try {
      conversations = await query(`
      SELECT 
        c.conversation_id,
        c.title,
        c.type,
        c.status,
        c.created_at,
        c.updated_at,
        c.last_message_at,
        -- Get other participant details (priority to non-current user)
        (
          SELECT u.first_name
          FROM chat_participants cp 
          JOIN users u ON cp.user_id = u.user_id 
          WHERE cp.conversation_id = c.conversation_id 
          AND cp.user_id != ? 
          LIMIT 1
        ) as first_name,
        (
          SELECT u.last_name
          FROM chat_participants cp 
          JOIN users u ON cp.user_id = u.user_id 
          WHERE cp.conversation_id = c.conversation_id 
          AND cp.user_id != ? 
          LIMIT 1
        ) as last_name,
        (
          SELECT u.profile_image
          FROM chat_participants cp 
          JOIN users u ON cp.user_id = u.user_id 
          WHERE cp.conversation_id = c.conversation_id 
          AND cp.user_id != ? 
          LIMIT 1
        ) as profile_image,
        (
          SELECT u.role
          FROM chat_participants cp 
          JOIN users u ON cp.user_id = u.user_id 
          WHERE cp.conversation_id = c.conversation_id 
          AND cp.user_id != ? 
          LIMIT 1
        ) as role,
        (
          SELECT cm.message_text
          FROM chat_messages cm
          WHERE cm.conversation_id = c.conversation_id
            AND cm.is_deleted = 0
          ORDER BY cm.created_at DESC
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*)
          FROM chat_messages cm
          LEFT JOIN chat_message_reads cmr ON cm.message_id = cmr.message_id AND cmr.user_id = ?
          WHERE cm.conversation_id = c.conversation_id
            AND cm.sender_id != ?
            AND cm.is_deleted = 0
            AND cmr.message_id IS NULL
        ) as unread_count,
        GROUP_CONCAT(
          CASE 
            WHEN pu.user_id != ? 
            THEN CONCAT(pu.first_name, ' ', pu.last_name)
          END 
          SEPARATOR ', '
        ) as other_participants
      FROM chat_conversations c
      INNER JOIN chat_participants cp ON c.conversation_id = cp.conversation_id
      LEFT JOIN chat_participants cp2 ON c.conversation_id = cp2.conversation_id
      LEFT JOIN users pu ON cp2.user_id = pu.user_id
      WHERE cp.user_id = ? AND cp.is_active = 1
      GROUP BY c.conversation_id
      ORDER BY c.last_message_at DESC, c.updated_at DESC
    `, [
      user.user_id, // first_name subquery: cp.user_id != ?
      user.user_id, // last_name subquery: cp.user_id != ?
      user.user_id, // profile_image subquery: cp.user_id != ?
      user.user_id, // role subquery: cp.user_id != ?
      user.user_id, // unread_count: cmr.user_id = ?
      user.user_id, // unread_count: cm.sender_id != ?
      user.user_id, // GROUP_CONCAT CASE: pu.user_id != ?
      user.user_id  // WHERE cp.user_id = ?
    ]);
      
      console.log('✅ Chat: Found', conversations?.length || 0, 'conversations');
    } catch (dbError) {
      console.error('🔥 Chat: Database query error:', dbError.message);
      
      // Check if it's a table doesn't exist error
      if (dbError.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Chat tables do not exist. Please run chat migrations.');
        // Return empty conversations instead of error
        return NextResponse.json({ conversations: [] });
      }
      
      throw dbError; // Re-throw other errors
    }

    return NextResponse.json({ conversations });

  } catch (error) {
    console.error('🔥 Chat: Error fetching conversations:', error);
    console.error('🔥 Chat: Error stack:', error.stack);
    
    // Return empty conversations for table not found errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.warn('⚠️ Chat: Returning empty conversations due to missing tables');
      return NextResponse.json({ conversations: [] });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch conversations',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
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

    const { participant_ids, title, type = 'direct' } = await req.json();

    if (!participant_ids || participant_ids.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 });
    }

    // Check if direct conversation already exists between these users
    if (type === 'direct' && participant_ids.length === 1) {
      const existingConversation = await query(`
        SELECT c.conversation_id
        FROM chat_conversations c
        INNER JOIN chat_participants cp1 ON c.conversation_id = cp1.conversation_id
        INNER JOIN chat_participants cp2 ON c.conversation_id = cp2.conversation_id
        WHERE c.type = 'direct'
          AND cp1.user_id = ?
          AND cp2.user_id = ?
          AND cp1.is_active = 1
          AND cp2.is_active = 1
        GROUP BY c.conversation_id
        HAVING COUNT(DISTINCT cp1.user_id) = 2
      `, [user.user_id, participant_ids[0]]);

      if (existingConversation.length > 0) {
        return NextResponse.json({ 
          conversation_id: existingConversation[0].conversation_id,
          message: 'Conversation already exists' 
        });
      }
    }

    // Create new conversation
    const conversationResult = await query(`
      INSERT INTO chat_conversations (title, type, created_by)
      VALUES (?, ?, ?)
    `, [title || null, type, user.user_id]);

    const conversationId = conversationResult.insertId;

    // Add creator as participant
    await query(`
      INSERT INTO chat_participants (conversation_id, user_id, role, is_active)
      VALUES (?, ?, 'admin', 1)
    `, [conversationId, user.user_id]);

    // Add other participants
    for (const participantId of participant_ids) {
      await query(`
        INSERT INTO chat_participants (conversation_id, user_id, role, is_active)
        VALUES (?, ?, 'member', 1)
      `, [conversationId, participantId]);
    }

    return NextResponse.json({ 
      conversation_id: conversationId,
      message: 'Conversation created successfully' 
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json(
        { error: 'Chat tables are missing. Please run database migrations.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
