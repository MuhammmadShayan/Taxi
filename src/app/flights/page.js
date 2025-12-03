'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function FlightsPage() {
  const { t } = useI18n();
  const [searchType, setSearchType] = useState('roundtrip');
  const [loading, setLoading] = useState(false);

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

  const popularDestinations = [
    { city: 'Paris', country: 'France', price: '$299', image: '/html-folder/images/dest1.jpg' },
    { city: 'London', country: 'United Kingdom', price: '$350', image: '/html-folder/images/dest2.jpg' },
    { city: 'Madrid', country: 'Spain', price: '$199', image: '/html-folder/images/dest3.jpg' },
    { city: 'Dubai', country: 'UAE', price: '$450', image: '/html-folder/images/dest4.jpg' },
    { city: 'Istanbul', country: 'Turkey', price: '$275', image: '/html-folder/images/dest5.jpg' },
    { city: 'Cairo', country: 'Egypt', price: '$225', image: '/html-folder/images/dest6.jpg' }
  ];

  return (
    <>
      <Head>
        <title>Flight Bookings - Find Cheap Flights | Kirastay</title>
        <meta name="description" content="Search and book cheap flights worldwide with Kirastay. Compare prices from airlines and find the best deals for your travel destinations." />
        <meta name="keywords" content="flight booking, cheap flights, airline tickets, international flights, domestic flights, travel deals" />
        <meta property="og:title" content="Flight Bookings - Find Cheap Flights | Kirastay" />
        <meta property="og:description" content="Search and book cheap flights worldwide with Kirastay. Compare prices and find the best deals." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/flights" />
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
                    <h2 className="sec__title text-white">Flight Bookings</h2>
                    <p className="sec__desc text-white">Find and book the best flight deals</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Bookings</li>
                    <li>Flights</li>
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

      {/* Flight Search */}
      <section className="search-area padding-top-60px padding-bottom-40px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="flight-search-container">
                <h3 className="search-title text-center mb-4">Search Flights</h3>
                
                {/* Flight Type Selection */}
                <div className="flight-type-tabs">
                  <div className="btn-group w-100" role="group">
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="searchType" 
                      id="roundtrip"
                      checked={searchType === 'roundtrip'}
                      onChange={() => setSearchType('roundtrip')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="roundtrip">
                      <i className="la la-exchange"></i> Round Trip
                    </label>

                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="searchType" 
                      id="oneway"
                      checked={searchType === 'oneway'}
                      onChange={() => setSearchType('oneway')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="oneway">
                      <i className="la la-long-arrow-right"></i> One Way
                    </label>

                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="searchType" 
                      id="multicity"
                      checked={searchType === 'multicity'}
                      onChange={() => setSearchType('multicity')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="multicity">
                      <i className="la la-plus"></i> Multi-City
                    </label>
                  </div>
                </div>

                {/* Search Form */}
                <div className="flight-search-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-box">
                        <label className="label-text">From</label>
                        <div className="form-group">
                          <span className="la la-plane-departure form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Departure city or airport"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-box">
                        <label className="label-text">To</label>
                        <div className="form-group">
                          <span className="la la-plane-arrival form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Destination city or airport"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Departure</label>
                        <div className="form-group">
                          <span className="la la-calendar form-icon"></span>
                          <input
                            className="form-control"
                            type="date"
                          />
                        </div>
                      </div>
                    </div>
                    {searchType === 'roundtrip' && (
                      <div className="col-lg-2">
                        <div className="input-box">
                          <label className="label-text">Return</label>
                          <div className="form-group">
                            <span className="la la-calendar form-icon"></span>
                            <input
                              className="form-control"
                              type="date"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={searchType === 'roundtrip' ? 'col-lg-2' : 'col-lg-4'}>
                      <div className="btn-box">
                        <button 
                          className="theme-btn w-100" 
                          style={{ marginTop: '25px' }}
                          onClick={() => setLoading(true)}
                        >
                          <i className="la la-search"></i>
                          {loading ? 'Searching...' : 'Search Flights'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Popular Flight Destinations</h2>
                <p className="sec__desc">
                  Discover amazing destinations with the best flight deals from Morocco.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="col-lg-4 responsive-column">
                <div className="card-item destination-card">
                  <div className="card-img">
                    <img 
                      src={destination.image || '/html-folder/images/img21.jpg'} 
                      alt={`${destination.city}, ${destination.country}`}
                      className="destination-image"
                    />
                    <div className="price-badge">{destination.price}</div>
                  </div>
                  <div className="card-body text-center">
                    <h3 className="card-title">{destination.city}</h3>
                    <p className="card-location">{destination.country}</p>
                    <div className="btn-box">
                      <a href="#" className="theme-btn theme-btn-small">
                        Find Flights
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Services */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Complete Travel Solutions</h2>
                <p className="sec__desc">
                  Book flights, hotels, and cars together for the ultimate travel experience.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-plane"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Flight Bookings</h4>
                  <p className="info__desc">
                    Compare and book flights from multiple airlines with competitive prices.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-bed"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Hotel Reservations</h4>
                  <p className="info__desc">
                    Find and book accommodations from budget to luxury hotels worldwide.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-car"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Car Rentals</h4>
                  <p className="info__desc">
                    Rent vehicles from trusted agencies for convenient ground transportation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="cta-area cta-bg-2 bg-fixed section-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title mb-3 text-white">Flight Booking Coming Soon!</h2>
                <p className="sec__desc text-white">
                  We're working hard to bring you the best flight booking experience. 
                  In the meantime, enjoy our car rental services and stay tuned for updates.
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/cars" className="theme-btn border-0 me-3">
                  Browse Cars
                </a>
                <a href="/contact?subject=Flight Booking Updates" className="theme-btn theme-btn-white">
                  Notify Me
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
        .flight-search-container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .search-title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
        }
        
        .flight-type-tabs {
          margin-bottom: 30px;
        }
        
        .btn-outline-primary {
          border-color: #3182ce;
          color: #3182ce;
        }
        
        .btn-check:checked + .btn-outline-primary {
          background-color: #3182ce;
          border-color: #3182ce;
          color: white;
        }
        
        .destination-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
        }
        
        .destination-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .destination-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .price-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #3182ce;
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .card-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .card-location {
          color: #718096;
          margin-bottom: 20px;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
