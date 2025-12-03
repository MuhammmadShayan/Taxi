'use client';

import { useAuth } from '../contexts/AuthContext';
import NotificationHeader from './NotificationHeader';
import MessageHeader from './MessageHeader';
import UserProfileHeader from './UserProfileHeader';

export default function DynamicHeader() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="jsx-af76ee54c9d17dd2 notification-wrap d-flex align-items-center">
        <div className="spinner-border spinner-border-sm me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If no user is logged in, don't render the dynamic header
  if (!user) {
    console.log('DynamicHeader: No authenticated user found');
    return null;
  }

  console.log('DynamicHeader: Rendering for user:', user.user_id, user.email);

  return (
    <div className="jsx-af76ee54c9d17dd2 notification-wrap d-flex align-items-center">
      {/* Notifications */}
      <NotificationHeader />
      
      {/* Messages */}
      <MessageHeader />
      
      {/* User Profile */}
      <UserProfileHeader />
    </div>
  );
}