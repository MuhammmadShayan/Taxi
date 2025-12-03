'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardProfile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  
  const [profileData, setProfileData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    } else if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, isLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/profile', {
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
      setFormLoading(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      if (!user || user.role !== 'admin') return;
      setStatsLoading(true);
      setStatsError(null);
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load admin stats');
        setStats(data);
      } catch (e) {
        console.error('Admin profile stats error:', e);
        setStatsError(e.message || 'Failed to load admin stats');
      } finally {
        setStatsLoading(false);
      }
    };
    if (user?.role === 'admin') loadStats();
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout
      pageTitle="My Profile"
      breadcrumbItems={[{ label: 'Admin', href: '/admin' }, { label: 'My Profile', href: '/admin/dashboard-profile' }]}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-8">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Administrator Information</h3>
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
                            alt="Admin Profile Photo"
                            className="profile-photo"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23dc3545'/%3E%3Ctext x='60' y='70' text-anchor='middle' fill='white' font-size='48'%3E👨‍💼%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button type="button" className="btn btn-primary btn-sm profile-photo-btn">
                            <i className="la la-camera"></i>
                          </button>
                        </div>
                        <h4 className="mt-3">{user.first_name} {user.last_name}</h4>
                        <p className="text-muted">System Administrator</p>
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
                            defaultValue={user.email}
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
                        <label className="label-text">Department</label>
                        <div className="form-group">
                          <span className="la la-building form-icon"></span>
                          <select className="form-control">
                            <option value="">Select Department</option>
                            <option value="it">IT & Development</option>
                            <option value="operations">Operations</option>
                            <option value="customer_service">Customer Service</option>
                            <option value="management" selected>Management</option>
                            <option value="finance">Finance</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-box">
                        <label className="label-text">Admin Level</label>
                        <div className="form-group">
                          <span className="la la-shield form-icon"></span>
                          <select className="form-control">
                            <option value="super_admin" selected>Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-box">
                        <label className="label-text">Office Address</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <textarea
                            className="form-control"
                            rows="3"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            placeholder="Office Address"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-box">
                        <label className="label-text">Admin Notes</label>
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            rows="4"
                            defaultValue="System administrator with full access to all platform features and user management capabilities."
                            placeholder="Administrative notes and responsibilities..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="btn-box">
                        <button type="submit" className="theme-btn" disabled={formLoading}>
                          {formLoading ? 'Updating...' : <>Update Profile <i className="la la-arrow-right ms-1"></i></>}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Admin Statistics</h3>
            </div>
            <div className="form-content">
              <div className="admin-stats-list">
                {statsLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                  </div>
                ) : statsError ? (
                  <div className="alert alert-warning">{statsError}</div>
                ) : (
                  <>
                    <div className="admin-stat-item">
                      <div className="d-flex align-items-center">
                        <div className="stat-icon me-3">
                          <i className="la la-users text-primary"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">{(stats?.users ?? 0).toLocaleString?.()}</h5>
                          <small className="text-muted">Total Users</small>
                        </div>
                      </div>
                    </div>
                    <div className="admin-stat-item">
                      <div className="d-flex align-items-center">
                        <div className="stat-icon me-3">
                          <i className="la la-car text-success"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">{(stats?.cars ?? 0).toLocaleString?.()}</h5>
                          <small className="text-muted">Total Vehicles</small>
                        </div>
                      </div>
                    </div>
                    <div className="admin-stat-item">
                      <div className="d-flex align-items-center">
                        <div className="stat-icon me-3">
                          <i className="la la-calendar-check-o text-warning"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">{(stats?.active_trips ?? 0).toLocaleString?.()}</h5>
                          <small className="text-muted">Active Trips</small>
                        </div>
                      </div>
                    </div>
                    <div className="admin-stat-item">
                      <div className="d-flex align-items-center">
                        <div className="stat-icon me-3">
                          <i className="la la-money text-danger"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(stats?.monthly_revenue || 0)}</h5>
                          <small className="text-muted">Monthly Revenue</small>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Quick Actions</h3>
            </div>
            <div className="form-content">
              <div className="quick-actions-list">
                <Link href="/admin/users" className="quick-action-btn">
                  <i className="la la-users me-2"></i>Manage Users
                </Link>
                <Link href="/admin/cars" className="quick-action-btn">
                  <i className="la la-car me-2"></i>Manage Cars
                </Link>
                <Link href="/admin/bookings" className="quick-action-btn">
                  <i className="la la-calendar me-2"></i>View Bookings
                </Link>
                <Link href="/admin/settings" className="quick-action-btn">
                  <i className="la la-cog me-2"></i>System Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .profile-photo-wrapper {
          position: relative;
          display: inline-block;
        }
        
        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .profile-photo-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }
        
        .admin-stat-item {
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .admin-stat-item:last-child {
          border-bottom: none;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quick-action-btn {
          display: block;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: #f8f9fa;
          color: #333;
          text-decoration: none;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        
        .quick-action-btn:hover {
          background: #e9ecef;
          color: #333;
          text-decoration: none;
          transform: translateY(-2px);
        }
      `}</style>
    </AdminLayout>
  );
}

