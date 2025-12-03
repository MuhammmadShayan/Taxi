'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (user.user_type === 'admin' || user.role === 'admin')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  );
}

