'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AgencyLayout from '../../../components/AgencyLayout';

export default function AgencyDashboard() {
  const { user, loading, isCustomer, isAgency } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure no lingering overlays/backdrops blur or dim the screen on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      });
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.style.display = 'none';
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAgency())) {
      router.push('/');
    }
  }, [user, loading, isAgency, router]);

  useEffect(() => {
    if (user && isAgency()) {
      fetchDashboardData();
    }
  }, [user, isAgency]);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const response = await fetch('/api/agency/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
        setError(null);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error fetching dashboard data');
    } finally {
      setDashboardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAgency()) {
    return null;
  }

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <AgencyLayout
        pageTitle="Agency Dashboard"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Agency Dashboard' }]}
      >
        <div className="form-box dashboard-card">
          <div className="form-title-wrap">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="title">Welcome, {user.first_name}!</h3>
              <Link href="/agency/vehicles/add" className="theme-btn theme-btn-small">
                <i className="la la-plus me-1"></i>Add Vehicle
              </Link>
            </div>
          </div>
          <div className="form-content">
            {/* Stats Cards */}
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="card dashboard-stat-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="stat-icon">
                        <i className="la la-car text-primary"></i>
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">
                          {dashboardLoading ? '...' : (dashboardData?.statistics?.total_vehicles || '0')}
                        </h4>
                        <p className="stat-label">Total Vehicles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card dashboard-stat-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="stat-icon">
                        <i className="la la-calendar-check-o text-success"></i>
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">
                          {dashboardLoading ? '...' : (dashboardData?.statistics?.confirmed_bookings || '0')}
                        </h4>
                        <p className="stat-label">Active Bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card dashboard-stat-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="stat-icon">
                        <i className="la la-money text-warning"></i>
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">
                          {dashboardLoading ? '...' : (dashboardData?.statistics?.total_revenue || '$0.00')}
                        </h4>
                        <p className="stat-label">Total Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card dashboard-stat-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="stat-icon">
                        <i className="la la-chart-bar text-info"></i>
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">
                          {dashboardLoading ? '...' : (dashboardData?.statistics?.total_bookings || '0')}
                        </h4>
                        <p className="stat-label">Total Bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-lg-12">
                <h4 className="mb-3">Quick Actions</h4>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link href="/agency/vehicles" className="dashboard-quick-action">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="la la-car display-4 text-primary"></i>
                      <h5 className="card-title mt-3">Manage Vehicles</h5>
                      <p className="card-text">View and edit your vehicle inventory</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link href="/agency/bookings" className="dashboard-quick-action">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="la la-calendar display-4 text-success"></i>
                      <h5 className="card-title mt-3">Bookings</h5>
                      <p className="card-text">Manage customer bookings</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link href="/agency/earnings" className="dashboard-quick-action">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="la la-money display-4 text-warning"></i>
                      <h5 className="card-title mt-3">Revenue</h5>
                      <p className="card-text">Track your earnings</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6">
                <Link href="/agency/reviews" className="dashboard-quick-action">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="la la-star display-4 text-info"></i>
                      <h5 className="card-title mt-3">Reviews</h5>
                      <p className="card-text">Customer feedback</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row mt-4">
              <div className="col-lg-12">
                <h4 className="mb-3">Recent Bookings</h4>
                <div className="card">
                  <div className="card-body">
                    {dashboardLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading recent bookings...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-4 text-danger">
                        <i className="la la-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    ) : !dashboardData?.recent_bookings || dashboardData.recent_bookings.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="la la-inbox me-2"></i>
                        No recent bookings found
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {dashboardData.recent_bookings.slice(0, 5).map((booking, index) => (
                          <div key={booking.reservation_id || index} className="list-group-item border-0 px-0">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <i className="la la-calendar-check-o text-success me-3"></i>
                                <div>
                                  <h6 className="mb-0">
                                    New booking for {booking.vehicle_display_name || 'Unknown Vehicle'}
                                  </h6>
                                  <small className="text-muted">
                                    Customer: {booking.customer_name || 'Unknown'} • {booking.total_price_formatted || '$0.00'}
                                  </small>
                                </div>
                              </div>
                              <div className="text-end">
                                <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 
                                                        booking.status === 'pending' ? 'bg-warning' : 
                                                        booking.status === 'completed' ? 'bg-secondary' : 'bg-primary'}`}>
                                  {booking.status_display || booking.status}
                                </span>
                                <br />
                                <small className="text-muted">
                                  {booking.start_date_formatted || new Date(booking.start_date).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                        {dashboardData.recent_bookings.length > 5 && (
                          <div className="list-group-item border-0 px-0 text-center">
                            <Link href="/agency/bookings" className="btn btn-outline-primary btn-sm">
                              View All Bookings
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .dashboard-card {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .dashboard-stat-card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1.5rem;
          }
          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
          }
          .stat-icon i { font-size: 1.5rem; }
          .stat-number { font-size: 2rem; font-weight: bold; margin: 0; }
          .stat-label { margin: 0; color: #6c757d; font-size: 0.9rem; }
          .dashboard-quick-action { text-decoration: none; color: inherit; transition: transform 0.2s; }
          .dashboard-quick-action:hover { transform: translateY(-5px); text-decoration: none; color: inherit; }
          .dashboard-quick-action .card { border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: box-shadow 0.2s; }
          .dashboard-quick-action:hover .card { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        `}</style>
      </AgencyLayout>
    </>
  );
}

