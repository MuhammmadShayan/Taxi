'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function CarHirePage() {
  const { t } = useI18n();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    vehicleType: 'all',
    priceRange: 'all'
  });

  const mockVehicles = [
    {
      id: 1,
      name: 'Economy Car - Dacia Logan',
      type: 'Economy',
      image: '/html-folder/images/car1.jpg',
      price: 25,
      agency: 'Morocco Car Rental',
      location: 'Casablanca',
      features: ['Manual Transmission', 'Air Conditioning', '5 Seats', 'Basic Insurance'],
      rating: 4.5,
      reviews: 127,
      fuel: 'Petrol',
      doors: 4
    },
    {
      id: 2,
      name: 'Compact SUV - Dacia Duster',
      type: 'SUV',
      image: '/html-folder/images/car2.jpg',
      price: 45,
      agency: 'Atlas Rent',
      location: 'Marrakech',
      features: ['Manual Transmission', 'Air Conditioning', '5 Seats', '4WD', 'GPS'],
      rating: 4.7,
      reviews: 98,
      fuel: 'Diesel',
      doors: 5
    },
    {
      id: 3,
      name: 'Luxury Sedan - BMW 3 Series',
      type: 'Luxury',
      image: '/html-folder/images/car3.jpg',
      price: 85,
      agency: 'Royal Car Services',
      location: 'Rabat',
      features: ['Automatic Transmission', 'Leather Seats', '5 Seats', 'Premium Sound', 'GPS'],
      rating: 4.9,
      reviews: 156,
      fuel: 'Petrol',
      doors: 4
    },
    {
      id: 4,
      name: 'Family Van - Toyota Hiace',
      type: 'Van',
      image: '/html-folder/images/car4.jpg',
      price: 65,
      agency: 'Coastal Rentals',
      location: 'Agadir',
      features: ['Manual Transmission', 'Air Conditioning', '9 Seats', 'Large Luggage Space'],
      rating: 4.4,
      reviews: 89,
      fuel: 'Diesel',
      doors: 4
    },
    {
      id: 5,
      name: 'Premium SUV - Toyota Land Cruiser',
      type: 'Premium SUV',
      image: '/html-folder/images/car5.jpg',
      price: 120,
      agency: 'Desert Adventures',
      location: 'Ouarzazate',
      features: ['Automatic Transmission', '4WD', '7 Seats', 'Premium Interior', 'GPS'],
      rating: 4.8,
      reviews: 203,
      fuel: 'Diesel',
      doors: 5
    },
    {
      id: 6,
      name: 'Electric Car - Nissan Leaf',
      type: 'Electric',
      image: '/html-folder/images/car6.jpg',
      price: 55,
      agency: 'EcoRent Morocco',
      location: 'Casablanca',
      features: ['Automatic Transmission', 'Electric Motor', '5 Seats', 'Fast Charging'],
      rating: 4.6,
      reviews: 74,
      fuel: 'Electric',
      doors: 4
    }
  ];

  const vehicleCategories = [
    { name: 'Economy', icon: 'la la-car', description: 'Budget-friendly cars perfect for city driving', startingPrice: '$25' },
    { name: 'Compact', icon: 'la la-car', description: 'Small cars ideal for couples and short trips', startingPrice: '$35' },
    { name: 'SUV', icon: 'la la-truck', description: 'Spacious vehicles perfect for families and adventures', startingPrice: '$45' },
    { name: 'Luxury', icon: 'la la-diamond', description: 'Premium vehicles with top-tier comfort and features', startingPrice: '$85' },
    { name: 'Van/Minibus', icon: 'la la-bus', description: 'Large capacity vehicles for groups and cargo', startingPrice: '$65' },
    { name: 'Electric', icon: 'la la-leaf', description: 'Eco-friendly electric vehicles for sustainable travel', startingPrice: '$55' }
  ];

  useEffect(() => {
    // Simulate loading vehicles
    const timer = setTimeout(() => {
      setVehicles(mockVehicles);
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
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`la la-star ${i < Math.floor(rating) ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  return (
    <>
      <Head>
        <title>Car Hire - Rent Vehicles Worldwide | Kirastay</title>
        <meta name="description" content="Hire cars, SUVs, and luxury vehicles worldwide with Kirastay. Compare prices from trusted rental agencies and book the perfect vehicle for your journey." />
        <meta name="keywords" content="car hire, vehicle rental, car rental worldwide, SUV rental, luxury car hire, economy car rental" />
        <meta property="og:title" content="Car Hire - Rent Vehicles Worldwide | Kirastay" />
        <meta property="og:description" content="Hire cars, SUVs, and luxury vehicles worldwide with Kirastay. Compare prices and book the perfect vehicle." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/car-hire" />
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
                    <h2 className="sec__title text-white">Car Hire Services</h2>
                    <p className="sec__desc text-white">Find the perfect vehicle for your journey</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Services</li>
                    <li>Car Hire</li>
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

      {/* Search Form */}
      <section className="search-area padding-top-60px padding-bottom-40px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="search-box-container">
                <h3 className="search-title text-center mb-4">Find Your Perfect Car Hire</h3>
                <div className="search-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-box">
                        <label className="label-text">Pickup Location</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="City or Airport"
                            value={searchFilters.pickupLocation}
                            onChange={(e) => handleFilterChange('pickupLocation', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-box">
                        <label className="label-text">Dropoff Location</label>
                        <div className="form-group">
                          <span className="la la-map-marker form-icon"></span>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Same as pickup"
                            value={searchFilters.dropoffLocation}
                            onChange={(e) => handleFilterChange('dropoffLocation', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Pickup Date</label>
                        <div className="form-group">
                          <span className="la la-calendar form-icon"></span>
                          <input
                            className="form-control"
                            type="date"
                            value={searchFilters.pickupDate}
                            onChange={(e) => handleFilterChange('pickupDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="input-box">
                        <label className="label-text">Dropoff Date</label>
                        <div className="form-group">
                          <span className="la la-calendar form-icon"></span>
                          <input
                            className="form-control"
                            type="date"
                            value={searchFilters.dropoffDate}
                            onChange={(e) => handleFilterChange('dropoffDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="btn-box">
                        <button className="theme-btn w-100" style={{ marginTop: '25px' }}>
                          <i className="la la-search"></i>
                          Search Cars
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

      {/* Vehicle Categories */}
      <section className="service-area section--padding section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Vehicle Categories</h2>
                <p className="sec__desc">
                  Choose from our wide selection of vehicle categories to suit your travel needs.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {vehicleCategories.map((category, index) => (
              <div key={index} className="col-lg-4 responsive-column">
                <div className="category-card">
                  <div className="category-icon">
                    <i className={category.icon}></i>
                  </div>
                  <h4 className="category-title">{category.name}</h4>
                  <p className="category-desc">{category.description}</p>
                  <div className="category-price">Starting from {category.startingPrice}/day</div>
                  <div className="btn-box">
                    <a href={`/cars?category=${category.name.toLowerCase()}`} className="theme-btn theme-btn-small">
                      Browse {category.name}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="card-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Featured Vehicles</h2>
                <p className="sec__desc">
                  Popular car hire options from our trusted partner agencies.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading vehicles...</p>
            </div>
          ) : (
            <div className="row">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="col-lg-4 responsive-column">
                  <div className="card-item car-card">
                    <div className="card-img">
                      <a href={`/cars/${vehicle.id}`} className="d-block">
                        <img 
                          src={vehicle.image || '/html-folder/images/img21.jpg'} 
                          alt={vehicle.name}
                          className="car-image"
                        />
                      </a>
                      <div className="vehicle-type-badge">{vehicle.type}</div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">
                        <a href={`/cars/${vehicle.id}`}>{vehicle.name}</a>
                      </h3>
                      <p className="agency-info">
                        <i className="la la-building"></i>
                        {vehicle.agency} - {vehicle.location}
                      </p>
                      
                      <div className="vehicle-specs">
                        <div className="spec-item">
                          <i className="la la-users"></i>
                          <span>5 Seats</span>
                        </div>
                        <div className="spec-item">
                          <i className="la la-car"></i>
                          <span>{vehicle.doors} Doors</span>
                        </div>
                        <div className="spec-item">
                          <i className="la la-gas-pump"></i>
                          <span>{vehicle.fuel}</span>
                        </div>
                      </div>
                      
                      <div className="features-list">
                        {vehicle.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className="feature-more">
                            +{vehicle.features.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="card-footer-area">
                        <div className="card-price-box">
                          <p className="card-price">
                            <span className="price__num">${vehicle.price}</span>
                            <span className="price__text">per day</span>
                          </p>
                        </div>
                        <div className="rating-and-btn d-flex align-items-center justify-content-between">
                          <div className="rating-box">
                            <div className="review-stars">
                              <span className="rating-number">{vehicle.rating}</span>
                              {renderStars(vehicle.rating)}
                            </div>
                            <span className="rating-count">({vehicle.reviews} reviews)</span>
                          </div>
                          <div className="btn-box">
                            <a href={`/cars/${vehicle.id}/booking`} className="theme-btn theme-btn-small">
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
        </div>
      </section>

      {/* Why Choose Our Car Hire */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Why Choose Kirastay Car Hire?</h2>
                <p className="sec__desc">
                  Experience the best car rental service with our trusted partners and exceptional features.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-shield"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Fully Insured</h4>
                  <p className="info__desc">
                    All vehicles come with comprehensive insurance coverage for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-clock"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">24/7 Support</h4>
                  <p className="info__desc">
                    Round-the-clock customer support and roadside assistance when you need it.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-check-circle"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Quality Guaranteed</h4>
                  <p className="info__desc">
                    All vehicles are regularly maintained and inspected for safety and reliability.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-dollar"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Best Prices</h4>
                  <p className="info__desc">
                    Compare prices from multiple agencies to find the best deals for your budget.
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
                <h2 className="sec__title mb-3 text-white">Ready to Hit the Road?</h2>
                <p className="sec__desc text-white">
                  Book your perfect car hire today and start your adventure with confidence. 
                  Thousands of vehicles available worldwide!
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/cars" className="theme-btn border-0 me-3">
                  Browse All Cars
                </a>
                <a href="/contact" className="theme-btn theme-btn-white">
                  Need Help?
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
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .search-title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
        }
        
        .category-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .category-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3182ce, #2c5aa0);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
        }
        
        .category-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .category-desc {
          color: #4a5568;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .category-price {
          color: #3182ce;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 25px;
        }
        
        .car-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
          height: 100%;
        }
        
        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .car-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .vehicle-type-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #3182ce;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .card-title a {
          color: #2d3748;
          text-decoration: none;
          font-size: 18px;
          font-weight: 600;
        }
        
        .card-title a:hover {
          color: #3182ce;
        }
        
        .agency-info {
          color: #718096;
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .vehicle-specs {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 15px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .spec-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #4a5568;
          font-size: 12px;
        }
        
        .spec-item i {
          font-size: 16px;
          color: #3182ce;
        }
        
        .features-list {
          margin-bottom: 20px;
        }
        
        .feature-tag {
          display: inline-block;
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          margin: 0 5px 5px 0;
        }
        
        .feature-more {
          color: #718096;
          font-size: 11px;
          font-style: italic;
        }
        
        .card-footer-area {
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
        }
        
        .card-price-box {
          margin-bottom: 15px;
        }
        
        .card-price {
          margin: 0;
          font-size: 16px;
        }
        
        .price__num {
          color: #3182ce;
          font-size: 20px;
          font-weight: 700;
          margin-right: 5px;
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
          gap: 3px;
        }
        
        .rating-number {
          color: #3182ce;
          font-weight: 600;
          margin-right: 5px;
          font-size: 14px;
        }
        
        .rating-count {
          color: #718096;
          font-size: 12px;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
