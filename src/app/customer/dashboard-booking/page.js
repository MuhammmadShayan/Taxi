'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '../../../components/CustomerDashboardLayout';
import Link from 'next/link';

export default function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  // Fetch customer bookings from API
  const fetchBookings = async (status = 'all', page = 1) => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        customer_email: user.email,
        page: page.toString(),
        limit: '10'
      });
      
      if (status && status !== 'all') {
        queryParams.append('status', status);
      }
      
      const response = await fetch(`/api/customer/bookings?${queryParams}`);
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

  // Fetch bookings when user is available or filter changes
  useEffect(() => {
    if (user?.email) {
      fetchBookings(statusFilter);
    }
  }, [user?.email, statusFilter]);



  const getStatusBadge = (status) => {
    const statusClasses = {
      'confirmed': 'badge bg-success',
      'pending': 'badge bg-warning',
      'completed': 'badge bg-primary',
      'canceled': 'badge bg-danger',
      'active': 'badge bg-info',
      'no_show': 'badge bg-secondary'
    };
    return statusClasses[status?.toLowerCase()] || 'badge bg-secondary';
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    fetchBookings(statusFilter, newPage);
  };

  // Download PDF for booking
  const downloadBookingPDF = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/generate-pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-confirmation-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  return (
    <CustomerDashboardLayout pageTitle="My Bookings" breadcrumbs={["Bookings"]}>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <h3 className="title">Vehicle Bookings</h3>
                <div className="d-flex align-items-center gap-3">
                  <div className="filter-group">
                    <select 
                      className="form-select form-select-sm"
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>
                  <Link href="/search" className="theme-btn theme-btn-small">
                    <i className="la la-plus me-1"></i>New Booking
                  </Link>
                </div>
              </div>
            </div>
            <div className="form-content">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2">Loading your bookings...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-5">
                          <i className="la la-exclamation-triangle display-1 text-warning"></i>
                          <h4 className="mt-3">Error Loading Bookings</h4>
                          <p className="text-muted">{error}</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => fetchBookings(statusFilter)}
                          >
                            <i className="la la-refresh me-2"></i>Try Again
                          </button>
                        </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="la la-car display-1 text-muted"></i>
                        <h4 className="mt-3">No bookings yet</h4>
                        <p className="text-muted">Start by searching for available vehicles</p>
                        <Link href="/search" className="btn btn-primary">
                          <i className="la la-search me-2"></i>Search Vehicles
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="row">
                          {bookings.map((booking) => (
                            <div key={booking.reservation_id} className="col-lg-12 mb-4">
                              <div className="card booking-card">
                                  <div className="card-body">
                                    <div className="row align-items-center">
                                      <div className="col-lg-2">
                                        <div className="booking-vehicle">
                                          {booking.images && booking.images.length > 0 ? (
                                            <img 
                                              src={booking.images[0]}
                                              alt={booking.vehicle_display_name}
                                              className="vehicle-image"
                                              style={{ width: '100%' }}
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                              }}
                                            />
                                          ) : null}
                                          <i className="la la-car display-4 text-primary" style={{display: booking.images && booking.images.length > 0 ? 'none' : 'block'}}></i>
                                        </div>
                                      </div>
                                      <div className="col-lg-3">
                                        <h5 className="booking-vehicle-name">{booking.vehicle_display_name}</h5>
                                        <p className="booking-ref text-muted">Ref: {booking.booking_reference}</p>
                                        {booking.category_name && (
                                          <span className="badge bg-light text-dark">{booking.category_name}</span>
                                        )}
                                      </div>
                                      <div className="col-lg-2">
                                        <div className="booking-dates">
                                          <p className="mb-1"><strong>From:</strong> {booking.start_date_formatted}</p>
                                          <p className="mb-0"><strong>To:</strong> {booking.end_date_formatted}</p>
                                          {booking.total_days && (
                                            <small className="text-muted">{booking.total_days} day{booking.total_days > 1 ? 's' : ''}</small>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-2">
                                        <div className="booking-location">
                                          <i className="la la-map-marker text-danger"></i>
                                          <span className="ms-1">{booking.pickup_location_display}</span>
                                          {booking.agency_name && (
                                            <div className="small text-muted mt-1">
                                              <i className="la la-building me-1"></i>{booking.agency_name}
                                            </div>
                                          )}
                                          {(booking.agency_phone || booking.agency_email) && (
                                            <div className="small mt-1">
                                              {booking.agency_phone && (
                                                <div className="text-muted">
                                                  <i className="la la-phone me-1"></i>
                                                  <a href={`tel:${booking.agency_phone}`} className="text-decoration-none text-muted">{booking.agency_phone}</a>
                                                </div>
                                              )}
                                              {booking.agency_email && (
                                                <div className="text-muted">
                                                  <i className="la la-envelope me-1"></i>
                                                  <a href={`mailto:${booking.agency_email}`} className="text-decoration-none text-muted">{booking.agency_email}</a>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-2">
                                        <div className="booking-price text-center">
                                          <h4 className="price-amount">{booking.total_price_formatted}</h4>
                                          <span className={getStatusBadge(booking.status)}>
                                            {booking.status_display}
                                          </span>
                                          {booking.payment_status && (
                                            <div className="small text-muted mt-1">
                                              Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-1">
                                        <div className="booking-actions">
                                          <div className="dropdown">
                                            <button 
                                              className="btn btn-link p-0" 
                                              data-bs-toggle="dropdown"
                                            >
                                              <i className="la la-ellipsis-v"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                              <li>
                                                <a className="dropdown-item" href={`#booking-${booking.reservation_id}`}>
                                                  <i className="la la-eye me-2"></i>View Details
                                                </a>
                                              </li>
                                              <li>
                                                <button 
                                                  className="dropdown-item" 
                                                  onClick={() => downloadBookingPDF(booking.reservation_id)}
                                                >
                                                  <i className="la la-file-pdf-o me-2 text-danger"></i>Download PDF
                                                </button>
                                              </li>
                                              {booking.status === 'confirmed' && (
                                                <>
                                                  <li>
                                                    <a className="dropdown-item" href="#">
                                                      <i className="la la-edit me-2"></i>Modify
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a className="dropdown-item text-danger" href="#">
                                                      <i className="la la-times me-2"></i>Cancel
                                                    </a>
                                                  </li>
                                                </>
                                              )}
                                              {booking.status === 'completed' && (
                                                <li>
                                                  <a className="dropdown-item" href="#">
                                                    <i className="la la-star me-2"></i>Leave Review
                                                  </a>
                                                </li>
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Additional booking details */}
                                    {booking.special_requests && (
                                      <div className="row mt-3">
                                        <div className="col-12">
                                          <div className="alert alert-info alert-sm mb-0">
                                            <strong>Special Requests:</strong> {booking.special_requests}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Show extras if any */}
                                    {booking.extras && booking.extras.length > 0 && (
                                      <div className="row mt-2">
                                        <div className="col-12">
                                          <small className="text-muted">
                                            <strong>Extras:</strong> {booking.extras.map(extra => extra.extra_name).join(', ')}
                                          </small>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                        
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
    <style jsx>{`
      .booking-card {
        border: 1px solid #eef1f5;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      }
      .booking-vehicle {
        width: 100%;
        aspect-ratio: 4 / 3; /* keeps consistent professional ratio */
        border-radius: 10px;
        overflow: hidden;
        background: #f7f8fa;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #eef1f5;
      }
      .booking-vehicle .la-car {
        opacity: 0.6;
      }
      .vehicle-image {
        width: 100%;
        height: 100%;
        object-fit: cover; /* fill nicely without distortion */
        display: block;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(16,24,40,0.08);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .vehicle-image:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 22px rgba(16,24,40,0.12);
      }
      @media (max-width: 991.98px) {
        .booking-vehicle { aspect-ratio: 16 / 10; }
      }
    `}</style>
    </CustomerDashboardLayout>
  );
}
