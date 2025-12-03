'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationHeader from '../../../components/NotificationHeader';
import MessageHeader from '../../../components/MessageHeader';

export default function AgencyEarnings() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // UI state
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFinanceData();
    }
  }, [user, dateRange]);

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

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        start_date: dateRange.from,
        end_date: dateRange.to
      });
      
      const response = await fetch(`/api/agency/earnings?${params}`);
      const result = await response.json();
      
      if (result.success) {
        // Adapt API shape to UI expectations
        const adapted = {
          statistics: {
            total_revenue: result.summary?.total_revenue || '$0.00',
            net_earnings: result.summary?.total_paid || '$0.00',
            pending_balances: result.summary?.pending_revenue || '$0.00',
            vehicle_utilization: 0,
            rented_vehicles: 0,
            total_bookings: result.summary?.total_bookings || 0
          },
          recent_bookings: (result.transactions || []).map(t => ({
            reservation_id: t.reservation_id,
            created_at_formatted: t.created_at_formatted,
            vehicle_display_name: `${t.make || t.brand || ''} ${t.model || ''}`.trim(),
            total_days: t.total_days || '',
            customer_name: `${t.first_name || ''} ${t.last_name || ''}`.trim(),
            customer_email: t.email || t.customer_email,
            total_price_formatted: t.total_price_formatted,
            agency_earnings_formatted: t.amount_paid_formatted,
            status: t.status,
            status_display: (t.status || '').charAt(0).toUpperCase() + (t.status || '').slice(1)
          }))
        };
        setFinanceData(adapted);
        setError(null);
      } else {
        setError(result.error || 'Failed to load finance data');
      }
    } catch (err) {
      console.error('Finance data error:', err);
      setError('Error fetching finance data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string' && (value.startsWith('$') || value.startsWith('MAD'))) {
      return value;
    }
    return `$${parseFloat(value || 0).toFixed(2)}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'active':
        return 'badge bg-primary';
      case 'cancelled':
      case 'canceled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
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
                <li>
                  <Link href="/agency/bookings">
                    <i className="la la-shopping-cart me-2 text-color-3"></i>Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/chat">
                    <i className="la la-comments me-2 text-color-4"></i>Chat
                  </Link>
                </li>
                <li className="page-active">
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
                      <h2 className="sec__title font-size-30 text-white">Earnings & Revenue</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <div className="btn-group">
                    <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                      Export Report
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Export CSV</a></li>
                      <li><a className="dropdown-item" href="#">Export PDF</a></li>
                      <li><a className="dropdown-item" href="#">Export Excel</a></li>
                    </ul>
                  </div>
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

              {/* Date Range Filter */}
              <div className="row mb-4">
                <div className="col-lg-6">
                  <div className="d-flex align-items-center">
                    <label className="me-2 text-muted">From:</label>
                    <input 
                      type="date" 
                      className="form-control me-3" 
                      style={{ width: '150px' }}
                      value={dateRange.from}
                      onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    />
                    <label className="me-2 text-muted">To:</label>
                    <input 
                      type="date" 
                      className="form-control me-3" 
                      style={{ width: '150px' }}
                      value={dateRange.to}
                      onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    />
                    <button onClick={fetchFinanceData} className="btn btn-primary">
                      <i className="la la-refresh me-1"></i>Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Revenue Overview Cards */}
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="card revenue-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="revenue-icon text-success me-3">
                          <i className="la la-dollar display-4"></i>
                        </div>
                        <div>
                          <h4 className="revenue-amount">
                            {loading ? '...' : formatCurrency(financeData?.statistics?.total_revenue || 0)}
                          </h4>
                          <p className="revenue-label">Total Revenue</p>
                          <small className="text-muted">
                            {financeData?.statistics?.total_bookings || 0} bookings
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card revenue-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="revenue-icon text-primary me-3">
                          <i className="la la-money display-4"></i>
                        </div>
                        <div>
                          <h4 className="revenue-amount">
                            {loading ? '...' : formatCurrency(financeData?.statistics?.net_earnings || 0)}
                          </h4>
                          <p className="revenue-label">Net Earnings</p>
                          <small className="text-muted">
                            After platform fee
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card revenue-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="revenue-icon text-warning me-3">
                          <i className="la la-clock display-4"></i>
                        </div>
                        <div>
                          <h4 className="revenue-amount">
                            {loading ? '...' : formatCurrency(financeData?.statistics?.pending_balances || 0)}
                          </h4>
                          <p className="revenue-label">Pending Balance</p>
                          <small className="text-muted">
                            Awaiting collection
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card revenue-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="revenue-icon text-info me-3">
                          <i className="la la-car display-4"></i>
                        </div>
                        <div>
                          <h4 className="revenue-amount">
                            {loading ? '...' : financeData?.statistics?.vehicle_utilization || 0}%
                          </h4>
                          <p className="revenue-label">Fleet Utilization</p>
                          <small className="text-muted">
                            {financeData?.statistics?.rented_vehicles || 0} currently rented
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Transactions</h3>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        {loading ? (
                          <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading transactions...</span>
                            </div>
                          </div>
                        ) : financeData?.recent_bookings?.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="la la-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3 text-muted">No recent transactions</h5>
                            <p className="text-muted">Recent booking activity will appear here.</p>
                          </div>
                        ) : (
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th>Date</th>
                                <th>Booking</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(financeData?.recent_bookings || []).map((transaction) => (
                                <tr key={transaction.reservation_id}>
                                  <td>{transaction.created_at_formatted}</td>
                                  <td>
                                    <div>
                                      <strong>#{transaction.reservation_id}</strong>
                                      <br />
                                      <small className="text-muted">{transaction.vehicle_display_name} • {transaction.total_days} days</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="fw-bold">{transaction.customer_name}</div>
                                      <small className="text-muted">{transaction.customer_email}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="fw-bold">{transaction.total_price_formatted}</div>
                                    <small className="text-muted">Net: {transaction.agency_earnings_formatted}</small>
                                  </td>
                                  <td>
                                    <span className={getStatusBadgeClass(transaction.status)}>
                                      {transaction.status_display}
                                    </span>
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary" title="View Details">
                                      <i className="la la-eye"></i>
                                    </button>
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

                {/* Monthly Summary */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Monthly Summary</h3>
                    </div>
                    <div className="form-content">
                      <div className="monthly-summary">
                        <div className="summary-item">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Gross Revenue</span>
                            <strong className="text-success">$15,730</strong>
                          </div>
                          <div className="progress mb-2">
                            <div className="progress-bar bg-success" style={{width: '100%'}}></div>
                          </div>
                        </div>
                        
                        <div className="summary-item">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Platform Fee (8%)</span>
                            <strong className="text-warning">-$1,258</strong>
                          </div>
                          <div className="progress mb-2">
                            <div className="progress-bar bg-warning" style={{width: '8%'}}></div>
                          </div>
                        </div>
                        
                        <div className="summary-item">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Maintenance Costs</span>
                            <strong className="text-danger">-$1,500</strong>
                          </div>
                          <div className="progress mb-2">
                            <div className="progress-bar bg-danger" style={{width: '10%'}}></div>
                          </div>
                        </div>
                        
                        <div className="summary-item">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Insurance</span>
                            <strong className="text-info">-$480</strong>
                          </div>
                          <div className="progress mb-2">
                            <div className="progress-bar bg-info" style={{width: '3%'}}></div>
                          </div>
                        </div>
                        
                        <hr />
                        
                        <div className="summary-total">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5>Net Profit</h5>
                            <h4 className="text-primary">$12,492</h4>
                          </div>
                          <small className="text-muted">After all deductions</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="form-box mt-4">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Stats</h3>
                    </div>
                    <div className="form-content">
                      <div className="quick-stats">
                        <div className="stat-item">
                          <div className="d-flex justify-content-between">
                            <span>Total Bookings</span>
                            <strong>47</strong>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="d-flex justify-content-between">
                            <span>Avg. Booking Value</span>
                            <strong>$334.68</strong>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="d-flex justify-content-between">
                            <span>Fleet Utilization</span>
                            <strong>78%</strong>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="d-flex justify-content-between">
                            <span>Return Rate</span>
                            <strong>92%</strong>
                          </div>
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
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .revenue-card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }
        
        .revenue-amount {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0;
          color: #333;
        }
        
        .revenue-label {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .summary-item {
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .summary-total {
          padding-top: 1rem;
        }
        
        .stat-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .stat-item:last-child {
          border-bottom: none;
        }
        
        .progress {
          height: 4px;
          border-radius: 2px;
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

