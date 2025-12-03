'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setIsSubmitting(true);
      // Client-side validation
      const { name, email, subject, message } = formData;
      if (!name || !email || !subject || !message) {
        setErrorMessage('Please fill in all fields.');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Failed to send your message. Please try again.');
        setIsSubmitting(false);
        const formRoot = document.getElementById('contact-form-root');
        if (formRoot) formRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      const formRoot = document.getElementById('contact-form-root');
      if (formRoot) formRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Refresh after short delay for a clean state
      setTimeout(() => {
        router.refresh();
      }, 1800);
    } catch (err) {
      console.error('Contact form error:', err);
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('contact.title')}</title>
<meta name="description" content={t('contact.meta_desc')} />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-5">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">{t('contact.breadcrumb_title')}</h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">{t('contact.breadcrumb_home')}</a></li>
                    <li>{t('contact.breadcrumb_pages')}</li>
                    <li>{t('contact.breadcrumb_title')}</li>
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

      {/* Contact Area */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <h3 className="title">{t('contact.form_title')}</h3>
                  <p className="font-size-15">
                    {t('contact.form_desc')}
                  </p>
                </div>
                <div className="form-content" id="contact-form-root">
                  <div className="contact-form-action">
                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    {showSuccess && (
                      <div
                        id="contact-success-message"
                        className="alert alert-success"
                        role="alert"
                      >
                        {t('contact.success')}
                      </div>
                    )}
                    <form
                      id="contact-form"
                      onSubmit={handleSubmit}
                      className="contact-form"
                    >
                      <div className="row">
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">{t('contact.name')}</label>
                            <div className="form-group">
                              <span className="la la-user form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={t('contact.name_ph')}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 responsive-column">
                          <div className="input-box">
                            <label className="label-text">{t('contact.email')}</label>
                            <div className="form-group">
                              <span className="la la-envelope-o form-icon"></span>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('contact.email_ph')}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">{t('contact.subject')}</label>
                            <div className="form-group">
                              <span className="la la-book form-icon"></span>
                              <input
                                className="form-control"
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder={t('contact.subject_ph')}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-box">
                            <label className="label-text">{t('contact.message')}</label>
                            <div className="form-group">
                              <span className="la la-pencil form-icon"></span>
                              <textarea
                                className="message-control form-control"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t('contact.message_ph')}
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="btn-box">
                            <button type="submit" className="theme-btn" disabled={isSubmitting} aria-disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  {t('contact.sending') || 'Sending...'}
                                </>
                              ) : (
                                t('contact.send_message')
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="form-box contact-info-box">
                <h3 className="title">{t('contact.info')}</h3>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="la la-map-marker"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="title font-size-15">{t('contact.address')}</h4>
                    <p>{t('contact.address_text').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="la la-phone"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="title font-size-15">{t('contact.phone')}</h4>
                    <p>{t('contact.phone_text').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="la la-envelope"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="title font-size-15">{t('contact.email_title')}</h4>
                    <p>{t('contact.email_text').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="la la-clock-o"></i>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="title font-size-15">{t('contact.office_hours')}</h4>
                    <p>{t('contact.office_hours_text').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-area padding-top-40px padding-bottom-40px">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="map-wrap">
                <div className="map-box">
                  <div className="contact-map">
                    {/* Google Maps Embed */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.7806761080233!2d-93.29138368446431!3d44.96844997909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32b6ee2c87c91%3A0xc20dff2748d2bd92!2sWashington+Ave+Bridge!5e0!3m2!1sen!2sus!4v1562784991813!5m2!1sen!2sus"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                      title="Office Location"
                    ></iframe>
                  </div>
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
    </>
  );
}
