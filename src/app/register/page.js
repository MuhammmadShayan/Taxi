'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    nationality: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  useEffect(() => {
    const scripts = [
      '/html-folder/js/jquery-3.7.1.min.js',
      '/html-folder/js/jquery-ui.js',
      '/html-folder/js/bootstrap.bundle.min.js',
      '/html-folder/js/select2.min.js',
      '/html-folder/js/moment.min.js',
      '/html-folder/js/daterangepicker.js',
      '/html-folder/js/owl.carousel.min.js',
      '/html-folder/js/jquery.fancybox.min.js',
      '/html-folder/js/jquery.countTo.min.js',
      '/html-folder/js/animated-headline.js',
      '/html-folder/js/jquery.ripples-min.js',
      '/html-folder/js/quantity-input.js',
      '/html-folder/js/main.js',
    ];

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Required fields validation
    const requiredFields = [
      { field: 'firstName', message: 'First name is required' },
      { field: 'lastName', message: 'Last name is required' },
      { field: 'email', message: 'Email is required' },
      { field: 'phone', message: 'Phone number is required' },
      { field: 'password', message: 'Password is required' },
      { field: 'confirmPassword', message: 'Confirm password is required' }
    ];

    for (const { field, message } of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        setError(message);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password,
          date_of_birth: formData.dateOfBirth,
          user_type: 'customer'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! Please check your email to verify your account.');
      
      // Redirect after successful registration
      setTimeout(() => {
        router.push('/?registration=success');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'Morocco', 'Algeria', 'Tunisia', 'Egypt', 'France', 'Spain', 'United Kingdom', 
    'Germany', 'Italy', 'Netherlands', 'Belgium', 'United States', 'Canada', 'Other'
  ];

  return (
    <>
      <Head>
        <title>Create Account - Join Kirastay | Car Rental Registration</title>
        <meta name="description" content="Create your free Kirastay account to book cars, manage reservations, and earn rewards. Join thousands of travelers who trust our car rental platform." />
        <meta name="keywords" content="kirastay registration, create account, car rental signup, user registration, travel account" />
        <meta property="og:title" content="Create Account - Join Kirastay" />
        <meta property="og:description" content="Create your free Kirastay account to book cars, manage reservations, and earn rewards." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/register" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-9">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Create Account</h2>
                    <p className="sec__desc text-white">Join thousands of travelers worldwide</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Account</li>
                    <li>Register</li>
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

      {/* Registration Form */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Create Your Kirastay Account</h3>
                  <p className="text-muted">
                    Join our community and start booking cars with exclusive member benefits.
                  </p>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="alert alert-danger mb-4">
                    <i className="la la-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success mb-4">
                    <i className="la la-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <div className="form-content">
                  <form onSubmit={handleSubmit}>
                    
                    {/* Personal Information */}
                    <div className="form-section mb-4">
                      <h4 className="form-section-title">
                        <i className="la la-user me-2"></i>
                        Personal Information
                      </h4>
                      
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">First Name *</label>
                            <div className="form-group">
                              <span className="la la-user form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                placeholder="Enter your first name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Last Name *</label>
                            <div className="form-group">
                              <span className="la la-user form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                placeholder="Enter your last name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Date of Birth</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="form-control"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Nationality</label>
                            <div className="form-group">
                              <span className="la la-globe form-icon"></span>
                              <select
                                className="form-control"
                                value={formData.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                              >
                                <option value="">Select your nationality</option>
                                {countries.map(country => (
                                  <option key={country} value={country}>{country}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-section mb-4">
                      <h4 className="form-section-title">
                        <i className="la la-envelope me-2"></i>
                        Contact Information
                      </h4>
                      
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Email Address *</label>
                            <div className="form-group">
                              <span className="la la-envelope form-icon"></span>
                              <input
                                className="form-control"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Phone Number *</label>
                            <div className="form-group">
                              <span className="la la-phone form-icon"></span>
                              <input
                                className="form-control"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+212 600 123 456"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Security */}
                    <div className="form-section mb-4">
                      <h4 className="form-section-title">
                        <i className="la la-lock me-2"></i>
                        Account Security
                      </h4>
                      
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Password *</label>
                            <div className="form-group">
                              <span className="la la-lock form-icon"></span>
                              <input
                                className="form-control"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Create a strong password"
                                required
                                minLength="6"
                              />
                            </div>
                            <small className="text-muted">Password must be at least 6 characters long</small>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Confirm Password *</label>
                            <div className="form-group">
                              <span className="la la-lock form-icon"></span>
                              <input
                                className="form-control"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm your password"
                                required
                                minLength="6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agreements */}
                    <div className="form-section mb-4">
                      <h4 className="form-section-title">
                        <i className="la la-file-text me-2"></i>
                        Terms & Preferences
                      </h4>
                      
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              id="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                              required
                            />
                            <label htmlFor="agreeToTerms">
                              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *
                            </label>
                          </div>
                          
                          <div className="custom-checkbox">
                            <input
                              type="checkbox"
                              id="subscribeNewsletter"
                              checked={formData.subscribeNewsletter}
                              onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                            />
                            <label htmlFor="subscribeNewsletter">
                              Subscribe to our newsletter for exclusive deals and travel tips
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="btn-box pt-3 pb-4">
                      <button
                        type="submit"
                        className="theme-btn w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="la la-user-plus me-2"></i>
                            Create My Account
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-muted">
                        Already have an account? 
                        <a href="/login" className="text-decoration-none ms-1">Sign in here</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Why Create a Kirastay Account?</h2>
                <p className="sec__desc">
                  Unlock exclusive benefits and make your travel booking experience even better.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-bookmark"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Save Favorites</h4>
                  <p className="info__desc">
                    Bookmark your favorite cars and agencies for quick access.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-history"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Booking History</h4>
                  <p className="info__desc">
                    Keep track of all your bookings and travel history in one place.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-gift"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Exclusive Deals</h4>
                  <p className="info__desc">
                    Access member-only discounts and special offers on rentals.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-star"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Rewards Program</h4>
                  <p className="info__desc">
                    Earn points on every booking and redeem them for discounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>
      
      <SignupModal />
      <LoginModal />

      <style jsx>{`
        .form-section {
          border: 1px solid #e8ecef;
          border-radius: 8px;
          padding: 25px;
          background: #f8f9fa;
        }
        
        .form-section-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .custom-checkbox {
          margin-bottom: 15px;
        }
        
        .custom-checkbox input[type="checkbox"] {
          margin-right: 8px;
        }
        
        .custom-checkbox label {
          color: #4a5568;
          font-weight: 400;
          cursor: pointer;
        }
        
        .custom-checkbox label a {
          color: #3182ce;
          text-decoration: none;
        }
        
        .custom-checkbox label a:hover {
          text-decoration: underline;
        }
        
        .section-bg {
          background: #f7fafc;
        }
        
        .alert {
          border-radius: 8px;
        }
        
        .theme-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-control:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25);
        }
        
        .label-text {
          color: #2d3748;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }
      `}</style>
    </>
  );
}
