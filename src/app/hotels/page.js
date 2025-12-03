'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function HotelsPage() {
  const { t } = useI18n();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: 'all',
    starRating: 'all'
  });

  const mockHotels = [
    {
      id: 1,
      name: 'Atlas Palace Hotel',
      location: 'Marrakech, Morocco',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center',
      rating: 4.8,
      reviews: 324,
      price: 89,
      currency: 'USD',
      stars: 5,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Airport Shuttle'],
      description: 'Luxury hotel in the heart of Marrakech with traditional Moroccan architecture and modern amenities.'
    },
    {
      id: 2,
      name: 'Coastal Resort',
      location: 'Agadir, Morocco',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center',
      rating: 4.6,
      reviews: 198,
      price: 125,
      currency: 'USD',
      stars: 4,
      amenities: ['Beachfront', 'Pool', 'Gym', 'Restaurant', 'Free WiFi'],
      description: 'Beautiful beachfront resort with stunning ocean views and excellent facilities.'
    },
    {
      id: 3,
      name: 'Casablanca Business Hotel',
      location: 'Casablanca, Morocco',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&crop=center',
      rating: 4.5,
      reviews: 267,
      price: 95,
      currency: 'USD',
      stars: 4,
      amenities: ['Business Center', 'Free WiFi', 'Gym', 'Restaurant', 'Meeting Rooms'],
      description: 'Modern business hotel perfect for corporate travelers and city explorers.'
    },
    {
      id: 4,
      name: 'Fes Heritage Riad',
      location: 'Fes, Morocco',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&h=600&fit=crop&crop=center',
      rating: 4.9,
      reviews: 156,
      price: 75,
      currency: 'USD',
      stars: 4,
      amenities: ['Traditional Architecture', 'Courtyard', 'Restaurant', 'Free WiFi', 'Cultural Tours'],
      description: 'Authentic Moroccan riad experience in the historic medina of Fes.'
    }
  ];

  useEffect(() => {
    // Simulate loading hotels
    const timer = setTimeout(() => {
      setHotels(mockHotels);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`la la-star ${i < count ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  return (
    <>
      <Head>
        <title>Hotels - Book Accommodations | Kirastay</title>
        <meta name="description" content="Find and book the best hotels in Morocco and worldwide. Compare prices, read reviews, and enjoy exclusive deals on accommodations through Kirastay." />
        <meta name="keywords" content="hotels morocco, hotel booking, accommodations, riads, resorts, business hotels, luxury hotels" />
        <meta property="og:title" content="Hotels - Book Accommodations | Kirastay" />
        <meta property="og:description" content="Find and book the best hotels in Morocco and worldwide. Compare prices and enjoy exclusive deals." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/hotels" />
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
                    <h2 className="sec__title text-white">Hotel Bookings</h2>
                    <p className="sec__desc text-white">Find the perfect accommodation for your stay</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Bookings</li>
                    <li>Hotels</li>
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

      {/* Search Section */}
      <section className="search-area padding-top-60px padding-bottom-40px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="search-box-container">
                <div className="search-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-box">
                        <label className="label-text">Destination</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Where are you going?"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Check-in</label>
                        <div className="form-group">
                          <span className="la la-calendar form-icon"></span>
                          <input
                            className="form-control"
                            type="date"
                            value={filters.checkIn}
                            onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Check-out</label>
                        <div className="form-group">
                          <span className="la la-calendar form-icon"></span>
                          <input
                            className="form-control"
                            type="date"
                            value={filters.checkOut}
                            onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Guests</label>
                        <div className="form-group">
                          <span className="la la-user form-icon"></span>
                          <select
                            className="form-control"
                            value={filters.guests}
                            onChange={(e) => handleFilterChange('guests', e.target.value)}
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5+ Guests</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="btn-box">
                        <button className="theme-btn w-100" style={{ marginTop: '25px' }}>
                          <i className="la la-search"></i>
                          Search Hotels
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

      {/* Hotels Listing */}
      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Featured Hotels</h2>
                <p className="sec__desc">
                  Discover exceptional accommodations across Morocco and beyond.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading hotels...</p>
            </div>
          ) : (
            <div className="row">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="col-lg-6 responsive-column">
                  <div className="card-item hotel-card">
                    <div className="card-img">
                      <a href={`/hotels/${hotel.id}`} className="d-block">
                        <img 
                          src={hotel.image || '/html-folder/images/img21.jpg'} 
                          alt={hotel.name}
                          className="hotel-image"
                        />
                      </a>
                      <div className="star-rating-badge">
                        {renderStars(hotel.stars)}
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">
                        <a href={`/hotels/${hotel.id}`}>{hotel.name}</a>
                      </h3>
                      <p className="card-location">
                        <i className="la la-map-marker"></i>
                        {hotel.location}
                      </p>
                      <p className="card-text">{hotel.description}</p>
                      
                      <div className="amenities-list">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="amenity-more">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="card-footer-area">
                        <div className="card-price-box">
                          <p className="card-price">
                            <span className="price__from">From</span>
                            <span className="price__num">${hotel.price}</span>
                            <span className="price__text">per night</span>
                          </p>
                        </div>
                        <div className="rating-and-btn d-flex align-items-center justify-content-between">
                          <div className="rating-box">
                            <div className="review-stars">
                              <span className="rating-number">{hotel.rating}</span>
                              {renderStars(Math.floor(hotel.rating))}
                            </div>
                            <span className="rating-count">({hotel.reviews} reviews)</span>
                          </div>
                          <div className="btn-box">
                            <a href={`/hotels/${hotel.id}/booking`} className="theme-btn theme-btn-small">
                              Book Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No hotels message */}
          {!loading && hotels.length === 0 && (
            <div className="text-center py-5">
              <div className="no-results">
                <i className="la la-bed" style={{ fontSize: '64px', color: '#cbd5e0', marginBottom: '20px' }}></i>
                <h3>No hotels found</h3>
                <p>Try adjusting your search criteria or browse our featured accommodations.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hotel Categories */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Accommodation Types</h2>
                <p className="sec__desc">
                  From luxury resorts to traditional riads, find the perfect accommodation for your needs.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-building"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Luxury Hotels</h4>
                  <p className="info__desc">
                    5-star accommodations with world-class amenities and exceptional service.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-home"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Traditional Riads</h4>
                  <p className="info__desc">
                    Authentic Moroccan architecture with courtyards and traditional design.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-umbrella-beach"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Beach Resorts</h4>
                  <p className="info__desc">
                    Oceanfront properties with private beaches and water activities.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-briefcase"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Business Hotels</h4>
                  <p className="info__desc">
                    Modern facilities for business travelers with meeting rooms and WiFi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-area cta-bg-2 bg-fixed section-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title mb-3 text-white">Complete Your Travel Experience</h2>
                <p className="sec__desc text-white">
                  Book your hotel and car rental together for the best deals and seamless travel experience.
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/cars" className="theme-btn border-0 me-3">
                  Browse Cars
                </a>
                <a href="/contact" className="theme-btn theme-btn-white">
                  Contact Us
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
        .search-box-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .hotel-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
          height: 100%;
        }
        
        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .hotel-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        
        .star-rating-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
        }
        
        .card-title a {
          color: #2d3748;
          text-decoration: none;
          font-size: 20px;
          font-weight: 600;
        }
        
        .card-title a:hover {
          color: #3182ce;
        }
        
        .card-location {
          color: #718096;
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .card-text {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .amenities-list {
          margin-bottom: 25px;
        }
        
        .amenity-tag {
          display: inline-block;
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin: 0 5px 5px 0;
        }
        
        .amenity-more {
          color: #718096;
          font-size: 12px;
          font-style: italic;
        }
        
        .card-footer-area {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        
        .card-price-box {
          margin-bottom: 15px;
        }
        
        .card-price {
          margin: 0;
          font-size: 16px;
        }
        
        .price__from {
          color: #718096;
          font-size: 14px;
        }
        
        .price__num {
          color: #3182ce;
          font-size: 24px;
          font-weight: 700;
          margin: 0 5px;
        }
        
        .price__text {
          color: #718096;
          font-size: 14px;
        }
        
        .rating-box {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .review-stars {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .rating-number {
          color: #3182ce;
          font-weight: 600;
          margin-right: 5px;
        }
        
        .rating-count {
          color: #718096;
          font-size: 12px;
        }
        
        .section-bg {
          background: #f7fafc;
        }
        
        .no-results {
          color: #4a5568;
        }
        
        .no-results h3 {
          color: #2d3748;
          margin-bottom: 15px;
        }
      `}</style>
    </>
  );
}
