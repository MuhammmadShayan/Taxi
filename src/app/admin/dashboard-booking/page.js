'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminBookingDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch(`/api/bookings?status=${statusFilter}&limit=50`)
        ]);
        
        if (!statsResponse.ok || !bookingsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const statsData = await statsResponse.json();
        const bookingsData = await bookingsResponse.json();
        
        setStats(statsData);
        setBookings(bookingsData.bookings || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load bookings data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [statusFilter]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await fetch(`/api/bookings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, updates: { booking_status: action } })
      });
      
      if (response.ok) {
        // Refresh bookings data
        const bookingsResponse = await fetch(`/api/bookings?status=${statusFilter}&limit=50`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        }
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const statsCards = stats ? [
    {
      title: 'Total Bookings',
      value: stats.totalBookings || '0',
      icon: 'la la-calendar',
      bgClass: 'bg-1',
      link: '/admin/bookings'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings || '0',
      icon: 'la la-clock-o',
      bgClass: 'bg-2'
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings || '0',
      icon: 'la la-check-circle',
      bgClass: 'bg-3'
    },
    {
      title: 'Cancelled',
      value: stats.cancelledBookings || '0',
      icon: 'la la-times-circle',
      bgClass: 'bg-4'
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayout 
        pageTitle="Booking Management"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Bookings' }]}
        showStats={false}
      >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading bookings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout 
        pageTitle="Booking Management"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Bookings' }]}
        showStats={false}
      >
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      pageTitle="Booking Management"
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Bookings' }]}
      showStats={true}
      statsCards={statsCards}
    >
      {/* Main booking content */}
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">All Bookings</h3>
                <div className="select-contain">
                  <select 
                    className="select-contain-select"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-content">
              <div className="table-form table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Booking ID</th>
                      <th scope="col">Service</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => {
                        const getStatusBadge = (status) => {
                          const statusClasses = {
                            pending: 'bg-warning',
                            confirmed: 'bg-success',
                            completed: 'bg-info',
                            cancelled: 'bg-danger'
                          };
                          return statusClasses[status] || 'bg-secondary';
                        };
                        
                        return (
                          <tr key={booking.id || index}>
                            <th scope="row">#{booking.id || `BK${String(index + 1).padStart(3, '0')}`}</th>
                            <td>{booking.serviceType || booking.booking_type || 'Car Rental'}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img src={booking.customer_image || "/html-folder/images/team8.jpg"} alt="avatar" />
                                </div>
                                <span className="font-weight-bold">{booking.customer_first_name && booking.customer_last_name ? 
                                  `${booking.customer_first_name} ${booking.customer_last_name}` : 
                                  booking.customer_name || 'Customer'
                                }</span>
                              </div>
                            </td>
                            <td>{new Date(booking.bookingDate || booking.pickup_date || booking.created_at).toLocaleDateString()}</td>
                            <td>${(booking.amount || booking.total_amount || 0).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${getStatusBadge(booking.status || booking.booking_status)} text-white`}>
                                {(booking.status || booking.booking_status || 'pending').charAt(0).toUpperCase() + 
                                 (booking.status || booking.booking_status || 'pending').slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="table-content">
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="theme-btn theme-btn-small theme-btn-transparent"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href={`/admin/dashboard-orders-details?id=${booking.id}`} className="dropdown-item">
                                      <i className="la la-eye me-2"></i>View Details
                                    </a>
                                    {booking.booking_status === 'pending' && (
                                      <a href="#" className="dropdown-item" onClick={() => handleBookingAction(booking.id, 'confirmed')}>
                                        <i className="la la-check me-2"></i>Confirm
                                      </a>
                                    )}
                                    {booking.booking_status !== 'cancelled' && (
                                      <a href="#" className="dropdown-item text-danger" onClick={() => handleBookingAction(booking.id, 'cancelled')}>
                                        <i className="la la-times me-2"></i>Cancel
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <i className="la la-calendar" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-2">No bookings found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

