'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';

export default function VehicleDetails() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchVehicleDetails();
    }
  }, [params.id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/vehicles/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch vehicle details');
      const data = await response.json();
      setVehicle(data.vehicle);
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      setError('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'rented': return 'bg-info';
      case 'maintenance': return 'bg-warning';
      case 'inactive': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'luxury': return 'bg-warning';
      case 'suv': return 'bg-success';
      case 'sedan': return 'bg-primary';
      case 'small_car': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Vehicles', href: '/admin/vehicles' },
    { label: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle Details' }
  ];

  if (loading) {
    return (
      <AdminLayout pageTitle="Vehicle Details" breadcrumbItems={breadcrumbItems}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <AdminLayout pageTitle="Vehicle Details" breadcrumbItems={breadcrumbItems}>
        <div className="alert alert-danger">
          <i className="la la-exclamation-triangle me-2"></i>
          {error || 'Vehicle not found'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      pageTitle={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        {/* Vehicle Information */}
        <div className="col-lg-8">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">Vehicle Information</h3>
                <div>
                  <button 
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => router.push(`/admin/vehicles/${params.id}/edit`)}
                  >
                    <i className="la la-edit me-1"></i>Edit
                  </button>
                  <button 
                    className="btn btn-info btn-sm"
                    onClick={() => router.push(`/admin/vehicles/${params.id}/history`)}
                  >
                    <i className="la la-history me-1"></i>History
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-content">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Vehicle ID</label>
                    <p className="form-control-static">#{vehicle.vehicle_id}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Vehicle Number</label>
                    <p className="form-control-static">{vehicle.vehicle_number}</p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Brand</label>
                    <p className="form-control-static">{vehicle.brand}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Model</label>
                    <p className="form-control-static">{vehicle.model}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Year</label>
                    <p className="form-control-static">{vehicle.year}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Type</label>
                    <p className="form-control-static">
                      <span className={`badge ${getTypeBadgeClass(vehicle.type)}`}>
                        {vehicle.type?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Status</label>
                    <p className="form-control-static">
                      <span className={`badge ${getStatusBadgeClass(vehicle.status)}`}>
                        {vehicle.status?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Energy Type</label>
                    <p className="form-control-static">{vehicle.energy?.toUpperCase()}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Transmission</label>
                    <p className="form-control-static">{vehicle.gear_type?.toUpperCase()}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="label-text">Seats</label>
                    <p className="form-control-static">{vehicle.seats}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Daily Rate</label>
                    <p className="form-control-static">
                      <strong className="text-primary">{formatCurrency(vehicle.daily_rate)}</strong>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Agency</label>
                    <p className="form-control-static">{vehicle.agency_name}</p>
                  </div>
                </div>
                
                {vehicle.description && (
                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label className="label-text">Description</label>
                      <p className="form-control-static">{vehicle.description}</p>
                    </div>
                  </div>
                )}
                
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Created Date</label>
                    <p className="form-control-static">{formatDate(vehicle.created_at)}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="label-text">Last Updated</label>
                    <p className="form-control-static">{formatDate(vehicle.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="col-lg-4">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Booking Statistics</h3>
            </div>
            
            <div className="form-content">
              <div className="stats-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Bookings</span>
                  <strong>{vehicle.total_bookings || 0}</strong>
                </div>
              </div>
              <div className="stats-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Active Bookings</span>
                  <strong className="text-info">{vehicle.active_bookings || 0}</strong>
                </div>
              </div>
              <div className="stats-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Completed Bookings</span>
                  <strong className="text-success">{vehicle.completed_bookings || 0}</strong>
                </div>
              </div>
              <div className="stats-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Revenue</span>
                  <strong className="text-primary">{formatCurrency(vehicle.total_revenue)}</strong>
                </div>
              </div>
              <div className="stats-item mb-3">
                <div className="d-flex justify-content-between">
                  <span>Avg. Booking Value</span>
                  <strong>{formatCurrency(vehicle.avg_booking_value)}</strong>
                </div>
              </div>
              {vehicle.last_booking_date && (
                <div className="stats-item mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Last Booking</span>
                    <strong>{formatDate(vehicle.last_booking_date)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Vehicle Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="form-box mt-3">
              <div className="form-title-wrap">
                <h3 className="title">Vehicle Images</h3>
              </div>
              
              <div className="form-content">
                <div className="row">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="col-6 mb-2">
                      <img 
                        src={image} 
                        alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                        className="img-fluid rounded"
                        style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="btn-box">
            <button 
              className="btn btn-secondary me-2"
              onClick={() => router.push('/admin/vehicles')}
            >
              <i className="la la-arrow-left me-1"></i>
              Back to Vehicles
            </button>
            <button 
              className="btn btn-primary me-2"
              onClick={() => router.push(`/admin/vehicles/${params.id}/edit`)}
            >
              <i className="la la-edit me-1"></i>
              Edit Vehicle
            </button>
            <button 
              className="btn btn-info"
              onClick={() => router.push(`/admin/vehicles/${params.id}/history`)}
            >
              <i className="la la-history me-1"></i>
              View History
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
