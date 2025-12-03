"use client";

import React, { useEffect, useMemo, useState } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function AddVehicleContent() {
  const { user, isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [agencyVehicleData, setAgencyVehicleData] = useState({
    category_id: 1,
    type: 'small_car',
    air_conditioning: true,
    airbags: true,
    navigation_system: false,
    bluetooth: false,
    wifi: false,
    price_low: '',
    price_high: '',
    price_holiday: '',
    daily_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    deposit_amount: 200,
    mileage_limit: 200,
    extra_mileage_cost: 0.15,
    description: ''
  });

  useEffect(() => {
    const t = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        params.set('limit', '30');
        const res = await fetch(`/api/vehicles/catalog?${params.toString()}`, { credentials: 'include' });
        const data = await res.json();
        setCatalog(data.success ? (data.results || []) : []);
      } catch (e) {
        setCatalog([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleSelect = (vehicle) => {
    setSelected(vehicle);
    setAgencyVehicleData((prev) => ({
      ...prev,
      daily_rate: vehicle.daily_rate || prev.daily_rate || '',
      price_low: vehicle.daily_rate || vehicle.price_usd || prev.price_low || '',
      price_high: vehicle.daily_rate ? Number(vehicle.daily_rate * 1.3).toFixed(2) : prev.price_high || '',
      price_holiday: vehicle.daily_rate ? Number(vehicle.daily_rate * 1.5).toFixed(2) : prev.price_holiday || '',
      description: `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim()
    }));
  };

  const submitDisabled = useMemo(() => !selected || !agencyVehicleData.daily_rate, [selected, agencyVehicleData.daily_rate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAgencyVehicleData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    
    // Check if user is logged in first
    if (!isLoggedIn() || !user) {
      alert('Please login to continue.');
      window.location.href = '/auth/login';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/agency/vehicles/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ vehicleId: selected.id, agencyVehicleData })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed');
      alert('Vehicle added to your fleet successfully!');
      window.location.href = '/agency/vehicles';
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      alert('Failed to add vehicle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFirstImage = (images) => {
    if (!images) return '/images/cars/default-car.svg';
    if (typeof images === 'string') {
      try {
        const p = JSON.parse(images);
        return Array.isArray(p) ? (p[0] || '/images/cars/default-car.svg') : (p || '/images/cars/default-car.svg');
      } catch {
        return images || '/images/cars/default-car.svg';
      }
    }
    if (Array.isArray(images)) return images[0] || '/images/cars/default-car.svg';
    return '/images/cars/default-car.svg';
  };

  return (
    <AgencyLayout pageTitle="Add Vehicle from Catalog" breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Agency', href: '/agency/dashboard' }, { label: 'Add Vehicle' }]}> 
      <div className="dashboard-main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Select from Vehicles Catalog</h3>
                  <p className="subtitle">Choose a vehicle and set your agency-specific options</p>
                </div>
                <div className="form-content">
                  <div className="row g-4">
                    <div className="col-lg-7">
                      <div className="mb-3">
                        <input className="form-control" placeholder="Search by make, model..." value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                      {isSearching ? (
                        <div className="text-muted">Searching...</div>
                      ) : (
                        <div className="row">
                          {(catalog || []).map((v) => (
                            <div key={v.id} className="col-md-6 mb-3">
                              <div className={`card h-100 ${selected?.id === v.id ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleSelect(v)}>
                                <img src={getFirstImage(v.images)} alt={`${v.make} ${v.model}`} className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/cars/default-car.svg'; }} />
                                <div className="card-body">
                                  <h6 className="mb-1">{v.make} {v.model}</h6>
                                  <small className="text-muted">{v.year}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                          {catalog.length === 0 && (
                            <div className="col-12 text-muted">No vehicles found. Try a different search.</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-5">
                      <form onSubmit={handleSubmit}>
                        <div className="input-box">
                          <label className="label-text">Selected Vehicle</label>
                          <div className="form-group">
                            {selected ? (
                              <div className="d-flex align-items-center">
                                <img src={getFirstImage(selected.images)} alt="selected" style={{ width: 80, height: 60, objectFit: 'cover' }} className="me-2" onError={(e) => { e.currentTarget.src = '/images/cars/default-car.svg'; }} />
                                <div>
                                  <div><strong>{selected.make} {selected.model}</strong></div>
                                  <small className="text-muted">{selected.year}</small>
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted">Please select a vehicle from the left.</div>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Type*</label>
                              <div className="form-group">
                                <select className="form-control" name="type" value={agencyVehicleData.type} onChange={handleChange} required>
                                  <option value="small_car">Small Car</option>
                                  <option value="transporter">Transporter</option>
                                  <option value="suv">SUV</option>
                                  <option value="luxury">Luxury</option>
                                  <option value="motorcycle">Motorcycle</option>
                                  <option value="van">Van</option>
                                  <option value="truck">Truck</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Category</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="category_id" value={agencyVehicleData.category_id} onChange={handleChange} min="1" />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12"><h5 className="mt-3">Pricing</h5></div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Daily Rate*</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="daily_rate" value={agencyVehicleData.daily_rate} onChange={handleChange} step="0.01" required />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Weekly Rate</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="weekly_rate" value={agencyVehicleData.weekly_rate} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Monthly Rate</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="monthly_rate" value={agencyVehicleData.monthly_rate} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Base Price (Low)</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="price_low" value={agencyVehicleData.price_low} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">High Season</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="price_high" value={agencyVehicleData.price_high} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Holiday Price</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="price_holiday" value={agencyVehicleData.price_holiday} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12"><h5 className="mt-3">Features</h5></div>
                          <div className="col-lg-6">
                            <div className="custom-checkbox">
                              <input type="checkbox" id="air_conditioning" name="air_conditioning" checked={agencyVehicleData.air_conditioning} onChange={handleChange} />
                              <label htmlFor="air_conditioning">Air Conditioning</label>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="custom-checkbox">
                              <input type="checkbox" id="airbags" name="airbags" checked={agencyVehicleData.airbags} onChange={handleChange} />
                              <label htmlFor="airbags">Airbags</label>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="custom-checkbox">
                              <input type="checkbox" id="navigation_system" name="navigation_system" checked={agencyVehicleData.navigation_system} onChange={handleChange} />
                              <label htmlFor="navigation_system">GPS Navigation</label>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="custom-checkbox">
                              <input type="checkbox" id="bluetooth" name="bluetooth" checked={agencyVehicleData.bluetooth} onChange={handleChange} />
                              <label htmlFor="bluetooth">Bluetooth</label>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="custom-checkbox">
                              <input type="checkbox" id="wifi" name="wifi" checked={agencyVehicleData.wifi} onChange={handleChange} />
                              <label htmlFor="wifi">WiFi</label>
                            </div>
                          </div>

                          <div className="col-lg-12"><h5 className="mt-3">Other</h5></div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Deposit Amount</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="deposit_amount" value={agencyVehicleData.deposit_amount} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Mileage Limit</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="mileage_limit" value={agencyVehicleData.mileage_limit} onChange={handleChange} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Extra Mileage Cost</label>
                              <div className="form-group">
                                <input className="form-control" type="number" name="extra_mileage_cost" value={agencyVehicleData.extra_mileage_cost} onChange={handleChange} step="0.01" />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Description</label>
                              <div className="form-group">
                                <textarea className="form-control" name="description" value={agencyVehicleData.description} onChange={handleChange} rows="3" placeholder="Describe your vehicle..."></textarea>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="btn-box">
                              <button type="submit" className="btn btn-primary" disabled={loading || submitDisabled}>
                                {loading ? 'Adding...' : 'Add to My Fleet'}
                              </button>
                              <a href="/agency/vehicles" className="btn btn-outline-secondary ms-2">Cancel</a>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
}

export default function AgencyAddVehiclePage() {
  return (
    <AuthProvider>
      <AddVehicleContent />
    </AuthProvider>
  );
}


