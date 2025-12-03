'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '../../../components/CustomerDashboardLayout';
import Link from 'next/link';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    state: ''
  });
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
                    <div className="col-lg-12 mb-4">
                      <div className="text-center">
                        <div className="profile-photo-wrapper">
                          <img 
                            src="/html-folder/images/team8.jpg" 
                            alt="Profile Photo"
                            className="profile-photo"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/html-folder/images/default-avatar.svg";
                            }}
                          />
                          <button type="button" className="btn btn-primary btn-sm profile-photo-btn">
                            <i className="la la-camera"></i>
                          </button>
                        </div>
                        <h4 className="mt-3">{user?.first_name || ''} {user?.last_name || ''}</h4>
                        <p className="text-muted">Customer since 2023</p>
                      </div>
                    </div>
                  </div>

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
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">State/Province</label>
                        <div className="form-group">
                          <span className="la la-map form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="state"
                            value={profileData.state}
                            onChange={handleInputChange}
                            placeholder="State/Province"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-box">
                        <label className="label-text">Address</label>
                        <div className="form-group">
                          <span className="la la-home form-icon"></span>
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

                  {/* Preferences Section */}
                  <div className="section-block mt-4 mb-4"></div>
                  
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="mb-3">Preferences</h4>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Preferred Language</label>
                        <div className="form-group">
                          <select className="form-control">
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="ar">العربية</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Preferred Currency</label>
                        <div className="form-group">
                          <select className="form-control">
                            <option value="MAD">Moroccan Dirham (MAD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="GBP">British Pound (GBP)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-check-wrap d-flex align-items-center">
                        <div className="custom-checkbox me-4">
                          <input type="checkbox" id="emailNotifications" />
                          <label htmlFor="emailNotifications">
                            Receive email notifications about bookings and offers
                          </label>
                        </div>
                      </div>
                      <div className="form-check-wrap d-flex align-items-center">
                        <div className="custom-checkbox me-4">
                          <input type="checkbox" id="smsNotifications" />
                          <label htmlFor="smsNotifications">
                            Receive SMS notifications about urgent updates
                          </label>
                        </div>
                      </div>
                      <div className="form-check-wrap d-flex align-items-center">
                        <div className="custom-checkbox me-4">
                          <input type="checkbox" id="marketingEmails" />
                          <label htmlFor="marketingEmails">
                            Receive marketing emails about new vehicles and promotions
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="btn-box pt-3">
                    <button type="submit" className="theme-btn" disabled={loading}>
                      <i className="la la-save me-2"></i>{loading ? 'Saving...' : 'Save Changes'}
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
