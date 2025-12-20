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

  const [formData, setFormData] = useState({
    pickup_location: '',
    pickup_latitude: null,
    pickup_longitude: null,
    dropoff_location: '',
    dropoff_latitude: null,
    dropoff_longitude: null,
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
      pickup_latitude: formData.pickup_latitude || '',
      pickup_longitude: formData.pickup_longitude || '',
      dropoff_location: formData.dropoff_location || formData.pickup_location,
      dropoff_latitude: formData.dropoff_latitude || '',
      dropoff_longitude: formData.dropoff_longitude || '',
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

  // Handle place selection from LocationAutocomplete (supports both maps and locationiq)
  const handlePickupPlaceSelect = (place) => {
    if (!place) return;
    let lat = null, lng = null;

    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }
    else if (place.lat) {
      lat = place.lat;
      lng = place.lng || place.lon;
    }

    setFormData(prev => ({
      ...prev,
      pickup_location: place.formatted_address || place.address || place.name || place.display_name,
      pickup_latitude: lat,
      pickup_longitude: lng
    }));
  };

  const handleDropoffPlaceSelect = (place) => {
    if (!place) return;
    let lat = null, lng = null;

    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }
    else if (place.lat) {
      lat = place.lat;
      lng = place.lng || place.lon;
    }

    setFormData(prev => ({
      ...prev,
      dropoff_location: place.formatted_address || place.address || place.name || place.display_name,
      dropoff_latitude: lat,
      dropoff_longitude: lng
    }));
  };


  return (
    <>
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
      <link rel="stylesheet" href="/html-folder/css/owl.theme.default.min.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
      <link rel="stylesheet" href="/html-folder/css/daterangepicker.css" />
      <link rel="stylesheet" href="/html-folder/css/animated-headline.css" />
      <link rel="stylesheet" href="/html-folder/css/jquery-ui.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{
        __html: `
        .search-fields-container .form-group .form-icon.la.la-calendar{color:#000!important;opacity:1!important}
        .search-fields-container input[type="date"]::-webkit-calendar-picker-indicator{opacity:1!important;filter:brightness(0)!important}
        .search-fields-container input[type="date"]{color:#0d233e}
      `}} />

      <div>
        <Header />

        <section className="hero-wrapper hero-wrapper4" suppressHydrationWarning={true}>
          <div className="hero-box hero-bg-4" style={{ padding: '80px 0' }}>
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
                  <div className="hero-list-box margin-top-40px">
                    <ul className="list-items">
                      <li className="d-flex align-items-center">
                        <i className="la la-check-circle me-2 text-primary"></i>
                        <span>{t('home.features.free_cancellations')}</span>
                      </li>
                      <li className="d-flex align-items-center">
                        <i className="la la-check-circle me-2 text-primary"></i>
                        <span>{t('home.features.no_credit_card_fees')}</span>
                      </li>
                      <li className="d-flex align-items-center">
                        <i className="la la-check-circle me-2 text-primary"></i>
                        <span>{t('home.features.customer_support')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="search-fields-container search-fields-container-shape" style={{ background: '#fff', padding: '30px', borderRadius: '15px' }}>
                    <div className="search-fields-container-inner">
                      <h3 className="title pb-3" style={{ fontSize: '20px', fontWeight: 'bold' }}>{t('home.search_form.title')}</h3>
                      <div className="section-block"></div>
                      <div className="contact-form-action pt-3">
                        <form onSubmit={handleSearch} className="row">
                          <div className="col-lg-6 mb-3">
                            <LocationAutocomplete
                              label={t('hero.pickup_location')}
                              placeholder={t('home.search_form.pickup_placeholder')}
                              onPlaceSelect={handlePickupPlaceSelect}
                              value={formData.pickup_location}
                              onChange={(value) => setFormData(prev => ({ ...prev, pickup_location: value }))}
                              required
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <LocationAutocomplete
                              label={t('hero.dropoff_location')}
                              placeholder={t('home.search_form.dropoff_placeholder')}
                              onPlaceSelect={handleDropoffPlaceSelect}
                              value={formData.dropoff_location}
                              onChange={(value) => setFormData(prev => ({ ...prev, dropoff_location: value }))}
                            />
                          </div>
                          <div className="col-lg-8 col-sm-7 mb-3">
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
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-5 ps-0 mb-3">
                            <div className="input-box">
                              <label className="label-text">{t('common.time')}</label>
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="pickup_time"
                                  value={formData.pickup_time}
                                  onChange={handleInputChange}
                                >
                                  <option value="9:00AM">9:00 AM</option>
                                  <option value="10:00AM">10:00 AM</option>
                                  <option value="11:00AM">11:00 AM</option>
                                  <option value="12:00PM">12:00 PM</option>
                                  <option value="1:00PM">1:00 PM</option>
                                  {/* Add more values if needed */}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-8 col-sm-7 mb-3">
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
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-5 ps-0 mb-3">
                            <div className="input-box">
                              <label className="label-text">{t('common.time')}</label>
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="dropoff_time"
                                  value={formData.dropoff_time}
                                  onChange={handleInputChange}
                                >
                                  <option value="9:00AM">9:00 AM</option>
                                  <option value="10:00AM">10:00 AM</option>
                                  <option value="11:00AM">11:00 AM</option>
                                  {/* Add more values if needed */}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 pt-1">
                            <button type="submit" className="theme-btn w-100" style={{ borderRadius: '8px' }}>
                              {t('hero.search_cars')}
                            </button>
                          </div>
                        </form>
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

        <section className="car-area section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center pb-4">
                <h2 className="sec__title">{t('home.trending_cars')}</h2>
              </div>
            </div>

            {vehiclesLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">{t('home.loading_vehicles')}</p>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="row">
                {filteredVehicles.map((car) => (
                  <div key={car.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card-item car-card border" style={{ borderRadius: '12px' }}>
                      <div className="card-img" style={{ height: '200px', overflow: 'hidden' }}>
                        <Link href={`/car-single/${car.id}`}>
                          <img src={car.image} alt={car.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        </Link>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title font-size-18">
                          <Link href={`/car-single/${car.id}`}>{car.name}</Link>
                        </h3>
                        <p className="font-size-14 text-muted mb-2">{car.category}</p>
                        <div className="card-price d-flex align-items-center justify-content-between">
                          <p>
                            <span className="price__num font-weight-bold">{formatCurrency(convertAmount(car.price))}</span>
                            <span className="price__text"> / {t('featured_cars.per_day')}</span>
                          </p>
                          <Link href={`/car-single/${car.id}`} className="theme-btn theme-btn-small">
                            {t('common.view_details')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <p>{t('home.no_vehicles')}</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
        <LoginModal />
        <SignupModal />
      </div>
    </>
  );
}
