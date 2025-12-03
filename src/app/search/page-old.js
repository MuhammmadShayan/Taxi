'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    pickup_location: searchParams.get('pickup_location') || '',
    start_date: searchParams.get('start_date') || '',
    end_date: searchParams.get('end_date') || '',
    pickup_time: searchParams.get('pickup_time') || '10:00',
    sort: searchParams.get('sort') || 'rating',
    page: parseInt(searchParams.get('page')) || 1
  });
  const [pagination, setPagination] = useState(null);
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    brands: [],
    cities: []
  });

  useEffect(() => {
    if (filters.pickup_location && filters.start_date && filters.end_date) {
      searchVehicles();
    }
  }, [filters]);

  const searchVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/vehicles/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setVehicles(data.vehicles);
      setPagination(data.pagination);
      setAvailableFilters(data.filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL
    const queryParams = new URLSearchParams(updatedFilters);
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleSortChange = (sortValue) => {
    updateFilters({ sort: sortValue });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="la la-star text-yellow"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="la la-star-half-o text-yellow"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="la la-star-o text-gray"></i>);
    }
    
    return stars;
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Search Error</h4>
          <p>{error}</p>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="header-area header-area-v1">
        <div className="header-top-bar padding-right-100px padding-left-100px">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="header-top-content">
                  <div className="header-left">
                    <ul className="list-items">
                      <li><a href="tel:+212600123456"><i className="la la-phone"></i>+212 600 123 456</a></li>
                      <li><a href="mailto:info@holikey.com"><i className="la la-envelope-o"></i>info@holikey.com</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="header-top-content">
                  <div className="header-right d-flex align-items-center justify-content-end">
                    <div className="header-right-action">
                      <Link href="/" className="theme-btn theme-btn-small">Sign In</Link>
                    </div>
                    <div className="header-right-action ml-2">
                      <Link href="/" className="theme-btn theme-btn-small theme-btn-transparent">Sign Up</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="header-menu-wrapper padding-right-100px padding-left-100px">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="menu-wrapper">
                  <div className="logo">
                    <Link href="/">
                      <span className="logo-text">HOLIKEY</span>
                    </Link>
                  </div>
                  <div className="main-menu-content">
                    <nav>
                      <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/search">Search Vehicles</Link></li>
                        <li><Link href="/agencies">Our Partners</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results */}
      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="filter-wrap margin-bottom-30px">
                <div className="filter-top d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="title font-size-18">
                      Search Results: {filters.pickup_location}
                    </h3>
                    <p className="font-size-14 line-height-20">
                      {filters.start_date} - {filters.end_date}
                      {pagination && (
                        <span> • {pagination.total_items} vehicles found</span>
                      )}
                    </p>
                  </div>
                  <div className="layout-view d-flex align-items-center">
                    <div className="select-contain mr-3">
                      <select 
                        className="select-contain-select"
                        value={filters.sort}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="rating">Best Rated</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p>Searching for vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center">
                  <i className="la la-car" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  <h3>No vehicles found</h3>
                  <p>Try adjusting your search criteria or dates.</p>
                  <Link href="/" className="btn btn-primary">Search Again</Link>
                </div>
              ) : (
                <>
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="card-item card-item-list card-item--car">
                      <div className="card-image">
                        <a href={`/vehicles/${vehicle.id}?${new URLSearchParams(filters).toString()}`} className="d-block">
                          <img 
                            src={vehicle.images?.length > 0 ? vehicle.images[0] : '/images/car-placeholder.jpg'} 
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="card__img"
                          />
                        </a>
                      </div>
                      <div className="card-content">
                        <div className="card-content-top">
                          <h5 className="card-title">
                            <a href={`/vehicles/${vehicle.id}?${new URLSearchParams(filters).toString()}`}>
                              {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </a>
                          </h5>
                          <div className="card-rating d-flex align-items-center mb-2">
                            <div className="review__rating d-flex align-items-center">
                              <div className="review__rating-star">
                                {getRatingStars(vehicle.agency_rating || 0)}
                              </div>
                              <span className="rating__text ml-1">
                                {vehicle.agency_rating || 0} ({vehicle.review_count || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <p className="card-text mb-2">
                            <i className="la la-building mr-1"></i>
                            {vehicle.agency_name} • {vehicle.agency_city}
                          </p>
                          <div className="card-attributes mb-3">
                            <div className="d-flex flex-wrap">
                              <span className="badge badge-light mr-2 mb-1">
                                <i className="la la-users mr-1"></i>
                                {vehicle.seats} seats
                              </span>
                              <span className="badge badge-light mr-2 mb-1">
                                <i className="la la-cog mr-1"></i>
                                {vehicle.gear_type}
                              </span>
                              <span className="badge badge-light mr-2 mb-1">
                                <i className="la la-gas-pump mr-1"></i>
                                {vehicle.energy}
                              </span>
                              {vehicle.air_conditioning && (
                                <span className="badge badge-light mr-2 mb-1">
                                  <i className="la la-snowflake mr-1"></i>
                                  A/C
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-content-bottom">
                          <div className="card-price d-flex align-items-center justify-content-between">
                            <div>
                              <span className="price__from">From</span>
                              <span className="price__num">
                                {vehicle.pricing ? formatPrice(vehicle.pricing.price_per_day) : formatPrice(vehicle.low_price)}
                              </span>
                              <span className="price__text">per day</span>
                              {vehicle.pricing && (
                                <div className="text-small text-muted">
                                  Total: {formatPrice(vehicle.pricing.base_total)} 
                                  for {vehicle.pricing.days} days
                                </div>
                              )}
                            </div>
                            <div className="btn-box">
                              <a 
                                href={`/vehicles/${vehicle.id}?${new URLSearchParams(filters).toString()}`}
                                className="theme-btn theme-btn-small theme-btn-transparent"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination && pagination.total_pages > 1 && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="btn-container text-center">
                          <nav aria-label="Search results pagination">
                            <ul className="pagination pagination--style-two justify-content-center">
                              {pagination.current_page > 1 && (
                                <li className="page-item">
                                  <button 
                                    className="page-link"
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                  >
                                    Previous
                                  </button>
                                </li>
                              )}
                              
                              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                                <li 
                                  key={page} 
                                  className={`page-item ${page === pagination.current_page ? 'active' : ''}`}
                                >
                                  <button 
                                    className="page-link"
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              ))}
                              
                              {pagination.current_page < pagination.total_pages && (
                                <li className="page-item">
                                  <button 
                                    className="page-link"
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                  >
                                    Next
                                  </button>
                                </li>
                              )}
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-area footer-area-v1 padding-top-100px padding-bottom-30px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-copyright text-center">
                <p className="footer-copyright-text">
                  © 2025 HOLIKEY. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
