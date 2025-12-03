'use client';

export default function DriverDashboardProfile() {
  return (
    <div className="section-bg">
      <section className="dashboard-area">
        <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard-bread-2">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Driver Profile</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/driver/dashboard" className="text-white">Dashboard</a></li>
                      <li>Profile</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
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
                                    defaultValue="Michael"
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
                                    defaultValue="Johnson"
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
                                    defaultValue="michael.johnson@email.com"
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
                                    defaultValue="+1 555 123 4567"
                                    placeholder="Phone number"
                                  />
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
                                    defaultValue="456 Driver Lane, New York, NY 10002"
                                    placeholder="Address"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  
                  {/* Driver License Information */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Driver License Information</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">License Number</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-id-card"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="license_number"
                                    defaultValue="DL123456789"
                                    placeholder="License number"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">License Expiry Date</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-calendar"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="date"
                                    name="license_expiry"
                                    defaultValue="2026-08-15"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Years of Experience</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-road"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="experience_years"
                                    defaultValue="8"
                                    placeholder="Years of driving experience"
                                    min="1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">CDL Class (if applicable)</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="">No CDL</option>
                                      <option value="class_a">Class A</option>
                                      <option value="class_b">Class B</option>
                                      <option value="class_c">Class C</option>
                                    </select>
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
                      <h3 className="title">Profile Photo</h3>
                    </div>
                    <div className="form-content">
                      <div className="file-upload-wrap file-upload-wrap-2">
                        <input type="file" name="profile_image" id="profile_image" className="file-upload-input" accept="image/*" />
                        <div className="file-upload-item file-upload-item-2 text-center">
                          <div className="file-upload-icon">
                            <img src="/html-folder/images/team1.jpg" alt="Profile" className="img-fluid rounded-circle" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                          </div>
                          <div className="file-upload-text">
                            <h3 className="file-upload-title">Michael Johnson</h3>
                            <p className="file-upload-hint">Professional Driver</p>
                            <div className="file-upload-btn">
                              <span>Change Photo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Statistics */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Driver Statistics</h3>
                    </div>
                    <div className="form-content">
                      <div className="driver-stats">
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Member Since</span>
                          <span className="stat-value">Jan 2022</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Total Trips</span>
                          <span className="badge bg-primary">156</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Rating</span>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-warning me-2">4.8</span>
                            <div className="rating">
                              <span className="rating__result">
                                <i className="la la-star"></i>
                                <i className="la la-star"></i>
                                <i className="la la-star"></i>
                                <i className="la la-star"></i>
                                <i className="la la-star"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Completion Rate</span>
                          <span className="badge bg-success">98.5%</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center">
                          <span className="stat-label">Total Earnings</span>
                          <span className="badge bg-info">$4,250</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Verification Status</h3>
                    </div>
                    <div className="form-content">
                      <div className="verification-status">
                        <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                          <span>Identity Verified</span>
                          <i className="la la-check-circle text-success" style={{fontSize: '20px'}}></i>
                        </div>
                        <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                          <span>License Verified</span>
                          <i className="la la-check-circle text-success" style={{fontSize: '20px'}}></i>
                        </div>
                        <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                          <span>Background Check</span>
                          <i className="la la-check-circle text-success" style={{fontSize: '20px'}}></i>
                        </div>
                        <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                          <span>Vehicle Documents</span>
                          <i className="la la-check-circle text-success" style={{fontSize: '20px'}}></i>
                        </div>
                        <div className="verification-item d-flex justify-content-between align-items-center">
                          <span>Insurance Valid</span>
                          <i className="la la-check-circle text-success" style={{fontSize: '20px'}}></i>
                        </div>
                      </div>
                      <div className="verification-badge text-center mt-3">
                        <span className="badge bg-success" style={{fontSize: '14px', padding: '8px 16px'}}>
                          <i className="la la-shield me-2"></i>Fully Verified Driver
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Emergency Contact</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Contact Name</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-user"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="emergency_name"
                                    defaultValue="Sarah Johnson"
                                    placeholder="Emergency contact name"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Contact Phone</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-phone"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="emergency_phone"
                                    defaultValue="+1 555 987 6543"
                                    placeholder="Emergency contact phone"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Relationship</label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select">
                                      <option value="spouse" selected>Spouse</option>
                                      <option value="parent">Parent</option>
                                      <option value="sibling">Sibling</option>
                                      <option value="child">Child</option>
                                      <option value="friend">Friend</option>
                                      <option value="other">Other</option>
                                    </select>
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
              </div>
              
              <div className="btn-box">
                <button type="submit" className="theme-btn">
                  <i className="la la-save me-2"></i>Update Profile
                </button>
                <button type="button" className="theme-btn theme-btn-transparent ms-3">
                  <i className="la la-times me-2"></i>Cancel Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
