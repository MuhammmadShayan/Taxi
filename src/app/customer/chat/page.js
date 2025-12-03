'use client';

import React from 'react';
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout';
import Chat from '@/components/Chat';

export default function CustomerChatPage() {
  return (
    <CustomerDashboardLayout>
      <div className="chat-page">
        <Chat />
      </div>
    </CustomerDashboardLayout>
  );
}
