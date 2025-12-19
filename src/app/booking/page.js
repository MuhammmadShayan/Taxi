'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import Head from 'next/head';
import Header from '../../components/Header';
import LoginModal from '../../components/LoginModal';
import SignupModal from '../../components/SignupModal';
import LocationAutocomplete from '../../components/LocationAutocomplete';
import { I18nProvider } from '../../i18n/I18nProvider';
import { useAuth } from '../../contexts/AuthContext';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Get vehicle_id from URL params
  const vehicleId = searchParams.get('vehicle_id');

  const [bookingData, setBookingData] = useState({
    pickup_location: searchParams.get('pickup_location') || '',
    pickup_latitude: searchParams.get('pickup_latitude') || null,
    pickup_longitude: searchParams.get('pickup_longitude') || null,
    dropoff_location: searchParams.get('dropoff_location') || searchParams.get('pickup_location') || '',
    dropoff_latitude: searchParams.get('dropoff_latitude') || null,
    dropoff_longitude: searchParams.get('dropoff_longitude') || null,
    pickup_date: searchParams.get('pickup_date') || '',
    pickup_time: searchParams.get('pickup_time') || '9:00AM',
    dropoff_date: searchParams.get('dropoff_date') || '',
    dropoff_time: searchParams.get('dropoff_time') || '9:00AM',
    passengers: parseInt(searchParams.get('passengers')) || 1
  });

  const [customerData, setCustomerData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passport: '',
    license: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    specialRequests: ''
  });

  const [paymentData, setPaymentData] = useState({
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingPostalCode: ''
  });

  const [extras, setExtras] = useState({
    gps: false,
    childSeat: false,
    additionalDriver: false,
    insurance: false,
    wifi: false,
    fuelService: false
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterSubscribe, setNewsletterSubscribe] = useState(false);

  // Authentication state
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [checkingUser, setCheckingUser] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { login, register } = useAuth();

  // Save booking data to sessionStorage
  const saveBookingDataToSession = () => {
    if (typeof window !== 'undefined') {
      const bookingSession = {
        bookingData,
        customerData,
        paymentData,
        extras,
        termsAccepted,
        newsletterSubscribe,
        url: window.location.href
      };
      sessionStorage.setItem('pendingBookingData', JSON.stringify(bookingSession));
    }
  };

  // Restore booking data from sessionStorage
  const restoreBookingDataFromSession = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('pendingBookingData');
      if (saved) {
        try {
          const bookingSession = JSON.parse(saved);
          setBookingData(prev => ({ ...prev, ...bookingSession.bookingData }));
          setCustomerData(prev => ({ ...prev, ...bookingSession.customerData }));
          setPaymentData(prev => ({ ...prev, ...bookingSession.paymentData }));
          setExtras(prev => ({ ...prev, ...bookingSession.extras }));
          setTermsAccepted(bookingSession.termsAccepted || false);
          setNewsletterSubscribe(bookingSession.newsletterSubscribe || false);
        } catch (error) {
          console.error('Error restoring booking data:', error);
        }
      }
    }
  };

  // Clear saved booking data
  const clearBookingDataFromSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pendingBookingData');
    }
  };

  const extraCosts = {
    gps: 15,
    childSeat: 10,
    additionalDriver: 25,
    insurance: 30,
    wifi: 8,
    fuelService: 45
  };

  const timeOptions = [
    '12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM',
    '4:00AM', '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM',
    '8:00AM', '8:30AM', '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM',
    '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM', '3:30PM',
    '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM',
    '8:00PM', '8:30PM', '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil',
    'Mexico', 'Argentina', 'Netherlands', 'Switzerland', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Russia', 'South Korea', 'Pakistan'
  ];

  useEffect(() => {
    setMounted(true);
    // Restore any saved booking data first
    restoreBookingDataFromSession();

    if (vehicleId) {
      fetchVehicleDetails();
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  // Save booking data whenever it changes
  useEffect(() => {
    if (mounted) {
      saveBookingDataToSession();
    }
  }, [bookingData, customerData, paymentData, extras, termsAccepted, newsletterSubscribe, mounted]);

  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        if (userData.user) {
          setUser(userData.user);
          // Auto-populate form with user data
          setCustomerData(prev => ({
            ...prev,
            firstName: userData.user.firstName || '',
            lastName: userData.user.lastName || '',
            email: userData.user.email || '',
            phone: userData.user.phone || '',
            dateOfBirth: userData.user.dateOfBirth || '',
            nationality: userData.user.nationality || '',
            address: userData.user.address || '',
            city: userData.user.city || '',
            country: userData.user.country || '',
            postalCode: userData.user.postalCode || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      if (response.ok) {
        const vehicleData = await response.json();
        setVehicle(vehicleData);
      } else {
        console.error('Failed to fetch vehicle details');
        // Create fallback vehicle data for demo
        setVehicle({
          id: vehicleId,
          brand: 'Toyota',
          model: 'Camry',
          year: 2023,
          category_name: 'Sedan',
          seats: 5,
          doors: 4,
          gear_type: 'Automatic',
          energy: 'Petrol',
          air_conditioning: true,
          low_price: 50,
          agency_name: 'Budget Rentals',
          agency_rating: 4.2,
          images: ['/html-folder/images/car-img.jpg']
        });
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      // Create fallback vehicle data for demo
      setVehicle({
        id: vehicleId,
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        category_name: 'Sedan',
        seats: 5,
        doors: 4,
        gear_type: 'Automatic',
        energy: 'Petrol',
        air_conditioning: true,
        low_price: 50,
        agency_name: 'Budget Rentals',
        agency_rating: 4.2,
        images: ['/html-folder/images/car-img.png']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickupPlaceSelect = (place) => {
    let lat = null, lng = null;
    if (place.geometry && place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
    }

    setBookingData(prev => ({
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

    setBookingData(prev => ({
      ...prev,
      dropoff_location: place.formatted_address || place.name,
      dropoff_latitude: lat,
      dropoff_longitude: lng
    }));
  };

  // Check if user exists by email
  const checkUserExists = async (email) => {
    if (!email || !email.includes('@')) return;

    try {
      setCheckingUser(true);
      const response = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        setIsExistingUser(true);
        setAuthMode('login');
        setAuthData(prev => ({ ...prev, email }));

        if (data.user && !user) {
          // Auto-fill form with existing user data
          setCustomerData(prev => ({
            ...prev,
            firstName: data.user.firstName || prev.firstName,
            lastName: data.user.lastName || prev.lastName,
            phone: data.user.phone || prev.phone,
            dateOfBirth: data.user.dateOfBirth || prev.dateOfBirth,
            nationality: data.user.nationality || prev.nationality,
            address: data.user.address || prev.address,
            city: data.user.city || prev.city,
            country: data.user.country || prev.country,
            postalCode: data.user.postalCode || prev.postalCode
          }));
          setShowAuthForm(true);
        }
      } else {
        setIsExistingUser(false);
        setAuthMode('register');
        setAuthData(prev => ({ ...prev, email }));
        setShowAuthForm(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setIsExistingUser(false);
    } finally {
      setCheckingUser(false);
    }
  };

  const handleCustomerChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));

    // Check for existing user when email changes
    if (field === 'email' && !user) {
      // Debounce email check
      clearTimeout(window.emailCheckTimeout);
      window.emailCheckTimeout = setTimeout(() => {
        checkUserExists(value);
      }, 500);
    }
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleExtraChange = (extra) => {
    setExtras(prev => ({ ...prev, [extra]: !prev[extra] }));
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Save current booking data before any potential navigation
    saveBookingDataToSession();

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerData.email,
          returnUrl: window.location.href // Include current booking URL for return
        }),
      });

      if (response.ok) {
        setResetEmailSent(true);
        setShowForgotPassword(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to send reset email'}`);
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send reset email. Please try again.');
    }
  };

  // Handle authentication (login/register)
  const handleAuth = async (e) => {
    e.preventDefault();

    // Save current booking data
    saveBookingDataToSession();

    try {
      if (authMode === 'login') {
        const result = await login(authData.email, authData.password);
        if (result.success) {
          setUser(result.user);
          setShowAuthForm(false);
          // Auto-populate customer data with user info
          setCustomerData(prev => ({
            ...prev,
            firstName: result.user.firstName || prev.firstName,
            lastName: result.user.lastName || prev.lastName,
            phone: result.user.phone || prev.phone,
            dateOfBirth: result.user.dateOfBirth || prev.dateOfBirth,
            nationality: result.user.nationality || prev.nationality,
            address: result.user.address || prev.address,
            city: result.user.city || prev.city,
            country: result.user.country || prev.country,
            postalCode: result.user.postalCode || prev.postalCode
          }));
        } else {
          alert(result.message || 'Login failed');
        }
      } else {
        // Register new user
        if (authData.password !== authData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        // Register needs a single userData object with all required fields
        const userData = {
          email: authData.email,
          password: authData.password,
          firstName: customerData.firstName,
          lastName: customerData.lastName
        };

        const result = await register(userData);

        if (result.success) {
          setUser(result.user);
          setShowAuthForm(false);
        } else {
          alert(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const calculateRentalDays = () => {
    if (bookingData.pickup_date && bookingData.dropoff_date) {
      const pickup = new Date(bookingData.pickup_date);
      const dropoff = new Date(bookingData.dropoff_date);
      const diffTime = Math.abs(dropoff - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  const calculateSubtotal = () => {
    if (!vehicle) return 0;
    const days = calculateRentalDays();
    const pricePerDay = vehicle.pricing ? vehicle.pricing.price_per_day : (vehicle.low_price || vehicle.price_low || 50);
    return pricePerDay * days;
  };

  const calculatePassengerCost = () => {
    if (!vehicle) return 0;
    const days = calculateRentalDays();
    const pricePerDay = vehicle.pricing ? vehicle.pricing.price_per_day : (vehicle.low_price || vehicle.price_low || 50);
    // Additional cost per passenger (20% of daily rate per additional passenger)
    return pricePerDay * 0.2 * (bookingData.passengers - 1) * days;
  };

  const calculateExtrasTotal = () => {
    const days = calculateRentalDays();
    return Object.entries(extras).reduce((total, [key, enabled]) => {
      return enabled ? total + (key === 'fuelService' ? extraCosts[key] : extraCosts[key] * days) : total;
    }, 0);
  };

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal();
    const passengerCost = calculatePassengerCost();
    const extrasTotal = calculateExtrasTotal();
    return (subtotal + passengerCost + extrasTotal) * 0.12; // 12% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculatePassengerCost() + calculateExtrasTotal() + calculateTaxes();
  };

  const validateForm = () => {
    const errors = [];

    // Booking validation
    if (!bookingData.pickup_location.trim()) errors.push('Pick-up location is required');
    if (!bookingData.dropoff_location.trim()) errors.push('Drop-off location is required');
    if (!bookingData.pickup_date) errors.push('Pick-up date is required');
    if (!bookingData.dropoff_date) errors.push('Drop-off date is required');

    // Customer validation
    if (!customerData.firstName.trim()) errors.push('First name is required');
    if (!customerData.lastName.trim()) errors.push('Last name is required');
    if (!customerData.email.trim()) errors.push('Email is required');
    if (!customerData.phone.trim()) errors.push('Phone number is required');
    // Removed dateOfBirth, nationality, license validation as fields are hidden

    // Payment validation
    if (paymentData.method === 'credit_card') {
      if (!paymentData.cardNumber.trim()) errors.push('Card number is required');
      if (!paymentData.cardName.trim()) errors.push('Cardholder name is required');
      if (!paymentData.expiryDate.trim()) errors.push('Expiry date is required');
      if (!paymentData.cvv.trim()) errors.push('CVV is required');
    }

    if (!termsAccepted) errors.push('Please accept the terms and conditions');

    return errors;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setSubmitting(true);

    try {
      const bookingPayload = {
        vehicle_id: vehicleId,
        booking_details: bookingData,
        customer_details: customerData,
        payment_details: paymentData,
        extras: extras,
        pricing: {
          subtotal: calculateSubtotal(),
          extras_total: calculateExtrasTotal(),
          tax: calculateTaxes(),
          total: calculateTotal(),
          days: calculateRentalDays()
        },
        newsletter_subscribe: newsletterSubscribe
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const result = await response.json();

        // Redirect to success page
        router.push(`/booking-confirmation/${result.booking_id}?payment=success`);
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while processing your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
  const maxBirthDateString = maxBirthDate.toISOString().split('T')[0];

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

  if (!vehicleId) {
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
            <h3 className="mt-3">No Vehicle Selected</h3>
            <p className="text-muted">Please select a vehicle to proceed with booking.</p>
            <Link href="/search" className="btn btn-primary">
              <i className="la la-search me-2"></i>Search Vehicles
            </Link>
          </div>
        </div>

        <LoginModal />
        <SignupModal />
      </I18nProvider>
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
            <p className="mt-3">Loading booking details...</p>
          </div>
        </div>

        <LoginModal />
        <SignupModal />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      <Head>
        <title>Book {vehicle?.brand} {vehicle?.model} - HOLIKEY</title>
        <meta name="description" content={`Book ${vehicle?.brand} ${vehicle?.model} for your trip`} />
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/select2.min.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

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
                    <h2 className="sec__title text-white">Complete Your Booking</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/search">Search</Link></li>
                    <li><Link href={`/vehicles/${vehicleId}`}>{vehicle?.brand} {vehicle?.model}</Link></li>
                    <li>Booking</li>
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
          START BOOKING AREA
      ================================= */}
      <section className="booking-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Book Your Vehicle</h3>
                </div>

                <div className="form-content">
                  <form onSubmit={handleSubmitBooking}>
                    {/* Booking Details Section */}
                    <div className="contact-form-action">
                      <h4 className="section-title">Rental Details</h4>

                      <div className="row">
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Pick-up Location</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <LocationAutocomplete
                                className="form-control"
                                placeholder="Pick-up location"
                                value={bookingData.pickup_location}
                                onChange={(value) => handleBookingChange('pickup_location', value)}
                                onPlaceSelect={handlePickupPlaceSelect}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Drop-off Location</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <LocationAutocomplete
                                className="form-control"
                                placeholder="Drop-off location"
                                value={bookingData.dropoff_location}
                                onChange={(value) => handleBookingChange('dropoff_location', value)}
                                onPlaceSelect={handleDropoffPlaceSelect}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Pick-up Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={bookingData.pickup_date}
                                onChange={(e) => handleBookingChange('pickup_date', e.target.value)}
                                min={today}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Pick-up Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select form-control"
                                  data-no-select2="true"
                                  value={bookingData.pickup_time}
                                  onChange={(e) => handleBookingChange('pickup_time', e.target.value)}
                                  required
                                >
                                  {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Drop-off Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={bookingData.dropoff_date}
                                onChange={(e) => handleBookingChange('dropoff_date', e.target.value)}
                                min={bookingData.pickup_date || today}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Drop-off Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select form-control"
                                  data-no-select2="true"
                                  value={bookingData.dropoff_time}
                                  onChange={(e) => handleBookingChange('dropoff_time', e.target.value)}
                                  required
                                >
                                  {timeOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <div className="form-group">
                              <div className="qty-box mb-2 d-flex align-items-center justify-content-between">
                                <label className="font-size-16 color-text-2">Number of Passengers</label>
                                <div className="qtyBtn d-flex align-items-center">
                                  <button
                                    type="button"
                                    className="qtyDec btn btn-sm"
                                    onClick={() => handleBookingChange('passengers', Math.max(1, bookingData.passengers - 1))}
                                  >
                                    <i className="la la-minus"></i>
                                  </button>
                                  <input
                                    type="text"
                                    className="form-control text-center mx-2"
                                    style={{ width: '60px' }}
                                    value={bookingData.passengers}
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    className="qtyInc btn btn-sm"
                                    onClick={() => handleBookingChange('passengers', Math.min(vehicle?.seats || 5, bookingData.passengers + 1))}
                                  >
                                    <i className="la la-plus"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    {/* Customer Details Section */}
                    <div className="contact-form-action">
                      <h4 className="section-title">Personal Information</h4>

                      <div className="row">
                        <div className="col-lg-2 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Title</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select form-control"
                                  data-no-select2="true"
                                  value={customerData.title}
                                  onChange={(e) => handleCustomerChange('title', e.target.value)}
                                  required
                                >
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Ms">Ms</option>
                                  <option value="Dr">Dr</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-5 responsive-column">
                          <div className="input-box">
                            <label className="label-text">First Name</label>
                            <div className="form-group">
                              <span className="la la-user form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.firstName}
                                onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                                placeholder="First name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-5 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Last Name</label>
                            <div className="form-group">
                              <span className="la la-user form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.lastName}
                                onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                                placeholder="Last name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">
                              Email Address
                              {checkingUser && (
                                <span className="ms-2 text-info">
                                  <small>Checking...</small>
                                </span>
                              )}
                              {isExistingUser === true && !user && (
                                <span className="ms-2 text-warning">
                                  <small>Existing user - please login</small>
                                </span>
                              )}
                              {isExistingUser === false && (
                                <span className="ms-2 text-info">
                                  <small>New customer - account will be created</small>
                                </span>
                              )}
                            </label>
                            <div className="form-group">
                              <span className="la la-envelope-o form-icon"></span>
                              <input
                                className="form-control"
                                type="email"
                                value={customerData.email}
                                onChange={(e) => handleCustomerChange('email', e.target.value)}
                                placeholder="Email address"
                                required
                                disabled={user ? true : false}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Authentication Section - Shows for existing users or new customers */}
                        {(showAuthForm || isExistingUser === false) && !user && (
                          <div className="col-lg-12">
                            <div className="alert alert-info mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {isExistingUser ? (
                                    <>
                                      <strong>Welcome back!</strong>
                                      <p className="mb-0">This email is associated with an existing account. Please sign in to continue with your booking.</p>
                                    </>
                                  ) : (
                                    <>
                                      <strong>Create Account</strong>
                                      <p className="mb-0">We'll create an account for you to track your bookings and speed up future reservations.</p>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setShowAuthForm(false)}
                                ></button>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-6">
                                <div className="input-box">
                                  <label className="label-text">Password</label>
                                  <div className="form-group">
                                    <span className="la la-lock form-icon"></span>
                                    <input
                                      className="form-control"
                                      type="password"
                                      value={authData.password}
                                      onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                                      placeholder={isExistingUser ? "Enter your password" : "Choose a password"}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>

                              {!isExistingUser && (
                                <div className="col-lg-6">
                                  <div className="input-box">
                                    <label className="label-text">Confirm Password</label>
                                    <div className="form-group">
                                      <span className="la la-lock form-icon"></span>
                                      <input
                                        className="form-control"
                                        type="password"
                                        value={authData.confirmPassword}
                                        onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        placeholder="Confirm your password"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Forgot Password Section */}
                            {isExistingUser && !showForgotPassword && (
                              <div className="text-center mb-3">
                                <button
                                  type="button"
                                  className="btn btn-link text-primary p-0"
                                  onClick={() => setShowForgotPassword(true)}
                                >
                                  Forgot your password?
                                </button>
                              </div>
                            )}

                            {/* Forgot Password Form */}
                            {showForgotPassword && (
                              <div className="col-12">
                                <div className="alert alert-warning mb-3">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <strong>Reset Password</strong>
                                      {!resetEmailSent ? (
                                        <p className="mb-0">We'll send you a password reset link. Your booking information will be preserved.</p>
                                      ) : (
                                        <div>
                                          <p className="mb-2">✅ Password reset email sent to <strong>{customerData.email}</strong></p>
                                          <p className="mb-0 text-success">Check your email and click the reset link. You'll be redirected back to this page with your booking intact.</p>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      onClick={() => {
                                        setShowForgotPassword(false);
                                        setResetEmailSent(false);
                                      }}
                                    ></button>
                                  </div>

                                  {!resetEmailSent && (
                                    <div className="mt-3">
                                      <button
                                        type="button"
                                        className="btn btn-warning btn-sm"
                                        onClick={handleForgotPassword}
                                      >
                                        <i className="la la-envelope me-2"></i>Send Reset Link
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Authentication Buttons */}
                            {!showForgotPassword && (
                              <div className="col-12">
                                <div className="d-flex gap-2 mb-3">
                                  <button
                                    type="button"
                                    className="btn btn-primary flex-fill"
                                    onClick={handleAuth}
                                    disabled={!authData.password || (authMode === 'register' && !authData.confirmPassword)}
                                  >
                                    {isExistingUser ? (
                                      <><i className="la la-sign-in me-2"></i>Sign In & Continue</>
                                    ) : (
                                      <><i className="la la-user-plus me-2"></i>Create Account & Continue</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Phone Number</label>
                            <div className="form-group">
                              <span className="la la-phone form-icon"></span>
                              <input
                                className="form-control"
                                type="tel"
                                value={customerData.phone}
                                onChange={(e) => handleCustomerChange('phone', e.target.value)}
                                placeholder="Phone number"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        {/* Removed Date of Birth, Nationality, Passport, License fields as requested */}
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Address</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.address}
                                onChange={(e) => handleCustomerChange('address', e.target.value)}
                                placeholder="Full address"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 responsive-column">
                          <div className="input-box">
                            <label className="label-text">City</label>
                            <div className="form-group">
                              <span className="la la-map form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.city}
                                onChange={(e) => handleCustomerChange('city', e.target.value)}
                                placeholder="City"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Country</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select
                                  className="select-contain-select form-control"
                                  data-no-select2="true"
                                  value={customerData.country}
                                  onChange={(e) => handleCustomerChange('country', e.target.value)}
                                >
                                  <option value="">Select Country</option>
                                  {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Postal Code</label>
                            <div className="form-group">
                              <span className="la la-map-pin form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.postalCode}
                                onChange={(e) => handleCustomerChange('postalCode', e.target.value)}
                                placeholder="Postal code"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Special Requests</label>
                            <div className="form-group">
                              <span className="la la-pencil form-icon"></span>
                              <textarea
                                className="message-control form-control"
                                value={customerData.specialRequests}
                                onChange={(e) => handleCustomerChange('specialRequests', e.target.value)}
                                placeholder="Any special requests or notes"
                                rows="3"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    {/* Extras Section */}
                    <div className="contact-form-action">
                      <h4 className="section-title">Additional Options</h4>

                      <div className="row">
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="gps"
                              checked={extras.gps}
                              onChange={() => handleExtraChange('gps')}
                            />
                            <label htmlFor="gps">
                              GPS Navigation System
                              <span className="ms-2 text-success">+${extraCosts.gps}/day</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="childSeat"
                              checked={extras.childSeat}
                              onChange={() => handleExtraChange('childSeat')}
                            />
                            <label htmlFor="childSeat">
                              Child Safety Seat
                              <span className="ms-2 text-success">+${extraCosts.childSeat}/day</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="additionalDriver"
                              checked={extras.additionalDriver}
                              onChange={() => handleExtraChange('additionalDriver')}
                            />
                            <label htmlFor="additionalDriver">
                              Additional Driver
                              <span className="ms-2 text-success">+${extraCosts.additionalDriver}/day</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="insurance"
                              checked={extras.insurance}
                              onChange={() => handleExtraChange('insurance')}
                            />
                            <label htmlFor="insurance">
                              Full Insurance Coverage
                              <span className="ms-2 text-success">+${extraCosts.insurance}/day</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="wifi"
                              checked={extras.wifi}
                              onChange={() => handleExtraChange('wifi')}
                            />
                            <label htmlFor="wifi">
                              WiFi Hotspot
                              <span className="ms-2 text-success">+${extraCosts.wifi}/day</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="fuelService"
                              checked={extras.fuelService}
                              onChange={() => handleExtraChange('fuelService')}
                            />
                            <label htmlFor="fuelService">
                              Prepaid Fuel Service
                              <span className="ms-2 text-success">+${extraCosts.fuelService}/rental</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-block"></div>

                    {/* Payment Section */}
                    <div className="contact-form-action">
                      <h4 className="section-title">Payment Information</h4>

                      <div className="payment-option mb-4">
                        <div className="custom-checkbox">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="credit_card"
                            name="payment_method"
                            value="credit_card"
                            checked={paymentData.method === 'credit_card'}
                            onChange={(e) => handlePaymentChange('method', e.target.value)}
                          />
                          <label htmlFor="credit_card">Credit Card</label>
                        </div>
                        <div className="custom-checkbox">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="paypal"
                            name="payment_method"
                            value="paypal"
                            checked={paymentData.method === 'paypal'}
                            onChange={(e) => handlePaymentChange('method', e.target.value)}
                          />
                          <label htmlFor="paypal">PayPal</label>
                        </div>
                        <div className="custom-checkbox">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="bank_transfer"
                            name="payment_method"
                            value="bank_transfer"
                            checked={paymentData.method === 'bank_transfer'}
                            onChange={(e) => handlePaymentChange('method', e.target.value)}
                          />
                          <label htmlFor="bank_transfer">Bank Transfer</label>
                        </div>
                        <div className="custom-checkbox">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="cash"
                            name="payment_method"
                            value="cash"
                            checked={paymentData.method === 'cash'}
                            onChange={(e) => handlePaymentChange('method', e.target.value)}
                          />
                          <label htmlFor="cash">Pay on Pickup</label>
                        </div>
                      </div>

                      {paymentData.method === 'credit_card' && (
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Card Number</label>
                              <div className="form-group">
                                <span className="la la-credit-card form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={paymentData.cardNumber}
                                  onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-box">
                              <label className="label-text">Cardholder Name</label>
                              <div className="form-group">
                                <span className="la la-user form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={paymentData.cardName}
                                  onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                                  placeholder="Name on card"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 responsive-column">
                            <div className="input-box">
                              <label className="label-text">Expiry Date</label>
                              <div className="form-group">
                                <span className="la la-calendar form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={paymentData.expiryDate}
                                  onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 responsive-column">
                            <div className="input-box">
                              <label className="label-text">CVV</label>
                              <div className="form-group">
                                <span className="la la-lock form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={paymentData.cvv}
                                  onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                                  placeholder="123"
                                  maxLength="4"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="section-block"></div>

                    {/* Terms and Conditions */}
                    <div className="contact-form-action">
                      <div className="custom-checkbox mb-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="termsAccepted"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          required
                        />
                        <label htmlFor="termsAccepted">
                          I agree with <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Statement</Link>
                        </label>
                      </div>

                      <div className="custom-checkbox mb-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="newsletterSubscribe"
                          checked={newsletterSubscribe}
                          onChange={(e) => setNewsletterSubscribe(e.target.checked)}
                        />
                        <label htmlFor="newsletterSubscribe">
                          Subscribe to our newsletter for deals and updates
                        </label>
                      </div>
                    </div>

                    <div className="btn-box pt-3">
                      <button
                        type="submit"
                        className="theme-btn"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Booking...
                          </>
                        ) : (
                          'Complete Booking'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="col-lg-4">
              <div className="form-box booking-detail-form">
                <div className="form-title-wrap">
                  <h3 className="title">Booking Summary</h3>
                </div>

                <div className="form-content">
                  {/* Vehicle Details */}
                  <div className="booking-car-details mb-4">
                    <div className="d-flex">
                      <div className="car-image me-3">
                        <img
                          src={vehicle?.images?.[0] || '/html-folder/images/car-img.jpg'}
                          alt={`${vehicle?.brand} ${vehicle?.model}`}
                          className="img-fluid rounded"
                          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/html-folder/images/car-img.jpg';
                          }}
                        />
                      </div>
                      <div className="car-info">
                        <h5 className="car-title">{vehicle?.brand} {vehicle?.model}</h5>
                        <p className="car-category text-muted mb-1">{vehicle?.category_name}</p>
                        <div className="agency-info mb-1">
                          <span className="badge bg-light text-primary border border-primary">
                            <i className="la la-building me-1"></i>
                            {vehicle?.agency_name}
                          </span>
                        </div>
                        <div className="car-rating">
                          <span className="badge bg-warning text-dark">{vehicle?.agency_rating || 4.0}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="booking-details mb-4">
                    <h6>Rental Period</h6>
                    <div className="rental-dates">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Pick-up:</span>
                        <span>{bookingData.pickup_date} {bookingData.pickup_time}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Drop-off:</span>
                        <span>{bookingData.dropoff_date} {bookingData.dropoff_time}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Duration:</span>
                        <span>{calculateRentalDays()} day{calculateRentalDays() > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="price-breakdown">
                    <h6>Price Breakdown</h6>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Vehicle rental ({calculateRentalDays()} day{calculateRentalDays() > 1 ? 's' : ''})</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    {/* Show additional passenger cost if applicable */}
                    {bookingData.passengers > 1 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>Extra Passengers ({bookingData.passengers - 1})</span>
                        <span>${calculatePassengerCost().toFixed(2)}</span>
                      </div>
                    )}

                    {/* Show selected extras */}
                    {Object.entries(extras).filter(([key, enabled]) => enabled).map(([key, enabled]) => (
                      <div key={key} className="d-flex justify-content-between mb-2">
                        <span>
                          {key === 'gps' ? 'GPS Navigation' :
                            key === 'childSeat' ? 'Child Seat' :
                              key === 'additionalDriver' ? 'Additional Driver' :
                                key === 'insurance' ? 'Full Insurance' :
                                  key === 'wifi' ? 'WiFi Hotspot' :
                                    key === 'fuelService' ? 'Prepaid Fuel' : key}
                          {key !== 'fuelService' && ` (${calculateRentalDays()} day${calculateRentalDays() > 1 ? 's' : ''})`}
                        </span>
                        <span>
                          ${key === 'fuelService' ? extraCosts[key].toFixed(2) : (extraCosts[key] * calculateRentalDays()).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="d-flex justify-content-between mb-2">
                      <span>Taxes & Fees</span>
                      <span>${calculateTaxes().toFixed(2)}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between total-price">
                      <strong>Total Amount</strong>
                      <strong>${calculateTotal().toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Vehicle Features */}
                  <div className="car-features mt-4">
                    <h6>Vehicle Features</h6>
                    <div className="d-flex flex-wrap">
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-users me-1"></i>
                        <span>{vehicle?.seats} seats</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-door-open me-1"></i>
                        <span>{vehicle?.doors} doors</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-cog me-1"></i>
                        <span>{vehicle?.gear_type}</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-gas-pump me-1"></i>
                        <span>{vehicle?.energy}</span>
                      </div>
                      {vehicle?.air_conditioning && (
                        <div className="feature-item me-3 mb-2">
                          <i className="la la-snowflake-o me-1"></i>
                          <span>A/C</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="contact-info mt-4 pt-4 border-top">
                    <h6>Need Help?</h6>
                    <div className="contact-details">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-phone me-2"></i>
                        <a href="tel:+92300123456">+92 300 123 456</a>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="la la-envelope me-2"></i>
                        <a href="mailto:info@holikey.com">info@holikey.com</a>
                      </div>
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
      <Script src="/html-folder/js/select2.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/main.js" strategy="afterInteractive" />
    </I18nProvider>
  );
}

export default function BookingPage() {
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
      <BookingContent />
    </Suspense>
  );
}
