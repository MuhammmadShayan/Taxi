'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DriverDashboardDestination() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favoriteRoutes, setFavoriteRoutes] = useState(['route1', 'route3']);

  const toggleFavorite = (routeId) => {
    setFavoriteRoutes(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  return (
    <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard-bread-2">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Destinations & Routes</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><Link href="/" className="text-white">Home</Link></li>
                      <li><Link href="/driver/dashboard" className="text-white">Dashboard</Link></li>
                      <li>Destinations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  {/* Route Statistics */}
                  <div className="row">
                    <div className="col-lg-3 responsive-column">
                      <div className="card-item card-item-2 card-item-3 text-center">
                        <div className="card-body">
                          <div className="card-icon mx-auto card-icon-2">
                            <i className="la la-route"></i>
                          </div>
                          <div className="card-content">
                            <h4 className="card-title">Total Routes</h4>
                            <h2 className="card-text">28</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 responsive-column">
                      <div className="card-item card-item-2 card-item-3 text-center">
                        <div className="card-body">
                          <div className="card-icon mx-auto card-icon-2">
                            <i className="la la-star"></i>
                          </div>
                          <div className="card-content">
                            <h4 className="card-title">Popular Routes</h4>
                            <h2 className="card-text">12</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 responsive-column">
                      <div className="card-item card-item-2 card-item-3 text-center">
                        <div className="card-body">
                          <div className="card-icon mx-auto card-icon-2">
                            <i className="la la-clock"></i>
                          </div>
                          <div className="card-content">
                            <h4 className="card-title">Avg. Trip Time</h4>
                            <h2 className="card-text">45m</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 responsive-column">
                      <div className="card-item card-item-2 card-item-3 text-center">
                        <div className="card-body">
                          <div className="card-icon mx-auto card-icon-2">
                            <i className="la la-road"></i>
                          </div>
                          <div className="card-content">
                            <h4 className="card-title">Total Distance</h4>
                            <h2 className="card-text">2,450mi</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-8">
                  {/* Popular Destinations */}
                  <div className="form-box">
                    <div className="form-title-wrap d-flex justify-content-between align-items-center">
                      <h3 className="title">Popular Destinations</h3>
                      <div className="filter-bar">
                        <select 
                          className="form-select form-select-sm" 
                          style={{width: 'auto'}}
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                          <option value="all">All Routes</option>
                          <option value="frequent">Most Frequent</option>
                          <option value="profitable">Most Profitable</option>
                          <option value="recent">Recent</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Route</th>
                              <th scope="col">Frequency</th>
                              <th scope="col">Avg. Distance</th>
                              <th scope="col">Avg. Duration</th>
                              <th scope="col">Avg. Earnings</th>
                              <th scope="col">Last Trip</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="route-info">
                                  <div className="route-from-to">
                                    <strong>JFK Airport</strong> → <strong>Manhattan</strong>
                                  </div>
                                  <small className="text-muted">Jamaica, Queens to Midtown</small>
                                </div>
                              </td>
                              <td><span className="badge bg-primary">18 trips</span></td>
                              <td>22.5 miles</td>
                              <td>45 mins</td>
                              <td>$65</td>
                              <td>Dec 16, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="/driver/dashboard-trip-detail/TR789"><i className="la la-eye me-2"></i>View Details</Link></li>
                                    <li><button className="dropdown-item" onClick={() => toggleFavorite('route1')}><i className="la la-star me-2"></i>Add to Favorites</button></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-map me-2"></i>View on Map</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="route-info">
                                  <div className="route-from-to">
                                    <strong>Times Square</strong> → <strong>Brooklyn Bridge</strong>
                                  </div>
                                  <small className="text-muted">Midtown to DUMBO</small>
                                </div>
                              </td>
                              <td><span className="badge bg-primary">15 trips</span></td>
                              <td>8.2 miles</td>
                              <td>25 mins</td>
                              <td>$28</td>
                              <td>Dec 15, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="/driver/dashboard-trip-detail/TR756"><i className="la la-eye me-2"></i>View Details</Link></li>
                                    <li><button className="dropdown-item" onClick={() => toggleFavorite('route2')}><i className="la la-star me-2"></i>Add to Favorites</button></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-map me-2"></i>View on Map</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="route-info">
                                  <div className="route-from-to">
                                    <strong>Central Park</strong> → <strong>LaGuardia Airport</strong>
                                  </div>
                                  <small className="text-muted">Upper East Side to Queens</small>
                                </div>
                              </td>
                              <td><span className="badge bg-primary">12 trips</span></td>
                              <td>15.8 miles</td>
                              <td>35 mins</td>
                              <td>$48</td>
                              <td>Dec 14, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="/driver/dashboard-trip-detail/TR723"><i className="la la-eye me-2"></i>View Details</Link></li>
                                    <li><button className="dropdown-item" onClick={() => toggleFavorite('route3')}><i className="la la-star me-2"></i>Add to Favorites</button></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-map me-2"></i>View on Map</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="route-info">
                                  <div className="route-from-to">
                                    <strong>Wall Street</strong> → <strong>Penn Station</strong>
                                  </div>
                                  <small className="text-muted">Financial District to Midtown</small>
                                </div>
                              </td>
                              <td><span className="badge bg-primary">10 trips</span></td>
                              <td>4.2 miles</td>
                              <td>18 mins</td>
                              <td>$22</td>
                              <td>Dec 13, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="/driver/dashboard-trip-detail/TR698"><i className="la la-eye me-2"></i>View Details</Link></li>
                                    <li><button className="dropdown-item" onClick={() => toggleFavorite('route4')}><i className="la la-star me-2"></i>Add to Favorites</button></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-map me-2"></i>View on Map</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="route-info">
                                  <div className="route-from-to">
                                    <strong>Chelsea</strong> → <strong>Williamsburg</strong>
                                  </div>
                                  <small className="text-muted">Manhattan to Brooklyn</small>
                                </div>
                              </td>
                              <td><span className="badge bg-primary">8 trips</span></td>
                              <td>7.1 miles</td>
                              <td>28 mins</td>
                              <td>$32</td>
                              <td>Dec 12, 2024</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Actions
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="la la-eye me-2"></i>View Details</a></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-star me-2"></i>Add to Favorites</a></li>
                                    <li><a className="dropdown-item" href="#"><i className="la la-map me-2"></i>View on Map</a></li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* Route Performance Analysis */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Route Performance Analysis</h3>
                    </div>
                    <div className="form-content">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="chart-container" style={{height: '300px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div className="text-center">
                              <i className="la la-chart-bar" style={{fontSize: '48px', color: '#6c757d', marginBottom: '16px'}}></i>
                              <h5 className="text-muted">Route Earnings Chart</h5>
                              <p className="text-muted">Earnings by route over time</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="chart-container" style={{height: '300px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div className="text-center">
                              <i className="la la-chart-pie" style={{fontSize: '48px', color: '#6c757d', marginBottom: '16px'}}></i>
                              <h5 className="text-muted">Route Distribution</h5>
                              <p className="text-muted">Most traveled routes breakdown</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  {/* Favorite Routes */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Favorite Routes</h3>
                    </div>
                    <div className="form-content">
                      <div className="favorite-routes">
                        <div className="route-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', border: '2px solid #e9ecef'}}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="route-details">
                              <h6 className="mb-1">JFK → Manhattan</h6>
                              <p className="text-muted mb-1">~45 mins • 22.5 miles</p>
                              <div className="route-stats">
                                <small className="badge bg-success me-1">$65 avg</small>
                                <small className="badge bg-info">18 trips</small>
                              </div>
                            </div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => toggleFavorite('route1')}
                            >
                              <i className={`la ${favoriteRoutes.includes('route1') ? 'la-heart' : 'la-heart-o'}`}></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="route-item p-3 mb-3" style={{background: '#f8f9fa', borderRadius: '8px', border: '2px solid #e9ecef'}}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="route-details">
                              <h6 className="mb-1">Times Square → Brooklyn Bridge</h6>
                              <p className="text-muted mb-1">~25 mins • 8.2 miles</p>
                              <div className="route-stats">
                                <small className="badge bg-success me-1">$28 avg</small>
                                <small className="badge bg-info">15 trips</small>
                              </div>
                            </div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => toggleFavorite('route2')}
                            >
                              <i className={`la ${favoriteRoutes.includes('route2') ? 'la-heart' : 'la-heart-o'}`}></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="route-item p-3" style={{background: '#f8f9fa', borderRadius: '8px', border: '2px solid #e9ecef'}}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="route-details">
                              <h6 className="mb-1">Central Park → LaGuardia</h6>
                              <p className="text-muted mb-1">~35 mins • 15.8 miles</p>
                              <div className="route-stats">
                                <small className="badge bg-success me-1">$48 avg</small>
                                <small className="badge bg-info">12 trips</small>
                              </div>
                            </div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => toggleFavorite('route3')}
                            >
                              <i className={`la ${favoriteRoutes.includes('route3') ? 'la-heart' : 'la-heart-o'}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Traffic Insights */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Traffic Insights</h3>
                    </div>
                    <div className="form-content">
                      <div className="traffic-insights">
                        <div className="insight-item p-3 mb-3" style={{background: '#fff3cd', borderRadius: '8px'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-exclamation-triangle text-warning me-3" style={{fontSize: '20px'}}></i>
                            <div>
                              <h6 className="mb-1">Heavy Traffic Alert</h6>
                              <p className="mb-0">FDR Drive has delays - consider alternate routes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="insight-item p-3 mb-3" style={{background: '#d1ecf1', borderRadius: '8px'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-clock text-info me-3" style={{fontSize: '20px'}}></i>
                            <div>
                              <h6 className="mb-1">Peak Hours</h6>
                              <p className="mb-0">High demand: 7-9 AM, 5-7 PM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="insight-item p-3" style={{background: '#d4edda', borderRadius: '8px'}}>
                          <div className="d-flex align-items-center">
                            <i className="la la-chart-line text-success me-3" style={{fontSize: '20px'}}></i>
                            <div>
                              <h6 className="mb-1">Best Earning Routes</h6>
                              <p className="mb-0">Airport transfers show 15% higher earnings</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Quick Actions</h3>
                    </div>
                    <div className="form-content">
                      <div className="quick-actions">
                        <button className="btn btn-primary w-100 mb-3">
                          <i className="la la-search me-2"></i>Find Optimal Route
                        </button>
                        <button className="btn btn-info w-100 mb-3">
                          <i className="la la-map-marked-alt me-2"></i>View Live Traffic
                        </button>
                        <Link href="/driver/dashboard-earnings" className="btn btn-success w-100 mb-3">
                          <i className="la la-download me-2"></i>View Earnings Report
                        </Link>
                        <Link href="/driver/dashboard-settings" className="btn btn-warning w-100">
                          <i className="la la-cogs me-2"></i>Route Preferences
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-lg-12">
                  {/* Interactive Map View */}
                  <div className="form-box">
                    <div className="form-title-wrap d-flex justify-content-between align-items-center">
                      <h3 className="title">Route Map</h3>
                      <div className="map-controls">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <i className="la la-layer-group me-1"></i>Layers
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <i className="la la-expand me-1"></i>Fullscreen
                        </button>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="map-container" style={{height: '400px', background: '#f8f9fa', borderRadius: '8px', position: 'relative'}}>
                        {/* Placeholder for Leaflet Map Integration */}
                        <div className="map-placeholder d-flex align-items-center justify-content-center h-100">
                          <div className="text-center">
                            <i className="la la-map" style={{fontSize: '64px', color: '#6c757d', marginBottom: '20px'}}></i>
                            <h4 className="text-muted">Interactive Route Map</h4>
                            <p className="text-muted">Leaflet map integration showing all your routes, traffic data, and popular destinations</p>
                            <div className="map-legend mt-3">
                              <span className="badge bg-success me-2">
                                <i className="la la-circle me-1"></i>Frequent Routes
                              </span>
                              <span className="badge bg-warning me-2">
                                <i className="la la-circle me-1"></i>Medium Traffic
                              </span>
                              <span className="badge bg-danger">
                                <i className="la la-circle me-1"></i>Heavy Traffic
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-lg-12">
                  {/* Recent Destinations */}
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Destinations</h3>
                    </div>
                    <div className="form-content">
                      <div className="recent-destinations">
                        <div className="row">
                          <div className="col-lg-3 col-md-6 mb-3">
                            <div className="destination-card p-3" style={{background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
                              <i className="la la-plane text-primary mb-2" style={{fontSize: '32px'}}></i>
                              <h6 className="mb-1">JFK Airport</h6>
                              <p className="text-muted mb-2">Terminal 4</p>
                              <small className="badge bg-primary">18 visits</small>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-3">
                            <div className="destination-card p-3" style={{background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
                              <i className="la la-building text-info mb-2" style={{fontSize: '32px'}}></i>
                              <h6 className="mb-1">Manhattan</h6>
                              <p className="text-muted mb-2">Midtown Area</p>
                              <small className="badge bg-info">25 visits</small>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-3">
                            <div className="destination-card p-3" style={{background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
                              <i className="la la-tree text-success mb-2" style={{fontSize: '32px'}}></i>
                              <h6 className="mb-1">Central Park</h6>
                              <p className="text-muted mb-2">Upper East Side</p>
                              <small className="badge bg-success">15 visits</small>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 mb-3">
                            <div className="destination-card p-3" style={{background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
                              <i className="la la-train text-warning mb-2" style={{fontSize: '32px'}}></i>
                              <h6 className="mb-1">Penn Station</h6>
                              <p className="text-muted mb-2">Transportation Hub</p>
                              <small className="badge bg-warning">12 visits</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Footer */}
              <div className="row mt-4">
                <div className="col-lg-12 text-center">
                  <Link href="/driver/dashboard" className="theme-btn theme-btn-transparent">
                    <i className="la la-arrow-left me-2"></i>Back to Dashboard
                  </Link>
                  <Link href="/driver/dashboard-trips" className="theme-btn ms-3">
                    <i className="la la-list me-2"></i>View All Trips
                  </Link>
                  <Link href="/driver/dashboard-earnings" className="theme-btn ms-3">
                    <i className="la la-chart-line me-2"></i>Earnings Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
