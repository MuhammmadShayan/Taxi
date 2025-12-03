'use client';

export default function AdminDashboardDestination() {
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
                      <h2 className="sec__title font-size-30 text-white">Destinations Management</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li>Admin</li>
                      <li>Destinations</li>
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
                        <h3 className="title">All Destinations</h3>
                        <div className="d-flex">
                          <div className="select-contain me-3">
                            <select className="select-contain-select">
                              <option value="all">All Destinations</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="featured">Featured</option>
                            </select>
                          </div>
                          <button type="button" className="theme-btn theme-btn-small">
                            <i className="la la-plus me-1"></i>Add New Destination
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Destination</th>
                              <th scope="col">Country</th>
                              <th scope="col">Tours</th>
                              <th scope="col">Rating</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="destination-image me-3">
                                    <img src="/html-folder/images/destination1.jpg" alt="destination" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                                  </div>
                                  <div>
                                    <h3 className="title font-size-15">Paris</h3>
                                    <p className="text font-size-13 text-muted">City of Lights</p>
                                  </div>
                                </div>
                              </td>
                              <td>France</td>
                              <td>
                                <span className="badge bg-info text-white">12</span>
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
                              <td><span className="badge bg-success text-white">Active</span></td>
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
                                      <i className="la la-edit me-2"></i>Edit
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-star me-2"></i>Make Featured
                                    </a>
                                    <a href="#" className="dropdown-item text-danger">
                                      <i className="la la-trash me-2"></i>Delete
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="destination-image me-3">
                                    <img src="/html-folder/images/destination2.jpg" alt="destination" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                                  </div>
                                  <div>
                                    <h3 className="title font-size-15">Tokyo</h3>
                                    <p className="text font-size-13 text-muted">Modern Metropolis</p>
                                  </div>
                                </div>
                              </td>
                              <td>Japan</td>
                              <td>
                                <span className="badge bg-info text-white">8</span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="me-1">4.7</span>
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
                              <td><span className="badge bg-warning text-white">Featured</span></td>
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
                                      <i className="la la-edit me-2"></i>Edit
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-star-o me-2"></i>Remove Featured
                                    </a>
                                    <a href="#" className="dropdown-item text-danger">
                                      <i className="la la-trash me-2"></i>Delete
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="destination-image me-3">
                                    <img src="/html-folder/images/destination3.jpg" alt="destination" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                                  </div>
                                  <div>
                                    <h3 className="title font-size-15">New York</h3>
                                    <p className="text font-size-13 text-muted">The Big Apple</p>
                                  </div>
                                </div>
                              </td>
                              <td>USA</td>
                              <td>
                                <span className="badge bg-info text-white">15</span>
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
                              <td><span className="badge bg-success text-white">Active</span></td>
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
                                      <i className="la la-edit me-2"></i>Edit
                                    </a>
                                    <a href="#" className="dropdown-item">
                                      <i className="la la-star me-2"></i>Make Featured
                                    </a>
                                    <a href="#" className="dropdown-item text-danger">
                                      <i className="la la-trash me-2"></i>Delete
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
              
              {/* Destination Statistics */}
              <div className="row mt-4">
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-1">
                        <i className="la la-map-marker"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Total Destinations</p>
                        <h4 className="info__title">48</h4>
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
                        <p className="info__desc">Active Destinations</p>
                        <h4 className="info__title">42</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-3">
                        <i className="la la-star"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Featured</p>
                        <h4 className="info__title">12</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-4">
                        <i className="la la-globe"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Countries</p>
                        <h4 className="info__title">25</h4>
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

