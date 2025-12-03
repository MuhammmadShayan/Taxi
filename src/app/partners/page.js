'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function PartnersPage() {
  const { t } = useI18n();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockPartners = [
    {
      id: 1,
      name: 'Morocco Car Rental',
      type: 'Car Rental Agency',
      location: 'Casablanca, Morocco',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
      description: 'Leading car rental agency in Casablanca with over 15 years of experience.',
      vehicles: 150,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Atlas Rent',
      type: 'Car Rental Agency',
      location: 'Marrakech, Morocco',
      logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=300&fit=crop&crop=center',
      description: 'Specialized in luxury and 4x4 vehicle rentals for desert adventures.',
      vehicles: 85,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Coastal Rentals',
      type: 'Car Rental Agency',
      location: 'Agadir, Morocco',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop&crop=center',
      description: 'Premium vehicle rental services along Morocco\'s Atlantic coast.',
      vehicles: 120,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Royal Car Services',
      type: 'Car Rental Agency',
      location: 'Rabat, Morocco',
      logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop&crop=center',
      description: 'High-end car rental services for business and leisure travelers.',
      vehicles: 95,
      rating: 4.8
    }
  ];

  const partnershipTypes = [
    {
      icon: 'la la-car',
      title: 'Car Rental Agencies',
      description: 'Join our network of trusted car rental partners and expand your customer reach.',
      benefits: ['Access to our customer base', 'Marketing support', 'Booking management tools', 'Competitive commission rates'],
      cta: 'Become a Rental Partner'
    },
    {
      icon: 'la la-plane',
      title: 'Travel Companies',
      description: 'Partner with us to offer comprehensive travel packages to your customers.',
      benefits: ['Integrated booking system', 'Revenue sharing opportunities', 'Co-marketing initiatives', 'API integration support'],
      cta: 'Partner with Us'
    },
    {
      icon: 'la la-building',
      title: 'Technology Partners',
      description: 'Collaborate on innovative solutions to enhance the travel booking experience.',
      benefits: ['Technical collaboration', 'Innovation opportunities', 'Market expansion', 'Joint product development'],
      cta: 'Explore Partnership'
    },
    {
      icon: 'la la-handshake',
      title: 'Affiliate Partners',
      description: 'Promote our services and earn commissions on successful bookings.',
      benefits: ['Competitive commission rates', 'Marketing materials', 'Real-time tracking', 'Monthly payouts'],
      cta: 'Join Affiliate Program'
    }
  ];

  useEffect(() => {
    // Simulate loading partners
    const timer = setTimeout(() => {
      setPartners(mockPartners);
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

  return (
    <>
      <Head>
        <title>Partners - Business Partnerships | Kirastay</title>
        <meta name="description" content="Explore partnership opportunities with Kirastay. Join our network of car rental agencies, travel companies, and technology partners. Grow your business with us." />
        <meta name="keywords" content="kirastay partners, car rental partnerships, travel partnerships, business collaboration, affiliate program" />
        <meta property="og:title" content="Partners - Business Partnerships | Kirastay" />
        <meta property="og:description" content="Explore partnership opportunities with Kirastay. Join our network of trusted partners and grow your business." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/partners" />
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
                    <h2 className="sec__title text-white">Our Partners</h2>
                    <p className="sec__desc text-white">Building successful partnerships in travel</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Business</li>
                    <li>Partners</li>
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

      {/* Partnership Types */}
      <section className="service-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Partnership Opportunities</h2>
                <p className="sec__desc">
                  Join our growing network of partners and unlock new opportunities for your business.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="col-lg-6 responsive-column">
                <div className="partnership-card">
                  <div className="partnership-header">
                    <div className="partnership-icon">
                      <i className={type.icon}></i>
                    </div>
                    <h3 className="partnership-title">{type.title}</h3>
                  </div>
                  <div className="partnership-body">
                    <p className="partnership-desc">{type.description}</p>
                    <ul className="partnership-benefits">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx}>
                          <i className="la la-check"></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="partnership-cta">
                      <a href={`/contact?subject=${type.cta}`} className="theme-btn">
                        {type.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Our Trusted Partners</h2>
                <p className="sec__desc">
                  Meet the agencies and companies that make Kirastay the leading car rental platform in Morocco.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading partners...</p>
            </div>
          ) : (
            <div className="row">
              {partners.map((partner) => (
                <div key={partner.id} className="col-lg-6 responsive-column">
                  <div className="partner-card">
                    <div className="partner-logo">
                      <img src={partner.logo || '/html-folder/images/img21.jpg'} alt={partner.name} />
                    </div>
                    <div className="partner-info">
                      <h4 className="partner-name">{partner.name}</h4>
                      <p className="partner-type">{partner.type}</p>
                      <p className="partner-location">
                        <i className="la la-map-marker"></i>
                        {partner.location}
                      </p>
                      <p className="partner-desc">{partner.description}</p>
                      <div className="partner-stats">
                        <div className="stat-item">
                          <span className="stat-number">{partner.vehicles}</span>
                          <span className="stat-label">Vehicles</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{partner.rating}</span>
                          <span className="stat-label">Rating</span>
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

      {/* Partnership Statistics */}
      <section className="funfact-area padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Partnership Impact</h2>
                <p className="sec__desc">See the success our partners achieve with Kirastay</p>
              </div>
            </div>
          </div>
          <div className="counter-box counter-box-2 margin-top-60px mb-0">
            <div className="row">
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-handshake"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">150</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Active Partners</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-car"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">2.5K</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Partner Vehicles</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-map-marker"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">25</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Cities Covered</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-dollar"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">98</span>
                      <span className="count-symbol">%</span>
                    </div>
                    <p className="counter__title">Partner Satisfaction</p>
                  </div>
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
                <h2 className="sec__title mb-3 text-white">Ready to Partner with Kirastay?</h2>
                <p className="sec__desc text-white">
                  Join our successful partner network and grow your business with Morocco's leading car rental platform. 
                  Let's build something great together.
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/agency/register" className="theme-btn border-0 me-3">
                  Become a Partner
                </a>
                <a href="/contact?subject=Partnership Inquiry" className="theme-btn theme-btn-white">
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
        .partnership-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
          background: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .partnership-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .partnership-header {
          background: linear-gradient(135deg, #3182ce, #2c5aa0);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .partnership-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }
        
        .partnership-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
        }
        
        .partnership-body {
          padding: 30px;
        }
        
        .partnership-desc {
          color: #4a5568;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        
        .partnership-benefits {
          list-style: none;
          padding: 0;
          margin-bottom: 30px;
        }
        
        .partnership-benefits li {
          padding: 8px 0;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .partnership-benefits i {
          color: #38a169;
          font-weight: 600;
        }
        
        .partnership-cta {
          text-align: center;
        }
        
        .partner-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 30px;
          background: white;
          transition: box-shadow 0.3s ease;
        }
        
        .partner-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .partner-logo {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }
        
        .partner-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .partner-info {
          flex: 1;
        }
        
        .partner-name {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .partner-type {
          color: #3182ce;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .partner-location {
          color: #718096;
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .partner-desc {
          color: #4a5568;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .partner-stats {
          display: flex;
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          color: #3182ce;
          font-size: 18px;
          font-weight: 600;
        }
        
        .stat-label {
          color: #718096;
          font-size: 12px;
        }
        
        .section-bg {
          background: #f7fafc;
        }
        
        @media (max-width: 768px) {
          .partner-card {
            flex-direction: column;
            text-align: center;
          }
          
          .partner-logo {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
}
