'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CustomerDashboardSidebar from '@/components/CustomerDashboardSidebar';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Sample data for demonstration
  const sampleBookings = [
    {
      id: 1,
      booking_reference: 'BK' + Date.now(),
      make: 'Toyota',
      model: 'Camry',
      category: 'Economy',
      pickup_date: '2024-01-25',
      pickup_time: '09:00',
      dropoff_date: '2024-01-28',
      dropoff_time: '09:00',
      pickup_location: 'Airport Terminal 1',
      rental_days: 3,
      total_amount: 180,
      booking_status: 'confirmed',
      payment_status: 'completed',
      driver_assigned: true,
      driver_name: 'John Smith',
      driver_phone: '+1-555-0101',
      created_at: new Date().toISOString(),
      images: JSON.stringify(['/html-folder/images/car-img.png'])
    },
    {
      id: 2,
      booking_reference: 'BK' + (Date.now() + 1),
      make: 'BMW',
      model: 'X5',
      category: 'SUV',
      pickup_date: '2024-01-30',
      pickup_time: '14:30',
      dropoff_date: '2024-02-02',
      dropoff_time: '14:30',
      pickup_location: 'Downtown Office',
      rental_days: 3,
      total_amount: 350,
      booking_status: 'pending',
      payment_status: 'pending',
      driver_assigned: false,
      created_at: new Date().toISOString(),
      images: JSON.stringify(['/html-folder/images/car-img.png'])
    }
  ];

  useEffect(() => {
    fetchUserBookings();
  }, [currentPage, statusFilter]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      
      // Here you would normally get the user email from authentication context
      const userEmail = 'user@example.com'; // This should come from your auth system
      
      let url = `/api/bookings?customer_email=${encodeURIComponent(userEmail)}&page=${currentPage}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        setPagination(data.pagination);
      } else {
        // Fallback to sample data
        console.log('Using sample booking data');
        setBookings(sampleBookings);
        setPagination({ page: 1, pages: 1, total: sampleBookings.length });
      }
    } catch (error) {
      console.error('Error fetching bookings, using sample data:', error);
      setBookings(sampleBookings);
      setPagination({ page: 1, pages: 1, total: sampleBookings.length });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings?booking_id=${bookingId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchUserBookings();
        setShowCancelModal(false);
        setSelectedBooking(null);
        alert('Booking cancelled successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel booking: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'confirmed': return 'badge bg-info';
      case 'assigned': return 'badge bg-primary';
      case 'in_progress': return 'badge bg-success';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const canCancelBooking = (booking) => {
    const pickupDate = new Date(booking.pickup_date);
    const today = new Date();
    const daysDifference = Math.ceil((pickupDate - today) / (1000 * 60 * 60 * 24));
    
    return ['pending', 'confirmed'].includes(booking.booking_status) && daysDifference >= 1;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />
      
      <section className="dashboard-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <CustomerDashboardSidebar />
            </div>
            
            <div className="col-lg-9">
              <div className="dashboard-content">
                <div className="dashboard-tlbar d-flex align-items-center justify-content-between">
                  <div className="dashboard-tlbar-left">
                    <h3 className="dashboard-heading">My Bookings</h3>
                    <p className="dashboard-text">View and manage your car rental bookings</p>
                  </div>
                  <div className="dashboard-tlbar-right">
                    <Link href="/cars" className="theme-btn">
                      <i className="la la-plus me-2"></i>New Booking
                    </Link>
                  </div>
                </div>

                {/* Filter */}
                <div className="dashboard-cards">
                  <div className="card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="form-group">
                            <select 
                              className="form-control"
                              value={statusFilter}
                              onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                              }}
                            >
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 text-end">
                          <span className="text-muted">
                            {pagination.total || 0} total bookings
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookings List */}
                <div className="dashboard-cards">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="empty-state">
                        <i className="la la-car display-1 text-muted"></i>
                        <h4 className="mt-3">No Bookings Found</h4>
                        <p className="text-muted">You haven't made any car rental bookings yet.</p>
                        <Link href="/cars" className="theme-btn mt-3">
                          Browse Cars
                        </Link>
                      </div>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <div key={booking.id} className="card booking-card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-lg-3">
                              <div className="car-image">
                                <img 
                                  src={booking.images ? JSON.parse(booking.images)[0] : '/html-folder/images/car-img.png'} 
                                  alt={`${booking.make} ${booking.model}`}
                                  className="img-fluid rounded"
                                  style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                />
                              </div>
                            </div>
                            
                            <div className="col-lg-6">
                              <div className="booking-details">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h5 className="car-title mb-1">{booking.make} {booking.model}</h5>
                                    <p className="text-muted mb-1">{booking.category}</p>
                                  </div>
                                  <div className="text-end">
                                    <span className={getStatusBadgeClass(booking.booking_status)}>
                                      {booking.booking_status.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="booking-info">
                                  <div className="row">
                                    <div className="col-sm-6">
                                      <p className="mb-1">
                                        <i className="la la-calendar me-1"></i>
                                        <strong>Pick-up:</strong> {formatDate(booking.pickup_date)}
                                      </p>
                                      <p className="mb-1">
                                        <i className="la la-clock-o me-1"></i>
                                        <strong>Time:</strong> {booking.pickup_time}
                                      </p>
                                    </div>
                                    <div className="col-sm-6">
                                      <p className="mb-1">
                                        <i className="la la-calendar me-1"></i>
                                        <strong>Drop-off:</strong> {formatDate(booking.dropoff_date)}
                                      </p>
                                      <p className="mb-1">
                                        <i className="la la-map-marker me-1"></i>
                                        <strong>Location:</strong> {booking.pickup_location}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="booking-meta mt-2">
                                    <span className="badge bg-light text-dark me-2">
                                      Ref: {booking.booking_reference}
                                    </span>
                                    <span className="badge bg-light text-dark me-2">
                                      {booking.rental_days} days
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      ${booking.total_amount}
                                    </span>
                                  </div>

                                  {booking.driver_assigned && (
                                    <div className="driver-info mt-2 p-2 bg-light rounded">
                                      <small>
                                        <strong>Driver:</strong> {booking.driver_name} 
                                        <span className="ms-2">
                                          <i className="la la-phone"></i> {booking.driver_phone}
                                        </span>
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-lg-3">
                              <div className="booking-actions text-end">
                                <Link 
                                  href={`/booking-confirmation/${booking.id}`}
                                  className="btn btn-outline-primary btn-sm mb-2 w-100"
                                >
                                  <i className="la la-eye me-1"></i>View Details
                                </Link>
                                
                                {booking.booking_status === 'completed' && (
                                  <Link 
                                    href={`/cars/${booking.car_id}?review=true`}
                                    className="btn btn-outline-success btn-sm mb-2 w-100"
                                  >
                                    <i className="la la-star me-1"></i>Write Review
                                  </Link>
                                )}
                                
                                {canCancelBooking(booking) && (
                                  <button 
                                    className="btn btn-outline-danger btn-sm w-100"
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setShowCancelModal(true);
                                    }}
                                  >
                                    <i className="la la-times me-1"></i>Cancel
                                  </button>
                                )}

                                {booking.driver_assigned && ['assigned', 'in_progress'].includes(booking.booking_status) && (
                                  <a 
                                    href={`tel:${booking.driver_phone}`}
                                    className="btn btn-success btn-sm w-100 mt-2"
                                  >
                                    <i className="la la-phone me-1"></i>Call Driver
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <nav aria-label="Bookings pagination">
                    <ul className="pagination justify-content-center mt-4">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(pagination.pages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === pagination.pages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                          disabled={currentPage === pagination.pages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Booking</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this booking?</p>
                <div className="booking-summary p-3 bg-light rounded">
                  <strong>Booking Reference:</strong> {selectedBooking.booking_reference}<br />
                  <strong>Car:</strong> {selectedBooking.make} {selectedBooking.model}<br />
                  <strong>Pick-up Date:</strong> {formatDate(selectedBooking.pickup_date)}<br />
                  <strong>Total Amount:</strong> ${selectedBooking.total_amount}
                </div>
                <div className="alert alert-warning mt-3">
                  <i className="la la-exclamation-triangle me-2"></i>
                  <strong>Note:</strong> Cancellation fees may apply depending on your booking terms.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  Keep Booking
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
