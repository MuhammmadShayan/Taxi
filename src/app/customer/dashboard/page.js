'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '../../../components/CustomerDashboardLayout';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        customer_email: user.email
      });
      
      const response = await fetch(`/api/customer/dashboard?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.statistics);
        setRecentBookings(data.recent_bookings || []);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when user is available
  useEffect(() => {
    if (user?.email) {
      fetchDashboardStats();
    }
  }, [user?.email]);

  return (
    <CustomerDashboardLayout pageTitle="Dashboard">
      {/* Dashboard Statistics */}
      <div className="row mt-4">
        <div className="col-lg-3 responsive-column-m">
          <div className="icon-box icon-layout-2 dashboard-icon-box">
            <div className="d-flex">
              <div className="info-icon icon-element flex-shrink-0">
                <i className="la la-shopping-cart"></i>
              </div>
              <div className="info-content">
                <p className="info__desc">Active Bookings</p>
                <h4 className="info__title">{loading ? '...' : (stats?.active_bookings || 0)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 responsive-column-m">
          <div className="icon-box icon-layout-2 dashboard-icon-box">
            <div className="d-flex">
              <div className="info-icon icon-element bg-2 flex-shrink-0">
                <i className="la la-bookmark"></i>
              </div>
              <div className="info-content">
                <p className="info__desc">Wishlist</p>
                <h4 className="info__title">{loading ? '...' : (stats?.wishlist_items || 0)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 responsive-column-m">
          <div className="icon-box icon-layout-2 dashboard-icon-box">
            <div className="d-flex">
              <div className="info-icon icon-element bg-3 flex-shrink-0">
                <i className="la la-check-circle"></i>
              </div>
              <div className="info-content">
                <p className="info__desc">Completed</p>
                <h4 className="info__title">{loading ? '...' : (stats?.completed_bookings || 0)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 responsive-column-m">
          <div className="icon-box icon-layout-2 dashboard-icon-box">
            <div className="d-flex">
              <div className="info-icon icon-element bg-4 flex-shrink-0">
                <i className="la la-star"></i>
              </div>
              <div className="info-content">
                <p className="info__desc">Average Rating</p>
                <h4 className="info__title">{loading ? '...' : (stats?.average_rating || '0.0')}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        {loading ? (
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-content text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading your dashboard...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-content text-center py-5">
                <i className="la la-exclamation-triangle display-1 text-warning"></i>
                <h4 className="mt-3">Error Loading Dashboard</h4>
                <p className="text-muted">{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={fetchDashboardStats}
                >
                  <i className="la la-refresh me-2"></i>Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="col-lg-6 responsive-column--m">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Quick Actions</h3>
                </div>
                <div className="form-content">
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <Link href="/customer/dashboard-booking" className="d-block text-decoration-none">
                        <div className="card h-100 text-center hover-card">
                          <div className="card-body">
                            <i className="la la-calendar-check-o display-4 text-primary mb-3"></i>
                            <h5 className="card-title">My Bookings</h5>
                            <p className="card-text">View and manage your vehicle bookings</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <Link href="/search" className="d-block text-decoration-none">
                        <div className="card h-100 text-center hover-card">
                          <div className="card-body">
                            <i className="la la-search display-4 text-success mb-3"></i>
                            <h5 className="card-title">Book Vehicle</h5>
                            <p className="card-text">Search and book new vehicles</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <Link href="/customer/dashboard-wishlist" className="d-block text-decoration-none">
                        <div className="card h-100 text-center hover-card">
                          <div className="card-body">
                            <i className="la la-heart display-4 text-danger mb-3"></i>
                            <h5 className="card-title">My Wishlist</h5>
                            <p className="card-text">Manage your favorite vehicles</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <Link href="/customer/profile" className="d-block text-decoration-none">
                        <div className="card h-100 text-center hover-card">
                          <div className="card-body">
                            <i className="la la-user display-4 text-info mb-3"></i>
                            <h5 className="card-title">My Profile</h5>
                            <p className="card-text">Update your personal information</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings or Notifications */}
            <div className="col-lg-6 responsive-column--m">
              <div className="form-box dashboard-card">
                <div className="form-title-wrap">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="title">Recent Activity</h3>
                    {recentBookings && recentBookings.length > 0 && (
                      <Link href="/customer/dashboard-booking" className="btn btn-sm btn-outline-primary">
                        View All
                      </Link>
                    )}
                  </div>
                </div>
                <div className="form-content p-0">
                  {recentBookings && recentBookings.length > 0 ? (
                    <div className="list-group">
                      {recentBookings.slice(0, 3).map((booking, index) => (
                        <div key={booking.reservation_id} className={`list-group-item list-group-item-action ${index === 0 ? 'border-top-0' : ''}`}>
                          <div className="d-flex align-items-center">
                            <div className="icon-element flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{booking.vehicle_display_name}</h6>
                              <p className="mb-1 small">
                                {booking.start_date_formatted} - {booking.end_date_formatted}
                              </p>
                              <small className="text-muted">{booking.total_price_formatted}</small>
                            </div>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'bg-success' :
                              booking.status === 'pending' ? 'bg-warning' :
                              booking.status === 'completed' ? 'bg-primary' :
                              booking.status === 'active' ? 'bg-info' :
                              'bg-secondary'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="la la-car display-4 text-muted mb-3"></i>
                      <p className="text-muted">No recent bookings</p>
                      <Link href="/search" className="btn btn-primary btn-sm">
                        <i className="la la-search me-1"></i>Book Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerDashboardLayout>
  );
}

// Custom styles for hover effects
const styles = `
  .hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
  
  .dashboard-icon-box {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  
  .dashboard-icon-box:hover {
    transform: translateY(-2px);
  }
  
  .icon-element {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 15px;
  }
  
  .icon-element.bg-2 {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
  
  .icon-element.bg-3 {
    background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  }
  
  .icon-element.bg-4 {
    background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
