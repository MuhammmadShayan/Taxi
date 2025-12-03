'use client';

import React from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import Chat from '@/components/Chat';

export default function AgencyChatPage() {
  return (
    <AgencyLayout>
      <div className="chat-page">
        <div className="page-header mb-4">
          <h2>Messages & Communication</h2>
          <p>Communicate with customers and administrators</p>
        </div>
        <Chat />
      </div>
    </AgencyLayout>
  );
}

