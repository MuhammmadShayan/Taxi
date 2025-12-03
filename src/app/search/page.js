'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/Header';
import LoginModal from '../../components/LoginModal';
import SignupModal from '../../components/SignupModal';
import { useI18n } from '../../i18n/I18nProvider';

function SearchContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedRatings, setSelectedRatings] = useState(new Set());
  const [priceRange, setPriceRange] = useState(null); // {min, max}
  const [sortOption, setSortOption] = useState('1');
  const [visibleCount, setVisibleCount] = useState(10);
  const PAGE_SIZE = 10;
  const [categoryCounts, setCategoryCounts] = useState({
    CONVERTIBLE: 0,
    COUPE: 0,
    HATCHBACK: 0,
    MINIVAN: 0,
    SEDAN: 0,
    SUV: 0,
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  
  // Form state
  const [searchFormData, setSearchFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    pickup_time: '9:00AM',
    dropoff_date: '',
    dropoff_time: '9:00AM'
  });
  
  // Fetch vehicles data
  const fetchVehicles = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          qs.append(k, String(v));
        }
      });
      const queryString = qs.toString();
      // Prevent redundant fetches for identical queries fired in quick succession
      const key = `/api/vehicles/search?${queryString}`;
      if (!fetchVehicles.lastKeyRef) fetchVehicles.lastKeyRef = { key: '', ts: 0 };
      const now = Date.now();
      if (fetchVehicles.lastKeyRef.key === key && (now - fetchVehicles.lastKeyRef.ts) < 1000) {
        setLoading(false);
        return;
      }
      fetchVehicles.lastKeyRef.key = key;
      fetchVehicles.lastKeyRef.ts = now;
      console.log('Fetching vehicles with URL:', `/api/vehicles/search?${queryString}`);
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/vehicles/search?${queryString}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setVehicles(data.vehicles || []);
      setTotalVehicles(data.pagination?.total_items || 0);
      setFilteredVehicles(data.vehicles || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      if (err.name === 'AbortError') {
        setError('Request timeout - The search is taking too long. Please try again.');
      } else {
        setError(err.message || 'Failed to fetch vehicles');
      }
      
      // Show sample data on error for testing
      const sampleVehicles = [
        {
          id: 1,
          brand: 'BMW',
          model: 'X5',
          category_name: 'SUV',
          year: 2023,
          seats: 5,
          low_price: 120,
          agency_name: 'Premium Rentals',
          agency_rating: 4.8,
          features: ['Air Conditioning', 'GPS Navigation'],
          images: ['/html-folder/images/car-img.jpg']
        },
        {
          id: 2,
          brand: 'Mercedes',
          model: 'E-Class',
          category_name: 'Sedan',
          year: 2022,
          seats: 5,
          low_price: 95,
          agency_name: 'Luxury Cars',
          agency_rating: 4.6,
          features: ['Air Conditioning', 'Leather Seats'],
          images: ['/html-folder/images/car-img2.jpg']
        },
        {
          id: 3,
          brand: 'Toyota',
          model: 'Camry',
          category_name: 'Sedan',
          year: 2023,
          seats: 5,
          low_price: 75,
          agency_name: 'Budget Cars',
          agency_rating: 4.3,
          features: ['Air Conditioning', 'Bluetooth'],
          images: ['/html-folder/images/car-img3.jpg']
        },
        {
          id: 4,
          brand: 'Honda',
          model: 'CR-V',
          category_name: 'SUV',
          year: 2023,
          seats: 7,
          low_price: 85,
          agency_name: 'Family Rentals',
          agency_rating: 4.4,
          features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth'],
          images: ['/html-folder/images/car-img4.jpg']
        }
      ];
      setVehicles(sampleVehicles);
      setFilteredVehicles(sampleVehicles);
      setTotalVehicles(sampleVehicles.length);
    } finally {
      setLoading(false);
    }
  };

  // Initialize form data from URL params and fetch data
  useEffect(() => {
    setMounted(true);
    const formData = {
      pickup_location: searchParams.get('pickup_location') || '',
      dropoff_location: searchParams.get('dropoff_location') || searchParams.get('pickup_location') || '',
      pickup_date: searchParams.get('start_date') || '',
      pickup_time: searchParams.get('pickup_time') || '9:00AM',
      dropoff_date: searchParams.get('end_date') || '',
      dropoff_time: searchParams.get('dropoff_time') || '9:00AM'
    };
    
    setSearchFormData(formData);
    
    // Fetch vehicles if we have search parameters
    if (formData.pickup_location && formData.pickup_date && formData.dropoff_date) {
      const ratingMin = selectedRatings.size > 0 ? Math.min(...Array.from(selectedRatings)) : undefined;
      const categoriesCsv = Array.from(selectedCategories).join(',');
      const priceMin = priceRange?.min;
      const priceMax = priceRange?.max;
      fetchVehicles({
        pickup_location: formData.pickup_location,
        start_date: formData.pickup_date,
        end_date: formData.dropoff_date,
        pickup_time: formData.pickup_time,
        rating_min: ratingMin,
        categories: categoriesCsv,
        min_price: priceMin,
        max_price: priceMax,
        sort: sortOption,
      });
    }
  }, [searchParams]);

  // Re-fetch vehicles when filters change to query server-side
  useEffect(() => {
    if (!mounted) return;
    if (!searchFormData.pickup_location || !searchFormData.pickup_date || !searchFormData.dropoff_date) return;
    const ratingMin = selectedRatings.size > 0 ? Math.min(...Array.from(selectedRatings)) : undefined;
    const categoriesCsv = Array.from(selectedCategories).join(',');
    const priceMin = priceRange?.min;
    const priceMax = priceRange?.max;
    fetchVehicles({
      pickup_location: searchFormData.pickup_location,
      start_date: searchFormData.pickup_date,
      end_date: searchFormData.dropoff_date,
      pickup_time: searchFormData.pickup_time,
      rating_min: ratingMin,
      categories: categoriesCsv,
      min_price: priceMin,
      max_price: priceMax,
      sort: sortOption,
    });
  }, [mounted, selectedRatings, selectedCategories, priceRange, sortOption]);

  // Helpers
  const toNumber = (val) => {
    const m = String(val ?? '').match(/[0-9]+(\.[0-9]+)?/);
    return m ? Number(m[0]) : 0;
  };

  const handleRatingToggle = (value, checked) => {
    setSelectedRatings(prev => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  // Apply filters whenever source vehicles or filter states change
  useEffect(() => {
    const applyFilters = () => {
      let list = Array.isArray(vehicles) ? [...vehicles] : [];

      // Category filter (match case-insensitively)
      if (selectedCategories && selectedCategories.size > 0) {
        list = list.filter(v => {
          const cat = (v.category_name || v.category || '').toString().toUpperCase();
      const map = {
        CONVERTIBLE: ['CONVERTIBLE'],
        COUPE: ['COUPE'],
        HATCHBACK: ['HATCHBACK'],
        MINIVAN: ['MINIVAN', 'VAN'],
        SEDAN: ['SEDAN', 'SMALL CAR', 'CAR'],
        SUV: ['SUV', 'CROSSOVER']
      };
          // if any selected category maps to this vehicle cat
          for (const key of selectedCategories) {
            const allowed = map[key] || [key];
            if (allowed.some(a => cat.includes(a))) return true;
          }
          return false;
        });
      }

      // Rating filter (union of selected buckets)
      if (selectedRatings && selectedRatings.size > 0) {
        const buckets = Array.from(selectedRatings);
        const inSelectedBuckets = (r) => {
          return buckets.some(b => {
            if (b === 4.5) return r >= 4.5;
            if (b === 4.0) return r >= 4.0 && r < 4.5;
            if (b === 3.0) return r >= 3.0 && r < 4.0;
            if (b === 2.0) return r < 3.0; // poor
            return false;
          });
        };
        list = list.filter(v => {
          const r = toNumber(v.agency_rating || v.rating || 0);
          return inSelectedBuckets(r);
        });
      }

      // Price filter
      if (priceRange && typeof priceRange.min === 'number' && typeof priceRange.max === 'number') {
        list = list.filter(v => {
          const raw = (v.pricing && v.pricing.price_per_day) || v.low_price || v.price || 0;
          const price = toNumber(raw);
          return price >= priceRange.min && price <= priceRange.max;
        });
      }
      const priceOf = (v) => {
        const raw = (v.pricing && v.pricing.price_per_day) || v.low_price || v.price || 0;
        return toNumber(raw);
      };
      if (sortOption === '4') {
        list.sort((a,b) => priceOf(a) - priceOf(b));
      } else if (sortOption === '5') {
        list.sort((a,b) => priceOf(b) - priceOf(a));
      } else if (sortOption === '2') {
        list.sort((a,b) => Number(b.year||0) - Number(a.year||0));
      } else {
        list.sort((a,b) => Number(b.agency_rating||b.rating||0) - Number(a.agency_rating||a.rating||0));
      }
      setFilteredVehicles(list);
    };

    applyFilters();
  }, [vehicles, selectedCategories, selectedRatings, priceRange, sortOption]);

  // Compute dynamic category counts based on current availability with other filters (rating/price), excluding category filter itself
  useEffect(() => {
    let list = Array.isArray(vehicles) ? [...vehicles] : [];
    // Apply rating filter (if any) with bucket union for counts
    if (selectedRatings && selectedRatings.size > 0) {
      const buckets = Array.from(selectedRatings);
      const inSelectedBuckets = (r) => {
        return buckets.some(b => {
          if (b === 4.5) return r >= 4.5;
          if (b === 4.0) return r >= 4.0 && r < 4.5;
          if (b === 3.0) return r >= 3.0 && r < 4.0;
          if (b === 2.0) return r < 3.0;
          return false;
        });
      };
      list = list.filter(v => {
        const r = toNumber(v.agency_rating || v.rating || 0);
        return inSelectedBuckets(r);
      });
    }
    // Apply price filter (if any)
    if (priceRange && typeof priceRange.min === 'number' && typeof priceRange.max === 'number') {
      list = list.filter(v => {
        const raw = (v.pricing && v.pricing.price_per_day) || v.low_price || v.price || 0;
        const price = toNumber(raw);
        return price >= priceRange.min && price <= priceRange.max;
      });
    }
    const counts = { CONVERTIBLE: 0, COUPE: 0, HATCHBACK: 0, MINIVAN: 0, SEDAN: 0, SUV: 0 };
    const normalize = (s) => String(s || '').toUpperCase();
    const map = {
      CONVERTIBLE: ['CONVERTIBLE'],
      COUPE: ['COUPE'],
      HATCHBACK: ['HATCHBACK'],
      MINIVAN: ['MINIVAN', 'VAN'],
      SEDAN: ['SEDAN', 'SMALL CAR', 'CAR'],
      SUV: ['SUV', 'CROSSOVER'],
    };
    list.forEach(v => {
      const cat = normalize(v.category_name || v.category || '');
      Object.keys(map).forEach(key => {
        const allowed = map[key];
        if (allowed.some(a => cat.includes(a))) counts[key] += 1;
      });
    });
    setCategoryCounts(counts);
  }, [vehicles, selectedRatings, priceRange]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [vehicles, selectedCategories, selectedRatings, priceRange, sortOption]);

  // Handlers for sidebar filters
  const toggleCategory = (key, checked) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const setRating = (threshold) => {
    handleRatingToggle(threshold, true);
  };

  const applyPriceFromInputs = () => {
    try {
      const el = document.getElementById('amount2');
      const raw = el ? el.value || '' : '';
      // Expect formats like "$40 - $800" or "40 - 800"
      const nums = (raw.match(/\d+\.?\d*/g) || []).map(n => Number(n));
      if (nums.length >= 2) {
        const min = Math.min(nums[0], nums[1]);
        const max = Math.max(nums[0], nums[1]);
        setPriceRange({ min, max });
      } else if (nums.length === 1) {
        const max = nums[0];
        setPriceRange({ min: 0, max });
      }
    } catch {}
  };
  const applyPriceFromTop = () => {
    try {
      const el = document.getElementById('amount');
      const raw = el ? el.value || '' : '';
      const nums = (raw.match(/\d+\.?\d*/g) || []).map(n => Number(n));
      if (nums.length >= 2) {
        const min = Math.min(nums[0], nums[1]);
        const max = Math.max(nums[0], nums[1]);
        setPriceRange({ min, max });
      } else if (nums.length === 1) {
        const max = nums[0];
        setPriceRange({ min: 0, max });
      }
    } catch {}
  };
  
  // Get values for display (fallback to empty string if not mounted)
  const pickup_location = mounted ? searchFormData.pickup_location : '';
  const start_date = mounted ? searchFormData.pickup_date : '';
  const end_date = mounted ? searchFormData.dropoff_date : '';
  const pickup_time = mounted ? searchFormData.pickup_time : '9:00AM';
  const dropoff_time = mounted ? searchFormData.dropoff_time : '9:00AM';
  const filtersActive = (selectedCategories.size > 0) || (selectedRatings.size > 0) || !!priceRange || (sortOption !== '1');
  const renderList = filtersActive ? filteredVehicles : vehicles;
  const listToShow = renderList.slice(0, visibleCount);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setSearchFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!searchFormData.pickup_location || !searchFormData.pickup_date || !searchFormData.dropoff_date) {
alert(t('errors.required_fields'));
      return;
    }
    
    // Create new search URL
    const params = new URLSearchParams({
      pickup_location: searchFormData.pickup_location,
      dropoff_location: searchFormData.dropoff_location || searchFormData.pickup_location,
      start_date: searchFormData.pickup_date,
      end_date: searchFormData.dropoff_date,
      pickup_time: searchFormData.pickup_time,
      dropoff_time: searchFormData.dropoff_time
    });
    
    // Navigate to updated search results
    router.push(`/search?${params.toString()}`);
    
    // Save search to database (non-blocking)
    fetch('/api/car-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchFormData)
    }).catch(error => console.error('Error saving search:', error));
  };

  return (
    <>
      <Head>
        {/* Preload critical CSS */}
        <link rel="preload" href="/html-folder/css/bootstrap.min.css" as="style" />
        <link rel="preload" href="/html-folder/css/style.css" as="style" />
        
        {/* CSS imports */}
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
        
        {/* Non-critical CSS loaded after page load */}
        <link rel="preload" href="/html-folder/css/select2.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/html-folder/css/owl.carousel.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/html-folder/css/jquery.fancybox.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <link rel="preload" href="/html-folder/css/animate.min.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
      </Head>

      {/* start cssload-loader - Only show on client side to avoid hydration issues */}
      {mounted && (
        <div className="preloader" id="preloader" style={{ display: loading ? 'flex' : 'none' }}>
          <div className="loader">
            <svg className="spinner" viewBox="0 0 50 50">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
          </div>
        </div>
      )}
      
      {/* ================================
          START HEADER AREA
      ================================= */}
      <Header />

      {/* ================================
          START BREADCRUMB AREA
      ================================= */}
      <section className="breadcrumb-area bread-bg-8">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
<h2 className="sec__title text-white">{t('search_results.title')}</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
<li><Link href="/">{t('nav.home')}</Link></li>
                    <li>{t('nav.cars')}</li>
                    <li>{t('search_results.breadcrumb_current')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bread-svg-box">
          <svg className="bread-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
            <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
          </svg>
        </div>
      </section>

      {/* ================================
          START CARD AREA
      ================================= */}
      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="filter-wrap margin-bottom-30px">
                <div className="filter-top d-flex align-items-center justify-content-between pb-4">
                  <div>
                    <h3 className="title font-size-24" suppressHydrationWarning>
{loading ? t('search_results.searching') : t('search_results.found_count', { count: totalVehicles })}
                    </h3>
<p className="font-size-14">
                      <span className="me-1 pt-1">{t('search_results.book_with_confidence')}</span> {t('search_results.no_booking_fees')}
                    </p>
                    {pickup_location && (
<p className="font-size-14 text-muted">
                        {t('search_results.search_summary', { pickup: pickup_location, start: start_date, end: end_date })}
                      </p>
                    )}
                  </div>
                  <div className="layout-view d-flex align-items-center">
                    {mounted && (
                      <>
                        <button 
                          type="button"
                          className={`btn btn-link p-0 me-3 ${viewMode === 'grid' ? 'text-primary' : ''}`}
                          title="Grid View"
                          aria-label="Grid view"
                          onClick={() => setViewMode('grid')}
                        >
                          <i className="la la-th-large"></i>
                        </button>
                        <button 
                          type="button"
                          className={`btn btn-link p-0 ${viewMode === 'list' ? 'text-primary' : ''}`}
                          title="List View"
                          aria-label="List view"
                          onClick={() => setViewMode('list')}
                        >
                          <i className="la la-th-list"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="filter-bar d-flex align-items-center justify-content-between">
                  <div className="filter-bar-filter d-flex flex-wrap align-items-center">
                    <div className="filter-option">
<h3 className="title font-size-16">{t('search_results.filter_by')}</h3>
                    </div>
                    <div className="filter-option">
                      <div className="dropdown dropdown-contain">
                        <a className="dropdown-toggle dropdown-btn dropdown--btn" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
{t('search_results.filter_price')}
                        </a>
                        <div className="dropdown-menu dropdown-menu-wrap">
                          <div className="dropdown-item">
                            <div className="slider-range-wrap">
                              <div className="price-slider-amount padding-bottom-20px">
<label htmlFor="amount" className="filter__label">{t('search_results.price')}:</label>
                                <input type="text" id="amount" className="amounts" />
                              </div>
                              {mounted && <div id="slider-range"></div>}
                            </div>
                            <div className="btn-box pt-4">
                              <button className="theme-btn theme-btn-small theme-btn-transparent" type="button" onClick={applyPriceFromTop}>
                                {t('common.apply')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-option">
                      <div className="dropdown dropdown-contain">
                        <a className="dropdown-toggle dropdown-btn dropdown--btn" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
{t('search_results.review_score')}
                        </a>
                        <div className="dropdown-menu dropdown-menu-wrap">
                          <div className="dropdown-item">
                            <div className="checkbox-wrap">
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="r1" onChange={(e)=>handleRatingToggle(4.5, e.target.checked)} />
                                <label htmlFor="r1">
                                  <span className="ratings d-flex align-items-center">
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <span className="color-text-3 font-size-13 ms-1">(55.590)</span>
                                  </span>
                                </label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="r2" onChange={(e)=>handleRatingToggle(4.0, e.target.checked)} />
                                <label htmlFor="r2">
                                  <span className="ratings d-flex align-items-center">
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star-o"></i>
                                    <span className="color-text-3 font-size-13 ms-1">(40.590)</span>
                                  </span>
                                </label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="r3" onChange={(e)=>handleRatingToggle(3.0, e.target.checked)} />
                                <label htmlFor="r3">
                                  <span className="ratings d-flex align-items-center">
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star"></i>
                                    <i className="la la-star-o"></i>
                                    <i className="la la-star-o"></i>
                                    <span className="color-text-3 font-size-13 ms-1">(23.590)</span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-option">
                      <div className="dropdown dropdown-contain">
                        <a className="dropdown-toggle dropdown-btn dropdown--btn" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
{t('search_results.categories')}
                        </a>
                        <div className="dropdown-menu dropdown-menu-wrap">
                          <div className="dropdown-item">
                            <div className="checkbox-wrap">
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="catChb1" onChange={(e)=>toggleCategory('CONVERTIBLE', e.target.checked)} />
<label htmlFor="catChb1">{t('cars.categories.convertibles')}</label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="catChb2" onChange={(e)=>toggleCategory('COUPE', e.target.checked)} />
<label htmlFor="catChb2">{t('cars.categories.coupes')}</label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="catChb3" onChange={(e)=>toggleCategory('MINIVAN', e.target.checked)} />
<label htmlFor="catChb3">{t('cars.categories.minivans')}</label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="catChb4" onChange={(e)=>toggleCategory('SEDAN', e.target.checked)} />
<label htmlFor="catChb4">{t('cars.categories.sedan')}</label>
                              </div>
                              <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="catChb5" onChange={(e)=>toggleCategory('SUV', e.target.checked)} />
<label htmlFor="catChb5">{t('cars.categories.suvs')}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="select-contain select2-container-wrapper">
                    <select className="select-contain-select" value={sortOption} onChange={(e)=>setSortOption(e.target.value)}>
                      <option value="1">{t('search_results.sort_default')}</option>
                      <option value="2">{t('search_results.sort_new')}</option>
                      <option value="3">{t('search_results.sort_popular')}</option>
                      <option value="4">{t('search_results.sort_price_low_high')}</option>
                      <option value="5">{t('search_results.sort_price_high_low')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="sidebar mt-0">
                

                <div className="sidebar-widget">
<h3 className="title stroke-shape">{t('search_results.filter_by_price')}</h3>
                    <div className="sidebar-price-range">
                    <div className="slider-range-wrap">
                      <div className="price-slider-amount padding-bottom-20px">
<label htmlFor="amount2" className="filter__label">{t('search_results.price')}:</label>
                        <input type="text" id="amount2" className="amounts" />
                      </div>
                      {mounted && <div id="slider-range2"></div>}
                    </div>
                    <div className="btn-box pt-4">
                      <button className="theme-btn theme-btn-small theme-btn-transparent" type="button" onClick={applyPriceFromInputs}>
                        {t('common.apply')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sidebar-widget">
<h3 className="title stroke-shape">{t('search_results.review_score')}</h3>
                    <div className="sidebar-category">
                      <div className="custom-checkbox">
                      <input type="checkbox" className="form-check-input" id="r6" onChange={(e) => handleRatingToggle(4.5, e.target.checked)} />
                      <label htmlFor="r6">{t('search_results.rating.excellent')}</label>
                      </div>
                      <div className="custom-checkbox">
                      <input type="checkbox" className="form-check-input" id="r7" onChange={(e) => handleRatingToggle(4.0, e.target.checked)} />
                      <label htmlFor="r7">{t('search_results.rating.very_good')}</label>
                      </div>
                      <div className="custom-checkbox">
                      <input type="checkbox" className="form-check-input" id="r8" onChange={(e) => handleRatingToggle(3.0, e.target.checked)} />
                      <label htmlFor="r8">{t('search_results.rating.average')}</label>
                      </div>
                      <div className="custom-checkbox">
                      <input type="checkbox" className="form-check-input" id="r9" onChange={(e) => handleRatingToggle(2.0, e.target.checked)} />
                      <label htmlFor="r9">{t('search_results.rating.poor')}</label>
                      </div>
                    </div>
                </div>

                <div className="sidebar-widget">
<h3 className="title stroke-shape">{t('search_results.categories')}</h3>
                    <div className="sidebar-category">
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat1" onChange={(e) => toggleCategory('CONVERTIBLE', e.target.checked)} />
                        <label htmlFor="cat1">{t('cars.categories.convertibles')} <span className="font-size-13 ms-1">({categoryCounts.CONVERTIBLE})</span></label>
                      </div>
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat2" onChange={(e) => toggleCategory('COUPE', e.target.checked)} />
                        <label htmlFor="cat2">{t('cars.categories.coupes')} <span className="font-size-13 ms-1">({categoryCounts.COUPE})</span></label>
                      </div>
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat3" onChange={(e) => toggleCategory('HATCHBACK', e.target.checked)} />
                        <label htmlFor="cat3">{t('cars.categories.hatchbacks')} <span className="font-size-13 ms-1">({categoryCounts.HATCHBACK})</span></label>
                      </div>
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat4" onChange={(e) => toggleCategory('MINIVAN', e.target.checked)} />
                        <label htmlFor="cat4">{t('cars.categories.minivans')} <span className="font-size-13 ms-1">({categoryCounts.MINIVAN})</span></label>
                      </div>
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat5" onChange={(e) => toggleCategory('SEDAN', e.target.checked)} />
                        <label htmlFor="cat5">{t('cars.categories.sedan')} <span className="font-size-13 ms-1">({categoryCounts.SEDAN})</span></label>
                      </div>
                      <div className="custom-checkbox">
                        <input type="checkbox" className="form-check-input" id="cat6" onChange={(e) => toggleCategory('SUV', e.target.checked)} />
                        <label htmlFor="cat6">{t('cars.categories.suvs')} <span className="font-size-13 ms-1">({categoryCounts.SUV})</span></label>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Searching for available vehicles...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Search Error</h4>
                  <p>{error}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && renderList.length === 0 && mounted && (
                <div className="text-center py-5">
                  <i className="la la-car" style={{fontSize: '4rem', color: '#ccc'}}></i>
                  <h3 className="mt-3">No vehicles found</h3>
                  <p className="text-muted">Try adjusting your search criteria</p>
                </div>
              )}

              {/* Vehicle Results */}
              {!loading && !error && listToShow.map((vehicle, index) => (
                <div key={vehicle.id || index} className={`card-item car-card ${viewMode === 'list' ? 'card-item-list' : ''}`}>
                  <div className="card-img padding-top-50px">
                    <Link href={`/vehicles/${vehicle.id}?${searchParams.toString()}`} className="d-block">
                      <img 
                        src={vehicle.images && vehicle.images.length > 0 
                          ? vehicle.images[0] 
                          : '/html-folder/images/car-img.jpg'
                        } 
                        alt={`${vehicle.brand} ${vehicle.model}`} 
                        className="h-100" 
                        onError={(e) => {
                          e.target.src = '/html-folder/images/car-img.jpg';
                        }}
                      />
                    </Link>
                    {vehicle.is_featured && <span className="badge">Featured</span>}
                    <div className="add-to-wishlist icon-element" data-bs-toggle="tooltip" data-placement="top" title="Save for later">
                      <i className="la la-heart-o"></i>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-meta">{vehicle.category_name || 'Car'}</p>
                    <h3 className="card-title">
                      <Link href={`/vehicles/${vehicle.id}?${searchParams.toString()}`}>
                        {vehicle.brand} {vehicle.model} {vehicle.year} or Similar
                      </Link>
                    </h3>
                    <div className="card-rating">
                      <span className="badge text-white">
                        {vehicle.agency_rating ? `${vehicle.agency_rating}/5` : 'New'}
                      </span>
                      <span className="review__text">
                        {vehicle.agency_rating >= 4 ? 'Excellent' : 
                         vehicle.agency_rating >= 3 ? 'Good' : 'Average'}
                      </span>
                      <span className="rating__text">({vehicle.agency_name})</span>
                    </div>
                    <div className="card-attributes">
                      <ul className="d-flex align-items-center">
                        <li className="d-flex align-items-center" data-bs-toggle="tooltip" data-placement="top" title="Passenger">
                          <i className="la la-users"></i><span>{vehicle.seats}</span>
                        </li>
                        <li className="d-flex align-items-center" data-bs-toggle="tooltip" data-placement="top" title="Fuel Type">
                          <i className="la la-gas-pump"></i><span>{vehicle.energy}</span>
                        </li>
                        <li className="d-flex align-items-center" data-bs-toggle="tooltip" data-placement="top" title="Transmission">
                          <i className="la la-cog"></i><span>{vehicle.gear_type}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="card-price d-flex align-items-center justify-content-between">
                      <p>
                        <span className="price__from">From</span>
                        <span className="price__num">
                          ${vehicle.pricing ? vehicle.pricing.price_per_day : vehicle.low_price}
                        </span>
                        <span className="price__text">Per day</span>
                      </p>
                      <Link href={`/vehicles/${vehicle.id}?${searchParams.toString()}`} className="btn-text">
                        See details<i className="la la-angle-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
          {/* Pagination/Load More */}
          {!loading && !error && renderList.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="btn-box mt-3 text-center">
                  {renderList.length > visibleCount && (
                    <button type="button" className="theme-btn" onClick={() => {
                      setVisibleCount(Math.min(visibleCount + PAGE_SIZE, renderList.length));
                    }}>
                      <i className="la la-refresh me-1"></i>Load More
                    </button>
                  )}
                  <p className="font-size-13 pt-2">Showing {Math.min(visibleCount, renderList.length)} of {renderList.length} Cars</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================================
          START INFO AREA
      ================================= */}
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

      {/* ================================
          START CTA AREA
      ================================= */}
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
                  <form action="#">
                    <div className="input-box">
                      <label className="label-text text-white">Enter email address</label>
                      <div className="form-group mb-0">
                        <span className="la la-envelope form-icon"></span>
                        <input className="form-control" type="email" name="email" placeholder="Email address" />
                        <button className="theme-btn theme-btn-small submit-btn" type="submit">
                          Subscribe
                        </button>
                        <span className="font-size-14 pt-1 text-white-50">
                          <i className="la la-lock me-1"></i>Don&apos;t worry your information is safe with us.
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

      {/* ================================
          START FOOTER AREA
      ================================= */}
      <section className="footer-area section-bg padding-top-100px padding-bottom-30px">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <div className="footer-logo padding-bottom-30px">
                  <Link href="/" className="foot__logo">
                    <img src="/html-folder/images/logo.png" alt="logo" />
                  </Link>
                </div>
                <p className="footer__desc">
                  Morbi convallis bibendum urna ut viverra. Maecenas consequat
                </p>
                <ul className="list-items pt-3">
                  <li>3015 Grand Ave, Coconut Grove,<br />Cerrick Way, FL 12345</li>
                  <li>+212 600 123 456</li>
                  <li><a href="#">info@holikey.com</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
                  Company
                </h4>
                <ul className="list-items list--items">
                  <li><a href="#">About us</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Jobs</a></li>
                  <li><a href="#">News</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="#">Advertising</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
                  Other Services
                </h4>
                <ul className="list-items list--items">
                  <li><a href="#">Investor Relations</a></li>
                  <li><a href="#">HOLIKEY.com Rewards</a></li>
                  <li><a href="#">Partners</a></li>
                  <li><a href="#">List My Hotel</a></li>
                  <li><a href="#">All Hotels</a></li>
                  <li><a href="#">TV Ads</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px" data-text="curvs">
                  Other Links
                </h4>
                <ul className="list-items list--items">
                  <li><a href="#">Morocco Vacation Packages</a></li>
                  <li><a href="#">Morocco Flights</a></li>
                  <li><a href="#">Morocco Hotels</a></li>
                  <li><a href="#">Morocco Car Hire</a></li>
                  <li><a href="#">Create an Account</a></li>
                  <li><a href="#">HOLIKEY Reviews</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="term-box footer-item">
                <ul className="list-items list--items d-flex align-items-center">
                  <li><a href="#">Terms & Conditions</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Help Center</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="footer-social-box text-end">
                <ul className="social-profile">
                  <li><a href="#"><i className="lab la-facebook-f"></i></a></li>
                  <li><a href="#"><i className="lab la-twitter"></i></a></li>
                  <li><a href="#"><i className="lab la-instagram"></i></a></li>
                  <li><a href="#"><i className="lab la-linkedin-in"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block mt-4"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="copy-right padding-top-30px">
                <p className="copy__desc">
                  &copy; Copyright HOLIKEY 2025. Made with
                  <span className="la la-heart"></span> for Morocco
                </p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="copy-right-content d-flex align-items-center justify-content-end padding-top-30px">
                <h3 className="title font-size-15 pe-2">We Accept</h3>
                <img src="/html-folder/images/payment-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>

      {/* Modal Components */}
      <LoginModal />
      <SignupModal />

      {/* Conflict Prevention Script - Load first */}
      <Script src="/js/react-template-patch.js" strategy="beforeInteractive" />
      
      {/* Essential JS - Load immediately */}
      <Script src="/html-folder/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      
      {/* Non-critical JS - Load after page interactive */}
      <Script src="/html-folder/js/jquery-ui.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/select2.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/main.js" strategy="afterInteractive" />
      
      {/* Optional/Heavy JS - Load lazily when needed */}
      <Script src="/html-folder/js/moment.min.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/daterangepicker.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/owl.carousel.min.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/jquery.fancybox.min.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/jquery.countTo.min.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/animated-headline.js" strategy="lazyOnload" />
      <Script src="/html-folder/js/jquery.ripples-min.js" strategy="lazyOnload" />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
