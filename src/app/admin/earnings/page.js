'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    range: 'this_month',
    agency_id: '',
    status: 'confirmed,completed', // Default to show confirmed + completed bookings
    search: '',
    page: 1,
    limit: 20
  });
  
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    fetchEarningsData();
    fetchAgencies();
  }, [filters]);

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/admin/agencies');
      if (response.ok) {
        const data = await response.json();
        setAgencies(data.agencies || []);
      }
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      
      const response = await fetch(`/api/admin/earnings?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setEarningsData(result);
        setError(null);
      } else {
        setError(result.error || 'Failed to load earnings data');
      }
    } catch (err) {
      console.error('Earnings data error:', err);
      setError('Error fetching earnings data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.startsWith('$')) {
      return value;
    }
    
    // Handle null, undefined, empty string, or NaN
    if (value === null || value === undefined || value === '' || isNaN(value)) {
      return '$0.00';
    }
    
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return '$0.00';
    }
    
    return `$${parsed.toFixed(2)}`;
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  // View booking details
  const viewBookingDetails = (reservationId) => {
    window.location.href = `/admin/bookings/${reservationId}`;
  };

  // Manage booking (edit/cancel/modify)
  const manageBooking = (reservationId) => {
    window.location.href = `/admin/bookings/${reservationId}/edit`;
  };

  // Export CSV functionality
  const exportCSV = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/earnings/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export CSV');
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV');
    }
  };

  // Helper function to safely get formatted currency
  const getSafeCurrency = (value) => {
    if (loading) return '...';
    if (!value) return '$0.00';
    if (typeof value === 'string' && value.startsWith('$')) {
      return value.includes('NaN') ? '$0.00' : value;
    }
    return formatCurrency(value);
  };

  // Prepare stats cards data for AdminLayout
  const statsCards = [
    {
      title: 'Total Revenue',
      value: getSafeCurrency(earningsData?.earnings?.total_formatted),
      icon: 'la la-dollar-sign',
      bgClass: 'bg-1',
      subtitle: `${earningsData?.summary?.total_bookings || 0} bookings`
    },
    {
      title: 'Active Agencies',
      value: loading ? '...' : earningsData?.summary?.total_agencies || 0,
      icon: 'la la-building',
      bgClass: 'bg-2',
      subtitle: 'Partner agencies'
    },
    {
      title: 'Platform Commission',
      value: getSafeCurrency(earningsData?.earnings?.commission_formatted),
      icon: 'la la-chart-line',
      bgClass: 'bg-3',
      subtitle: 'Revenue share'
    },
    {
      title: 'Agency Earnings',
      value: getSafeCurrency(earningsData?.earnings?.agency_earnings_formatted),
      icon: 'la la-money',
      bgClass: 'bg-5',
      subtitle: 'After commission'
    }
  ];

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Earnings', href: '/admin/earnings', active: true }
  ];

  return (
    <AdminLayout 
      pageTitle="Platform Earnings"
      breadcrumbItems={breadcrumbs}
      showStats={true}
      statsCards={statsCards}
    >
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

        {/* Filters Section */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-title-wrap">
                <h3 className="title">Filter Transactions</h3>
              </div>
              <div className="form-content">
                <div className="row">
                  <div className="col-lg-2 col-md-4 mb-3">
                    <label className="form-label">Date Range</label>
                    <select 
                      className="form-control"
                      value={filters.range}
                      onChange={(e) => handleFilterChange('range', e.target.value)}
                    >
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                      <option value="this_month">This Month</option>
                      <option value="last_month">Last Month</option>
                      <option value="this_year">This Year</option>
                      <option value="last_year">Last Year</option>
                      <option value="all_time">All Time</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-4 mb-3">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-control"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="confirmed">Confirmed Only (Default)</option>
                      <option value="completed">Completed Only</option>
                      <option value="confirmed,completed">Confirmed + Completed</option>
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="col-lg-2 col-md-4 mb-3">
                    <label className="form-label">Agency</label>
                    <select 
                      className="form-control"
                      value={filters.agency_id}
                      onChange={(e) => handleFilterChange('agency_id', e.target.value)}
                    >
                      <option value="">All Agencies</option>
                      {agencies.map(agency => (
                        <option key={agency.agency_id} value={agency.agency_id}>
                          {agency.business_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-3">
                    <label className="form-label">Search</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Customer name or booking ID"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-lg-2 col-md-6 mb-3">
                    <label className="form-label">Records</label>
                    <select 
                      className="form-control"
                      value={filters.limit}
                      onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Transactions Table */}
        <div className="row">
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-title-wrap">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="title">All Platform Transactions</h3>
                  <div className="d-flex align-items-center">
                    {earningsData?.pagination && (
                      <span className="text-muted me-3">
                        Page {earningsData.pagination.current_page} of {earningsData.pagination.total_pages} 
                        ({earningsData.pagination.total_records} total)
                      </span>
                    )}
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={exportCSV}
                    >
                      <i className="la la-download me-1"></i>Export CSV
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-content">
                <div className="table-responsive">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading transactions...</span>
                      </div>
                    </div>
                  ) : earningsData?.transactions?.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="la la-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      <h5 className="mt-3 text-muted">No transactions found</h5>
                      <p className="text-muted">Try adjusting your filters to see more results.</p>
                    </div>
                  ) : (
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Booking #</th>
                          <th>Customer</th>
                          <th>Agency</th>
                          <th>Vehicle</th>
                          <th>Duration</th>
                          <th>Amount</th>
                          <th>Commission</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(earningsData?.transactions || []).map((transaction) => (
                          <tr key={transaction.reservation_id}>
                            <td>
                              <div>
                                <div className="fw-bold">{transaction.created_at}</div>
                                <small className="text-muted">
                                  {transaction.start_date} to {transaction.end_date}
                                </small>
                              </div>
                            </td>
                            <td>
                              <strong>#{transaction.reservation_id}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{transaction.customer_name}</div>
                                <small className="text-muted">{transaction.customer_email}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{transaction.agency_name}</div>
                                <small className="text-muted">ID: {transaction.agency_id}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{transaction.vehicle_name}</div>
                                <small className="text-muted">{transaction.vehicle_number}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{transaction.total_days} days</span>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{transaction.total_price_formatted}</div>
                                <small className="text-muted">Net: {transaction.agency_net_earnings_formatted}</small>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold text-warning">{transaction.commission_formatted}</div>
                            </td>
                            <td>
                              <span className={getStatusBadgeClass(transaction.status)}>
                                {transaction.status?.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  title="View Details"
                                  onClick={() => viewBookingDetails(transaction.reservation_id)}
                                >
                                  <i className="la la-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success" 
                                  title="Manage"
                                  onClick={() => manageBooking(transaction.reservation_id)}
                                >
                                  <i className="la la-cog"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Pagination */}
                {earningsData?.pagination && earningsData.pagination.total_pages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <p className="text-muted mb-0">
                        Showing {((earningsData.pagination.current_page - 1) * earningsData.pagination.per_page) + 1} to {Math.min(earningsData.pagination.current_page * earningsData.pagination.per_page, earningsData.pagination.total_records)} of {earningsData.pagination.total_records} results
                      </p>
                    </div>
                    <div>
                      <div className="btn-group">
                        <button 
                          className="btn btn-outline-primary" 
                          disabled={!earningsData.pagination.has_prev}
                          onClick={() => handleFilterChange('page', earningsData.pagination.current_page - 1)}
                        >
                          <i className="la la-angle-left"></i> Previous
                        </button>
                        <button 
                          className="btn btn-outline-primary" 
                          disabled={!earningsData.pagination.has_next}
                          onClick={() => handleFilterChange('page', earningsData.pagination.current_page + 1)}
                        >
                          Next <i className="la la-angle-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Agency Breakdown */}
        {earningsData?.agency_breakdown?.length > 0 && (
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Agency Performance Breakdown</h3>
                </div>
                <div className="form-content">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Agency</th>
                          <th>Bookings</th>
                          <th>Revenue</th>
                          <th>Commission</th>
                          <th>Net Earnings</th>
                          <th>Avg. Booking</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earningsData.agency_breakdown.map((agency) => (
                          <tr key={agency.agency_id}>
                            <td>
                              <div>
                                <div className="fw-bold">{agency.agency_name}</div>
                                <small className="text-muted">ID: {agency.agency_id}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-primary">{agency.bookings_count}</span>
                            </td>
                            <td>
                              <div className="fw-bold">{agency.revenue_formatted}</div>
                            </td>
                            <td>
                              <div className="fw-bold text-warning">{agency.commission_formatted}</div>
                            </td>
                            <td>
                              <div className="fw-bold text-success">{agency.net_earnings_formatted}</div>
                            </td>
                            <td>
                              <div>{agency.avg_booking_value_formatted}</div>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleFilterChange('agency_id', agency.agency_id)}
                                title="Filter by this agency"
                              >
                                <i className="la la-filter"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
