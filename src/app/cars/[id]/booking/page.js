'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useI18n } from '../../../../i18n/I18nProvider';
import { useAuth } from '../../../../contexts/AuthContext';

export default function CarBooking() {
  const { t } = useI18n();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, login, register, logout } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  
  // Authentication state
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [checkingUser, setCheckingUser] = useState(false);

  const [bookingData, setBookingData] = useState({
    pickup_location: searchParams.get('pickup_location') || '',
    dropoff_location: searchParams.get('dropoff_location') || '',
    pickup_date: searchParams.get('pickup_date') || '',
    pickup_time: searchParams.get('pickup_time') || '09:00',
    dropoff_date: searchParams.get('dropoff_date') || '',
    dropoff_time: searchParams.get('dropoff_time') || '09:00',
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

  const extraCosts = {
    gps: 15,
    childSeat: 10,
    additionalDriver: 25,
    insurance: 30,
    wifi: 8,
    fuelService: 45
  };

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil',
    'Mexico', 'Argentina', 'Netherlands', 'Switzerland', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Russia', 'South Korea'
  ];

  useEffect(() => {
    fetchCarDetails();
    fetchUserData();
  }, [id]);

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

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cars/${id}`);
      if (response.ok) {
        const carData = await response.json();
        setCar(carData.car);
      } else {
        console.error('Failed to fetch car details');
        router.push('/cars');
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      router.push('/cars');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
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
    if (!car) return 0;
    const days = calculateRentalDays();
    return car.price_per_day * days;
  };

  const calculatePassengerCost = () => {
    if (!car) return 0;
    const days = calculateRentalDays();
    // Additional cost per passenger (20% of daily rate per additional passenger)
    return car.price_per_day * 0.2 * (bookingData.passengers - 1) * days;
  };

  const calculateExtrasTotal = () => {
    const days = calculateRentalDays();
    return Object.entries(extras).reduce((total, [key, enabled]) => {
      return enabled ? total + (extraCosts[key] * days) : total;
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
    if (!customerData.dateOfBirth) errors.push('Date of birth is required');
    if (!customerData.nationality) errors.push('Nationality is required');
    // Driver license only required for guest users (not logged in users)
    if (!user && !customerData.license.trim()) errors.push('Driver license is required');

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
    
    let errors = validateForm();
    
    // Additional authentication validation - for new customers or existing users showing auth form
    if ((showAuthForm || isExistingUser === false) && !user) {
      if (!authData.password.trim()) {
        errors.push('Password is required');
      }
      if (!isExistingUser && authData.password !== authData.confirmPassword) {
        errors.push('Passwords do not match');
      }
      if (!isExistingUser && authData.password.length < 6) {
        errors.push('Password must be at least 6 characters');
      }
    }
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setSubmitting(true);
    
    try {
      // Step 1: Handle authentication if needed
      if ((showAuthForm || isExistingUser === false) && !user) {
        if (isExistingUser) {
          // Login existing user
          try {
            await login(customerData.email, authData.password);
            console.log('User logged in successfully');
          } catch (loginError) {
            alert('Login failed: ' + (loginError.message || 'Invalid credentials'));
            setSubmitting(false);
            return;
          }
        } else if (isExistingUser === false) {
          // Register new user
          try {
            const registrationData = {
              email: customerData.email,
              password: authData.password,
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              phone: customerData.phone,
              dateOfBirth: customerData.dateOfBirth,
              nationality: customerData.nationality,
              address: customerData.address,
              city: customerData.city,
              country: customerData.country,
              postalCode: customerData.postalCode
            };
            
            console.log('Registering new user with data:', registrationData);
            await register(registrationData);
            console.log('User registered and logged in successfully');
          } catch (registerError) {
            console.error('Registration error:', registerError);
            alert('Registration failed: ' + (registerError.message || 'Could not create account'));
            setSubmitting(false);
            return;
          }
        }
      }
      
      // Step 2: Submit booking
      const bookingPayload = {
        car_id: id,
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
        
        // Step 3: Redirect based on user status
        // Check if we performed authentication (user should be logged in now)
        if (user || (showAuthForm || isExistingUser === false)) {
          // User is logged in (either was already logged in or just authenticated), redirect to customer dashboard
          console.log('Redirecting to dashboard for authenticated user');
          router.push(`/customer/dashboard?booking_success=${result.booking_id}`);
        } else {
          // Guest user, redirect to confirmation page
          console.log('Redirecting to confirmation page for guest user');
          router.push(`/booking-confirmation/${result.booking_id}?payment=success`);
        }
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <h4>Car not found</h4>
            <p>The requested car could not be found.</p>
            <Link href="/cars" className="theme-btn">
              Back to Car List
            </Link>
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
        title="Car Booking" 
        breadcrumbItems={[
          { label: 'Car', href: '/cars' },
          { label: `${car.make} ${car.model}`, href: `/cars/${id}` },
          { label: 'Booking' }
        ]}
      />

      <section className="booking-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Book Your Car</h3>
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
                              <input
                                className="form-control"
                                type="text"
                                value={bookingData.pickup_location}
                                onChange={(e) => handleBookingChange('pickup_location', e.target.value)}
                                placeholder="Pick-up location"
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
                              <input
                                className="form-control"
                                type="text"
                                value={bookingData.dropoff_location}
                                onChange={(e) => handleBookingChange('dropoff_location', e.target.value)}
                                placeholder="Drop-off location"
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
                                  className="select-contain-select"
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
                                  className="select-contain-select"
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
                                  <div 
                                    className="qtyDec"
                                    onClick={() => handleBookingChange('passengers', Math.max(1, bookingData.passengers - 1))}
                                  >
                                    <i className="la la-minus"></i>
                                  </div>
                                  <input 
                                    type="text" 
                                    value={bookingData.passengers} 
                                    readOnly
                                  />
                                  <div 
                                    className="qtyInc"
                                    onClick={() => handleBookingChange('passengers', Math.min(car.seats, bookingData.passengers + 1))}
                                  >
                                    <i className="la la-plus"></i>
                                  </div>
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
                                  className="select-contain-select"
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
                            
                            {isExistingUser && (
                              <div className="text-center mb-3">
                                <Link href="/auth/forgot-password" className="text-primary">
                                  Forgot your password?
                                </Link>
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
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Date of Birth</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={customerData.dateOfBirth}
                                onChange={(e) => handleCustomerChange('dateOfBirth', e.target.value)}
                                max={maxBirthDateString}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Nationality</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain w-auto">
                                <select 
                                  className="select-contain-select"
                                  value={customerData.nationality}
                                  onChange={(e) => handleCustomerChange('nationality', e.target.value)}
                                  required
                                >
                                  <option value="">Select Nationality</option>
                                  {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">Passport Number <small className="text-muted">(Optional)</small></label>
                            <div className="form-group">
                              <span className="la la-id-card form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.passport}
                                onChange={(e) => handleCustomerChange('passport', e.target.value)}
                                placeholder="Passport number (optional)"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">
                              Driver License Number 
                              {user && <small className="text-muted">(Optional for registered users)</small>}
                            </label>
                            <div className="form-group">
                              <span className="la la-id-card-o form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={customerData.license}
                                onChange={(e) => handleCustomerChange('license', e.target.value)}
                                placeholder={user ? "Driver license (optional)" : "Driver license number"}
                                required={!user}
                              />
                            </div>
                          </div>
                        </div>
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
                                  className="select-contain-select"
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
                          <label htmlFor="credit_card">{t('booking.credit_card')}</label>
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
                          <label htmlFor="paypal">{t('booking.paypal')}</label>
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
                          <label htmlFor="bank_transfer">{t('booking.bank_transfer')}</label>
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
                          <label htmlFor="cash">{t('booking.cash')}</label>
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
                  {/* Car Details */}
                  <div className="booking-car-details mb-4">
                    <div className="d-flex">
                      <div className="car-image me-3">
                        <img 
                          src={car.images ? JSON.parse(car.images)[0] : '/html-folder/images/car-img.png'} 
                          alt={`${car.make} ${car.model}`}
                          className="img-fluid rounded"
                          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="car-info">
                        <h5 className="car-title">{car.make} {car.model}</h5>
                        <p className="car-category text-muted">{car.category}</p>
                        <div className="car-rating">
                          <span className="badge bg-warning text-dark">{car.rating || 4.0}/5</span>
                          <small className="text-muted ms-1">({car.total_bookings || 0} reviews)</small>
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
                      <span>Car rental ({calculateRentalDays()} day{calculateRentalDays() > 1 ? 's' : ''})</span>
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

                  {/* Car Features */}
                  <div className="car-features mt-4">
                    <h6>Car Features</h6>
                    <div className="d-flex flex-wrap">
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-users me-1"></i>
                        <span>{car.seats} seats</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-suitcase me-1"></i>
                        <span>{car.luggage_capacity} luggage</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-cog me-1"></i>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="feature-item me-3 mb-2">
                        <i className="la la-tint me-1"></i>
                        <span>{car.fuel_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="contact-info mt-4 pt-4 border-top">
                    <h6>Need Help?</h6>
                    <div className="contact-details">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-phone me-2"></i>
                      <a href="tel:+41782149795">+41 78 214 97 95</a>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="la la-envelope me-2"></i>
                      <a href="mailto:support@kirastay.com">support@kirastay.com</a>
                      </div>
                    </div>
                  </div>
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
