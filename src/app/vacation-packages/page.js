'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function VacationPackagesPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('popular');
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

  const vacationPackages = {
    popular: [
      {
        id: 1,
        title: 'Morocco Imperial Cities',
        destination: 'Casablanca - Rabat - Meknes - Fez',
        duration: '7 Days / 6 Nights',
        price: '$899',
        originalPrice: '$1,200',
        discount: '25%',
        image: '/html-folder/images/img21.jpg',
        rating: 4.8,
        reviews: 156,
        includes: ['Flights', 'Hotels', 'Meals', 'Guide', 'Transport']
      },
      {
        id: 2,
        title: 'Sahara Desert Adventure',
        destination: 'Marrakech - Merzouga - Todra Gorge',
        duration: '5 Days / 4 Nights',
        price: '$749',
        originalPrice: '$950',
        discount: '21%',
        image: '/html-folder/images/img22.jpg',
        rating: 4.9,
        reviews: 89,
        includes: ['Desert Camp', 'Camel Trek', 'Meals', 'Guide', '4WD Transport']
      },
      {
        id: 3,
        title: 'Coastal Morocco',
        destination: 'Casablanca - Essaouira - Agadir',
        duration: '6 Days / 5 Nights',
        price: '$649',
        originalPrice: '$799',
        discount: '19%',
        image: '/html-folder/images/img23.jpg',
        rating: 4.7,
        reviews: 203,
        includes: ['Beach Hotels', 'Seafood Tours', 'Water Sports', 'Transport']
      }
    ],
    international: [
      {
        id: 4,
        title: 'Paris & Rome Explorer',
        destination: 'Paris - Rome',
        duration: '8 Days / 7 Nights',
        price: '$1,299',
        originalPrice: '$1,699',
        discount: '24%',
        image: '/html-folder/images/dest1.jpg',
        rating: 4.9,
        reviews: 342,
        includes: ['Flights', 'Hotels', 'City Tours', 'High-speed Train']
      },
      {
        id: 5,
        title: 'Spanish Mediterranean',
        destination: 'Barcelona - Valencia - Madrid',
        duration: '10 Days / 9 Nights',
        price: '$1,149',
        originalPrice: '$1,449',
        discount: '21%',
        image: '/html-folder/images/dest3.jpg',
        rating: 4.8,
        reviews: 198,
        includes: ['Flights', 'Hotels', 'Museums', 'Food Tours', 'Transport']
      }
    ],
    luxury: [
      {
        id: 6,
        title: 'Royal Morocco Experience',
        destination: 'Marrakech - Atlas Mountains',
        duration: '5 Days / 4 Nights',
        price: '$2,199',
        originalPrice: '$2,799',
        discount: '21%',
        image: '/html-folder/images/img24.jpg',
        rating: 5.0,
        reviews: 67,
        includes: ['Luxury Riads', 'Private Guide', 'Spa', 'Fine Dining', 'Private Transport']
      }
    ]
  };

  const packageFeatures = [
    {
      icon: 'la la-plane',
      title: 'Flight Included',
      description: 'Round-trip flights from major Moroccan cities'
    },
    {
      icon: 'la la-bed',
      title: 'Accommodation',
      description: 'Handpicked hotels and traditional riads'
    },
    {
      icon: 'la la-utensils',
      title: 'Meals Included',
      description: 'Breakfast and selected meals included'
    },
    {
      icon: 'la la-user',
      title: 'Expert Guides',
      description: 'Professional local guides and tour leaders'
    },
    {
      icon: 'la la-bus',
      title: 'Transportation',
      description: 'Comfortable air-conditioned vehicles'
    },
    {
      icon: 'la la-shield-alt',
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    }
  ];

  return (
    <>
      <Head>
        <title>Vacation Packages - All-Inclusive Holiday Deals | Kirastay</title>
        <meta name="description" content="Discover amazing vacation packages and holiday deals with Kirastay. All-inclusive travel packages to Morocco and international destinations with flights, hotels, and activities." />
        <meta name="keywords" content="vacation packages, holiday deals, all-inclusive travel, Morocco tours, international packages, travel deals" />
        <meta property="og:title" content="Vacation Packages - All-Inclusive Holiday Deals | Kirastay" />
        <meta property="og:description" content="Discover amazing vacation packages and holiday deals with flights, hotels, and activities included." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/vacation-packages" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-10">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Vacation Packages</h2>
                    <p className="sec__desc text-white">All-inclusive holiday deals and travel packages</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Travel</li>
                    <li>Vacation Packages</li>
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

      {/* Package Categories */}
      <section className="tour-area padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Choose Your Perfect Package</h2>
                <p className="sec__desc">
                  Explore our curated vacation packages designed for unforgettable experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-shared">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'popular' ? 'active' : ''}`}
                      onClick={() => setActiveTab('popular')}
                      role="tab"
                    >
                      <i className="la la-star"></i>
                      Popular Packages
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'international' ? 'active' : ''}`}
                      onClick={() => setActiveTab('international')}
                      role="tab"
                    >
                      <i className="la la-globe"></i>
                      International
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'luxury' ? 'active' : ''}`}
                      onClick={() => setActiveTab('luxury')}
                      role="tab"
                    >
                      <i className="la la-gem"></i>
                      Luxury Packages
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Package Grid */}
          <div className="row margin-top-50px">
            {vacationPackages[activeTab]?.map((pkg) => (
              <div key={pkg.id} className="col-lg-4 responsive-column">
                <div className="card-item package-card">
                  <div className="card-img">
                    <a href={`/vacation-packages/${pkg.id}`}>
                      <img 
                        src={pkg.image} 
                        alt={pkg.title}
                        className="package-image"
                      />
                    </a>
                    {pkg.discount && (
                      <div className="discount-badge">-{pkg.discount}</div>
                    )}
                    <div className="duration-badge">{pkg.duration}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      <a href={`/vacation-packages/${pkg.id}`}>{pkg.title}</a>
                    </h3>
                    <p className="card-meta">
                      <i className="la la-map-marker"></i>
                      {pkg.destination}
                    </p>
                    
                    <div className="rating-row">
                      <div className="star-rating" data-rating={pkg.rating}>
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`la la-star ${i < Math.floor(pkg.rating) ? 'text-warning' : 'text-muted'}`}
                          ></span>
                        ))}
                      </div>
                      <span className="rating-count">({pkg.reviews} reviews)</span>
                    </div>

                    <div className="package-includes">
                      <p className="includes-title">Package Includes:</p>
                      <div className="includes-list">
                        {pkg.includes.map((item, index) => (
                          <span key={index} className="includes-item">
                            <i className="la la-check"></i>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card-price">
                      <div className="price">
                        {pkg.originalPrice && (
                          <span className="price-old">{pkg.originalPrice}</span>
                        )}
                        <span className="price__from">From</span>
                        <span className="price__num">{pkg.price}</span>
                        <span className="price__text">Per Person</span>
                      </div>
                      <div className="btn-box">
                        <a href={`/vacation-packages/${pkg.id}`} className="theme-btn">
                          View Package
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Features */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">What's Included in Our Packages</h2>
                <p className="sec__desc">
                  Every vacation package is carefully crafted to ensure you have an amazing experience.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {packageFeatures.map((feature, index) => (
              <div key={index} className="col-lg-4 responsive-column">
                <div className="icon-box icon-layout-2 margin-bottom-30px">
                  <div className="info-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">{feature.title}</h4>
                    <p className="info__desc">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Search */}
      <section className="booking-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Find Your Perfect Package</h2>
                <p className="sec__desc">
                  Search for vacation packages based on your preferences and budget.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-12">
              <div className="package-search-form">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-box">
                      <label className="label-text">Destination</label>
                      <div className="form-group">
                        <span className="la la-map-marker form-icon"></span>
                        <select className="form-control">
                          <option value="">Where do you want to go?</option>
                          <option value="morocco">Morocco</option>
                          <option value="europe">Europe</option>
                          <option value="middle-east">Middle East</option>
                          <option value="africa">Africa</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="input-box">
                      <label className="label-text">Duration</label>
                      <div className="form-group">
                        <span className="la la-clock form-icon"></span>
                        <select className="form-control">
                          <option value="">Any Duration</option>
                          <option value="3-5">3-5 Days</option>
                          <option value="6-10">6-10 Days</option>
                          <option value="11+">11+ Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="input-box">
                      <label className="label-text">Budget</label>
                      <div className="form-group">
                        <span className="la la-dollar form-icon"></span>
                        <select className="form-control">
                          <option value="">Any Budget</option>
                          <option value="under-500">Under $500</option>
                          <option value="500-1000">$500 - $1,000</option>
                          <option value="1000-2000">$1,000 - $2,000</option>
                          <option value="over-2000">Over $2,000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="input-box">
                      <label className="label-text">Departure Date</label>
                      <div className="form-group">
                        <span className="la la-calendar form-icon"></span>
                        <input
                          className="form-control"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="input-box">
                      <label className="label-text">Travelers</label>
                      <div className="form-group">
                        <span className="la la-user form-icon"></span>
                        <select className="form-control">
                          <option value="1">1 Traveler</option>
                          <option value="2">2 Travelers</option>
                          <option value="3">3 Travelers</option>
                          <option value="4">4 Travelers</option>
                          <option value="5+">5+ Travelers</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="btn-box">
                      <button 
                        className="theme-btn w-100" 
                        style={{ marginTop: '25px' }}
                        onClick={() => setLoading(true)}
                      >
                        <i className="la la-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Packages */}
      <section className="testimonial-area section-bg padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Why Choose Our Vacation Packages?</h2>
                <p className="sec__desc">
                  Experience hassle-free travel with our carefully planned packages.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="info-content padding-right-30px">
                <div className="info-list">
                  <ul className="list-items">
                    <li><i className="la la-check"></i>Best Price Guarantee</li>
                    <li><i className="la la-check"></i>Handpicked Destinations</li>
                    <li><i className="la la-check"></i>Expert Local Guides</li>
                    <li><i className="la la-check"></i>24/7 Customer Support</li>
                    <li><i className="la la-check"></i>Flexible Booking Options</li>
                    <li><i className="la la-check"></i>Authentic Cultural Experiences</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="info-content">
                <p className="info__desc margin-bottom-20px">
                  Our vacation packages are designed by travel experts who understand what makes 
                  a trip truly memorable. From cultural immersion to adventure activities, 
                  we ensure every detail is taken care of.
                </p>
                <p className="info__desc margin-bottom-30px">
                  Whether you're looking for a romantic getaway, family adventure, or solo exploration, 
                  our packages cater to all travel styles and budgets.
                </p>
                <div className="btn-box">
                  <a href="/contact" className="theme-btn">
                    Plan Custom Package
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-area subscriber-area section-bg-2 padding-top-100px padding-bottom-100px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading">
                <h2 className="sec__title text-white mb-3">Ready for Your Next Adventure?</h2>
                <p className="sec__desc text-white">
                  Browse our vacation packages and start planning your dream holiday today. 
                  Our travel experts are here to help you every step of the way.
                </p>
              </div>
              <div className="btn-box margin-top-40px">
                <a href="/contact" className="theme-btn border-0 me-3">
                  Contact Travel Expert
                </a>
                <a href="#" className="theme-btn theme-btn-white" onClick={() => setActiveTab('popular')}>
                  View All Packages
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
        .package-search-form {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .package-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .package-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        
        .discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #e53e3e;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: 600;
          font-size: 12px;
        }
        
        .duration-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
        }
        
        .rating-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .rating-count {
          margin-left: 10px;
          color: #718096;
          font-size: 14px;
        }
        
        .package-includes {
          margin: 20px 0;
          padding: 15px;
          background: #f7fafc;
          border-radius: 8px;
        }
        
        .includes-title {
          font-weight: 600;
          margin-bottom: 10px;
          color: #2d3748;
        }
        
        .includes-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .includes-item {
          font-size: 12px;
          color: #4a5568;
          background: white;
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .includes-item i {
          color: #38a169;
          margin-right: 4px;
        }
        
        .price-old {
          text-decoration: line-through;
          color: #a0aec0;
          margin-right: 10px;
        }
        
        .nav-link {
          color: #4a5568;
          border: none;
          border-bottom: 3px solid transparent;
          background: none;
          padding: 15px 20px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .nav-link.active {
          color: #3182ce;
          border-bottom-color: #3182ce;
          background: none;
        }
        
        .nav-link:hover {
          color: #3182ce;
          background: none;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
