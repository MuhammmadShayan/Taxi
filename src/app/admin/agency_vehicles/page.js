'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminAgencyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAgency, setFilterAgency] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAgencyVehicles();
    fetchAgencies();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAgencyVehicles();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, filterStatus, filterAgency, page]);

  const fetchAgencyVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        agency_id: filterAgency,
        page: String(page),
        limit: '20'
      });
      
      const response = await fetch(`/api/admin/agency_vehicles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch agency vehicles');
      const data = await response.json();
      
      setVehicles(data.vehicles || []);
      setStatistics(data.statistics || {});
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching agency vehicles:', err);
      setError('Failed to load agency vehicles from database');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterType, filterStatus, filterAgency]);

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/admin/agencies');
      if (!response.ok) throw new Error('Failed to fetch agencies');
      const data = await response.json();
      setAgencies(data.agencies || []);
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setAgencies([]);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/agency_vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setVehicles(vehicles.map(vehicle => 
        vehicle.vehicle_id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
      ));
      
      // Show success message
      alert(`Vehicle status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating vehicle status:', err);
      alert('Failed to update vehicle status. Please try again.');
    }
  };

  // Delete vehicle function
  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/agency_vehicles/${vehicleId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
      
      // Remove from local state
      setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== vehicleId));
      alert('Vehicle deleted successfully!');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle. Please try again.');
    }
  };

  // Assign vehicle to booking
  const handleAssignToBooking = (vehicleId) => {
    // Navigate to assign vehicle page or open modal
    window.location.href = `/admin/bookings/assign?vehicle_id=${vehicleId}`;
  };

  // Send maintenance reminder
  const handleMaintenanceReminder = async (vehicleId) => {
    try {
      const response = await fetch(`/api/admin/agency_vehicles/${vehicleId}/maintenance-reminder`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Maintenance reminder sent to agency successfully!');
      } else {
        alert('Failed to send maintenance reminder');
      }
    } catch (err) {
      console.error('Error sending maintenance reminder:', err);
      alert('Failed to send maintenance reminder');
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'luxury': return 'bg-warning';
      case 'suv': return 'bg-success';
      case 'sedan': return 'bg-primary';
      case 'small_car': return 'bg-info';
      case 'van': return 'bg-secondary';
      case 'truck': return 'bg-dark';
      case 'transporter': return 'bg-secondary';
      case 'motorcycle': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'rented': return 'bg-info';
      case 'maintenance': return 'bg-warning';
      case 'inactive': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Agency Vehicles' }
  ];

  return (
    <AdminLayout
      pageTitle="Agency Vehicles Management"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-primary">{statistics.filtered_total || vehicles.length}</h5>
                  <p className="card-text">Total Agency Vehicles</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-success">{statistics.available_count || 0}</h5>
                  <p className="card-text">Available</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-info">{statistics.rented_count || 0}</h5>
                  <p className="card-text">Currently Rented</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-warning">${statistics.avg_daily_rate || '0.00'}</h5>
                  <p className="card-text">Avg Daily Rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">Agency Vehicles ({vehicles.length})</h3>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="small_car">Small Car</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="transporter">Transporter</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                  <select 
                    className="form-select form-select-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select 
                    className="form-select form-select-sm"
                    value={filterAgency}
                    onChange={(e) => setFilterAgency(e.target.value)}
                  >
                    <option value="all">All Agencies</option>
                    {agencies.map(agency => (
                      <option key={agency.agency_id} value={agency.agency_id}>
                        {agency.business_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-content">
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search vehicles by brand, model, or vehicle number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <button className="btn btn-primary btn-sm me-2" onClick={fetchAgencyVehicles}>
                      <i className="la la-refresh me-1"></i>Refresh
                    </button>
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => window.location.href = '/admin/vehicles/add'}
                    >
                      <i className="la la-plus me-1"></i>Add Vehicle
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  <i className="la la-exclamation-triangle me-2"></i>
                  {error}. Please check your database connection.
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
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Agency</th>
                        <th>Specs</th>
                        <th>Pricing</th>
                        <th>Status</th>
                        <th>Performance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                          <tr key={vehicle.vehicle_id}>
                            <td>#{vehicle.vehicle_id}</td>
                            <td>
                              <div>
                                <h6 className="mb-0">{vehicle.brand} {vehicle.model}</h6>
                                <small className="text-muted">{vehicle.year} • {vehicle.vehicle_number}</small>
                                {vehicle.is_new && <span className="badge bg-success ms-1">NEW</span>}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${getTypeBadgeClass(vehicle.type)}`}>
                                {vehicle.vehicle_type_display}
                              </span>
                            </td>
                            <td>
                              <div>
                                <strong className="text-primary">{vehicle.agency_name}</strong>
                                <small className="text-muted d-block">{vehicle.agency_owner_full_name}</small>
                              </div>
                            </td>
                            <td>
                              <div className="vehicle-specs">
                                <small className="d-block">{vehicle.energy?.toUpperCase()} • {vehicle.gear_type?.toUpperCase()}</small>
                                <small className="text-muted">{vehicle.seats} seats • {vehicle.doors} doors</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong className="text-success d-block">${vehicle.daily_rate}/day</strong>
                                {vehicle.weekly_rate && <small className="text-muted">${vehicle.weekly_rate}/week</small>}
                              </div>
                            </td>
                            <td>
                              <select
                                className={`form-select form-select-sm badge ${getStatusBadgeClass(vehicle.status)}`}
                                value={vehicle.status}
                                onChange={(e) => handleStatusChange(vehicle.vehicle_id, e.target.value)}
                                style={{ border: 'none', color: 'white', minWidth: '100px' }}
                              >
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                            <td>
                              <div>
                                <small className="text-success d-block">
                                  <i className="la la-star"></i> {vehicle.total_bookings || 0} bookings
                                </small>
                                {vehicle.utilization_rate !== undefined && (
                                  <small className="text-info">
                                    {vehicle.utilization_rate}% completion rate
                                  </small>
                                )}
                                {vehicle.total_revenue > 0 && (
                                  <small className="text-warning d-block">
                                    ${vehicle.total_revenue} revenue
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  title="View Details"
                                  onClick={() => window.location.href = `/admin/vehicles/${vehicle.vehicle_id}`}
                                >
                                  <i className="la la-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-secondary btn-sm"
                                  title="Edit Vehicle"
                                  onClick={() => window.location.href = `/admin/vehicles/${vehicle.vehicle_id}/edit`}
                                >
                                  <i className="la la-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-info btn-sm"
                                  title="View Bookings"
                                  onClick={() => window.location.href = `/admin/bookings?vehicle_id=${vehicle.vehicle_id}`}
                                >
                                  <i className="la la-calendar"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  title="View History"
                                  onClick={() => window.location.href = `/admin/vehicles/${vehicle.vehicle_id}/history`}
                                >
                                  <i className="la la-history"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-warning btn-sm"
                                  title="Assign to Booking"
                                  onClick={() => handleAssignToBooking(vehicle.vehicle_id)}
                                >
                                  <i className="la la-plus"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-info btn-sm"
                                  title="Maintenance Reminder"
                                  onClick={() => handleMaintenanceReminder(vehicle.vehicle_id)}
                                >
                                  <i className="la la-wrench"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Vehicle"
                                  onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}
                                >
                                  <i className="la la-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <i className="la la-car" style={{fontSize: '48px', color: '#ccc'}}></i>
                            <p className="text-muted mt-2">No agency vehicles found</p>
                            <p className="text-muted">Agencies haven't added any vehicles from the catalog yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">Page {page} of {totalPages}</small>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
