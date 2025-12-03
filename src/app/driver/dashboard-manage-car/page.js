'use client';

export default function DriverDashboardManageCar() {
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
                      <h2 className="sec__title font-size-30 text-white">Manage My Vehicles</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/driver/dashboard" className="text-white">Dashboard</a></li>
                      <li>My Vehicles</li>
                    </ul>
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
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">My Vehicle Fleet</h3>
                        <div className="d-flex">
                          <div className="select-contain me-3">
                            <select className="select-contain-select">
                              <option value="all">All Vehicles</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="maintenance">Under Maintenance</option>
                            </select>
                          </div>
                          <a href="/driver/dashboard-add-car" className="theme-btn theme-btn-small">
                            <i className="la la-plus me-1"></i>Add New Vehicle
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Vehicle</th>
                              <th scope="col">Details</th>
                              <th scope="col">Status</th>
                              <th scope="col">Earnings</th>
                              <th scope="col">Next Service</th>
                              <th scope="col">Rating</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="vehicle-image me-3">
                                    <img src="/html-folder/images/car1.jpg" alt="vehicle" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                                  </div>
                                  <div>
                                    <h3 className="title font-size-15">Toyota Camry 2023</h3>
                                    <p className="text font-size-13 text-muted">License: ABC-1234</p>
                                    <span className="badge bg-success text-white font-size-12">Primary Vehicle</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <span className="d-block font-size-13">Sedan • Automatic</span>
                                  <span className="d-block font-size-13 text-muted">5 Seats • 4 Doors</span>
                                  <span className="d-block font-size-13 text-muted">Mileage: 25,000 km</span>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-success text-white">Active</span>
                                <br />
                                <small className="text-muted">Online</small>
                              </td>
                              <td>
                                <div>
                                  <strong>$3,250</strong>
                                  <br />
                                  <small className="text-muted">This Month</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>2,500 km</strong>
                                  <br />
                                  <small className="text-muted">~2 weeks</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="me-1">4.8</span>
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
                              </td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="theme-btn theme-btn-small theme-btn-transparent"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-eye me-2"></i>View Details
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-edit me-2"></i>Edit Vehicle
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-images me-2"></i>Update Photos
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-wrench me-2"></i>Schedule Service
                                    </a>
                                    <a href="#" className="dropdown-item text-warning">
                                      <i className="la la-pause me-2"></i>Mark Inactive
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="vehicle-image me-3">
                                    <img src="/html-folder/images/car2.jpg" alt="vehicle" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                                  </div>
                                  <div>
                                    <h3 className="title font-size-15">Honda Accord 2022</h3>
                                    <p className="text font-size-13 text-muted">License: XYZ-5678</p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <span className="d-block font-size-13">Sedan • Automatic</span>
                                  <span className="d-block font-size-13 text-muted">5 Seats • 4 Doors</span>
                                  <span className="d-block font-size-13 text-muted">Mileage: 18,500 km</span>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-warning text-white">Maintenance</span>
                                <br />
                                <small className="text-muted">Service Due</small>
                              </td>
                              <td>
                                <div>
                                  <strong>$1,850</strong>
                                  <br />
                                  <small className="text-muted">This Month</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong className="text-danger">Overdue</strong>
                                  <br />
                                  <small className="text-muted">Schedule now</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="me-1">4.6</span>
                                  <div className="rating">
                                    <span className="rating__result">
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star-o"></i>
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="#"
                                    className="theme-btn theme-btn-small theme-btn-transparent"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                    <i className="la la-dot-circle-o"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-eye me-2"></i>View Details
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-edit me-2"></i>Edit Vehicle
                                    </a>
                                    <a href="#" className="dropdown-item text-warning">
                                      <i className="la la-wrench me-2"></i>Book Service
                                    </a>
                                    <a href="#" className="dropdown-item text-success">
                                      <i className="la la-check me-2"></i>Mark Active
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Statistics */}
              <div className="row mt-4">
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-1">
                        <i className="la la-car"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Total Vehicles</p>
                        <h4 className="info__title">2</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-2">
                        <i className="la la-check-circle"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Active Vehicles</p>
                        <h4 className="info__title">1</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-3">
                        <i className="la la-dollar"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Monthly Earnings</p>
                        <h4 className="info__title">$5,100</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-4">
                        <i className="la la-star"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Avg Rating</p>
                        <h4 className="info__title">4.7</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Performance & Maintenance Alerts */}
              <div className="row mt-4">
                <div className="col-lg-6">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Vehicle Performance</h3>
                    </div>
                    <div className="form-content">
                      <div className="performance-metrics">
                        <div className="metric-item d-flex justify-content-between align-items-center mb-3 p-3" style={{backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                          <div>
                            <h5 className="mb-1">Toyota Camry 2023</h5>
                            <div className="metric-stats">
                              <small className="text-muted me-3">156 trips</small>
                              <small className="text-muted me-3">2,500 km</small>
                              <small className="text-success">95% uptime</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <h4 className="text-success mb-0">$3,250</h4>
                            <small className="text-muted">This month</small>
                          </div>
                        </div>
                        <div className="metric-item d-flex justify-content-between align-items-center p-3" style={{backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                          <div>
                            <h5 className="mb-1">Honda Accord 2022</h5>
                            <div className="metric-stats">
                              <small className="text-muted me-3">89 trips</small>
                              <small className="text-muted me-3">1,200 km</small>
                              <small className="text-warning">60% uptime</small>
                            </div>
                          </div>
                          <div className="text-end">
                            <h4 className="text-warning mb-0">$1,850</h4>
                            <small className="text-muted">This month</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Maintenance Alerts</h3>
                    </div>
                    <div className="form-content">
                      <div className="maintenance-alerts">
                        <div className="alert-item d-flex align-items-center mb-3 p-3" style={{backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '5px'}}>
                          <div className="alert-icon me-3">
                            <i className="la la-exclamation-triangle text-warning" style={{fontSize: '24px'}}></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Service Overdue</h6>
                            <p className="mb-1"><strong>Honda Accord 2022</strong></p>
                            <small className="text-muted">Scheduled maintenance is 500 km overdue</small>
                            <br />
                            <button className="theme-btn theme-btn-small mt-2">Book Service</button>
                          </div>
                        </div>
                        <div className="alert-item d-flex align-items-center p-3" style={{backgroundColor: '#d4edda', borderLeft: '4px solid #28a745', borderRadius: '5px'}}>
                          <div className="alert-icon me-3">
                            <i className="la la-check-circle text-success" style={{fontSize: '24px'}}></i>
                          </div>
                          <div>
                            <h6 className="mb-1">All Good</h6>
                            <p className="mb-1"><strong>Toyota Camry 2023</strong></p>
                            <small className="text-muted">Next service in 2,500 km (~2 weeks)</small>
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
      </section>
    </div>
  );
}
