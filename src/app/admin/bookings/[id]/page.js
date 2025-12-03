'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../../components/AdminLayout';

export default function AdminBookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load booking details');
      }
      setBooking(data.booking);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (!id) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to update booking status');
      }
      await fetchDetails();
    } catch (e) {
      alert(`Failed to update booking status: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const downloadPDF = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/bookings/${id}/generate-pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF.');
      }
    } catch (err) {
      alert('Error generating PDF.');
    }
  };

  const statusBadge = (status) => {
    if (!status) return 'badge text-bg-secondary';
    const s = status.toLowerCase();
    if (s === 'pending') return 'badge text-bg-warning text-white';
    if (s === 'confirmed') return 'badge text-bg-success';
    if (s === 'active') return 'badge text-bg-info';
    if (s === 'completed') return 'badge text-bg-primary';
    if (s === 'canceled' || s === 'cancelled') return 'badge text-bg-danger';
    return 'badge text-bg-secondary';
  };

  return (
    <AdminLayout
      pageTitle={booking ? `Booking #${booking.reservation_id}` : 'Booking Details'}
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Bookings', href: '/admin/bookings' },
        { label: booking ? `#${booking.reservation_id}` : 'Details' }
      ]}
    >
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading booking details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <i className="la la-exclamation-triangle display-1 text-warning"></i>
          <h4 className="mt-3">Failed to load booking</h4>
          <p className="text-muted">{error}</p>
          <button className="btn btn-primary" onClick={fetchDetails}>
            <i className="la la-refresh me-2"></i>Retry
          </button>
        </div>
      ) : !booking ? (
        <div className="text-center py-5">
          <h4>No booking found</h4>
          <Link href="/admin/bookings" className="btn btn-secondary mt-2">
            Back to list
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h4 className="mb-1">{booking.vehicle_name || booking.vehicle_display_name}</h4>
                    {booking.license_plate && (
                      <small className="text-muted">Plate: {booking.license_plate}</small>
                    )}
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                      {booking.total_price_formatted || booking.total_price}
                    </div>
                    <span className={statusBadge(booking.status)}>{booking.status_display || booking.status}</span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-calendar text-primary me-2" style={{ fontSize: '1.2rem' }}></i>
                        <strong>Schedule</strong>
                      </div>
                      <div className="small text-muted">Start</div>
                      <div className="fw-medium mb-2">{booking.start_date_formatted || booking.start_date}</div>
                      <div className="small text-muted">End</div>
                      <div className="fw-medium">{booking.end_date_formatted || booking.end_date}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-user text-primary me-2" style={{ fontSize: '1.2rem' }}></i>
                        <strong>Customer</strong>
                      </div>
                      <div className="fw-medium">{booking.customer_name}</div>
                      <div className="small text-muted">{booking.customer_email}</div>
                      <div className="small text-muted">{booking.customer_phone || 'Phone: Not provided'}</div>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-map-marker text-primary me-2" style={{ fontSize: '1.2rem' }}></i>
                        <strong>Pickup</strong>
                      </div>
                      <div className="fw-medium">{booking.pickup_location_display || booking.pickup_location || 'Not specified'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-info-circle text-primary me-2" style={{ fontSize: '1.2rem' }}></i>
                        <strong>Meta</strong>
                      </div>
                      <div className="small text-muted">Booking Ref</div>
                      <div className="fw-medium mb-2">{booking.booking_reference || `BK${booking.reservation_id}`}</div>
                      <div className="small text-muted">Days</div>
                      <div className="fw-medium">{booking.total_days} day{booking.total_days > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="alert alert-info mt-3">
                    <strong>Special Requests: </strong>{booking.special_requests}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="mb-3">Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm" disabled={updating} onClick={() => updateStatus('confirmed')}>
                        <i className="la la-check-circle me-1"></i>Approve
                      </button>
                      <button className="btn btn-outline-danger btn-sm" disabled={updating} onClick={() => updateStatus('canceled')}>
                        <i className="la la-times me-1"></i>Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button className="btn btn-primary btn-sm" disabled={updating} onClick={() => updateStatus('active')}>
                      <i className="la la-play me-1"></i>Start Rental
                    </button>
                  )}
                  {booking.status === 'active' && (
                    <button className="btn btn-primary btn-sm" disabled={updating} onClick={() => updateStatus('completed')}>
                      <i className="la la-check me-1"></i>Complete
                    </button>
                  )}
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => router.push('/admin/bookings')}>
                    <i className="la la-arrow-left me-1"></i>Back
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={downloadPDF}>
                    <i className="la la-file-pdf-o me-1"></i>PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
