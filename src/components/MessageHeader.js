'use client';

import { useNotification } from '@/contexts/NotificationContext';

export default function MessageHeader({ onClick }) {
  const { unreadCount } = useNotification();
  
  return (
    <div className="notification-item me-3">
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onClick) onClick();
        }}
        style={{ 
          cursor: 'pointer', 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          padding: 0,
          outline: 'none',
          zIndex: 10
        }}
        aria-label="Messages"
      >
        <i className="la la-envelope" style={{ fontSize: '28px', color: '#fff' }}></i>
        {unreadCount > 0 && (
          <span 
            className="badge bg-danger" 
            style={{ 
              position: 'absolute', 
              top: '-6px', 
              right: '-8px', 
              borderRadius: '50%',
              padding: '4px 6px',
              fontSize: '11px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
