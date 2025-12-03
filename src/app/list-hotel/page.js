'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function ListHotelPage() {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    address: '',
    city: '',
    country: 'Morocco',
    email: '',
    phone: '',
    website: '',
    description: '',
    amenities: [],
    roomTypes: [],
    starRating: '',
    checkInTime: '',
    checkOutTime: ''
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

  const benefits = [
    {
      icon: 'la la-users',
      title: 'Reach More Guests',
      description: 'Connect with thousands of travelers looking for authentic Moroccan experiences.'
    },
    {
      icon: 'la la-chart-line',
      title: 'Increase Revenue',
      description: 'Boost your bookings with our advanced marketing tools and global reach.'
    },
    {
      icon: 'la la-shield-alt',
      title: 'Secure Payments',
      description: 'Guaranteed secure payments with our trusted payment processing system.'
    },
    {
      icon: 'la la-headset',
      title: '24/7 Support',
      description: 'Dedicated support team to help you manage your property and bookings.'
    },
    {
      icon: 'la la-mobile',
      title: 'Easy Management',
      description: 'User-friendly dashboard to manage rooms, rates, and availability easily.'
    },
    {
      icon: 'la la-star',
      title: 'Quality Assurance',
      description: 'Maintain high standards with our quality control and guest feedback system.'
    }
  ];

  const propertyTypes = [
    'Hotel',
    'Riad',
    'Guesthouse',
    'Resort',
    'Apartment',
    'Villa',
    'Hostel',
    'Bed & Breakfast',
    'Camping',
    'Other'
  ];

  const amenitiesList = [
    'Free WiFi',
    'Swimming Pool',
    'Spa & Wellness',
    'Restaurant',
    'Bar',
    'Gym/Fitness Center',
    'Business Center',
    'Conference Rooms',
    'Parking',
    'Airport Shuttle',
    'Room Service',
    'Concierge',
    'Pet Friendly',
    'Air Conditioning',
    'Balcony/Terrace'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your submission! Our team will review your property and contact you within 24 hours.');
    console.log('Form submitted:', formData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Head>
        <title>List Your Hotel - Partner with Kirastay | Kirastay</title>
        <meta name="description" content="List your hotel, riad, or accommodation on Kirastay. Join our partner network and reach thousands of travelers looking for authentic Moroccan experiences." />
        <meta name="keywords" content="list hotel, hotel partnership, accommodation listing, Morocco hotels, riad listing, property management" />
        <meta property="og:title" content="List Your Hotel - Partner with Kirastay | Kirastay" />
        <meta property="og:description" content="Join our partner network and list your property on Kirastay to reach more guests and increase your revenue." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/list-hotel" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-12">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">List Your Hotel</h2>
                    <p className="sec__desc text-white">Partner with us and reach more guests</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Partners</li>
                    <li>List Hotel</li>
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

      {/* Benefits Section */}
      <section className="feature-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Why Partner with Kirastay?</h2>
                <p className="sec__desc">
                  Join thousands of properties worldwide and grow your business with our platform.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-4 responsive-column">
                <div className="feature-item feature-item-layout-2 margin-bottom-30px">
                  <div className="feature-icon">
                    <i className={benefit.icon}></i>
                  </div>
                  <div className="feature-content">
                    <h4 className="feature__title">{benefit.title}</h4>
                    <p className="feature__desc">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="contact-area section-bg padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">List Your Property</h2>
                <p className="sec__desc">
                  Fill out the form below to start partnering with Kirastay. Our team will review your submission.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="progress-steps">
                <div className="steps-container">
                  <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-title">Property Info</div>
                  </div>
                  <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-title">Details</div>
                  </div>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-title">Review</div>
                  </div>
                </div>
              </div>

              <div className="form-box">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="form-step">
                      <h4 className="step-heading">Property Information</h4>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Property Name *</label>
                            <div className="form-group">
                              <span className="la la-building form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="propertyName"
                                value={formData.propertyName}
                                onChange={handleInputChange}
                                placeholder="e.g., Atlas Mountain Riad"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Property Type *</label>
                            <div className="form-group">
                              <span className="la la-bed form-icon"></span>
                              <select
                                className="form-control"
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select property type</option>
                                {propertyTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Address *</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Full address of your property"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">City *</label>
                            <div className="form-group">
                              <span className="la la-city form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="e.g., Marrakech"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Star Rating</label>
                            <div className="form-group">
                              <span className="la la-star form-icon"></span>
                              <select
                                className="form-control"
                                name="starRating"
                                value={formData.starRating}
                                onChange={handleInputChange}
                              >
                                <option value="">Select rating</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="btn-box text-end margin-top-30px">
                        <button type="button" className="theme-btn" onClick={nextStep}>
                          Next Step <i className="la la-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact & Details */}
                  {currentStep === 2 && (
                    <div className="form-step">
                      <h4 className="step-heading">Contact & Property Details</h4>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Email Address *</label>
                            <div className="form-group">
                              <span className="la la-envelope form-icon"></span>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
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
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+212 XXX XXXXXX"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Website (Optional)</label>
                            <div className="form-group">
                              <span className="la la-globe form-icon"></span>
                              <input
                                className="form-control"
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://yourhotel.com"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Property Description *</label>
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Describe your property, its unique features, and what makes it special..."
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Check-in Time</label>
                            <div className="form-group">
                              <span className="la la-clock form-icon"></span>
                              <input
                                className="form-control"
                                type="time"
                                name="checkInTime"
                                value={formData.checkInTime}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-box">
                            <label className="label-text">Check-out Time</label>
                            <div className="form-group">
                              <span className="la la-clock form-icon"></span>
                              <input
                                className="form-control"
                                type="time"
                                name="checkOutTime"
                                value={formData.checkOutTime}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      <div className="amenities-section margin-top-30px">
                        <label className="label-text">Property Amenities</label>
                        <div className="amenities-grid">
                          {amenitiesList.map((amenity) => (
                            <label key={amenity} className="amenity-checkbox">
                              <input
                                type="checkbox"
                                checked={formData.amenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                              />
                              <span className="checkmark"></span>
                              {amenity}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="btn-box d-flex justify-content-between margin-top-30px">
                        <button type="button" className="theme-btn theme-btn-small" onClick={prevStep}>
                          <i className="la la-arrow-left"></i> Previous
                        </button>
                        <button type="button" className="theme-btn" onClick={nextStep}>
                          Next Step <i className="la la-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="form-step">
                      <h4 className="step-heading">Review Your Information</h4>
                      
                      <div className="review-section">
                        <div className="review-item">
                          <h5>Property Information</h5>
                          <p><strong>Name:</strong> {formData.propertyName}</p>
                          <p><strong>Type:</strong> {formData.propertyType}</p>
                          <p><strong>Location:</strong> {formData.address}, {formData.city}</p>
                          <p><strong>Rating:</strong> {formData.starRating ? `${formData.starRating} Stars` : 'Not specified'}</p>
                        </div>
                        
                        <div className="review-item">
                          <h5>Contact Details</h5>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                        </div>
                        
                        {formData.amenities.length > 0 && (
                          <div className="review-item">
                            <h5>Amenities</h5>
                            <div className="amenities-list">
                              {formData.amenities.map((amenity, index) => (
                                <span key={index} className="amenity-tag">
                                  <i className="la la-check"></i>
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="terms-section margin-top-30px">
                        <label className="checkbox-label">
                          <input type="checkbox" required />
                          <span className="checkmark"></span>
                          I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                        </label>
                      </div>

                      <div className="btn-box d-flex justify-content-between margin-top-30px">
                        <button type="button" className="theme-btn theme-btn-small" onClick={prevStep}>
                          <i className="la la-arrow-left"></i> Previous
                        </button>
                        <button type="submit" className="theme-btn">
                          <i className="la la-paper-plane"></i> Submit Application
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="timeline-area padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">How It Works</h2>
                <p className="sec__desc">
                  Simple steps to get your property listed on Kirastay.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="process-item text-center">
                <div className="process-icon">
                  <span className="process-number">1</span>
                  <i className="la la-edit"></i>
                </div>
                <h4 className="process-title">Submit Application</h4>
                <p className="process-desc">
                  Fill out our simple registration form with your property details.
                </p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="process-item text-center">
                <div className="process-icon">
                  <span className="process-number">2</span>
                  <i className="la la-search"></i>
                </div>
                <h4 className="process-title">Property Review</h4>
                <p className="process-desc">
                  Our team reviews your property to ensure quality standards.
                </p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="process-item text-center">
                <div className="process-icon">
                  <span className="process-number">3</span>
                  <i className="la la-check-circle"></i>
                </div>
                <h4 className="process-title">Account Setup</h4>
                <p className="process-desc">
                  We'll set up your partner account and provide dashboard access.
                </p>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="process-item text-center">
                <div className="process-icon">
                  <span className="process-number">4</span>
                  <i className="la la-rocket"></i>
                </div>
                <h4 className="process-title">Go Live</h4>
                <p className="process-desc">
                  Your property goes live and starts receiving bookings!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-area section-bg-2 padding-top-100px padding-bottom-100px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading">
                <h2 className="sec__title text-white mb-3">Ready to Partner with Us?</h2>
                <p className="sec__desc text-white">
                  Join thousands of successful property partners and start growing your business today. 
                  Our team is here to support you every step of the way.
                </p>
              </div>
              <div className="btn-box margin-top-40px">
                <a href="/contact" className="theme-btn border-0 me-3">
                  Contact Our Team
                </a>
                <a href="/partners" className="theme-btn theme-btn-white">
                  Learn More
                </a>
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
        .progress-steps {
          margin-bottom: 40px;
        }
        
        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding: 0 20px;
        }
        
        .steps-container::before {
          content: '';
          position: absolute;
          top: 25px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: #e2e8f0;
          z-index: 1;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        
        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #718096;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .step.active .step-number {
          background: #3182ce;
          color: white;
        }
        
        .step-title {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .form-box {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .step-heading {
          color: #2d3748;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .amenities-section {
          margin-top: 30px;
        }
        
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .amenity-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 10px;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }
        
        .amenity-checkbox:hover {
          background: #f7fafc;
        }
        
        .amenity-checkbox input {
          margin-right: 10px;
        }
        
        .review-section {
          background: #f7fafc;
          border-radius: 8px;
          padding: 30px;
        }
        
        .review-item {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .review-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .review-item h5 {
          color: #2d3748;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .review-item p {
          margin-bottom: 8px;
          color: #4a5568;
        }
        
        .amenity-tag {
          display: inline-block;
          background: white;
          color: #4a5568;
          padding: 4px 10px;
          margin: 4px;
          border-radius: 15px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
        }
        
        .amenity-tag i {
          color: #38a169;
          margin-right: 5px;
        }
        
        .terms-section {
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #4a5568;
        }
        
        .checkbox-label input {
          margin-right: 10px;
        }
        
        .process-item {
          margin-bottom: 40px;
        }
        
        .process-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #3182ce;
          color: white;
          font-size: 32px;
          margin-bottom: 25px;
        }
        
        .process-number {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 25px;
          height: 25px;
          background: #f6ad55;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        
        .process-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .process-desc {
          color: #718096;
          line-height: 1.6;
        }
        
        .feature-item {
          padding: 30px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
        }
        
        .feature-icon {
          font-size: 48px;
          color: #3182ce;
          margin-bottom: 20px;
        }
        
        .feature__title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .feature__desc {
          color: #718096;
          line-height: 1.6;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
