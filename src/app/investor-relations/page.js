'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function InvestorRelationsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');

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

  const financialHighlights = [
    { label: 'Total Revenue', value: '$45.2M', change: '+23%', icon: 'la la-chart-line' },
    { label: 'Net Income', value: '$8.7M', change: '+18%', icon: 'la la-dollar-sign' },
    { label: 'Total Bookings', value: '2.3M', change: '+35%', icon: 'la la-calendar-check' },
    { label: 'Market Cap', value: '$180M', change: '+12%', icon: 'la la-building' }
  ];

  const recentReports = [
    {
      title: 'Q3 2024 Earnings Report',
      date: '2024-10-15',
      type: 'Quarterly Report',
      size: '2.4 MB',
      downloadUrl: '/reports/q3-2024-earnings.pdf'
    },
    {
      title: 'Annual Report 2023',
      date: '2024-03-20',
      type: 'Annual Report',
      size: '5.8 MB',
      downloadUrl: '/reports/annual-2023.pdf'
    },
    {
      title: 'Q2 2024 Financial Results',
      date: '2024-07-18',
      type: 'Quarterly Report',
      size: '1.9 MB',
      downloadUrl: '/reports/q2-2024-results.pdf'
    },
    {
      title: 'Sustainability Report 2023',
      date: '2024-04-12',
      type: 'ESG Report',
      size: '3.2 MB',
      downloadUrl: '/reports/sustainability-2023.pdf'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Q4 2024 Earnings Call',
      date: '2024-12-15',
      time: '16:00 GMT',
      type: 'Earnings Call',
      description: 'Quarterly earnings conference call with management'
    },
    {
      title: 'Annual Shareholders Meeting',
      date: '2024-12-20',
      time: '14:00 GMT',
      type: 'AGM',
      description: 'Annual general meeting for shareholders'
    },
    {
      title: 'Investor Day 2025',
      date: '2025-02-10',
      time: '10:00 GMT',
      type: 'Investor Event',
      description: 'Strategic outlook and business update for investors'
    }
  ];

  const keyMetrics = [
    { metric: 'Revenue Growth (YoY)', value: '23%', trend: 'up' },
    { metric: 'Gross Profit Margin', value: '42%', trend: 'up' },
    { metric: 'EBITDA Margin', value: '28%', trend: 'up' },
    { metric: 'Free Cash Flow', value: '$6.2M', trend: 'up' },
    { metric: 'Return on Equity', value: '15.8%', trend: 'up' },
    { metric: 'Debt-to-Equity Ratio', value: '0.32', trend: 'down' }
  ];

  return (
    <>
      <Head>
        <title>Investor Relations - Financial Reports & Updates | Kirastay</title>
        <meta name="description" content="Access Kirastay's financial reports, earnings updates, and investor information. Stay informed about our company performance and growth in Morocco's travel industry." />
        <meta name="keywords" content="investor relations, financial reports, earnings, stock information, annual reports, quarterly results, Kirastay investors" />
        <meta property="og:title" content="Investor Relations - Financial Reports & Updates | Kirastay" />
        <meta property="og:description" content="Access financial reports, earnings updates, and investor information for Kirastay." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/investor-relations" />
      </Head>

      <Header />

      {/* Breadcrumb Area */}
      <section className="breadcrumb-area bread-bg-13">
        <div className="breadcrumb-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="breadcrumb-content">
                  <div className="section-heading">
                    <h2 className="sec__title text-white">Investor Relations</h2>
                    <p className="sec__desc text-white">Financial information and company updates</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Company</li>
                    <li>Investor Relations</li>
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

      {/* Financial Highlights */}
      <section className="funfact-area padding-top-100px padding-bottom-70px">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Financial Highlights</h2>
                <p className="sec__desc">
                  Key financial metrics and performance indicators for FY 2024.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {financialHighlights.map((highlight, index) => (
              <div key={index} className="col-lg-3 responsive-column">
                <div className="counter-item counter-item-layout-3">
                  <div className="counter-icon">
                    <i className={highlight.icon}></i>
                  </div>
                  <div className="counter-content">
                    <div>
                      <span className="counter-num">{highlight.value}</span>
                      <span className={`change-indicator ${highlight.change.startsWith('+') ? 'positive' : 'negative'}`}>
                        {highlight.change}
                      </span>
                    </div>
                    <p className="counter-text">{highlight.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Information Tabs */}
      <section className="investor-content padding-top-60px padding-bottom-90px section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-shared">
                <ul className="nav nav-tabs justify-content-center" role="tablist">
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      role="tab"
                    >
                      <i className="la la-chart-bar"></i>
                      Overview
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reports')}
                      role="tab"
                    >
                      <i className="la la-file-alt"></i>
                      Reports
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                      onClick={() => setActiveTab('events')}
                      role="tab"
                    >
                      <i className="la la-calendar"></i>
                      Events
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className={`nav-link ${activeTab === 'governance' ? 'active' : ''}`}
                      onClick={() => setActiveTab('governance')}
                      role="tab"
                    >
                      <i className="la la-gavel"></i>
                      Governance
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tab-content margin-top-50px">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-pane active">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="overview-content">
                      <h3 className="content-title">Company Overview</h3>
                      <p className="content-desc">
                        Kirastay is Morocco's leading travel and accommodation platform, 
                        connecting travelers with authentic Moroccan experiences. Since our founding, 
                        we have grown to become a trusted partner for both travelers and hospitality providers.
                      </p>
                      
                      <h4 className="metrics-title">Key Performance Metrics</h4>
                      <div className="metrics-grid">
                        {keyMetrics.map((metric, index) => (
                          <div key={index} className="metric-item">
                            <div className="metric-label">{metric.metric}</div>
                            <div className="metric-value">
                              {metric.value}
                              <span className={`trend-arrow ${metric.trend}`}>
                                <i className={`la la-arrow-${metric.trend === 'up' ? 'up' : 'down'}`}></i>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="sidebar-content">
                      <div className="info-box">
                        <h4 className="info-title">Stock Information</h4>
                        <div className="stock-info">
                          <div className="stock-item">
                            <span className="stock-label">Current Price</span>
                            <span className="stock-value">$24.85</span>
                          </div>
                          <div className="stock-item">
                            <span className="stock-label">Day Change</span>
                            <span className="stock-value positive">+$0.45 (+1.8%)</span>
                          </div>
                          <div className="stock-item">
                            <span className="stock-label">52-Week High</span>
                            <span className="stock-value">$28.90</span>
                          </div>
                          <div className="stock-item">
                            <span className="stock-label">52-Week Low</span>
                            <span className="stock-value">$18.45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="tab-pane active">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="content-title">Financial Reports & Documents</h3>
                    <p className="content-desc margin-bottom-40px">
                      Access our latest financial reports, annual reports, and other investor documents.
                    </p>
                  </div>
                </div>
                <div className="row">
                  {recentReports.map((report, index) => (
                    <div key={index} className="col-lg-6 responsive-column">
                      <div className="report-item">
                        <div className="report-icon">
                          <i className="la la-file-pdf"></i>
                        </div>
                        <div className="report-content">
                          <h4 className="report-title">{report.title}</h4>
                          <div className="report-meta">
                            <span className="report-date">
                              <i className="la la-calendar"></i>
                              {new Date(report.date).toLocaleDateString()}
                            </span>
                            <span className="report-type">
                              <i className="la la-tag"></i>
                              {report.type}
                            </span>
                            <span className="report-size">
                              <i className="la la-file"></i>
                              {report.size}
                            </span>
                          </div>
                        </div>
                        <div className="report-action">
                          <a href={report.downloadUrl} className="download-btn" download>
                            <i className="la la-download"></i>
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="tab-pane active">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="content-title">Upcoming Investor Events</h3>
                    <p className="content-desc margin-bottom-40px">
                      Stay informed about upcoming earnings calls, investor meetings, and corporate events.
                    </p>
                  </div>
                </div>
                <div className="row">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="col-lg-12">
                      <div className="event-item">
                        <div className="event-date">
                          <div className="date-box">
                            <span className="day">{new Date(event.date).getDate()}</span>
                            <span className="month">
                              {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <div className="event-content">
                          <h4 className="event-title">{event.title}</h4>
                          <p className="event-meta">
                            <span className="event-time">
                              <i className="la la-clock"></i>
                              {event.time}
                            </span>
                            <span className="event-type">
                              <i className="la la-tag"></i>
                              {event.type}
                            </span>
                          </p>
                          <p className="event-desc">{event.description}</p>
                        </div>
                        <div className="event-action">
                          <a href="/contact?subject=Event Registration" className="theme-btn theme-btn-small">
                            Register
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Governance Tab */}
            {activeTab === 'governance' && (
              <div className="tab-pane active">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="content-title">Corporate Governance</h3>
                    <p className="content-desc margin-bottom-40px">
                      Information about our board of directors, governance policies, and corporate structure.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="governance-section">
                      <h4 className="section-subtitle">Board of Directors</h4>
                      <div className="director-list">
                        <div className="director-item">
                          <h5>Mohamed Al-Rashid</h5>
                          <span className="director-role">Chairman & CEO</span>
                        </div>
                        <div className="director-item">
                          <h5>Fatima Benali</h5>
                          <span className="director-role">Chief Financial Officer</span>
                        </div>
                        <div className="director-item">
                          <h5>Ahmed Tazi</h5>
                          <span className="director-role">Chief Technology Officer</span>
                        </div>
                        <div className="director-item">
                          <h5>Sarah Johnson</h5>
                          <span className="director-role">Independent Director</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="governance-section">
                      <h4 className="section-subtitle">Governance Documents</h4>
                      <div className="document-list">
                        <a href="/governance/charter.pdf" className="document-link" download>
                          <i className="la la-file-pdf"></i>
                          Corporate Charter
                        </a>
                        <a href="/governance/bylaws.pdf" className="document-link" download>
                          <i className="la la-file-pdf"></i>
                          Corporate Bylaws
                        </a>
                        <a href="/governance/audit-committee.pdf" className="document-link" download>
                          <i className="la la-file-pdf"></i>
                          Audit Committee Charter
                        </a>
                        <a href="/governance/code-of-conduct.pdf" className="document-link" download>
                          <i className="la la-file-pdf"></i>
                          Code of Conduct
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Investor Contact */}
      <section className="contact-area padding-top-100px padding-bottom-90px">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Investor Contact</h2>
                <p className="sec__desc">
                  Get in touch with our investor relations team for any questions or inquiries.
                </p>
              </div>
              <div className="contact-info-wrapper">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="contact-item text-center">
                      <div className="contact-icon">
                        <i className="la la-envelope"></i>
                      </div>
                      <div className="contact-content">
                        <h4 className="contact-title">Email</h4>
                        <p className="contact-text">
                          <a href="mailto:investors@kirastay.com">investors@kirastay.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="contact-item text-center">
                      <div className="contact-icon">
                        <i className="la la-phone"></i>
                      </div>
                      <div className="contact-content">
                        <h4 className="contact-title">Phone</h4>
                        <p className="contact-text">
                          <a href="tel:+212520123456">+212 520 123 456</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="contact-item text-center">
                      <div className="contact-icon">
                        <i className="la la-map-marker"></i>
                      </div>
                      <div className="contact-content">
                        <h4 className="contact-title">Address</h4>
                        <p className="contact-text">
                          123 Hassan II Blvd<br />
                          Casablanca, Morocco
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="cta-area section-bg-2 padding-top-100px padding-bottom-100px text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="section-heading">
                <h2 className="sec__title text-white mb-3">Invest in Morocco's Travel Future</h2>
                <p className="sec__desc text-white">
                  Join us in shaping the future of travel in Morocco. With strong growth fundamentals 
                  and expanding market opportunities, Kirastay offers compelling investment potential.
                </p>
              </div>
              <div className="btn-box margin-top-40px">
                <a href="mailto:investors@kirastay.com" className="theme-btn border-0 me-3">
                  Contact Investor Relations
                </a>
                <a href="/reports/latest-investor-presentation.pdf" className="theme-btn theme-btn-white" download>
                  Download Investor Deck
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
        .counter-item {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .counter-icon {
          font-size: 48px;
          color: #3182ce;
          margin-bottom: 20px;
        }
        
        .counter-num {
          font-size: 36px;
          font-weight: 700;
          color: #2d3748;
          margin-right: 10px;
        }
        
        .change-indicator {
          font-size: 16px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }
        
        .change-indicator.positive {
          background: #c6f6d5;
          color: #22543d;
        }
        
        .change-indicator.negative {
          background: #fed7d7;
          color: #742a2a;
        }
        
        .counter-text {
          color: #4a5568;
          font-weight: 500;
          margin-top: 10px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        
        .metric-item {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .metric-label {
          color: #718096;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .trend-arrow.up {
          color: #38a169;
        }
        
        .trend-arrow.down {
          color: #e53e3e;
        }
        
        .report-item {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }
        
        .report-item:hover {
          transform: translateY(-3px);
        }
        
        .report-icon {
          font-size: 36px;
          color: #e53e3e;
          margin-right: 20px;
        }
        
        .report-content {
          flex: 1;
        }
        
        .report-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .report-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .report-meta span {
          font-size: 13px;
          color: #718096;
          display: flex;
          align-items: center;
        }
        
        .report-meta i {
          margin-right: 5px;
        }
        
        .download-btn {
          background: #3182ce;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s ease;
        }
        
        .download-btn:hover {
          background: #2c5aa0;
          color: white;
        }
        
        .event-item {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }
        
        .event-item:hover {
          transform: translateY(-3px);
        }
        
        .event-date {
          margin-right: 25px;
        }
        
        .date-box {
          background: #3182ce;
          color: white;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          min-width: 70px;
        }
        
        .day {
          display: block;
          font-size: 24px;
          font-weight: 700;
        }
        
        .month {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        
        .event-content {
          flex: 1;
        }
        
        .event-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .event-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }
        
        .event-meta span {
          font-size: 13px;
          color: #718096;
          display: flex;
          align-items: center;
        }
        
        .event-meta i {
          margin-right: 5px;
        }
        
        .event-desc {
          color: #4a5568;
          font-size: 14px;
        }
        
        .governance-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .section-subtitle {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .director-item {
          padding: 15px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .director-item:last-child {
          border-bottom: none;
        }
        
        .director-item h5 {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .director-role {
          color: #718096;
          font-size: 14px;
        }
        
        .document-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .document-link {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f7fafc;
          border-radius: 8px;
          text-decoration: none;
          color: #2d3748;
          transition: background 0.3s ease;
        }
        
        .document-link:hover {
          background: #edf2f7;
          color: #2d3748;
        }
        
        .document-link i {
          margin-right: 10px;
          color: #e53e3e;
          font-size: 18px;
        }
        
        .info-box {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .info-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .stock-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .stock-item:last-child {
          border-bottom: none;
        }
        
        .stock-label {
          color: #718096;
          font-size: 14px;
        }
        
        .stock-value {
          font-weight: 600;
          color: #2d3748;
        }
        
        .stock-value.positive {
          color: #38a169;
        }
        
        .nav-link {
          color: #4a5568;
          border: none;
          border-bottom: 3px solid transparent;
          background: none;
          padding: 15px 25px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .nav-link.active {
          color: #3182ce;
          border-bottom-color: #3182ce;
          background: none;
        }
        
        .nav-link:hover {
          color: #3182ce;
          background: none;
        }
        
        .content-title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .content-desc {
          color: #4a5568;
          line-height: 1.6;
        }
        
        .metrics-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 30px 0 10px 0;
        }
        
        .contact-item {
          margin-bottom: 40px;
        }
        
        .contact-icon {
          font-size: 48px;
          color: #3182ce;
          margin-bottom: 20px;
        }
        
        .contact-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .contact-text a {
          color: #3182ce;
          text-decoration: none;
        }
        
        .contact-text a:hover {
          text-decoration: underline;
        }
        
        .section-bg {
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}
