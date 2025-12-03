'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Chat from '@/components/Chat';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatPrefillEmail, setChatPrefillEmail] = useState('');
  const [chatPrefillTitle, setChatPrefillTitle] = useState('');
  const [chatPrefillRole, setChatPrefillRole] = useState('');
  
  const searchParams = useSearchParams();

  // Fetch bookings from API
  const fetchBookings = async (status = 'all', page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status && status !== 'all') {
        queryParams.append('status', status);
      }
      
      const response = await fetch(`/api/admin/bookings?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh bookings list
        fetchBookings(statusFilter, pagination.page);
      } else {
        alert('Failed to update booking status: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status');
    }
  };

  // Open chat modal with prefilled recipient
  const sendMessage = (bookingId, customerEmail) => {
    setChatPrefillEmail(customerEmail || '');
    setChatPrefillRole('customer');
    setChatPrefillTitle(`Booking #${bookingId}`);
    setShowChatModal(true);
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reason: 'Admin cancellation',
          refund_amount: null // Admin can specify refund amount
        })
      });
      
      if (response.ok) {
        fetchBookings(statusFilter, pagination.page);
        alert('Booking cancelled successfully!');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  // Approve/Confirm booking
  const approveBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/approve`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchBookings(statusFilter, pagination.page);
        alert('Booking approved successfully!');
      } else {
        alert('Failed to approve booking');
      }
    } catch (err) {
      console.error('Error approving booking:', err);
      alert('Failed to approve booking');
    }
  };

  // Download PDF for booking
  const downloadBookingPDF = async (bookingId) => {
    try {
      console.log('📄 Requesting PDF download for booking:', bookingId);
      
      // Fetch the PDF
      const response = await fetch(`/api/bookings/${bookingId}/generate-pdf`);
      
      if (response.ok) {
        console.log('✅ PDF received successfully');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-confirmation-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('🎉 PDF downloaded successfully');
      } else {
        console.error('❌ PDF generation failed:', response.status);
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('🔥 Error downloading PDF:', error);
      alert('Error downloading PDF. Please check your connection and try again.');
    }
  };

  useEffect(() => {
    // Get initial status from URL params
    const initialStatus = searchParams.get('status') || 'all';
    setStatusFilter(initialStatus);
    fetchBookings(initialStatus);
  }, [searchParams]);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings(newStatus, 1);
  };

  const handlePageChange = (newPage) => {
    fetchBookings(statusFilter, newPage);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'confirmed': 'badge text-bg-success',
      'pending': 'badge text-bg-warning text-white',
      'completed': 'badge text-bg-primary',
      'canceled': 'badge text-bg-danger',
      'active': 'badge text-bg-info'
    };
    return statusClasses[status?.toLowerCase()] || 'badge text-bg-secondary';
  };

  return (
    <>
    <AdminLayout
      pageTitle="Booking Management"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Bookings' }
      ]}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">Booking Results</h3>
                <div className="select-contain select2-container-wrapper">
                  <select 
                    className="select-contain-select form-control"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                  >
                    <option value="all">Any Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-content pb-2">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <i className="la la-exclamation-triangle display-1 text-warning"></i>
                  <h4 className="mt-3">Error Loading Bookings</h4>
                  <p className="text-muted">{error}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => fetchBookings(statusFilter, pagination.page)}
                  >
                    <i className="la la-refresh me-2"></i>Try Again
                  </button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="la la-shopping-cart display-1 text-muted"></i>
                  <h4 className="mt-3">No bookings found</h4>
                  <p className="text-muted">No bookings match the current filter criteria</p>
                </div>
              ) : (
                <>
                  {bookings.map((booking) => (
                    <div key={booking.reservation_id} className="card-item car-card card-item-list card-item--list mb-3">
                      <div className="card-img">
                        {booking.images && booking.images.length > 0 ? (
                          <img src={booking.images[0]} alt="vehicle" />
                        ) : (
                          <div className="default-car-img d-flex align-items-center justify-content-center bg-light">
                            <i className="la la-car display-4 text-primary"></i>
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        {/* Header: Vehicle + Status + Amount */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                          <div>
                            <h3 className="card-title mb-0">{booking.vehicle_display_name}</h3>
                            <small className="text-muted">
                              {booking.license_plate ? `Plate: ${booking.license_plate}` : ''}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>{booking.total_price_formatted}</div>
                            <span className={`${getStatusBadge(booking.status)} mt-1 d-inline-block`}>
                              {booking.status_display}
                            </span>
                          </div>
                        </div>

                        {/* Meta badges */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge bg-secondary">
                            <i className="la la-hashtag me-1"></i> Booking #{booking.booking_reference}
                          </span>
                          {booking.payment_status && (
                            <span className={`badge ${booking.payment_status === 'paid' ? 'text-bg-success' : 'text-bg-warning'} d-inline-flex align-items-center`}>
                              <i className="la la-credit-card me-1"></i>
                              {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                            </span>
                          )}
                          <span className="badge bg-light text-dark">
                            <i className="la la-clock-o me-1"></i>
                            {booking.total_days} day{booking.total_days > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Details grid */}
                        <div className="row g-3 mb-3">
                          <div className="col-md-4">
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex align-items-center mb-2">
                                <i className="la la-calendar text-primary me-2" style={{ fontSize: '1.25rem' }}></i>
                                <strong>Schedule</strong>
                              </div>
                              <div className="small text-muted">Start</div>
                              <div className="fw-medium mb-2">{booking.start_date_formatted}</div>
                              <div className="small text-muted">End</div>
                              <div className="fw-medium">{booking.end_date_formatted}</div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex align-items-center mb-2">
                                <i className="la la-user text-primary me-2" style={{ fontSize: '1.25rem' }}></i>
                                <strong>Customer</strong>
                              </div>
                              <div className="fw-medium">{booking.customer_name}</div>
                              <div className="small text-muted">{booking.customer_email}</div>
                              <div className="small text-muted">{booking.customer_phone || 'Phone: Not provided'}</div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex align-items-center mb-2">
                                <i className="la la-map-marker text-primary me-2" style={{ fontSize: '1.25rem' }}></i>
                                <strong>Pickup</strong>
                              </div>
                              <div className="fw-medium">{booking.pickup_location_display || 'Not specified'}</div>
                            </div>
                          </div>
                        </div>

                        {booking.special_requests && (
                          <div className="alert alert-info alert-sm">
                            <strong>Special Requests:</strong> {booking.special_requests}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            onClick={() => sendMessage(booking.reservation_id, booking.customer_email)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="la la-envelope me-1"></i>Message
                          </button>
                          <Link 
                            href={`/admin/bookings/${booking.reservation_id}`}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <i className="la la-eye me-1"></i>Details
                          </Link>
                          <button
                            onClick={() => downloadBookingPDF(booking.reservation_id)}
                            className="btn btn-outline-danger btn-sm"
                            title="Download PDF"
                          >
                            <i className="la la-file-pdf-o me-1"></i>PDF
                          </button>
                        </div>
                      </div>
                      <div className="action-btns d-flex align-items-center p-3">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.reservation_id, 'confirmed')}
                              className="btn btn-success btn-sm me-2"
                            >
                              <i className="la la-check-circle me-1"></i>Approve
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.reservation_id, 'canceled')}
                              className="btn btn-outline-danger btn-sm"
                            >
                              <i className="la la-times me-1"></i>Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.reservation_id, 'active')}
                            className="btn btn-primary btn-sm me-2"
                          >
                            <i className="la la-play me-1"></i>Start Rental
                          </button>
                        )}
                        {booking.status === 'active' && (
                          <button
                            onClick={() => updateBookingStatus(booking.reservation_id, 'completed')}
                            className="btn btn-primary btn-sm me-2"
                          >
                            <i className="la la-check me-1"></i>Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="row">
                      <div className="col-12">
                        <nav aria-label="Bookings pagination">
                          <ul className="pagination justify-content-center">
                            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                              >
                                Previous
                              </button>
                            </li>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                              <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                        <div className="text-center text-muted">
                          Showing {bookings.length} of {pagination.total} bookings
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
    {showChatModal && (
      <div className="chat-modal-overlay" role="dialog" aria-modal="true">
        <div className="chat-modal">
          <div className="chat-modal-header">
            <h4 className="mb-0">Messages</h4>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowChatModal(false)} aria-label="Close chat">
              <i className="la la-times"></i>
            </button>
          </div>
          <div className="chat-modal-body">
            <Chat autoOpenNewChat={true} prefillEmail={chatPrefillEmail} prefillRole={chatPrefillRole} prefillTitle={chatPrefillTitle} />
          </div>
        </div>
        <style jsx>{`
          .chat-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            backdrop-filter: blur(2px);
          }
          .chat-modal {
            width: 90vw;
            max-width: 1100px;
            height: 85vh;
            max-height: 900px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: modalSlideIn 0.3s ease-out;
          }
          @keyframes modalSlideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .chat-modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
          }
          .chat-modal-body {
            flex: 1;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </div>
    )}
    </>
  );
}

