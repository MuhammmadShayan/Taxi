'use client';

import React, { useState } from 'react';

const ChatConversationList = ({ 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  unreadCounts 
}) => {
  const [filter, setFilter] = useState('all');

  const filteredConversations = (conversations || []).filter(c => {
    if (filter === 'all') return true;
    if (filter === 'support') return c.type === 'support';
    if (filter === 'agency') return ['agency_owner', 'agency_admin'].includes(c.role);
    if (filter === 'customer') return ['customer', 'user'].includes(c.role);
    return true;
  });
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      // Less than 24 hours - show time
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      // Less than 7 days - show day
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // More than 7 days - show date
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength ? 
      message.substring(0, maxLength) + '...' : 
      message;
  };

  const getConversationTitle = (conversation) => {
    if (conversation.title) {
      return conversation.title;
    }

    // For direct conversations, show the other participant's name
    if (conversation.other_participants) {
      return conversation.other_participants;
    }

    // Fallback based on type
    switch (conversation.type) {
      case 'support':
        return 'Support Chat';
      case 'group':
        return 'Group Chat';
      default:
        return 'Direct Message';
    }
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.profile_image) {
      return conversation.profile_image;
    }
    
    // Default avatar based on role or type using inline SVG
    switch (conversation.role) {
      case 'admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dc3545'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🛡️%3C/text%3E%3C/svg%3E";
      case 'agency_owner':
      case 'agency_admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🏢%3C/text%3E%3C/svg%3E";
      default:
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2328a745'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
    }
  };

  if (!conversations || conversations.length === 0) {
    return (
      <div className="chat-conversations-list">
        <div 
          className="chat-filter-tabs" 
          role="tablist" 
          aria-label="Conversation filters"
        >
          <button 
            role="tab" 
            aria-selected={filter === 'all'} 
            aria-controls="chat-list-all"
            id="tab-all"
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            role="tab" 
            aria-selected={filter === 'customer'} 
            aria-controls="chat-list-customer"
            id="tab-customer"
            className={filter === 'customer' ? 'active' : ''} 
            onClick={() => setFilter('customer')}
          >
            Customers
          </button>
          <button 
            role="tab" 
            aria-selected={filter === 'agency'} 
            aria-controls="chat-list-agency"
            id="tab-agency"
            className={filter === 'agency' ? 'active' : ''} 
            onClick={() => setFilter('agency')}
          >
            Agencies
          </button>
        </div>
        <div className="chat-conversations-empty" role="tabpanel" aria-labelledby={`tab-${filter}`}>
          <div className="empty-state">
            <i className="fas fa-inbox empty-icon"></i>
            <p>No conversations yet</p>
            <small>Start a new conversation to begin chatting</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-conversations-list-container">
      <div 
        className="chat-filter-tabs" 
        role="tablist" 
        aria-label="Conversation filters"
      >
        <button 
          role="tab" 
          aria-selected={filter === 'all'} 
          aria-controls="chat-list-panel"
          id="tab-all"
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          role="tab" 
          aria-selected={filter === 'customer'} 
          aria-controls="chat-list-panel"
          id="tab-customer"
          className={filter === 'customer' ? 'active' : ''} 
          onClick={() => setFilter('customer')}
        >
          Customers
        </button>
        <button 
          role="tab" 
          aria-selected={filter === 'agency'} 
          aria-controls="chat-list-panel"
          id="tab-agency"
          className={filter === 'agency' ? 'active' : ''} 
          onClick={() => setFilter('agency')}
        >
          Agencies
        </button>
      </div>
      <div 
        className="chat-conversations-list" 
        role="tabpanel" 
        id="chat-list-panel"
        aria-labelledby={`tab-${filter}`}
      >
        {filteredConversations.length === 0 ? (
           <div className="p-4 text-center text-muted">
             <small>No conversations in this category</small>
           </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?.conversation_id === conversation.conversation_id;
            const unreadCount = unreadCounts[conversation.conversation_id] || 0;
            
            return (
              <div
                key={conversation.conversation_id}
                className={`conversation-item ${isSelected ? 'selected' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => onConversationSelect(conversation)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Chat with ${getConversationTitle(conversation)}, ${unreadCount > 0 ? unreadCount + ' unread messages' : 'no unread messages'}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onConversationSelect(conversation);
                  }
                }}
              >
                <div className="conversation-avatar">
                  <img 
                    src={getConversationAvatar(conversation)} 
                    alt={getConversationTitle(conversation)}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e9ecef'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%23495057' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {conversation.status === 'active' && (
                    <div className="status-indicator online"></div>
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="conversation-title">
                      {getConversationTitle(conversation)}
                    </h4>
                    <span className="conversation-time">
                      {formatTime(conversation.last_message_at || conversation.updated_at)}
                    </span>
                  </div>
                  
                  <div className="conversation-preview">
                    <p className="last-message">
                      {truncateMessage(conversation.last_message)}
                    </p>
                    {unreadCount > 0 && (
                      <span className="unread-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="conversation-meta">
                    {conversation.type === 'support' && (
                      <span className="chat-type-badge support">
                        <i className="fas fa-headset"></i> Support
                      </span>
                    )}
                    {conversation.role === 'admin' && (
                      <span className="role-badge admin">
                        <i className="fas fa-shield-alt"></i> Admin
                      </span>
                    )}
                    {conversation.role === 'agency_owner' && (
                      <span className="role-badge agency">
                        <i className="fas fa-building"></i> Agency
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatConversationList;
