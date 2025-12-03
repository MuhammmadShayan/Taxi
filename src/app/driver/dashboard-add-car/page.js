'use client';

export default function DriverDashboardAddCar() {
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
                      <h2 className="sec__title font-size-30 text-white">Register New Vehicle</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><a href="/" className="text-white">Home</a></li>
                      <li><a href="/driver/dashboard" className="text-white">Dashboard</a></li>
                      <li><a href="/driver/dashboard-manage-car" className="text-white">My Vehicles</a></li>
                      <li>Add Vehicle</li>
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
                      <h3 className="title">Vehicle Information</h3>
                      <p className="text-muted">Please provide accurate details about your vehicle for verification</p>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Vehicle Make <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-car"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="vehicle_make"
                                    placeholder="e.g. Toyota, Honda, BMW"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Vehicle Model <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-car"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="vehicle_model"
                                    placeholder="e.g. Camry, Accord, X3"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Manufacturing Year <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-calendar"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="manufacturing_year"
                                    placeholder="2023"
                                    min="2000"
                                    max="2025"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">License Plate <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-id-badge"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="license_plate"
                                    placeholder="ABC-1234"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Vehicle Color <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-paint-brush"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="vehicle_color"
                                    placeholder="e.g. Black, White, Silver"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Vehicle Type <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select" required>
                                      <option value="">Select Vehicle Type</option>
                                      <option value="sedan">Sedan</option>
                                      <option value="suv">SUV</option>
                                      <option value="hatchback">Hatchback</option>
                                      <option value="luxury">Luxury</option>
                                      <option value="minivan">Minivan</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Transmission <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <div className="select-contain w-100">
                                    <select className="select-contain-select" required>
                                      <option value="">Select Transmission</option>
                                      <option value="automatic">Automatic</option>
                                      <option value="manual">Manual</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Seating Capacity <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-users"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="seating_capacity"
                                    placeholder="5"
                                    min="2"
                                    max="8"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Number of Doors</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-door-open"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="num_doors"
                                    placeholder="4"
                                    min="2"
                                    max="6"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Current Mileage (km)</label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-tachometer"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="mileage"
                                    placeholder="25000"
                                    min="0"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-box">
                                <label className="label-text">Vehicle Features & Amenities</label>
                                <div className="form-group">
                                  <textarea
                                    className="message-control form-control"
                                    name="features"
                                    placeholder="List key features (e.g., Air Conditioning, GPS Navigation, Bluetooth, Child Seats, etc.)"
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  
                  {/* Insurance & Registration */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Insurance & Registration Details</h3>
                    </div>
                    <div className="form-content">
                      <div className="contact-form-action">
                        <form method="post">
                          <div className="row">
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Insurance Provider <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-shield"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="insurance_provider"
                                    placeholder="Insurance Company Name"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Insurance Policy Number <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-file-text"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="insurance_policy"
                                    placeholder="Policy Number"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Insurance Expiry Date <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-calendar"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="date"
                                    name="insurance_expiry"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 responsive-column">
                              <div className="input-box">
                                <label className="label-text">Registration Expiry Date <span className="text-danger">*</span></label>
                                <div className="form-group">
                                  <span className="form-icon">
                                    <i className="la la-calendar"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    type="date"
                                    name="registration_expiry"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Vehicle Photos</h3>
                    </div>
                    <div className="form-content">
                      <div className="file-upload-wrap">
                        <input type="file" name="vehicle_photos[]" id="vehicle_photos" className="file-upload-input" multiple accept="image/*" required />
                        <div className="file-upload-item">
                          <div className="file-upload-icon">
                            <i className="la la-camera"></i>
                          </div>
                          <div className="file-upload-text">
                            <h3 className="file-upload-title">Upload Vehicle Photos</h3>
                            <p className="file-upload-hint">Upload multiple photos of your vehicle (Front, Back, Interior, etc.)</p>
                            <div className="file-upload-btn">
                              <span>Choose Photos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Required Documents</h3>
                    </div>
                    <div className="form-content">
                      <div className="document-uploads">
                        <div className="document-item mb-3">
                          <label className="label-text">Vehicle Registration <span className="text-danger">*</span></label>
                          <div className="file-upload-wrap file-upload-wrap-small">
                            <input type="file" name="registration_doc" className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" required />
                            <div className="file-upload-item">
                              <div className="file-upload-text text-center">
                                <i className="la la-file-pdf-o"></i>
                                <span>Upload Registration</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="document-item mb-3">
                          <label className="label-text">Insurance Certificate <span className="text-danger">*</span></label>
                          <div className="file-upload-wrap file-upload-wrap-small">
                            <input type="file" name="insurance_doc" className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" required />
                            <div className="file-upload-item">
                              <div className="file-upload-text text-center">
                                <i className="la la-shield"></i>
                                <span>Upload Insurance</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="document-item">
                          <label className="label-text">Vehicle Inspection Report</label>
                          <div className="file-upload-wrap file-upload-wrap-small">
                            <input type="file" name="inspection_doc" className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" />
                            <div className="file-upload-item">
                              <div className="file-upload-text text-center">
                                <i className="la la-check-square-o"></i>
                                <span>Upload Inspection</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Verification Status</h3>
                    </div>
                    <div className="form-content">
                      <div className="verification-info">
                        <div className="alert alert-info">
                          <i className="la la-info-circle me-2"></i>
                          <strong>Document Verification</strong>
                          <p className="mb-0 mt-2">Your documents will be reviewed within 24-48 hours. You'll receive an email notification once approved.</p>
                        </div>
                        
                        <div className="verification-checklist mt-3">
                          <h6>Required for Approval:</h6>
                          <ul className="list-unstyled">
                            <li><i className="la la-check text-success me-2"></i>Valid driver's license</li>
                            <li><i className="la la-times text-danger me-2"></i>Vehicle photos uploaded</li>
                            <li><i className="la la-times text-danger me-2"></i>Registration document</li>
                            <li><i className="la la-times text-danger me-2"></i>Insurance certificate</li>
                            <li><i className="la la-times text-danger me-2"></i>Background check completed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terms and Submit */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-content">
                      <div className="terms-agreement">
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" value="" id="terms_agreement" required />
                          <label className="form-check-label" htmlFor="terms_agreement">
                            I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Driver Agreement</a>
                          </label>
                        </div>
                        <div className="form-check mb-4">
                          <input className="form-check-input" type="checkbox" value="" id="insurance_confirmation" required />
                          <label className="form-check-label" htmlFor="insurance_confirmation">
                            I confirm that my vehicle insurance covers commercial/ride-sharing activities
                          </label>
                        </div>
                      </div>
                      
                      <div className="btn-box">
                        <button type="submit" className="theme-btn">
                          <i className="la la-car me-2"></i>Register Vehicle
                        </button>
                        <a href="/driver/dashboard-manage-car" className="theme-btn theme-btn-transparent ms-3">
                          <i className="la la-arrow-left me-2"></i>Back to My Vehicles
                        </a>
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
