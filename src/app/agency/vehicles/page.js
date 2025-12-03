'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgencyVehicles() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusSaving, setStatusSaving] = useState({});

  useEffect(() => {
    if (!authLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch vehicles data
  useEffect(() => {
    if (user && ['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agency/vehicles', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVehicles(data.vehicles || []);
        } else {
          setError(data.error || 'Failed to fetch vehicles');
        }
      } else {
        setError('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Error fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-success';
      case 'rented': return 'bg-danger';
      case 'maintenance': return 'bg-warning';
      case 'inactive': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };

  const updateVehicleStatus = async (vehicle, newStatus) => {
    if (!vehicle || vehicle.status === newStatus) return;
    const id = vehicle.vehicle_id;
    const prev = vehicles.map(v => ({ ...v }));
    // Optimistic update
    setVehicles(vs => vs.map(v => v.vehicle_id === id ? { 
      ...v, 
      status: newStatus, 
      status_display: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) 
    } : v));
    setStatusSaving(s => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/agency/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update status');
    } catch (e) {
      // Revert on failure
      setVehicles(prev);
      alert(`Failed to update status: ${e.message}`);
    } finally {
      setStatusSaving(s => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'small_car': return 'bg-primary';
      case 'suv': return 'bg-info';
      case 'luxury': return 'bg-warning';
      case 'van': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getVehicleImage = (vehicle) => {
    // Try to get the first image from parsed_images
    if (vehicle.first_image) {
      // Handle different image path formats
      let imagePath = vehicle.first_image;
      
      // If it's a full path starting with /images, use it directly
      if (imagePath.startsWith('/images/')) {
        return imagePath;
      }
      // If it's just a filename, prepend the images directory
      else if (!imagePath.startsWith('http')) {
        return `/images/cars/${imagePath}`;
      }
      // If it's already a full URL, use it
      else {
        return imagePath;
      }
    }
    
    // Fallback to car image API based on vehicle info
    if (vehicle.brand && vehicle.model) {
      const make = vehicle.brand.toLowerCase();
      const model = vehicle.model.toLowerCase().replace(/\s+/g, '-');
      const year = vehicle.year || new Date().getFullYear();
      
      // Try to use a car image API (example with placeholder service)
      return `https://images.unsplash.com/400x300/?car,${make},${model},${year}`;
    }
    
    // Last resort - branded placeholder
    return `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent('🚗 Vehicle Image')}`;
  };

  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
    return null;
  }

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <div className="section-bg">
        {/* Agency Sidebar Navigation */}
        <div className="sidebar-nav sidebar--nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team8.jpg" 
                    alt="Agency avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">{user.first_name} {user.last_name}</h4>
                  <span className="author__meta">Agency Owner</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu toggle-menu list-items">
                <li>
                  <Link href="/agency/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/agency/profile">
                    <i className="la la-user me-2 text-color"></i>My Profile
                  </Link>
                </li>
                <li className="page-active">
                  <Link href="/agency/vehicles">
                    <i className="la la-car me-2 text-color-2"></i>My Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/agency/bookings">
                    <i className="la la-shopping-cart me-2 text-color-3"></i>Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/chat">
                    <i className="la la-comments me-2 text-color-4"></i>Chat
                  </Link>
                </li>
                <li>
                  <Link href="/agency/earnings">
                    <i className="la la-money me-2 text-color-5"></i>Earnings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/reviews">
                    <i className="la la-star me-2 text-color-5"></i>Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/agency/settings">
                    <i className="la la-cog me-2 text-color-6"></i>Settings
                  </Link>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    <i className="la la-power-off me-2 text-color-7"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <section className="dashboard-area">
          <div className="dashboard-nav dashboard--nav">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="menu-wrapper">
                    <div className="logo me-5">
                      <Link href="/">
                        <img 
                          src="/html-folder/images/logo.png" 
                          alt="HOLIKEY logo"
                          style={{ maxHeight: '40px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EHOLIKEY%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </Link>
                      <div className="menu-toggler">
                        <i className="la la-bars"></i>
                        <i className="la la-times"></i>
                      </div>
                      <div className="user-menu-open">
                        <i className="la la-user"></i>
                      </div>
                    </div>
                    <div className="nav-btn ms-auto">
                      <div className="notification-wrap d-flex align-items-center">
                        <div className="notification-item">
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle"
                              id="userDropdownMenu"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img 
                                    src="/html-folder/images/team8.jpg" 
                                    alt="Agency avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <span className="font-size-14 font-weight-bold">{user.first_name}</span>
                              </div>
                            </a>
                            <div className="dropdown-menu dropdown-reveal dropdown-menu-xl dropdown-menu-right">
                              <div className="list-group drop-reveal-list user-drop-reveal-list">
                                <Link href="/agency/profile" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-user me-2"></i>My Profile
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/agency/dashboard" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-dashboard me-2"></i>Dashboard
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <div className="section-block"></div>
                                <a 
                                  href="#" 
                                  className="list-group-item list-group-item-action"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                  }}
                                >
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-power-off me-2"></i>Logout
                                      </h3>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-bread dashboard--bread">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Vehicle Management</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <Link href="/agency/vehicles/add" className="theme-btn text-white">
                    <i className="la la-plus me-1"></i>Add New Vehicle
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Your Vehicle Fleet</h3>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        {loading ? (
                          <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading vehicles...</span>
                            </div>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger" role="alert">
                            <i className="la la-exclamation-triangle me-2"></i>
                            {error}
                          </div>
                        ) : vehicles.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="la la-car" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3 text-muted">No vehicles found</h5>
                            <p className="text-muted">Add your first vehicle to start managing your fleet.</p>
                            <Link href="/agency/vehicles/add" className="btn btn-primary">
                              <i className="la la-plus me-1"></i>Add Vehicle
                            </Link>
                          </div>
                        ) : (
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Price/Day</th>
                                <th>Bookings</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vehicles.map((vehicle) => (
                                <tr key={vehicle.vehicle_id}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img 
                                        src={getVehicleImage(vehicle)}
                                        alt={vehicle.vehicle_display_name}
                                        className="vehicle-thumb me-3"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          // Try a generic car image first
                                          if (!e.target.src.includes('placeholder')) {
                                            e.target.src = `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent(`${vehicle.brand || 'Vehicle'} ${vehicle.model || ''}`).substring(0, 20)}`;
                                          }
                                        }}
                                      />
                                      <div>
                                        <h6 className="mb-0">{vehicle.vehicle_display_name}</h6>
                                        <small className="text-muted">{vehicle.year} Model</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`badge ${getTypeBadgeClass(vehicle.type)}`}>
                                      {vehicle.type_display}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      <span className={`badge ${getStatusBadgeClass(vehicle.status)}`}>
                                        {vehicle.status_display}
                                      </span>
                                      <select
                                        className="form-select form-select-sm w-auto"
                                        value={vehicle.status}
                                        disabled={!!statusSaving[vehicle.vehicle_id]}
                                        onChange={(e) => updateVehicleStatus(vehicle, e.target.value)}
                                        aria-label={`Change status for ${vehicle.vehicle_display_name}`}
                                      >
                                        <option value="available">Available</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="inactive">Inactive</option>
                                      </select>
                                      {statusSaving[vehicle.vehicle_id] && (
                                        <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true"></span>
                                      )}
                                    </div>
                                  </td>
                                  <td>{vehicle.daily_rate_formatted}</td>
                                  <td>
                                    <div className="progress" style={{height: '6px'}}>
                                      <div 
                                        className="progress-bar bg-success" 
                                        role="progressbar" 
                                        style={{width: `${Math.min(vehicle.booking_rate, 100)}%`}}
                                      ></div>
                                    </div>
                                    <small className="text-muted">
                                      {vehicle.total_bookings} booking{vehicle.total_bookings !== 1 ? 's' : ''} total
                                    </small>
                                  </td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button 
                                        className="btn btn-sm btn-outline-primary"
                                        title="Edit Vehicle"
                                        onClick={() => router.push(`/agency/vehicles/${vehicle.vehicle_id}`)}
                                      >
                                        <i className="la la-edit"></i>
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-outline-success"
                                        title="View Details"
                                        onClick={() => router.push(`/agency/vehicles/${vehicle.vehicle_id}`)}
                                      >
                                        <i className="la la-eye"></i>
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-outline-danger"
                                        title="Delete Vehicle"
                                        onClick={async () => {
                                          if (!confirm(`Delete ${vehicle.vehicle_display_name}? This cannot be undone.`)) return;
                                          try {
                                            const res = await fetch(`/api/agency/vehicles/${vehicle.vehicle_id}`, { method: 'DELETE' });
                                            const data = await res.json();
                                            if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete');
                                            // Refresh list
                                            fetchVehicles();
                                          } catch (e) {
                                            alert(`Failed to delete: ${e.message}`);
                                          }
                                        }}
                                      >
                                        <i className="la la-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .dashboard-area {
          margin-left: 280px;
          background-color: #f8f9fa;
        }
        
        .vehicle-thumb {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .progress {
          border-radius: 10px;
        }
        
        .btn-group .btn {
          margin-right: 0.25rem;
        }
        
        .table th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
        }
        
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </>
  );
}

