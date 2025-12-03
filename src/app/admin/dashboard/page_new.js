'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      total_bookings: 0,
      total_vehicles: 0,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
        setError(null);
      } else {
        setError(data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Error fetching dashboard data');
    } finally {
      setLoading(false);
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
      case 'canceled':
        return 'badge bg-danger';
      default:
        return 'badge bg-primary';
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

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <div className="section-bg">
        {/* Admin Sidebar Navigation */}
        <div className="sidebar-nav sidebar--nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team9.jpg" 
                    alt="Admin avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dc3545'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E👨‍💼%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">KIRASTAY Admin</h4>
                  <span className="author__meta">System Administrator</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu toggle-menu list-items">
                <li className="page-active">
                  <Link href="/admin/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/bookings">
                    <i className="la la-shopping-cart me-2 text-color"></i>All Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/admin/vehicles">
                    <i className="la la-car me-2 text-color-2"></i>All Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/admin/agencies">
                    <i className="la la-building me-2 text-color-3"></i>Agencies
                  </Link>
                </li>
                <li>
                  <Link href="/admin/customers">
                    <i className="la la-users me-2 text-color-4"></i>Customers
                  </Link>
                </li>
                <li>
                  <Link href="/admin/analytics">
                    <i className="la la-chart-bar me-2 text-color-5"></i>Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/admin/chat">
                    <i className="la la-comments me-2 text-color-6"></i>Chat
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings">
                    <i className="la la-cog me-2 text-color-7"></i>Settings
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <i className="la la-power-off me-2 text-color-8"></i>Logout
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
                          alt="KIRASTAY logo"
                          style={{ maxHeight: '40px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EKIRASTAY ADMIN%3C/text%3E%3C/svg%3E";
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
                        <div className="notification-item">
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle"
                              id="userDropdownMenu"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img 
                                    src="/html-folder/images/team9.jpg" 
                                    alt="Admin avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dc3545'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E👨‍💼%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <span className="font-size-14 font-weight-bold">Admin</span>
                              </div>
                            </a>
                            <div className="dropdown-menu dropdown-reveal dropdown-menu-xl dropdown-menu-right">
                              <div className="list-group drop-reveal-list user-drop-reveal-list">
                                <Link href="/admin/dashboard-profile" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-user me-2"></i>My Profile
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/admin/settings" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-cog me-2"></i>Settings
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <div className="section-block"></div>
                                <Link href="/" className="list-group-item list-group-item-action">
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
                      <h2 className="sec__title font-size-30 text-white">Admin Dashboard</h2>
                      <p className="text-white-50">System overview and management</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <button onClick={fetchDashboardData} className="btn btn-light">
                    <i className="la la-refresh me-1"></i>Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              
              {/* Error Display */}
              {error && (
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-danger" role="alert">
                      <i className="la la-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Statistics Cards */}
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-primary mb-3">
                        <i className="la la-shopping-cart display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.total_bookings}</h4>
                      <p className="stats-label">Total Bookings</p>
                      <small className="text-muted">
                        {dashboardData.statistics.today_bookings} today
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-success mb-3">
                        <i className="la la-car display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.total_vehicles}</h4>
                      <p className="stats-label">Total Vehicles</p>
                      <small className="text-muted">
                        {dashboardData.statistics.available_vehicles} available
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-info mb-3">
                        <i className="la la-building display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.total_agencies}</h4>
                      <p className="stats-label">Active Agencies</p>
                      <small className="text-muted">
                        Partner agencies
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-warning mb-3">
                        <i className="la la-users display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.total_customers}</h4>
                      <p className="stats-label">Total Customers</p>
                      <small className="text-muted">
                        Registered users
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue and Utilization Row */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-success mb-3">
                        <i className="la la-dollar-sign display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.total_revenue}</h4>
                      <p className="stats-label">Total Revenue</p>
                      <small className="text-muted">
                        {dashboardData.statistics.today_revenue} today
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-danger mb-3">
                        <i className="la la-chart-pie display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.vehicle_utilization}%</h4>
                      <p className="stats-label">Vehicle Utilization</p>
                      <small className="text-muted">
                        {dashboardData.statistics.rented_vehicles} currently rented
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card stats-card">
                    <div className="card-body text-center">
                      <div className="stats-icon text-warning mb-3">
                        <i className="la la-clock display-4"></i>
                      </div>
                      <h4 className="stats-number">{loading ? '...' : dashboardData.statistics.today_pending}</h4>
                      <p className="stats-label">Pending Approvals</p>
                      <small className="text-muted">
                        Require attention
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Recent Bookings</h3>
                        <Link href="/admin/bookings" className="btn btn-primary">
                          <i className="la la-eye me-1"></i>View All
                        </Link>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        {loading ? (
                          <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading recent bookings...</span>
                            </div>
                          </div>
                        ) : dashboardData.recent_bookings.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="la la-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3 text-muted">No recent bookings</h5>
                            <p className="text-muted">Recent booking activity will appear here.</p>
                          </div>
                        ) : (
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th>Booking #</th>
                                <th>Customer</th>
                                <th>Agency</th>
                                <th>Vehicle</th>
                                <th>Dates</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dashboardData.recent_bookings.map((booking) => (
                                <tr key={booking.reservation_id}>
                                  <td><strong>#{booking.reservation_id}</strong></td>
                                  <td>
                                    <div>
                                      <div className="fw-bold">{booking.customer_name}</div>
                                      <small className="text-muted">{booking.customer_email}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="fw-bold">{booking.agency_name || 'Direct Booking'}</div>
                                      <small className="text-muted">Agency ID: {booking.agency_id}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="fw-bold">{booking.vehicle_display_name}</div>
                                      <small className="text-muted">{booking.license_plate}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div>{booking.start_date_formatted}</div>
                                      <small className="text-muted">to {booking.end_date_formatted}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="fw-bold">{booking.total_price_formatted}</div>
                                    <small className="text-muted">{booking.total_days} days</small>
                                  </td>
                                  <td>
                                    <span className={getStatusBadgeClass(booking.status)}>
                                      {booking.status_display}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button className="btn btn-sm btn-outline-primary" title="View Details">
                                        <i className="la la-eye"></i>
                                      </button>
                                      <Link 
                                        href={`/admin/bookings?id=${booking.reservation_id}`}
                                        className="btn btn-sm btn-outline-success" 
                                        title="Manage"
                                      >
                                        <i className="la la-cog"></i>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="row">
                        <div className="col-lg-3 col-md-6">
                          <Link href="/admin/bookings" className="card quick-action-card text-decoration-none">
                            <div className="card-body text-center">
                              <i className="la la-shopping-cart text-primary" style={{ fontSize: '2.5rem' }}></i>
                              <h5 className="mt-3">Manage Bookings</h5>
                              <p className="text-muted small">View and manage all reservations</p>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <Link href="/admin/vehicles" className="card quick-action-card text-decoration-none">
                            <div className="card-body text-center">
                              <i className="la la-car text-success" style={{ fontSize: '2.5rem' }}></i>
                              <h5 className="mt-3">Vehicle Fleet</h5>
                              <p className="text-muted small">Monitor all agency vehicles</p>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <Link href="/admin/agencies" className="card quick-action-card text-decoration-none">
                            <div className="card-body text-center">
                              <i className="la la-building text-info" style={{ fontSize: '2.5rem' }}></i>
                              <h5 className="mt-3">Agency Partners</h5>
                              <p className="text-muted small">Manage partner agencies</p>
                            </div>
                          </Link>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <Link href="/admin/analytics" className="card quick-action-card text-decoration-none">
                            <div className="card-body text-center">
                              <i className="la la-chart-bar text-warning" style={{ fontSize: '2.5rem' }}></i>
                              <h5 className="mt-3">Analytics</h5>
                              <p className="text-muted small">View detailed reports</p>
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
        
        .stats-card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
          transition: transform 0.2s;
        }
        
        .stats-card:hover {
          transform: translateY(-5px);
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
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .quick-action-card {
          border: 2px solid transparent;
          transition: all 0.3s;
          margin-bottom: 1rem;
        }
        
        .quick-action-card:hover {
          border-color: #007bff;
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .table th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
        }
        
        .badge {
          font-size: 0.75rem;
        }
        
        .btn-group .btn {
          margin-right: 0.25rem;
        }
      `}</style>
    </>
  );
}
