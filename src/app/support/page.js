'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function SupportPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  const faqs = [
    {
      id: 1,
      category: 'Booking',
      question: 'How do I make a car reservation?',
      answer: 'You can make a reservation by selecting your pickup location, dates, and browsing available vehicles. Click "Book Now" on your preferred car and follow the booking process.'
    },
    {
      id: 2,
      category: 'Booking',
      question: 'Can I modify or cancel my booking?',
      answer: 'Yes, you can modify or cancel your booking up to 24 hours before pickup. Go to "My Bookings" in your dashboard to make changes.'
    },
    {
      id: 3,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Some agencies also accept cash payments.'
    },
    {
      id: 4,
      category: 'Payment',
      question: 'When am I charged for my booking?',
      answer: 'You can choose to pay the full amount or make a 20% deposit when booking, with the remaining balance due at pickup.'
    },
    {
      id: 5,
      category: 'Vehicles',
      question: 'What if the car I booked is not available?',
      answer: 'If your reserved vehicle is unavailable, we will provide a similar or upgraded vehicle at no extra cost. If no suitable alternative is available, you will receive a full refund.'
    },
    {
      id: 6,
      category: 'Vehicles',
      question: 'Are the vehicles insured?',
      answer: 'Yes, all vehicles come with basic insurance. You can upgrade to comprehensive coverage for additional protection during the booking process.'
    },
    {
      id: 7,
      category: 'General',
      question: 'What documents do I need to rent a car?',
      answer: 'You need a valid driver\'s license, passport or national ID, and a credit card in the driver\'s name. International drivers may need an International Driving Permit.'
    },
    {
      id: 8,
      category: 'General',
      question: 'Is there a minimum age requirement?',
      answer: 'The minimum age to rent a car is typically 21 years old, though some premium vehicles may require drivers to be 25 or older.'
    }
  ];

  useEffect(() => {
    // Filter FAQs based on search query
    if (searchQuery.trim() === '') {
      setFilteredFAQs(faqs);
    } else {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFAQs(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredFAQs(faqs);
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

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <>
      <Head>
        <title>Support & Help Center - Kirastay | Car Rental Support</title>
        <meta name="description" content="Get help with your Kirastay car rental booking. Find answers to common questions, contact support, and access helpful resources for travelers." />
        <meta name="keywords" content="kirastay support, car rental help, booking assistance, travel support, customer service" />
        <meta property="og:title" content="Support & Help Center - Kirastay" />
        <meta property="og:description" content="Get help with your Kirastay car rental booking. Find answers to common questions and contact support." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/support" />
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
                    <h2 className="sec__title text-white">Support Center</h2>
                    <p className="sec__desc text-white">We're here to help you with your travel needs</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Pages</li>
                    <li>Support</li>
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

      {/* Support Content Area */}
      <section className="contact-area section--padding">
        <div className="container">
          {/* Support Options */}
          <div className="row margin-bottom-60px">
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-phone"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Phone Support</h4>
                  <p className="info__desc">
                    Call us directly for immediate assistance with your booking or travel questions.
                  </p>
                  <p className="contact-info">
                    <strong>+41 78 214 97 95</strong><br />
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-envelope"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Email Support</h4>
                  <p className="info__desc">
                    Send us an email and we'll respond within 24 hours with detailed assistance.
                  </p>
                  <p className="contact-info">
                    <strong>support@kirastay.com</strong><br />
                    24/7 Email Support
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 responsive-column">
              <div className="icon-box icon-layout-4 text-center">
                <div className="info-icon">
                  <i className="la la-comments"></i>
                </div>
                <div className="info-content">
                  <h4 className="info__title">Live Chat</h4>
                  <p className="info__desc">
                    Get instant help through our live chat feature available on our website.
                  </p>
                  <div className="btn-box padding-top-20px">
                    <a href="#" className="theme-btn theme-btn-small">
                      Start Chat
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Tabs */}
          <div className="row">
            <div className="col-lg-12">
              <div className="support-tabs-container">
                <ul className="nav nav-tabs support-tabs" role="tablist">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                      onClick={() => setActiveTab('faq')}
                    >
                      <i className="la la-question-circle"></i>
                      FAQ
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'guides' ? 'active' : ''}`}
                      onClick={() => setActiveTab('guides')}
                    >
                      <i className="la la-book"></i>
                      User Guides
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                      onClick={() => setActiveTab('contact')}
                    >
                      <i className="la la-envelope"></i>
                      Contact Support
                    </button>
                  </li>
                </ul>

                <div className="tab-content support-tab-content">
                  {/* FAQ Tab */}
                  {activeTab === 'faq' && (
                    <div className="tab-pane fade show active">
                      <div className="faq-container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="search-box margin-bottom-40px">
                              <div className="form-group">
                                <span className="la la-search form-icon"></span>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Search for answers..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          {categories.map(category => (
                            <div key={category} className="col-lg-6 responsive-column">
                              <div className="faq-category">
                                <h3 className="category-title">
                                  <i className="la la-folder"></i>
                                  {category}
                                </h3>
                                <div className="accordion" id={`accordion-${category}`}>
                                  {filteredFAQs
                                    .filter(faq => faq.category === category)
                                    .map((faq, index) => (
                                    <div key={faq.id} className="accordion-item">
                                      <h2 className="accordion-header">
                                        <button
                                          className="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target={`#faq-${faq.id}`}
                                        >
                                          {faq.question}
                                        </button>
                                      </h2>
                                      <div
                                        id={`faq-${faq.id}`}
                                        className="accordion-collapse collapse"
                                        data-bs-parent={`#accordion-${category}`}
                                      >
                                        <div className="accordion-body">
                                          {faq.answer}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Guides Tab */}
                  {activeTab === 'guides' && (
                    <div className="tab-pane fade show active">
                      <div className="guides-container">
                        <div className="row">
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-search"></i>
                              </div>
                              <h4 className="guide-title">How to Search & Book</h4>
                              <p className="guide-desc">
                                Learn how to search for cars, compare prices, and complete your booking.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-credit-card"></i>
                              </div>
                              <h4 className="guide-title">Payment & Billing</h4>
                              <p className="guide-desc">
                                Understand our payment options, billing process, and refund policies.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-car"></i>
                              </div>
                              <h4 className="guide-title">Vehicle Pickup & Return</h4>
                              <p className="guide-desc">
                                Everything you need to know about picking up and returning your rental vehicle.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-shield"></i>
                              </div>
                              <h4 className="guide-title">Insurance & Protection</h4>
                              <p className="guide-desc">
                                Learn about insurance options and protection plans available for your rental.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-users"></i>
                              </div>
                              <h4 className="guide-title">Account Management</h4>
                              <p className="guide-desc">
                                Manage your profile, booking history, and preferences in your account dashboard.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                          <div className="col-lg-4 responsive-column">
                            <div className="guide-item">
                              <div className="guide-icon">
                                <i className="la la-mobile"></i>
                              </div>
                              <h4 className="guide-title">Mobile App Usage</h4>
                              <p className="guide-desc">
                                Get the most out of our mobile app with tips and feature explanations.
                              </p>
                              <a href="#" className="guide-link">Read Guide</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Support Tab */}
                  {activeTab === 'contact' && (
                    <div className="tab-pane fade show active">
                      <div className="contact-support-container">
                        <div className="row">
                          <div className="col-lg-8">
                            <div className="form-box">
                              <div className="form-title-wrap">
                                <h3 className="title">Contact Our Support Team</h3>
                                <p className="text-muted">
                                  Can't find what you're looking for? Send us a message and our support team will get back to you.
                                </p>
                              </div>
                              <div className="form-content">
                                <form className="contact-form">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="input-box">
                                        <label className="label-text">Full Name *</label>
                                        <div className="form-group">
                                          <span className="la la-user form-icon"></span>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Your full name"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-box">
                                        <label className="label-text">Email Address *</label>
                                        <div className="form-group">
                                          <span className="la la-envelope form-icon"></span>
                                          <input
                                            className="form-control"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-box">
                                        <label className="label-text">Booking Reference</label>
                                        <div className="form-group">
                                          <span className="la la-ticket form-icon"></span>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Booking reference (if applicable)"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-box">
                                        <label className="label-text">Issue Category *</label>
                                        <div className="form-group">
                                          <select className="form-control" required>
                                            <option value="">Select a category</option>
                                            <option value="booking">Booking Issues</option>
                                            <option value="payment">Payment Problems</option>
                                            <option value="vehicle">Vehicle Issues</option>
                                            <option value="cancellation">Cancellation/Refund</option>
                                            <option value="account">Account Problems</option>
                                            <option value="technical">Technical Issues</option>
                                            <option value="other">Other</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className="input-box">
                                        <label className="label-text">Subject *</label>
                                        <div className="form-group">
                                          <span className="la la-edit form-icon"></span>
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Brief description of your issue"
                                            required
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className="input-box">
                                        <label className="label-text">Message *</label>
                                        <div className="form-group">
                                          <span className="la la-pencil form-icon"></span>
                                          <textarea
                                            className="message-control form-control"
                                            placeholder="Please provide detailed information about your issue..."
                                            rows="6"
                                            required
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className="btn-box">
                                        <button type="submit" className="theme-btn">
                                          <i className="la la-paper-plane"></i>
                                          Send Message
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="sidebar">
                              <div className="sidebar-widget">
                                <h3 className="widget-title">Quick Links</h3>
                                <ul className="list-items quick-links">
                                  <li><a href="/booking">Make a Booking</a></li>
                                  <li><a href="/customer/dashboard">My Bookings</a></li>
                                  <li><a href="/customer/profile">My Profile</a></li>
                                  <li><a href="/contact">Contact Us</a></li>
                                  <li><a href="/about">About Kirastay</a></li>
                                </ul>
                              </div>
                              
                              <div className="sidebar-widget">
                                <h3 className="widget-title">Emergency Contact</h3>
                                <div className="emergency-contact">
                                  <p className="emergency-note">
                                    <i className="la la-exclamation-triangle"></i>
                                    For urgent travel emergencies or roadside assistance, call:
                                  </p>
                                  <p className="emergency-number">
                                    <strong>+212 600 123 456</strong>
                                  </p>
                                  <p className="emergency-availability">
                                    Available 24/7
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

      <style jsx>{`
        .support-tabs {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 40px;
          border: 1px solid #e9ecef;
        }
        
        .support-tabs .nav-link {
          border: none;
          background: transparent;
          color: #6c757d;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 0 5px;
          transition: all 0.3s ease;
        }
        
        .support-tabs .nav-link.active {
          background: #3182ce;
          color: white;
        }
        
        .support-tabs .nav-link:hover {
          background: #e9ecef;
          color: #495057;
        }
        
        .support-tabs .nav-link.active:hover {
          background: #2c5aa0;
          color: white;
        }
        
        .support-tab-content {
          min-height: 400px;
        }
        
        .faq-category {
          margin-bottom: 40px;
        }
        
        .category-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .accordion-button {
          font-weight: 500;
          color: #4a5568;
        }
        
        .accordion-button:not(.collapsed) {
          background-color: #3182ce;
          color: white;
        }
        
        .guide-item {
          text-align: center;
          padding: 30px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 30px;
          transition: box-shadow 0.3s ease;
        }
        
        .guide-item:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .guide-icon {
          width: 60px;
          height: 60px;
          background: #3182ce;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
        }
        
        .guide-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .guide-desc {
          color: #4a5568;
          margin-bottom: 20px;
        }
        
        .guide-link {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
        }
        
        .guide-link:hover {
          color: #2c5aa0;
          text-decoration: underline;
        }
        
        .contact-info {
          color: #4a5568;
          margin-top: 15px;
        }
        
        .contact-info strong {
          color: #2d3748;
        }
        
        .quick-links li {
          margin-bottom: 10px;
        }
        
        .quick-links a {
          color: #4a5568;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .quick-links a:hover {
          color: #3182ce;
        }
        
        .emergency-contact {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .emergency-note {
          color: #c53030;
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .emergency-number {
          color: #c53030;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .emergency-availability {
          color: #718096;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
