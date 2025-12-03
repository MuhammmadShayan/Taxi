'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminVehiclesCatalog() {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({ makes: [], sources: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMake, setFilterMake] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('');
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [scrapingMessage, setScrapingMessage] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehiclesCatalog();
  }, []);

  const fetchVehiclesCatalog = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        search: searchTerm,
        make: filterMake,
        status: filterStatus,
        source: filterSource
      });
      
      const response = await fetch(`/api/admin/vehicles-catalog?${params}`);
      if (!response.ok) throw new Error('Failed to fetch vehicles catalog');
      const data = await response.json();
      
      setVehicles(data.vehicles || []);
      setStatistics(data.statistics || {});
      setFilters(data.filters || { makes: [], sources: [] });
    } catch (err) {
      console.error('Error fetching vehicles catalog:', err);
      setError('Failed to load vehicles catalog from database');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVehiclesCatalog();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterMake, filterStatus, filterSource]);

  const handleScrapeVehicles = async (enableAllSources = false) => {
    setIsScrapingLoading(true);
    setScrapingMessage('Starting vehicle scraping...');
    try {
      const response = await fetch('/api/admin/vehicles-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scrape',
          pages: 2,
          enableAllSources
        })
      });
      
      if (!response.ok) throw new Error('Scraping failed');
      const data = await response.json();
      
      setScrapingMessage(`Scraping completed! Added ${data.results?.totalSaved || 0} new vehicles.`);
      setTimeout(() => {
        fetchVehiclesCatalog();
        setScrapingMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error scraping vehicles:', err);
      setScrapingMessage('Scraping failed. Please try again.');
    } finally {
      setIsScrapingLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await fetch('/api/admin/vehicles-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_status',
          vehicleId,
          status: newStatus 
        })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
      ));
    } catch (err) {
      console.error('Error updating vehicle status:', err);
      alert('Failed to update vehicle status');
    }
  };

  const getSourceBadgeClass = (source) => {
    switch (source) {
      case 'cars.com': return 'bg-primary';
      case 'autotrader.com': return 'bg-success';
      case 'cargurus.com': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const openDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const closeDetails = () => {
    setShowViewModal(false);
    setSelectedVehicle(null);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Vehicles Catalog' }
  ];

  return (
    <AdminLayout
      pageTitle="Vehicles Catalog Management"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-primary">{statistics.total_vehicles || 0}</h5>
                  <p className="card-text">Total Vehicles</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-success">{statistics.vehicles_with_images || 0}</h5>
                  <p className="card-text">With Images ({statistics.image_coverage || 0}%)</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-info">{statistics.unique_makes || 0}</h5>
                  <p className="card-text">Unique Makes</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-warning">{statistics.unique_sources || 0}</h5>
                  <p className="card-text">Data Sources</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="title">Vehicles Catalog ({vehicles.length})</h3>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select form-select-sm"
                    value={filterMake}
                    onChange={(e) => setFilterMake(e.target.value)}
                  >
                    <option value="">All Makes</option>
                    {filters.makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                  <select 
                    className="form-select form-select-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select 
                    className="form-select form-select-sm"
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                  >
                    <option value="">All Sources</option>
                    {filters.sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-content">
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search vehicles by make, model, or year..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <button className="btn btn-primary btn-sm me-2" onClick={fetchVehiclesCatalog}>
                      <i className="la la-refresh me-1"></i>Refresh
                    </button>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleScrapeVehicles(false)}
                      disabled={isScrapingLoading}
                    >
                      <i className="la la-download me-1"></i>
                      {isScrapingLoading ? 'Scraping...' : 'Scrape Cars.com'}
                    </button>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleScrapeVehicles(true)}
                      disabled={isScrapingLoading}
                    >
                      <i className="la la-globe me-1"></i>
                      {isScrapingLoading ? 'Scraping...' : 'Scrape All Sources'}
                    </button>
                  </div>
                </div>
              </div>

              {scrapingMessage && (
                <div className={`alert ${scrapingMessage.includes('completed') ? 'alert-success' : scrapingMessage.includes('failed') ? 'alert-danger' : 'alert-info'}`}>
                  <i className="la la-info-circle me-2"></i>
                  {scrapingMessage}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  <i className="la la-exclamation-triangle me-2"></i>
                  {error}. Please check your database connection.
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>Source</th>
                        <th>Specs</th>
                        <th>Pricing</th>
                        <th>Images</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                          <tr key={vehicle.id} className={vehicle.is_new ? 'table-success' : ''}>
                            <td>#{vehicle.id}</td>
                            <td>
                              <div>
                                <h6 className="mb-0">{vehicle.make} {vehicle.model}</h6>
                                <small className="text-muted">
                                  {vehicle.year} 
                                  {vehicle.is_new && <span className="badge bg-success ms-1">NEW</span>}
                                </small>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${getSourceBadgeClass(vehicle.source)}`}>
                                {vehicle.source || 'Unknown'}
                              </span>
                            </td>
                            <td>
                              <div className="vehicle-specs">
                                <small className="d-block">{vehicle.energy || 'N/A'} • {vehicle.gear_type || 'N/A'}</small>
                                <small className="text-muted">{vehicle.seats || 'N/A'} seats • {vehicle.doors || 'N/A'} doors</small>
                                {vehicle.mileage && <small className="text-muted d-block">{vehicle.mileage.toLocaleString()} miles</small>}
                              </div>
                            </td>
                            <td>
                              <div>
                                {vehicle.daily_rate && <strong className="text-success d-block">${vehicle.daily_rate}/day</strong>}
                                {vehicle.price_usd && <small className="text-muted">${vehicle.price_usd.toLocaleString()}</small>}
                                {!vehicle.daily_rate && !vehicle.price_usd && <span className="text-muted">N/A</span>}
                              </div>
                            </td>
                            <td>
                              <div>
                                {vehicle.images.length > 0 ? (
                                  <div>
                                    <img 
                                      src={vehicle.images[0]} 
                                      alt={vehicle.display_name}
                                      className="rounded"
                                      style={{width: '50px', height: '30px', objectFit: 'cover'}}
                                      onError={(e) => {
                                        e.target.src = '/images/cars/default-car.jpg';
                                      }}
                                    />
                                    {vehicle.images.length > 1 && (
                                      <small className="d-block text-muted">+{vehicle.images.length - 1} more</small>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted">No image</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <select
                                className={`form-select form-select-sm badge ${getStatusBadgeClass(vehicle.status)}`}
                                value={vehicle.status}
                                onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                                style={{ border: 'none', color: 'white', minWidth: '80px' }}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {vehicle.source_url && (
                                  <a 
                                    href={vehicle.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                    title="View Source"
                                  >
                                    <i className="la la-external-link"></i>
                                  </a>
                                )}
                                <button 
                                  className="btn btn-outline-info btn-sm"
                                  title="View Details"
                                  onClick={() => openDetails(vehicle)}
                                >
                                  <i className="la la-eye"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <i className="la la-car" style={{fontSize: '48px', color: '#ccc'}}></i>
                            <p className="text-muted mt-2">No vehicles found in catalog</p>
                            <button 
                              className="btn btn-primary"
                              onClick={() => handleScrapeVehicles(false)}
                              disabled={isScrapingLoading}
                            >
                              <i className="la la-download me-1"></i>Start Scraping Vehicles
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showViewModal && selectedVehicle && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="la la-car text-primary me-2"></i>
                  {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
                </h5>
                <button type="button" className="btn-close" onClick={closeDetails}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-5">
                    {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                      <img
                        src={selectedVehicle.images[0]}
                        alt={selectedVehicle.display_name || `${selectedVehicle.make} ${selectedVehicle.model}`}
                        className="rounded w-100"
                        style={{ height: '220px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/images/cars/default-car.jpg'; }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '220px' }}>
                        <i className="la la-image" style={{ fontSize: '48px', color: '#adb5bd' }}></i>
                      </div>
                    )}
                    {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                      <small className="text-muted d-block mt-2">+{selectedVehicle.images.length - 1} more images</small>
                    )}
                  </div>
                  <div className="col-md-7">
                    <div className="mb-2">
                      <span className={`badge ${getSourceBadgeClass(selectedVehicle.source)}`}>{selectedVehicle.source || 'Unknown'}</span>
                      <span className={`badge ms-2 ${getStatusBadgeClass(selectedVehicle.status)}`}>{selectedVehicle.status}</span>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="fw-semibold">Energy</div>
                        <div className="text-muted">{selectedVehicle.energy || 'N/A'}</div>
                      </div>
                      <div className="col-6">
                        <div className="fw-semibold">Gear Type</div>
                        <div className="text-muted">{selectedVehicle.gear_type || 'N/A'}</div>
                      </div>
                      <div className="col-6 mt-2">
                        <div className="fw-semibold">Seats</div>
                        <div className="text-muted">{selectedVehicle.seats ?? 'N/A'}</div>
                      </div>
                      <div className="col-6 mt-2">
                        <div className="fw-semibold">Doors</div>
                        <div className="text-muted">{selectedVehicle.doors ?? 'N/A'}</div>
                      </div>
                      {selectedVehicle.mileage && (
                        <div className="col-12 mt-2">
                          <div className="fw-semibold">Mileage</div>
                          <div className="text-muted">{selectedVehicle.mileage.toLocaleString()} miles</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      {selectedVehicle.daily_rate ? (
                        <div className="h5 text-success mb-1">${selectedVehicle.daily_rate}/day</div>
                      ) : null}
                      {selectedVehicle.price_usd ? (
                        <div className="text-muted">${selectedVehicle.price_usd.toLocaleString()}</div>
                      ) : null}
                    </div>
                    {selectedVehicle.description && (
                      <div className="mt-3">
                        <div className="fw-semibold mb-1">Description</div>
                        <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{selectedVehicle.description}</div>
                      </div>
                    )}
                    {selectedVehicle.source_url && (
                      <div className="mt-3">
                        <a href={selectedVehicle.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                          <i className="la la-external-link me-1"></i>
                          Open Source Listing
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDetails}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

