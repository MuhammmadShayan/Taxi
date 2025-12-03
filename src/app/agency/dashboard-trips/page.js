'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/agency/reservations', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data.reservations || []);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`/api/agency/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTrips(prev => 
          prev.map(trip => 
            trip.reservation_id === reservationId 
              ? { ...trip, status: newStatus }
              : trip
          )
        );
        alert('Trip status updated successfully!');
      } else {
        alert('Failed to update trip status');
      }
    } catch (error) {
      console.error('Error updating trip status:', error);
      alert('Error updating trip status');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      confirmed: 'bg-success',
      active: 'bg-primary',
      completed: 'bg-info',
      canceled: 'bg-danger',
      no_show: 'bg-secondary'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTrips = trips.filter(trip => 
    filterStatus === 'all' || trip.status === filterStatus
  );

  if (loading) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading trips...</p>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout pageTitle="Trips & Reservations">
        <div className="row">
          <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Trips & Reservations</h3>
                    <p className="subtitle">Track and manage all customer bookings</p>
                  </div>
                  
                  {/* Filters and Stats */}
                  <div className="form-content">
                    <div className="row mb-4">
                      <div className="col-lg-3">
                        <div className="input-box">
                          <label className="label-text">Filter by Status</label>
                          <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                          >
                            <option value="all">All Trips</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-9">
                        <div className="d-flex align-items-end h-100">
                          <div className="trip-stats">
                            <span className="me-4">
                              <strong>Total:</strong> {trips.length}
                            </span>
                            <span className="me-4">
                              <strong>Pending:</strong> {trips.filter(t => t.status === 'pending').length}
                            </span>
                            <span className="me-4">
                              <strong>Active:</strong> {trips.filter(t => t.status === 'active').length}
                            </span>
                            <span className="me-4">
                              <strong>Completed:</strong> {trips.filter(t => t.status === 'completed').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trips Table */}
                    {filteredTrips.length === 0 ? (
                      <div className="text-center p-5">
                        <i className="la la-calendar display-4 text-muted"></i>
                        <h4 className="mt-3">No trips found</h4>
                        <p className="text-muted">
                          {filterStatus === 'all' 
                            ? "No reservations have been made yet." 
                            : `No trips with status "${filterStatus}"`
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Vehicle</th>
                              <th>Trip Dates</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTrips.map(trip => (
                              <tr key={trip.reservation_id}>
                                <td>
                                  <div className="customer-info">
                                    <h6 className="mb-1">{trip.customer_name || 'N/A'}</h6>
                                    <small className="text-muted">{trip.customer_email || 'N/A'}</small>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <h6 className="mb-1">{trip.vehicle_brand} {trip.vehicle_model}</h6>
                                    <small className="text-muted">{trip.vehicle_number}</small>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>{formatDate(trip.start_date)}</strong>
                                    <br />
                                    <small className="text-muted">to {formatDate(trip.end_date)}</small>
                                    <br />
                                    <small className="text-info">{trip.total_days} days</small>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>${trip.total_price}</strong>
                                    <br />
                                    <small className={`text-${trip.payment_status === 'paid' ? 'success' : 'warning'}`}>
                                      {trip.payment_status.toUpperCase()}
                                    </small>
                                  </div>
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button 
                                      className={`btn btn-sm dropdown-toggle ${
                                        trip.status === 'pending' ? 'btn-warning' :
                                        trip.status === 'confirmed' ? 'btn-success' :
                                        trip.status === 'active' ? 'btn-primary' :
                                        trip.status === 'completed' ? 'btn-info' :
                                        'btn-secondary'
                                      }`}
                                      data-bs-toggle="dropdown"
                                    >
                                      {trip.status.replace('_', ' ').toUpperCase()}
                                    </button>
                                    <ul className="dropdown-menu">
                                      {trip.status === 'pending' && (
                                        <>
                                          <li>
                                            <button 
                                              className="dropdown-item"
                                              onClick={() => handleStatusUpdate(trip.reservation_id, 'confirmed')}
                                            >
                                              Confirm
                                            </button>
                                          </li>
                                          <li>
                                            <button 
                                              className="dropdown-item text-danger"
                                              onClick={() => handleStatusUpdate(trip.reservation_id, 'canceled')}
                                            >
                                              Cancel
                                            </button>
                                          </li>
                                        </>
                                      )}
                                      {trip.status === 'confirmed' && (
                                        <li>
                                          <button 
                                            className="dropdown-item"
                                            onClick={() => handleStatusUpdate(trip.reservation_id, 'active')}
                                          >
                                            Start Trip
                                          </button>
                                        </li>
                                      )}
                                      {trip.status === 'active' && (
                                        <li>
                                          <button 
                                            className="dropdown-item"
                                            onClick={() => handleStatusUpdate(trip.reservation_id, 'completed')}
                                          >
                                            Complete Trip
                                          </button>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </td>
                                <td>
                                  <div className="btn-group">
                                    <button className="btn btn-sm btn-outline-primary" title="View Details">
                                      <i className="la la-eye"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-info" title="Contact Customer">
                                      <i className="la la-comments"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-success" title="Print">
                                      <i className="la la-print"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
      </AgencyLayout>
    </AuthProvider>
  );
}

