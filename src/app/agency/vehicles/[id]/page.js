"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AgencyLayout from '@/components/AgencyLayout';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

function EditVehicleContent() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({ status: 'available', daily_rate: '', weekly_rate: '', monthly_rate: '', description: '', price_low: '', price_high: '', price_holiday: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const id = params?.id;

  const fetchVehicle = async () => {
    try {
      setError('');
      const res = await fetch(`/api/agency/vehicles/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load vehicle');
      setVehicle(data.vehicle);
      setForm({
        status: data.vehicle.status || 'available',
        daily_rate: data.vehicle.daily_rate || '',
        weekly_rate: data.vehicle.weekly_rate || '',
        monthly_rate: data.vehicle.monthly_rate || '',
        description: data.vehicle.description || '',
        price_low: data.vehicle.price_low || '',
        price_high: data.vehicle.price_high || '',
        price_holiday: data.vehicle.price_holiday || ''
      });
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { if (id) fetchVehicle(); }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/agency/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save changes');
      router.push('/agency/vehicles');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AgencyLayout pageTitle={vehicle ? `Edit ${vehicle.vehicle_display_name}` : 'Edit Vehicle'} breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Agency', href: '/agency/dashboard' }, { label: 'Vehicles', href: '/agency/vehicles' }, { label: vehicle ? vehicle.vehicle_display_name : 'Edit' }] }>
      <div className="dashboard-main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Vehicle Details</h3>
                </div>
                <div className="form-content">
                  {(!vehicle && !error) ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">
                      <i className="la la-exclamation-triangle me-2"></i>{error}
                    </div>
                  ) : (
                    <form onSubmit={onSave}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <select name="status" className="form-control" value={form.status} onChange={onChange}>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Daily Rate</label>
                          <input name="daily_rate" type="number" step="0.01" className="form-control" value={form.daily_rate} onChange={onChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Weekly Rate</label>
                          <input name="weekly_rate" type="number" step="0.01" className="form-control" value={form.weekly_rate} onChange={onChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Monthly Rate</label>
                          <input name="monthly_rate" type="number" step="0.01" className="form-control" value={form.monthly_rate} onChange={onChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Base Price (Low)</label>
                          <input name="price_low" type="number" step="0.01" className="form-control" value={form.price_low} onChange={onChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">High Season</label>
                          <input name="price_high" type="number" step="0.01" className="form-control" value={form.price_high} onChange={onChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Holiday Price</label>
                          <input name="price_holiday" type="number" step="0.01" className="form-control" value={form.price_holiday} onChange={onChange} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Description</label>
                          <textarea name="description" rows={4} className="form-control" value={form.description} onChange={onChange} placeholder="Describe your vehicle"></textarea>
                        </div>
                        <div className="col-12">
                          <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="submit" disabled={saving}>
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => router.push('/agency/vehicles')}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              {vehicle && (
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Preview</h3>
                  </div>
                  <div className="form-content">
                    <div className="d-flex align-items-center">
                      <img src={(vehicle.images && vehicle.images[0]) || '/images/cars/default-car.svg'} alt="preview" style={{ width: 100, height: 70, objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/cars/default-car.svg'; }} />
                      <div className="ms-3">
                        <div className="fw-bold">{vehicle.vehicle_display_name}</div>
                        <small className="text-muted">{vehicle.year}</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
}

export default function AgencyVehicleEditPage() {
  return (
    <AuthProvider>
      <EditVehicleContent />
    </AuthProvider>
  );
}
