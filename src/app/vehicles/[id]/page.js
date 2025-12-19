'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../../components/Header';
import LoginModal from '../../../components/LoginModal';
import SignupModal from '../../../components/SignupModal';
import LocationAutocomplete from '../../../components/LocationAutocomplete';
import { I18nProvider } from '../../../i18n/I18nProvider';

function VehicleDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  const [currentPricing, setCurrentPricing] = useState(null);
  const [isReadOnlyBooking, setIsReadOnlyBooking] = useState(false);

  // Form state for booking
  const [bookingForm, setBookingForm] = useState({
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
    passengers: 1
  });

  // Fetch vehicle details
  const fetchVehicle = async (vehicleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`);

      if (!response.ok) {
        throw new Error(`Vehicle not found`);
      }

      const data = await response.json();
      console.log('Vehicle data:', data);
      setVehicle(data);
    } catch (err) {
      console.error('Error fetching vehicle:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      fetchVehicle(params.id);
    }

    // Pre-fill form from URL params (from search page)
    const pickup_location = searchParams.get('pickup_location') || searchParams.get('location') || '';
    const dropoff_location = searchParams.get('dropoff_location') || pickup_location || '';
    const pickup_date = searchParams.get('pickup_date') || searchParams.get('start_date') || '';
    const dropoff_date = searchParams.get('dropoff_date') || searchParams.get('end_date') || '';
    const pickup_time = searchParams.get('pickup_time') || '9:00AM';
    const dropoff_time = searchParams.get('dropoff_time') || '9:00AM';
    const passengers = parseInt(searchParams.get('passengers')) || 1;

    setBookingForm(prev => ({
      ...prev,
      pickup_location,
      dropoff_location,
      pickup_date,
      dropoff_date,
      pickup_time,
      dropoff_time,
      passengers
    }));

    // Read-only mode when all booking params are present (user is reviewing an existing selection)
    const hasBookingParams = pickup_location && dropoff_location && pickup_date && dropoff_date && pickup_time && dropoff_time;
    setIsReadOnlyBooking(Boolean(hasBookingParams));

  }, [params.id, searchParams]);

  // Separate effect for initial pricing calculation
  useEffect(() => {
    if (bookingForm.pickup_date && bookingForm.dropoff_date && vehicle) {
      calculatePricing(bookingForm.pickup_date, bookingForm.dropoff_date);
    }
  }, [vehicle]); // Only trigger when vehicle is loaded

  const handleInputChange = (field, value) => {
    setBookingForm(prev => {
      const newForm = { ...prev, [field]: value };

      // If pickup date changes, ensure dropoff date is not before pickup date
      if (field === 'pickup_date' && newForm.dropoff_date && newForm.dropoff_date < value) {
        newForm.dropoff_date = value;
      }

      return newForm;
    });
  };

  // Calculate dynamic pricing when form changes
  const calculatePricing = async (startDate, endDate) => {
    if (!startDate || !endDate || !vehicle || startDate >= endDate) {
      setCurrentPricing(null);
      return;
    }

    setPriceLoading(true);
    try {
      const response = await fetch(`/api/vehicles/${params.id}/pricing?start_date=${startDate}&end_date=${endDate}`);
      if (response.ok) {
        const pricing = await response.json();
        setCurrentPricing(pricing);
      } else {
        // Fallback to basic calculation
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setCurrentPricing({
          days: diffDays,
          price_per_day: vehicle.low_price || vehicle.price_low || 50,
          base_total: (vehicle.low_price || vehicle.price_low || 50) * diffDays,
          is_holiday: false,
          is_high_season: false
        });
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
      // Fallback calculation
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setCurrentPricing({
        days: diffDays,
        price_per_day: vehicle.low_price || vehicle.price_low || 50,
        base_total: (vehicle.low_price || vehicle.price_low || 50) * diffDays,
        is_holiday: false,
        is_high_season: false
      });
    } finally {
      setPriceLoading(false);
    }
  };

  // Effect to recalculate pricing when dates change
  useEffect(() => {
    if (bookingForm.pickup_date && bookingForm.dropoff_date && vehicle) {
      const timeoutId = setTimeout(() => {
        calculatePricing(bookingForm.pickup_date, bookingForm.dropoff_date);
      }, 500); // Debounce API calls

      return () => clearTimeout(timeoutId);
    }
  }, [bookingForm.pickup_date, bookingForm.dropoff_date, vehicle]);

  const handlePickupPlaceSelect = (place) => {
    let lat = null, lng = null;
    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }

    setBookingForm(prev => ({
      ...prev,
      pickup_location: place.formatted_address || place.name,
      pickup_latitude: lat,
      pickup_longitude: lng
    }));
  };

  const handleDropoffPlaceSelect = (place) => {
    let lat = null, lng = null;
    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }

    setBookingForm(prev => ({
      ...prev,
      dropoff_location: place.formatted_address || place.name,
      dropoff_latitude: lat,
      dropoff_longitude: lng
    }));
  };

  const handleBooking = () => {
    // Navigate to booking page with vehicle and form data
    const bookingParams = new URLSearchParams({
      vehicle_id: params.id,
      pickup_location: bookingForm.pickup_location,
      pickup_latitude: bookingForm.pickup_latitude || '',
      pickup_longitude: bookingForm.pickup_longitude || '',
      dropoff_location: bookingForm.dropoff_location,
      dropoff_latitude: bookingForm.dropoff_latitude || '',
      dropoff_longitude: bookingForm.dropoff_longitude || '',
      pickup_date: bookingForm.pickup_date,
      pickup_time: bookingForm.pickup_time,
      dropoff_date: bookingForm.dropoff_date,
      dropoff_time: bookingForm.dropoff_time,
      passengers: bookingForm.passengers
    });

    if (!isReadOnlyBooking) {
      router.push(`/booking?${bookingParams.toString()}`);
    } else {
      // Even if read-only (all params present), clicking "Book Now" should take them to the booking page to finalize
      router.push(`/booking?${bookingParams.toString()}`);
    }
  };

  const timeOptions = [
    '12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM',
    '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM',
    '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM',
    '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM',
    '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM',
    '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'
  ];

  if (!mounted) {
    return (
      <div className="preloader" style={{ display: 'flex' }}>
        <div className="loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <I18nProvider>
        <Head>
          <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
          <link rel="stylesheet" href="/html-folder/css/style.css" />
        </Head>

        <Header />

        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vehicle details...</p>
          </div>
        </div>

        <LoginModal />
        <SignupModal />
      </I18nProvider>
    );
  }

  if (error || !vehicle) {
    return (
      <I18nProvider>
        <Head>
          <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
          <link rel="stylesheet" href="/html-folder/css/style.css" />
        </Head>

        <Header />

        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <i className="la la-car" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h3 className="mt-3">Vehicle Not Found</h3>
            <p className="text-muted">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Link href={searchParams.toString() ? `/search?${searchParams.toString()}` : '/search'} className="btn btn-primary">
              <i className="la la-search me-2"></i>Search Other Vehicles
            </Link>
          </div>
        </div>

        <LoginModal />
        <SignupModal />
      </I18nProvider>
    );
  }

  const vehicleImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['/html-folder/images/car-img.jpg'];

  return (
    <I18nProvider>
      <Head>
        <title>{vehicle.brand} {vehicle.model} {vehicle.year} - HOLIKEY</title>
        <meta name="description" content={vehicle.description || `Rent ${vehicle.brand} ${vehicle.model} ${vehicle.year} from ${vehicle.agency_name}`} />
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/html-folder/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/html-folder/css/animate.min.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ================================
          START HEADER AREA
      ================================= */}
      <Header />

      {/* ================================
      START BREADCRUMB TOP BAR
      ================================= */}
      <section className="breadcrumb-top-bar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-list breadcrumb-top-list">
                <ul className="list-items bg-transparent radius-none p-0">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href={searchParams.toString() ? `/search?${searchParams.toString()}` : '/search'}>Search</Link></li>
                  <li>{vehicle.brand} {vehicle.model} {vehicle.year}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
      START BREADCRUMB AREA
      ================================= */}
      <section className="breadcrumb-area bread-bg-8 py-0">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-btn">
                  <div className="btn-box">
                    {vehicleImages.length > 1 && (
                      <a
                        className="theme-btn"
                        data-src={vehicleImages[selectedImageIndex]}
                        data-fancybox="gallery"
                        data-caption={`${vehicle.brand} ${vehicle.model} - Image ${selectedImageIndex + 1}`}
                        data-speed="700"
                      >
                        <i className="la la-photo me-2"></i>More Photos
                      </a>
                    )}

                    {/* Hidden gallery images for fancybox */}
                    {vehicleImages.slice(1).map((image, index) => (
                      <a
                        key={index}
                        className="d-none"
                        data-fancybox="gallery"
                        data-src={image}
                        data-caption={`${vehicle.brand} ${vehicle.model} - Image ${index + 2}`}
                        data-speed="700"
                      ></a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
      START CAR DETAIL AREA
      ================================= */}
      <section className="car-detail-area padding-bottom-90px">
        <div className="single-content-navbar-wrap menu section-bg" id="single-content-navbar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="single-content-nav" id="single-content-nav">
                  <ul>
                    <li>
                      <a data-scroll="description" href="#description" className="scroll-link active">
                        Car Details
                      </a>
                    </li>
                    <li>
                      <a data-scroll="faq" href="#faq" className="scroll-link">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a data-scroll="reviews" href="#reviews" className="scroll-link">
                        Reviews
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="single-content-box">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="single-content-wrap padding-top-60px">
                  <div id="description" className="page-scroll">
                    <div className="single-content-item pb-4">
                      <h3 className="title font-size-26">
                        {vehicle.brand} {vehicle.model} {vehicle.year} or Similar
                      </h3>
                      <div className="d-flex align-items-center pt-2">
                        <p className="me-2">{vehicle.agency_city}</p>
                        <p>
                          <span className="badge text-bg-warning text-white font-size-16">
                            {vehicle.agency_rating || '4.5'}
                          </span>
                          <span>({vehicle.agency_name})</span>
                        </p>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    <div className="single-content-item py-4">
                      <div className="row">
                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Rental Company
                              </h3>
                              <span className="font-size-13">{vehicle.agency_name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Car Type
                              </h3>
                              <span className="font-size-13">{vehicle.category_name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-car"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Car Name
                              </h3>
                              <span className="font-size-13">{vehicle.brand} {vehicle.model}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-users"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Passengers
                              </h3>
                              <span className="font-size-13">{vehicle.seats}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-briefcase"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Doors
                              </h3>
                              <span className="font-size-13">{vehicle.doors}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-gear"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Transmission
                              </h3>
                              <span className="font-size-13">{vehicle.gear_type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-gas-pump"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Energy
                              </h3>
                              <span className="font-size-13">{vehicle.energy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-snowflake-o"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Air Conditioning
                              </h3>
                              <span className="font-size-13">{vehicle.air_conditioning ? 'Available' : 'Not Available'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 responsive-column">
                          <div className="single-tour-feature d-flex align-items-center mb-3">
                            <div className="single-feature-icon icon-element ms-0 flex-shrink-0 me-3">
                              <i className="la la-bluetooth"></i>
                            </div>
                            <div className="single-feature-titles">
                              <h3 className="title font-size-15 font-weight-medium">
                                Bluetooth
                              </h3>
                              <span className="font-size-13">{vehicle.bluetooth ? 'Available' : 'Not Available'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Car Rental Information</h3>
                      <p className="py-3">
                        {vehicle.description || `Experience the comfort and reliability of the ${vehicle.brand} ${vehicle.model} ${vehicle.year}. This ${vehicle.category_name} vehicle is perfect for your travel needs, offering excellent performance and modern features.`}
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="list-items list-items-2 py-3">
                            <li><i className="la la-check"></i>Free Cancellation up to 24 hours</li>
                            <li><i className="la la-check"></i>{vehicle.seats} Passenger Capacity</li>
                            <li><i className="la la-check"></i>{vehicle.gear_type} Transmission</li>
                            <li><i className="la la-check"></i>{vehicle.energy} Engine</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="list-items list-items-2 py-3">
                            {vehicle.air_conditioning && <li><i className="la la-check"></i>Air Conditioning</li>}
                            {vehicle.bluetooth && <li><i className="la la-check"></i>Bluetooth Connectivity</li>}
                            {vehicle.navigation_system && <li><i className="la la-check"></i>GPS Navigation</li>}
                            {vehicle.wifi && <li><i className="la la-check"></i>WiFi Hotspot</li>}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>
                  </div>

                  {/* FAQ Section */}
                  <div id="faq" className="page-scroll">
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Frequently Asked Questions</h3>
                      <div className="accordion accordion-item padding-top-30px" id="accordionExample2">
                        <div className="card">
                          <div className="card-header" id="faqHeadingOne">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseOne"
                                aria-expanded="true"
                                aria-controls="faqCollapseOne"
                              >
                                <span className="ms-3">What do I need to hire this car?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseOne"
                            className="collapse show"
                            aria-labelledby="faqHeadingOne"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body">
                              <p>
                                To rent this vehicle, you need a valid driver's license, a credit card for the security deposit, and you must meet the minimum age requirement (usually 21 years). International visitors may need an International Driving Permit.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="faqHeadingTwo">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseTwo"
                                aria-expanded="false"
                                aria-controls="faqCollapseTwo"
                              >
                                <span className="ms-3">What is the cancellation policy?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseTwo"
                            className="collapse"
                            aria-labelledby="faqHeadingTwo"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body">
                              <p>
                                You can cancel your booking free of charge up to 24 hours before the pickup time. Cancellations made less than 24 hours in advance may incur a cancellation fee.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="faqHeadingThree">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link d-flex align-items-center justify-content-end flex-row-reverse font-size-16"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faqCollapseThree"
                                aria-expanded="false"
                                aria-controls="faqCollapseThree"
                              >
                                <span className="ms-3">Is insurance included?</span>
                                <i className="la la-minus"></i>
                                <i className="la la-plus"></i>
                              </button>
                            </h2>
                          </div>
                          <div
                            id="faqCollapseThree"
                            className="collapse"
                            aria-labelledby="faqHeadingThree"
                            data-bs-parent="#accordionExample2"
                          >
                            <div className="card-body">
                              <p>
                                Basic insurance coverage is included in the rental price. Additional comprehensive insurance options are available for extra protection and peace of mind.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div id="reviews" className="page-scroll">
                    <div className="single-content-item padding-top-40px padding-bottom-40px">
                      <h3 className="title font-size-20">Customer Reviews</h3>
                      <div className="reviews-summary padding-top-30px">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="review-summary">
                              <h3 className="title font-size-24">{vehicle.agency_rating || '4.5'}</h3>
                              <p>Based on {vehicle.agency_name} ratings</p>
                              <div className="ratings">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <i
                                    key={star}
                                    className={`la la-star${(vehicle.agency_rating || 4.5) >= star ? '' : '-o'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="review-bars">
                              {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="review-bar d-flex align-items-center mb-2">
                                  <span className="me-2">{rating} star</span>
                                  <div className="progress flex-grow-1 me-2">
                                    <div
                                      className="progress-bar bg-warning"
                                      style={{ width: `${rating <= (vehicle.agency_rating || 4.5) ? (rating * 20) : 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-size-13">
                                    {rating <= (vehicle.agency_rating || 4.5) ? Math.floor(Math.random() * 50) + 10 : 0}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="sidebar single-content-sidebar mt-0">
                  {/* Main Image */}
                  <div className="sidebar-widget single-content-widget">
                    <div className="car-single-img">
                      <img
                        src={vehicleImages[selectedImageIndex]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-100 rounded"
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/html-folder/images/car-img.jpg';
                        }}
                      />

                      {vehicleImages.length > 1 && (
                        <div className="car-thumbnail-images mt-3">
                          <div className="row">
                            {vehicleImages.slice(0, 4).map((image, index) => (
                              <div key={index} className="col-3">
                                <img
                                  src={image}
                                  alt={`${vehicle.brand} ${vehicle.model} - ${index + 1}`}
                                  className={`w-100 rounded cursor-pointer ${selectedImageIndex === index ? 'border border-primary' : ''}`}
                                  style={{ height: '60px', objectFit: 'cover' }}
                                  onClick={() => setSelectedImageIndex(index)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Booking Widget */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">{isReadOnlyBooking ? 'Booking Details' : 'Book This Car'}</h3>
                    <div className="sidebar-widget-item">
                      <div className="price-box bg-light p-3 rounded mb-3">
                        {priceLoading ? (
                          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60px' }}>
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                            <span>Calculating price...</span>
                          </div>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="price__from">Price per day</span>
                              <div className="text-end">
                                <span className="price__num font-size-20 font-weight-bold text-primary">
                                  ${currentPricing ? currentPricing.price_per_day : (vehicle.pricing ? vehicle.pricing.price_per_day : (vehicle.low_price || vehicle.price_low))}
                                </span>
                              </div>
                            </div>
                            {currentPricing && currentPricing.days > 0 && (
                              <>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="font-size-14">Duration:</span>
                                  <span className="font-size-14 font-weight-bold">{currentPricing.days} day{currentPricing.days > 1 ? 's' : ''}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="font-size-14">Subtotal:</span>
                                  <span className="font-size-14">${currentPricing.base_total}</span>
                                </div>
                                {currentPricing.is_holiday && (
                                  <div className="badge bg-warning text-dark mb-2">Holiday Rates Apply</div>
                                )}
                                {currentPricing.is_high_season && (
                                  <div className="badge bg-info text-white mb-2">High Season</div>
                                )}
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="font-size-16 font-weight-bold">Total:</span>
                                  <span className="font-size-24 font-weight-bold text-success">
                                    ${currentPricing.base_total}
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>

                      <div className="contact-form-action">
                        {isReadOnlyBooking ? (
                          <>
                            <div className="booking-summary card border-0 shadow-sm">
                              <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Your Booking</h5>
                                {currentPricing && (
                                  <span className="badge rounded-pill bg-light text-dark">
                                    {currentPricing.days} day{currentPricing.days > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              <div className="card-body">
                                {/* Vertical timeline */}
                                <div style={{ position: 'relative' }} className="mb-3">
                                  <div style={{ position: 'absolute', left: '18px', top: '6px', bottom: '6px', width: '2px', background: '#e9ecef' }}></div>
                                  <div className="d-flex align-items-start mb-3">
                                    <div className="me-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                      <i className="la la-map-marker"></i>
                                    </div>
                                    <div>
                                      <div className="text-muted small">Pick-up From</div>
                                      <div className="fw-medium">{bookingForm.pickup_location || '-'}</div>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-start mb-3">
                                    <div className="me-3 rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                      <i className="la la-map-marker"></i>
                                    </div>
                                    <div>
                                      <div className="text-muted small">Drop-off To</div>
                                      <div className="fw-medium">{bookingForm.dropoff_location || '-'}</div>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-start mb-3">
                                    <div className="me-3 rounded-circle bg-info text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                      <i className="la la-calendar"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                      <div className="row g-2">
                                        <div className="col-6">
                                          <div className="text-muted small">Pick-up Date</div>
                                          <div className="fw-medium">{bookingForm.pickup_date || '-'}</div>
                                          <span className="badge rounded-pill bg-light text-dark mt-1">{bookingForm.pickup_time || '-'}</span>
                                        </div>
                                        <div className="col-6">
                                          <div className="text-muted small">Drop-off Date</div>
                                          <div className="fw-medium">{bookingForm.dropoff_date || '-'}</div>
                                          <span className="badge rounded-pill bg-light text-dark mt-1">{bookingForm.dropoff_time || '-'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-start">
                                    <div className="me-3 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                      <i className="la la-users"></i>
                                    </div>
                                    <div>
                                      <div className="text-muted small">Passengers</div>
                                      <div className="fw-medium">{bookingForm.passengers}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Price summary */}
                                <div className="bg-light rounded p-3">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Price per day</span>
                                    <span className="fw-bold text-primary">${currentPricing ? currentPricing.price_per_day : (vehicle.pricing ? vehicle.pricing.price_per_day : (vehicle.low_price || vehicle.price_low || 0))}</span>
                                  </div>
                                  {currentPricing && (
                                    <>
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="fw-medium">${currentPricing.base_total}</span>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">Total</span>
                                        <span className="h5 mb-0 text-success">${currentPricing.base_total}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="btn-box pt-2">
                              <Link
                                href={`/booking?vehicle_id=${params.id}&pickup_location=${encodeURIComponent(bookingForm.pickup_location)}&dropoff_location=${encodeURIComponent(bookingForm.dropoff_location)}&pickup_date=${bookingForm.pickup_date}&pickup_time=${bookingForm.pickup_time}&dropoff_date=${bookingForm.dropoff_date}&dropoff_time=${bookingForm.dropoff_time}&passengers=${bookingForm.passengers}`}
                                className={`theme-btn text-center w-100 mb-2 d-block text-decoration-none ${(!bookingForm.pickup_location || !bookingForm.pickup_date || !bookingForm.dropoff_date || priceLoading) ? 'disabled' : ''}`}
                                style={{ pointerEvents: (!bookingForm.pickup_location || !bookingForm.pickup_date || !bookingForm.dropoff_date || priceLoading) ? 'none' : 'auto', opacity: (!bookingForm.pickup_location || !bookingForm.pickup_date || !bookingForm.dropoff_date || priceLoading) ? 0.65 : 1 }}
                              >
                                <i className="la la-shopping-cart me-2 font-size-18"></i>
                                {priceLoading ? 'Calculating...' : `Book Now${currentPricing ? ` - $${currentPricing.base_total}` : ''}`}
                              </Link>
                              <button
                                type="button"
                                className="theme-btn text-center w-100 theme-btn-transparent"
                              >
                                <i className="la la-heart-o me-2"></i>Add to Wishlist
                              </button>
                            </div>
                          </>
                        ) : (
                          <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                            <div className="input-box">
                              <label className="label-text">Pick-up From</label>
                              <div className="form-group">
                                <span className="la la-map-marker form-icon"></span>
                                <LocationAutocomplete
                                  className="form-control"
                                  placeholder="Destination, city, or region"
                                  value={bookingForm.pickup_location}
                                  onChange={(value) => handleInputChange('pickup_location', value)}
                                  onPlaceSelect={handlePickupPlaceSelect}
                                  disabled={isReadOnlyBooking}
                                  required
                                />
                              </div>
                            </div>

                            <div className="input-box">
                              <label className="label-text">Drop-off to</label>
                              <div className="form-group">
                                <span className="la la-map-marker form-icon"></span>
                                <LocationAutocomplete
                                  className="form-control"
                                  placeholder="Different location (optional)"
                                  value={bookingForm.dropoff_location}
                                  onChange={(value) => handleInputChange('dropoff_location', value)}
                                  onPlaceSelect={handleDropoffPlaceSelect}
                                  disabled={isReadOnlyBooking}
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
                                  value={bookingForm.pickup_date}
                                  onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  disabled={isReadOnlyBooking}
                                  required
                                />
                              </div>
                            </div>

                            <div className="input-box">
                              <label className="label-text">Time</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain w-auto">
                                  <select
                                    className="select-contain-select"
                                    value={bookingForm.pickup_time}
                                    onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                                    disabled={isReadOnlyBooking}
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
                                  value={bookingForm.dropoff_date}
                                  onChange={(e) => handleInputChange('dropoff_date', e.target.value)}
                                  min={bookingForm.pickup_date || new Date().toISOString().split('T')[0]}
                                  disabled={isReadOnlyBooking}
                                  required
                                />
                              </div>
                            </div>

                            <div className="input-box">
                              <label className="label-text">Time</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain w-auto">
                                  <select
                                    className="select-contain-select"
                                    value={bookingForm.dropoff_time}
                                    onChange={(e) => handleInputChange('dropoff_time', e.target.value)}
                                    disabled={isReadOnlyBooking}
                                  >
                                    {timeOptions.map(time => (
                                      <option key={time} value={time}>{time}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="input-box">
                              <div className="form-group">
                                <div className="qty-box mb-2 d-flex align-items-center justify-content-between">
                                  <label className="font-size-16 color-text-2">Passengers</label>
                                  {isReadOnlyBooking ? (
                                    <span className="font-size-16">{bookingForm.passengers}</span>
                                  ) : (
                                    <div className="qtyBtn d-flex align-items-center">
                                      <div
                                        className="qtyDec"
                                        onClick={() => handleInputChange('passengers', Math.max(1, bookingForm.passengers - 1))}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                      >
                                        <i className="la la-minus"></i>
                                      </div>
                                      <input
                                        type="text"
                                        value={bookingForm.passengers}
                                        readOnly
                                        style={{ textAlign: 'center', border: 'none', background: 'transparent', width: '60px' }}
                                      />
                                      <div
                                        className="qtyInc"
                                        onClick={() => handleInputChange('passengers', Math.min(vehicle?.seats || 8, bookingForm.passengers + 1))}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                      >
                                        <i className="la la-plus"></i>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="btn-box pt-2">
                              <button
                                type="submit"
                                className="theme-btn text-center w-100 mb-2"
                                disabled={!bookingForm.pickup_location || !bookingForm.pickup_date || !bookingForm.dropoff_date || priceLoading}
                              >
                                <i className="la la-shopping-cart me-2 font-size-18"></i>
                                {isReadOnlyBooking ? 'Book Now' : (priceLoading ? 'Calculating...' : `Book Now${currentPricing ? ` - $${currentPricing.base_total}` : ''}`)}
                              </button>
                              <button
                                type="button"
                                className="theme-btn text-center w-100 theme-btn-transparent"
                              >
                                <i className="la la-heart-o me-2"></i>Add to Wishlist
                              </button>

                              {(!bookingForm.pickup_location || !bookingForm.pickup_date || !bookingForm.dropoff_date) && (
                                <small className="text-muted d-block text-center mt-2">
                                  Please fill in pickup location and dates to book
                                </small>
                              )}
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why Book With Us */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Why Book With Us?</h3>
                    <div className="sidebar-list">
                      <ul className="list-items">
                        <li>
                          <i className="la la-dollar icon-element me-2"></i>No-hassle best price guarantee
                        </li>
                        <li>
                          <i className="la la-microphone icon-element me-2"></i>Customer care available 24/7
                        </li>
                        <li>
                          <i className="la la-thumbs-up icon-element me-2"></i>Hand-picked Cars & Service
                        </li>
                        <li>
                          <i className="la la-file-text icon-element me-2"></i>Free Travel Insurance
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="sidebar-widget single-content-widget">
                    <h3 className="title stroke-shape">Get a Question?</h3>
                    <p className="font-size-14 line-height-24">
                      Do not hesitate to give us a call. We are an expert team and we are happy to talk to you.
                    </p>
                    <div className="sidebar-list pt-3">
                      <ul className="list-items">
                        <li>
                          <i className="la la-phone icon-element me-2"></i>
                          <a href="tel:+923001234567">+92 300 123 4567</a>
                        </li>
                        <li>
                          <i className="la la-envelope icon-element me-2"></i>
                          <a href="mailto:info@holikey.com">info@holikey.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Components */}
      <LoginModal />
      <SignupModal />

      {/* Scripts */}
      <Script src="/html-folder/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/jquery.fancybox.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/main.js" strategy="afterInteractive" />
    </I18nProvider>
  );
}

export default function VehiclePage() {
  return (
    <Suspense fallback={
      <div className="preloader" style={{ display: 'flex' }}>
        <div className="loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </div>
      </div>
    }>
      <VehicleDetailContent />
    </Suspense>
  );
}
