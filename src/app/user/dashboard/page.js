'use client';
import UserLayout from '../../../components/UserLayout';

export default function UserDashboard() {
  const statsCards = [
    {
      title: "Total Bookings",
      value: "12",
      change: "+2 this month",
      changeType: "positive",
      icon: "la la-calendar",
      color: "text-color"
    },
    {
      title: "Reviews",
      value: "8",
      change: "+3 new",
      changeType: "positive",
      icon: "la la-star",
      color: "text-color-2"
    },
    {
      title: "Wishlist Items",
      value: "15",
      change: "+5 added",
      changeType: "positive",
      icon: "la la-heart",
      color: "text-color-3"
    },
    {
      title: "Total Spent",
      value: "$2,450",
      change: "+12% increase",
      changeType: "positive",
      icon: "la la-dollar",
      color: "text-color-4"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'User', href: '/user' },
    { label: 'Dashboard' }
  ];

  return (
    <UserLayout 
      pageTitle="My Dashboard"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="row">
        {/* Recent Bookings */}
                <div className="col-lg-8 responsive-column--m">
                  <div className="form-box dashboard-card">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Recent Bookings</h3>
                        <a href="/user/dashboard-booking" className="theme-btn theme-btn-small">
                          View All
                        </a>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-form table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Service</th>
                              <th scope="col">Date</th>
                              <th scope="col">Amount</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="icon-element icon-element-xs flex-shrink-0 me-3">
                                    <i className="la la-hotel"></i>
                                  </div>
                                  <div>
                                    <h6 className="font-weight-bold">Grand Hotel</h6>
                                    <span className="font-size-13 text-muted">Dec 20-25, 2023</span>
                                  </div>
                                </div>
                              </td>
                              <td>Dec 20, 2023</td>
                              <td>$450.00</td>
                              <td><span className="badge bg-success text-white">Confirmed</span></td>
                            </tr>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="icon-element icon-element-xs flex-shrink-0 me-3">
                                    <i className="la la-plane"></i>
                                  </div>
                                  <div>
                                    <h6 className="font-weight-bold">Flight to Paris</h6>
                                    <span className="font-size-13 text-muted">Dec 18, 2023</span>
                                  </div>
                                </div>
                              </td>
                              <td>Dec 18, 2023</td>
                              <td>$320.00</td>
                              <td><span className="badge bg-warning text-white">Pending</span></td>
                            </tr>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="icon-element icon-element-xs flex-shrink-0 me-3">
                                    <i className="la la-car"></i>
                                  </div>
                                  <div>
                                    <h6 className="font-weight-bold">Car Rental</h6>
                                    <span className="font-size-13 text-muted">Dec 15-20, 2023</span>
                                  </div>
                                </div>
                              </td>
                              <td>Dec 15, 2023</td>
                              <td>$180.00</td>
                              <td><span className="badge bg-success text-white">Confirmed</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Profile Card */}
                <div className="col-lg-4 responsive-column--m">
                  <div className="form-box dashboard-card">
                    <div className="form-title-wrap">
                      <h3 className="title">Profile</h3>
                    </div>
                    <div className="form-content">
                      <div className="user-profile-action d-flex align-items-center pb-4">
                        <div className="user-pro-img">
                          <img src="/html-folder/images/team8.jpg" alt="user-image" />
                        </div>
                        <div className="user-content ms-3">
                          <h4 className="user-name">John Doe</h4>
                          <span className="user-email">john.doe@example.com</span>
                        </div>
                      </div>
                      <div className="section-block"></div>
                      <ul className="list-items list--items pt-3">
                        <li className="d-flex align-items-center justify-content-between">
                          <span>Member Since</span>
                          <span className="font-weight-bold">Jan 2023</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between">
                          <span>Total Bookings</span>
                          <span className="font-weight-bold">12</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between">
                          <span>Total Reviews</span>
                          <span className="font-weight-bold">8</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between">
                          <span>Status</span>
                          <span className="badge bg-success text-white">Active</span>
                        </li>
                      </ul>
                      <div className="btn-box pt-3">
                        <a href="/user/dashboard-profile" className="theme-btn w-100">
                          Edit Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box dashboard-card">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="row">
                        <div className="col-lg-3 col-md-6">
                          <div className="icon-box text-center">
                            <div className="info-icon icon-element icon-element-lg bg-1 mb-3 mx-auto">
                              <i className="la la-plus"></i>
                            </div>
                            <div className="info-content">
                              <h4 className="info__title font-size-16">Book a Hotel</h4>
                              <p className="info__desc font-size-14">Find and book the perfect hotel</p>
                              <a href="/hotels" className="theme-btn theme-btn-small theme-btn-transparent">
                                Book Now
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="icon-box text-center">
                            <div className="info-icon icon-element icon-element-lg bg-2 mb-3 mx-auto">
                              <i className="la la-plane"></i>
                            </div>
                            <div className="info-content">
                              <h4 className="info__title font-size-16">Book a Flight</h4>
                              <p className="info__desc font-size-14">Search and book flights</p>
                              <a href="/flights" className="theme-btn theme-btn-small theme-btn-transparent">
                                Book Now
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="icon-box text-center">
                            <div className="info-icon icon-element icon-element-lg bg-3 mb-3 mx-auto">
                              <i className="la la-car"></i>
                            </div>
                            <div className="info-content">
                              <h4 className="info__title font-size-16">Rent a Car</h4>
                              <p className="info__desc font-size-14">Find the perfect rental car</p>
                              <a href="/cars" className="theme-btn theme-btn-small theme-btn-transparent">
                                Book Now
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="icon-box text-center">
                            <div className="info-icon icon-element icon-element-lg bg-4 mb-3 mx-auto">
                              <i className="la la-map-marker"></i>
                            </div>
                            <div className="info-content">
                              <h4 className="info__title font-size-16">Book a Tour</h4>
                              <p className="info__desc font-size-14">Explore amazing destinations</p>
                              <a href="/tours" className="theme-btn theme-btn-small theme-btn-transparent">
                                Book Now
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="row">
                <div className="col-lg-6 responsive-column--m">
                  <div className="form-box dashboard-card">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Activity</h3>
                    </div>
                    <div className="form-content p-0">
                      <div className="list-group drop-reveal-list">
                        <div className="list-group-item border-top-0">
                          <div className="msg-body d-flex align-items-center">
                            <div className="icon-element icon-element-sm bg-1 flex-shrink-0 me-3">
                              <i className="la la-check"></i>
                            </div>
                            <div className="msg-content w-100">
                              <h3 className="title pb-1 font-size-15">Hotel booking confirmed</h3>
                              <p className="msg-text font-size-13">Grand Hotel - Dec 20, 2023</p>
                            </div>
                            <span className="font-size-12 text-muted">2 hours ago</span>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="msg-body d-flex align-items-center">
                            <div className="icon-element icon-element-sm bg-2 flex-shrink-0 me-3">
                              <i className="la la-star"></i>
                            </div>
                            <div className="msg-content w-100">
                              <h3 className="title pb-1 font-size-15">Review submitted</h3>
                              <p className="msg-text font-size-13">5 stars for City Hotel</p>
                            </div>
                            <span className="font-size-12 text-muted">1 day ago</span>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="msg-body d-flex align-items-center">
                            <div className="icon-element icon-element-sm bg-3 flex-shrink-0 me-3">
                              <i className="la la-heart"></i>
                            </div>
                            <div className="msg-content w-100">
                              <h3 className="title pb-1 font-size-15">Added to wishlist</h3>
                              <p className="msg-text font-size-13">Beach Resort Villa</p>
                            </div>
                            <span className="font-size-12 text-muted">3 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="col-lg-6 responsive-column--m">
                  <div className="form-box dashboard-card">
                    <div className="form-title-wrap">
                      <h3 className="title">Account Status</h3>
                    </div>
                    <div className="form-content pb-0">
                      <div className="dashboard-progressbar pb-4">
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-striped bg-success"
                            role="progressbar"
                            style={{ width: '85%' }}
                            aria-valuenow="85"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p className="font-size-14 pt-1">Profile Completion: 85%</p>
                      </div>
                      <div className="dashboard-progressbar pb-4">
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-striped bg-info"
                            role="progressbar"
                            style={{ width: '70%' }}
                            aria-valuenow="70"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p className="font-size-14 pt-1">Travel Preferences: 70%</p>
                      </div>
                      <div className="dashboard-progressbar pb-4">
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-striped bg-warning"
                            role="progressbar"
                            style={{ width: '60%' }}
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p className="font-size-14 pt-1">Loyalty Points: 600/1000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </UserLayout>
  );
}
