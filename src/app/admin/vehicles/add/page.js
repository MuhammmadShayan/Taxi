'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';

export default function AddVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogResults, setCatalogResults] = useState([]);
  const [catalogQuery, setCatalogQuery] = useState('');
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
    fetchAgencies();
    fetchCategories();
  }, []);

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
    // For now, we'll just store the file names
    // In a real implementation, you'd upload these to a storage service
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
      
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        const msg = error.message || error.error || error.details || 'Failed to add vehicle';
        throw new Error(msg);
      }
      
      alert('Vehicle added successfully!');
      router.push('/admin/vehicles');
      
    } catch (err) {
      console.error('Error adding vehicle:', err);
      alert('Failed to add vehicle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCatalog = async () => {
    try {
      const params = new URLSearchParams();
      if (catalogQuery) params.set('q', catalogQuery);
      const res = await fetch(`/api/vehicles/catalog?${params.toString()}`);
      const data = await res.json();
      if (data.success) setCatalogResults(data.results);
    } catch (e) {
      console.error('Catalog search failed', e);
    }
  };

  const applyCatalogItem = (item) => {
    setFormData(prev => {
      // Prefer catalog values but fall back to whatever the user already typed
      const inferredDailyRate =
        item.daily_rate ?? (item.price_usd ? Number((item.price_usd / 30).toFixed(2)) : prev.daily_rate);

      return {
        ...prev,
        // Basic identity fields
        brand: item.make || prev.brand,
        model: item.model || prev.model,
        year: item.year || prev.year,
        // Pricing
        daily_rate: inferredDailyRate || prev.daily_rate,
        // Keep any existing description if the admin already typed one
        description:
          prev.description && prev.description.trim().length > 0
            ? prev.description
            : `${item.make || ''} ${item.model || ''} ${item.year || ''} ${
                item.location ? `- ${item.location}` : ''
              }`.trim(),
        // Images from catalog (fallback to previous selection)
        images: (item.images && item.images.length > 0 ? item.images : prev.images) || [],
      };
    });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Vehicles', href: '/admin/vehicles' },
    { label: 'Add Vehicle' }
  ];

  return (
    <AdminLayout
      pageTitle="Add New Vehicle"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Vehicle Information</h3>
            </div>
            
            <div className="form-content">
              <div className="mb-4 p-3" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 6 }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search catalog (make/model/year)"
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                  />
                  <button type="button" className="btn btn-outline-primary" onClick={searchCatalog}>
                    <i className="la la-search me-1"></i>Search Catalog
                  </button>
                </div>
                {catalogResults.length > 0 && (
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Make</th><th>Model</th><th>Year</th><th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalogResults.map(v => (
                          <tr key={v.id}>
                            <td>{v.make}</td>
                            <td>{v.model}</td>
                            <td>{v.year}</td>
                            <td>
                              <button type="button" className="btn btn-sm btn-link" onClick={() => applyCatalogItem(v)}>
                                Use
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="label-text">Vehicle Images</label>
                      <input 
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">Select multiple images for the vehicle</small>
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
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="la la-save me-1"></i>
                        Add Vehicle
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
