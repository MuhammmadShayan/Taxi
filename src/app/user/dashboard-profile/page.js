'use client';
import CustomerLayout from '../../../components/CustomerLayout';

export default function CustomerDashboardProfile() {
  return (
    <CustomerLayout
      pageTitle="My Profile"
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/customer' }, { label: 'Profile' }]}
      showStats={false}
    >
      {/* Main Profile Content */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Personal Information</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">First Name</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-user"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="first_name"
                                    defaultValue="John"
                                    placeholder="First name"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Last Name</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-user"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="last_name"
                                    defaultValue="Doe"
                                    placeholder="Last name"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Email Address</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-envelope"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    defaultValue="john@example.com"
                                    placeholder="Email address"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Phone Number</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-phone"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="phone"
                                    defaultValue="+1 234 567 8900"
                                    placeholder="Phone number"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Date of Birth</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-calendar"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="date"
                                    name="date_of_birth"
                                    defaultValue="1985-06-15"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Gender</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="">Select Gender</option>
                                      <option value="male" selected>Male</option>
                                      <option value="female">Female</option>
                                      <option value="other">Other</option>
                                      <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Address</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-map-marker"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="address"
                                    defaultValue="123 Main St, New York, NY 10001"
                                    placeholder="Address"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Bio</label>
                                <div className="form-group">
                                  <textarea
                                    className="message-control form-control"
                                    name="bio"
                                    placeholder="Tell us about yourself, your travel interests, etc."
                                    rows="4"
                                    defaultValue="Travel enthusiast who loves exploring new cultures and cuisines. Always looking for the next adventure!"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  
                  {/* Travel Preferences */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Travel Preferences</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Preferred Travel Style</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="">Select Travel Style</option>
                                      <option value="budget">Budget Travel</option>
                                      <option value="comfort" selected>Comfort Travel</option>
                                      <option value="luxury">Luxury Travel</option>
                                      <option value="adventure">Adventure Travel</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Group Size Preference</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="">Select Group Size</option>
                                      <option value="solo">Solo Travel</option>
                                      <option value="couple">Couple</option>
                                      <option value="small_group" selected>Small Group (3-8)</option>
                                      <option value="large_group">Large Group (9+)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Interests</label>
                                <div className="form-group">
                                  <div className="interests-grid">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="culture" id="culture" checked />
                                          <label className="form-check-label" htmlFor="culture">
                                            Culture & History
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="food" id="food" checked />
                                          <label className="form-check-label" htmlFor="food">
                                            Food & Cuisine
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="nature" id="nature" />
                                          <label className="form-check-label" htmlFor="nature">
                                            Nature & Wildlife
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="adventure" id="adventure" />
                                          <label className="form-check-label" htmlFor="adventure">
                                            Adventure Sports
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="beaches" id="beaches" checked />
                                          <label className="form-check-label" htmlFor="beaches">
                                            Beaches & Relaxation
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="nightlife" id="nightlife" />
                                          <label className="form-check-label" htmlFor="nightlife">
                                            Nightlife & Entertainment
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  {/* Profile Picture */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Profile Picture</h3>
                    </div>
                    <div className="form-content">
                      <div className="file-upload-wrap file-upload-wrap-2">
                        <input type="file" name="profile_image" id="profile_image" className="file-upload-input" accept="image/*" />
                        <div className="file-upload-item file-upload-item-2 text-center">
                          <div className="file-upload-icon">
                            <img src="/html-folder/images/team8.jpg" alt="Profile" className="img-fluid rounded-circle" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                          </div>
                          <div className="file-upload-text">
                            <h3 className="file-upload-title">John Doe</h3>
                            <p className="file-upload-hint">Member since Jan 2023</p>
                            <div className="file-upload-btn">
                              <span>Change Photo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Account Statistics</h3>
                    </div>
                    <div className="form-content">
                      <div className="account-stats">
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Member Since</span>
                          <span className="stat-value">Jan 2023</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Total Trips</span>
                          <span className="badge bg-primary">12</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Countries Visited</span>
                          <span className="badge bg-success">8</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Reviews Written</span>
                          <span className="badge bg-info">15</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center">
                          <span className="stat-label">Wishlist Items</span>
                          <span className="badge bg-warning">5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Change Password</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Current Password</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-lock"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="password"
                                    name="current_password"
                                    placeholder="Current password"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">New Password</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-lock"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="password"
                                    name="new_password"
                                    placeholder="New password"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Confirm New Password</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-lock"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm new password"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn-box">
                            <button type="submit" className="theme-btn theme-btn-small">
                              Update Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="btn-box">
                <button type="submit" className="theme-btn">
                  <i className="la la-save me-2"></i>Save Changes
                </button>
                <button type="button" className="theme-btn theme-btn-transparent ms-3">
                  <i className="la la-times me-2"></i>Cancel
                </button>
              </div>
    </CustomerLayout>
  );
}
