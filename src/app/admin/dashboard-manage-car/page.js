'use client';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardManageCar() {
  const statsCards = [
    {
      title: "Total Cars",
      value: "45",
      change: "+12%",
      changeType: "positive",
      icon: "la la-car",
      color: "text-color"
    },
    {
      title: "Available Cars",
      value: "32",
      change: "+8%",
      changeType: "positive",
      icon: "la la-check-circle",
      color: "text-color-2"
    },
    {
      title: "Rented Cars",
      value: "10",
      change: "+15%",
      changeType: "positive",
      icon: "la la-key",
      color: "text-color-3"
    },
    {
      title: "Maintenance",
      value: "3",
      change: "-5%",
      changeType: "negative",
      icon: "la la-wrench",
      color: "text-color-4"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Manage Cars' }
  ];

  return (
    <AdminLayout 
      pageTitle="Manage Cars"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">All Vehicles</h3>
                <div className="d-flex">
                  <div className="select-contain me-3">
                    <select className="select-contain-select">
                      <option value="all">All Vehicles</option>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <button type="button" className="theme-btn theme-btn-small">
                    <i className="la la-plus me-1"></i>Add New Car
                  </button>
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
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Location</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="car-image me-3">
                            <img src="/html-folder/images/car1.jpg" alt="car" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                          </div>
                          <div>
                            <h3 className="title font-size-15">Toyota Camry 2023</h3>
                            <p className="text font-size-13 text-muted">License: ABC-1234</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="d-block font-size-13">Sedan • Automatic</span>
                          <span className="d-block font-size-13 text-muted">5 Seats • 4 Doors</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-weight-bold">$45</span>
                        <span className="text-muted font-size-13">/day</span>
                      </td>
                      <td><span className="badge bg-success text-white">Available</span></td>
                      <td>New York, NY</td>
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
                              <i className="la la-wrench me-2"></i>Maintenance
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
                          <div className="car-image me-3">
                            <img src="/html-folder/images/car2.jpg" alt="car" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                          </div>
                          <div>
                            <h3 className="title font-size-15">Honda CR-V 2023</h3>
                            <p className="text font-size-13 text-muted">License: XYZ-5678</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="d-block font-size-13">SUV • Automatic</span>
                          <span className="d-block font-size-13 text-muted">7 Seats • 4 Doors</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-weight-bold">$65</span>
                        <span className="text-muted font-size-13">/day</span>
                      </td>
                      <td><span className="badge bg-primary text-white">Rented</span></td>
                      <td>Los Angeles, CA</td>
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
                              <i className="la la-user me-2"></i>Current Rental
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
                          <div className="car-image me-3">
                            <img src="/html-folder/images/car3.jpg" alt="car" style={{width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px'}} />
                          </div>
                          <div>
                            <h3 className="title font-size-15">BMW X3 2023</h3>
                            <p className="text font-size-13 text-muted">License: BMW-9012</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="d-block font-size-13">Luxury SUV • Automatic</span>
                          <span className="d-block font-size-13 text-muted">5 Seats • 4 Doors</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-weight-bold">$95</span>
                        <span className="text-muted font-size-13">/day</span>
                      </td>
                      <td><span className="badge bg-warning text-white">Maintenance</span></td>
                      <td>Miami, FL</td>
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
                              <i className="la la-check me-2"></i>Mark Available
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
    </AdminLayout>
  );
}

