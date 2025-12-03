'use client';

import React from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import Chat from '@/components/Chat';

export default function AdminChatPage() {
  return (
    <AdminDashboardLayout>
      <div className="chat-page">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Admin Communication Center</h2>
              <p>Manage all platform communications with users and agencies</p>
            </div>
            <div className="chat-stats">
              <div className="stat-card">
                <i className="fas fa-comments"></i>
                <div>
                  <span className="stat-number">24</span>
                  <span className="stat-label">Active Chats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Chat />
      </div>
    </AdminDashboardLayout>
  );
}

