import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
};

let io;

// Store active users and their socket connections
const activeUsers = new Map();
const userSockets = new Map();

export function initSocket(server) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.userData = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: ' + error.message));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User ${socket.userId} (${socket.userRole}) connected`);
    
    // Store user connection
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.userRole,
      lastSeen: new Date()
    });
    userSockets.set(socket.id, socket.userId);

    // Join user to their conversation rooms
    await joinUserConversations(socket);

    // Handle joining specific conversation
    socket.on('join_conversation', async (conversationId) => {
      try {
        const hasAccess = await verifyConversationAccess(socket.userId, conversationId);
        if (hasAccess) {
          socket.join(`conversation_${conversationId}`);
          console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        } else {
          socket.emit('error', { message: 'Access denied to this conversation' });
        }
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Handle leaving conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, messageText, replyToMessageId, messageType = 'text' } = data;
        
        // Verify user has access to this conversation
        const hasAccess = await verifyConversationAccess(socket.userId, conversationId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to this conversation' });
          return;
        }

        // Save message to database
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(`
          INSERT INTO chat_messages (
            conversation_id, sender_id, message_text, message_type, reply_to_message_id
          ) VALUES (?, ?, ?, ?, ?)
        `, [conversationId, socket.userId, messageText, messageType, replyToMessageId || null]);

        // Update conversation last_message_at
        await connection.execute(`
          UPDATE chat_conversations 
          SET last_message_at = NOW() 
          WHERE conversation_id = ?
        `, [conversationId]);

        // Get the created message with user info
        const [messageData] = await connection.execute(`
          SELECT 
            m.*,
            u.first_name,
            u.last_name,
            u.profile_image
          FROM chat_messages m
          JOIN users u ON m.sender_id = u.user_id
          WHERE m.message_id = ?
        `, [result.insertId]);

        await connection.end();

        const message = messageData[0];
        
        // Emit message to all participants in the conversation
        io.to(`conversation_${conversationId}`).emit('new_message', {
          message,
          conversationId
        });

        // Send notification to offline users
        await sendNotificationsToOfflineUsers(conversationId, message, socket.userId);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
        isTyping: false
      });
    });

    // Handle marking messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { conversationId, messageIds } = data;
        
        if (messageIds && messageIds.length > 0) {
          const connection = await mysql.createConnection(dbConfig);
          
          // Mark messages as read
          for (const messageId of messageIds) {
            await connection.execute(`
              INSERT IGNORE INTO chat_message_reads (message_id, user_id, read_at)
              VALUES (?, ?, NOW())
            `, [messageId, socket.userId]);
          }

          await connection.end();

          // Emit read receipt to other participants
          socket.to(`conversation_${conversationId}`).emit('messages_read', {
            userId: socket.userId,
            conversationId,
            messageIds
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle user status updates
    socket.on('update_status', (status) => {
      if (activeUsers.has(socket.userId)) {
        const user = activeUsers.get(socket.userId);
        user.status = status;
        user.lastSeen = new Date();
        activeUsers.set(socket.userId, user);
        
        // Broadcast status update to user's conversations
        broadcastStatusUpdate(socket.userId, status);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      
      // Update user status to offline
      if (activeUsers.has(socket.userId)) {
        const user = activeUsers.get(socket.userId);
        user.status = 'offline';
        user.lastSeen = new Date();
        activeUsers.set(socket.userId, user);
        
        broadcastStatusUpdate(socket.userId, 'offline');
      }
      
      userSockets.delete(socket.id);
    });
  });

  return io;
}

// Helper function to join user to their conversation rooms
async function joinUserConversations(socket) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [conversations] = await connection.execute(`
      SELECT c.conversation_id 
      FROM chat_conversations c
      JOIN chat_participants p ON c.conversation_id = p.conversation_id
      WHERE p.user_id = ? AND p.is_active = 1 AND c.status = 'active'
    `, [socket.userId]);

    await connection.end();

    conversations.forEach(conv => {
      socket.join(`conversation_${conv.conversation_id}`);
    });

  } catch (error) {
    console.error('Error joining user conversations:', error);
  }
}

// Helper function to verify conversation access
async function verifyConversationAccess(userId, conversationId) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [participants] = await connection.execute(`
      SELECT 1 FROM chat_participants 
      WHERE user_id = ? AND conversation_id = ? AND is_active = 1
    `, [userId, conversationId]);

    await connection.end();
    return participants.length > 0;
  } catch (error) {
    console.error('Error verifying conversation access:', error);
    return false;
  }
}

// Helper function to send notifications to offline users
async function sendNotificationsToOfflineUsers(conversationId, message, senderId) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get all participants except sender
    const [participants] = await connection.execute(`
      SELECT p.user_id, u.email, u.first_name, u.last_name
      FROM chat_participants p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.conversation_id = ? AND p.user_id != ? AND p.is_active = 1
    `, [conversationId, senderId]);

    await connection.end();

    // Send notifications to users who are offline
    for (const participant of participants) {
      if (!activeUsers.has(participant.user_id)) {
        // User is offline, send notification
        // Here you would integrate with your notification system
        // For example: send email, push notification, etc.
        console.log(`Sending notification to offline user ${participant.user_id} for message from ${senderId}`);
      }
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

// Helper function to broadcast status updates
function broadcastStatusUpdate(userId, status) {
  // This would broadcast to all conversations the user is part of
  io.emit('user_status_update', {
    userId,
    status,
    timestamp: new Date()
  });
}

// Get active users (for API endpoint)
export function getActiveUsers() {
  return Array.from(activeUsers.entries()).map(([userId, data]) => ({
    userId,
    ...data
  }));
}

// Send message to specific user
export function sendMessageToUser(userId, event, data) {
  const user = activeUsers.get(userId);
  if (user && user.socketId) {
    io.to(user.socketId).emit(event, data);
  }
}

export default function getSocket() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}
