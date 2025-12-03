'use client';

import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardAddCar() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Manage Cars', href: '/admin/dashboard-manage-car' },
    { label: 'Add Car' }
  ];

  return (
    <AdminLayout 
      pageTitle="Add New Car"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-title-wrap">
                <h3 className="title">Car Information</h3>
              </div>
              <div className="form-content">
                <div className="contact-form-action">
                  <form method="post">
                    <div className="row">
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Car Make</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-car"></i>
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              name="car_make"
                              placeholder="e.g. Toyota"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Car Model</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-car"></i>
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              name="car_model"
                              placeholder="e.g. Camry"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Year</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-calendar"></i>
                            </span>
                            <input
                              className="form-control"
                              type="number"
                              name="year"
                              placeholder="2023"
                              min="2000"
                              max="2025"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 responsive-column">
                        <div className="input-box">
                          <label className="label-text">License Plate</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-id-badge"></i>
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              name="license_plate"
                              placeholder="ABC-1234"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Color</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-paint-brush"></i>
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              name="color"
                              placeholder="e.g. Black"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Car Type</label>
                          <div className="form-group">
                            <div className="select-contain w-100">
                              <select className="select-contain-select">
                                <option value="">Select Car Type</option>
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="luxury">Luxury</option>
                                <option value="sports">Sports</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Transmission</label>
                          <div className="form-group">
                            <div className="select-contain w-100">
                              <select className="select-contain-select">
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
                          <label className="label-text">Seats</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-users"></i>
                            </span>
                            <input
                              className="form-control"
                              type="number"
                              name="seats"
                              placeholder="5"
                              min="2"
                              max="15"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Doors</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-door-open"></i>
                            </span>
                            <input
                              className="form-control"
                              type="number"
                              name="doors"
                              placeholder="4"
                              min="2"
                              max="6"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Price Per Day ($)</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-dollar"></i>
                            </span>
                            <input
                              className="form-control"
                              type="number"
                              name="price_per_day"
                              placeholder="45"
                              min="10"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Location</label>
                          <div className="form-group">
                            <span className="form-icon">
                              <i className="la la-map-marker"></i>
                            </span>
                            <input
                              className="form-control"
                              type="text"
                              name="location"
                              placeholder="e.g. New York, NY"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Status</label>
                          <div className="form-group">
                            <div className="select-contain w-100">
                              <select className="select-contain-select">
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-box">
                          <label className="label-text">Features & Amenities</label>
                          <div className="form-group">
                            <textarea
                              className="message-control form-control"
                              name="features"
                              placeholder="List car features separated by commas (e.g. Air Conditioning, GPS Navigation, Bluetooth, etc.)"
                              rows="4"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Car Images Upload */}
            <div className="form-box">
              <div className="form-title-wrap">
                <h3 className="title">Car Images</h3>
              </div>
              <div className="form-content">
                <div className="file-upload-wrap">
                  <input type="file" name="car_images[]" id="car_images" className="file-upload-input" multiple accept="image/*" />
                  <div className="file-upload-item">
                    <div className="file-upload-icon">
                      <i className="la la-cloud-upload"></i>
                    </div>
                    <div className="file-upload-text">
                      <h3 className="file-upload-title">Drop files here or <span className="file-upload-btn">choose files</span></h3>
                      <p className="file-upload-hint">Upload multiple images of the car (Front, Interior, Side views, etc.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="btn-box">
              <button type="submit" className="theme-btn">
                <i className="la la-save me-2"></i>Add Car
              </button>
              <a href="/admin/dashboard-manage-car" className="theme-btn theme-btn-transparent ms-3">
                <i className="la la-arrow-left me-2"></i>Back to Cars
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

