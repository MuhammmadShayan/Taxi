'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ImpersonationBanner() {
  const { user, checkAuthStatus } = useAuth();
  const router = useRouter();
  
  if (!user?.impersonated) return null;

  const handleReturn = async () => {
    try {
      console.log('🔙 Returning to admin from impersonation...');
      
      const resp = await fetch('/api/admin/impersonate/restore', { 
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await resp.json();
      console.log('✅ Restore response:', data);
      
      if (resp.ok && data.success) {
        console.log('🚀 Redirecting to:', data.redirectTo || '/admin/dashboard');
        
        // Refresh auth state first to pick up restored admin session
        await checkAuthStatus();
        
        // Use router.push for client-side navigation
        const redirectPath = data.redirectTo || '/admin/dashboard';
        router.push(redirectPath);
        
        // Force a hard reload to ensure all state is fresh
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      } else {
        console.error('❌ Failed to restore admin:', data.error);
        alert(data.error || 'Failed to return to admin');
      }
    } catch (e) {
      console.error('🔥 Return to admin failed:', e);
      alert('Failed to return to admin');
    }
  };

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      background: '#1f2937',
      color: 'white',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <strong>Impersonating:</strong> {user.first_name} {user.last_name} <span style={{opacity: 0.8}}>({user.user_type})</span>
      </div>
      <button onClick={handleReturn} className="btn btn-sm btn-warning">
        <i className="la la-undo me-1"></i>
        Return to Admin
      </button>
    </div>
  );
}