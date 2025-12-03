'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '../../../components/CustomerDashboardLayout';
import Link from 'next/link';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        state: user.state || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        return;
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerDashboardLayout pageTitle="My Profile" breadcrumbs={["Profile"]}>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Profile Information</h3>
            </div>
            <div className="form-content">
              <div className="contact-form-action">
                <form onSubmit={handleSubmit}>
                  {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`} role="alert">
                      {message.text}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">First Name</label>
                        <div className="form-group">
                          <span className="la la-user form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="first_name"
                            value={profileData.first_name}
                            onChange={handleInputChange}
                            placeholder="First Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Last Name</label>
                        <div className="form-group">
                          <span className="la la-user form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="last_name"
                            value={profileData.last_name}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Email Address</label>
                        <div className="form-group">
                          <span className="la la-envelope form-icon"></span>
                          <input
                            className="form-control"
                            type="email"
                            value={profileData.email}
                            disabled
                            placeholder="Email Address"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Phone Number</label>
                        <div className="form-group">
                          <span className="la la-phone form-icon"></span>
                          <input
                            className="form-control"
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">City</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Country</label>
                        <div className="form-group">
                          <span className="la la-globe form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-box">
                        <label className="label-text">Address</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            placeholder="Street Address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="btn-box pt-3">
                    <button type="submit" className="theme-btn" disabled={loading}>
                      {loading ? 'Saving...' : <><i className="la la-save me-2"></i>Save Changes</>}
                    </button>
                    <button type="button" className="theme-btn theme-btn-transparent ms-3" disabled={loading}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
