'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';

export default function ManageBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    start_date: '',
    end_date: '',
    total_price: '',
    payment_status: '',
    special_requests: ''
  });

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
      
      // Populate form with existing data
      setFormData({
        status: data.booking.status || '',
        start_date: data.booking.start_date?.split('T')[0] || '',
        end_date: data.booking.end_date?.split('T')[0] || '',
        total_price: data.booking.total_price || '',
        payment_status: data.booking.payment_status || 'pending',
        special_requests: data.booking.special_requests || ''
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to update booking');
      }
      alert('Booking updated successfully!');
      router.push(`/admin/bookings/${id}`);
    } catch (e) {
      alert(`Failed to update booking: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/bookings/${id}`);
  };

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to cancel booking');
      }
      alert('Booking cancelled successfully!');
      await fetchDetails();
    } catch (e) {
      alert(`Failed to cancel booking: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status) => {
    if (!status) return 'badge bg-secondary';
    const s = status.toLowerCase();
    if (s === 'pending') return 'badge bg-warning';
    if (s === 'confirmed') return 'badge bg-success';
    if (s === 'active') return 'badge bg-info';
    if (s === 'completed') return 'badge bg-primary';
    if (s === 'canceled' || s === 'cancelled') return 'badge bg-danger';
    return 'badge bg-secondary';
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Earnings', href: '/admin/earnings' },
    { label: booking ? `#${booking.reservation_id}` : 'Manage' }
  ];

  return (
    <AdminLayout
      pageTitle={booking ? `Manage Booking #${booking.reservation_id}` : 'Manage Booking'}
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading booking details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <div className="alert alert-danger">
            <i className="la la-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={fetchDetails}>
            <i className="la la-refresh me-2"></i>Retry
          </button>
        </div>
      ) : !booking ? (
        <div className="text-center py-5">
          <h4>No booking found</h4>
          <button className="btn btn-secondary mt-2" onClick={() => router.push('/admin/earnings')}>
            Back to Earnings
          </button>
        </div>
      ) : (
        <div className="row">
          {/* Left Column - Booking Summary */}
          <div className="col-lg-4">
            <div className="form-box mb-4">
              <div className="form-title-wrap">
                <h3 className="title">Booking Summary</h3>
              </div>
              <div className="form-content">
                <div className="mb-3">
                  <label className="form-label fw-bold">Booking ID</label>
                  <p className="mb-2">#{booking.reservation_id}</p>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Current Status</label>
                  <p className="mb-2">
                    <span className={statusBadge(booking.status)}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Vehicle</label>
                  <p className="mb-2">{booking.vehicle_name || booking.vehicle_display_name}</p>
                  {booking.license_plate && (
                    <small className="text-muted">Plate: {booking.license_plate}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Customer</label>
                  <p className="mb-1">{booking.customer_name}</p>
                  <small className="text-muted d-block">{booking.customer_email}</small>
                  {booking.customer_phone && (
                    <small className="text-muted d-block">{booking.customer_phone}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Agency</label>
                  <p className="mb-1">{booking.agency_name || 'N/A'}</p>
                  {booking.agency_id && (
                    <small className="text-muted">ID: {booking.agency_id}</small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Duration</label>
                  <p className="mb-0">{booking.total_days} day{booking.total_days > 1 ? 's' : ''}</p>
                </div>

                {booking.pickup_location && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Pickup Location</label>
                    <p className="mb-0">{booking.pickup_location}</p>
                  </div>
                )}

                {booking.dropoff_location && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Dropoff Location</label>
                    <p className="mb-0">{booking.dropoff_location}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Total Amount</label>
                  <h5 className="text-primary mb-0">
                    {booking.total_price_formatted || `$${booking.total_price}`}
                  </h5>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Commission</label>
                  <p className="text-warning mb-0">
                    {booking.commission_formatted || `$${booking.commission_amount || 0}`}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Booking Reference</label>
                  <p className="mb-0">{booking.booking_reference || `BK${booking.reservation_id}`}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Created At</label>
                  <p className="mb-0 text-muted">{new Date(booking.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="form-box">
              <div className="form-title-wrap">
                <h3 className="title">Quick Actions</h3>
              </div>
              <div className="form-content">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => router.push(`/admin/bookings/${id}`)}
                  >
                    <i className="la la-eye me-2"></i>View Details
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={handleCancelBooking}
                    disabled={saving || booking.status === 'cancelled' || booking.status === 'completed'}
                  >
                    <i className="la la-times me-2"></i>Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Edit Booking Details</h3>
                </div>
                <div className="form-content">
                  <div className="row">
                    {/* Status */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Booking Status *</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Payment Status *</label>
                      <select
                        name="payment_status"
                        className="form-select"
                        value={formData.payment_status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    {/* Start Date */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        name="start_date"
                        className="form-control"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* End Date */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">End Date *</label>
                      <input
                        type="date"
                        name="end_date"
                        className="form-control"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Total Price */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Total Price ($) *</label>
                      <input
                        type="number"
                        name="total_price"
                        className="form-control"
                        value={formData.total_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    {/* Special Requests */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        name="special_requests"
                        className="form-control"
                        rows="3"
                        value={formData.special_requests}
                        onChange={handleInputChange}
                        placeholder="Customer special requests..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-box mt-4">
                <div className="form-content">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <i className="la la-times me-2"></i>Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="la la-save me-2"></i>Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
