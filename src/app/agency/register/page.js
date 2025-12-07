'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import LoginModal from '../../../components/LoginModal';
import SignupModal from '../../../components/SignupModal';

export default function AgencyRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    // Basic Info
    agency_name: '',
    
    // Allowed Payment
    payment_pay_all: false,
    payment_20_percent: false,
    
    // Address
    street_number: '',
    city: '',
    postal_code: '',
    country: 'Morocco',
    
    // Seats
    baby_seat: false,
    baby_seat_price: '',
    child_seat: false,
    child_seat_price: '',
    booster_seat: false,
    booster_seat_price: '',
    
    // Contact Info
    contact_full_name: '',
    contact_email: '',
    contact_phone: '',
    
    // Navigation System
    navigation_system: '',
    
    // Pickup Locations
    agency_as_pickup: false,
    default_pickup_location: 'Marrakech',
    additional_pickup_locations: [],
    
    // Role
    role: '',
    
    // Login Info
    username: '',
    password: '',
    confirm_password: '',
    
    // Insurance
    all_risks_insurance: false,
    insurance_price: '',
    
    // Other Services
    other_services: '',
    
    // Comment
    comment: ''
  });

  const [pickupLocations] = useState([
    'Marrakech',
    'Casablanca',
    'Rabat',
    'Fès',
    'Agadir',
    'Tanger',
    'Meknès',
    'Ouarzazate',
    'Essaouira',
    'Chefchaouen'
  ]);

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
      { field: 'agency_name', message: 'Agency name is required' },
      { field: 'contact_full_name', message: 'Contact full name is required' },
      { field: 'contact_email', message: 'Contact email is required' },
      { field: 'contact_phone', message: 'Contact phone is required' },
      { field: 'street_number', message: 'Address is required' },
      { field: 'city', message: 'City is required' },
      { field: 'username', message: 'Username is required' },
      { field: 'password', message: 'Password is required' },
      { field: 'confirm_password', message: 'Confirm password is required' }
    ];

    for (const { field, message } of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        setError(message);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    // Payment method validation
    if (!formData.payment_pay_all && !formData.payment_20_percent) {
      setError('Please select at least one payment method');
      return false;
    }

    // Navigation system validation removed
    // if (!formData.navigation_system) {
    //   setError('Please specify if you provide navigation system');
    //   return false;
    // }

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
      const response = await fetch('/api/agency/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Agency registration submitted successfully! Your application is pending admin approval. You will receive an email notification once it\'s reviewed.');
      
      // Reset form after successful submission
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

  const addPickupLocation = () => {
    const newLocation = prompt('Enter pickup location:');
    if (newLocation && newLocation.trim()) {
      setFormData(prev => ({
        ...prev,
        additional_pickup_locations: [...prev.additional_pickup_locations, newLocation.trim()]
      }));
    }
  };

  const removePickupLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_pickup_locations: prev.additional_pickup_locations.filter((_, i) => i !== index)
    }));
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Agency Registration' }
  ];

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
      
      <div>
        <Header />

        {/* Breadcrumb */}
        <section className="breadcrumb-area bread-bg-6">
          <div className="breadcrumb-wrap">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title text-white">Become a Partner</h2>
                      <p className="sec__desc text-white">Join our network of trusted vehicle rental agencies</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-right">
                    <ul className="list-items">
                      {breadcrumbItems.map((item, index) => (
                        <li key={index}>
                          {item.href ? (
                            <a href={item.href}>{item.label}</a>
                          ) : (
                            <span>{item.label}</span>
                          )}
                          {index < breadcrumbItems.length - 1 && <i className="la la-angle-right"></i>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg className="breadcrumb-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
            <polygon points="100 0 100 10 0 10"></polygon>
          </svg>
        </section>

        {/* Registration Form */}
        <section className="contact-area section-padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="form-box">
                  <div className="form-title-wrap">
                    <h3 className="title">Agency Registration Form</h3>
                    <p className="text-muted">Fill out the form below to join our partner network. All fields marked with * are required.</p>
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
                      
                      {/* Row 1: Basic Info + Payment Options */}
                      <div className="form-section mb-3">
                        <div className="row">
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-building me-2"></i>Agency Information
                            </h5>
                            <div className="input-box">
                              <label className="label-text">Agency Name *</label>
                              <div className="form-group">
                                <span className="la la-building form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.agency_name}
                                  onChange={(e) => handleInputChange('agency_name', e.target.value)}
                                  placeholder="Enter your agency name"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-credit-card me-2"></i>Payment Options *
                            </h5>
                            <div className="row">
                              <div className="col-6">
                                <div className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    id="payment_pay_all"
                                    checked={formData.payment_pay_all}
                                    onChange={(e) => handleInputChange('payment_pay_all', e.target.checked)}
                                  />
                                  <label htmlFor="payment_pay_all">Pay all (100%)</label>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    id="payment_20_percent"
                                    checked={formData.payment_20_percent}
                                    onChange={(e) => handleInputChange('payment_20_percent', e.target.checked)}
                                  />
                                  <label htmlFor="payment_20_percent">20% Advance</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Address Information */}
                      <div className="form-section mb-3">
                        <h5 className="form-section-title">
                          <i className="la la-map-marker me-2"></i>Address Information *
                        </h5>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="input-box">
                              <label className="label-text">Street/Number *</label>
                              <div className="form-group">
                                <span className="la la-road form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.street_number}
                                  onChange={(e) => handleInputChange('street_number', e.target.value)}
                                  placeholder="Street address and number"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-box">
                              <label className="label-text">City *</label>
                              <div className="form-group">
                                <span className="la la-map-marker form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.city}
                                  onChange={(e) => handleInputChange('city', e.target.value)}
                                  placeholder="City"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-box">
                              <label className="label-text">Country *</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain select-contain-shadow w-auto">
                                  <select
                                    className="select-contain-select"
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    required
                                  >
                                    <option value="Morocco">Morocco</option>
                                    <option value="Algeria">Algeria</option>
                                    <option value="Tunisia">Tunisia</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="France">France</option>
                                    <option value="Spain">Spain</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Contact Information */}
                      <div className="form-section mb-3">
                        <h5 className="form-section-title">
                          <i className="la la-user me-2"></i>Contact Information *
                        </h5>
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Full Name *</label>
                              <div className="form-group">
                                <span className="la la-user form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.contact_full_name}
                                  onChange={(e) => handleInputChange('contact_full_name', e.target.value)}
                                  placeholder="Contact person's full name"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Email *</label>
                              <div className="form-group">
                                <span className="la la-envelope form-icon"></span>
                                <input
                                  className="form-control"
                                  type="email"
                                  value={formData.contact_email}
                                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                  placeholder="contact@agency.com"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Phone *</label>
                              <div className="form-group">
                                <span className="la la-phone form-icon"></span>
                                <input
                                  className="form-control"
                                  type="tel"
                                  value={formData.contact_phone}
                                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                  placeholder="+212 600 123 456"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Role (Navigation removed) */}
                      <div className="form-section mb-3">
                        <div className="row">
                          <div className="col-lg-12">
                            <h5 className="form-section-title">
                              <i className="la la-briefcase me-2"></i>Role
                            </h5>
                            <div className="input-box">
                              <div className="form-group">
                                <span className="la la-briefcase form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.role}
                                  onChange={(e) => handleInputChange('role', e.target.value)}
                                  placeholder="Owner, Manager, etc."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 5: Child Seats Removed */}

                      {/* Row 7: Login Information */}
                      <div className="form-section mb-3">
                        <h5 className="form-section-title">
                          <i className="la la-lock me-2"></i>Login Information *
                        </h5>
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Username *</label>
                              <div className="form-group">
                                <span className="la la-user form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={formData.username}
                                  onChange={(e) => handleInputChange('username', e.target.value)}
                                  placeholder="Choose a username"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Password *</label>
                              <div className="form-group">
                                <span className="la la-lock form-icon"></span>
                                <input
                                  className="form-control"
                                  type="password"
                                  value={formData.password}
                                  onChange={(e) => handleInputChange('password', e.target.value)}
                                  placeholder="Create a password"
                                  required
                                  minLength="6"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-box">
                              <label className="label-text">Confirm Password *</label>
                              <div className="form-group">
                                <span className="la la-lock form-icon"></span>
                                <input
                                  className="form-control"
                                  type="password"
                                  value={formData.confirm_password}
                                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                                  placeholder="Confirm password"
                                  required
                                  minLength="6"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 6: Pickup Locations + Insurance */}
                      <div className="form-section mb-3">
                        <div className="row">
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-map-marker me-2"></i>Pickup Locations
                            </h5>
                            <div className="custom-checkbox mb-2">
                              <input
                                type="checkbox"
                                id="agency_as_pickup"
                                checked={formData.agency_as_pickup}
                                onChange={(e) => handleInputChange('agency_as_pickup', e.target.checked)}
                              />
                              <label htmlFor="agency_as_pickup">Agency as pickup location</label>
                            </div>
                            <div className="input-box">
                              <label className="label-text">Default Location</label>
                              <div className="form-group select2-container-wrapper">
                                <div className="select-contain select-contain-shadow w-auto">
                                  <select
                                    className="select-contain-select"
                                    value={formData.default_pickup_location}
                                    onChange={(e) => handleInputChange('default_pickup_location', e.target.value)}
                                  >
                                    {pickupLocations.map(location => (
                                      <option key={location} value={location}>{location}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm w-100 mt-2"
                              onClick={addPickupLocation}
                            >
                              <i className="la la-plus me-1"></i>Add Location
                            </button>
                            {formData.additional_pickup_locations.length > 0 && (
                              <div className="pickup-locations-list mt-2">
                                {formData.additional_pickup_locations.map((location, index) => (
                                  <div key={index} className="pickup-location-item d-flex justify-content-between align-items-center">
                                    <span className="small">{location}</span>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removePickupLocation(index)}
                                    >
                                      <i className="la la-trash"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-shield me-2"></i>Insurance Options
                            </h5>
                            <div className="custom-checkbox">
                              <input
                                type="checkbox"
                                id="all_risks_insurance"
                                checked={formData.all_risks_insurance}
                                onChange={(e) => handleInputChange('all_risks_insurance', e.target.checked)}
                              />
                              <label htmlFor="all_risks_insurance">All risks insurance</label>
                            </div>
                            {formData.all_risks_insurance && (
                              <div className="input-box mt-2">
                                <label className="label-text">Price (MAD/day)</label>
                                <div className="form-group">
                                  <span className="la la-money form-icon"></span>
                                  <input
                                    className="form-control"
                                    type="number"
                                    value={formData.insurance_price}
                                    onChange={(e) => handleInputChange('insurance_price', e.target.value)}
                                    placeholder="Insurance price per day"
                                    min="0"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 7: Additional Services + Comments */}
                      <div className="form-section mb-3">
                        <div className="row">
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-cogs me-2"></i>Additional Services
                            </h5>
                            <div className="input-box">
                              <div className="form-group">
                                <textarea
                                  className="form-control message-control"
                                  value={formData.other_services}
                                  onChange={(e) => handleInputChange('other_services', e.target.value)}
                                  placeholder="Extra services (airport pickup, fuel, cleaning, etc.)"
                                  rows="2"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <h5 className="form-section-title">
                              <i className="la la-comment me-2"></i>Comments
                            </h5>
                            <div className="input-box">
                              <div className="form-group">
                                <textarea
                                  className="form-control message-control"
                                  value={formData.comment}
                                  onChange={(e) => handleInputChange('comment', e.target.value)}
                                  placeholder="Additional information or comments"
                                  rows="2"
                                />
                              </div>
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
                              Processing Registration...
                            </>
                          ) : (
                            <>
                              <i className="la la-check me-2"></i>
                              Validate & Submit Application
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-muted">
                          <small>
                            By submitting this form, you agree to our terms and conditions. 
                            Your application will be reviewed by our admin team within 2-3 business days.
                          </small>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <LoginModal />
      <SignupModal />

      <style jsx>{`
        .form-section {
          border: 1px solid #e8ecef;
          border-radius: 8px;
          padding: 15px;
          background: #f8f9fa;
          margin-bottom: 15px;
        }
        
        .form-section-title {
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .input-box {
          margin-bottom: 15px;
        }
        
        .custom-checkbox,
        .custom-radio {
          margin-bottom: 10px;
        }
        
        .custom-checkbox input[type="checkbox"],
        .custom-radio input[type="radio"] {
          margin-right: 8px;
        }
        
        .pickup-locations-list {
          background: white;
          border: 1px solid #e8ecef;
          border-radius: 6px;
          padding: 10px;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .pickup-location-item {
          padding: 6px 0;
          border-bottom: 1px solid #e8ecef;
        }
        
        .pickup-location-item:last-child {
          border-bottom: none;
        }
        
        .radio-option .row {
          margin: 0;
        }
        
        .radio-option .col-lg-6,
        .radio-option .col-6 {
          padding: 0 10px;
        }
        
        /* Compact form controls */
        .form-control {
          padding: 8px 12px;
        }
        
        .label-text {
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        /* Reduce section padding */
        .section-padding {
          padding: 40px 0;
        }
        
        /* Make the form more compact */
        .contact-area {
          padding: 30px 0;
        }
      `}</style>
    </>
  );
}

