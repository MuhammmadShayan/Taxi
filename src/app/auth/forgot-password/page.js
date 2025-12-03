'use client';

import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../../../components/Header';
import { I18nProvider } from '../../../i18n/I18nProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage(`Password reset instructions have been sent to ${email}. Please check your inbox and follow the instructions to reset your password.`);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <I18nProvider>
      <Head>
        <title>Forgot Password - HOLIKEY</title>
        <meta name="description" content="Reset your password" />
        <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
        <link rel="stylesheet" href="/html-folder/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      {/* Breadcrumb */}
      <section className="breadcrumb-area bread-bg-8">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Forgot Password</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/">Login</Link></li>
                    <li>Forgot Password</li>
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

      {/* Forgot Password Form */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title text-center">Reset Your Password</h3>
                  <p className="text-center color-text-2 font-size-15">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>
                
                {success ? (
                  <div className="text-center">
                    <div className="alert alert-success">
                      <i className="la la-check-circle font-size-24 mb-2"></i>
                      <h4>Email Sent!</h4>
                      <p>{message}</p>
                    </div>
                    
                    <div className="btn-box pt-3">
                      <Link href="/" className="theme-btn">
                        Back to Login
                      </Link>
                    </div>
                    
                    <p className="text-center mt-3">
                      Didn't receive the email? 
                      <button 
                        type="button" 
                        className="btn-link text-primary"
                        onClick={() => {
                          setSuccess(false);
                          setMessage('');
                          setError('');
                        }}
                      >
                        Try again
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="contact-form-action">
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger">
                          <i className="la la-exclamation-triangle"></i> {error}
                        </div>
                      )}
                      
                      <div className="input-box">
                        <label className="label-text">Email Address</label>
                        <div className="form-group">
                          <span className="la la-envelope-o form-icon"></span>
                          <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="btn-box pt-3">
                        <button 
                          type="submit" 
                          className="theme-btn w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Sending Reset Email...
                            </>
                          ) : (
                            'Send Reset Instructions'
                          )}
                        </button>
                      </div>
                    </form>
                    
                    <div className="account-assist mt-4 text-center">
                      <p className="account__desc">
                        Remember your password? 
                        <Link href="/" className="text-primary ms-1">
                          Back to Login
                        </Link>
                      </p>
                      <p className="account__desc">
                        Don't have an account? 
                        <Link href="/" className="text-primary ms-1">
                          Sign up here
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
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
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px">Company</h4>
                <ul className="list-items list--items">
                  <li><Link href="/about">About us</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px">Support</h4>
                <ul className="list-items list--items">
                  <li><Link href="/help">Help Center</Link></li>
                  <li><Link href="/terms">Terms & Conditions</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 responsive-column">
              <div className="footer-item">
                <h4 className="title curve-shape pb-3 margin-bottom-20px">Contact Info</h4>
                <ul className="list-items">
                  <li>3015 Grand Ave, Coconut Grove</li>
                  <li>+212 600 123 456</li>
                  <li><Link href="mailto:info@holikey.com">info@holikey.com</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block mt-4"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="copy-right padding-top-30px">
                <p className="copy__desc">
                  &copy; Copyright HOLIKEY 2025. Made with ❤️ for Morocco
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>

      {/* Scripts */}
      <Script src="/html-folder/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/html-folder/js/main.js" strategy="afterInteractive" />
    </I18nProvider>
  );
}
