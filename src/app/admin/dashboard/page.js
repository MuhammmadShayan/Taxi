'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      total_bookings: 0,
      total_vehicles: 0,
      total_agency_vehicles: 0,
      total_agencies: 0,
      total_customers: 0,
      available_vehicles: 0,
      rented_vehicles: 0,
      vehicle_utilization: 0,
      total_revenue: '$0.00',
      today_bookings: 0,
      today_confirmed: 0,
      today_pending: 0,
      today_revenue: '$0.00'
    },
    recent_bookings: []
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only redirect if auth is complete and user is definitively not admin
    if (!isLoading && user && user.user_type !== 'admin' && user.role !== 'admin') {
      router.push('/');
    }
    // If auth is complete and no user, let middleware handle the redirect
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && (user.user_type === 'admin' || user.role === 'admin')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      
      // Add timeout for better user experience
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/admin/dashboard', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
        setError(null);
      } else {
        setError(data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout - Please try again');
      } else {
        console.error('Dashboard error:', err);
        setError('Error fetching dashboard data - Please refresh');
      }
    } finally {
      setDashboardLoading(false);
    }
  };

  const breadcrumbItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Dashboard' }
  ], []);

  const statsCards = useMemo(() => [
    {
      title: 'Total Users',
      value: dashboardLoading ? '...' : (dashboardData?.statistics?.total_customers || '0'),
      icon: 'la la-users',
      bgClass: 'bg-1',
      link: '/admin/users'
    },
    {
      title: 'Total Agencies',
      value: dashboardLoading ? '...' : (dashboardData?.statistics?.total_agencies || '0'),
      icon: 'la la-building',
      bgClass: 'bg-2',
      link: '/admin/agencies'
    },
    {
      title: 'Total Agency Vehicles',
      value: dashboardLoading ? '...' : (dashboardData?.statistics?.total_agency_vehicles || '0'),
      icon: 'la la-truck',
      bgClass: 'bg-3',
      link: '/admin/agency_vehicles'
    },
    {
      title: 'Total Vehicles',
      value: dashboardLoading ? '...' : (dashboardData?.statistics?.total_vehicles || '0'),
      icon: 'la la-car',
      bgClass: 'bg-3',
      link: '/admin/vehicles'
    },
    {
      title: 'Total Bookings',
      value: dashboardLoading ? '...' : (dashboardData?.statistics?.total_bookings || '0'),
      icon: 'la la-chart-bar',
      bgClass: 'bg-4',
      link: '/admin/bookings'
    }
  ], [dashboardLoading, dashboardData?.statistics]);

  if (isLoading || user === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || (user.user_type !== 'admin' && user.role !== 'admin')) {
    return null;
  }


  return (
    <AdminLayout
      pageTitle="Admin Dashboard"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">Welcome, {user.first_name}!</h3>
                <Link href="/admin/users" className="theme-btn theme-btn-small">
                  <i className="la la-plus me-1"></i>Manage Users
                </Link>
              </div>
            </div>
            <div className="form-content">
              {/* Quick Actions */}
              <div className="row mt-4">
                <div className="col-lg-12">
                  <h4 className="mb-3">Quick Actions</h4>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link href="/admin/users" className="dashboard-quick-action">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="la la-users display-4 text-primary"></i>
                        <h5 className="card-title mt-3">Manage Users</h5>
                        <p className="card-text">View and manage all system users</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link href="/admin/agencies" className="dashboard-quick-action">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="la la-building display-4 text-success"></i>
                        <h5 className="card-title mt-3">Agencies</h5>
                        <p className="card-text">Manage partner agencies</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link href="/admin/vehicles" className="dashboard-quick-action">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="la la-car display-4 text-warning"></i>
                        <h5 className="card-title mt-3">Vehicles</h5>
                        <p className="card-text">Monitor vehicle inventory</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-lg-3 col-md-6">
                  <Link href="/admin/bookings" className="dashboard-quick-action">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="la la-calendar display-4 text-info"></i>
                        <h5 className="card-title mt-3">Bookings</h5>
                        <p className="card-text">Oversee all bookings</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Platform Overview */}
              <div className="row mt-4">
                <div className="col-lg-12">
                  <h4 className="mb-3">Platform Overview</h4>
                  <div className="card">
                    <div className="card-body">
                      {dashboardLoading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading platform data...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-center py-4 text-danger">
                          <i className="la la-exclamation-triangle me-2"></i>
                          {error}
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="platform-stat">
                              <h5>Today's Metrics</h5>
                              <ul className="list-unstyled">
                                <li><strong>New Bookings:</strong> {dashboardData?.statistics?.today_bookings || '0'}</li>
                                <li><strong>Revenue:</strong> {dashboardData?.statistics?.today_revenue || '$0.00'}</li>
                                <li><strong>Confirmed:</strong> {dashboardData?.statistics?.today_confirmed || '0'}</li>
                                <li><strong>Pending:</strong> {dashboardData?.statistics?.today_pending || '0'}</li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="platform-stat">
                              <h5>Vehicle Status</h5>
                              <ul className="list-unstyled">
                                <li><strong>Available:</strong> {dashboardData?.statistics?.available_vehicles || '0'}</li>
                                <li><strong>Rented:</strong> {dashboardData?.statistics?.rented_vehicles || '0'}</li>
                                <li><strong>Utilization:</strong> {dashboardData?.statistics?.vehicle_utilization || '0'}%</li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="platform-stat">
                              <h5>Platform Totals</h5>
                              <ul className="list-unstyled">
                                <li><strong>Total Revenue:</strong> {dashboardData?.statistics?.total_revenue || '$0.00'}</li>
                                <li><strong>All Bookings:</strong> {dashboardData?.statistics?.total_bookings || '0'}</li>
                                <li><strong>Active Users:</strong> {dashboardData?.statistics?.total_customers || '0'}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-quick-action {
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s;
        }
        
        .dashboard-quick-action:hover {
          transform: translateY(-5px);
          text-decoration: none;
          color: inherit;
        }
        
        .dashboard-quick-action .card {
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s;
        }
        
        .dashboard-quick-action:hover .card {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .platform-stat h5 {
          color: #2d3748;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        
        .platform-stat ul li {
          padding: 0.25rem 0;
          color: #4a5568;
        }
      `}</style>
    </AdminLayout>
  );
}

