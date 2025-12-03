'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard-profile');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Redirecting...</span>
        </div>
        <p className="mt-3">Redirecting to profile...</p>
      </div>
    </div>
  );
}
