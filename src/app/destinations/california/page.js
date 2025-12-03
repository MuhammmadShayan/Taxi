'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CaliforniaPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to search page with California as pickup location
    router.push('/search?pickup_location=California,%20USA');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to California car rentals...</p>
      </div>
    </div>
  );
}
