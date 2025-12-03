'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import ClientOnlySelectors from '../components/ClientOnlySelectors';
import LocationAutocomplete from '../components/LocationAutocomplete';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { useI18n } from '../i18n/I18nProvider';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const { formatCurrency, convertAmount } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [agencyVehicles, setAgencyVehicles] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState('all');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState(null);
  
  // Fix hydration mismatch and signal to legacy scripts that React has hydrated
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      window.__NEXT_HYDRATED__ = true;
      // Scroll to top when page loads
      window.scrollTo(0, 0);
      // Optionally allow legacy jQuery carousel for client logos after hydration
      // window.ENABLE_JQUERY_CLIENT_LOGO = true; // Uncomment if you want jQuery OwlCarousel
    }
  }, []);
  
  // Fetch trending vehicles from agency_vehicles table
  useEffect(() => {
    const fetchTrendingVehicles = async () => {
      try {
        setVehiclesLoading(true);
        const response = await fetch('/api/vehicles/trending');
        const data = await response.json();
        
        if (data.success) {
          setAgencyVehicles(data.vehicles || []);
          setAgencies(data.agencies || []);
          setFilteredVehicles(data.vehicles || []);
          setVehiclesError(null);
        } else {
          console.warn('API returned non-success response:', data);
          setAgencyVehicles(data.vehicles || []);
          setAgencies(data.agencies || []);
          setFilteredVehicles(data.vehicles || []);
          setVehiclesError(data.error || 'Failed to load vehicles');
        }
      } catch (error) {
        console.error('Error fetching trending vehicles:', error);
        setVehiclesError('Failed to load vehicles');
        setAgencyVehicles([]);
      } finally {
        setVehiclesLoading(false);
      }
    };

    if (mounted) {
      fetchTrendingVehicles();
    }
  }, [mounted]);
  
  // Filter vehicles by selected agency
  useEffect(() => {
    if (selectedAgency === 'all') {
      setFilteredVehicles(agencyVehicles);
    } else {
      const filtered = agencyVehicles.filter(vehicle => vehicle.agency_id == selectedAgency);
      setFilteredVehicles(filtered);
    }
  }, [selectedAgency, agencyVehicles]);
  
  // Handle agency tab selection
  const handleAgencySelect = (agencyId) => {
    setSelectedAgency(agencyId);
  };
  
  // Removed carousel logic - using reliable grid layout for all vehicles
  
  const [formData, setFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    pickup_time: '9:00AM',
    dropoff_date: '',
    dropoff_time: '9:00AM',
    car_type: '1',
    rental_company: '',
    discount_code: '0'
  });


  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.pickup_location || !formData.pickup_date || !formData.dropoff_date) {
alert(t('errors.required_fields'));
      return;
    }
    const params = new URLSearchParams({
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location || formData.pickup_location,
      start_date: formData.pickup_date,
      end_date: formData.dropoff_date,
      pickup_time: formData.pickup_time,
      dropoff_time: formData.dropoff_time,
      car_type: formData.car_type,
      rental_company: formData.rental_company,
      discount_code: formData.discount_code
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle place selection from Google Places Autocomplete
  const handlePickupPlaceSelect = (place) => {
    setFormData(prev => ({ ...prev, pickup_location: place.formatted_address || place.name }));
  };

  const handleDropoffPlaceSelect = (place) => {
    setFormData(prev => ({ ...prev, dropoff_location: place.formatted_address || place.name }));
  };


  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
      <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
      <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
      <link rel="stylesheet" href="/html-folder/css/flag-icon.min.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{__html: `
        .search-fields-container .form-group .form-icon.la.la-calendar{color:#000!important;opacity:1!important}
        .search-fields-container input[type="date"]::-webkit-calendar-picker-indicator{opacity:1!important;filter:brightness(0)!important}
        .search-fields-container input[type="date"]{color:#0d233e}
      `}} />
      
      <div>
        {/* Auth Debugger for testing */}
        
        
        {/* ================================
            START HEADER AREA
        ================================= */}
        <Header />

        {/* ================================
            START HERO-WRAPPER AREA
        ================================= */}
        <section className="hero-wrapper hero-wrapper4" suppressHydrationWarning={true}>
          <div className="hero-box hero-bg-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <div className="hero-content mt-0">
                    <div className="section-heading">
                      <h2 className="sec__title">
                        {t('hero.title')}
                      </h2>
                      <p className="sec__desc pt-3 font-size-18">
                        {t('hero.subtitle')}
                      </p>
                    </div>
                  </div>
                  {/* Hero features list */}
                  <div className="hero-list-box margin-top-40px">
                    <ul className="list-items">
                      <li className="d-flex align-items-center">
                        <svg viewBox="-73 0 512 512.15596" xmlns="http://www.w3.org/2000/svg">
                          <path d="m1.78125 232.433594c-3.957031 10.554687-.867188 22.460937 7.730469 29.753906 16.289062 16.300781 49.789062 75.144531 66.371093 116.609375 11.316407 28.28125 36.164063 56.039063 55.015626 74.351563 8.113281 7.984374 12.667968 18.898437 12.644531 30.285156v3.121094c0 14.140624 11.460937 25.601562 25.601562 25.601562h136.53125c14.140625 0 25.601563-11.460938 25.601563-25.601562v-26.214844c-.078125-2.167969.746094-4.273438 2.277344-5.808594 31.496093-28.800781 31.855468-76.878906 31.855468-78.910156v-135.089844c.316406-18.273438-13.460937-33.722656-31.648437-35.488281-6.835938-.449219-13.648438 1.171875-19.550781 4.648437v-13.269531c.070312-12.296875-6.515626-23.667969-17.21875-29.726563-10.699219-6.058593-23.839844-5.855468-34.347657.535157-1.09375-11.511719-8.007812-21.660157-18.316406-26.890625-10.3125-5.230469-22.582031-4.820313-32.519531 1.09375v-14.132813c21.179687-12.019531 34.226562-34.527343 34.136718-58.878906 0-37.703125-30.566406-68.265625-68.269531-68.265625s-68.265625 30.5625-68.265625 68.265625c-.089844 24.351563 12.957032 46.859375 34.132813 58.878906v137.386719c.242187 10.074219-1.128907 20.117188-4.0625 29.757812-.914063 2.847657-3.246094 5.019532-6.152344 5.734376-2.734375.691406-5.632813-.070313-7.679687-2.015626-6.664063-6.355468-12.585938-13.449218-17.644532-21.144531-14.808594-22.152343-52.070312-63.53125-75.394531-63.53125-13.101563-.273437-25.152344 7.132813-30.828125 18.945313z" />
                        </svg>
<span>{t('home.features.free_cancellations')}</span>
                      </li>
                      <li className="d-flex align-items-center">
                        <svg viewBox="0 0 52 60" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path d="m7 35h14.354l1.454 3.994-.958 2.636c-.1846791.4673778-.550069.8405077-1.0134734 1.0349418-.4634045.1944342-.9856451.1937341-1.4485266-.0019418l-.036-.013h-.012c-4.148-1.5-8.9 1.068-10.59 5.723s.3 9.684 4.439 11.2c4.217 1.529 8.934-1.138 10.6-5.728l2.211-6.08 2.213 6.079c.7681989 2.1829185 2.3025125 4.0128664 4.318 5.15 1.902527 1.1176044 4.2045361 1.3279064 6.2780786.5735392 2.0735426-.7543671 3.7022803-2.3946983 4.4419214-4.4735392 1.6263512-4.4809857-.1945815-9.4831776-4.321-11.87-1.9215394-1.103671-4.2309581-1.3073357-6.316-.557-.5027979.190678-1.0605312.1752254-1.552-.043-.4254396-.193397-.7539361-.5514943-.91-.992l-.958-2.632 1.456-4h14.35c3.8641657-.0044086 6.9955914-3.1358343 7-7v-21c-.0044086-3.86416566-3.1358343-6.99559136-7-7h-38c-3.86416566.00440864-6.99559136 3.13583434-7 7v21c.00440864 3.8641657 3.13583434 6.9955914 7 7z" />
                          </g>
                        </svg>
<span>{t('home.features.no_credit_card_fees')}</span>
                      </li>
                      <li className="d-flex align-items-center">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M366,396c-5.52,0-10,4.48-10,10c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10C376,400.48,371.52,396,366,396z" />
                        </svg>
                        <span>{t('home.features.customer_support')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Search Form Column */}
                <div className="col-lg-5">
                  <div className="search-fields-container search-fields-container-shape" suppressHydrationWarning={true}>
                    <div className="search-fields-container-inner">
                      <h3 className="title pb-3">{t('home.search_form.title')}</h3>
                      <div className="section-block"></div>
                      <div className="contact-form-action pt-3">
                        <form onSubmit={handleSearch} className="row">
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">{t('hero.pickup_location')}</label>
                              <div className="form-group">
                                <span className="la la-map-marker form-icon"></span>
                                <LocationAutocomplete
                                  placeholder={t('home.search_form.pickup_placeholder')}
                                  onPlaceSelect={handlePickupPlaceSelect}
                                  value={formData.pickup_location}
                                  onChange={(value) => setFormData(prev => ({ ...prev, pickup_location: value }))}
                                  className="form-control"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">{t('hero.dropoff_location')}</label>
                              <div className="form-group">
                                <span className="la la-map-marker form-icon"></span>
                                <LocationAutocomplete
                                  placeholder={t('home.search_form.dropoff_placeholder')}
                                  onPlaceSelect={handleDropoffPlaceSelect}
                                  value={formData.dropoff_location}
                                  onChange={(value) => setFormData(prev => ({ ...prev, dropoff_location: value }))}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-8 col-sm-7">
                            <div className="input-box">
                              <label className="label-text">{t('hero.pickup_date')}</label>
                              <div className="form-group">
                                <span className="la la-calendar form-icon"></span>
                                <input
                                  className="form-control"
                                  type="date"
                                  name="pickup_date"
                                  value={formData.pickup_date}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-5 ps-0">
                            <div className="input-box">
                              <label className="label-text">{t('common.time')}</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain select-contain-shadow w-auto">
                                  <select 
                                    className="select-contain-select" 
                                    name="pickup_time" 
                                    value={formData.pickup_time} 
                                    onChange={handleInputChange}
                                  >
                                    <option value="12:00AM">12:00 AM</option>
                                    <option value="12:30AM">12:30 AM</option>
                                    <option value="1:00AM">1:00 AM</option>
                                    <option value="1:30AM">1:30 AM</option>
                                    <option value="2:00AM">2:00 AM</option>
                                    <option value="2:30AM">2:30 AM</option>
                                    <option value="3:00AM">3:00 AM</option>
                                    <option value="3:30AM">3:30 AM</option>
                                    <option value="4:00AM">4:00 AM</option>
                                    <option value="4:30AM">4:30 AM</option>
                                    <option value="5:00AM">5:00 AM</option>
                                    <option value="5:30AM">5:30 AM</option>
                                    <option value="6:00AM">6:00 AM</option>
                                    <option value="6:30AM">6:30 AM</option>
                                    <option value="7:00AM">7:00 AM</option>
                                    <option value="7:30AM">7:30 AM</option>
                                    <option value="8:00AM">8:00 AM</option>
                                    <option value="8:30AM">8:30 AM</option>
                                    <option value="9:00AM">9:00 AM</option>
                                    <option value="9:30AM">9:30 AM</option>
                                    <option value="10:00AM">10:00 AM</option>
                                    <option value="10:30AM">10:30 AM</option>
                                    <option value="11:00AM">11:00 AM</option>
                                    <option value="11:30AM">11:30 AM</option>
                                    <option value="12:00PM">12:00 PM</option>
                                    <option value="12:30PM">12:30 PM</option>
                                    <option value="1:00PM">1:00 PM</option>
                                    <option value="1:30PM">1:30 PM</option>
                                    <option value="2:00PM">2:00 PM</option>
                                    <option value="2:30PM">2:30 PM</option>
                                    <option value="3:00PM">3:00 PM</option>
                                    <option value="3:30PM">3:30 PM</option>
                                    <option value="4:00PM">4:00 PM</option>
                                    <option value="4:30PM">4:30 PM</option>
                                    <option value="5:00PM">5:00 PM</option>
                                    <option value="5:30PM">5:30 PM</option>
                                    <option value="6:00PM">6:00 PM</option>
                                    <option value="6:30PM">6:30 PM</option>
                                    <option value="7:00PM">7:00 PM</option>
                                    <option value="7:30PM">7:30 PM</option>
                                    <option value="8:00PM">8:00 PM</option>
                                    <option value="8:30PM">8:30 PM</option>
                                    <option value="9:00PM">9:00 PM</option>
                                    <option value="9:30PM">9:30 PM</option>
                                    <option value="10:00PM">10:00 PM</option>
                                    <option value="10:30PM">10:30 PM</option>
                                    <option value="11:00PM">11:00 PM</option>
                                    <option value="11:30PM">11:30 PM</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-8 col-sm-7">
                            <div className="input-box">
                              <label className="label-text">{t('hero.dropoff_date')}</label>
                              <div className="form-group">
                                <span className="la la-calendar form-icon"></span>
                                <input
                                  className="form-control"
                                  type="date"
                                  name="dropoff_date"
                                  value={formData.dropoff_date}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-5 ps-0">
                            <div className="input-box">
                              <label className="label-text">{t('common.time')}</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain select-contain-shadow w-auto">
                                  <select 
                                    className="select-contain-select" 
                                    name="dropoff_time" 
                                    value={formData.dropoff_time} 
                                    onChange={handleInputChange}
                                  >
                                    <option value="12:00AM">12:00 AM</option>
                                    <option value="12:30AM">12:30 AM</option>
                                    <option value="1:00AM">1:00 AM</option>
                                    <option value="1:30AM">1:30 AM</option>
                                    <option value="2:00AM">2:00 AM</option>
                                    <option value="2:30AM">2:30 AM</option>
                                    <option value="3:00AM">3:00 AM</option>
                                    <option value="3:30AM">3:30 AM</option>
                                    <option value="4:00AM">4:00 AM</option>
                                    <option value="4:30AM">4:30 AM</option>
                                    <option value="5:00AM">5:00 AM</option>
                                    <option value="5:30AM">5:30 AM</option>
                                    <option value="6:00AM">6:00 AM</option>
                                    <option value="6:30AM">6:30 AM</option>
                                    <option value="7:00AM">7:00 AM</option>
                                    <option value="7:30AM">7:30 AM</option>
                                    <option value="8:00AM">8:00 AM</option>
                                    <option value="8:30AM">8:30 AM</option>
                                    <option value="9:00AM">9:00 AM</option>
                                    <option value="9:30AM">9:30 AM</option>
                                    <option value="10:00AM">10:00 AM</option>
                                    <option value="10:30AM">10:30 AM</option>
                                    <option value="11:00AM">11:00 AM</option>
                                    <option value="11:30AM">11:30 AM</option>
                                    <option value="12:00PM">12:00 PM</option>
                                    <option value="12:30PM">12:30 PM</option>
                                    <option value="1:00PM">1:00 PM</option>
                                    <option value="1:30PM">1:30 PM</option>
                                    <option value="2:00PM">2:00 PM</option>
                                    <option value="2:30PM">2:30 PM</option>
                                    <option value="3:00PM">3:00 PM</option>
                                    <option value="3:30PM">3:30 PM</option>
                                    <option value="4:00PM">4:00 PM</option>
                                    <option value="4:30PM">4:30 PM</option>
                                    <option value="5:00PM">5:00 PM</option>
                                    <option value="5:30PM">5:30 PM</option>
                                    <option value="6:00PM">6:00 PM</option>
                                    <option value="6:30PM">6:30 PM</option>
                                    <option value="7:00PM">7:00 PM</option>
                                    <option value="7:30PM">7:30 PM</option>
                                    <option value="8:00PM">8:00 PM</option>
                                    <option value="8:30PM">8:30 PM</option>
                                    <option value="9:00PM">9:00 PM</option>
                                    <option value="9:30PM">9:30 PM</option>
                                    <option value="10:00PM">10:00 PM</option>
                                    <option value="10:30PM">10:30 PM</option>
                                    <option value="11:00PM">11:00 PM</option>
                                    <option value="11:30PM">11:30 PM</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      {/* Advanced options removed as requested */}
                      <div className="btn-box pt-3">
                        <button type="submit" className="theme-btn" onClick={handleSearch}>
                          {t('hero.search_cars')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <svg className="hero-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
              <polygon points="100 10 100 0 0 10"></polygon>
            </svg>
          </div>
        </section>

        {/* ================================
            START CAR AREA
        ================================= */}
        <section className="car-area section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading text-center">
                  <h2 className="sec__title">{t('home.trending_cars')}</h2>
                </div>
              </div>
            </div>
            {/* Agency Filter Tabs */}
            {!vehiclesLoading && agencies.length > 1 && (
              <div className="row padding-top-30px">
                <div className="col-lg-12">
                  <div className="d-flex justify-content-end mb-4">
                    <div className="agency-tabs">
                      <ul className="nav nav-pills" style={{gap: '0.5rem'}}>
                        <li className="nav-item">
                          <button 
                            className={`nav-link ${selectedAgency === 'all' ? 'active' : ''}`}
                            onClick={() => handleAgencySelect('all')}
                            style={{
                              padding: '8px 16px',
                              fontSize: '14px',
                              border: 'none',
                              borderRadius: '20px',
                              backgroundColor: selectedAgency === 'all' ? '#007bff' : '#f8f9fa',
                              color: selectedAgency === 'all' ? '#fff' : '#333',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {t('home.all_agencies')} ({agencyVehicles.length})
                          </button>
                        </li>
                        {agencies.map((agency) => (
                          <li key={agency.id} className="nav-item">
                            <button 
                              className={`nav-link ${selectedAgency == agency.id ? 'active' : ''}`}
                              onClick={() => handleAgencySelect(agency.id)}
                              style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '20px',
                                backgroundColor: selectedAgency == agency.id ? '#007bff' : '#f8f9fa',
                                color: selectedAgency == agency.id ? '#fff' : '#333',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {agency.name} ({agency.vehicles.length})
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="row padding-top-20px">
              <div className="col-lg-12">
                {/* Show loading state for vehicles */}
                {vehiclesLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading vehicles...</span>
                    </div>
                    <p className="mt-2">{t('home.loading_vehicles')}</p>
                  </div>
                ) : (
                  <>
                    {/* Show error message if API failed */}
                    {vehiclesError && (
                      <div className="alert alert-info mb-4">
                        <i className="la la-info-circle me-2"></i>
                        {vehiclesError}
                      </div>
                    )}
                    
                    
                    {/* Display vehicles - use carousel if available, otherwise grid */}
                    {filteredVehicles.length > 0 ? (
                      <>
                        {/* Show currently selected agency info */}
                        {selectedAgency !== 'all' && (
                          <div className="alert alert-info mb-4">
                            <i className="la la-building me-2"></i>
                            {t('home.showing_vehicles_from')} <strong>{agencies.find(a => a.id == selectedAgency)?.name}</strong>
                          </div>
                        )}
                        
                        {/* Use grid layout for reliable display */}
                        <div className="row">
                          {filteredVehicles.map((car) => (
                          <div key={car.id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card-item car-card mb-0 border" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                              <div className="card-img">
                                <Link href={`/car-single/${car.id}`} className="d-block">
                                  <img src={car.image} alt={car.name} />
                                </Link>
                                {car.badge && <span className="badge">{car.badge}</span>}
                                <div className="add-to-wishlist icon-element" title={t('home.add_to_wishlist')}>
                                  <i className="la la-heart-o"></i>
                                </div>
                              </div>
                              <div className="card-body" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                <p className="card-meta">{car.category}</p>
                                <h3 className="card-title">
                                  <Link href={`/car-single/${car.id}`}>{car.name}</Link>
                                </h3>
                                <div className="card-rating">
                                  <span className="badge bg-primary text-white">{car.rating}</span>
                                  <span className="review__text">{t('search_results.rating.average')}</span>
                                  <span className="rating__text">({car.reviews})</span>
                                </div>
                                <div className="card-attributes">
                                  <ul className="d-flex align-items-center">
                                    <li className="d-flex align-items-center" title="Passengers">
                                      <i className="la la-users"></i><span>{car.passengers}</span>
                                    </li>
                                    <li className="d-flex align-items-center" title="Luggage">
                                      <i className="la la-suitcase"></i><span>{car.luggage}</span>
                                    </li>
                                    {/* Additional vehicle features */}
                                    {car.air_conditioning && (
                                      <li className="d-flex align-items-center" title="Air Conditioning">
                                        <i className="la la-snowflake-o"></i>
                                      </li>
                                    )}
                                    {car.bluetooth && (
                                      <li className="d-flex align-items-center" title="Bluetooth">
                                        <i className="la la-bluetooth"></i>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                                <div className="card-price d-flex align-items-center justify-content-between" style={{marginTop: 'auto'}}>
                                  <p>
                                    <span className="price__from">{t('featured_cars.per_day')}</span>
                                    <span className="price__num">{formatCurrency(convertAmount(car.price))}</span>
                                    <span className="price__text">{t('featured_cars.per_day')}</span>
                                  </p>
                                  <Link href={`/car-single/${car.id}`} className="btn-text">
                                    {t('common.view_details')}<i className="la la-angle-right"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <i className="la la-car text-muted" style={{fontSize: '4rem'}}></i>
                        <h4 className="text-muted mt-3">{t('home.no_vehicles')}</h4>
                        <p className="text-muted">{t('home.check_back_later')}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Fun Facts Section */}
        <section className="funfact-area padding-top-40px">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading text-center">
                  <h2 className="sec__title">
                    {t('home.funfacts.title')}
                  </h2>
                  <p className="sec__desc pt-3">
                    {t('home.funfacts.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <div className="counter-box mt-5 pb-2">
              <div className="row">
                <div className="col-lg-3 responsive-column">
                  <div className="counter-item d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className="la la-map"></i>
                    </div>
                    <div className="counter-content">
                      <span className="counter">50000</span>
                      <span className="count-symbol">+</span>
                      <p className="counter__title">{t('home.funfacts.locations')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="counter-item d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className="la la-globe"></i>
                    </div>
                    <div className="counter-content">
                      <span className="counter">160</span>
                      <p className="counter__title">{t('home.funfacts.countries')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="counter-item d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className="la la-language"></i>
                    </div>
                    <div className="counter-content">
                      <span className="counter">43</span>
                      <p className="counter__title">{t('home.funfacts.languages')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 responsive-column">
                  <div className="counter-item d-flex">
                    <div className="counter-icon flex-shrink-0">
                      <i className="la la-star"></i>
                    </div>
                    <div className="counter-content">
                      <span className="counter">3500000</span>
                      <p className="counter__title">{t('home.funfacts.reviews')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Logos Section */}
        <section className="clientlogo-area position-relative section-bg padding-top-140px padding-bottom-150px text-center">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading text-center">
                  <h2 className="sec__title">{t('home.brands.title')}</h2>
                </div>
              </div>
            </div>
            <div className="row padding-top-20px">
              <div className="col-lg-8 mx-auto">
                <div className="client-logo">
                  <div className="client-logo-item client-logo-item-2">
                    <img src="/html-folder/images/alamo.png" alt="brand image" />
                  </div>
                  <div className="client-logo-item client-logo-item-2">
                    <img src="/html-folder/images/europcar.png" alt="brand image" />
                  </div>
                  <div className="client-logo-item client-logo-item-2">
                    <img src="/html-folder/images/hertz.png" alt="brand image" />
                  </div>
                  <div className="client-logo-item client-logo-item-2">
                    <img src="/html-folder/images/national.png" alt="brand image" />
                  </div>
                  <div className="client-logo-item client-logo-item-2">
                    <img src="/html-folder/images/thrifty.png" alt="brand image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg className="cta-svg" viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M-31.31,170.22 C164.50,33.05 334.36,-32.06 547.11,196.88 L500.00,150.00 L0.00,150.00 Z"></path>
          </svg>
        </section>

        {/* Top Destinations */}
        <section className="destination-area padding-top-50px padding-bottom-70px">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="section-heading">
                  <h2 className="sec__title">{t('home.destinations.title')}</h2>
                  <p className="sec__desc pt-3">
                    {t('home.destinations.subtitle')}
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="btn-box btn--box text-end">
                  <Link href="/destinations" className="theme-btn">
                    {t('home.destinations.discover_more')} <i className="la la-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row padding-top-50px">
              <div className="col-lg-4 responsive-column">
                <div className="card-item destination-card destination--card">
                  <div className="card-img">
                    <img src="/html-folder/images/destination-img2.jpg" alt="destination-img" />
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="card-title mb-0">
                        <Link href="/destinations/california">California</Link>
                      </h3>
                    </div>
                    <div>
                      <Link href="/destinations/california" className="theme-btn theme-btn-small border-0">
                        {t('destinations.exploreMore')} <i className="la la-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 responsive-column">
                <div className="card-item destination-card destination--card">
                  <div className="card-img">
                    <img src="/html-folder/images/destination-img3.jpg" alt="destination-img" />
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="card-title mb-0">
                        <Link href="/destinations/newyork">New York</Link>
                      </h3>
                    </div>
                    <div>
                      <Link href="/destinations/newyork" className="theme-btn theme-btn-small border-0">
                        {t('destinations.exploreMore')} <i className="la la-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 responsive-column">
                <div className="card-item destination-card destination--card">
                  <div className="card-img">
                    <img src="/html-folder/images/destination-img4.jpg" alt="destination-img" />
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="card-title mb-0">
                        <Link href="/destinations/sanfrancisco">San Francisco</Link>
                      </h3>
                    </div>
                    <div>
                      <Link href="/destinations/sanfrancisco" className="theme-btn theme-btn-small border-0">
                        {t('destinations.exploreMore')} <i className="la la-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scripts are loaded in layout.js to prevent conflicts and 404 errors */}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modal Components with AuthContext Integration */}
      <LoginModal />
      <SignupModal />
    </>
  );
}

