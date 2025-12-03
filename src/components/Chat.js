'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import ChatConversationList from './ChatConversationList';
import ChatMessagesArea from './ChatMessagesArea';
import ChatNewConversation from './ChatNewConversation';
import { ToastProvider, useToast } from './Toast';
import './Chat.css';

const ChatContent = ({ autoOpenNewChat = false, prefillEmail = '', prefillRole = '', prefillTitle = '' }) => {
  const { user } = useAuth();
  const { volume, setVolume, isSoundEnabled, toggleSound, showNotification, requestNotificationPermission } = useNotification();
  const { error: toastError, success: toastSuccess } = useToast();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(autoOpenNewChat);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const pollIntervalRef = useRef(null);
  const [lastCreatedConversationId, setLastCreatedConversationId] = useState(null);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('/api/chat/conversations', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        // Update unread counts
        const counts = {};
        data.conversations?.forEach(conv => {
          counts[conv.conversation_id] = conv.unread_count || 0;
        });
        setUnreadCounts(counts);
      } else {
        console.error('Failed to fetch conversations:', response.status, response.statusText);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching conversations:', error);
      } else {
        console.warn('Chat API request timed out');
      }
      // Keep existing conversations if failure, or set empty if first load
      if (loading) setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId, searchTerm) => {
    if (!user || !conversationId) return;

    setMessagesLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const url = new URL(`/api/chat/conversations/${conversationId}/messages`, window.location.origin);
      if (searchTerm) url.searchParams.set('search', searchTerm);
      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        
        // Clear unread count for this conversation
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: 0
        }));
      } else {
        console.error('Failed to fetch messages:', response.status, response.statusText);
        toastError('Failed to load messages');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching messages:', error);
        toastError('Error loading messages');
      }
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [user, toastError]);

  // Send message
  const sendMessage = useCallback(async (messageText, replyToId = null, attachment = null) => {
    if (!user || !selectedConversation || !messageText.trim()) return;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`/api/chat/conversations/${selectedConversation.conversation_id}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_text: messageText,
          reply_to_message_id: replyToId,
          message_type: attachment?.message_type || 'text',
          file_url: attachment?.file_url || null,
          file_name: attachment?.file_name || null,
          file_size: attachment?.file_size || null,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        
        // Refresh conversations to update last message
        fetchConversations();
        return true;
      } else {
        let errorMsg = 'Failed to send message. Please try again.';
        try {
          const errData = await response.json();
          if (errData?.error) errorMsg = errData.error;
        } catch {}
        console.error('Failed to send message:', response.status, response.statusText);
        toastError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toastError('Message send timeout. Please retry.');
      } else {
        console.error('Error sending message:', error);
        toastError('Network error. Please check your connection.');
      }
      throw error;
    }
  }, [user, selectedConversation, fetchConversations, toastError]);

  const deleteMessage = useCallback(async (messageId) => {
    if (!user || !selectedConversation || !messageId) return;
    try {
      const response = await fetch(`/api/chat/conversations/${selectedConversation.conversation_id}/messages`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId }),
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.message_id !== messageId));
        fetchConversations();
      } else {
        const err = await response.json().catch(() => ({}));
        toastError(err.error || 'Failed to delete message');
      }
    } catch (e) {
      toastError('Network error deleting message');
    }
  }, [user, selectedConversation, fetchConversations, toastError]);

  const archiveConversation = useCallback(async () => {
    if (!user || !selectedConversation) return;
    try {
      const res = await fetch(`/api/chat/conversations/${selectedConversation.conversation_id}/archive`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setSelectedConversation(null);
        fetchConversations();
        toastSuccess('Conversation archived');
      } else {
        const err = await res.json().catch(() => ({}));
        toastError(err.error || 'Failed to archive');
      }
    } catch (e) {
      toastError('Network error archiving conversation');
    }
  }, [user, selectedConversation, fetchConversations, toastSuccess, toastError]);

  // Handle conversation selection
  const handleConversationSelect = useCallback((conversation) => {
    setSelectedConversation(conversation);
    setShowNewChat(false);
    fetchMessages(conversation.conversation_id);
  }, [fetchMessages]);

  const handleSearchMessages = useCallback((term) => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversation_id, term);
    }
  }, [selectedConversation, fetchMessages]);

  // Handle new conversation created
  const handleNewConversationCreated = useCallback((conversationId) => {
    setShowNewChat(false);
    setLastCreatedConversationId(conversationId);
    fetchConversations();
  }, [fetchConversations]);

  // Auto-select newly created conversation once conversations list updates
  useEffect(() => {
    if (lastCreatedConversationId && conversations.length > 0) {
      const found = conversations.find(c => c.conversation_id === lastCreatedConversationId);
      if (found) {
        handleConversationSelect(found);
        setLastCreatedConversationId(null);
      }
    }
  }, [conversations, lastCreatedConversationId, handleConversationSelect]);

  // Setup polling for real-time updates
  useEffect(() => {
    if (!user) return;

    fetchConversations();
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(() => {
      fetchConversations();
      if (selectedConversation) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const fetchMessagesSilent = async () => {
           try {
             const res = await fetch(`/api/chat/conversations/${selectedConversation.conversation_id}/messages`, { signal: controller.signal });
             clearTimeout(timeout);
             if (res.ok) {
               const data = await res.json();
               const msgs = data.messages || [];
               setMessages(msgs);
               const last = msgs.length ? msgs[msgs.length - 1] : null;
               if (last && last.message_id !== lastSeenMessageId && last.sender_id !== user.user_id) {
                 setLastSeenMessageId(last.message_id);
               }
             }
           } catch (e) { console.error(e); }
        };
        fetchMessagesSilent();
      }
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, selectedConversation, fetchConversations]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (lastSeenMessageId) {
      try {
        if (selectedConversation) {
          const title = selectedConversation.title || 'New message';
          const preview = messages.length ? messages[messages.length - 1].message_text : '';
          if (preview && !document.hasFocus()) {
            try { showNotification(title, preview); } catch {}
          }
        }
      } catch {}
    }
  }, [lastSeenMessageId]);

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-login-required">
          <h3>Please login to access chat</h3>
          <p>You need to be logged in to use the chat functionality.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        {/* Left Sidebar - Conversations List */}
        <div className={`chat-sidebar ${selectedConversation || showNewChat ? 'mobile-hidden' : ''}`}>
          <div className="chat-sidebar-header">
            <h3>Messages</h3>
            <div className="chat-settings-wrapper">
              <button 
                className="btn-settings"
                onClick={() => setShowSettings(!showSettings)}
                title="Notification Settings"
              >
                <i className="fas fa-cog"></i>
              </button>
              {showSettings && (
                <div className="settings-popover">
                  <h4>Notification Settings</h4>
                  <div className="setting-item">
                    <span className="setting-label">Sound</span>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={isSoundEnabled}
                        onChange={toggleSound}
                      />
                    </div>
                  </div>
                  <div className="setting-item" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <span className="setting-label">Volume: {Math.round(volume * 100)}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                  </div>
                </div>
              )}
            </div>
            <button 
              className="btn-new-chat"
              onClick={() => setShowNewChat(true)}
              title="Start new conversation"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <ChatConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Right Area - Messages */}
        <div className="chat-main">
          {showNewChat ? (
            <ChatNewConversation
              onClose={() => setShowNewChat(false)}
              onConversationCreated={handleNewConversationCreated}
              prefillEmail={prefillEmail}
              prefillRole={prefillRole}
              initialTitle={prefillTitle}
            />
          ) : selectedConversation ? (
            <ChatMessagesArea
              conversation={selectedConversation}
              messages={messages}
              loading={messagesLoading}
              onSendMessage={sendMessage}
              currentUser={user}
              onBack={() => setSelectedConversation(null)}
              onSearchMessages={handleSearchMessages}
              onDeleteMessage={deleteMessage}
              onArchiveConversation={archiveConversation}
            />
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-content">
                <i className="fas fa-comments chat-empty-icon"></i>
                <h3>Welcome to Chat</h3>
                <p>Select a conversation to start messaging or create a new one.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowNewChat(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Chat = (props) => (
  <ToastProvider>
    <ChatContent {...props} />
  </ToastProvider>
);

export default Chat;
