'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function About() {
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
      {/* Preloader */}
      <div className="preloader" id="preloader">
        <div className="loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            ></circle>
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="header-area">
        <div className="header-top-bar padding-right-100px padding-left-100px">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="header-top-content">
                  <div className="header-left">
                    <ul className="list-items">
                      <li>
                        <Link href="#"><i className="la la-phone me-1"></i>(123) 123-456</Link>
                      </li>
                      <li>
                        <Link href="#"><i className="la la-envelope me-1"></i>trizen@example.com</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="header-top-content">
                  <div className="header-right d-flex align-items-center justify-content-end">
                    <div className="header-right-action">
                      <div className="select-contain select--contain w-auto">
                        <select className="select-contain-select">
                          <option data-content='<span className="flag-icon flag-icon-id me-1"></span> Bahasa Indonesia'>
                            Bahasa Indonesia
                          </option>
                          <option data-content='<span className="flag-icon flag-icon-de me-1"></span> Deutsch'>
                            Deutsch
                          </option>
                          <option data-content='<span className="flag-icon flag-icon-us me-1"></span> English(US)' defaultValue>
                            English US
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="header-right-action">
                      <div className="select-contain select--contain w-auto">
                        <select className="select-contain-select">
                          <option value="24" defaultValue>USD</option>
                          <option value="7">EUR</option>
                          <option value="8">GBP</option>
                        </select>
                      </div>
                    </div>
                    <div className="header-right-action">
                      <Link
                        href="/become-local-expert"
                        className="theme-btn theme-btn-small"
                      >
                        Become Local Expert
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-menu-wrapper padding-right-100px padding-left-100px">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="menu-wrapper">
                  <Link href="#" className="down-button">
                    <i className="la la-angle-down"></i>
                  </Link>
                  <div className="logo">
                    <Link href="/">
                      <img src="/html-folder/images/logo.png" alt="logo" />
                    </Link>
                    <div className="menu-toggler">
                      <i className="la la-bars"></i>
                      <i className="la la-times"></i>
                    </div>
                  </div>
                  <div className="main-menu-content ms-auto">
                    <nav>
                      <ul>
                        <li>
                          <Link href="/">Home</Link>
                        </li>
                        <li>
                          <Link href="/services">Services</Link>
                        </li>
                        <li>
                          <Link href="/about">About</Link>
                        </li>
                        <li>
                          <Link href="/contact">Contact</Link>
                        </li>
                        <li>
                          <Link href="/become-local-expert">Become Local Expert</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="nav-btn">
                    <Link
                      href="/become-local-expert"
                      className="theme-btn theme-btn-small theme-btn-transparent me-1"
                    >
                      Become Local Expert
                    </Link>
                    <Link
                      href="#"
                      className="theme-btn theme-btn-small"
                      data-bs-toggle="modal"
                      data-bs-target="#loginPopupForm"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-9">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title line-height-50 text-white">
                      Kirastay.com is Your Trusted <br />
                      Travel Companion.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bread-svg-box">
          <svg
            className="bread-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <polygon points="100 0 50 10 0 0 0 10 100 10"></polygon>
          </svg>
        </div>
      </section>

      {/* Info Area */}
      <section className="info-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 responsive-column">
              <div className="card-item">
                <div className="card-img">
                  <img src="/html-folder/images/img21.jpg" alt="about-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title mb-2">Who We Are?</h3>
                  <p className="card-text">
                    We are a leading car booking platform dedicated to providing seamless rental experiences worldwide.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item">
                <div className="card-img">
                  <img src="/html-folder/images/img22.jpg" alt="about-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title mb-2">What We Do?</h3>
                  <p className="card-text">
                    We connect travelers with trusted car rental partners, offering competitive rates and exceptional service.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item">
                <div className="card-img">
                  <img src="/html-folder/images/img23.jpg" alt="about-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title mb-2">Our Mission</h3>
                  <p className="card-text">
                    Our mission is to make car rentals accessible, affordable, and reliable for every traveler worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Area */}
      <section className="about-area padding-bottom-90px overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading margin-bottom-40px">
                <h2 className="sec__title">About Us</h2>
                <h4 className="title font-size-16 line-height-26 pt-4 pb-2">
                  Since 2002, TRIZEN has been revolutionising the travel industry.
                  Metasearch for travel? No one was doing it. Until we did.
                </h4>
                <p className="sec__desc font-size-16 pb-3">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using &apos;Content
                  here, content here&apos;, making it look like readable English.
                </p>
                <p className="sec__desc font-size-16 pb-3">
                  Many desktop publishing packages and web page editors now use
                  Lorem Ipsum as their default model text, and a search for &apos;lorem
                  ipsum&apos; will uncover many web sites still in their infancy.
                </p>
                <p className="sec__desc font-size-16">
                  Vivamus a mauris vel nunc tristique volutpat. Aenean eu faucibus
                  enim. Aenean blandit arcu lectus, in cursus elit porttitor non.
                  Curabitur risus eros,
                </p>
              </div>
            </div>
            <div className="col-lg-5 ms-auto">
              <div className="image-box about-img-box">
                <img
                  src="/html-folder/images/img24.jpg"
                  alt="about-img"
                  className="img__item img__item-1"
                />
                <img
                  src="/html-folder/images/img25.jpg"
                  alt="about-img"
                  className="img__item img__item-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funfact Area */}
      <section className="funfact-area padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Our Numbers Say Everything</h2>
              </div>
            </div>
          </div>
          <div className="counter-box counter-box-2 margin-top-60px mb-0">
            <div className="row">
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-users"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span
                        className="counter"
                        data-from="0"
                        data-to="200"
                        data-refresh-interval="5"
                      >0</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Partners</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-building"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span
                        className="counter"
                        data-from="0"
                        data-to="3"
                        data-refresh-interval="5"
                      >0</span>
                      <span className="count-symbol">k</span>
                    </div>
                    <p className="counter__title">Properties</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-globe"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span
                        className="counter"
                        data-from="0"
                        data-to="400"
                        data-refresh-interval="5"
                      >0</span>
                      <span className="count-symbol">+</span>
                    </div>
                    <p className="counter__title">Destinations</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-2 d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-check-circle"></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span
                        className="counter"
                        data-from="0"
                        data-to="40"
                        data-refresh-interval="5"
                      >0</span>
                      <span className="count-symbol">k</span>
                    </div>
                    <p className="counter__title">Booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Area */}
      <section className="testimonial-area section-bg section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="section-heading">
                <h2 className="sec__title line-height-50">
                  What our customers are saying us?
                </h2>
                <p className="sec__desc padding-top-30px">
                  Morbi convallis bibendum urna ut viverra. Maecenas quis
                  consequat libero
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="testimonial-carousel carousel-action">
                <div className="testimonial-card">
                  <div className="testi-desc-box">
                    <p className="testi__desc">
                      Excepteur sint occaecat cupidatat non proident sunt in culpa
                      officia deserunt mollit anim laborum sint occaecat cupidatat
                      non proident. Occaecat cupidatat non proident des.
                    </p>
                  </div>
                  <div className="author-content d-flex align-items-center">
                    <div className="author-img">
                      <img src="/html-folder/images/team8.jpg" alt="testimonial image" />
                    </div>
                    <div className="author-bio">
                      <h4 className="author__title">Leroy Bell</h4>
                      <span className="author__meta">United States</span>
                      <span className="ratings d-flex align-items-center">
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="testi-desc-box">
                    <p className="testi__desc">
                      Excepteur sint occaecat cupidatat non proident sunt in culpa
                      officia deserunt mollit anim laborum sint occaecat cupidatat
                      non proident. Occaecat cupidatat non proident des.
                    </p>
                  </div>
                  <div className="author-content d-flex align-items-center">
                    <div className="author-img">
                      <img src="/html-folder/images/team9.jpg" alt="testimonial image" />
                    </div>
                    <div className="author-bio">
                      <h4 className="author__title">Richard Pam</h4>
                      <span className="author__meta">Canada</span>
                      <span className="ratings d-flex align-items-center">
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="testi-desc-box">
                    <p className="testi__desc">
                      Excepteur sint occaecat cupidatat non proident sunt in culpa
                      officia deserunt mollit anim laborum sint occaecat cupidatat
                      non proident. Occaecat cupidatat non proident des.
                    </p>
                  </div>
                  <div className="author-content d-flex align-items-center">
                    <div className="author-img">
                      <img src="/html-folder/images/team10.jpg" alt="testimonial image" />
                    </div>
                    <div className="author-bio">
                      <h4 className="author__title">Luke Jacobs</h4>
                      <span className="author__meta">Australia</span>
                      <span className="ratings d-flex align-items-center">
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <div className="testi-desc-box">
                    <p className="testi__desc">
                      Excepteur sint occaecat cupidatat non proident sunt in culpa
                      officia deserunt mollit anim laborum sint occaecat cupidatat
                      non proident. Occaecat cupidatat non proident des.
                    </p>
                  </div>
                  <div className="author-content d-flex align-items-center">
                    <div className="author-img">
                      <img src="/html-folder/images/team8.jpg" alt="testimonial image" />
                    </div>
                    <div className="author-bio">
                      <h4 className="author__title">Chulbul Panday</h4>
                      <span className="author__meta">Italy</span>
                      <span className="ratings d-flex align-items-center">
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                        <i className="la la-star"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Area */}
      <section className="info-area padding-top-100px padding-bottom-60px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title">Our Dedicated Team</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-100px">
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team1.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">David Roberts</h3>
                  <p className="card-meta">Founder & Director</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team2.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">Augusta Silva</h3>
                  <p className="card-meta">Chief Operating Officer</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team3.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">Bernice Lucas</h3>
                  <p className="card-meta">Account Manager</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team4.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">David Jackson</h3>
                  <p className="card-meta">Sales Support</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team5.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">Kyle Martin</h3>
                  <p className="card-meta">Order Manager</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item team-card">
                <div className="card-img">
                  <img src="/html-folder/images/team6.jpg" alt="team-img" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">Evan Porter</h3>
                  <p className="card-meta">Head of Design</p>
                  <p className="card-text font-size-15 pt-2">
                    Ligula vehicula enenatis semper, magna lorem aliquet lacusin
                    ante dapibus dictum fugats vitaes nemo minima.
                  </p>
                  <ul className="social-profile padding-top-20px pb-2">
                    <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                    <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                    <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                    <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Area */}
      <section className="cta-area cta-bg-2 bg-fixed section-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2 className="sec__title mb-3 text-white">
                  Interested in a career <br />
                  at Kirastay.
                </h2>
                <p className="sec__desc text-white">
                  We&apos;re always looking for talented individuals and <br />
                  people who are hungry to do great work.
                </p>
              </div>
              <div className="btn-box padding-top-35px">
                <Link href="#" className="theme-btn border-0">Join Our Team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-area section-bg padding-top-100px padding-bottom-30px">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <div className="footer-logo padding-bottom-30px">
                  <Link href="/" className="foot__logo">
                    <img src="/html-folder/images/logo.png" alt="logo" />
                  </Link>
                </div>
                <p className="footer__desc">
                  Morbi convallis bibendum urna ut viverra. Maecenas consequat
                </p>
                <ul className="list-items pt-3">
                  <li>
                    3015 Grand Ave, Coconut Grove,<br />
                    Cerrick Way, FL 12345
                  </li>
                  <li>+123-456-789</li>
                  <li><Link href="#">trizen@yourwebsite.com</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4
                  className="title curve-shape pb-3 margin-bottom-20px"
                  data-text="curvs"
                >
                  Company
                </h4>
                <ul className="list-items list--items">
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="#">Jobs</Link></li>
                  <li><Link href="/blog-grid">News</Link></li>
                  <li><Link href="/contact">Support</Link></li>
                  <li><Link href="#">Advertising</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4
                  className="title curve-shape pb-3 margin-bottom-20px"
                  data-text="curvs"
                >
                  Other Links
                </h4>
                <ul className="list-items list--items">
                  <li><Link href="#">USA Vacation Packages</Link></li>
                  <li><Link href="#">USA Flights</Link></li>
                  <li><Link href="#">USA Hotels</Link></li>
                  <li><Link href="#">USA Car Hire</Link></li>
                  <li><Link href="#">Create an Account</Link></li>
                  <li><Link href="#">Kirastay Reviews</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4
                  className="title curve-shape pb-3 margin-bottom-20px"
                  data-text="curvs"
                >
                  Subscribe now
                </h4>
                <p className="footer__desc pb-3">
                  Subscribe for latest updates & promotions
                </p>
                <div className="contact-form-action">
                  <form action="#">
                    <div className="input-box">
                      <label className="label-text">Enter email address</label>
                      <div className="form-group mb-0">
                        <span className="la la-envelope form-icon"></span>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Email address"
                        />
                        <button
                          className="theme-btn theme-btn-small submit-btn"
                          type="submit"
                        >
                          Go
                        </button>
                        <span className="font-size-14 pt-1">
                          <i className="la la-lock me-1"></i>Your information is safe
                          with us.
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="term-box footer-item">
                <ul className="list-items list--items d-flex align-items-center">
                  <li><Link href="#">Terms & Conditions</Link></li>
                  <li><Link href="#">Privacy Policy</Link></li>
                  <li><Link href="#">Help Center</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="footer-social-box text-end">
                <ul className="social-profile">
                  <li><Link href="#"><i className="lab la-facebook-f"></i></Link></li>
                  <li><Link href="#"><i className="lab la-twitter"></i></Link></li>
                  <li><Link href="#"><i className="lab la-instagram"></i></Link></li>
                  <li><Link href="#"><i className="lab la-linkedin-in"></i></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block mt-4"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="copy-right padding-top-30px">
                <p className="copy__desc">
                  &copy; Copyright Kirastay <span id="get-year"></span> . Made with
                  <span className="la la-heart"></span> by
                  <Link href="https://themeforest.net/user/techydevs/portfolio">
                    TechyDevs
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="copy-right-content d-flex align-items-center justify-content-end padding-top-30px">
                <h3 className="title font-size-15 pe-2">We Accept</h3>
                <img src="/html-folder/images/payment-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>

      {/* Modals */}
      <div className="modal-popup">
        <div
          className="modal fade"
          id="signupPopupForm"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title title" id="exampleModalLongTitle">
                    Sign Up
                  </h5>
                  <p className="font-size-14">Hello! Welcome Create a New Account</p>
                </div>
                <button
                  type="button"
                  className="btn-close close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" className="la la-close"></span>
                </button>
              </div>
              <div className="modal-body">
                <div className="contact-form-action">
                  <form method="post">
                    <div className="input-box">
                      <label className="label-text">Username</label>
                      <div className="form-group">
                        <span className="la la-user form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type your username"
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <label className="label-text">Email Address</label>
                      <div className="form-group">
                        <span className="la la-envelope form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type your email"
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <label className="label-text">Password</label>
                      <div className="form-group">
                        <span className="la la-lock form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type password"
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <label className="label-text">Repeat Password</label>
                      <div className="form-group">
                        <span className="la la-lock form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type again password"
                        />
                      </div>
                    </div>
                    <div className="btn-box pt-3 pb-4">
                      <button type="button" className="theme-btn w-100">
                        Register Account
                      </button>
                    </div>
                    <div className="action-box text-center">
                      <p className="font-size-14">Or Sign up Using</p>
                      <ul className="social-profile py-3">
                        <li>
                          <Link href="#" className="bg-5 text-white">
                            <i className="lab la-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-6 text-white">
                            <i className="lab la-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-7 text-white">
                            <i className="lab la-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-5 text-white">
                            <i className="lab la-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-popup">
        <div
          className="modal fade"
          id="loginPopupForm"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title title" id="exampleModalLongTitle2">
                    Login
                  </h5>
                  <p className="font-size-14">Hello! Welcome to your account</p>
                </div>
                <button
                  type="button"
                  className="btn-close close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" className="la la-close"></span>
                </button>
              </div>
              <div className="modal-body">
                <div className="contact-form-action">
                  <form method="post">
                    <div className="input-box">
                      <label className="label-text">Username</label>
                      <div className="form-group">
                        <span className="la la-user form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type your username"
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <label className="label-text">Password</label>
                      <div className="form-group mb-2">
                        <span className="la la-lock form-icon"></span>
                        <input
                          className="form-control"
                          type="text"
                          name="text"
                          placeholder="Type your password"
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="custom-checkbox mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberchb"
                          />
                          <label htmlFor="rememberchb">Remember me</label>
                        </div>
                        <p className="forgot-password">
                          <Link href="/recover">Forgot Password?</Link>
                        </p>
                      </div>
                    </div>
                    <div className="btn-box pt-3 pb-4">
                      <button type="button" className="theme-btn w-100">
                        Login Account
                      </button>
                    </div>
                    <div className="action-box text-center">
                      <p className="font-size-14">Or Login Using</p>
                      <ul className="social-profile py-3">
                        <li>
                          <Link href="#" className="bg-5 text-white">
                            <i className="lab la-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-6 text-white">
                            <i className="lab la-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-7 text-white">
                            <i className="lab la-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="bg-5 text-white">
                            <i className="lab la-linkedin-in"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
