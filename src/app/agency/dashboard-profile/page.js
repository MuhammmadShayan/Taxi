'use client';

import React, { useState, useEffect } from 'react';
import AgencyLayout from '@/components/AgencyLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AgencyProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    contact_name: '',
    business_phone: '',
    business_email: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_country: '',
    business_postal_code: '',
    license_number: '',
    tax_id: ''
  });
  
  const [personalData, setPersonalData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAgencyProfile();
      setPersonalData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        postal_code: user.postal_code || ''
      });
    }
  }, [user]);

  const fetchAgencyProfile = async () => {
    try {
      const response = await fetch('/api/agency/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.agency) {
          setFormData(data.agency);
        }
      }
    } catch (error) {
      console.error('Error fetching agency profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/agency/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          agency: formData,
          personal: personalData
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to update profile'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAgencyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
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
            <p className="mt-3">Loading profile...</p>
          </div>
        </AgencyLayout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AgencyLayout pageTitle="Business Profile">
        <div className="row">
          <div className="col-lg-12">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Business Profile & Contact Information</h3>
                    <p className="subtitle">Update agency details, business info, and contact settings</p>
                  </div>
                  
                  <div className="form-content">
                    <form onSubmit={handleSubmit}>
                      {/* Personal Information */}
                      <div className="row">
                        <div className="col-lg-12">
                          <h4 className="mb-3">Personal Information</h4>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">First Name*</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="first_name"
                                value={personalData.first_name}
                                onChange={handlePersonalChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Last Name*</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="last_name"
                                value={personalData.last_name}
                                onChange={handlePersonalChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Email*</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={personalData.email}
                                onChange={handlePersonalChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Phone</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="tel"
                                name="phone"
                                value={personalData.phone}
                                onChange={handlePersonalChange}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Business Information */}
                        <div className="col-lg-12">
                          <hr className="my-4" />
                          <h4 className="mb-3">Business Information</h4>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Business Name*</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleAgencyChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Contact Name</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Business Phone</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="tel"
                                name="business_phone"
                                value={formData.business_phone}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Business Email</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="email"
                                name="business_email"
                                value={formData.business_email}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Business Description</label>
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleAgencyChange}
                                rows="4"
                                placeholder="Describe your rental business..."
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Business Address</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="business_address"
                                value={formData.business_address}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-4">
                          <div className="input-box">
                            <label className="label-text">City</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="business_city"
                                value={formData.business_city}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-4">
                          <div className="input-box">
                            <label className="label-text">State/Province</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="business_state"
                                value={formData.business_state}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-4">
                          <div className="input-box">
                            <label className="label-text">Postal Code</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="business_postal_code"
                                value={formData.business_postal_code}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">License Number</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Tax ID</label>
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleAgencyChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-12">
                          <div className="btn-box">
                            <button 
                              type="submit" 
                              className="btn btn-primary"
                              disabled={saving}
                            >
                              {saving ? 'Saving...' : 'Save Profile'}
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

