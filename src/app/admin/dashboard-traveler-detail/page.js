'use client';

export default function AdminDashboardTravelerDetail() {
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
                      <h2 className="sec__title font-size-30 text-white">Traveler Details</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/admin/dashboard-travellers" className="text-white">Travellers</a></li>
                      <li>Traveler Details</li>
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
                      <h3 className="title">Traveler Information</h3>
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
                                <label className="label-text">Status</label>
                                <div className="form-group">
                                  <div className="select-contain w-auto">
                                    <select className="select-contain-select">
                                      <option value="active" selected>Active</option>
                                      <option value="inactive">Inactive</option>
                                      <option value="suspended">Suspended</option>
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
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Profile Picture</h3>
                    </div>
                    <div className="form-content">
                      <div className="file-upload-wrap file-upload-wrap-2">
                        <div className="file-upload-item file-upload-item-2 text-center">
                          <div className="file-upload-icon">
                            <img src="/html-folder/images/team8.jpg" alt="Profile" className="img-fluid rounded-circle" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                          </div>
                          <div className="file-upload-text">
                            <h3 className="file-upload-title">John Doe</h3>
                            <p className="file-upload-hint">Member since Jan 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Stats</h3>
                    </div>
                    <div className="form-content">
                      <div className="traveler-stats">
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Total Bookings</span>
                          <span className="badge bg-primary">12</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Completed Trips</span>
                          <span className="badge bg-success">10</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Cancelled Bookings</span>
                          <span className="badge bg-warning">2</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                          <span className="stat-label">Total Spent</span>
                          <span className="badge bg-info">$2,450</span>
                        </div>
                        <div className="stat-item d-flex justify-content-between align-items-center">
                          <span className="stat-label">Average Rating</span>
                          <span className="badge bg-dark">4.8/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="btn-box">
                    <button type="submit" className="theme-btn">
                      <i className="la la-save me-2"></i>Update Traveler
                    </button>
                    <button type="button" className="theme-btn theme-btn-transparent ms-2">
                      <i className="la la-ban me-2"></i>Suspend Account
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Bookings Section */}
              <div className="row mt-4">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Bookings</h3>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Booking ID</th>
                              <th scope="col">Service</th>
                              <th scope="col">Date</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>#BK001</td>
                              <td>
                                <div className="table-content">
                                  <h3 className="title">Paris City Tour</h3>
                                  <p className="text">3 Days Package</p>
                                </div>
                              </td>
                              <td>Dec 15, 2023</td>
                              <td>$299</td>
                              <td><span className="badge bg-success text-white">Completed</span></td>
                              <td>
                                <a href="/admin/dashboard-booking-detail" className="theme-btn theme-btn-small">View</a>
                              </td>
                            </tr>
                            <tr>
                              <td>#BK002</td>
                              <td>
                                <div className="table-content">
                                  <h3 className="title">London Adventure</h3>
                                  <p className="text">5 Days Package</p>
                                </div>
                              </td>
                              <td>Nov 20, 2023</td>
                              <td>$450</td>
                              <td><span className="badge bg-primary text-white">Confirmed</span></td>
                              <td>
                                <a href="/admin/dashboard-booking-detail" className="theme-btn theme-btn-small">View</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

