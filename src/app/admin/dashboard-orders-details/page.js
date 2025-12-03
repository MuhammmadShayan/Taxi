'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOrderDetails() {
  const router = useRouter();

  useEffect(() => {
    // Legacy route with hard-coded placeholders. Redirect to live bookings list.
    router.replace('/admin/bookings');
  }, [router]);

  return null;
}

