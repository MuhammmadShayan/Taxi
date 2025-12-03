'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function AdvertisingPage() {
  const { t } = useI18n();

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

  const advertisingOptions = [
    {
      icon: 'la la-bullseye',
      title: 'Sponsored Listings',
      description: 'Feature your vehicles at the top of search results and increase visibility to potential customers.',
      features: ['Priority placement in search results', 'Enhanced vehicle listings', 'Increased booking conversions'],
      startingPrice: '$299'
    },
    {
      icon: 'la la-star',
      title: 'Premium Agency Profile',
      description: 'Upgrade your agency profile with premium features and promotional highlights.',
      features: ['Verified agency badge', 'Featured agency showcase', 'Priority customer support'],
      startingPrice: '$199'
    },
    {
      icon: 'la la-chart-line',
      title: 'Performance Analytics',
      description: 'Access detailed analytics and insights to optimize your advertising campaigns.',
      features: ['Booking conversion tracking', 'Customer behavior insights', 'ROI performance reports'],
      startingPrice: '$149'
    }
  ];

  const benefits = [
    {
      icon: 'la la-users',
      title: 'Reach Thousands of Travelers',
      description: 'Connect with customers actively searching for car rentals across Morocco and internationally.'
    },
    {
      icon: 'la la-mobile',
      title: 'Multi-Platform Visibility',
      description: 'Your listings appear on our website, mobile app, and partner platforms for maximum exposure.'
    },
    {
      icon: 'la la-chart-bar',
      title: 'Real-Time Analytics',
      description: 'Track your advertising performance with detailed analytics and optimization recommendations.'
    },
    {
      icon: 'la la-handshake',
      title: 'Dedicated Support',
      description: 'Work with our advertising team to create effective campaigns and maximize your ROI.'
    }
  ];

  return (
    <>
      <Head>
        <title>Advertising & Marketing Solutions - Kirastay Business</title>
        <meta name="description" content="Promote your car rental business with Kirastay's advertising solutions. Reach thousands of travelers with sponsored listings, premium profiles, and targeted campaigns." />
        <meta name="keywords" content="car rental advertising, kirastay business, travel marketing, vehicle promotion, rental advertising" />
        <meta property="og:title" content="Advertising & Marketing Solutions - Kirastay Business" />
        <meta property="og:description" content="Promote your car rental business with Kirastay's advertising solutions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/advertising" />
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
                    <h2 className="sec__title text-white">Advertising Solutions</h2>
                    <p className="sec__desc text-white">Grow your rental business with targeted marketing</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Business</li>
                    <li>Advertising</li>
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

      {/* Advertising Solutions */}
      <section className="service-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Advertising Solutions</h2>
                <p className="sec__desc">
                  Maximize your reach and grow your car rental business with our comprehensive advertising solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {advertisingOptions.map((option, index) => (
              <div key={index} className="col-lg-4 responsive-column">
                <div className="card-item service-card">
                  <div className="card-img text-center">
                    <div className="service-icon">
                      <i className={option.icon}></i>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <h3 className="card-title">{option.title}</h3>
                    <p className="card-text">{option.description}</p>
                    
                    <div className="features-list">
                      <ul>
                        {option.features.map((feature, idx) => (
                          <li key={idx}>
                            <i className="la la-check text-success"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="price-box">
                      <p className="price-text">Starting from</p>
                      <h4 className="price">{option.startingPrice}<span>/month</span></h4>
                    </div>
                    
                    <div className="btn-box">
                      <a href="/contact?subject=Advertising Inquiry" className="theme-btn">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="info-area padding-top-100px padding-bottom-70px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Why Advertise with Kirastay?</h2>
                <p className="sec__desc">
                  Join hundreds of successful rental agencies already growing their business with us.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-lg-6 responsive-column">
                <div className="icon-box icon-layout-2">
                  <div className="info-icon">
                    <i className={benefit.icon}></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">{benefit.title}</h4>
                    <p className="info__desc">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="funfact-area padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Our Advertising Reach</h2>
                <p className="sec__desc">See the impact of advertising with Kirastay</p>
              </div>
            </div>
          </div>
          <div className="counter-box counter-box-2 margin-top-60px mb-0">
            <div className="row">
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-eye"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">1.2M</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Monthly Page Views</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-users"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">450K</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Active Users</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-search"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">85K</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Monthly Searches</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-calendar-check"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter">12K</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Monthly Bookings</p>
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
                <h2 className="sec__title mb-3 text-white">Ready to Boost Your Business?</h2>
                <p className="sec__desc text-white">
                  Start advertising with Kirastay today and watch your bookings grow. 
                  Our team is ready to help you create the perfect campaign.
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <a href="/contact?subject=Advertising Partnership" className="theme-btn border-0 me-3">
                  Get Started Today
                </a>
                <a href="/contact?subject=Advertising Information" className="theme-btn theme-btn-white">
                  Request Information
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
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .service-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3182ce, #2c5aa0);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          font-size: 30px;
        }
        
        .card-title {
          color: #2d3748;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .card-text {
          color: #4a5568;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        
        .features-list {
          margin-bottom: 30px;
        }
        
        .features-list ul {
          list-style: none;
          padding: 0;
          text-align: left;
        }
        
        .features-list li {
          padding: 8px 0;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .features-list li i {
          font-size: 16px;
        }
        
        .price-box {
          background: #f7fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .price-text {
          color: #718096;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .price {
          color: #3182ce;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        
        .price span {
          font-size: 16px;
          color: #718096;
          font-weight: 400;
        }
        
        .icon-layout-2 {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .icon-layout-2 .info-icon {
          width: 60px;
          height: 60px;
          background: #3182ce;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .icon-layout-2 .info-content {
          flex: 1;
        }
        
        .icon-layout-2 .info__title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .icon-layout-2 .info__desc {
          color: #4a5568;
          line-height: 1.6;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
