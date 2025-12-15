'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';
import SubscribeForm from '../../components/SubscribeForm';

export default function ServicesPage() {
  const { t } = useI18n();

  const services = [
    {
      icon: 'la la-plane',
      title: 'Flight Deals',
      description: 'Discover amazing flight deals with competitive prices and excellent customer service for your perfect journey.',
      rating: '4.8',
      reviews: '2.7k',
      price: '$99.00'
    },
    {
      icon: 'la la-bed',
      title: 'Hotel Booking',
      description: 'Book comfortable accommodations worldwide with instant confirmation and best price guarantees.',
      rating: '4.9',
      reviews: '3.2k',
      price: '$149.00'
    },
    {
      icon: 'la la-car',
      title: 'Car Rental',
      description: 'Premium car rental services with a wide selection of vehicles, transparent pricing, and 24/7 support.',
      rating: '4.7',
      reviews: '1.8k',
      price: '$79.00'
    },
    {
      icon: 'la la-ship',
      title: 'Cruise Booking',
      description: 'Experience unforgettable cruise vacations with luxury amenities and exceptional onboard services.',
      rating: '4.8',
      reviews: '2.1k',
      price: '$299.00'
    },
    {
      icon: 'la la-train',
      title: 'Train Booking',
      description: 'Convenient train travel bookings with flexible schedules and comfortable seating options nationwide.',
      rating: '4.6',
      reviews: '1.5k',
      price: '$59.00'
    },
    {
      icon: 'la la-map-marker',
      title: 'Tour Packages',
      description: 'Expertly curated tour packages featuring unique destinations and memorable travel experiences.',
      rating: '4.9',
      reviews: '3.8k',
      price: '$199.00'
    },
    {
      icon: 'la la-calendar',
      title: 'Event Planning',
      description: 'Professional event planning services for business meetings, conferences, and special occasions.',
      rating: '4.7',
      reviews: '2.3k',
      price: '$129.00'
    },
    {
      icon: 'la la-umbrella',
      title: 'Travel Insurance',
      description: 'Comprehensive travel protection with worldwide coverage and emergency assistance services.',
      rating: '4.8',
      reviews: '1.9k',
      price: '$39.00'
    }
  ];

  return (
    <>
      <Head>
        <title>{t('services.title')}</title>
<meta name="description" content={t('services.meta_desc')} />
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
                    <h2 className="sec__title text-white">{t('services.breadcrumb_title')}</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">{t('services.breadcrumb_home')}</a></li>
                    <li>{t('services.breadcrumb_pages')}</li>
                    <li>{t('services.breadcrumb_title')}</li>
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

      {/* Service Area */}
      <section className="service-area section--padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">{t('services.section_title')}</h2>
              </div>
            </div>
          </div>
          
          <div className="row padding-top-80px">
            {services.map((service, index) => (
              <div key={index} className="col-lg-3 responsive-column">
                <div className="icon-box icon-layout-4">
                  <div className="info-icon">
                    <i className={service.icon}></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">
                      <a href="#">{service.title}</a>
                    </h4>
                    <p className="info__desc">
                      {service.description}
                    </p>
                    <div className="rating-wrap d-flex align-items-center justify-content-center">
                      <div className="review-stars">
                        <span className="rating-number">{service.rating}</span>
                        <span className="la la-star"></span>
                        <span className="la la-star"></span>
                        <span className="la la-star"></span>
                        <span className="la la-star"></span>
                        <span className="la la-star"></span>
                      </div>
                      <span className="rating-count">({service.reviews})</span>
                    </div>
                    <div className="card-price text-center">
                      <p>
                        {t('services.starting_from')}
                        <span className="price__from">{service.price}</span>
                      </p>
                    </div>
                    <div className="btn-box text-center">
                      <a href="#" className="theme-btn">{t('services.book_now')}</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-area subscriber-area section-bg-2 padding-top-60px padding-bottom-60px">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="section-heading">
                <h2 className="sec__title font-size-30 text-white">
                  {t('services.subscribe_title')}
                </h2>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="subscriber-box">
                <div className="contact-form-action">
<SubscribeForm
                    label={t('services.email_label')}
                    placeholder={t('services.email_placeholder')}
                    buttonText={t('services.subscribe_button')}
                    disclaimer={t('services.no_spam')}
                    className="contact-form-style-2"
                  />
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

      {/* Scripts */}
      <Script src="/html-folder/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/jquery-ui.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/select2.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/moment.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/daterangepicker.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/owl.carousel.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/jquery.fancybox.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/jquery.countTo.min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/animated-headline.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/jquery.ripples-min.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/quantity-input.js" strategy="afterInteractive" />
      <Script src="/html-folder/js/main.js" strategy="afterInteractive" />
    </>
  );
}
