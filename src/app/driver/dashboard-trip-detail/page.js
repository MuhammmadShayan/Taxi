'use client';

export default function DriverDashboardTripDetail() {
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
                      <h2 className="sec__title font-size-30 text-white">Trip Details</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/driver/dashboard" className="text-white">Dashboard</a></li>
                      <li><a href="/driver/dashboard-trips" className="text-white">My Trips</a></li>
                      <li>Trip Details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                {/* Trip Information */}
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Trip #TR001</h3>
                        <div>
                          <span className="badge bg-warning text-white me-2">Pending</span>
                          <small className="text-muted">Assigned 2 hours ago</small>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      {/* Passenger Information */}
                      <div className="trip-section mb-4">
                        <h4 className="section-title">Passenger Information</h4>
                        <div className="passenger-info">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <img src="/html-folder/images/team8.jpg" alt="passenger" className="avatar avatar-md me-3" />
                                <div>
                                  <h5 className="mb-1">John Doe</h5>
                                  <p className="text-muted mb-1">+1 555 123 4567</p>
                                  <div className="rating">
                                    <span className="rating__result">
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                    </span>
                                    <span className="rating-text">4.8</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Payment Method:</strong> Credit Card (****4567)</p>
                              <p><strong>Special Requests:</strong> Please help with luggage</p>
                              <p><strong>Passengers:</strong> 2 Adults</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="trip-section mb-4">
                        <h4 className="section-title">Trip Information</h4>
                        <div className="trip-details">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="location-info mb-3">
                                <div className="d-flex align-items-start">
                                  <div className="location-icon me-3">
                                    <i className="la la-map-marker text-success" style={{fontSize: '20px'}}></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-1">Pickup Location</h6>
                                    <p className="mb-1"><strong>Manhattan Hotel</strong></p>
                                    <p className="text-muted mb-0">123 W 57th St, New York, NY 10019</p>
                                  </div>
                                </div>
                              </div>
                              <div className="location-info">
                                <div className="d-flex align-items-start">
                                  <div className="location-icon me-3">
                                    <i className="la la-flag text-danger" style={{fontSize: '20px'}}></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-1">Destination</h6>
                                    <p className="mb-1"><strong>JFK Airport</strong></p>
                                    <p className="text-muted mb-0">Terminal 4, Jamaica, NY 11430</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="trip-metrics">
                                <div className="row">
                                  <div className="col-6 mb-3">
                                    <p className="mb-1"><strong>Date & Time</strong></p>
                                    <p className="text-muted mb-0">Today, 10:30 AM</p>
                                    <small className="text-muted">Dec 21, 2023</small>
                                  </div>
                                  <div className="col-6 mb-3">
                                    <p className="mb-1"><strong>Distance</strong></p>
                                    <p className="text-muted mb-0">18.5 miles</p>
                                    <small className="text-muted">~45 minutes</small>
                                  </div>
                                  <div className="col-6">
                                    <p className="mb-1"><strong>Fare</strong></p>
                                    <p className="text-success mb-0 font-weight-bold">$45.00</p>
                                    <small className="text-muted">Base fare + time</small>
                                  </div>
                                  <div className="col-6">
                                    <p className="mb-1"><strong>Your Earnings</strong></p>
                                    <p className="text-primary mb-0 font-weight-bold">$36.00</p>
                                    <small className="text-muted">80% of fare</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Route Map */}
                      <div className="trip-section mb-4">
                        <h4 className="section-title">Route Map</h4>
                        <div className="route-map">
                          {/* Leaflet map placeholder - would integrate with actual Leaflet */}
                          <div className="map-placeholder" style={{height: '300px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '5px'}}>
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <div className="text-center">
                                <i className="la la-map" style={{fontSize: '48px', color: '#ccc'}}></i>
                                <p className="text-muted mt-3">Interactive route map will be displayed here</p>
                                <div className="map-controls mt-3">
                                  <button className="theme-btn theme-btn-small me-2">
                                    <i className="la la-directions me-1"></i>Get Directions
                                  </button>
                                  <button className="theme-btn theme-btn-small theme-btn-transparent">
                                    <i className="la la-location-arrow me-1"></i>Share Location
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trip Timeline */}
                      <div className="trip-section">
                        <h4 className="section-title">Trip Timeline</h4>
                        <div className="timeline">
                          <div className="timeline-item">
                            <div className="timeline-marker">
                              <i className="la la-clock-o text-warning"></i>
                            </div>
                            <div className="timeline-content">
                              <h6>Trip Assigned</h6>
                              <p className="text-muted mb-0">System assigned this trip to you</p>
                              <small className="text-muted">2 hours ago</small>
                            </div>
                          </div>
                          <div className="timeline-item">
                            <div className="timeline-marker">
                              <i className="la la-user text-info"></i>
                            </div>
                            <div className="timeline-content">
                              <h6>Passenger Booked</h6>
                              <p className="text-muted mb-0">John Doe made the booking request</p>
                              <small className="text-muted">3 hours ago</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Panel */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Trip Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="trip-actions">
                        <button className="theme-btn w-100 mb-3">
                          <i className="la la-check me-2"></i>Accept Trip
                        </button>
                        <button className="theme-btn theme-btn-transparent w-100 mb-3">
                          <i className="la la-times me-2"></i>Decline Trip
                        </button>
                        <button className="theme-btn theme-btn-small w-100 mb-3">
                          <i className="la la-phone me-2"></i>Call Passenger
                        </button>
                        <button className="theme-btn theme-btn-small theme-btn-transparent w-100 mb-3">
                          <i className="la la-comment me-2"></i>Send Message
                        </button>
                        <button className="theme-btn theme-btn-small theme-btn-transparent w-100">
                          <i className="la la-directions me-2"></i>Navigate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trip Summary */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Trip Summary</h3>
                    </div>
                    <div className="form-content">
                      <div className="trip-summary">
                        <div className="summary-item d-flex justify-content-between mb-2">
                          <span>Base Fare:</span>
                          <span>$30.00</span>
                        </div>
                        <div className="summary-item d-flex justify-content-between mb-2">
                          <span>Time & Distance:</span>
                          <span>$12.00</span>
                        </div>
                        <div className="summary-item d-flex justify-content-between mb-2">
                          <span>Service Fee:</span>
                          <span>$3.00</span>
                        </div>
                        <hr />
                        <div className="summary-item d-flex justify-content-between mb-3">
                          <span><strong>Total Fare:</strong></span>
                          <span><strong>$45.00</strong></span>
                        </div>
                        <div className="summary-item d-flex justify-content-between mb-2">
                          <span>Platform Fee (20%):</span>
                          <span>-$9.00</span>
                        </div>
                        <hr />
                        <div className="summary-item d-flex justify-content-between">
                          <span><strong>Your Earnings:</strong></span>
                          <span><strong className="text-success">$36.00</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Need Help?</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-info">
                        <p><i className="la la-phone me-2"></i><strong>Driver Support:</strong> +1 800 DRIVER1</p>
                        <p><i className="la la-envelope me-2"></i><strong>Email:</strong> driver-support@kirastay.com</p>
                        <p><i className="la la-clock-o me-2"></i><strong>Hours:</strong> 24/7 Available</p>
                        <button className="theme-btn theme-btn-small theme-btn-transparent w-100 mt-2">
                          <i className="la la-headphones me-2"></i>Contact Support
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Actions */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title text-danger">Emergency</h3>
                    </div>
                    <div className="form-content">
                      <div className="emergency-actions">
                        <button className="theme-btn theme-btn-danger w-100 mb-2">
                          <i className="la la-exclamation-triangle me-2"></i>Emergency Call 911
                        </button>
                        <button className="theme-btn theme-btn-small theme-btn-transparent w-100">
                          <i className="la la-shield me-2"></i>Report Safety Issue
                        </button>
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
