'use client';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminDashboardReviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total_reviews: 0, average_rating: 0, pending_reviews: 0, breakdown: { 5:0,4:0,3:0,2:0,1:0 } });

  const statsCards = useMemo(() => ([
    {
      title: 'Total Reviews',
      value: String(stats.total_reviews),
      change: '',
      changeType: 'neutral',
      icon: 'la la-star',
      color: 'text-color'
    },
    {
      title: 'Average Rating',
      value: String(stats.average_rating || 0),
      change: '',
      changeType: 'neutral',
      icon: 'la la-star-half-o',
      color: 'text-color-2'
    },
    {
      title: 'Pending Reviews',
      value: String(stats.pending_reviews || 0),
      change: '',
      changeType: 'neutral',
      icon: 'la la-clock-o',
      color: 'text-color-3'
    },
    {
      title: '5-Star Reviews',
      value: String(stats.breakdown[5] || 0),
      change: '',
      changeType: 'neutral',
      icon: 'la la-thumbs-up',
      color: 'text-color-4'
    }
  ]), [stats]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Reviews' }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [listRes, statsRes] = await Promise.all([
          fetch('/api/reviews?status=approved&limit=20', { cache: 'no-store' }),
          fetch('/api/reviews/stats?status=approved', { cache: 'no-store' })
        ]);
        const listData = await listRes.json();
        const statsData = await statsRes.json();
        if (!listRes.ok) throw new Error(listData.error || 'Failed to load reviews');
        if (!statsRes.ok) throw new Error(statsData.error || 'Failed to load stats');
        setReviews(listData.reviews || []);
        setStats(statsData.stats || { total_reviews: 0, average_rating: 0, pending_reviews: 0, breakdown: { 5:0,4:0,3:0,2:0,1:0 } });
      } catch (e) {
        console.error('Admin reviews load error:', e);
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderStars = (n) => (
    [...Array(5)].map((_, i) => (
      <span key={i} className={`la ${i < Math.round(n) ? 'la-star' : 'la-star-o'}`}></span>
    ))
  );

  return (
    <AdminLayout 
      pageTitle="Reviews Management"
      breadcrumbItems={breadcrumbItems}
      showStats={true}
      statsCards={statsCards}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-box">
              <div className="form-title-wrap">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="title">Customer Reviews</h3>
                  <div className="select-contain">
                    <select className="select-contain-select" defaultValue="all">
                      <option value="all">All Reviews</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-content">
                {loading && (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                {!loading && !error && reviews.map((rev) => (
                  <div key={rev.review_id} className="review-item border-bottom pb-4 mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm flex-shrink-0 me-3">
                          <img src="/html-folder/images/team8.jpg" alt="avatar" />
                        </div>
                        <div>
                          <h6 className="font-weight-bold mb-0">{rev.customer_name || 'Customer'}</h6>
                          <small className="text-muted">{rev.agency_name || 'Agency'}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="rating-wrap me-3">
                          <div className="review-stars">
                            {renderStars(rev.overall_rating || 0)}
                          </div>
                        </div>
                        <div className="dropdown">
                          <a href="#" className="theme-btn theme-btn-small theme-btn-transparent" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="la la-dot-circle-o"></i>
                            <i className="la la-dot-circle-o"></i>
                            <i className="la la-dot-circle-o"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a href="#" className="dropdown-item"><i className="la la-check me-2"></i>Approve</a>
                            <a href="#" className="dropdown-item"><i className="la la-eye-slash me-2"></i>Hide</a>
                            <a href="#" className="dropdown-item text-danger"><i className="la la-trash me-2"></i>Delete</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="review-content">
                      <p className="review-desc">{rev.comment}</p>
                      <div className="review-meta d-flex align-items-center justify-content-between mt-3">
                        <span className="review-date text-muted">{rev.created_at_formatted}</span>
                        <span className="badge bg-success text-white">{rev.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Statistics */}
        <div className="row mt-4">
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Total Reviews</p>
                  <h4 className="info__title">{stats.total_reviews}</h4>
                </div>
                <div className="info-icon icon-element bg-1">
                  <i className="la la-star"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Average Rating</p>
                  <h4 className="info__title">{stats.average_rating || 0}</h4>
                </div>
                <div className="info-icon icon-element bg-2">
                  <i className="la la-star-half-o"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">Pending Reviews</p>
                  <h4 className="info__title">{stats.pending_reviews || 0}</h4>
                </div>
                <div className="info-icon icon-element bg-3">
                  <i className="la la-clock-o"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 responsive-column-l">
            <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
              <div className="d-flex pb-3 justify-content-between">
                <div className="info-content">
                  <p className="info__desc">5 Star Reviews</p>
                  <h4 className="info__title">{stats.breakdown[5] || 0}</h4>
                </div>
                <div className="info-icon icon-element bg-4">
                  <i className="la la-thumbs-up"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

