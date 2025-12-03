'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardDriver() {
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  
  // Fetch driver statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/drivers/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch driver stats:', error);
    }
  };
  
  // Fetch drivers list
  const fetchDrivers = async (status = 'all', page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/drivers?status=${status}&page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      if (data.success) {
        setDrivers(data.drivers);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle driver actions (approve, reject, suspend)
  const handleDriverAction = async (driverId, action) => {
    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, action })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh data
        fetchDrivers(statusFilter, pagination.page);
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update driver:', error);
    }
  };
  
  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    fetchDrivers(newStatus, 1);
  };
  
  useEffect(() => {
    fetchStats();
    fetchDrivers();
  }, []);
  
  // Generate dynamic stats cards
  const statsCards = stats ? [
    {
      title: "Total Drivers",
      value: stats.totalDrivers.toString(),
      change: "+0%", // You can calculate this based on previous period data
      changeType: "positive",
      icon: "la la-id-card",
      color: "text-color"
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers.toString(),
      change: "+0%",
      changeType: "positive",
      icon: "la la-check-circle",
      color: "text-color-2"
    },
    {
      title: "Pending Approval",
      value: stats.pendingDrivers.toString(),
      change: "+0",
      changeType: "positive",
      icon: "la la-clock-o",
      color: "text-color-3"
    },
    {
      title: "Total Trips",
      value: stats.totalTrips.toLocaleString(),
      change: "+0%",
      changeType: "positive",
      icon: "la la-road",
      color: "text-color-4"
    }
  ] : [];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Drivers' }
  ];

  return (
    <AdminLayout 
      pageTitle="Drivers Management"
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
                        <h3 className="title">All Drivers</h3>
                        <div className="select-contain">
                          <select 
                            className="select-contain-select"
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                          >
                            <option value="all">All Drivers</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending Approval</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Driver</th>
                              <th scope="col">Contact</th>
                              <th scope="col">Vehicle</th>
                              <th scope="col">Rating</th>
                              <th scope="col">Trips</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4">
                                  <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : drivers.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4">
                                  <p className="text-muted">No drivers found</p>
                                </td>
                              </tr>
                            ) : (
                              drivers.map((driver) => {
                                const getRatingStars = (rating) => {
                                  const fullStars = Math.floor(rating);
                                  const hasHalfStar = rating % 1 !== 0;
                                  const emptyStars = 5 - Math.ceil(rating);
                                  
                                  return (
                                    <span className="rating__result">
                                      {[...Array(fullStars)].map((_, i) => (
                                        <i key={`full-${i}`} className="la la-star"></i>
                                      ))}
                                      {hasHalfStar && <i className="la la-star-half-o"></i>}
                                      {[...Array(emptyStars)].map((_, i) => (
                                        <i key={`empty-${i}`} className="la la-star-o"></i>
                                      ))}
                                    </span>
                                  );
                                };
                                
                                const getStatusBadge = (status, isActive, isAvailable) => {
                                  if (status === 'approved' && isActive && isAvailable) {
                                    return <span className="badge bg-success text-white">Active</span>;
                                  }
                                  if (status === 'pending') {
                                    return <span className="badge bg-warning text-white">Pending</span>;
                                  }
                                  if (status === 'rejected') {
                                    return <span className="badge bg-danger text-white">Rejected</span>;
                                  }
                                  if (status === 'under_review') {
                                    return <span className="badge bg-info text-white">Under Review</span>;
                                  }
                                  return <span className="badge bg-secondary text-white">Inactive</span>;
                                };
                                
                                return (
                                  <tr key={driver.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="avatar avatar-sm flex-shrink-0 me-2">
                                          <img 
                                            src={`/html-folder/images/team${(driver.id % 8) + 1}.jpg`} 
                                            alt="avatar" 
                                            onError={(e) => {
                                              e.target.src = '/html-folder/images/team1.jpg';
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <span className="font-weight-bold">
                                            {driver.first_name} {driver.last_name}
                                          </span>
                                          <br />
                                          <small className="text-muted">ID: #DRV{driver.id.toString().padStart(3, '0')}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <div>{driver.email}</div>
                                        <small className="text-muted">{driver.phone || 'N/A'}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <span className="font-weight-bold">
                                          {driver.vehicle_make && driver.vehicle_model 
                                            ? `${driver.vehicle_make} ${driver.vehicle_model}` 
                                            : 'N/A'
                                          }
                                        </span>
                                        <br />
                                        <small className="text-muted">{driver.vehicle_plate || 'N/A'}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <span className="me-1">{driver.rating || '0.0'}</span>
                                        <div className="rating">
                                          {getRatingStars(driver.rating || 0)}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge bg-info text-white">{driver.total_trips || 0}</span>
                                    </td>
                                    <td>
                                      {getStatusBadge(driver.application_status, driver.is_active, driver.is_available)}
                                    </td>
                                    <td>
                                      <div className="dropdown">
                                        <a
                                          href="#"
                                          className="theme-btn theme-btn-small theme-btn-transparent"
                                          data-bs-toggle="dropdown"
                                        >
                                          <i className="la la-dot-circle-o"></i>
                                          <i className="la la-dot-circle-o"></i>
                                          <i className="la la-dot-circle-o"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <a href="#" className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          {driver.application_status === 'pending' ? (
                                            <>
                                              <button 
                                                className="dropdown-item"
                                                onClick={() => handleDriverAction(driver.id, 'approve')}
                                              >
                                                <i className="la la-check me-2"></i>Approve
                                              </button>
                                              <button 
                                                className="dropdown-item text-danger"
                                                onClick={() => handleDriverAction(driver.id, 'reject')}
                                              >
                                                <i className="la la-times me-2"></i>Reject
                                              </button>
                                            </>
                                          ) : driver.application_status === 'approved' ? (
                                            <>
                                              {driver.is_available ? (
                                                <button 
                                                  className="dropdown-item text-warning"
                                                  onClick={() => handleDriverAction(driver.id, 'suspend')}
                                                >
                                                  <i className="la la-ban me-2"></i>Suspend
                                                </button>
                                              ) : (
                                                <button 
                                                  className="dropdown-item text-success"
                                                  onClick={() => handleDriverAction(driver.id, 'activate')}
                                                >
                                                  <i className="la la-play me-2"></i>Activate
                                                </button>
                                              )}
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination */}
                      {pagination && pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            <small className="text-muted">
                              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                              {pagination.total} entries
                            </small>
                          </div>
                          <nav>
                            <ul className="pagination pagination-sm mb-0">
                              <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link"
                                  onClick={() => pagination.hasPrev && fetchDrivers(statusFilter, pagination.page - 1)}
                                  disabled={!pagination.hasPrev}
                                >
                                  Previous
                                </button>
                              </li>
                              {[...Array(pagination.totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (page === pagination.page || 
                                    page === 1 || 
                                    page === pagination.totalPages ||
                                    (page >= pagination.page - 1 && page <= pagination.page + 1)) {
                                  return (
                                    <li key={page} className={`page-item ${page === pagination.page ? 'active' : ''}`}>
                                      <button 
                                        className="page-link"
                                        onClick={() => fetchDrivers(statusFilter, page)}
                                      >
                                        {page}
                                      </button>
                                    </li>
                                  );
                                }
                                return null;
                              })}
                              <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link"
                                  onClick={() => pagination.hasNext && fetchDrivers(statusFilter, pagination.page + 1)}
                                  disabled={!pagination.hasNext}
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Driver Statistics */}
              {stats && (
                <div className="row mt-4">
                  <div className="col-lg-3 responsive-column">
                    <div className="icon-box icon-layout-2 dashboard-icon-box">
                      <div className="d-flex">
                        <div className="info-icon flex-shrink-0 bg-rgb-1">
                          <i className="la la-users"></i>
                        </div>
                        <div className="info-content">
                          <p className="info__desc">Total Drivers</p>
                          <h4 className="info__title">{stats.totalDrivers}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 responsive-column">
                    <div className="icon-box icon-layout-2 dashboard-icon-box">
                      <div className="d-flex">
                        <div className="info-icon flex-shrink-0 bg-rgb-2">
                          <i className="la la-check-circle"></i>
                        </div>
                        <div className="info-content">
                          <p className="info__desc">Active Drivers</p>
                          <h4 className="info__title">{stats.activeDrivers}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 responsive-column">
                    <div className="icon-box icon-layout-2 dashboard-icon-box">
                      <div className="d-flex">
                        <div className="info-icon flex-shrink-0 bg-rgb-3">
                          <i className="la la-clock-o"></i>
                        </div>
                        <div className="info-content">
                          <p className="info__desc">Pending Approval</p>
                          <h4 className="info__title">{stats.pendingDrivers}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 responsive-column">
                    <div className="icon-box icon-layout-2 dashboard-icon-box">
                      <div className="d-flex">
                        <div className="info-icon flex-shrink-0 bg-rgb-4">
                          <i className="la la-star"></i>
                        </div>
                        <div className="info-content">
                          <p className="info__desc">Average Rating</p>
                          <h4 className="info__title">{stats.averageRating || '0.0'}</h4>
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

