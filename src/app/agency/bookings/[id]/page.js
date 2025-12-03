'use client';

import { useAuth } from '../../../../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import NotificationHeader from '../../../../components/NotificationHeader';
import MessageHeader from '../../../../components/MessageHeader';

export default function AgencyBookingDetail() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && params.id && ['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
      fetchBookingDetails();
    }
  }, [user, params.id]);

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

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agency/reservations/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setBooking(data.booking);
        setError(null);
      } else {
        setError(data.message || 'Failed to load booking details');
      }
    } catch (err) {
      setError(`Error fetching booking details: ${err.message}`);
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (newStatus) => {
    try {
      const response = await fetch('/api/agency/reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation_id: params.id,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Reservation status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} successfully!${data.emailSent ? ' Customer has been notified via email.' : ''}`);
        fetchBookingDetails(); // Refresh data
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
                  <Link href="/">
                    <i className="la la-power-off me-2 text-color-7"></i>Logout
                  </Link>
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
                                <Link href="/" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-power-off me-2"></i>Logout
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
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
                      <h2 className="sec__title font-size-30 text-white">Booking Details</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <Link href="/agency/bookings" className="btn btn-light">
                    <i className="la la-arrow-left me-2"></i>Back to Bookings
                  </Link>
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
                      <h3 className="title">Booking #{params.id}</h3>
                    </div>
                    <div className="form-content">
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading booking details...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-center py-5">
                          <i className="la la-exclamation-triangle display-1 text-warning"></i>
                          <h4 className="mt-3">Error Loading Booking</h4>
                          <p className="text-muted">{error}</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => fetchBookingDetails()}
                          >
                            <i className="la la-refresh me-2"></i>Try Again
                          </button>
                        </div>
                      ) : booking ? (
                        <>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="card mb-4">
                                <div className="card-header">
                                  <h5><i className="la la-user me-2"></i>Customer Information</h5>
                                </div>
                                <div className="card-body">
                                  <p><strong>Name:</strong> {booking.customer_name || 'N/A'}</p>
                                  <p><strong>Email:</strong> {booking.email || 'N/A'}</p>
                                  <p><strong>Phone:</strong> {booking.customer_phone || 'N/A'}</p>
                                  <p><strong>Status:</strong> <span className={getStatusBadgeClass(booking.status)}>{booking.status}</span></p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card mb-4">
                                <div className="card-header">
                                  <h5><i className="la la-car me-2"></i>Vehicle Information</h5>
                                </div>
                                <div className="card-body">
                                  <p><strong>Vehicle:</strong> {booking.vehicle_name || `${booking.make || ''} ${booking.model || ''}`.trim() || 'Unknown'}</p>
                                  <p><strong>Category:</strong> {booking.category_name || 'N/A'}</p>
                                  <p><strong>Year:</strong> {booking.year || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="card mb-4">
                                <div className="card-header">
                                  <h5><i className="la la-calendar me-2"></i>Booking Details</h5>
                                </div>
                                <div className="card-body">
                                  <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
                                  <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
                                  <p><strong>Duration:</strong> {Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24))} days</p>
                                  <p><strong>Total Amount:</strong> ${parseFloat(booking.total_price || 0).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card mb-4">
                                <div className="card-header">
                                  <h5><i className="la la-cog me-2"></i>Actions</h5>
                                </div>
                                <div className="card-body">
                                  <div className="d-flex gap-2 flex-wrap">
                                    <button 
                                      onClick={() => downloadBookingPDF(params.id)}
                                      className="btn btn-outline-danger btn-sm"
                                    >
                                      <i className="la la-file-pdf-o me-1"></i>Download PDF
                                    </button>
                                    <button 
                                      onClick={() => window.open(`mailto:${booking.email}`, '_blank')}
                                      className="btn btn-outline-info btn-sm"
                                    >
                                      <i className="la la-envelope me-1"></i>Contact Customer
                                    </button>
                                    {!['completed', 'cancelled'].includes(booking.status?.toLowerCase()) && (
                                      <div className="dropdown" style={{ position: 'relative' }}>
                                        <button 
                                          className="btn btn-outline-primary btn-sm dropdown-toggle" 
                                          type="button" 
                                          aria-expanded={actionsMenuOpen ? 'true' : 'false'}
                                          onClick={() => setActionsMenuOpen((v) => !v)}
                                        >
                                          <i className="la la-refresh me-1"></i>Update Status
                                        </button>
                                        <ul className={`dropdown-menu ${actionsMenuOpen ? 'show' : ''}`} style={{ display: actionsMenuOpen ? 'block' : 'none' }}>
                                          {booking.status !== 'pending' && (
                                            <li>
                                              <button 
                                                className="dropdown-item"
                                                onClick={() => updateReservationStatus('pending')}
                                              >
                                                <i className="la la-clock text-warning me-2"></i>Mark as Pending
                                              </button>
                                            </li>
                                          )}
                                          {booking.status !== 'confirmed' && (
                                            <li>
                                              <button 
                                                className="dropdown-item"
                                                onClick={() => updateReservationStatus('confirmed')}
                                              >
                                                <i className="la la-check text-success me-2"></i>Confirm Booking
                                              </button>
                                            </li>
                                          )}
                                          {booking.status !== 'active' && booking.status === 'confirmed' && (
                                            <li>
                                              <button 
                                                className="dropdown-item"
                                                onClick={() => updateReservationStatus('active')}
                                              >
                                                <i className="la la-play text-info me-2"></i>Start Rental
                                              </button>
                                            </li>
                                          )}
                                          {(booking.status === 'active' || booking.status === 'confirmed') && (
                                            <li>
                                              <button 
                                                className="dropdown-item"
                                                onClick={() => {
                                                  if (confirm('Are you sure you want to mark this booking as completed?')) {
                                                    updateReservationStatus('completed');
                                                  }
                                                }}
                                              >
                                                <i className="la la-check-circle text-secondary me-2"></i>Mark Complete
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
                                                if (confirm('Are you sure you want to cancel this booking?')) {
                                                  updateReservationStatus('cancelled');
                                                }
                                              }}
                                            >
                                              <i className="la la-times text-danger me-2"></i>Cancel Booking
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <i className="la la-search display-1 text-muted"></i>
                          <h4 className="mt-3">Booking Not Found</h4>
                          <p className="text-muted">The requested booking could not be found.</p>
                        </div>
                      )}
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
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </>
  );
}
