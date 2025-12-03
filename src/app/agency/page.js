'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AgencyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (user.role === 'agency_owner' || user.user_type === 'agency_admin') {
        router.push('/agency/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="preloader" id="preloader">
      <div className="loader">
        <svg className="spinner" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          ></circle>
        </svg>
      </div>
    </div>
  );
}

