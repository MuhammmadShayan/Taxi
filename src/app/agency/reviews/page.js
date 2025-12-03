'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgencyReviews() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total_reviews: 0, average_rating: 0, pending_reviews: 0, breakdown: { 5:0, 4:0, 3:0, 2:0, 1:0 } });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_reviews: 0, per_page: 10 });

  useEffect(() => {
    if (!isLoading && (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Reviews for this agency are restricted by session on the API
        const res = await fetch(`/api/reviews?status=approved&page=${page}&limit=10`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load reviews');
        setReviews(data.reviews || []);
        setPagination(data.pagination || { current_page: 1, total_pages: 1, total_reviews: 0, per_page: 10 });

        // Stats for this agency
        const statRes = await fetch(`/api/reviews/stats?status=approved`, { cache: 'no-store' });
        const statData = await statRes.json();
        if (statRes.ok && statData?.stats) setStats(statData.stats);
      } catch (e) {
        console.error('Agency reviews load error:', e);
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (user && ['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
      fetchData();
    }
  }, [user, page]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !['agency_owner', 'agency_admin', 'driver'].includes(user.user_type)) {
    return null;
  }

  const renderStars = (n) => (
    [...Array(5)].map((_, i) => (
      <i key={i} className={`la ${i < Math.round(n) ? 'la-star text-warning' : 'la-star-o text-muted'}`}></i>
    ))
  );

  return (
    <>
      {/* CSS imports */}
      <link rel="stylesheet" href="/html-folder/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/html-folder/css/line-awesome.css" />
      <link rel="stylesheet" href="/html-folder/css/style.css" />

      <div className="section-bg">
        {/* Agency Sidebar Navigation */}
        <div className="sidebar-nav sidebar--nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team8.jpg" 
                    alt="Agency avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">{user.first_name} {user.last_name}</h4>
                  <span className="author__meta">Agency Owner</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu toggle-menu list-items">
                <li>
                  <Link href="/agency/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/agency/profile">
                    <i className="la la-user me-2 text-color"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/agency/vehicles">
                    <i className="la la-car me-2 text-color-2"></i>My Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/agency/bookings">
                    <i className="la la-shopping-cart me-2 text-color-3"></i>Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/agency/chat">
                    <i className="la la-comments me-2 text-color-4"></i>Chat
                  </Link>
                </li>
                <li>
                  <Link href="/agency/earnings">
                    <i className="la la-money me-2 text-color-5"></i>Earnings
                  </Link>
                </li>
                <li className="page-active">
                  <Link href="/agency/reviews">
                    <i className="la la-star me-2 text-color-5"></i>Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/agency/settings">
                    <i className="la la-cog me-2 text-color-6"></i>Settings
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <i className="la la-power-off me-2 text-color-7"></i>Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <section className="dashboard-area">
          <div className="dashboard-nav dashboard--nav">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="menu-wrapper">
                    <div className="logo me-5">
                      <Link href="/">
                        <img 
                          src="/html-folder/images/logo.png" 
                          alt="HOLIKEY logo"
                          style={{ maxHeight: '40px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%232563eb' font-size='20' font-weight='bold'%3EHOLIKEY%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </Link>
                      <div className="menu-toggler">
                        <i className="la la-bars"></i>
                        <i className="la la-times"></i>
                      </div>
                      <div className="user-menu-open">
                        <i className="la la-user"></i>
                      </div>
                    </div>
                    <div className="nav-btn ms-auto">
                      <div className="notification-wrap d-flex align-items-center">
                        <div className="notification-item">
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle"
                              id="userDropdownMenu"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-sm flex-shrink-0 me-2">
                                  <img 
                                    src="/html-folder/images/team8.jpg" 
                                    alt="Agency avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff6b35'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E🏢%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <span className="font-size-14 font-weight-bold">{user.first_name}</span>
                              </div>
                            </a>
                            <div className="dropdown-menu dropdown-reveal dropdown-menu-xl dropdown-menu-right">
                              <div className="list-group drop-reveal-list user-drop-reveal-list">
                                <Link href="/agency/profile" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-user me-2"></i>My Profile
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/agency/dashboard" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-dashboard me-2"></i>Dashboard
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <div className="section-block"></div>
                                <Link href="/" className="list-group-item list-group-item-action">
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-power-off me-2"></i>Logout
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-bread dashboard--bread">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">Customer Reviews</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 text-end">
                  <div className="btn-group">
                    <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                      Filter Reviews
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">All Reviews</a></li>
                      <li><a className="dropdown-item" href="#">5 Stars</a></li>
                      <li><a className="dropdown-item" href="#">4 Stars</a></li>
                      <li><a className="dropdown-item" href="#">3 Stars</a></li>
                      <li><a className="dropdown-item" href="#">2 Stars</a></li>
                      <li><a className="dropdown-item" href="#">1 Star</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-main-content">
            <div className="container-fluid">
              {/* Review Summary Cards */}
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="card review-summary-card">
                    <div className="card-body text-center">
                      <div className="review-average">
                        <h2 className="rating-number">{stats.average_rating || 0}</h2>
                        <div className="stars mb-2">
                          {renderStars(stats.average_rating || 0)}
                        </div>
                        <p className="text-muted">Average Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card review-summary-card">
                    <div className="card-body text-center">
                      <h3 className="text-primary">{stats.total_reviews}</h3>
                      <p className="text-muted">Total Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card review-summary-card">
                    <div className="card-body text-center">
                      <h3 className="text-success">{stats.pending_reviews}</h3>
                      <p className="text-muted">Pending (moderation)</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card review-summary-card">
                    <div className="card-body text-center">
                      <h3 className="text-info">{stats.breakdown[5]}</h3>
                      <p className="text-muted">5-Star Reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Recent Reviews</h3>
                    </div>
                    <div className="form-content">
                      <div className="reviews-list">
                        {loading && (
                          <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="alert alert-danger">{error}</div>
                        )}

                        {!loading && !error && reviews.length === 0 && (
                          <div className="text-muted">No reviews found.</div>
                        )}

                        {!loading && !error && reviews.map((rev) => (
                          <div key={rev.review_id} className="review-item">
                            <div className="d-flex">
                              <div className="reviewer-avatar me-3">
                                <img
                                  src={'/html-folder/images/team8.jpg'}
                                  alt={rev.customer_name || 'Customer'}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%23007bff'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='20'%3E👤%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <div className="review-content flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="reviewer-name">{rev.customer_name || 'Customer'}</h6>
                                    <div className="review-stars">
                                      {renderStars(rev.overall_rating || 0)}
                                    </div>
                                  </div>
                                  <small className="text-muted">{rev.created_at_formatted}</small>
                                </div>
                                <div className="vehicle-info mb-2">
                                  <small className="text-primary">{rev.vehicle_display_name || 'Vehicle'} • {rev.license_plate || ''}</small>
                                </div>
                                <p className="review-text">
                                  <strong>{rev.title}</strong><br/>
                                  {rev.comment}
                                </p>
                                <div className="review-actions">
                                  <button className="btn btn-sm btn-outline-primary me-2">
                                    <i className="la la-reply me-1"></i>Reply
                                  </button>
                                  <button className="btn btn-sm btn-outline-success me-2">
                                    <i className="la la-thumbs-up me-1"></i>Helpful
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger">
                                    <i className="la la-flag me-1"></i>Report
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                          <div className="d-flex justify-content-center mt-3">
                            <nav>
                              <ul className="pagination">
                                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                                </li>
                                <li className="page-item disabled"><span className="page-link">Page {pagination.current_page} / {pagination.total_pages}</span></li>
                                <li className={`page-item ${page >= pagination.total_pages ? 'disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}>Next</button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="col-lg-4">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <h3 className="title">Rating Breakdown</h3>
                    </div>
                    <div className="form-content">
                      <div className="rating-breakdown">
                        {[5,4,3,2,1].map((star) => {
                          const total = Number(stats?.total_reviews || 0);
                          const count = Number(stats?.breakdown?.[star] || 0);
                          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                          const barClass = star === 5
                            ? 'bg-success'
                            : star === 4
                            ? 'bg-primary'
                            : star === 3
                            ? 'bg-warning'
                            : star === 2
                            ? 'bg-orange'
                            : 'bg-danger';
                          return (
                            <div key={star} className="rating-row">
                              <div className="d-flex align-items-center mb-2">
                                <span className="rating-label me-2">{star} Stars</span>
                                <div className="progress flex-grow-1 me-2">
                                  <div className={`progress-bar ${barClass}`} style={{width: `${percent}%`}}></div>
                                </div>
                                <span className="rating-count">{count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .dashboard-area {
          margin-left: 280px;
          background-color: #f8f9fa;
        }
        
        .dashboard-bread {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }
        
        .dashboard-main-content {
          padding: 2rem 0;
          background-color: #f8f9fa;
        }
        
        .review-summary-card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }
        
        .rating-number {
          font-size: 3rem;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .stars i {
          font-size: 1.2rem;
          margin-right: 2px;
        }
        
        .review-item {
          padding: 1.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .review-item:last-child {
          border-bottom: none;
        }
        
        .reviewer-avatar img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .reviewer-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .review-stars i {
          font-size: 1rem;
          margin-right: 2px;
        }
        
        .review-text {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .review-actions .btn {
          font-size: 0.875rem;
        }
        
        .rating-breakdown .progress {
          height: 8px;
        }
        
        .rating-label {
          width: 60px;
          font-size: 0.875rem;
        }
        
        .rating-count {
          width: 30px;
          text-align: right;
          font-size: 0.875rem;
          color: #666;
        }
        
        .bg-orange {
          background-color: #fd7e14 !important;
        }
      `}</style>
    </>
  );
}

