'use client';

export default function DriverDashboard() {
  const statsCards = [
    {
      title: "Total Trips",
      value: "156",
      change: "+8 this week",
      changeType: "positive",
      icon: "la la-car",
      color: "text-color"
    },
    {
      title: "Total Earnings",
      value: "$4,250",
      change: "+$320 this week",
      changeType: "positive",
      icon: "la la-dollar",
      color: "text-color-2"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2 points",
      changeType: "positive",
      icon: "la la-star",
      color: "text-color-3"
    },
    {
      title: "Hours Driven",
      value: "320h",
      change: "+24h this week",
      changeType: "positive",
      icon: "la la-clock-o",
      color: "text-color-4"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Driver Dashboard' }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-content">
                      <div className="contact-form-action">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <div>
                            <h3 className="title">Welcome Back, Michael!</h3>
                            <p className="text">Ready to hit the road? Here's your driving summary for today</p>
                          </div>
                          <div>
                            <button className="theme-btn theme-btn-small me-2">
                              <i className="la la-car me-1"></i>Go Online
                            </button>
                            <a href="/driver/dashboard-trips" className="theme-btn theme-btn-small theme-btn-transparent">
                              <i className="la la-list me-1"></i>View Trips
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="row">
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-1">
                        <i className="la la-car"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Total Trips</p>
                        <h4 className="info__title">156</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-2">
                        <i className="la la-dollar"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Total Earnings</p>
                        <h4 className="info__title">$4,250</h4>
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
                        <p className="info__desc">Average Rating</p>
                        <h4 className="info__title">4.8</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="icon-box icon-layout-2 dashboard-icon-box">
                    <div className="d-flex">
                      <div className="info-icon flex-shrink-0 bg-rgb-4">
                        <i className="la la-clock-o"></i>
                      </div>
                      <div className="info-content">
                        <p className="info__desc">Hours Driven</p>
                        <h4 className="info__title">320h</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Activity & Assigned Trips */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Today's Assigned Trips</h3>
                        <a href="/driver/dashboard-trips" className="theme-btn theme-btn-small theme-btn-transparent">
                          View All Trips
                        </a>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Trip ID</th>
                              <th scope="col">Passenger</th>
                              <th scope="col">Pickup</th>
                              <th scope="col">Destination</th>
                              <th scope="col">Time</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>#TR001</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src="/html-folder/images/team8.jpg" alt="passenger" className="avatar avatar-sm me-2" />
                                  <span>John Doe</span>
                                </div>
                              </td>
                              <td>Manhattan Hotel</td>
                              <td>JFK Airport</td>
                              <td>10:30 AM</td>
                              <td><span className="badge bg-warning text-white">Pending</span></td>
                              <td>
                                <a href="/driver/dashboard-trip-detail" className="theme-btn theme-btn-small">
                                  Accept
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>#TR002</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src="/html-folder/images/team9.jpg" alt="passenger" className="avatar avatar-sm me-2" />
                                  <span>Jane Smith</span>
                                </div>
                              </td>
                              <td>Times Square</td>
                              <td>Central Park</td>
                              <td>2:15 PM</td>
                              <td><span className="badge bg-success text-white">Accepted</span></td>
                              <td>
                                <a href="/driver/dashboard-trip-detail" className="theme-btn theme-btn-small">
                                  View
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>#TR003</strong></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src="/html-folder/images/team1.jpg" alt="passenger" className="avatar avatar-sm me-2" />
                                  <span>Mike Johnson</span>
                                </div>
                              </td>
                              <td>Brooklyn Bridge</td>
                              <td>LaGuardia Airport</td>
                              <td>4:45 PM</td>
                              <td><span className="badge bg-primary text-white">Confirmed</span></td>
                              <td>
                                <a href="/driver/dashboard-trip-detail" className="theme-btn theme-btn-small">
                                  View
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Vehicle Status */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="quick-actions">
                        <a href="/driver/dashboard-trips" className="quick-action-item d-flex align-items-center mb-3">
                          <div className="quick-action-icon me-3">
                            <i className="la la-road"></i>
                          </div>
                          <div>
                            <h4 className="quick-action-title">View My Trips</h4>
                            <p className="quick-action-desc">Manage assigned trips</p>
                          </div>
                        </a>
                        <a href="/driver/dashboard-manage-car" className="quick-action-item d-flex align-items-center mb-3">
                          <div className="quick-action-icon me-3">
                            <i className="la la-car"></i>
                          </div>
                          <div>
                            <h4 className="quick-action-title">Manage Vehicle</h4>
                            <p className="quick-action-desc">Update car information</p>
                          </div>
                        </a>
                        <a href="/driver/dashboard-earnings" className="quick-action-item d-flex align-items-center mb-3">
                          <div className="quick-action-icon me-3">
                            <i className="la la-money"></i>
                          </div>
                          <div>
                            <h4 className="quick-action-title">View Earnings</h4>
                            <p className="quick-action-desc">Track your income</p>
                          </div>
                        </a>
                        <a href="/driver/dashboard-profile" className="quick-action-item d-flex align-items-center">
                          <div className="quick-action-icon me-3">
                            <i className="la la-user"></i>
                          </div>
                          <div>
                            <h4 className="quick-action-title">Profile</h4>
                            <p className="quick-action-desc">Update driver info</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Status */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Current Vehicle</h3>
                    </div>
                    <div className="form-content">
                      <div className="vehicle-status">
                        <div className="d-flex align-items-center mb-3">
                          <img src="/html-folder/images/car1.jpg" alt="vehicle" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '5px'}} className="me-3" />
                          <div>
                            <h4 className="mb-1">Toyota Camry 2023</h4>
                            <p className="text-muted mb-0">ABC-1234</p>
                          </div>
                        </div>
                        <div className="vehicle-metrics">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Status:</span>
                            <span className="badge bg-success">Online</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Fuel Level:</span>
                            <span>85%</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Next Service:</span>
                            <span>2,500 km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Chart & Recent Activity */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Weekly Earnings Overview</h3>
                    </div>
                    <div className="form-content">
                      <div className="earnings-chart">
                        {/* Chart placeholder - would integrate with Chart.js or similar */}
                        <div className="chart-placeholder text-center py-5">
                          <i className="la la-bar-chart" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-3">Earnings chart will be displayed here</p>
                          <div className="earnings-summary mt-3">
                            <div className="row text-center">
                              <div className="col-md-3">
                                <h4>$650</h4>
                                <p className="text-muted">This Week</p>
                              </div>
                              <div className="col-md-3">
                                <h4>$580</h4>
                                <p className="text-muted">Last Week</p>
                              </div>
                              <div className="col-md-3">
                                <h4>$2,450</h4>
                                <p className="text-muted">This Month</p>
                              </div>
                              <div className="col-md-3">
                                <h4>15</h4>
                                <p className="text-muted">Trips This Week</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Activity</h3>
                    </div>
                    <div className="form-content">
                      <div className="recent-activity">
                        <div className="activity-item mb-3">
                          <div className="d-flex">
                            <div className="activity-icon me-3">
                              <i className="la la-check-circle text-success"></i>
                            </div>
                            <div>
                              <p className="mb-1"><strong>Trip Completed</strong></p>
                              <small className="text-muted">Manhattan to JFK Airport - $45</small>
                              <br />
                              <small className="text-muted">2 hours ago</small>
                            </div>
                          </div>
                        </div>
                        <div className="activity-item mb-3">
                          <div className="d-flex">
                            <div className="activity-icon me-3">
                              <i className="la la-star text-warning"></i>
                            </div>
                            <div>
                              <p className="mb-1"><strong>New Review Received</strong></p>
                              <small className="text-muted">5 stars from Sarah Wilson</small>
                              <br />
                              <small className="text-muted">4 hours ago</small>
                            </div>
                          </div>
                        </div>
                        <div className="activity-item mb-3">
                          <div className="d-flex">
                            <div className="activity-icon me-3">
                              <i className="la la-money text-info"></i>
                            </div>
                            <div>
                              <p className="mb-1"><strong>Payment Received</strong></p>
                              <small className="text-muted">Weekly payout - $650</small>
                              <br />
                              <small className="text-muted">1 day ago</small>
                            </div>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="d-flex">
                            <div className="activity-icon me-3">
                              <i className="la la-car text-primary"></i>
                            </div>
                            <div>
                              <p className="mb-1"><strong>Vehicle Updated</strong></p>
                              <small className="text-muted">Added new vehicle photos</small>
                              <br />
                              <small className="text-muted">2 days ago</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </>
  );
}
