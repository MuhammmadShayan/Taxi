'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import { useI18n } from '../../i18n/I18nProvider';

export default function CarListing() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    transmissions: [],
    fuelTypes: [],
    locations: []
  });
  const [sortBy, setSortBy] = useState('rating');
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'
  
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    fuel_type: '',
    min_price: '',
    max_price: '',
    seats: '',
    location: '',
    rating: ''
  });

  const [searchData, setSearchData] = useState({
    pickup_location: '',
    pickup_date: '',
    pickup_time: '09:00',
    dropoff_date: '',
    dropoff_time: '09:00',
    passengers: 1
  });

  const [isSearching, setIsSearching] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    price: false,
    categories: false
  });

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  useEffect(() => {
    const pickup_location = searchParams.get('pickup_location') || '';
    const pickup_date = searchParams.get('pickup_date') || '';
    const pickup_time = searchParams.get('pickup_time') || '09:00';
    const dropoff_date = searchParams.get('dropoff_date') || '';
    const dropoff_time = searchParams.get('dropoff_time') || '09:00';
    const passengers = parseInt(searchParams.get('passengers')) || 1;

    setSearchData({
      pickup_location,
      pickup_date,
      pickup_time,
      dropoff_date,
      dropoff_time,
      passengers
    });

    fetchCarsAndFilters();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, cars, sortBy]);

  const fetchCarsAndFilters = async () => {
    try {
      setLoading(true);
      
      const [carsResponse, filtersResponse] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/filter-options')
      ]);
      
      if (carsResponse.ok && filtersResponse.ok) {
        const carsData = await carsResponse.json();
        const filtersData = await filtersResponse.json();
        
        console.log('Cars data:', carsData);
        console.log('Filter options:', filtersData);
        
        setCars(carsData.cars || []);
        setFilterOptions(filtersData || {
          categories: [],
          transmissions: [],
          fuelTypes: [],
          locations: []
        });
      } else {
        console.error('API responses not OK:', { 
          carsOk: carsResponse.ok, 
          filtersOk: filtersResponse.ok 
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Add fallback data for testing
      const fallbackCars = [
        {
          id: 1,
          make: 'Toyota',
          model: 'Camry',
          category: 'Economy',
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          price_per_day: 45,
          seats: 5,
          rating: 4.5,
          location: 'New York',
          luggage_capacity: 3,
          features: ['Air Conditioning', 'GPS', 'Bluetooth'],
          images: ['/html-folder/images/car-img.png'],
          total_bookings: 150
        },
        {
          id: 2,
          make: 'BMW',
          model: 'X5',
          category: 'Luxury',
          transmission: 'Automatic',
          fuel_type: 'Gasoline',
          price_per_day: 95,
          seats: 7,
          rating: 4.8,
          location: 'Los Angeles',
          luggage_capacity: 5,
          features: ['Air Conditioning', 'GPS', 'Leather Seats', 'Premium Sound'],
          images: ['/html-folder/images/car-img.png'],
          total_bookings: 89
        },
        {
          id: 3,
          make: 'Honda',
          model: 'Civic',
          category: 'Compact',
          transmission: 'Manual',
          fuel_type: 'Gasoline',
          price_per_day: 35,
          seats: 4,
          rating: 4.2,
          location: 'Chicago',
          luggage_capacity: 2,
          features: ['Air Conditioning', 'Bluetooth'],
          images: ['/html-folder/images/car-img.png'],
          total_bookings: 234
        }
      ];
      
      const fallbackFilters = {
        categories: ['Economy', 'Compact', 'Luxury', 'SUV'],
        transmissions: ['Automatic', 'Manual'],
        fuelTypes: ['Gasoline', 'Diesel', 'Electric'],
        locations: ['New York', 'Los Angeles', 'Chicago', 'Miami']
      };
      
      setCars(fallbackCars);
      setFilterOptions(fallbackFilters);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (filters.category) {
      filtered = filtered.filter(car => car.category === filters.category);
    }
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    if (filters.fuel_type) {
      filtered = filtered.filter(car => car.fuel_type === filters.fuel_type);
    }
    if (filters.min_price) {
      filtered = filtered.filter(car => car.price_per_day >= parseFloat(filters.min_price));
    }
    if (filters.max_price) {
      filtered = filtered.filter(car => car.price_per_day <= parseFloat(filters.max_price));
    }
    if (filters.seats) {
      filtered = filtered.filter(car => car.seats >= parseInt(filters.seats));
    }
    if (filters.location) {
      filtered = filtered.filter(car => 
        car.location && car.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.rating) {
      filtered = filtered.filter(car => car.rating >= parseFloat(filters.rating));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
        break;
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // New handler for radio buttons that allows unchecking
  const handleRadioFilterChange = (filterName, filterValue) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName] === filterValue ? '' : filterValue
    }));
  };

  const handleSearchDataChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const validateSearchForm = () => {
    const errors = [];
    
    if (!searchData.pickup_location.trim()) {
      errors.push('Please enter a pickup location');
    }
    
    if (!searchData.pickup_date) {
      errors.push('Please select a pickup date');
    }
    
    if (!searchData.dropoff_date) {
      errors.push('Please select a drop-off date');
    }
    
    if (searchData.pickup_date && searchData.dropoff_date) {
      const pickupDateTime = new Date(`${searchData.pickup_date}T${searchData.pickup_time}`);
      const dropoffDateTime = new Date(`${searchData.dropoff_date}T${searchData.dropoff_time}`);
      const now = new Date();
      
      if (pickupDateTime < now) {
        errors.push('Pickup date and time cannot be in the past');
      }
      
      if (dropoffDateTime <= pickupDateTime) {
        errors.push('Drop-off date and time must be after pickup date and time');
      }
    }
    
    return errors;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateSearchForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Save search to database
      await fetch('/api/car-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup_location: searchData.pickup_location,
          pickup_date: searchData.pickup_date,
          pickup_time: searchData.pickup_time,
          dropoff_date: searchData.dropoff_date,
          dropoff_time: searchData.dropoff_time
        }),
      });
      
      // Update URL with new search parameters
      const queryParams = new URLSearchParams({
        pickup_location: searchData.pickup_location,
        pickup_date: searchData.pickup_date,
        pickup_time: searchData.pickup_time,
        dropoff_date: searchData.dropoff_date,
        dropoff_time: searchData.dropoff_time
      });
      
      window.history.pushState({}, '', `/cars?${queryParams.toString()}`);
      
      // Refresh the page to reflect new search
      window.location.reload();
      
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      transmission: '',
      fuel_type: '',
      min_price: '',
      max_price: '',
      seats: '',
      location: '',
      rating: ''
    });
  };

  const toggleDropdown = (dropdownName) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const closeDropdown = (dropdownName) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: false
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-contain')) {
        setDropdownStates({
          price: false,
          categories: false
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const calculateRentalDays = () => {
    if (searchData.pickup_date && searchData.dropoff_date) {
      const pickup = new Date(searchData.pickup_date);
      const dropoff = new Date(searchData.dropoff_date);
      const diffTime = Math.abs(dropoff - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const rentalDays = calculateRentalDays();
  const today = new Date().toISOString().split('T')[0];

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<i key={i} className="la la-star"></i>);
      } else {
        stars.push(<i key={i} className="la la-star-o"></i>);
      }
    }
    return stars;
  };

  // Function to build car detail URL with search parameters
  const buildCarDetailUrl = (carId) => {
    const params = new URLSearchParams();
    
    if (searchData.pickup_location) {
      params.append('pickup_location', searchData.pickup_location);
    }
    if (searchData.pickup_date) {
      params.append('pickup_date', searchData.pickup_date);
    }
    if (searchData.pickup_time) {
      params.append('pickup_time', searchData.pickup_time);
    }
    if (searchData.dropoff_date) {
      params.append('dropoff_date', searchData.dropoff_date);
    }
    if (searchData.dropoff_time) {
      params.append('dropoff_time', searchData.dropoff_time);
    }
    if (searchData.passengers) {
      params.append('passengers', searchData.passengers.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `/cars/${carId}?${queryString}` : `/cars/${carId}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading available cars...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <Breadcrumb 
        title="Car List" 
        breadcrumbItems={[
          { label: 'Car', href: '/cars' },
          { label: 'Car List' }
        ]}
      />

      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="filter-wrap margin-bottom-30px">
                <div className="filter-top d-flex align-items-center justify-content-between pb-4">
                  <div>
                    <h3 className="title font-size-24">{filteredCars.length} Cars found</h3>
                    <p className="font-size-14">
                      <span className="me-1 pt-1">Book with confidence:</span>No car booking fees
                    </p>
                  </div>
                  <div className="layout-view d-flex align-items-center">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setViewType('grid');
                      }}
                      className={viewType === 'grid' ? 'active' : ''}
                      data-bs-toggle="tooltip"
                      data-placement="top"
                      title="Grid View"
                    >
                      <i className="la la-th-large"></i>
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setViewType('list');
                      }}
                      className={viewType === 'list' ? 'active' : ''}
                      data-bs-toggle="tooltip"
                      data-placement="top"
                      title="List View"
                    >
                      <i className="la la-th-list"></i>
                    </a>
                  </div>
                </div>
                
                <div className="filter-bar d-flex align-items-center justify-content-between">
                  <div className="filter-bar-filter d-flex flex-wrap align-items-center">
                    <div className="filter-option">
                      <h3 className="title font-size-16">Filter by:</h3>
                    </div>
                    
                    {/* Price Filter Dropdown */}
                    <div className="filter-option">
                      <div className="dropdown dropdown-contain">
                        <a
                          className="dropdown-toggle dropdown-btn dropdown--btn"
                          href="#"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown('price');
                          }}
                        >
                          Filter Price
                        </a>
                        <div className={`dropdown-menu dropdown-menu-wrap ${dropdownStates.price ? 'show' : ''}`} style={{ display: dropdownStates.price ? 'block' : 'none' }}>
                          <div className="dropdown-item">
                            <div className="row">
                              <div className="col-6">
                                <input
                                  type="number"
                                  name="min_price"
                                  value={filters.min_price}
                                  onChange={handleFilterChange}
                                  placeholder="Min $"
                                  className="form-control mb-2"
                                  min="0"
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="number"
                                  name="max_price"
                                  value={filters.max_price}
                                  onChange={handleFilterChange}
                                  placeholder="Max $"
                                  className="form-control mb-2"
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="btn-box pt-2">
                              <button
                                className="theme-btn theme-btn-small theme-btn-transparent"
                                type="button"
                                onClick={() => {
                                  applyFilters();
                                  closeDropdown('price');
                                }}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Categories Filter Dropdown */}
                    <div className="filter-option">
                      <div className="dropdown dropdown-contain">
                        <a
                          className="dropdown-toggle dropdown-btn dropdown--btn"
                          href="#"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown('categories');
                          }}
                        >
                          Categories
                        </a>
                        <div className={`dropdown-menu dropdown-menu-wrap ${dropdownStates.categories ? 'show' : ''}`} style={{ display: dropdownStates.categories ? 'block' : 'none' }}>
                          <div className="dropdown-item">
                            <div className="checkbox-wrap">
                              {filterOptions.categories.map(category => (
                                <div key={category} className="custom-checkbox">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`cat-${category}`}
                                    name="category"
                                    value={category}
                                    checked={filters.category === category}
                                    onChange={(e) => {
                                      handleFilterChange(e);
                                      closeDropdown('categories');
                                    }}
                                  />
                                  <label htmlFor={`cat-${category}`}>{category}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="select-contain select2-container-wrapper">
                    <select 
                      className="select-contain-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="rating">Sort by Rating</option>
                      <option value="price_low">Price: low to high</option>
                      <option value="price_high">Price: high to low</option>
                      <option value="name">A to Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sidebar mt-0">
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Search Cars</h3>
                  <div className="sidebar-widget-item">
                    <div className="contact-form-action">
                      <form onSubmit={handleSearchSubmit}>
                        <div className="input-box">
                          <label className="label-text">Pick-up Location</label>
                          <div className="form-group">
                            <span className="la la-map-marker form-icon"></span>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Destination, city, or region"
                              value={searchData.pickup_location}
                              onChange={(e) => handleSearchDataChange('pickup_location', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="input-box">
                          <label className="label-text">Pick-up Date</label>
                          <div className="form-group">
                            <span className="la la-calendar form-icon"></span>
                            <input
                              className="form-control"
                              type="date"
                              value={searchData.pickup_date}
                              min={today}
                              onChange={(e) => handleSearchDataChange('pickup_date', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="input-box">
                          <label className="label-text">Pick-up Time</label>
                          <div className="form-group select2-container-wrapper">
                            <div className="select-contain w-auto">
                              <select 
                                className="select-contain-select"
                                value={searchData.pickup_time}
                                onChange={(e) => handleSearchDataChange('pickup_time', e.target.value)}
                                required
                              >
                                {timeOptions.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="input-box">
                          <label className="label-text">Drop-off Date</label>
                          <div className="form-group">
                            <span className="la la-calendar form-icon"></span>
                            <input
                              className="form-control"
                              type="date"
                              value={searchData.dropoff_date}
                              min={searchData.pickup_date || today}
                              onChange={(e) => handleSearchDataChange('dropoff_date', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="input-box">
                          <label className="label-text">Drop-off Time</label>
                          <div className="form-group select2-container-wrapper">
                            <div className="select-contain w-auto">
                              <select 
                                className="select-contain-select"
                                value={searchData.dropoff_time}
                                onChange={(e) => handleSearchDataChange('dropoff_time', e.target.value)}
                                required
                              >
                                {timeOptions.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="btn-box pt-2">
                          <button
                            type="submit"
                            className="theme-btn w-100"
                            disabled={isSearching}
                          >
                            {isSearching ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Searching...
                              </>
                            ) : (
                              'Search Now'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Price Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Filter by Price</h3>
                  <div className="sidebar-price-range">
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="number"
                          name="min_price"
                          value={filters.min_price}
                          onChange={handleFilterChange}
                          placeholder="Min $"
                          className="form-control mb-2"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          name="max_price"
                          value={filters.max_price}
                          onChange={handleFilterChange}
                          placeholder="Max $"
                          className="form-control mb-2"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="btn-box pt-2">
                      <button
                        className="theme-btn theme-btn-small theme-btn-transparent"
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rating Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Filter by Rating</h3>
                  <div className="sidebar-review">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="custom-checkbox">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`rating-${rating}`}
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating.toString()}
                          onChange={() => handleRadioFilterChange('rating', rating.toString())}
                        />
                        <label 
                          htmlFor={`rating-${rating}`}
                          onClick={() => handleRadioFilterChange('rating', rating.toString())}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="ratings d-flex align-items-center">
                            {renderStars(rating)}
                            <span className="color-text-3 font-size-13 ms-1">& up</span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Categories</h3>
                  <div className="sidebar-category">
                    {filterOptions.categories.map(category => (
                      <div key={category} className="custom-checkbox">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`sidebar-cat-${category}`}
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={() => handleRadioFilterChange('category', category)}
                        />
                        <label 
                          htmlFor={`sidebar-cat-${category}`}
                          onClick={() => handleRadioFilterChange('category', category)}
                          style={{ cursor: 'pointer' }}
                        >
                          {category}
                          <span className="font-size-13 ms-1">
                            ({cars.filter(car => car.category === category).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Transmission</h3>
                  <div className="sidebar-category">
                    {filterOptions.transmissions.map(transmission => (
                      <div key={transmission} className="custom-checkbox">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`sidebar-trans-${transmission}`}
                          name="transmission"
                          value={transmission}
                          checked={filters.transmission === transmission}
                          onChange={() => handleRadioFilterChange('transmission', transmission)}
                        />
                        <label 
                          htmlFor={`sidebar-trans-${transmission}`}
                          onClick={() => handleRadioFilterChange('transmission', transmission)}
                          style={{ cursor: 'pointer' }}
                        >
                          {transmission}
                          <span className="font-size-13 ms-1">
                            ({cars.filter(car => car.transmission === transmission).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Fuel Type</h3>
                  <div className="sidebar-category">
                    {filterOptions.fuelTypes.map(fuelType => (
                      <div key={fuelType} className="custom-checkbox">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`sidebar-fuel-${fuelType}`}
                          name="fuel_type"
                          value={fuelType}
                          checked={filters.fuel_type === fuelType}
                          onChange={() => handleRadioFilterChange('fuel_type', fuelType)}
                        />
                        <label 
                          htmlFor={`sidebar-fuel-${fuelType}`}
                          onClick={() => handleRadioFilterChange('fuel_type', fuelType)}
                          style={{ cursor: 'pointer' }}
                        >
                          {fuelType}
                          <span className="font-size-13 ms-1">
                            ({cars.filter(car => car.fuel_type === fuelType).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seats Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Seats</h3>
                  <div className="sidebar-category">
                    {[2, 4, 5, 7, 8].map(seatCount => (
                      <div key={seatCount} className="custom-checkbox">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`sidebar-seats-${seatCount}`}
                          name="seats"
                          value={seatCount}
                          checked={filters.seats === seatCount.toString()}
                          onChange={() => handleRadioFilterChange('seats', seatCount.toString())}
                        />
                        <label 
                          htmlFor={`sidebar-seats-${seatCount}`}
                          onClick={() => handleRadioFilterChange('seats', seatCount.toString())}
                          style={{ cursor: 'pointer' }}
                        >
                          {seatCount}+ seats
                          <span className="font-size-13 ms-1">
                            ({cars.filter(car => car.seats >= seatCount).length})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="title stroke-shape">Location</h3>
                  <div className="sidebar-widget-item">
                    <div className="contact-form-action">
                      <div className="input-box">
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            name="location"
                            placeholder="Search by location"
                            value={filters.location}
                            onChange={handleFilterChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Listings */}
            <div className="col-lg-8">
              {filteredCars.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No cars found</h4>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <>
                  {filteredCars.map(car => {
                    // Parse features from JSON or comma-separated string
                    let features = [];
                    if (car.features) {
                      try {
                        features = typeof car.features === 'string' ? 
                          (car.features.startsWith('[') ? JSON.parse(car.features) : car.features.split(',')) :
                          car.features;
                      } catch (e) {
                        features = car.features.split(',');
                      }
                    }

                    // Parse images
                    let images = [];
                    if (car.images) {
                      try {
                        images = typeof car.images === 'string' ? JSON.parse(car.images) : car.images;
                      } catch (e) {
                        images = [car.images];
                      }
                    }
                    const mainImage = images[0] || '/html-folder/images/car-img.png';

                    return (
                      <div key={car.id} className={`card-item car-card ${viewType === 'list' ? 'card-item-list' : ''}`}>
                        <div className="card-img padding-top-50px">
                          <Link href={buildCarDetailUrl(car.id)} className="d-block">
                            <img src={mainImage} alt={`${car.make} ${car.model}`} className="h-100" />
                          </Link>
                          {car.rating >= 4.5 && (
                            <span className="badge">Bestseller</span>
                          )}
                          <div
                            className="add-to-wishlist icon-element"
                            data-bs-toggle="tooltip"
                            data-placement="top"
                            title="Save for later"
                          >
                            <i className="la la-heart-o"></i>
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <p className="card-meta">{car.category}</p>
                          <h3 className="card-title">
                            <Link href={buildCarDetailUrl(car.id)}>
                              {car.make} {car.model} or Similar
                            </Link>
                          </h3>
                          
                          <div className="card-rating">
                            <span className="badge text-white">{car.rating || 4.0}/5</span>
                            <span className="review__text">
                              {car.rating >= 4.5 ? 'Excellent' : car.rating >= 4 ? 'Very Good' : car.rating >= 3 ? 'Good' : 'Average'}
                            </span>
                            <span className="rating__text">({car.total_bookings || 0} Reviews)</span>
                          </div>
                          
                          <div className="card-attributes">
                            <ul className="d-flex align-items-center">
                              <li
                                className="d-flex align-items-center"
                                data-bs-toggle="tooltip"
                                data-placement="top"
                                title="Passengers"
                              >
                                <i className="la la-users"></i><span>{car.seats}</span>
                              </li>
                              <li
                                className="d-flex align-items-center"
                                data-bs-toggle="tooltip"
                                data-placement="top"
                                title="Luggage"
                              >
                                <i className="la la-suitcase"></i><span>{car.luggage_capacity}</span>
                              </li>
                              <li
                                className="d-flex align-items-center"
                                data-bs-toggle="tooltip"
                                data-placement="top"
                                title="Transmission"
                              >
                                <i className="la la-cog"></i><span>{car.transmission}</span>
                              </li>
                              <li
                                className="d-flex align-items-center"
                                data-bs-toggle="tooltip"
                                data-placement="top"
                                title="Fuel Type"
                              >
                                <i className="la la-tint"></i><span>{car.fuel_type}</span>
                              </li>
                            </ul>
                          </div>
                          
                          {/* Features */}
                          {features.length > 0 && (
                            <div className="card-features pt-2">
                              <div className="d-flex flex-wrap">
                                {features.slice(0, 3).map((feature, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1 mb-1">
                                    {feature.trim()}
                                  </span>
                                ))}
                                {features.length > 3 && (
                                  <span className="badge bg-secondary me-1 mb-1">
                                    +{features.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="card-price d-flex align-items-center justify-content-between">
                            <p>
                              <span className="price__from">From</span>
                              <span className="price__num">${car.price_per_day}</span>
                              <span className="price__text">Per day</span>
                              {rentalDays > 1 && (
                                <><br />
                                  <small className="text-muted">
                                    Total: ${(car.price_per_day * rentalDays).toFixed(2)} ({rentalDays} days)
                                  </small>
                                </>
                              )}
                            </p>
                            <Link href={buildCarDetailUrl(car.id)} className="btn-text">
                              See details<i className="la la-angle-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Load More Section */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="btn-box mt-3 text-center">
                        <p className="font-size-13 pt-2">
                          Showing {filteredCars.length} of {cars.length} Cars
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Area */}
      <div className="section-block"></div>
      <section className="info-area info-bg padding-top-90px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 responsive-column">
              <a href="#" className="icon-box icon-layout-2 d-flex">
                <div className="info-icon flex-shrink-0 bg-rgb text-color-2">
                  <i className="la la-phone"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Need Help? Contact us</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                  </p>
                </div>
              </a>
            </div>
            <div className="col-lg-4 responsive-column">
              <a href="#" className="icon-box icon-layout-2 d-flex">
                <div className="info-icon flex-shrink-0 bg-rgb-2 text-color-3">
                  <i className="la la-money"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Payments</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                  </p>
                </div>
              </a>
            </div>
            <div className="col-lg-4 responsive-column">
              <a href="#" className="icon-box icon-layout-2 d-flex">
                <div className="info-icon flex-shrink-0 bg-rgb-3 text-color-4">
                  <i className="la la-times"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Cancel Policy</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipisicing
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Area */}
      <section className="cta-area subscriber-area section-bg-2 padding-top-60px padding-bottom-60px">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="section-heading">
                <h2 className="sec__title font-size-30 text-white">
                  Subscribe to see Secret Deals
                </h2>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="subscriber-box">
                <div className="contact-form-action">
                  <form>
                    <div className="input-box">
                      <label className="label-text text-white">Enter email address</label>
                      <div className="form-group mb-0">
                        <span className="la la-envelope form-icon"></span>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Email address"
                        />
                        <button
                          className="theme-btn theme-btn-small submit-btn"
                          type="submit"
                        >
                          Subscribe
                        </button>
                        <span className="font-size-14 pt-1 text-white-50">
                          <i className="la la-lock me-1"></i>Don't worry your information is safe with us.
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
