'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationHeader from '../../../components/NotificationHeader';
import MessageHeader from '../../../components/MessageHeader';

export default function AgencyBookings() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [statusFilter, setStatusFilter] = useState('all');
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    if (!isLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && ['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
      fetchReservations();
    }
  }, [user]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchReservations = async () => {
    try {
      setReservationsLoading(true);
      const response = await fetch('/api/agency/reservations');
      const data = await response.json();
      
      console.log('API Response:', { status: response.status, data });
      
      if (data.success) {
        setReservations(data.reservations || []);
        setError(null);
      } else {
        const errorMessage = data.details || data.error || 'Failed to load reservations';
        setError(`Failed to load reservations: ${errorMessage}`);
        console.error('API Error:', data);
      }
    } catch (err) {
      setError(`Error fetching reservations: ${err.message}`);
      console.error('Fetch Error:', err);
    } finally {
      setReservationsLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await fetch('/api/agency/reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert(`Reservation status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} successfully!${data.emailSent ? ' Customer has been notified via email.' : ''}`);
        
        // Refresh the reservations list
        await fetchReservations();
      } else {
        alert(`Failed to update status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('Error updating reservation status. Please try again.');
    }
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'completed':
        return 'badge bg-secondary';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-primary';
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const getBookingStats = () => {
    const stats = reservations.reduce(
      (acc, reservation) => {
        const status = reservation.status?.toLowerCase();
        switch (status) {
          case 'confirmed':
          case 'active':
            acc.active++;
            break;
          case 'completed':
            acc.completed++;
            break;
          case 'pending':
            acc.pending++;
            break;
          case 'cancelled':
            acc.cancelled++;
            break;
        }
        return acc;
      },
      { active: 0, completed: 0, pending: 0, cancelled: 0 }
    );
    return stats;
  };

  const bookingStats = getBookingStats();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
    return null;
  }

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <div className="section-bg">
        {/* Agency Sidebar Navigation */}
        <div className="sidebar-nav sidebar--nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team8.jpg" 
                    alt="Agency avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">{user.first_name} {user.last_name}</h4>
                  <span className="author__meta">Agency Owner</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu toggle-menu list-items">
                <li>
                  <Link href="/agency/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/agency/profile">
                    <i className="la la-user me-2 text-color"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/agency/vehicles">
                    <i className="la la-car me-2 text-color-2"></i>My Vehicles
                  </Link>
                </li>
                <li className="page-active">
                  <Link href="/agency/bookings">
                    <i className="la la-shopping-cart me-2 text-color-3"></i>Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/chat">
                    <i className="la la-comments me-2 text-color-4"></i>Chat
                  </Link>
                </li>
                <li>
                  <Link href="/agency/earnings">
                    <i className="la la-money me-2 text-color-5"></i>Earnings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/reviews">
                    <i className="la la-star me-2 text-color-5"></i>Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/agency/settings">
                    <i className="la la-cog me-2 text-color-6"></i>Settings
                  </Link>
                </li>
                <li>
                  <button 
                    className="list-group-item list-group-item-action border-0 bg-transparent"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await logout();
                      } catch (_) {}
                    }}
                  >
                    <i className="la la-power-off me-2 text-color-7"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <section className="dashboard-area">
          <div className="dashboard-nav dashboard--nav">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="menu-wrapper">
                    <div className="logo me-5">
                      <Link href="/">
                        <img 
                          src="/html-folder/images/logo.png" 
                          alt="HOLIKEY logo"
                          style={{ maxHeight: '40px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EHOLIKEY%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </Link>
                      <div className="menu-toggler">
                        <i className="la la-bars"></i>
                        <i className="la la-times"></i>
                      </div>
                      <div className="user-menu-open">
                        <i className="la la-user"></i>
                      </div>
                    </div>
                    <div className="nav-btn ms-auto">
                      <div className="notification-wrap d-flex align-items-center">
                        {/* Role-aware message and notification dropdowns */}
                        <MessageHeader basePath="agency" />
                        <NotificationHeader basePath="agency" />

                        {/* User dropdown (React controlled) */}
                        <div className="notification-item" ref={userDropdownRef}>
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle"
                              id="userDropdownMenu"
                              aria-haspopup="true"
                              aria-expanded={userDropdownOpen ? 'true' : 'false'}
                              onClick={(e) => { e.preventDefault(); setUserDropdownOpen((v) => !v); }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img 
                                    src="/html-folder/images/team8.jpg" 
                                    alt="Agency avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <span className="font-size-14 font-weight-bold">{user.first_name}</span>
                              </div>
                            </a>
                            <div className={`dropdown-menu dropdown-reveal dropdown-menu-xl dropdown-menu-right ${userDropdownOpen ? 'show' : ''}`} style={{ display: userDropdownOpen ? 'block' : 'none' }}>
                              <div className="list-group drop-reveal-list user-drop-reveal-list">
                                <Link href="/agency/profile" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-user me-2"></i>My Profile
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/agency/dashboard" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-dashboard me-2"></i>Dashboard
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <div className="section-block"></div>
                                {/* Return to Admin when impersonating */}
                                {user?.impersonated && (
                                  <button 
                                    className="list-group-item list-group-item-action border-0 bg-transparent"
                                    onClick={async () => {
                                      try {
                                        const resp = await fetch('/api/admin/impersonate/restore', { method: 'POST', credentials: 'include' });
                                        const data = await resp.json();
                                        if (resp.ok && data.success) {
                                          window.location.href = data.redirectTo || '/admin/dashboard';
                                        } else {
                                          alert(data.error || 'Failed to return to admin');
                                        }
                                      } catch (e) {
                                        console.error('Return to admin failed', e);
                                        alert('Failed to return to admin');
                                      }
                                    }}
                                  >
                                    <div className="msg-body">
                                      <div className="msg-content">
                                        <h3 className="title">
                                          <i className="la la-undo me-2"></i>Return to Admin
                                        </h3>
                                      </div>
                                    </div>
                                  </button>
                                )}
                                <button 
                                  className="list-group-item list-group-item-action border-0 bg-transparent"
                                  onClick={async () => {
                                    setUserDropdownOpen(false);
                                    try {
                                      await logout();
                                    } catch (_) {}
                                  }}
                                >
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-power-off me-2"></i>Logout
                                      </h3>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-bread dashboard--bread">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Booking Management</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <div className="btn-group">
                    <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                      {statusFilter === 'all' ? 'All Bookings' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </button>
                    <ul className="dropdown-menu show" style={{ position: 'absolute' }}>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('all')}>All Bookings</button></li>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('active')}>Active</button></li>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('completed')}>Completed</button></li>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('cancelled')}>Cancelled</button></li>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('confirmed')}>Confirmed</button></li>
                      <li><button className="dropdown-item" onClick={() => setStatusFilter('pending')}>Pending</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Bookings</h3>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Booking ID</th>
                              <th>Customer</th>
                              <th>Vehicle</th>
                              <th>Period</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservationsLoading ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4">
                                  <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading reservations...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : error ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4 text-danger">
                                  <i className="la la-exclamation-triangle me-2"></i>
                                  {error}
                                </td>
                              </tr>
                            ) : reservations.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                  <i className="la la-inbox me-2"></i>
                                  No bookings found
                                </td>
                              </tr>
                            ) : (
                              (statusFilter === 'all' ? reservations : reservations.filter(r => (r.status || '').toLowerCase() === statusFilter)).map((reservation, index) => {
                                const days = calculateDays(reservation.start_date, reservation.end_date);
                                const dailyRate = reservation.total_price ? (parseFloat(reservation.total_price) / days).toFixed(0) : 0;
                                return (
                                  <tr key={reservation.reservation_id || index}>
                                    <td><strong>#{reservation.reservation_id || 'N/A'}</strong></td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="customer-avatar me-2">
                                          <img 
                                            src="/html-folder/images/team1.jpg" 
                                            alt="Customer"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E👤%3C/text%3E%3C/svg%3E";
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <h6 className="mb-0">{reservation.customer_name || `${reservation.first_name || ''} ${reservation.last_name || ''}`.trim() || 'N/A'}</h6>
                                          <small className="text-muted">{reservation.email || 'No email'}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <h6 className="mb-0">{reservation.vehicle_name || `${reservation.make || ''} ${reservation.model || ''}`.trim() || 'Unknown Vehicle'}</h6>
                                        <small className="text-muted">{reservation.category_name || 'Vehicle'} • {reservation.year || 'N/A'}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <div>{reservation.start_date_formatted || new Date(reservation.start_date).toLocaleDateString()} - {reservation.end_date_formatted || new Date(reservation.end_date).toLocaleDateString()}</div>
                                        <small className="text-muted">{days} day{days !== 1 ? 's' : ''}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <strong>${parseFloat(reservation.total_price || 0).toFixed(2)}</strong>
                                      <br />
                                      <small className="text-muted">${dailyRate}/day</small>
                                    </td>
                                    <td>
                                      <span className={getStatusBadgeClass(reservation.status)}>
                                        {(reservation.status || 'pending').charAt(0).toUpperCase() + (reservation.status || 'pending').slice(1)}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex gap-1">
                                        {/* Status Update Dropdown - Only show for non-final statuses */}
                                        {!['completed', 'cancelled'].includes(reservation.status?.toLowerCase()) ? (
                                          <div className="dropdown" style={{ position: 'relative' }}>
                                            <button 
                                              className="btn btn-sm btn-outline-primary dropdown-toggle" 
                                              type="button" 
                                              aria-expanded={openActionMenuId === reservation.reservation_id ? 'true' : 'false'}
                                              onClick={() => setOpenActionMenuId(openActionMenuId === reservation.reservation_id ? null : reservation.reservation_id)}
                                              title="Update Status"
                                            >
                                              <i className="la la-refresh"></i>
                                            </button>
                                            <ul className={`dropdown-menu ${openActionMenuId === reservation.reservation_id ? 'show' : ''}`} style={{ display: openActionMenuId === reservation.reservation_id ? 'block' : 'none' }}>
                                              {reservation.status !== 'pending' && (
                                                <li>
                                                  <button 
                                                    className="dropdown-item"
                                                    onClick={() => updateReservationStatus(reservation.reservation_id, 'pending')}
                                                  >
                                                    <i className="la la-clock text-warning me-2"></i>
                                                    Mark as Pending
                                                  </button>
                                                </li>
                                              )}
                                              {reservation.status !== 'confirmed' && (
                                                <li>
                                                  <button 
                                                    className="dropdown-item"
                                                    onClick={() => updateReservationStatus(reservation.reservation_id, 'confirmed')}
                                                  >
                                                    <i className="la la-check text-success me-2"></i>
                                                    Confirm Booking
                                                  </button>
                                                </li>
                                              )}
                                              {reservation.status !== 'active' && reservation.status === 'confirmed' && (
                                                <li>
                                                  <button 
                                                    className="dropdown-item"
                                                    onClick={() => updateReservationStatus(reservation.reservation_id, 'active')}
                                                  >
                                                    <i className="la la-play text-info me-2"></i>
                                                    Start Rental
                                                  </button>
                                                </li>
                                              )}
                                              {(reservation.status === 'active' || reservation.status === 'confirmed') && (
                                                <li>
                                                  <button 
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                      if (confirm('Are you sure you want to mark this booking as completed? This action cannot be undone.')) {
                                                        updateReservationStatus(reservation.reservation_id, 'completed');
                                                      }
                                                    }}
                                                  >
                                                    <i className="la la-check-circle text-secondary me-2"></i>
                                                    Mark Complete
                                                  </button>
                                                </li>
                                              )}
                                              <li>
                                                <hr className="dropdown-divider" />
                                              </li>
                                              <li>
                                                <button 
                                                  className="dropdown-item text-danger"
                                                  onClick={() => {
                                                    if (confirm('Are you sure you want to cancel this booking? The customer will be notified via email.')) {
                                                      updateReservationStatus(reservation.reservation_id, 'cancelled');
                                                    }
                                                  }}
                                                >
                                                  <i className="la la-times text-danger me-2"></i>
                                                  Cancel Booking
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        ) : (
                                          <div className="text-muted small" style={{padding: '0.25rem 0.5rem'}}>
                                            <i className="la la-lock me-1"></i>
                                            {reservation.status === 'completed' ? 'Booking Completed' : 'Booking Cancelled'}
                                          </div>
                                        )}
                                        
                                        {/* Other Actions */}
                                        <Link 
                                          href={`/agency/bookings/${reservation.reservation_id}`}
                                          className="btn btn-sm btn-outline-success" 
                                          title="View Details"
                                        >
                                          <i className="la la-eye"></i>
                                        </Link>
                                        <button 
                                          className="btn btn-sm btn-outline-info" 
                                          title="Contact Customer"
                                          onClick={() => window.open(`mailto:${reservation.email}`, '_blank')}
                                        >
                                          <i className="la la-envelope"></i>
                                        </button>
                                        <button 
                                          className="btn btn-sm btn-outline-danger" 
                                          title="Download PDF"
                                          onClick={() => downloadBookingPDF(reservation.reservation_id)}
                                        >
                                          <i className="la la-file-pdf-o"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Statistics */}
              <div className="row mt-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-success mb-3">
                        <i className="la la-calendar-check-o display-4"></i>
                      </div>
                      <h4 className="stats-number">{reservationsLoading ? '...' : bookingStats.active}</h4>
                      <p className="stats-label">Active Bookings</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-secondary mb-3">
                        <i className="la la-check-circle display-4"></i>
                      </div>
                      <h4 className="stats-number">{reservationsLoading ? '...' : bookingStats.completed}</h4>
                      <p className="stats-label">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-warning mb-3">
                        <i className="la la-clock display-4"></i>
                      </div>
                      <h4 className="stats-number">{reservationsLoading ? '...' : bookingStats.pending}</h4>
                      <p className="stats-label">Pending</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-danger mb-3">
                        <i className="la la-times-circle display-4"></i>
                      </div>
                      <h4 className="stats-number">{reservationsLoading ? '...' : bookingStats.cancelled}</h4>
                      <p className="stats-label">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .dashboard-area {
          margin-left: 280px;
          background-color: #f8f9fa;
        }
        
        .customer-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .stats-card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }
        
        .stats-number {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }
        
        .stats-label {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .btn-group .btn {
          margin-right: 0.25rem;
        }
        
        .table th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
        }
        
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </>
  );
}

