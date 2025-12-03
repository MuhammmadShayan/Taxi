'use client';

import React, { useState, useRef, useEffect } from 'react';

const ChatMessagesArea = ({ 
  conversation, 
  messages, 
  loading, 
  onSendMessage, 
  currentUser,
  onBack,
  onSearchMessages,
  onDeleteMessage,
}) => {
  const [messageText, setMessageText] = useState('');
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(messageText, replyToMessage?.message_id, attachment);
      setMessageText('');
      setReplyToMessage(null);
      setAttachment(null);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onSearchRef = useRef(onSearchMessages);
  useEffect(() => { onSearchRef.current = onSearchMessages; }, [onSearchMessages]);
  useEffect(() => {
    const t = setTimeout(() => {
      onSearchRef.current && onSearchRef.current(searchTerm || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1048576) {
      alert('File too large. Max 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const isImage = file.type.startsWith('image/');
      setAttachment({
        file_name: file.name,
        file_size: file.size,
        file_url: reader.result,
        message_type: isImage ? 'image' : 'file',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    textareaRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyToMessage(null);
  };

  const getConversationTitle = () => {
    if (conversation.title) {
      return conversation.title;
    }
    if (conversation.other_participants) {
      return conversation.other_participants;
    }
    return conversation.type === 'support' ? 'Support Chat' : 'Direct Message';
  };

  const getUserAvatar = (message) => {
    if (message.profile_image) {
      return message.profile_image;
    }
    
    // Default avatar based on role using inline SVG
    switch (message.role) {
      case 'admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dc3545'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🛡️%3C/text%3E%3C/svg%3E";
      case 'agency_owner':
      case 'agency_admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🏢%3C/text%3E%3C/svg%3E";
      default:
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2328a745'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const dateKey = new Date(message.created_at).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="chat-messages-loading">
        <div className="spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="chat-messages-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          {onBack && (
            <button 
              className="btn-icon mobile-only me-2" 
              onClick={onBack}
              title="Back to conversations"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
          <div className="chat-header-avatar">
            <img 
              src={getUserAvatar({ role: conversation.role })} 
              alt={getConversationTitle()}
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e9ecef'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%23495057' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="chat-header-details">
            <h3 className="chat-title">{getConversationTitle()}</h3>
            <p className="chat-status">
              {conversation.type === 'support' ? 'Support Chat' : 
               conversation.role === 'admin' ? 'Administrator' :
               conversation.role === 'agency_owner' ? 'Agency Representative' :
               'Customer'}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          <div className="search-container" style={{ width: '240px' }}>
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-icon" title="Archive conversation" onClick={() => onArchiveConversation && onArchiveConversation()}>
            <i className="fas fa-archive"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Message history">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="chat-no-messages">
            <div className="no-messages-content">
              <i className="fas fa-comments no-messages-icon"></i>
              <h4>No messages yet</h4>
              <p>Start the conversation by sending a message below.</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
            <div key={dateKey} className="messages-date-group">
              <div className="date-divider">
                <span className="date-text">{formatMessageDate(dateMessages[0].created_at)}</span>
              </div>
              
              {dateMessages.map((message) => {
                const isCurrentUser = message.sender_id === currentUser.user_id;
                const showAvatar = !isCurrentUser;
                
                return (
                  <div
                    key={message.message_id}
                    className={`message ${isCurrentUser ? 'own-message' : 'other-message'}`}
                  >
                    {showAvatar && (
                      <div className="message-avatar">
                        <img 
                          src={getUserAvatar(message)} 
                          alt={`${message.first_name} ${message.last_name}`}
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e9ecef'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%23495057' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="message-content">
                      {!isCurrentUser && (
                        <div className="message-sender">
                          {message.first_name} {message.last_name}
                          {message.role === 'admin' && (
                            <span className="sender-badge admin">Admin</span>
                          )}
                          {message.role === 'agency_owner' && (
                            <span className="sender-badge agency">Agency</span>
                          )}
                        </div>
                      )}
                      
                      {message.reply_to_message_id && (
                        <div className="message-reply-context">
                          <div className="reply-indicator"></div>
                          <div className="reply-content">
                            <span className="reply-sender">{message.reply_sender_name}</span>
                            <p className="reply-text">{message.reply_message_text}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="message-bubble">
                        <div className="message-text">{message.message_text}</div>
                        
                        {message.file_url && (
                          <div className="message-attachment">
                            {message.message_type === 'image' ? (
                              <img 
                                src={message.file_url} 
                                alt={message.file_name}
                                className="message-image"
                              />
                            ) : (
                              <div className="message-file">
                                <i className="fas fa-file"></i>
                                <span>{message.file_name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="message-meta">
                          <span className="message-time">
                            {formatMessageTime(message.created_at)}
                          </span>
                          {message.sender_id === currentUser.user_id && (
                            <span className="message-status" title={message.read_count > 0 ? 'Read' : 'Sent'}>
                              {message.read_count > 0 ? (
                                <i className="fas fa-check-double"></i>
                              ) : (
                                <i className="fas fa-check"></i>
                              )}
                            </span>
                          )}
                          {message.is_edited && (
                            <span className="message-edited">Edited</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="message-actions">
                        <button 
                          className="btn-message-action"
                          onClick={() => handleReply(message)}
                          title="Reply"
                        >
                          <i className="fas fa-reply"></i>
                        </button>
                        {message.sender_id === currentUser.user_id && (
                          <button
                            className="btn-message-action"
                            onClick={() => onDeleteMessage && onDeleteMessage(message.message_id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input-area">
        {isTyping && (
          <div className="typing-indicator"><span>Typing...</span></div>
        )}
        {replyToMessage && (
          <div className="reply-preview">
            <div className="reply-preview-content">
              <div className="reply-preview-header">
                <i className="fas fa-reply reply-icon"></i>
                <span>Replying to {replyToMessage.first_name}</span>
                <button 
                  className="btn-cancel-reply"
                  onClick={cancelReply}
                  title="Cancel reply"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="reply-preview-text">{replyToMessage.message_text}</p>
            </div>
          </div>
        )}
        
        <div className="chat-input">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => { setMessageText(e.target.value); setIsTyping(e.target.value.length > 0); }}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="message-textarea"
              rows={1}
              disabled={false}
              aria-label="Type your message"
            />
            
            <div className="input-actions">
              <label className="btn-message-action" title="Attach file" aria-label="Attach file">
                <i className="fas fa-paperclip"></i>
                <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
              <div className="btn-message-action" title="Templates" aria-label="Templates">
                <select onChange={(e) => setMessageText(prev => `${prev ? prev + ' ' : ''}${e.target.value}`)}>
                  <option value="">Template</option>
                  <option value="Hello! How can I help you today?">Hello! How can I help you today?</option>
                  <option value="Your booking has been confirmed.">Your booking has been confirmed.</option>
                  <option value="We are reviewing your request and will reply shortly.">We are reviewing your request and will reply shortly.</option>
                </select>
              </div>
              <button 
                className="btn-send"
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sending}
                title="Send message"
                aria-label="Send message"
              >
                {sending ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagesArea;
