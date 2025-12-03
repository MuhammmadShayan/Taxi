'use client';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardSettings() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Settings' }
  ];

  return (
    <AdminLayout 
      pageTitle="Settings"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">General Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form action="#">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Site Title</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="site_title"
                                    defaultValue="Kirastay - Travel Booking"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Site Description</label>
                                <div className="form-group">
                                  <textarea
                                    className="form-control"
                                    name="site_description"
                                    rows="4"
                                    defaultValue="Travel booking platform for cars, hotels, and more"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">Admin Email</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="email"
                                    name="admin_email"
                                    defaultValue="admin@kirastay.com"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">Contact Phone</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="tel"
                                    name="contact_phone"
                                    defaultValue="+1 234 567 8900"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <div className="form-group">
                                  <div className="custom-checkbox">
                                    <input type="checkbox" id="maintenance_mode" />
                                    <label htmlFor="maintenance_mode">Enable Maintenance Mode</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="btn-box">
                                <button className="theme-btn" type="submit">
                                  Save Settings
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Email Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form action="#">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">SMTP Host</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="smtp_host"
                                    placeholder="smtp.gmail.com"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">SMTP Port</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="smtp_port"
                                    defaultValue="587"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-box">
                                <label className="label-text">SMTP Security</label>
                                <div className="form-group">
                                  <select className="form-control">
                                    <option value="tls">TLS</option>
                                    <option value="ssl">SSL</option>
                                    <option value="none">None</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">SMTP Username</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="email"
                                    name="smtp_username"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">SMTP Password</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="password"
                                    name="smtp_password"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="btn-box">
                                <button className="theme-btn" type="submit">
                                  Save Email Settings
                                </button>
                                <button className="theme-btn theme-btn-transparent ms-2" type="button">
                                  Test Email
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Settings */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Payment Gateway Settings</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form action="#">
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="input-box">
                                <label className="label-text">PayPal Client ID</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="paypal_client_id"
                                    placeholder="Enter PayPal Client ID"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="input-box">
                                <label className="label-text">Stripe Publishable Key</label>
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="stripe_publishable_key"
                                    placeholder="Enter Stripe Publishable Key"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="input-box">
                                <label className="label-text">Default Currency</label>
                                <div className="form-group">
                                  <select className="form-control">
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <div className="form-group">
                                  <div className="custom-checkbox">
                                    <input type="checkbox" id="paypal_enabled" defaultChecked />
                                    <label htmlFor="paypal_enabled">Enable PayPal</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <div className="form-group">
                                  <div className="custom-checkbox">
                                    <input type="checkbox" id="stripe_enabled" defaultChecked />
                                    <label htmlFor="stripe_enabled">Enable Stripe</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="btn-box">
                                <button className="theme-btn" type="submit">
                                  Save Payment Settings
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      </div>
    </AdminLayout>
  );
}

