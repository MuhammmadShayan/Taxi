'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../../components/AdminLayout';

export default function EditVehicle() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [agencies, setAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    agency_id: '',
    category_id: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vehicle_number: '',
    type: 'sedan',
    energy: 'petrol',
    gear_type: 'automatic',
    seats: 5,
    daily_rate: '',
    status: 'available',
    description: '',
    images: []
  });

  useEffect(() => {
    if (params.id) {
      fetchVehicleDetails();
      fetchAgencies();
      fetchCategories();
    }
  }, [params.id]);

  const fetchVehicleDetails = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/admin/vehicles/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch vehicle details');
      const data = await response.json();
      const vehicleData = data.vehicle;
      setVehicle(vehicleData);
      
      // Populate form with vehicle data
      setFormData({
        agency_id: vehicleData.agency_id || '',
        category_id: vehicleData.category_id || '',
        brand: vehicleData.brand || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
        vehicle_number: vehicleData.vehicle_number || '',
        type: vehicleData.type || 'sedan',
        energy: vehicleData.energy || 'petrol',
        gear_type: vehicleData.gear_type || 'automatic',
        seats: vehicleData.seats || 5,
        daily_rate: vehicleData.daily_rate || '',
        status: vehicleData.status || 'available',
        description: vehicleData.description || '',
        images: vehicleData.images || []
      });
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      alert('Failed to load vehicle details');
      router.push('/admin/vehicles');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/admin/agencies');
      if (!response.ok) throw new Error('Failed to fetch agencies');
      const data = await response.json();
      setAgencies(data.agencies || []);
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageNames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      images: imageNames
    }));
  };

  const validateForm = () => {
    const required = ['agency_id', 'category_id', 'brand', 'model', 'vehicle_number', 'daily_rate'];
    for (const field of required) {
      if (!formData[field]) {
        alert(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    if (formData.daily_rate <= 0) {
      alert('Daily rate must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/vehicles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update vehicle');
      }
      
      alert('Vehicle updated successfully!');
      router.push(`/admin/vehicles/${params.id}`);
      
    } catch (err) {
      console.error('Error updating vehicle:', err);
      alert('Failed to update vehicle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Vehicles', href: '/admin/vehicles' },
    { label: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle', href: `/admin/vehicles/${params.id}` },
    { label: 'Edit' }
  ];

  if (fetchLoading) {
    return (
      <AdminLayout pageTitle="Edit Vehicle" breadcrumbItems={breadcrumbItems}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!vehicle) {
    return (
      <AdminLayout pageTitle="Edit Vehicle" breadcrumbItems={breadcrumbItems}>
        <div className="alert alert-danger">
          <i className="la la-exclamation-triangle me-2"></i>
          Vehicle not found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      pageTitle={`Edit ${vehicle.brand} ${vehicle.model}`}
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Edit Vehicle Information</h3>
            </div>
            
            <div className="form-content">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Agency *</label>
                      <select 
                        className="form-select"
                        name="agency_id"
                        value={formData.agency_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Agency</option>
                        {agencies.map(agency => (
                          <option key={agency.agency_id} value={agency.agency_id}>
                            {agency.business_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Category *</label>
                      <select 
                        className="form-select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Vehicle Type *</label>
                      <select 
                        className="form-select"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="small_car">Small Car</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">Luxury</option>
                        <option value="van">Van</option>
                        <option value="truck">Truck</option>
                        <option value="motorcycle">Motorcycle</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Brand *</label>
                      <input 
                        type="text"
                        className="form-control"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g. Toyota"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Model *</label>
                      <input 
                        type="text"
                        className="form-control"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Camry"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Year</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1980"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Vehicle Number *</label>
                      <input 
                        type="text"
                        className="form-control"
                        name="vehicle_number"
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        placeholder="e.g. ABC-123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Daily Rate ($) *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="daily_rate"
                        value={formData.daily_rate}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Energy Type</label>
                      <select 
                        className="form-select"
                        name="energy"
                        value={formData.energy}
                        onChange={handleChange}
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Transmission</label>
                      <select 
                        className="form-select"
                        name="gear_type"
                        value={formData.gear_type}
                        onChange={handleChange}
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="label-text">Seats</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Status</label>
                      <select 
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Update Vehicle Images</label>
                      <input 
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">Leave empty to keep existing images</small>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label className="label-text">Description</label>
                      <textarea 
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Vehicle description, features, conditions..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="btn-box d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    <i className="la la-arrow-left me-1"></i>
                    Cancel
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="la la-save me-1"></i>
                        Update Vehicle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
