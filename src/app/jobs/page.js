'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function JobsPage() {
  const { t } = useI18n();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      location: 'Casablanca, Morocco',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Join our engineering team to build and maintain our car rental platform using modern web technologies.',
      requirements: ['3+ years experience with React.js and Node.js', 'Experience with database design', 'Strong problem-solving skills'],
      posted: '2024-01-15'
    },
    {
      id: 2,
      title: 'Customer Support Representative',
      location: 'Marrakech, Morocco',
      type: 'Full-time',
      department: 'Customer Service',
      description: 'Provide exceptional customer support to our travelers and help resolve booking inquiries.',
      requirements: ['Excellent communication skills', 'Multilingual (Arabic, French, English)', 'Customer service experience'],
      posted: '2024-01-10'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      location: 'Rabat, Morocco',
      type: 'Full-time',
      department: 'Marketing',
      description: 'Lead our marketing initiatives to grow brand awareness and customer acquisition.',
      requirements: ['Digital marketing experience', 'Content creation skills', 'Analytics knowledge'],
      posted: '2024-01-08'
    }
  ];

  useEffect(() => {
    // Simulate loading jobs
    const timer = setTimeout(() => {
      setJobs(mockJobs);
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
        <title>Careers & Jobs - Join Our Team | Kirastay</title>
        <meta name="description" content="Join the Kirastay team! Explore career opportunities in travel technology, customer service, and more. Build your career with Morocco's leading car rental platform." />
        <meta name="keywords" content="jobs, careers, kirastay, morocco jobs, travel jobs, tech jobs, customer service jobs" />
        <meta property="og:title" content="Careers & Jobs - Join Our Team | Kirastay" />
        <meta property="og:description" content="Join the Kirastay team! Explore career opportunities in travel technology, customer service, and more." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/jobs" />
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
                    <h2 className="sec__title text-white">Join Our Team</h2>
                    <p className="sec__desc text-white">Be part of Morocco's leading car rental platform</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Pages</li>
                    <li>Jobs</li>
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

      {/* Jobs Listing Area */}
      <section className="contact-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Current Openings</h2>
                <p className="sec__desc">
                  We're always looking for talented individuals who are passionate about travel and technology.
                  Join our growing team and help shape the future of car rentals in Morocco.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading job openings...</p>
            </div>
          ) : (
            <div className="row">
              {jobs.map((job) => (
                <div key={job.id} className="col-lg-12 mb-4">
                  <div className="card job-card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-lg-8">
                          <div className="job-content">
                            <h3 className="job-title">
                              <a href={`#job-${job.id}`} className="text-decoration-none">
                                {job.title}
                              </a>
                            </h3>
                            <div className="job-meta d-flex flex-wrap gap-3 mb-3">
                              <span className="job-location">
                                <i className="la la-map-marker"></i>
                                {job.location}
                              </span>
                              <span className="job-type">
                                <i className="la la-clock-o"></i>
                                {job.type}
                              </span>
                              <span className="job-department">
                                <i className="la la-building"></i>
                                {job.department}
                              </span>
                              <span className="job-posted">
                                <i className="la la-calendar"></i>
                                Posted: {new Date(job.posted).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="job-description">{job.description}</p>
                            <div className="job-requirements">
                              <h5>Key Requirements:</h5>
                              <ul>
                                {job.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 text-center">
                          <div className="job-actions">
                            <a href={`/contact?subject=Application for ${job.title}`} className="theme-btn">
                              Apply Now
                            </a>
                            <p className="text-muted mt-2 small">
                              Please mention the job title in your application
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Why Work With Us Section */}
          <section className="why-work-section padding-top-80px">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-heading text-center margin-bottom-60px">
                  <h2 className="sec__title">Why Work With Kirastay?</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 responsive-column">
                <div className="icon-box icon-layout-4 text-center">
                  <div className="info-icon">
                    <i className="la la-users"></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">Great Team</h4>
                    <p className="info__desc">
                      Work with passionate professionals who are dedicated to transforming the travel industry.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 responsive-column">
                <div className="icon-box icon-layout-4 text-center">
                  <div className="info-icon">
                    <i className="la la-rocket"></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">Growth Opportunities</h4>
                    <p className="info__desc">
                      Advance your career with continuous learning and development opportunities.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 responsive-column">
                <div className="icon-box icon-layout-4 text-center">
                  <div className="info-icon">
                    <i className="la la-heart"></i>
                  </div>
                  <div className="info-content">
                    <h4 className="info__title">Benefits Package</h4>
                    <p className="info__desc">
                      Competitive salary, health benefits, and flexible working arrangements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application CTA */}
          <section className="cta-area cta-bg-2 bg-fixed section-padding text-center margin-top-80px">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-heading">
                    <h2 className="sec__title mb-3 text-white">Don't See a Position That Fits?</h2>
                    <p className="sec__desc text-white">
                      We're always interested in hearing from talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                  </div>
                  <div className="btn-box padding-top-35px">
                    <a href="/contact?subject=General Application" className="theme-btn border-0">
                      Send Your Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
      
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>
      
      <SignupModal />
      <LoginModal />

      <style jsx>{`
        .job-card {
          border: 1px solid #e8ecef;
          border-radius: 8px;
          transition: box-shadow 0.3s ease;
        }
        
        .job-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .job-title a {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
        }
        
        .job-title a:hover {
          color: #3182ce;
        }
        
        .job-meta span {
          color: #718096;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .job-description {
          color: #4a5568;
          margin: 15px 0;
        }
        
        .job-requirements h5 {
          color: #2d3748;
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .job-requirements ul {
          padding-left: 20px;
          color: #4a5568;
        }
        
        .job-requirements li {
          margin-bottom: 5px;
        }
        
        .job-actions .theme-btn {
          min-width: 150px;
        }
      `}</style>
    </>
  );
}
