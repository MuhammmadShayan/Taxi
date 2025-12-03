'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Index() {
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
                    <ul className="list-items pt-1">
                      <li>
                        <Link href="#">
                          <i className="la la-phone me-1"></i>(123) 123-456
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <i className="la la-envelope me-1"></i>support@kirastay.com
                        </Link>
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
                          <option data-content='<span className="flag-icon flag-icon-us me-1"></span> English(US)' defaultValue>
                            English US
                          </option>
                          <option data-content='<span className="flag-icon flag-icon-de me-1"></span> Deutsch'>
                            Deutsch
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

      {/* Hero Section - Car Focused */}
      <section className="hero-wrapper hero-wrapper4">
        <div className="hero-box hero-bg-4">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="hero-content mt-0">
                  <div className="section-heading">
                    <h2 className="sec__title">
                      Find the Best Car that <br />
                      Fits Your Needs
                    </h2>
                    <p className="sec__desc pt-3 font-size-18">
                      Book with confidence and enjoy competitive prices on premium car rentals worldwide.
                    </p>
                  </div>
                </div>
                <div className="hero-list-box margin-top-40px">
                  <ul className="list-items">
                    <li className="d-flex align-items-center">
                      <svg viewBox="-73 0 512 512.15596" xmlns="http://www.w3.org/2000/svg">
                        <path d="m1.78125 232.433594c-3.957031 10.554687-.867188 22.460937 7.730469 29.753906 16.289062 16.300781 49.789062 75.144531 66.371093 116.609375 11.316407 28.28125 36.164063 56.039063 55.015626 74.351563 8.113281 7.984374 12.667968 18.898437 12.644531 30.285156v3.121094c0 14.140624 11.460937 25.601562 25.601562 25.601562h136.53125c14.140625 0 25.601563-11.460938 25.601563-25.601562v-26.214844c-.078125-2.167969.746094-4.273438 2.277344-5.808594 31.496093-28.800781 31.855468-76.878906 31.855468-78.910156v-135.089844c.316406-18.273438-13.460937-33.722656-31.648437-35.488281-6.835938-.449219-13.648438 1.171875-19.550781 4.648437v-13.269531c.070312-12.296875-6.515626-23.667969-17.21875-29.726563-10.699219-6.058593-23.839844-5.855468-34.347657.535157-1.09375-11.511719-8.007812-21.660157-18.316406-26.890625-10.3125-5.230469-22.582031-4.820313-32.519531 1.09375v-14.132813c21.179687-12.019531 34.226562-34.527343 34.136718-58.878906 0-37.703125-30.566406-68.265625-68.269531-68.265625s-68.265625 30.5625-68.265625 68.265625c-.089844 24.351563 12.957032 46.859375 34.132813 58.878906v137.386719c.242187 10.074219-1.128907 20.117188-4.0625 29.757812-.914063 2.847657-3.246094 5.019532-6.152344 5.734376-2.734375.691406-5.632813-.070313-7.679687-2.015626-6.664063-6.355468-12.585938-13.449218-17.644532-21.144531-14.808594-22.152343-52.070312-63.53125-75.394531-63.53125-13.101563-.273437-25.152344 7.132813-30.828125 18.945313zm124.695312-164.011719c0-28.277344 22.921876-51.199219 51.199219-51.199219 28.277344 0 51.199219 22.921875 51.199219 51.199219.082031 14.601563-6.136719 28.527344-17.066406 38.214844v-38.214844c0-18.851563-15.28125-34.132813-34.132813-34.132813-18.851562 0-34.132812 15.28125-34.132812 34.132813v38.214844c-10.925781-9.6875-17.148438-23.613281-17.066407-38.214844zm-32.699218 218.070313c5.785156 8.773437 12.550781 16.859374 20.164062 24.105468 6.277344 5.9375 15.15625 8.253906 23.535156 6.136719 8.539063-2.128906 15.394532-8.480469 18.175782-16.828125 3.53125-11.398438 5.207031-23.289062 4.957031-35.21875v-196.265625c0-9.425781 7.640625-17.066406 17.066406-17.066406s17.066407 7.640625 17.066407 17.066406v179.199219c0 4.714844 3.820312 8.535156 8.535156 8.535156 4.710937 0 8.53125-3.820312 8.53125-8.535156v-76.796875c0-9.425781 7.644531-17.066407 17.066406-17.066407 9.425781 0 17.070312 7.640626 17.070312 17.066407v76.796875c0 4.714844 3.820313 8.535156 8.53125 8.535156 4.714844 0 8.535157-3.820312 8.535157-8.535156v-51.199219c0-9.425781 7.640625-17.066406 17.066406-17.066406s17.066406 7.640625 17.066406 17.066406v59.734375c0 4.710938 3.820313 8.53125 8.53125 8.53125 4.714844 0 8.535157-3.820312 8.535157-8.53125v-17.066406c-.011719-4.527344 1.792968-8.871094 5.007812-12.058594 3.519531-3.488281 8.367188-5.296875 13.3125-4.964844 9.21875 1.203125 16.039062 9.171875 15.8125 18.464844v135.089844c0 .417968-.433594 42.667968-26.316406 66.324218-5.058594 4.769532-7.894532 11.441407-7.816406 18.394532v26.214844c0 4.714843-3.820313 8.535156-8.535157 8.535156h-136.53125c-4.714843 0-8.535156-3.820313-8.535156-8.535156v-3.121094c.011719-15.996094-6.414063-31.324219-17.824219-42.53125-14.457031-14.035156-40.3125-41.609375-51.046875-68.453125-17.5625-43.878907-52.308593-104.476563-70.160156-122.328125-4.0625-4.058594-5.421875-7.816406-4.039063-11.160156 3.09375-5.359376 8.882813-8.589844 15.070313-8.40625 11.597656 0 43.042969 28.75 61.167969 55.9375zm0 0" />
                      </svg>
                      <span>Free Cancellations</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <svg viewBox="0 0 52 60" xmlns="http://www.w3.org/2000/svg">
                        <g id="Page-1">
                          <g>
                            <path d="m7 35h14.354l1.454 3.994-.958 2.636c-.1846791.4673778-.550069.8405077-1.0134734 1.0349418-.4634045.1944342-.9856451.1937341-1.4485266-.0019418l-.036-.013h-.012c-4.148-1.5-8.9 1.068-10.59 5.723s.3 9.684 4.439 11.2c4.217 1.529 8.934-1.138 10.6-5.728l2.211-6.08 2.213 6.079c.7681989 2.1829185 2.3025125 4.0128664 4.318 5.15 1.902527 1.1176044 4.2045361 1.3279064 6.2780786.5735392 2.0735426-.7543671 3.7022803-2.3946983 4.4419214-4.4735392 1.6263512-4.4809857-.1945815-9.4831776-4.321-11.87-1.9215394-1.103671-4.2309581-1.3073357-6.316-.557-.5027979.190678-1.0605312.1752254-1.552-.043-.4254396-.193397-.7539361-.5514943-.91-.992l-.958-2.632 1.456-4h14.35c3.8641657-.0044086 6.9955914-3.1358343 7-7v-21c-.0044086-3.86416566-3.1358343-6.99559136-7-7h-38c-3.86416566.00440864-6.99559136 3.13583434-7 7v21c.00440864 3.8641657 3.13583434 6.9955914 7 7zm14.91 18.159c-1.317 3.628-4.924 5.662-8.036 4.532s-4.56-5.014-3.244-8.639 4.924-5.65 8.039-4.522l.029.01h.009c1.000256.3713192 2.1068019.331774 3.078-.11 1.0290335-.4937681 1.7915156-1.4118141 2.088-2.514l1.063 2.921zm8.313-8.722c.9841229.4432548 2.1041716.476716 3.113.093 1.5341656-.5348449 3.2254385-.372658 4.63.444 3.2513925 1.9038395 4.6878268 5.8519339 3.42 9.4-.529854 1.5418683-1.7279644 2.7618075-3.2600156 3.3194113-1.5320513.5576037-3.2340156.3931726-4.6309844-.4474113-1.5898273-.9040881-2.7978395-2.354058-3.4-4.081l-11.974-32.894c-.1813663-.4991128-.156788-1.0498646.0683165-1.5308378.2251045-.4809733.632252-.8526756 1.1316835-1.0331622l1.7 4.667.009.023 7.249 19.917c.3377316.9393347 1.0379691 1.7040487 1.944 2.123zm-2.093-8.361-.391-1.076h.783zm-26.13-29.076c.00330612-2.76005315 2.23994685-4.99669388 5-5h38c2.7600532.00330612 4.9966939 2.23994685 5 5v21c-.0033061 2.7600532-2.2399468 4.9966939-5 5h-17.989l-3.64-10h.629c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1h-1.357l-1.789-4.917c-.0902433-.2497158-.2760945-.4532895-.5165811-.5658418-.2404866-.1125522-.5158625-.1248414-.7654189-.0341582l-.939.342c-2.0755795.7554489-3.1459791 3.0502496-2.391 5.126l4.384 12.049h-13.626c-2.76005315-.0033061-4.99669388-2.2399468-5-5z" />
                          </g>
                        </g>
                      </svg>
                      <span>No Credit Card Fees</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <svg version="1.1" id="communication" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
                        <g>
                          <g>
                            <path d="M366,396c-5.52,0-10,4.48-10,10c0,5.52,4.48,10,10,10c5.52,0,10-4.48,10-10C376,400.48,371.52,396,366,396z" />
                          </g>
                        </g>
                      </svg>
                      <span>24/7 Customer Support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="search-fields-container search-fields-container-shape">
                  <div className="search-fields-container-inner">
                    <h3 className="title pb-3">Let&apos;s Find Your Ideal Car</h3>
                    <div className="section-block"></div>
                    <div className="contact-form-action pt-3">
                      <form action="#" className="row">
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">Pick-up Location</label>
                            <div className="form-group">
                              <span className="la la-map-marker form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="City, airport, station or address"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8 col-sm-7">
                          <div className="input-box">
                            <label className="label-text">Pick-up Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="date-range form-control"
                                type="text"
                                name="daterange-single"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-5 ps-0">
                          <div className="input-box">
                            <label className="label-text">Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain select-contain-shadow w-auto">
                                <select className="select-contain-select">
                                  <option value="0900AM" defaultValue>9:00AM</option>
                                  <option value="1000AM">10:00AM</option>
                                  <option value="1100AM">11:00AM</option>
                                  <option value="1200PM">12:00PM</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8 col-sm-7">
                          <div className="input-box">
                            <label className="label-text">Drop-off Date</label>
                            <div className="form-group">
                              <span className="la la-calendar form-icon"></span>
                              <input
                                className="date-range form-control"
                                type="text"
                                name="daterange-single"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-5 ps-0">
                          <div className="input-box">
                            <label className="label-text">Time</label>
                            <div className="form-group select2-container-wrapper">
                              <div className="select-contain select-contain-shadow w-auto">
                                <select className="select-contain-select">
                                  <option value="0900AM" defaultValue>9:00AM</option>
                                  <option value="1000AM">10:00AM</option>
                                  <option value="1100AM">11:00AM</option>
                                  <option value="1200PM">12:00PM</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* Advanced options removed as requested */}
                    <div className="btn-box pt-3">
                      <Link href="/car-search-result" className="theme-btn">
                        Search Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg
            className="hero-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <polygon points="100 10 100 0 0 10"></polygon>
          </svg>
        </div>
      </section>

      {/* Car Area */}
      <section className="car-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Trending Used Cars</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-50px">
            <div className="col-lg-12">
              <div className="car-carousel carousel-action">
                <div className="card-item car-card mb-0 border">
                  <div className="card-img">
                    <Link href="/car-single" className="d-block">
                      <img src="/html-folder/images/car-img.png" alt="car-img" />
                    </Link>
                    <span className="badge">Bestseller</span>
                    <div
                      className="add-to-wishlist icon-element"
                      data-bs-toggle="tooltip"
                      data-placement="top"
                      title="Add to wishlist"
                    >
                      <i className="la la-heart-o"></i>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-meta">Compact SUV</p>
                    <h3 className="card-title">
                      <Link href="/car-single">Toyota Corolla or Similar</Link>
                    </h3>
                    <div className="card-rating">
                      <span className="badge text-white">4.4/5</span>
                      <span className="review__text">Average</span>
                      <span className="rating__text">(30 Reviews)</span>
                    </div>
                    <div className="card-attributes">
                      <ul className="d-flex align-items-center">
                        <li
                          className="d-flex align-items-center"
                          data-bs-toggle="tooltip"
                          data-placement="top"
                          title="Passenger"
                        >
                          <i className="la la-users"></i><span>4</span>
                        </li>
                        <li
                          className="d-flex align-items-center"
                          data-bs-toggle="tooltip"
                          data-placement="top"
                          title="Luggage"
                        >
                          <i className="la la-suitcase"></i><span>1</span>
                        </li>
                      </ul>
                    </div>
                    <div className="card-price d-flex align-items-center justify-content-between">
                      <p>
                        <span className="price__from">From</span>
                        <span className="price__num">$23.00</span>
                        <span className="price__text">Per day</span>
                      </p>
                      <Link href="/car-single" className="btn-text">
                        See details<i className="la la-angle-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-item car-card mb-0 border">
                  <div className="card-img">
                    <Link href="/car-single" className="d-block">
                      <img src="/html-folder/images/car-img2.png" alt="car-img" />
                    </Link>
                    <div
                      className="add-to-wishlist icon-element"
                      data-bs-toggle="tooltip"
                      data-placement="top"
                      title="Add to wishlist"
                    >
                      <i className="la la-heart-o"></i>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-meta">Standard</p>
                    <h3 className="card-title">
                      <Link href="/car-single">Volkswagen Jetta 2 Doors or Similar</Link>
                    </h3>
                    <div className="card-rating">
                      <span className="badge text-white">4.4/5</span>
                      <span className="review__text">Average</span>
                      <span className="rating__text">(30 Reviews)</span>
                    </div>
                    <div className="card-attributes">
                      <ul className="d-flex align-items-center">
                        <li className="d-flex align-items-center">
                          <i className="la la-users"></i><span>4</span>
                        </li>
                        <li className="d-flex align-items-center">
                          <i className="la la-suitcase"></i><span>1</span>
                        </li>
                      </ul>
                    </div>
                    <div className="card-price d-flex align-items-center justify-content-between">
                      <p>
                        <span className="price__from">From</span>
                        <span className="price__num">$33.00</span>
                        <span className="price__text">Per day</span>
                      </p>
                      <Link href="/car-single" className="btn-text">
                        See details<i className="la la-angle-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funfact Area */}
      <section className="funfact-area padding-top-100px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">
                  World&apos;s Biggest Online Car Hire Service
                </h2>
                <p className="sec__desc pt-3">
                  Why you can find the right car in the right place with us.
                </p>
              </div>
            </div>
          </div>
          <div className="counter-box mt-5 pb-2">
            <div className="row">
              <div className="col-lg-3 responsive-column">
                <div className="counter-item d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-map"></i>
                  </div>
                  <div className="counter-content">
                    <span
                      className="counter"
                      data-from="0"
                      data-to="50000"
                      data-refresh-interval="5"
                    >
                      0
                    </span>
                    <span className="count-symbol">+</span>
                    <p className="counter__title">Locations</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-globe"></i>
                  </div>
                  <div className="counter-content">
                    <span
                      className="counter"
                      data-from="0"
                      data-to="160"
                      data-refresh-interval="5"
                    >
                      0
                    </span>
                    <p className="counter__title">Countries</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-language"></i>
                  </div>
                  <div className="counter-content">
                    <span
                      className="counter"
                      data-from="0"
                      data-to="43"
                      data-refresh-interval="5"
                    >
                      0
                    </span>
                    <p className="counter__title">Languages Spoken</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 responsive-column">
                <div className="counter-item d-flex">
                  <div className="counter-icon flex-shrink-0">
                    <i className="la la-star"></i>
                  </div>
                  <div className="counter-content">
                    <span
                      className="counter"
                      data-from="0"
                      data-to="3500000"
                      data-refresh-interval="5"
                    >
                      0
                    </span>
                    <p className="counter__title">Customer Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logo Area */}
      <section className="clientlogo-area position-relative section-bg padding-top-140px padding-bottom-150px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Big Brands, Big Discounts!</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-20px">
            <div className="col-lg-8 mx-auto">
              <div className="client-logo">
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/alamo.png" alt="brand image" />
                </div>
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/europcar.png" alt="brand image" />
                </div>
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/hertz.png" alt="brand image" />
                </div>
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/national.png" alt="brand image" />
                </div>
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/thrifty.png" alt="brand image" />
                </div>
                <div className="client-logo-item client-logo-item-2">
                  <img src="/html-folder/images/vologo.png" alt="brand image" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg className="cta-svg" viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M-31.31,170.22 C164.50,33.05 334.36,-32.06 547.11,196.88 L500.00,150.00 L0.00,150.00 Z"></path>
        </svg>
      </section>

      {/* Destination Area */}
      <section className="destination-area padding-top-50px padding-bottom-70px">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="section-heading">
                <h2 className="sec__title">Top Destinations</h2>
                <p className="sec__desc pt-3">
                  Discover incredible car rental destinations and explore the world with ease.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="btn-box btn--box text-end">
                <Link href="/destinations" className="theme-btn">
                  Discover More <i className="la la-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="row padding-top-50px">
            <div className="col-lg-4 responsive-column">
              <div className="card-item destination-card destination--card">
                <div className="card-img">
                  <img src="/html-folder/images/destination-img2.jpg" alt="destination-img" />
                </div>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="card-title mb-0">
                      <Link href="/tour-details">California</Link>
                    </h3>
                  </div>
                  <div>
                    <Link
                      href="/tour-details"
                      className="theme-btn theme-btn-small border-0"
                    >
                      Explore <i className="la la-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item destination-card destination--card">
                <div className="card-img">
                  <img src="/html-folder/images/destination-img3.jpg" alt="destination-img" />
                </div>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="card-title mb-0">
                      <Link href="/tour-details">New York</Link>
                    </h3>
                  </div>
                  <div>
                    <Link
                      href="/tour-details"
                      className="theme-btn theme-btn-small border-0"
                    >
                      Explore <i className="la la-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="card-item destination-card destination--card">
                <div className="card-img">
                  <img src="/html-folder/images/destination-img4.jpg" alt="destination-img" />
                </div>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="card-title mb-0">
                      <Link href="/tour-details">San Francisco</Link>
                    </h3>
                  </div>
                  <div>
                    <Link
                      href="/tour-details"
                      className="theme-btn theme-btn-small border-0"
                    >
                      Explore <i className="la la-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Area - How it Works */}
      <section className="info-area padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">How does it work?</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-50px">
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-3 d-flex">
                <div className="info-icon flex-shrink-0">
                  <i className="la la-search-plus"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Find The Car</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam odio
                  </p>
                  <span className="info__num">1</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-3 d-flex">
                <div className="info-icon flex-shrink-0">
                  <i className="la la-mouse-pointer"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Book It</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam odio
                  </p>
                  <span className="info__num">2</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-3 d-flex">
                <div className="info-icon flex-shrink-0">
                  <i className="la la-check"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Grab And Go</h4>
                  <p className="info__desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam odio
                  </p>
                  <span className="info__num">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Area */}
      <section className="faq-area section-bg section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center">
                <h2 className="sec__title">Frequently Asked Questions</h2>
              </div>
            </div>
          </div>
          <div className="row padding-top-60px">
            <div className="col-lg-7">
              <div className="accordion accordion-item" id="accordionExample">
                <div className="card">
                  <div className="card-header" id="faqHeadingOne">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link d-flex align-items-center justify-content-between"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faqCollapseOne"
                        aria-expanded="true"
                        aria-controls="faqCollapseOne"
                      >
                        <span>What do I need to hire a car?</span>
                        <i className="la la-minus"></i>
                        <i className="la la-plus"></i>
                      </button>
                    </h2>
                  </div>
                  <div
                    id="faqCollapseOne"
                    className="collapse show"
                    aria-labelledby="faqHeadingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab accusamus aliquid at, aut cumque cupiditate delectus dignissimos
                      </p>
                      <ul className="list-items py-2">
                        <li>Mus accumsan venenatis hac</li>
                        <li>Curabitur per quis parturient vel ut</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="faqHeadingTwo">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link d-flex align-items-center justify-content-between"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faqCollapseTwo"
                        aria-expanded="false"
                        aria-controls="faqCollapseTwo"
                      >
                        <span>How old do I have to be to rent a car?</span>
                        <i className="la la-minus"></i>
                        <i className="la la-plus"></i>
                      </button>
                    </h2>
                  </div>
                  <div
                    id="faqCollapseTwo"
                    className="collapse"
                    aria-labelledby="faqHeadingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <p>
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour, or randomised words which
                        don&apos;t look even slightly believable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-help-text pt-2">
                <p className="font-size-14 font-weight-regular">
                  Any questions? Just visit our
                  <Link href="#" className="color-text"> Help center</Link> or
                  <Link href="#" className="color-text"> Contact Us</Link>
                </p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="faq-forum ps-4">
                <div className="form-box border">
                  <div className="form-title-wrap">
                    <h3 className="title">Still have question?</h3>
                  </div>
                  <div className="form-content">
                    <div className="contact-form-action">
                      <form method="post">
                        <div className="input-box">
                          <label className="label-text">Your Name</label>
                          <div className="form-group">
                            <span className="la la-user form-icon"></span>
                            <input
                              className="form-control"
                              type="text"
                              name="text"
                              placeholder="Your name"
                            />
                          </div>
                        </div>
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
                        <div className="btn-box">
                          <button type="button" className="theme-btn">
                            Send Message <i className="la la-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Area */}
      <section className="cta-area subscriber-area section-bg-2 padding-top-60px padding-bottom-60px">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="section-heading">
                <p className="sec__desc text-white-50 pb-1">Get Updates & More</p>
                <h2 className="sec__title font-size-30 text-white">
                  Thoughtful thoughts to your inbox
                </h2>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="subscriber-box">
                <div className="contact-form-action">
                  <form action="#">
                    <div className="input-box">
                      <label className="label-text text-white">Enter email address</label>
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
                          Subscribe
                        </button>
                        <span className="font-size-14 pt-1 text-white-50">
                          <i className="la la-lock me-1"></i>Don&apos;t worry your
                          information is safe with us.
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-area bg-white padding-top-90px padding-bottom-30px">
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
                  Your trusted car booking platform for seamless rental experiences worldwide.
                </p>
                <ul className="list-items pt-3">
                  <li>
                    3015 Grand Ave, Coconut Grove,<br />
                    Cerrick Way, FL 12345
                  </li>
                  <li>+123-456-789</li>
                  <li><Link href="#">support@kirastay.com</Link></li>
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
          <div className="section-block"></div>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="copy-right padding-top-30px">
                <p className="copy__desc">
                  &copy; Copyright Kirastay <span id="get-year"></span> . Made with
                  <span className="la la-heart"></span> by
                  <Link href="#">
                    SmartestDevelopers
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="footer-social-box padding-top-30px text-end">
                <ul className="social-profile">
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>

      {/* Sign Up Modal */}
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

      {/* Login Modal */}
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
