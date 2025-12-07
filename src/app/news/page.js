'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SubscribeForm from '../../components/SubscribeForm';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function NewsPage() {
  const { t } = useI18n();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockNews = [
    {
      id: 1,
      title: 'New Electric Vehicle Fleet Added to Kirastay Platform',
      excerpt: 'We are excited to announce the addition of electric vehicles to our rental fleet, promoting sustainable travel across Morocco.',
      content: 'Electric vehicles are now available for rent through our platform, featuring the latest Tesla and Nissan models with excellent range and charging infrastructure support.',
      image: '/html-folder/images/news1.jpg',
      date: '2024-01-20',
      author: 'Kirastay Team',
      category: 'Company News',
      tags: ['electric vehicles', 'sustainability', 'fleet update']
    },
    {
      id: 2,
      title: 'Partnership with Major Moroccan Car Rental Agencies',
      excerpt: 'Kirastay expands its network by partnering with leading car rental agencies across Morocco to offer better coverage and competitive prices.',
      content: 'Our new partnerships bring additional inventory and improved service quality to customers booking through our platform.',
      image: '/html-folder/images/news2.jpg',
      date: '2024-01-18',
      author: 'Partnership Team',
      category: 'Partnerships',
      tags: ['partnerships', 'expansion', 'morocco']
    },
    {
      id: 3,
      title: 'Mobile App Launch: Book Cars on the Go',
      excerpt: 'The new Kirastay mobile application is now available for iOS and Android, making car bookings easier than ever.',
      content: 'Download our mobile app for instant booking, real-time updates, and exclusive mobile-only deals.',
      image: '/html-folder/images/news3.jpg',
      date: '2024-01-15',
      author: 'Product Team',
      category: 'Product Update',
      tags: ['mobile app', 'technology', 'booking']
    },
    {
      id: 4,
      title: 'Travel Safety Guidelines for 2024',
      excerpt: 'Important safety guidelines and recommendations for travelers using rental vehicles in Morocco and internationally.',
      content: 'Stay safe during your travels with our comprehensive safety guidelines covering vehicle inspection, driving tips, and emergency procedures.',
      image: '/html-folder/images/news4.jpg',
      date: '2024-01-12',
      author: 'Safety Team',
      category: 'Travel Tips',
      tags: ['safety', 'travel tips', 'guidelines']
    }
  ];

  useEffect(() => {
    // Simulate loading news
    const timer = setTimeout(() => {
      setNews(mockNews);
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
        <title>News & Updates - Latest from Kirastay | Car Rental Platform</title>
        <meta name="description" content="Stay updated with the latest news, updates, and travel tips from Kirastay. Get insights into new features, partnerships, and travel industry trends." />
        <meta name="keywords" content="kirastay news, travel news, car rental updates, morocco travel, platform updates" />
        <meta property="og:title" content="News & Updates - Latest from Kirastay" />
        <meta property="og:description" content="Stay updated with the latest news, updates, and travel tips from Kirastay." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/news" />
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
                    <h2 className="sec__title text-white">News & Updates</h2>
                    <p className="sec__desc text-white">Stay informed with the latest from Kirastay</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Pages</li>
                    <li>News</li>
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

      {/* News Area */}
      <section className="blog-area section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading text-center margin-bottom-60px">
                <h2 className="sec__title">Latest News & Updates</h2>
                <p className="sec__desc">
                  Stay updated with the latest developments, features, and travel insights from Kirastay.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading latest news...</p>
            </div>
          ) : (
            <div className="row">
              {news.map((article) => (
                <div key={article.id} className="col-lg-6 responsive-column">
                  <div className="card-item blog-card">
                    <div className="card-img">
                      <a href={`/news/${article.id}`} className="d-block">
                        <img 
                          src={article.image || '/html-folder/images/img21.jpg'} 
                          alt={article.title}
                          className="news-image"
                        />
                      </a>
                      <div className="post-format">
                        <i className="la la-newspaper-o"></i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="post-meta">
                        <div className="post-meta-content">
                          <div className="post-meta-details">
                            <span className="post__meta-date">
                              <i className="la la-calendar"></i>
                              {new Date(article.date).toLocaleDateString()}
                            </span>
                            <span className="post-meta-separator"></span>
                            <span className="post__meta-author">
                              <i className="la la-user"></i>
                              {article.author}
                            </span>
                            <span className="post-meta-separator"></span>
                            <span className="post__meta-category">
                              <i className="la la-folder-o"></i>
                              {article.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h3 className="card-title">
                        <a href={`/news/${article.id}`}>
                          {article.title}
                        </a>
                      </h3>
                      <p className="card-text">
                        {article.excerpt}
                      </p>
                      <div className="post-tags mb-3">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="tag-item">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="btn-box">
                        <a href={`/news/${article.id}`} className="theme-btn theme-btn-small">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Newsletter Subscription */}
          <section className="cta-area subscriber-area section-bg-2 padding-top-60px padding-bottom-60px margin-top-80px">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7">
                  <div className="section-heading">
                    <h2 className="sec__title font-size-30 text-white">
                      Subscribe for Latest Updates
                    </h2>
                    <p className="sec__desc text-white">
                      Get the latest news, travel tips, and exclusive offers delivered to your inbox.
                    </p>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="subscriber-box">
                    <div className="contact-form-action">
<SubscribeForm
                        label="Email Address"
                        placeholder="Enter your email address"
                        buttonText="Subscribe"
                        disclaimer="Your email is safe with us"
                        className="contact-form-style-2"
                      />
                    </div>
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
        .blog-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 30px;
        }
        
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .news-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        
        .post-meta {
          margin-bottom: 15px;
        }
        
        .post-meta-details span {
          font-size: 13px;
          color: #718096;
          margin-right: 15px;
        }
        
        .post-meta-separator {
          margin: 0 5px;
        }
        
        .post-meta-separator:before {
          content: "•";
          color: #e2e8f0;
        }
        
        .card-title a {
          color: #2d3748;
          text-decoration: none;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
        }
        
        .card-title a:hover {
          color: #3182ce;
        }
        
        .card-text {
          color: #4a5568;
          line-height: 1.6;
          margin: 15px 0 20px 0;
        }
        
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tag-item {
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .tag-item:hover {
          background: #e2e8f0;
        }
        
        .post-format {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
      `}</style>
    </>
  );
}
