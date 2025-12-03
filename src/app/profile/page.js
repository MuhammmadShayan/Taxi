'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }

      // Redirect based on user type
      const userType = user.user_type || user.role;
      
      switch (userType) {
        case 'admin':
        case 'super_admin':
          router.push('/admin/dashboard-profile');
          break;
        case 'agency':
        case 'agency_owner':
        case 'agency_admin':
          router.push('/agency/dashboard-profile');
          break;
        case 'driver':
          router.push('/driver/dashboard-profile');
          break;
        case 'customer':
          router.push('/customer/profile');
          break;
        case 'user':
          router.push('/user/dashboard-profile');
          break;
        default:
          // Default to customer profile
          router.push('/customer/profile');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
