'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reservations');
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setReservations(reservations.map(reservation => 
        reservation.reservation_id === reservationId ? { ...reservation, status: newStatus } : reservation
      ));
    } catch (err) {
      console.error('Error updating reservation status:', err);
      alert('Failed to update reservation status');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = (reservation.customer_name + ' ' + reservation.customer_email + ' ' + reservation.vehicle_info)
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || reservation.payment_status === filterPaymentStatus;
    
    let matchesDateRange = true;
    if (dateFrom) {
      matchesDateRange = matchesDateRange && new Date(reservation.start_date) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDateRange = matchesDateRange && new Date(reservation.start_date) <= new Date(dateTo);
    }
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'active': return 'bg-info';
      case 'completed': return 'bg-primary';
      case 'canceled': return 'bg-danger';
      case 'no_show': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'partial': return 'bg-warning';
      case 'pending': return 'bg-danger';
      case 'refunded': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Reservations' }
  ];

  return (
    <AdminLayout
      pageTitle="Reservation Management"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">All Reservations ({filteredReservations.length})</h3>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="no_show">No Show</option>
                  </select>
                  <select 
                    className="form-select form-select-sm"
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Payment Pending</option>
                    <option value="partial">Partial Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-content">
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by customer or vehicle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="From Date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="To Date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button className="btn btn-primary btn-sm me-2" onClick={fetchReservations}>
                      <i className="la la-refresh me-1"></i>Refresh
                    </button>
                    <button className="btn btn-success btn-sm me-2">
                      <i className="la la-download me-1"></i>Export
                    </button>
                    <button className="btn btn-info btn-sm">
                      <i className="la la-plus me-1"></i>New Booking
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-warning">
                  <i className="la la-exclamation-triangle me-2"></i>
                  {error} - Using demo data
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
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Agency</th>
                        <th>Dates</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation) => (
                          <tr key={reservation.reservation_id}>
                            <td>#{reservation.reservation_id}</td>
                            <td>
                              <div>
                                <h6 className="mb-0">{reservation.customer_name}</h6>
                                <small className="text-muted">{reservation.customer_email}</small>
                                <br />
                                <small className="text-muted">{reservation.phone}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{reservation.vehicle_info}</strong>
                                <br />
                                <small className="text-muted">Pickup: {reservation.pickup_location}</small>
                              </div>
                            </td>
                            <td>
                              <small className="text-primary">{reservation.agency_name}</small>
                            </td>
                            <td>
                              <div>
                                <strong>{new Date(reservation.start_date).toLocaleDateString()}</strong>
                                <br />
                                <small className="text-muted">to {new Date(reservation.end_date).toLocaleDateString()}</small>
                                <br />
                                <small className="badge bg-light text-dark">{reservation.total_days} days</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>${reservation.total_price?.toFixed(2)}</strong>
                                <br />
                                <small className="text-muted">Paid: ${reservation.amount_paid?.toFixed(2)}</small>
                              </div>
                            </td>
                            <td>
                              <select
                                className={`form-select form-select-sm badge ${getStatusBadgeClass(reservation.status)}`}
                                value={reservation.status}
                                onChange={(e) => handleStatusChange(reservation.reservation_id, e.target.value)}
                                style={{ border: 'none', color: 'white' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                                <option value="no_show">No Show</option>
                              </select>
                            </td>
                            <td>
                              <span className={`badge ${getPaymentStatusBadgeClass(reservation.payment_status)}`}>
                                {reservation.payment_status?.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  title="View Details"
                                >
                                  <i className="la la-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-secondary btn-sm"
                                  title="Edit Reservation"
                                >
                                  <i className="la la-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  title="Process Payment"
                                >
                                  <i className="la la-credit-card"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <i className="la la-calendar" style={{fontSize: '48px', color: '#ccc'}}></i>
                            <p className="text-muted mt-2">No reservations found</p>
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

