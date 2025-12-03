'use client';
import { useState, useEffect } from 'react';

export default function DriverDashboardTrips() {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, tripsResponse] = await Promise.all([
          fetch('/api/driver/stats'),
          fetch(`/api/trips?status=${statusFilter}&limit=50`)
        ]);
        
        if (!statsResponse.ok || !tripsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const statsData = await statsResponse.json();
        const tripsData = await tripsResponse.json();
        
        setStats(statsData);
        setTrips(tripsData.trips || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load trips data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [statusFilter]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleTripAction = async (tripId, action) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        // Refresh trips data
        const tripsResponse = await fetch(`/api/trips?status=${statusFilter}&limit=50`);
        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          setTrips(tripsData.trips || []);
        }
      }
    } catch (err) {
      console.error('Error updating trip:', err);
    }
  };

  const statsCards = stats ? [
    {
      title: 'Total Trips',
      value: stats.totalTrips || '0',
      icon: 'la la-road',
      bgClass: 'bg-1'
    },
    {
      title: 'Completed',
      value: stats.completedTrips || '0',
      icon: 'la la-check-circle',
      bgClass: 'bg-2'
    },
    {
      title: 'Pending',
      value: stats.pending_trips || '0',
      icon: 'la la-clock-o',
      bgClass: 'bg-3'
    },
    {
      title: 'Cancelled',
      value: stats.cancelledTrips || '0',
      icon: 'la la-times-circle',
      bgClass: 'bg-4'
    }
  ] : [];

  if (loading) {
    return (
      <>
        pageTitle="My Trips"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/driver' }, { label: 'My Trips' }]}
        showStats={false}
      >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading trips...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        pageTitle="My Trips"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/driver' }, { label: 'My Trips' }]}
        showStats={false}
      >
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      pageTitle="My Trips"
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/driver' }, { label: 'My Trips' }]}
      showStats={true}
      statsCards={statsCards}
    >
      {/* Main Trips Content */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">All Assigned Trips</h3>
                        <div className="d-flex align-items-center">
                          <div className="select-contain me-3">
                            <select 
                              className="select-contain-select"
                              value={statusFilter}
                              onChange={(e) => handleStatusFilter(e.target.value)}
                            >
                              <option value="all">All Trips</option>
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <button 
                            className="theme-btn theme-btn-small"
                            onClick={() => window.location.reload()}
                          >
                            <i className="la la-refresh me-1"></i>Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Trip ID</th>
                              <th scope="col">Passenger</th>
                              <th scope="col">Pickup Location</th>
                              <th scope="col">Destination</th>
                              <th scope="col">Date & Time</th>
                              <th scope="col">Distance</th>
                              <th scope="col">Fare</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trips.length > 0 ? (
                              trips.map((trip, index) => {
                                const getStatusBadge = (status) => {
                                  const statusClasses = {
                                    pending: 'bg-warning',
                                    accepted: 'bg-success', 
                                    confirmed: 'bg-primary',
                                    in_progress: 'bg-info',
                                    completed: 'bg-success',
                                    cancelled: 'bg-danger'
                                  };
                                  return statusClasses[status] || 'bg-secondary';
                                };
                                
                                const getActionButtons = (trip) => {
                                  switch(trip.status) {
                                    case 'pending':
                                      return (
                                        <>
                                          <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          <a href="#" className="dropdown-item text-success" onClick={() => handleTripAction(trip.id, 'accept')}>
                                            <i className="la la-check me-2"></i>Accept Trip
                                          </a>
                                          <a href="#" className="dropdown-item text-danger" onClick={() => handleTripAction(trip.id, 'decline')}>
                                            <i className="la la-times me-2"></i>Decline
                                          </a>
                                        </>
                                      );
                                    case 'accepted':
                                      return (
                                        <>
                                          <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          <a href="#" className="dropdown-item text-primary" onClick={() => handleTripAction(trip.id, 'start')}>
                                            <i className="la la-play me-2"></i>Start Trip
                                          </a>
                                          <a href={`tel:${trip.passenger_phone || ''}`} className="dropdown-item">
                                            <i className="la la-phone me-2"></i>Call Passenger
                                          </a>
                                        </>
                                      );
                                    case 'confirmed':
                                      return (
                                        <>
                                          <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          <a href="#" className="dropdown-item">
                                            <i className="la la-map me-2"></i>View Route
                                          </a>
                                          <a href={`tel:${trip.passenger_phone || ''}`} className="dropdown-item">
                                            <i className="la la-phone me-2"></i>Call Passenger
                                          </a>
                                        </>
                                      );
                                    case 'completed':
                                      return (
                                        <>
                                          <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          <a href="#" className="dropdown-item">
                                            <i className="la la-download me-2"></i>Download Receipt
                                          </a>
                                          <a href="#" className="dropdown-item">
                                            <i className="la la-star me-2"></i>View Rating
                                          </a>
                                        </>
                                      );
                                    case 'cancelled':
                                      return (
                                        <>
                                          <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                            <i className="la la-eye me-2"></i>View Details
                                          </a>
                                          <a href="#" className="dropdown-item">
                                            <i className="la la-info-circle me-2"></i>Cancellation Info
                                          </a>
                                        </>
                                      );
                                    default:
                                      return (
                                        <a href={`/driver/dashboard-trip-detail?id=${trip.id}`} className="dropdown-item">
                                          <i className="la la-eye me-2"></i>View Details
                                        </a>
                                      );
                                  }
                                };
                                
                                return (
                                  <tr key={trip.id || index}>
                                    <td><strong>#{trip.id || `TR${String(index + 1).padStart(3, '0')}`}</strong></td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <img src={trip.passenger_image || "/html-folder/images/team8.jpg"} alt="passenger" className="avatar avatar-sm me-2" />
                                        <div>
                                          <span className="font-weight-bold">{trip.passenger_name || trip.customer_name || 'N/A'}</span>
                                          <br />
                                          <small className="text-muted">{trip.passenger_phone || 'No phone'}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <strong>{trip.pickup_location || 'N/A'}</strong>
                                        <br />
                                        <small className="text-muted">{trip.pickup_address || trip.pickup_location || ''}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <strong>{trip.dropoff_location || trip.destination || 'N/A'}</strong>
                                        <br />
                                        <small className="text-muted">{trip.dropoff_address || trip.destination || ''}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <strong>{trip.pickup_time ? new Date(trip.pickup_date + ' ' + trip.pickup_time).toLocaleString() : new Date(trip.pickup_date || trip.created_at).toLocaleString()}</strong>
                                        <br />
                                        <small className="text-muted">{new Date(trip.pickup_date || trip.created_at).toLocaleDateString()}</small>
                                      </div>
                                    </td>
                                    <td>{trip.distance ? `${trip.distance} miles` : 'N/A'}</td>
                                    <td><strong>${(trip.total_amount || trip.fare || 0).toFixed(2)}</strong></td>
                                    <td>
                                      <span className={`badge ${getStatusBadge(trip.status)} text-white`}>
                                        {trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1).replace('_', ' ') : 'N/A'}
                                      </span>
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
                                          {getActionButtons(trip)}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="9" className="text-center py-4">
                                  <i className="la la-road" style={{fontSize: '48px', color: '#ccc'}}></i>
                                  <p className="text-muted mt-2">No trips found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </>
  );
}
