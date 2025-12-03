'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';

export default function AdminDashboardOrders() {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    total_revenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0, perPage: 10 });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok && !data._demo) {
        setStats({
          total_orders: data.total_bookings || data.bookings || 0,
          pending_orders: data.pending_bookings || 0,
          completed_orders: data.completed_bookings || 0,
          total_revenue: data.total_revenue || 0
        });
      } else {
        // If demo data, compute stats from orders once loaded
      }
    } catch (e) {
      console.warn('Stats fetch failed, will compute from orders if available');
    }
  };

  const fetchOrders = async (page = 1, status = statusFilter) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (status && status !== 'all') params.append('status', status);
      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to load orders');
      }
      setOrders(data.bookings || []);
      setPagination({
        page: data.pagination?.page || page,
        pages: data.pagination?.pages || 0,
        total: data.pagination?.total || 0,
        perPage: data.pagination?.limit || 10
      });
      // If stats are demo or missing, compute quick stats from current page (approx)
      setStats(prev => ({
        ...prev,
        total_orders: data.pagination?.total ?? (data.bookings?.length || 0)
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders(1, statusFilter);
  }, []);

  const onChangeStatus = (value) => {
    setStatusFilter(value);
    fetchOrders(1, value);
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: String(stats.total_orders),
      icon: 'la la-list',
      color: 'text-color'
    },
    {
      title: 'Pending Orders',
      value: String(stats.pending_orders),
      icon: 'la la-clock-o',
      color: 'text-color-2'
    },
    {
      title: 'Completed Orders',
      value: String(stats.completed_orders),
      icon: 'la la-check-circle',
      color: 'text-color-3'
    },
    {
      title: 'Total Revenue',
      value: `$${Number(stats.total_revenue || 0).toFixed(2)}`,
      icon: 'la la-dollar',
      color: 'text-color-4'
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Orders' }
  ];

  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'badge bg-warning text-white';
    if (s === 'confirmed' || s === 'completed') return 'badge bg-success text-white';
    if (s === 'active') return 'badge bg-primary text-white';
    if (s === 'canceled' || s === 'cancelled') return 'badge bg-danger text-white';
    return 'badge bg-secondary text-white';
  };

  return (
    <AdminLayout 
      pageTitle="Orders Management"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-title-wrap">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="title">All Orders</h3>
                  <div className="select-contain">
                    <select className="select-contain-select" value={statusFilter} onChange={(e) => onChangeStatus(e.target.value)}>
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-content">
                <div className="table-form table-responsive">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">
                      <i className="la la-exclamation-triangle me-2"></i>{error}
                    </div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Booking #</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Vehicle</th>
                          <th scope="col">Dates</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders || []).map((b) => (
                          <tr key={b.reservation_id}>
                            <th scope="row">#{b.reservation_id}</th>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img src="/html-folder/images/team8.jpg" alt="avatar" />
                                </div>
                                <div>
                                  <span className="font-weight-bold">{b.customer_name || 'Customer'}</span>
                                  <br />
                                  <small className="text-muted">{b.customer_email || ''}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success text-white">{b.vehicle_display_name || b.vehicle_name || 'Vehicle'}</span>
                            </td>
                            <td>
                              <div>
                                <div>{b.start_date_formatted || b.start_date}</div>
                                <small className="text-muted">to {b.end_date_formatted || b.end_date}</small>
                              </div>
                            </td>
                            <td>{b.total_price_formatted || `$${Number(b.total_price || 0).toFixed(2)}`}</td>
                            <td><span className={statusBadge(b.status)}>{(b.status_display || b.status || '').toString()}</span></td>
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
                                    <Link href={`/admin/bookings/${b.reservation_id}`} className="dropdown-item">
                                      <i className="la la-eye me-2"></i>View Details
                                    </Link>
                                  </div>
                                </div>
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

        {/* Order Statistics */}
        <div className="row mt-4">
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Total Orders</p>
                  <h4 className="info__title">{stats.total_orders}</h4>
                </div>
                <div className="info-icon icon-element bg-1">
                  <i className="la la-shopping-bag"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Pending Orders</p>
                  <h4 className="info__title">{stats.pending_orders}</h4>
                </div>
                <div className="info-icon icon-element bg-2">
                  <i className="la la-clock-o"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Completed</p>
                  <h4 className="info__title">{stats.completed_orders}</h4>
                </div>
                <div className="info-icon icon-element bg-3">
                  <i className="la la-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Total Revenue</p>
                  <h4 className="info__title">${Number(stats.total_revenue || 0).toFixed(2)}</h4>
                </div>
                <div className="info-icon icon-element bg-4">
                  <i className="la la-times-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

