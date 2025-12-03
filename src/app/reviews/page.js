'use client';

import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignupModal from '../../components/SignupModal';
import LoginModal from '../../components/LoginModal';
import { useI18n } from '../../i18n/I18nProvider';

export default function ReviewsPage() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0, ratingDistribution: { 5:0,4:0,3:0,2:0,1:0 } });

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('/api/reviews?status=approved&limit=50&sort_by=created_at&sort_order=DESC', { cache: 'no-store' }),
        fetch('/api/reviews/stats?status=approved', { cache: 'no-store' })
      ]);
      const listData = await listRes.json();
      const statsJson = await statsRes.json();

      const items = Array.isArray(listData?.reviews) ? listData.reviews : [];
      setReviews(items);

      const total = Number(statsJson?.stats?.total_reviews || 0);
      const breakdown = statsJson?.stats?.breakdown || { 5:0,4:0,3:0,2:0,1:0 };
      const ratingDistribution = { 5:0,4:0,3:0,2:0,1:0 };
      if (total > 0) {
        [5,4,3,2,1].forEach(star => {
          const count = Number(breakdown[star] || 0);
          ratingDistribution[star] = Math.round((count / total) * 100);
        });
      }

      setStats({
        average_rating: Number(statsJson?.stats?.average_rating || 0),
        total_reviews: total,
        ratingDistribution,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSorted = useMemo(() => {
    let rows = [...reviews];
    if (filterRating !== 'all') {
      rows = rows.filter(r => Number(r.overall_rating) === Number(filterRating));
    }
    switch (sortBy) {
      case 'newest':
        rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'highest':
        rows.sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0));
        break;
      case 'lowest':
        rows.sort((a, b) => (a.overall_rating || 0) - (b.overall_rating || 0));
        break;
      case 'helpful':
        rows.sort((a, b) => (b.helpful_votes || 0) - (a.helpful_votes || 0));
        break;
      default:
        break;
    }
    return rows;
  }, [reviews, filterRating, sortBy]);

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

  const renderStars = (rating) => {
    const n = Math.round(rating || 0);
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`la ${i < n ? 'la-star text-warning' : 'la-star-o text-muted'}`}
      ></i>
    ));
  };

  return (
    <>
      <Head>
        <title>Customer Reviews - Kirastay | Car Rental Reviews</title>
        <meta name="description" content="Read genuine customer reviews of Kirastay car rental services. See what travelers say about our vehicles, agencies, and booking experience." />
        <meta name="keywords" content="kirastay reviews, car rental reviews, customer testimonials, travel reviews, booking feedback" />
        <meta property="og:title" content="Customer Reviews - Kirastay" />
        <meta property="og:description" content="Read genuine customer reviews of Kirastay car rental services and booking experience." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/reviews" />
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
                    <h2 className="sec__title text-white">Customer Reviews</h2>
                    <p className="sec__desc text-white">See what our customers say about us</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="breadcrumb-list text-end">
                  <ul className="list-items">
                    <li><a href="/">Home</a></li>
                    <li>Community</li>
                    <li>Reviews</li>
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

      {/* Reviews Statistics */}
      <section className="review-stats-area padding-top-60px padding-bottom-40px">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="stats-card">
                <div className="overall-rating">
                  <h2 className="rating-number">{stats.average_rating || 0}</h2>
                  <div className="rating-stars">
                    {renderStars(stats.average_rating)}
                  </div>
                  <p className="total-reviews">Based on {stats.total_reviews?.toLocaleString?.() || 0} reviews</p>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="rating-row">
                    <span className="star-label">{star} star</span>
                    <div className="rating-bar">
                      <div 
                        className="rating-fill" 
                        style={{ width: `${stats.ratingDistribution[star]}%` }}
                      ></div>
                    </div>
                    <span className="rating-percentage">{stats.ratingDistribution[star]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Sort */}
      <section className="filter-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="filter-bar">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="filter-options">
                      <label>Filter by Rating:</label>
                      <select 
                        className="form-control filter-select"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="sort-options text-end">
                      <label>Sort by:</label>
                      <select 
                        className="form-control sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="helpful">Most Helpful</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Listing */}
      <section className="reviews-area section--padding">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="row">
              {filteredSorted.map((rev) => (
                <div key={rev.review_id} className="col-lg-12">
                  <div className="review-card">
                    <div className="review-header">
                      <div className="customer-info">
                        <img 
                          src={'/html-folder/images/customer-default.jpg'} 
                          alt={rev.customer_name || 'Customer'}
                          className="customer-avatar"
                        />
                        <div className="customer-details">
                          <h4 className="customer-name">
                            {rev.customer_name || 'Customer'}
                            {rev.reservation_status === 'completed' && (
                              <span className="verified-badge">
                                <i className="la la-check-circle"></i>
                                Verified
                              </span>
                            )}
                          </h4>
                          <div className="review-meta">
                            <span className="review-date">{rev.created_at_formatted}</span>
                            <span className="separator">•</span>
                            <span className="review-location">{rev.agency_name || 'Agency'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        <div className="stars">
                          {renderStars(rev.overall_rating)}
                        </div>
                        <span className="rating-text">{rev.overall_rating}/5</span>
                      </div>
                    </div>
                    
                    <div className="review-body">
                      <h3 className="review-title">{rev.title}</h3>
                      <p className="review-content">{rev.comment}</p>
                      
                      <div className="booking-details">
                        <span className="car-model">
                          <i className="la la-car"></i>
                          {rev.vehicle_display_name}
                        </span>
                        <span className="agency-name">
                          <i className="la la-building"></i>
                          {rev.agency_name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="review-footer">
                      <button className="helpful-btn">
                        <i className="la la-thumbs-up"></i>
                        Helpful ({rev.helpful_votes || 0})
                      </button>
                      <button className="reply-btn">
                        <i className="la la-reply"></i>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Write Review CTA */}
          <div className="row margin-top-60px">
            <div className="col-lg-12">
              <div className="write-review-cta">
                <div className="cta-content text-center">
                  <h3>Share Your Experience</h3>
                  <p>Help other travelers by sharing your car rental experience with Kirastay.</p>
                  <a href="/customer/dashboard" className="theme-btn">
                    Write a Review
                  </a>
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
        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .overall-rating .rating-number {
          font-size: 48px;
          font-weight: 700;
          color: #3182ce;
          margin-bottom: 10px;
        }
        
        .rating-stars {
          margin-bottom: 15px;
          font-size: 20px;
        }
        
        .total-reviews {
          color: #718096;
          margin: 0;
        }
        
        .rating-breakdown {
          padding: 20px;
        }
        
        .rating-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .star-label {
          min-width: 60px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .rating-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .rating-fill {
          height: 100%;
          background: #3182ce;
          transition: width 0.3s ease;
        }
        
        .rating-percentage {
          min-width: 40px;
          color: #4a5568;
          font-weight: 500;
          text-align: right;
        }
        
        .filter-bar {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 40px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .filter-options, .sort-options {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .filter-select, .sort-select {
          width: auto;
          min-width: 150px;
        }
        
        .review-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        
        .review-card:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .customer-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .customer-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .customer-name {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .verified-badge {
          background: #38a169;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .review-meta {
          color: #718096;
          font-size: 14px;
        }
        
        .separator {
          margin: 0 8px;
        }
        
        .review-rating {
          text-align: right;
        }
        
        .review-rating .stars {
          margin-bottom: 5px;
        }
        
        .rating-text {
          color: #3182ce;
          font-weight: 600;
          font-size: 14px;
        }
        
        .review-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .review-content {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .booking-details {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .car-model, .agency-name {
          color: #718096;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .review-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          display: flex;
          gap: 15px;
        }
        
        .helpful-btn, .reply-btn {
          background: none;
          border: 1px solid #e2e8f0;
          color: #4a5568;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .helpful-btn:hover, .reply-btn:hover {
          background: #f7fafc;
          border-color: #3182ce;
          color: #3182ce;
        }
        
        .write-review-cta {
          background: linear-gradient(135deg, #3182ce, #2c5aa0);
          color: white;
          border-radius: 12px;
          padding: 50px;
          text-align: center;
        }
        
        .write-review-cta h3 {
          color: white;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .write-review-cta p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-bottom: 25px;
        }
        
        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .filter-options, .sort-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .sort-options {
            align-items: flex-end;
          }
          
          .booking-details {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}
