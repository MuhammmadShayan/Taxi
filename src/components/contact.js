'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Contact() {
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
      '/html-folder/js/leaflet.js',
      '/html-folder/js/map.js',
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
                        <Link href="#"><i className="la la-envelope me-1"></i>support@kirastay.com</Link>
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
      <section className="breadcrumb-area bread-bg-5">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Contact us</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/">Home</Link></li>
                    <li>Pages</li>
                    <li>Contact us</li>
                  </ul>
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

      {/* Contact Area */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">We&apos;d love to hear from you</h3>
                  <p className="font-size-15">
                    Send us a message, and we&apos;ll respond as soon as possible
                  </p>
                </div>
                <div className="form-content">
                  <div className="contact-form-action">
                    <div
                      id="contact-success-message"
                      className="alert alert-success"
                      role="alert"
                    >
                      Thank You! Your message has been sent.
                    </div>
                    <form
                      id="contact-form"
                      method="post"
                      action="#"
                      className="row"
                    >
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Your Name</label>
                          <div className="form-group">
                            <span className="la la-user form-icon"></span>
                            <input
                              className="form-control"
                              type="text"
                              name="name"
                              placeholder="Your name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 responsive-column">
                        <div className="input-box">
                          <label className="label-text">Your Email</label>
                          <div className="form-group">
                            <span className="la la-envelope-o form-icon"></span>
                            <input
                              className="form-control"
                              type="email"
                              name="email"
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-box">
                          <label className="label-text">Message</label>
                          <div className="form-group">
                            <span className="la la-pencil form-icon"></span>
                            <textarea
                              className="message-control form-control"
                              name="message"
                              placeholder="Write message"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="btn-box">
                          <button
                            id="send-message-btn"
                            type="submit"
                            className="theme-btn"
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">Contact Us</h3>
                </div>
                <div className="form-content">
                  <div className="address-book">
                    <ul className="list-items contact-address">
                      <li>
                        <i className="la la-map-marker icon-element"></i>
                        <h5 className="title font-size-16 pb-1">Address</h5>
                        <p className="map__desc">
                          Melbourne, Australia, 105 South Park Avenue
                        </p>
                      </li>
                      <li>
                        <i className="la la-phone icon-element"></i>
                        <h5 className="title font-size-16 pb-1">Phone</h5>
                        <p className="map__desc">Telephone: 2800 256 508</p>
                        <p className="map__desc">Mobile: 666 777 888</p>
                      </li>
                      <li>
                        <i className="la la-envelope-o icon-element"></i>
                        <h5 className="title font-size-16 pb-1">Email</h5>
                        <p className="map__desc">needhelp@trizen.com</p>
                        <p className="map__desc">inquiry@trizen.com</p>
                      </li>
                    </ul>
                    <ul className="social-profile text-center">
                      <li>
                        <Link href="#"><i className="lab la-facebook-f"></i></Link>
                      </li>
                      <li>
                        <Link href="#"><i className="lab la-twitter"></i></Link>
                      </li>
                      <li>
                        <Link href="#"><i className="lab la-instagram"></i></Link>
                      </li>
                      <li>
                        <Link href="#"><i className="lab la-linkedin-in"></i></Link>
                      </li>
                      <li>
                        <Link href="#"><i className="lab la-youtube"></i></Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Area */}
      <section className="map-area padding-bottom-100px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="map-container">
                <div id="map"></div>
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
                  Other Services
                </h4>
                <ul className="list-items list--items">
                  <li><Link href="#">Investor Relations</Link></li>
                  <li><Link href="#">Kirastay.com Rewards</Link></li>
                  <li><Link href="#">Partners</Link></li>
                  <li><Link href="#">List My Hotel</Link></li>
                  <li><Link href="#">All Hotels</Link></li>
                  <li><Link href="#">TV Ads</Link></li>
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
