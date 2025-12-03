'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencyEditCarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    type: 'small_car',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    energy: 'petrol',
    gear_type: 'manual',
    doors: 4,
    seats: 5,
    air_conditioning: true,
    airbags: true,
    navigation_system: false,
    bluetooth: false,
    wifi: false,
    daily_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    deposit_amount: 200,
    mileage_limit: 200,
    extra_mileage_cost: 0.15,
    description: '',
    status: 'available'
  });

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
    }
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agency/vehicles/${id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.vehicle) {
          setVehicle(data.vehicle);
          setFormData({
            vehicle_number: data.vehicle.vehicle_number || '',
            type: data.vehicle.type || 'small_car',
            brand: data.vehicle.brand || '',
            model: data.vehicle.model || '',
            year: data.vehicle.year || new Date().getFullYear(),
            energy: data.vehicle.energy || 'petrol',
            gear_type: data.vehicle.gear_type || 'manual',
            doors: data.vehicle.doors || 4,
            seats: data.vehicle.seats || 5,
            air_conditioning: Boolean(data.vehicle.air_conditioning),
            airbags: Boolean(data.vehicle.airbags),
            navigation_system: Boolean(data.vehicle.navigation_system),
            bluetooth: Boolean(data.vehicle.bluetooth),
            wifi: Boolean(data.vehicle.wifi),
            daily_rate: data.vehicle.daily_rate || '',
            weekly_rate: data.vehicle.weekly_rate || '',
            monthly_rate: data.vehicle.monthly_rate || '',
            deposit_amount: data.vehicle.deposit_amount || 200,
            mileage_limit: data.vehicle.mileage_limit || 200,
            extra_mileage_cost: data.vehicle.extra_mileage_cost || 0.15,
            description: data.vehicle.description || '',
            status: data.vehicle.status || 'available'
          });
        }
      } else {
        alert('Failed to load vehicle details');
        router.push('/agency/dashboard-manage-car');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      alert('Error loading vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`/api/agency/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Vehicle updated successfully!');
        router.push('/agency/dashboard-manage-car');
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || 'Failed to update vehicle'));
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Error updating vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicle details...</p>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  if (!vehicle) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="text-center p-5">
            <i className="la la-exclamation-triangle display-1 text-warning"></i>
            <h4 className="mt-3">Vehicle not found</h4>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => router.push('/agency/dashboard-manage-car')}
            >
              Back to Manage Vehicles
            </button>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout>
        <div className="dashboard-main-content" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', padding: '20px'}}>
          <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="mb-1" style={{color: '#2c3e50', fontWeight: '700'}}>
                      <i className="fas fa-edit me-2" style={{color: '#3498db'}}></i>
                      Edit Vehicle
                    </h2>
                    <p className="text-muted mb-0">{vehicle.brand} {vehicle.model} - {vehicle.vehicle_number}</p>
                  </div>
                  <div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => router.push('/agency/dashboard-manage-car')}
                    >
                      <i className="la la-arrow-left me-2"></i>Back
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Vehicle Image */}
                {vehicle.images && vehicle.images.length > 0 && (
                  <div className="col-12 mb-4">
                    <div className="card shadow border-0" style={{borderRadius: '20px'}}>
                      <div className="card-body p-4 text-center">
                        <img 
                          src={vehicle.images[0] || '/html-folder/images/img9.jpg'}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="img-fluid rounded"
                          style={{maxHeight: '300px', objectFit: 'cover'}}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="col-lg-6 mb-4">
                  <div className="card h-100 shadow border-0" style={{borderRadius: '20px'}}>
                    <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '20px 20px 0 0'}}>
                      <h5 className="text-white mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Basic Information
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Vehicle Number *</label>
                        <input
                          className="form-control form-control-lg"
                          style={{borderRadius: '12px'}}
                          type="text"
                          name="vehicle_number"
                          value={formData.vehicle_number}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Brand</label>
                        <input
                          className="form-control form-control-lg"
                          style={{borderRadius: '12px', background: '#f8f9fa'}}
                          type="text"
                          value={formData.brand}
                          readOnly
                        />
                      </div>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold">Model</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            type="text"
                            value={formData.model}
                            readOnly
                          />
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold">Year</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            type="number"
                            value={formData.year}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-0">
                        <label className="form-label fw-bold">Status *</label>
                        <select
                          className="form-select form-select-lg"
                          style={{borderRadius: '12px'}}
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="available">Available</option>
                          <option value="rented">Rented</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="col-lg-6 mb-4">
                  <div className="card h-100 shadow border-0" style={{borderRadius: '20px'}}>
                    <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '20px 20px 0 0'}}>
                      <h5 className="text-dark mb-0">
                        <i className="fas fa-cogs me-2"></i>
                        Specifications
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label fw-bold">Energy Type</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            value={formData.energy}
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-bold">Transmission</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            value={formData.gear_type}
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-bold">Doors</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            value={formData.doors}
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-bold">Seats</label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', background: '#f8f9fa'}}
                            value={formData.seats}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="col-lg-12 mb-4">
                  <div className="card shadow border-0" style={{borderRadius: '20px'}}>
                    <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '20px 20px 0 0'}}>
                      <h5 className="text-dark mb-0">
                        <i className="fas fa-star me-2"></i>
                        Vehicle Features
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        {[
                          {key: 'air_conditioning', label: 'Air Conditioning', icon: 'fas fa-snowflake'},
                          {key: 'airbags', label: 'Safety Airbags', icon: 'fas fa-shield-alt'},
                          {key: 'navigation_system', label: 'GPS Navigation', icon: 'fas fa-route'},
                          {key: 'bluetooth', label: 'Bluetooth', icon: 'fab fa-bluetooth'}
                        ].map(feature => (
                          <div key={feature.key} className="col-md-6 col-lg-3">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                id={feature.key}
                                name={feature.key}
                                checked={formData[feature.key]}
                                onChange={handleChange}
                                className="form-check-input"
                              />
                              <label className="form-check-label" htmlFor={feature.key}>
                                <i className={`${feature.icon} me-2`}></i>
                                {feature.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="col-lg-8 mb-4">
                  <div className="card shadow border-0" style={{borderRadius: '20px'}}>
                    <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)', borderRadius: '20px 20px 0 0'}}>
                      <h5 className="text-dark mb-0">
                        <i className="fas fa-dollar-sign me-2"></i>
                        Pricing Configuration
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Daily Rate *</label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-success text-white">$</span>
                            <input
                              className="form-control form-control-lg"
                              type="number"
                              name="daily_rate"
                              value={formData.daily_rate}
                              onChange={handleChange}
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Weekly Rate</label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-info text-white">$</span>
                            <input
                              className="form-control form-control-lg"
                              type="number"
                              name="weekly_rate"
                              value={formData.weekly_rate}
                              onChange={handleChange}
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Monthly Rate</label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-warning text-white">$</span>
                            <input
                              className="form-control form-control-lg"
                              type="number"
                              name="monthly_rate"
                              value={formData.monthly_rate}
                              onChange={handleChange}
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-lg-4 mb-4">
                  <div className="card h-100 shadow border-0" style={{borderRadius: '20px'}}>
                    <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', borderRadius: '20px 20px 0 0'}}>
                      <h5 className="text-dark mb-0">
                        <i className="fas fa-edit me-2"></i>
                        Description
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <textarea
                        className="form-control form-control-lg"
                        style={{borderRadius: '12px', resize: 'none', height: '150px'}}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add special notes about this vehicle..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="col-12">
                  <div className="card shadow-lg border-0" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h5 className="text-white mb-2">
                            <i className="fas fa-save me-2"></i>
                            Ready to Update?
                          </h5>
                          <p className="text-white-50 mb-0">Review all changes and click "Update Vehicle" to save</p>
                        </div>
                        <div className="col-md-4 text-end">
                          <button
                            type="submit"
                            className="btn btn-light btn-lg px-5"
                            style={{borderRadius: '25px', fontWeight: '600'}}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check me-2"></i>Update Vehicle
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </AgencyLayout>
    </AuthProvider>
  );
}
