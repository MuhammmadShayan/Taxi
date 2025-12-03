'use client';

export default function UserDashboardBookingDetail() {
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
                      <h2 className="sec__title font-size-30 text-white">Booking Details</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/user/dashboard" className="text-white">Dashboard</a></li>
                      <li><a href="/user/dashboard-booking" className="text-white">My Bookings</a></li>
                      <li>Booking Details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                {/* Booking Information */}
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Booking #BK001</h3>
                        <span className="badge bg-primary text-white">Confirmed</span>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="booking-detail-content">
                        {/* Tour Information */}
                        <div className="booking-section mb-4">
                          <h4 className="section-title">Tour Information</h4>
                          <div className="tour-info">
                            <div className="row">
                              <div className="col-lg-4">
                                <img src="/html-folder/images/destination1.jpg" alt="Paris Tour" className="img-fluid rounded" />
                              </div>
                              <div className="col-lg-8">
                                <h3 className="tour-title">Paris City Tour</h3>
                                <p className="tour-description">
                                  Explore the City of Lights with this comprehensive 3-day tour package. 
                                  Visit iconic landmarks including the Eiffel Tower, Louvre Museum, 
                                  Notre-Dame Cathedral, and cruise along the Seine River.
                                </p>
                                <div className="tour-features">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p><i className="la la-calendar me-2"></i><strong>Duration:</strong> 3 Days, 2 Nights</p>
                                      <p><i className="la la-users me-2"></i><strong>Group Size:</strong> Max 15 people</p>
                                    </div>
                                    <div className="col-md-6">
                                      <p><i className="la la-map-marker me-2"></i><strong>Location:</strong> Paris, France</p>
                                      <p><i className="la la-star me-2"></i><strong>Rating:</strong> 4.8/5 (245 reviews)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Traveler Details */}
                        <div className="booking-section mb-4">
                          <h4 className="section-title">Traveler Details</h4>
                          <div className="traveler-info">
                            <div className="row">
                              <div className="col-md-6">
                                <p><strong>Lead Traveler:</strong> John Doe</p>
                                <p><strong>Email:</strong> john@example.com</p>
                                <p><strong>Phone:</strong> +1 234 567 8900</p>
                              </div>
                              <div className="col-md-6">
                                <p><strong>Number of Travelers:</strong> 2 Adults</p>
                                <p><strong>Special Requests:</strong> Vegetarian meals</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Itinerary */}
                        <div className="booking-section mb-4">
                          <h4 className="section-title">Itinerary</h4>
                          <div className="itinerary-timeline">
                            <div className="timeline-item">
                              <div className="timeline-marker">
                                <span className="timeline-number">1</span>
                              </div>
                              <div className="timeline-content">
                                <h5>Day 1 - Arrival & City Overview</h5>
                                <p>Airport pickup, hotel check-in, welcome dinner, and evening Seine River cruise</p>
                              </div>
                            </div>
                            <div className="timeline-item">
                              <div className="timeline-marker">
                                <span className="timeline-number">2</span>
                              </div>
                              <div className="timeline-content">
                                <h5>Day 2 - Historical Paris</h5>
                                <p>Visit Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and Latin Quarter</p>
                              </div>
                            </div>
                            <div className="timeline-item">
                              <div className="timeline-marker">
                                <span className="timeline-number">3</span>
                              </div>
                              <div className="timeline-content">
                                <h5>Day 3 - Modern Paris & Departure</h5>
                                <p>Champs-Élysées shopping, Montmartre district, farewell lunch, airport transfer</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Booking Summary</h3>
                    </div>
                    <div className="form-content">
                      <div className="booking-summary">
                        <div className="summary-item">
                          <span className="summary-label">Booking Date:</span>
                          <span className="summary-value">Nov 10, 2023</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Travel Date:</span>
                          <span className="summary-value">Dec 15, 2023</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Travelers:</span>
                          <span className="summary-value">2 Adults</span>
                        </div>
                        <hr />
                        <div className="summary-item">
                          <span className="summary-label">Tour Price:</span>
                          <span className="summary-value">$258</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Service Fee:</span>
                          <span className="summary-value">$25</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Taxes:</span>
                          <span className="summary-value">$16</span>
                        </div>
                        <hr />
                        <div className="summary-item total">
                          <span className="summary-label"><strong>Total Amount:</strong></span>
                          <span className="summary-value"><strong>$299</strong></span>
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
                        <p><i className="la la-phone me-2"></i><strong>24/7 Support:</strong> +1 800 123 4567</p>
                        <p><i className="la la-envelope me-2"></i><strong>Email:</strong> support@travelagency.com</p>
                        <p><i className="la la-clock-o me-2"></i><strong>Hours:</strong> 24/7 Available</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="btn-box">
                    <button type="button" className="theme-btn theme-btn-small w-100 mb-2">
                      <i className="la la-download me-2"></i>Download Voucher
                    </button>
                    <button type="button" className="theme-btn theme-btn-transparent theme-btn-small w-100 mb-2">
                      <i className="la la-print me-2"></i>Print Booking
                    </button>
                    <button type="button" className="theme-btn theme-btn-small theme-btn-transparent w-100 text-danger">
                      <i className="la la-times me-2"></i>Cancel Booking
                    </button>
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
