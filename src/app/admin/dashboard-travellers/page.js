'use client';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardTravellers() {
  const statsCards = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+8%",
      changeType: "positive",
      icon: "la la-users",
      color: "text-color"
    },
    {
      title: "Active Users",
      value: "987",
      change: "+12%",
      changeType: "positive",
      icon: "la la-user-check",
      color: "text-color-2"
    },
    {
      title: "New This Month",
      value: "156",
      change: "+25%",
      changeType: "positive",
      icon: "la la-user-plus",
      color: "text-color-3"
    },
    {
      title: "Total Bookings",
      value: "5,423",
      change: "+18%",
      changeType: "positive",
      icon: "la la-bookmark",
      color: "text-color-4"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Travellers' }
  ];

  return (
    <AdminLayout 
      pageTitle="Travellers Management"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">All Travellers</h3>
                <div className="select-contain">
                  <select className="select-contain-select">
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-content">
              <div className="table-form table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">User</th>
                      <th scope="col">Email</th>
                      <th scope="col">Join Date</th>
                      <th scope="col">Bookings</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm flex-shrink-0 me-2">
                            <img src="/html-folder/images/team8.jpg" alt="avatar" />
                          </div>
                          <div>
                            <span className="font-weight-bold">John Doe</span>
                            <br />
                            <small className="text-muted">ID: #USER001</small>
                          </div>
                        </div>
                      </td>
                      <td>john@example.com</td>
                      <td>Jan 15, 2023</td>
                      <td>
                        <span className="badge bg-info text-white">12</span>
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
                            <a href="/admin/dashboard-traveler-detail" className="dropdown-item">
                              <i className="la la-eye me-2"></i>View Details
                            </a>
                            <a href="#" className="dropdown-item">
                              <i className="la la-edit me-2"></i>Edit
                            </a>
                            <a href="#" className="dropdown-item">
                              <i className="la la-ban me-2"></i>Suspend
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm flex-shrink-0 me-2">
                            <img src="/html-folder/images/team9.jpg" alt="avatar" />
                          </div>
                          <div>
                            <span className="font-weight-bold">Jane Smith</span>
                            <br />
                            <small className="text-muted">ID: #USER002</small>
                          </div>
                        </div>
                      </td>
                      <td>jane@example.com</td>
                      <td>Feb 10, 2023</td>
                      <td>
                        <span className="badge bg-info text-white">8</span>
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
                            <a href="/admin/dashboard-traveler-detail" className="dropdown-item">
                              <i className="la la-eye me-2"></i>View Details
                            </a>
                            <a href="#" className="dropdown-item">
                              <i className="la la-edit me-2"></i>Edit
                            </a>
                            <a href="#" className="dropdown-item">
                              <i className="la la-ban me-2"></i>Suspend
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

