'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencyAddCarPage() {
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
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
    category_id: 1
  });

  const selectedFromCatalog = useMemo(
    () => catalog.find(v => String(v.id) === String(selectedVehicleId)),
    [catalog, selectedVehicleId]
  );

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        const res = await fetch('/api/vehicles/catalog?limit=100', { credentials: 'include' });
        const data = await res.json();
        if (isMounted) {
          setCatalog(Array.isArray(data?.results) ? data.results : []);
        }
      } catch (e) {
        console.error('Failed to load vehicles catalog', e);
      } finally {
        if (isMounted) setCatalogLoading(false);
      }
    }
    loadCatalog();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // When a vehicle is selected from catalog, prefill brand/model/year and default daily_rate
    if (selectedFromCatalog) {
      setFormData(prev => ({
        ...prev,
        brand: selectedFromCatalog.make || '',
        model: selectedFromCatalog.model || '',
        year: selectedFromCatalog.year || new Date().getFullYear(),
        daily_rate: prev.daily_rate || selectedFromCatalog.daily_rate || selectedFromCatalog.price_usd || '',
      }));
    }
  }, [selectedFromCatalog]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      alert('Please select a vehicle from the catalog.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      // Ensure required fields are present for API
      if (!payload.brand && selectedFromCatalog?.make) payload.brand = selectedFromCatalog.make;
      if (!payload.model && selectedFromCatalog?.model) payload.model = selectedFromCatalog.model;
      if (!payload.year && selectedFromCatalog?.year) payload.year = selectedFromCatalog.year;
      if (!payload.daily_rate && (selectedFromCatalog?.daily_rate || selectedFromCatalog?.price_usd)) {
        payload.daily_rate = selectedFromCatalog.daily_rate || selectedFromCatalog.price_usd;
      }
      // Include catalog vehicle ID for image retrieval
      if (selectedVehicleId) {
        payload.catalog_vehicle_id = selectedVehicleId;
      }

      const response = await fetch('/api/agency/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Vehicle added successfully!');
        // Reset selection and form
        setSelectedVehicleId('');
        setFormData({
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
          category_id: 1
        });
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to add vehicle'));
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error adding vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
                      <i className="fas fa-plus-circle me-2" style={{color: '#3498db'}}></i>
                      Add New Vehicle
                    </h2>
                    <p className="text-muted mb-0">Expand your fleet by selecting from our premium vehicle catalog</p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-info fs-6 px-3 py-2">Step 1 of 3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="progress" style={{height: '8px', borderRadius: '10px'}}>
                  <div className="progress-bar bg-gradient" style={{width: selectedVehicleId ? (formData.vehicle_number ? '100%' : '66%') : '33%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'}}></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className={`fw-bold ${selectedVehicleId ? 'text-primary' : 'text-muted'}`}>Select Vehicle</small>
                  <small className={`fw-bold ${formData.vehicle_number ? 'text-primary' : 'text-muted'}`}>Vehicle Details</small>
                  <small className={`fw-bold ${formData.daily_rate ? 'text-primary' : 'text-muted'}`}>Pricing & Submit</small>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Vehicle Selection Card */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card shadow-lg border-0" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h4 className="text-white mb-3">
                            <i className="fas fa-car me-2"></i>
                            Choose Your Vehicle
                          </h4>
                          <div className="position-relative">
                            <select
                              className="form-select form-select-lg"
                              style={{
                                borderRadius: '15px',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                fontSize: '16px',
                                padding: '15px 20px'
                              }}
                              value={selectedVehicleId}
                              onChange={(e) => setSelectedVehicleId(e.target.value)}
                              required
                              disabled={catalogLoading}
                            >
                              <option value="">
                                {catalogLoading ? '🔄 Loading vehicles...' : '🚗 Select a vehicle from catalog'}
                              </option>
                              {catalog.map(v => (
                                <option key={v.id} value={v.id}>
                                  🚙 {`${v.make || 'Unknown'} ${v.model || ''} ${v.year ? '(' + v.year + ')' : ''}`}
                                </option>
                              ))}
                            </select>
                            <i className="fas fa-chevron-down position-absolute" style={{right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
                          </div>
                        </div>
                        <div className="col-md-4 text-center">
                          <div className="text-white">
                            <i className="fas fa-database fa-3x mb-2 opacity-50"></i>
                            <p className="mb-0 small">Premium Vehicle Catalog</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Vehicle Preview */}
              {selectedFromCatalog && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card shadow-lg border-0" style={{borderRadius: '20px', transform: 'translateY(-10px)'}}>
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <div className="position-relative">
                              {Array.isArray(selectedFromCatalog.images) && selectedFromCatalog.images[0] ? (
                                <img 
                                  src={selectedFromCatalog.images[0]} 
                                  alt="Selected Vehicle" 
                                  className="img-fluid"
                                  style={{
                                    borderRadius: '15px',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    maxHeight: '200px',
                                    width: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <div 
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    borderRadius: '15px',
                                    color: 'white'
                                  }}
                                >
                                  <i className="fas fa-car fa-4x"></i>
                                </div>
                              )}
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-success fs-6 px-3 py-2">✓ Selected</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="ps-4">
                              <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>
                                {selectedFromCatalog.make} {selectedFromCatalog.model}
                                <span className="badge bg-primary ms-2">{selectedFromCatalog.year}</span>
                              </h3>
                              <div className="row g-3 mb-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center p-3 rounded" style={{background: '#e3f2fd'}}>
                                    <i className="fas fa-dollar-sign text-primary me-2"></i>
                                    <div>
                                      <div className="fw-bold">Suggested Rate</div>
                                      <div className="text-muted">${selectedFromCatalog.daily_rate || selectedFromCatalog.price_usd || 'N/A'}/day</div>
                                    </div>
                                  </div>
                                </div>
                                {selectedFromCatalog.location && (
                                  <div className="col-6">
                                    <div className="d-flex align-items-center p-3 rounded" style={{background: '#f3e5f5'}}>
                                      <i className="fas fa-map-marker-alt text-purple me-2"></i>
                                      <div>
                                        <div className="fw-bold">Location</div>
                                        <div className="text-muted">{selectedFromCatalog.location}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-muted">
                                <i className="fas fa-info-circle me-1"></i>
                                Complete the form below to add this vehicle to your fleet
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Sections */}
              {selectedVehicleId && (
                <div className="row">
                  {/* Agency Details */}
                  <div className="col-lg-6 mb-4">
                    <div className="card h-100 shadow border-0" style={{borderRadius: '20px'}}>
                      <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '20px 20px 0 0'}}>
                        <h5 className="text-white mb-0">
                          <i className="fas fa-id-card me-2"></i>
                          Agency Details
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-4">
                          <label className="form-label fw-bold text-dark mb-2">
                            <i className="fas fa-hashtag me-1 text-primary"></i>
                            Vehicle Registration Number *
                          </label>
                          <input
                            className="form-control form-control-lg"
                            style={{borderRadius: '12px', border: '2px solid #e9ecef', transition: 'all 0.3s'}}
                            type="text"
                            name="vehicle_number"
                            value={formData.vehicle_number}
                            onChange={handleChange}
                            placeholder="e.g., ABC-1234"
                            required
                            onFocus={(e) => e.target.style.borderColor = '#4facfe'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                          />
                        </div>
                        <div className="mb-0">
                          <label className="form-label fw-bold text-dark mb-2">
                            <i className="fas fa-tags me-1 text-warning"></i>
                            Vehicle Category *
                          </label>
                          <select
                            className="form-select form-select-lg"
                            style={{borderRadius: '12px', border: '2px solid #e9ecef'}}
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                          >
                            <option value="small_car">🚗 Small Car</option>
                            <option value="suv">🚙 SUV</option>
                            <option value="luxury">✨ Luxury</option>
                            <option value="van">🚐 Van</option>
                            <option value="truck">🚛 Truck</option>
                            <option value="motorcycle">🏍️ Motorcycle</option>
                            <option value="other">🔧 Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="col-lg-6 mb-4">
                    <div className="card h-100 shadow border-0" style={{borderRadius: '20px'}}>
                      <div className="card-header border-0" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '20px 20px 0 0'}}>
                        <h5 className="text-dark mb-0">
                          <i className="fas fa-info-circle me-2"></i>
                          Vehicle Information
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-bold text-dark mb-2">🏭 Brand</label>
                            <input
                              className="form-control form-control-lg"
                              style={{borderRadius: '12px', background: '#f8f9fa', border: '2px dashed #ced4da'}}
                              type="text"
                              name="brand"
                              value={formData.brand}
                              readOnly
                              placeholder="Auto-filled from catalog"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold text-dark mb-2">🚗 Model</label>
                            <input
                              className="form-control form-control-lg"
                              style={{borderRadius: '12px', background: '#f8f9fa', border: '2px dashed #ced4da'}}
                              type="text"
                              name="model"
                              value={formData.model}
                              readOnly
                              placeholder="Auto-filled"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold text-dark mb-2">📅 Year</label>
                            <input
                              className="form-control form-control-lg"
                              style={{borderRadius: '12px', background: '#f8f9fa', border: '2px dashed #ced4da'}}
                              type="number"
                              name="year"
                              value={formData.year}
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
                          <i className="fas fa-cogs me-2"></i>
                          Vehicle Features & Amenities
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="row g-4">
                          {[
                            {key: 'air_conditioning', label: 'Air Conditioning', icon: 'fas fa-snowflake', color: '#3498db'},
                            {key: 'airbags', label: 'Safety Airbags', icon: 'fas fa-shield-alt', color: '#e74c3c'},
                            {key: 'navigation_system', label: 'GPS Navigation', icon: 'fas fa-route', color: '#27ae60'},
                            {key: 'bluetooth', label: 'Bluetooth Connectivity', icon: 'fab fa-bluetooth', color: '#9b59b6'}
                          ].map(feature => (
                            <div key={feature.key} className="col-md-6 col-lg-3">
                              <div className="form-check form-check-feature h-100">
                                <div 
                                  className={`feature-card p-3 text-center rounded-3 border-2 ${formData[feature.key] ? 'border-success bg-light-success' : 'border-light bg-light'}`}
                                  style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                                  onClick={() => setFormData(prev => ({...prev, [feature.key]: !prev[feature.key]}))}
                                >
                                  <input
                                    type="checkbox"
                                    id={feature.key}
                                    name={feature.key}
                                    checked={formData[feature.key]}
                                    onChange={handleChange}
                                    className="form-check-input d-none"
                                  />
                                  <i className={`${feature.icon} fa-2x mb-2`} style={{color: formData[feature.key] ? feature.color : '#6c757d'}}></i>
                                  <div className={`fw-bold ${formData[feature.key] ? 'text-success' : 'text-muted'}`}>{feature.label}</div>
                                  {formData[feature.key] && <i className="fas fa-check-circle text-success mt-1"></i>}
                                </div>
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
                            <label className="form-label fw-bold text-dark mb-2">
                              <i className="fas fa-calendar-day me-1 text-success"></i>
                              Daily Rate *
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-success text-white" style={{borderRadius: '12px 0 0 12px', border: 'none'}}>$</span>
                              <input
                                className="form-control form-control-lg"
                                style={{borderRadius: '0 12px 12px 0', border: '2px solid #e9ecef', borderLeft: 'none'}}
                                type="number"
                                name="daily_rate"
                                value={formData.daily_rate}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label fw-bold text-dark mb-2">
                              <i className="fas fa-calendar-week me-1 text-info"></i>
                              Weekly Rate
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-info text-white" style={{borderRadius: '12px 0 0 12px', border: 'none'}}>$</span>
                              <input
                                className="form-control form-control-lg"
                                style={{borderRadius: '0 12px 12px 0', border: '2px solid #e9ecef', borderLeft: 'none'}}
                                type="number"
                                name="weekly_rate"
                                value={formData.weekly_rate}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label fw-bold text-dark mb-2">
                              <i className="fas fa-calendar-alt me-1 text-warning"></i>
                              Monthly Rate
                            </label>
                            <div className="input-group input-group-lg">
                              <span className="input-group-text bg-warning text-white" style={{borderRadius: '12px 0 0 12px', border: 'none'}}>$</span>
                              <input
                                className="form-control form-control-lg"
                                style={{borderRadius: '0 12px 12px 0', border: '2px solid #e9ecef', borderLeft: 'none'}}
                                type="number"
                                name="monthly_rate"
                                value={formData.monthly_rate}
                                onChange={handleChange}
                                placeholder="0.00"
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
                          style={{borderRadius: '12px', border: '2px solid #e9ecef', resize: 'none', height: '120px'}}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="✍️ Add special notes about this vehicle..."
                        ></textarea>
                        <small className="text-muted mt-2 d-block">
                          <i className="fas fa-info-circle me-1"></i>
                          Highlight unique features or conditions
                        </small>
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
                              <i className="fas fa-rocket me-2"></i>
                              Ready to Add Vehicle?
                            </h5>
                            <p className="text-white-50 mb-0">Review all details and click "Add Vehicle" to complete the process</p>
                          </div>
                          <div className="col-md-4 text-end">
                            <div className="d-flex gap-3 justify-content-end">
                              <a 
                                href="/agency/dashboard-manage-car" 
                                className="btn btn-outline-light btn-lg px-4"
                                style={{borderRadius: '25px', borderWidth: '2px'}}
                              >
                                <i className="fas fa-times me-2"></i>Cancel
                              </a>
                              <button
                                type="submit"
                                className="btn btn-light btn-lg px-5"
                                style={{borderRadius: '25px', fontWeight: '600', boxShadow: '0 4px 15px rgba(255,255,255,0.3)'}}
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-plus me-2"></i>Add Vehicle
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <style jsx>{`
          .feature-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          .bg-light-success {
            background-color: #d4edda !important;
          }
          .form-control:focus, .form-select:focus {
            box-shadow: 0 0 0 0.25rem rgba(79, 172, 254, 0.25) !important;
            border-color: #4facfe !important;
          }
          .btn:hover {
            transform: translateY(-1px);
          }
          .card {
            transition: all 0.3s ease;
          }
          .card:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </AgencyLayout>
    </AuthProvider>
  );
}
