'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgencyProfile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postal_code: user.postal_code || ''
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
      const response = await fetch('/api/agency/profile', {
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

  useEffect(() => {
    if (!isLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
    return null;
  }

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <div className="dashboard-area">
        {/* Agency Sidebar Navigation */}
        <div className="sidebar-nav sidebar--nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team8.jpg" 
                    alt="Agency avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">{user.first_name} {user.last_name}</h4>
                  <span className="author__meta">Agency Owner</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu toggle-menu list-items">
                <li>
                  <Link href="/agency/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="page-active">
                  <Link href="/agency/profile">
                    <i className="la la-user me-2 text-color"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/agency/vehicles">
                    <i className="la la-car me-2 text-color-2"></i>My Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/agency/bookings">
                    <i className="la la-shopping-cart me-2 text-color-3"></i>Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/chat">
                    <i className="la la-comments me-2 text-color-4"></i>Chat
                  </Link>
                </li>
                <li>
                  <Link href="/agency/earnings">
                    <i className="la la-money me-2 text-color-5"></i>Earnings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/reviews">
                    <i className="la la-star me-2 text-color-5"></i>Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/agency/settings">
                    <i className="la la-cog me-2 text-color-6"></i>Settings
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <i className="la la-power-off me-2 text-color-7"></i>Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top Navigation */}
        <div className="dashboard-nav dashboard--nav">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="menu-wrapper">
                  <div className="logo me-5">
                    <Link href="/">
                      <img 
                        src="/html-folder/images/logo.png" 
                        alt="HOLIKEY logo"
                        style={{ maxHeight: '40px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EHOLIKEY%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </Link>
                    <div className="menu-toggler">
                      <i className="la la-bars"></i>
                      <i className="la la-times"></i>
                    </div>
                  </div>
                  <div className="nav-btn ms-auto">
                    <div className="notification-wrap d-flex align-items-center">
                      <div className="notification-item">
                        <div className="dropdown">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            id="userDropdownMenu"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm flex-shrink-0 me-2">
                                <img 
                                  src="/html-folder/images/team8.jpg" 
                                  alt="Agency avatar"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <span className="font-size-14 font-weight-bold">{user.first_name}</span>
                            </div>
                          </a>
                          <div className="dropdown-menu dropdown-reveal dropdown-menu-xl dropdown-menu-right">
                            <div className="list-group drop-reveal-list user-drop-reveal-list">
                              <Link href="/agency/profile" className="list-group-item list-group-item-action">
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-user me-2"></i>My Profile
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <Link href="/agency/dashboard" className="list-group-item list-group-item-action">
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-dashboard me-2"></i>Dashboard
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <div className="section-block"></div>
                              <Link href="/" className="list-group-item list-group-item-action">
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-power-off me-2"></i>Logout
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard--bread">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">My Profile</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Agency Profile Information</h3>
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
                                    alt="Agency Logo"
                                    className="profile-photo"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23ff6b35'/%3E%3Ctext x='60' y='70' text-anchor='middle' fill='white' font-size='48'%3E🏢%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                  <button type="button" className="btn btn-primary btn-sm profile-photo-btn">
                                    <i className="la la-camera"></i>
                                  </button>
                                </div>
                                <h4 className="mt-3">{user.first_name} {user.last_name}</h4>
                                <p className="text-muted">Agency Owner</p>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">Agency Name</label>
                                <div className="form-group">
                                  <span className="la la-building form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.agency_name || `${user.first_name}'s Travel Agency`}
                                    placeholder="Agency Name"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">Business Registration Number</label>
                                <div className="form-group">
                                  <span className="la la-id-card form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.business_reg_number || ''}
                                    placeholder="Business Registration Number"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">Contact Person First Name</label>
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
                                <label className="label-text">Contact Person Last Name</label>
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
                                    name="email"
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
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Business Address</label>
                                <div className="form-group">
                                  <span className="la la-map-marker form-icon"></span>
                                  <textarea
                                    className="form-control"
                                    rows="3"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    placeholder="Complete Business Address"
                                  ></textarea>
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
                                <label className="label-text">About Agency</label>
                                <div className="form-group">
                                  <textarea
                                    className="form-control"
                                    rows="4"
                                    defaultValue={user.about || ''}
                                    placeholder="Tell customers about your agency, services, and experience..."
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="btn-box">
                                <button type="submit" className="theme-btn" disabled={loading}>
                                  {loading ? 'Updating...' : <>Update Profile <i className="la la-arrow-right ms-1"></i></>}
                                </button>
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
        
        .dashboard-area {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .dashboard-content-wrap {
          margin-left: 280px;
          padding: 0;
        }
        
        .dashboard-nav {
          background: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem 0;
          margin-bottom: 0;
        }
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
      `}</style>
    </>
  );
}

