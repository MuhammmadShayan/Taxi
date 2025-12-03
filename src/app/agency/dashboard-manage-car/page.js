'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AgencyManageCarPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/agency/vehicles', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await fetch(`/api/agency/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setVehicles(prev => 
          prev.map(vehicle => 
            vehicle.vehicle_id === vehicleId 
              ? { ...vehicle, status: newStatus }
              : vehicle
          )
        );
        alert('Vehicle status updated successfully!');
      } else {
        alert('Failed to update vehicle status');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      alert('Error updating vehicle status');
    }
  };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleEditVehicle = (vehicleId) => {
    // Navigate to edit page - you can create this page later
    window.location.href = `/agency/dashboard-edit-car/${vehicleId}`;
  };

  const handleDeleteVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicle) return;
    
    try {
      const response = await fetch(`/api/agency/vehicles/${selectedVehicle.vehicle_id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setVehicles(prev => prev.filter(v => v.vehicle_id !== selectedVehicle.vehicle_id));
        setShowDeleteModal(false);
        setSelectedVehicle(null);
        alert('Vehicle deleted successfully!');
      } else {
        alert('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error deleting vehicle');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      available: 'bg-success',
      rented: 'bg-primary',
      maintenance: 'bg-warning',
      inactive: 'bg-secondary'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    filterStatus === 'all' || vehicle.status === filterStatus
  );

  if (loading) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicles...</p>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout pageTitle="Vehicle Fleet Management">
        <div className="row">
          <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h3 className="title">Vehicle Fleet Management</h3>
                        <p className="subtitle">Monitor availability, pricing, and vehicle status</p>
                      </div>
                      <div>
                        <Link href="/agency/dashboard-add-car" className="btn btn-primary">
                          <i className="la la-plus me-2"></i>Add New Vehicle
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Filters */}
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
                            <option value="all">All Vehicles</option>
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-9">
                        <div className="d-flex align-items-end h-100">
                          <div className="vehicle-stats">
                            <span className="me-4">
                              <strong>Total:</strong> {vehicles.length}
                            </span>
                            <span className="me-4">
                              <strong>Available:</strong> {vehicles.filter(v => v.status === 'available').length}
                            </span>
                            <span className="me-4">
                              <strong>Rented:</strong> {vehicles.filter(v => v.status === 'rented').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicles Table */}
                    {filteredVehicles.length === 0 ? (
                      <div className="text-center p-5">
                        <i className="la la-car display-4 text-muted"></i>
                        <h4 className="mt-3">No vehicles found</h4>
                        <p className="text-muted">
                          {filterStatus === 'all' 
                            ? "You haven't added any vehicles yet." 
                            : `No vehicles with status "${filterStatus}"`
                          }
                        </p>
                        <Link href="/agency/dashboard-add-car" className="btn btn-primary">
                          <i className="la la-plus me-2"></i>Add Your First Vehicle
                        </Link>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Vehicle</th>
                              <th>Details</th>
                              <th>Pricing</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredVehicles.map(vehicle => (
                              <tr key={vehicle.vehicle_id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="vehicle-image me-3">
                                      <img 
                                        src={vehicle.first_image || '/html-folder/images/img9.jpg'} 
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="img-thumbnail"
                                        style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px'}}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = '/html-folder/images/img9.jpg';
                                        }}
                                      />
                                    </div>
                                    <div className="vehicle-details">
                                      <h6 className="mb-1">{vehicle.brand} {vehicle.model}</h6>
                                      <small className="text-muted">{vehicle.vehicle_number}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <small className="d-block">Year: {vehicle.year}</small>
                                    <small className="d-block">Type: {vehicle.type.replace('_', ' ')}</small>
                                    <small className="d-block">Fuel: {vehicle.energy}</small>
                                    <small className="d-block">Transmission: {vehicle.gear_type}</small>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>${vehicle.daily_rate}/day</strong>
                                    {vehicle.weekly_rate && (
                                      <small className="d-block text-muted">${vehicle.weekly_rate}/week</small>
                                    )}
                                    {vehicle.monthly_rate && (
                                      <small className="d-block text-muted">${vehicle.monthly_rate}/month</small>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button 
                                      className={`btn btn-sm dropdown-toggle ${
                                        vehicle.status === 'available' ? 'btn-success' :
                                        vehicle.status === 'rented' ? 'btn-primary' :
                                        vehicle.status === 'maintenance' ? 'btn-warning' :
                                        'btn-secondary'
                                      }`}
                                      data-bs-toggle="dropdown"
                                    >
                                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleStatusChange(vehicle.vehicle_id, 'available')}
                                        >
                                          Available
                                        </button>
                                      </li>
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleStatusChange(vehicle.vehicle_id, 'maintenance')}
                                        >
                                          Maintenance
                                        </button>
                                      </li>
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => handleStatusChange(vehicle.vehicle_id, 'inactive')}
                                        >
                                          Inactive
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                                <td>
                                  <div className="btn-group">
                                    <button 
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleEditVehicle(vehicle.vehicle_id)}
                                      title="Edit Vehicle"
                                    >
                                      <i className="la la-edit"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => handleViewVehicle(vehicle)}
                                      title="View Details"
                                    >
                                      <i className="la la-eye"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteVehicle(vehicle)}
                                      title="Delete Vehicle"
                                    >
                                      <i className="la la-trash"></i>
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

        {/* View Vehicle Modal */}
        {showViewModal && selectedVehicle && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="la la-car me-2"></i>
                    {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <img 
                        src={selectedVehicle.first_image || '/html-folder/images/img9.jpg'}
                        alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-6 mb-3">
                          <strong>Vehicle Number:</strong>
                          <p className="mb-0">{selectedVehicle.vehicle_number}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Status:</strong>
                          <p className="mb-0">{getStatusBadge(selectedVehicle.status)}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Type:</strong>
                          <p className="mb-0">{selectedVehicle.type.replace('_', ' ')}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Year:</strong>
                          <p className="mb-0">{selectedVehicle.year}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Fuel Type:</strong>
                          <p className="mb-0">{selectedVehicle.energy}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Transmission:</strong>
                          <p className="mb-0">{selectedVehicle.gear_type}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Doors:</strong>
                          <p className="mb-0">{selectedVehicle.doors}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <strong>Seats:</strong>
                          <p className="mb-0">{selectedVehicle.seats}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <h6 className="mb-3">Pricing</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <strong>Daily Rate:</strong> ${selectedVehicle.daily_rate}
                    </div>
                    {selectedVehicle.weekly_rate && (
                      <div className="col-md-4 mb-2">
                        <strong>Weekly Rate:</strong> ${selectedVehicle.weekly_rate}
                      </div>
                    )}
                    {selectedVehicle.monthly_rate && (
                      <div className="col-md-4 mb-2">
                        <strong>Monthly Rate:</strong> ${selectedVehicle.monthly_rate}
                      </div>
                    )}
                  </div>
                  <hr />
                  <h6 className="mb-3">Features</h6>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <i className={`la ${selectedVehicle.air_conditioning ? 'la-check-circle text-success' : 'la-times-circle text-muted'} me-2`}></i>
                      Air Conditioning
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className={`la ${selectedVehicle.airbags ? 'la-check-circle text-success' : 'la-times-circle text-muted'} me-2`}></i>
                      Airbags
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className={`la ${selectedVehicle.navigation_system ? 'la-check-circle text-success' : 'la-times-circle text-muted'} me-2`}></i>
                      GPS Navigation
                    </div>
                    <div className="col-md-6 mb-2">
                      <i className={`la ${selectedVehicle.bluetooth ? 'la-check-circle text-success' : 'la-times-circle text-muted'} me-2`}></i>
                      Bluetooth
                    </div>
                  </div>
                  {selectedVehicle.description && (
                    <>
                      <hr />
                      <h6 className="mb-2">Description</h6>
                      <p>{selectedVehicle.description}</p>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedVehicle && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="la la-exclamation-triangle text-warning me-2"></i>
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this vehicle?</p>
                  <div className="alert alert-warning">
                    <strong>{selectedVehicle.brand} {selectedVehicle.model}</strong>
                    <br />
                    <small>Vehicle Number: {selectedVehicle.vehicle_number}</small>
                  </div>
                  <p className="text-muted">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                  >
                    <i className="la la-trash me-2"></i>Delete Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AgencyLayout>
    </AuthProvider>
  );
}

