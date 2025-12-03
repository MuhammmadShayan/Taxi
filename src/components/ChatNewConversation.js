'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './Toast';

const ChatNewConversation = ({ onClose, onConversationCreated, prefillEmail = '', prefillRole = '', initialTitle = '' }) => {
  const { token } = useAuth();
  const { error: toastError, info: toastInfo, success: toastSuccess } = useToast();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(prefillEmail || '');
  const [conversationTitle, setConversationTitle] = useState(initialTitle || '');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(prefillRole || '');
  const [autoCreateAttempts, setAutoCreateAttempts] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, token]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole) params.append('role', selectedRole);

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/chat/users?${params.toString()}`, {
        credentials: 'include',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefillEmail && users.length > 0) {
      const match = users.find(u => u.email === prefillEmail);
      if (match) {
        setSelectedUsers(prev => {
          const already = prev.some(u => u.user_id === match.user_id);
          return already ? prev : [match];
        });
      }
    }
  }, [users, prefillEmail]);

  useEffect(() => {
    if (prefillEmail && selectedUsers.length === 1 && !creating && autoCreateAttempts < 2) {
      setAutoCreateAttempts(prev => prev + 1);
      handleCreateConversation(true);
    }
  }, [prefillEmail, selectedUsers, creating, autoCreateAttempts]);

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.user_id === user.user_id);
      if (isSelected) {
        return prev.filter(u => u.user_id !== user.user_id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateConversation = async (isAuto = false) => {
    if (selectedUsers.length === 0) {
      toastInfo('Please select at least one user to start a conversation.');
      return;
    }

    setCreating(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_ids: selectedUsers.map(u => u.user_id),
          title: conversationTitle || null,
          type: selectedUsers.length === 1 ? 'direct' : 'group',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        toastSuccess('Conversation created');
        onConversationCreated(data.conversation_id);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.conversation_id) {
          toastInfo('Conversation already exists. Opening it.');
          onConversationCreated(errorData.conversation_id);
        } else {
          const msg = errorData.error || 'Failed to create conversation. Please try again.';
          toastError(msg);
        }
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      if (error.name === 'AbortError') {
        toastError('Conversation creation timed out. Please try again.');
      } else {
        toastError('Network error creating conversation. Please try again.');
      }
    } finally {
      setCreating(false);
      if (isAuto) {
        // If auto creation failed, stop further auto attempts
        // User can manually press Start Conversation
      }
    }
  };

  const getUserAvatar = (user) => {
    if (user.profile_image) {
      return user.profile_image;
    }
    
    // Default avatar based on role using inline SVG
    switch (user.role) {
      case 'admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dc3545'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🛡️%3C/text%3E%3C/svg%3E";
      case 'agency_owner':
      case 'agency_admin':
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E🏢%3C/text%3E%3C/svg%3E";
      default:
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2328a745'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
    }
  };

  const getUserDisplayName = (user) => {
    if (user.role === 'agency_owner' && user.business_name) {
      return `${user.first_name} ${user.last_name} (${user.business_name})`;
    }
    return `${user.first_name} ${user.last_name}`;
  };

  const getUserRoleBadge = (user) => {
    switch (user.role) {
      case 'admin':
        return <span className="role-badge admin">Admin</span>;
      case 'agency_owner':
        return <span className="role-badge agency">Agency</span>;
      case 'customer':
        return <span className="role-badge customer">Customer</span>;
      default:
        return null;
    }
  };

  if (creating && prefillEmail) {
    return (
      <div className="chat-new-conversation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: '#6c757d' }}>Creating conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-new-conversation">
      {/* Header */}
      <div className="chat-new-header">
        <div className="header-left">
          <h3>New Conversation</h3>
          <p>Select users to start chatting with</p>
        </div>
        <button 
          className="btn-close" 
          onClick={onClose}
          title="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="chat-new-filters">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="role-filter">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-select"
          >
            <option value="">All Users</option>
            <option value="admin">Admins</option>
            <option value="agency_owner">Agencies</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <h4>Selected Users ({selectedUsers.length})</h4>
          <div className="selected-users-list">
            {selectedUsers.map(user => (
              <div key={user.user_id} className="selected-user">
                <img 
                  src={getUserAvatar(user)} 
                  alt={getUserDisplayName(user)}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e9ecef'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%23495057' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span className="user-name">{getUserDisplayName(user)}</span>
                <button 
                  className="btn-remove"
                  onClick={() => handleUserSelect(user)}
                  title="Remove"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          
          {/* Group Chat Title (optional for multiple users) */}
          {selectedUsers.length > 1 && (
            <div className="conversation-title-input">
              <input
                type="text"
                placeholder="Group conversation title (optional)"
                value={conversationTitle}
                onChange={(e) => setConversationTitle(e.target.value)}
                className="title-input"
              />
            </div>
          )}
        </div>
      )}

      {/* Users List */}
      <div className="users-list">
        {loading ? (
          <div className="loading-users">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="no-users">
            <i className="fas fa-user-slash no-users-icon"></i>
            <h4>No users found</h4>
            <p>
              {searchTerm 
                ? `No users match "${searchTerm}"`
                : 'No users available to chat with'
              }
            </p>
            {prefillEmail && searchTerm === prefillEmail && (
              <div className="mt-3">
                <p className="text-muted small mb-3">
                  The customer with email <strong>{prefillEmail}</strong> does not have a registered account.
                </p>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    document.querySelector('.search-input')?.focus();
                  }}
                >
                  Search for other users
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="users-grid">
            {users.map(user => {
              const isSelected = selectedUsers.some(u => u.user_id === user.user_id);
              
              return (
                <div
                  key={user.user_id}
                  className={`user-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    <img 
                      src={getUserAvatar(user)} 
                      alt={getUserDisplayName(user)}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e9ecef'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='%23495057' font-size='14'%3E👤%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  
                  <div className="user-info">
                    <h4 className="user-name">{getUserDisplayName(user)}</h4>
                    <div className="user-meta">
                      {getUserRoleBadge(user)}
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="user-select">
                    {isSelected ? (
                      <i className="fas fa-check-circle selected-icon"></i>
                    ) : (
                      <i className="far fa-circle unselected-icon"></i>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="chat-new-actions">
        <button 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={creating}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleCreateConversation}
          disabled={selectedUsers.length === 0 || creating}
        >
          {creating ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Creating...
            </>
          ) : (
            <>
              <i className="fas fa-comments me-2"></i>
              Start Conversation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatNewConversation;
