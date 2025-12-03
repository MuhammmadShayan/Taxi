'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';

export default function VehicleHistory() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchVehicleDetails();
      fetchVehicleHistory();
    }
  }, [params.id]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`/api/admin/vehicles/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch vehicle details');
      const data = await response.json();
      setVehicle(data.vehicle);
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
    }
  };

  const fetchVehicleHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/vehicles/${params.id}/history`);
      if (!response.ok) throw new Error('Failed to fetch vehicle history');
      const data = await response.json();
      setHistory(data.history || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching vehicle history:', err);
      setError('Failed to load vehicle history');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'active': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Vehicles', href: '/admin/vehicles' },
    { label: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle', href: `/admin/vehicles/${params.id}` },
    { label: 'History' }
  ];

  return (
    <AdminLayout
      pageTitle={vehicle ? `${vehicle.brand} ${vehicle.model} - Booking History` : 'Vehicle History'}
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      {/* Statistics Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="icon-box icon-layout-2 dashboard-icon-box">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Total Bookings</p>
                  <h4 className="info__title">{stats.total_reservations}</h4>
                </div>
                <div className="info-icon icon-element bg-1">
                  <i className="la la-calendar"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="icon-box icon-layout-2 dashboard-icon-box">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Completed</p>
                  <h4 className="info__title">{stats.completed_reservations}</h4>
                </div>
                <div className="info-icon icon-element bg-2">
                  <i className="la la-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="icon-box icon-layout-2 dashboard-icon-box">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Total Revenue</p>
                  <h4 className="info__title">{formatCurrency(stats.total_revenue)}</h4>
                </div>
                <div className="info-icon icon-element bg-3">
                  <i className="la la-dollar"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="icon-box icon-layout-2 dashboard-icon-box">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Avg. Booking</p>
                  <h4 className="info__title">{formatCurrency(stats.avg_revenue_per_booking)}</h4>
                </div>
                <div className="info-icon icon-element bg-4">
                  <i className="la la-chart-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">Booking History ({history.length})</h3>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => router.push(`/admin/vehicles/${params.id}`)}
                >
                  <i className="la la-arrow-left me-1"></i>Back to Vehicle
                </button>
              </div>
            </div>
            
            <div className="form-content">
              {error && (
                <div className="alert alert-danger">
                  <i className="la la-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Rental Period</th>
                        <th>Days</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Booking Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length > 0 ? (
                        history.map((booking) => (
                          <tr key={booking.reservation_id}>
                            <td>#{booking.reservation_id}</td>
                            <td>
                              <div>
                                <h6 className="mb-0">{booking.customer_full_name}</h6>
                                <small className="text-muted">{booking.customer_email}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <small className="d-block">{booking.start_date_formatted}</small>
                                <small className="text-muted">to {booking.end_date_formatted}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">{booking.rental_days} days</span>
                            </td>
                            <td>
                              <strong>{formatCurrency(booking.total_price)}</strong>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status_display}
                              </span>
                            </td>
                            <td>
                              <small>{booking.booking_date_formatted}</small>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <i className="la la-calendar" style={{fontSize: '48px', color: '#ccc'}}></i>
                            <p className="text-muted mt-2">No booking history found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
