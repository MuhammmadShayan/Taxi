'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AgencySettingsPage() {
  const [settings, setSettings] = useState({
    default_commission: 15,
    booking_cancellation_hours: 24,
    min_driver_age: 21,
    max_rental_days: 30,
    notifications: {
      booking: true,
      payment: true,
      review: true,
      system: true
    }
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/agency/settings', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/agency/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings updated successfully!');
      } else {
        const err = await response.json();
        alert('Error: ' + (err.error || 'Failed to update settings'));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const key = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <AuthProvider>
        <AgencyLayout>
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-content text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading settings...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout pageTitle="Preferences & Configuration">
        <div className="row">
          <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Preferences & Configuration</h3>
                    <p className="subtitle">Manage rental policies, commissions, and notification settings</p>
                  </div>

                  <div className="form-content">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Default Commission (%)</label>
                            <div className="form-group">
                              <input
                                type="number"
                                className="form-control"
                                name="default_commission"
                                value={settings.default_commission}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.5"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Cancellation Window (hours)</label>
                            <div className="form-group">
                              <input
                                type="number"
                                className="form-control"
                                name="booking_cancellation_hours"
                                value={settings.booking_cancellation_hours}
                                onChange={handleChange}
                                min="0"
                                max="168"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Minimum Driver Age</label>
                            <div className="form-group">
                              <input
                                type="number"
                                className="form-control"
                                name="min_driver_age"
                                value={settings.min_driver_age}
                                onChange={handleChange}
                                min="18"
                                max="80"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Max Rental Days</label>
                            <div className="form-group">
                              <input
                                type="number"
                                className="form-control"
                                name="max_rental_days"
                                value={settings.max_rental_days}
                                onChange={handleChange}
                                min="1"
                                max="90"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <hr className="my-4" />
                          <h4 className="mb-3">Notifications</h4>
                        </div>

                        <div className="col-lg-3">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              id="notif_booking"
                              name="notifications.booking"
                              checked={settings.notifications.booking}
                              onChange={handleChange}
                            />
                            <label htmlFor="notif_booking">Booking Notifications</label>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              id="notif_payment"
                              name="notifications.payment"
                              checked={settings.notifications.payment}
                              onChange={handleChange}
                            />
                            <label htmlFor="notif_payment">Payment Notifications</label>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              id="notif_review"
                              name="notifications.review"
                              checked={settings.notifications.review}
                              onChange={handleChange}
                            />
                            <label htmlFor="notif_review">Review Notifications</label>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              id="notif_system"
                              name="notifications.system"
                              checked={settings.notifications.system}
                              onChange={handleChange}
                            />
                            <label htmlFor="notif_system">System Notifications</label>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="btn-box">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                              {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                            <button type="button" className="btn btn-outline-secondary ms-2">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
      </AgencyLayout>
    </AuthProvider>
  );
}

