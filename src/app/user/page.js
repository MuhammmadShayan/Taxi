'use client';
import { useEffect, useState } from 'react';
import CustomerLayout from '../../components/CustomerLayout';

export default function CustomerDashboard() {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, notificationsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/customer/stats'),
          fetch('/api/notifications?limit=5'),
          fetch('/api/customer/bookings?limit=5')
        ]);
        
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        if (!notificationsResponse.ok) throw new Error('Failed to fetch notifications');
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        
        const statsData = await statsResponse.json();
        const notificationsData = await notificationsResponse.json();
        const bookingsData = await bookingsResponse.json();
        
        setStats(statsData);
        setNotifications(notificationsData.notifications || []);
        setRecentBookings(bookingsData.bookings || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleMarkAsRead = async (notificationId = null) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_read',
          notification_id: notificationId
        })
      });
      
      if (response.ok) {
        // Refresh notifications
        const notificationsResponse = await fetch('/api/notifications?limit=5');
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications || []);
        }
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const statsCards = stats ? [
    {
      title: 'Total Booking',
      value: stats.totalBookings || '0',
      icon: 'la la-shopping-cart',
      bgClass: ''
    },
    {
      title: 'Wishlist',
      value: stats.wishlistItems || '0',
      icon: 'la la-bookmark',
      bgClass: 'bg-2'
    },
    {
      title: 'Total Travel',
      value: stats.completedTrips || '0',
      icon: 'la la-plane',
      bgClass: 'bg-3'
    },
    {
      title: 'Reviews',
      value: stats.totalReviews || '0',
      icon: 'la la-star',
      bgClass: 'bg-4'
    }
  ] : [];
  
  if (loading) {
    return (
      <CustomerLayout 
        pageTitle="Hi, Welcome Back!"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Pages' }, { label: 'Customer Dashboard' }]}
        showStats={false}
      >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </CustomerLayout>
    );
  }
  
  if (error) {
    return (
      <CustomerLayout 
        pageTitle="Hi, Welcome Back!"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Pages' }, { label: 'Customer Dashboard' }]}
        showStats={false}
      >
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </CustomerLayout>
    );
  }
  
  return (
    <CustomerLayout 
      pageTitle="Hi, Welcome Back!"
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Pages' }, { label: 'Customer Dashboard' }]}
      showStats={true}
      statsCards={statsCards}
    >
      {/* Main Dashboard Content */}
      <div className="row">
        <div className="col-lg-6 responsive-column--m">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Statics Results</h3>
            </div>
            <div className="form-content">
              <canvas id="bar-chart"></canvas>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 responsive-column--m">
          <div className="form-box dashboard-card">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">Notifications</h3>
                <button
                  type="button"
                  className="icon-element mark-as-read-btn ms-auto me-0"
                  data-bs-toggle="tooltip"
                  data-placement="left"
                  title="Mark all as read"
                  onClick={() => handleMarkAsRead()}
                >
                  <i className="la la-check-square"></i>
                </button>
              </div>
            </div>
            <div className="form-content p-0">
              <div className="list-group drop-reveal-list">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <a href="#" key={notification.id} className={`list-group-item list-group-item-action ${index === 0 ? 'border-top-0' : ''}`}>
                      <div className="msg-body d-flex align-items-center">
                        <div className={`icon-element ${notification.bgClass || ''} flex-shrink-0 me-3 ms-0`}>
                          <i className={notification.icon || 'la la-bell'}></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">{notification.title}</h3>
                          <p className="msg-text">{notification.time}</p>
                        </div>
                        <span
                          className="icon-element mark-as-read-btn flex-shrink-0 ms-auto me-0"
                          data-bs-toggle="tooltip"
                          data-placement="left"
                          title="Mark as read"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <i className="la la-check-square"></i>
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <i className="la la-bell-slash" style={{fontSize: '48px', color: '#ccc'}}></i>
                    <p className="text-muted mt-2">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings Section */}
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Recent Bookings</h3>
            </div>
            <div className="form-content">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking, index) => (
                        <tr key={booking.id || index}>
                          <td>#{booking.id || `BK${String(index + 1).padStart(3, '0')}`}</td>
                          <td>{booking.serviceType || booking.booking_type || 'Car Rental'}</td>
                          <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : new Date(booking.pickup_date || booking.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${booking.status === 'confirmed' || booking.booking_status === 'confirmed' ? 'bg-success' : booking.status === 'pending' || booking.booking_status === 'pending' ? 'bg-warning' : booking.status === 'completed' || booking.booking_status === 'completed' ? 'bg-info' : 'bg-secondary'}`}>
                              {booking.status || booking.booking_status ? (booking.status || booking.booking_status).charAt(0).toUpperCase() + (booking.status || booking.booking_status).slice(1) : 'N/A'}
                            </span>
                          </td>
                          <td>${(booking.amount || booking.total_amount || 0).toFixed(2)}</td>
                          <td><a href={`/customer/dashboard-booking-detail?id=${booking.id}`} className="btn btn-sm btn-outline-primary">View</a></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <i className="la la-shopping-cart" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-2">No recent bookings</p>
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
    </CustomerLayout>
  );
}


