'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DriverDashboardSettings() {
  const [settings, setSettings] = useState({
    accountStatus: true,
    twoFactor: true,
    onlineStatus: true,
    autoAccept: false,
    notifications: {
      trips: true,
      payments: true,
      messages: true,
      maintenance: true,
      promotions: false,
      weeklyReports: true
    }
  });

  const handleSaveSettings = () => {
    // API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard-bread-2">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Settings</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><Link href="/" className="text-white">Home</Link></li>
                      <li><Link href="/driver/dashboard" className="text-white">Dashboard</Link></li>
                      <li>Settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  {/* Account Settings */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Account Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Account Status</h5>
                            <p className="text-muted mb-0">Your driving account is currently active</p>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="accountStatus" defaultChecked />
                            <label className="form-check-label" htmlFor="accountStatus">Active</label>
                          </div>
                        </div>
                        
                        <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Two-Factor Authentication</h5>
                            <p className="text-muted mb-0">Add an extra layer of security to your account</p>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="twoFactor" defaultChecked />
                            <label className="form-check-label" htmlFor="twoFactor">Enabled</label>
                          </div>
                        </div>
                        
                        <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Online Visibility</h5>
                            <p className="text-muted mb-0">Show as available for trip assignments</p>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="onlineStatus" defaultChecked />
                            <label className="form-check-label" htmlFor="onlineStatus">Online</label>
                          </div>
                        </div>
                        
                        <div className="setting-item d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1">Auto-Accept Trips</h5>
                            <p className="text-muted mb-0">Automatically accept compatible trip requests</p>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="autoAccept" />
                            <label className="form-check-label" htmlFor="autoAccept">Disabled</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trip Preferences */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Trip Preferences</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Maximum Trip Distance (miles)</label>
                              <div className="form-group">
                                <span className="form-icon">
                                  <i className="la la-road"></i>
                                </span>
                                <input
                                  className="form-control"
                                  type="number"
                                  name="max_distance"
                                  defaultValue="50"
                                  placeholder="Maximum trip distance"
                                  min="1"
                                  max="500"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Preferred Trip Types</label>
                              <div className="preference-checkboxes">
                                <div className="form-check mb-2">
                                  <input className="form-check-input" type="checkbox" id="shortTrips" defaultChecked />
                                  <label className="form-check-label" htmlFor="shortTrips">
                                    Short Distance (under 10 miles)
                                  </label>
                                </div>
                                <div className="form-check mb-2">
                                  <input className="form-check-input" type="checkbox" id="mediumTrips" defaultChecked />
                                  <label className="form-check-label" htmlFor="mediumTrips">
                                    Medium Distance (10-30 miles)
                                  </label>
                                </div>
                                <div className="form-check mb-2">
                                  <input className="form-check-input" type="checkbox" id="longTrips" />
                                  <label className="form-check-label" htmlFor="longTrips">
                                    Long Distance (30+ miles)
                                  </label>
                                </div>
                                <div className="form-check mb-2">
                                  <input className="form-check-input" type="checkbox" id="airportTrips" defaultChecked />
                                  <label className="form-check-label" htmlFor="airportTrips">
                                    Airport Transfers
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" id="premiumTrips" defaultChecked />
                                  <label className="form-check-label" htmlFor="premiumTrips">
                                    Premium/Luxury Rides
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  {/* Notification Settings */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Notification Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Trip Requests</h5>
                          <p className="text-muted mb-0">Get notified about new trip requests</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="tripNotifications" defaultChecked />
                          <label className="form-check-label" htmlFor="tripNotifications">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Payment Updates</h5>
                          <p className="text-muted mb-0">Notifications about payments and earnings</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="paymentNotifications" defaultChecked />
                          <label className="form-check-label" htmlFor="paymentNotifications">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Passenger Messages</h5>
                          <p className="text-muted mb-0">Messages from passengers</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="messageNotifications" defaultChecked />
                          <label className="form-check-label" htmlFor="messageNotifications">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Vehicle Maintenance</h5>
                          <p className="text-muted mb-0">Reminders for vehicle service and maintenance</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="maintenanceNotifications" defaultChecked />
                          <label className="form-check-label" htmlFor="maintenanceNotifications">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Promotional Offers</h5>
                          <p className="text-muted mb-0">Special offers and bonuses</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="promoNotifications" />
                          <label className="form-check-label" htmlFor="promoNotifications">Off</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Weekly Reports</h5>
                          <p className="text-muted mb-0">Weekly driving and earnings summary</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="weeklyReports" defaultChecked />
                          <label className="form-check-label" htmlFor="weeklyReports">On</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Privacy Settings */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Privacy Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Location Sharing</h5>
                          <p className="text-muted mb-0">Share your location with passengers during trips</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="locationSharing" defaultChecked />
                          <label className="form-check-label" htmlFor="locationSharing">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Data Analytics</h5>
                          <p className="text-muted mb-0">Help improve KiraStay by sharing anonymous usage data</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="dataAnalytics" defaultChecked />
                          <label className="form-check-label" htmlFor="dataAnalytics">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Profile Visibility</h5>
                          <p className="text-muted mb-0">Show your profile to passengers</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="profileVisibility" defaultChecked />
                          <label className="form-check-label" htmlFor="profileVisibility">Public</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Settings */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Security</h3>
                    </div>
                    <div className="form-content">
                      <div className="security-actions">
                        <div className="action-item d-flex justify-content-between align-items-center mb-3 p-3" style={{background: '#f8f9fa', borderRadius: '8px'}}>
                          <div>
                            <h5 className="mb-1">Change Password</h5>
                            <p className="text-muted mb-0">Update your account password</p>
                          </div>
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="la la-key me-1"></i>Update
                          </button>
                        </div>
                        
                        <div className="action-item d-flex justify-content-between align-items-center mb-3 p-3" style={{background: '#f8f9fa', borderRadius: '8px'}}>
                          <div>
                            <h5 className="mb-1">Login Activity</h5>
                            <p className="text-muted mb-0">View your recent login history</p>
                          </div>
                          <button className="btn btn-outline-info btn-sm">
                            <i className="la la-history me-1"></i>View
                          </button>
                        </div>
                        
                        <div className="action-item d-flex justify-content-between align-items-center p-3" style={{background: '#f8f9fa', borderRadius: '8px'}}>
                          <div>
                            <h5 className="mb-1">Deactivate Account</h5>
                            <p className="text-muted mb-0">Temporarily deactivate your driver account</p>
                          </div>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="la la-times-circle me-1"></i>Deactivate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  {/* Working Hours */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Working Hours</h3>
                    </div>
                    <div className="form-content">
                      <div className="working-hours">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                          <div key={day} className="day-schedule d-flex justify-content-between align-items-center mb-3 p-3" style={{background: '#f8f9fa', borderRadius: '8px'}}>
                            <div className="day-info d-flex align-items-center">
                              <div className="form-check me-3">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id={`${day.toLowerCase()}Available`} 
                                  defaultChecked={index < 5} // Mon-Fri checked by default
                                />
                              </div>
                              <span className="fw-bold">{day}</span>
                            </div>
                            <div className="time-inputs d-flex align-items-center">
                              <input 
                                type="time" 
                                className="form-control form-control-sm me-2" 
                                defaultValue="08:00"
                                style={{width: '90px'}}
                              />
                              <span className="me-2">to</span>
                              <input 
                                type="time" 
                                className="form-control form-control-sm" 
                                defaultValue="18:00"
                                style={{width: '90px'}}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Settings */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Payment Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Preferred Payout Method</label>
                              <div className="form-group">
                                <div className="select-contain w-100">
                                  <select className="select-contain-select">
                                    <option value="bank_transfer" selected>Bank Transfer</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="digital_wallet">Digital Wallet</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Payout Frequency</label>
                              <div className="form-group">
                                <div className="select-contain w-100">
                                  <select className="select-contain-select">
                                    <option value="daily">Daily</option>
                                    <option value="weekly" selected>Weekly</option>
                                    <option value="bi_weekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bank-details mt-3 p-3" style={{background: '#f8f9fa', borderRadius: '8px'}}>
                          <h5 className="mb-3">Current Bank Account</h5>
                          <p className="mb-1"><strong>Bank:</strong> Chase Bank</p>
                          <p className="mb-1"><strong>Account:</strong> ****1234</p>
                          <p className="mb-3"><strong>Routing:</strong> ****5678</p>
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="la la-edit me-1"></i>Update Bank Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App Preferences */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">App Preferences</h3>
                    </div>
                    <div className="form-content">
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Dark Mode</h5>
                          <p className="text-muted mb-0">Switch to dark theme</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="darkMode" />
                          <label className="form-check-label" htmlFor="darkMode">Off</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Sound Alerts</h5>
                          <p className="text-muted mb-0">Play sounds for notifications</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="soundAlerts" defaultChecked />
                          <label className="form-check-label" htmlFor="soundAlerts">On</label>
                        </div>
                      </div>
                      
                      <div className="setting-item d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Navigation Voice</h5>
                          <p className="text-muted mb-0">Voice guidance during trips</p>
                        </div>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="voiceNavigation" defaultChecked />
                          <label className="form-check-label" htmlFor="voiceNavigation">On</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-content">
                      <div className="btn-box text-center">
                        <button 
                          type="submit" 
                          className="theme-btn"
                          onClick={handleSaveSettings}
                        >
                          <i className="la la-save me-2"></i>Save All Settings
                        </button>
                        <button type="button" className="theme-btn theme-btn-transparent ms-3">
                          <i className="la la-refresh me-2"></i>Reset to Default
                        </button>
                        <Link href="/driver/dashboard" className="theme-btn theme-btn-small theme-btn-transparent ms-3">
                          <i className="la la-arrow-left me-2"></i>Back to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
