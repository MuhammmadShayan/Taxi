'use client';
import { useEffect, useState } from 'react';

export default function DriverDashboard() {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, notificationsResponse, tripsResponse] = await Promise.all([
          fetch('/api/driver/stats'),
          fetch('/api/notifications?limit=5'),
          fetch('/api/trips?limit=5&status=recent')
        ]);
        
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        if (!notificationsResponse.ok) throw new Error('Failed to fetch notifications');
        if (!tripsResponse.ok) throw new Error('Failed to fetch trips');
        
        const statsData = await statsResponse.json();
        const notificationsData = await notificationsResponse.json();
        const tripsData = await tripsResponse.json();
        
        setStats(statsData);
        setNotifications(notificationsData.notifications || []);
        setRecentTrips(tripsData.trips || []);
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
      title: 'Active Trips',
      value: stats.activeTrips || '0',
      icon: 'la la-road',
      bgClass: 'bg-4'
    },
    {
      title: 'Total Earnings',
      value: `$${(stats.totalEarnings || 0).toLocaleString()}`,
      icon: 'la la-dollar',
      bgClass: 'bg-3'
    },
    {
      title: 'Completed Trips',
      value: stats.completedTrips || '0',
      icon: 'la la-check-circle',
      bgClass: 'bg-2'
    },
    {
      title: 'Rating',
      value: stats.rating || '0.0',
      icon: 'la la-star',
      bgClass: 'bg-1'
    }
  ] : [];
  
  if (loading) {
    return (
      <>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </>
    );
  }
  
  return (
    <>
      {/* Main Dashboard Content */}
      <div className="row">
        <div className="col-lg-6 responsive-column--m">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Earnings Overview</h3>
            </div>
            <div className="form-content">
              <canvas id="earnings-chart"></canvas>
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
      
      {/* Recent Trips Section */}
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Recent Trips</h3>
            </div>
            <div className="form-content">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Customer</th>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Earnings</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrips.length > 0 ? (
                      recentTrips.map((trip, index) => (
                        <tr key={trip.id || index}>
                          <td>#{trip.id || `TR${String(index + 1).padStart(3, '0')}`}</td>
                          <td>{trip.customerName || trip.passenger_name || 'N/A'}</td>
                          <td>{trip.route || `${trip.pickup_location || ''} to ${trip.dropoff_location || ''}`}</td>
                          <td>{trip.date ? new Date(trip.date).toLocaleDateString() : new Date(trip.pickup_date || trip.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${trip.status === 'completed' ? 'bg-success' : trip.status === 'in_progress' ? 'bg-warning' : trip.status === 'pending' ? 'bg-info' : 'bg-secondary'}`}>
                              {trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1).replace('_', ' ') : 'N/A'}
                            </span>
                          </td>
                          <td>${(trip.earnings || trip.total_amount || 0).toFixed(2)}</td>
                          <td><a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="btn btn-sm btn-outline-primary">View</a></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <i className="la la-road" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-2">No recent trips</p>
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
    </>
  );
}


