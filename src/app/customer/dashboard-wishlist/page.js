'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import CustomerDashboardLayout from '../../../components/CustomerDashboardLayout';
import Link from 'next/link';

export default function CustomerWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customer/wishlist?customer_email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load wishlist');
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      console.error('Wishlist load error:', e);
      setError(e.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchWishlist();
  }, [user?.email]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push(<i key={i} className="la la-star text-warning"></i>);
    if (hasHalfStar) stars.push(<i key="half" className="la la-star-half-o text-warning"></i>);
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="la la-star-o text-warning"></i>);
    return stars;
  };

  return (
    <CustomerDashboardLayout pageTitle="My Wishlist" breadcrumbs={["Wishlist"]}>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="title">Saved Vehicles ({items.length})</h3>
                <Link href="/search" className="theme-btn theme-btn-small">
                  <i className="la la-search me-1"></i>Browse Vehicles
                </Link>
              </div>
            </div>
            <div className="form-content">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                  <p className="mt-2">Loading your wishlist...</p>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <i className="la la-exclamation-triangle display-1 text-warning"></i>
                  <h4 className="mt-3">Error Loading Wishlist</h4>
                  <p className="text-muted">{error}</p>
                  <button className="btn btn-primary" onClick={fetchWishlist}>
                    <i className="la la-refresh me-2"></i>Try Again
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-5">
                  <i className="la la-heart display-1 text-muted"></i>
                  <h4 className="mt-3">No saved vehicles yet</h4>
                  <p className="text-muted">Start browsing and save your favorite vehicles</p>
                  <Link href="/search" className="btn btn-primary">
                    <i className="la la-search me-2"></i>Browse Vehicles
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {items.map((item) => (
                    <div key={item.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card wishlist-card h-100">
                        <div className="position-relative">
                          <img
                            src={item.image || '/html-folder/images/car-img.jpg'}
                            className="card-img-top"
                            alt={item.vehicleName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236c757d' font-size='48'%3E🚗%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button className="btn btn-sm btn-light wishlist-remove-btn" title="Remove from wishlist">
                            <i className="la la-heart text-danger"></i>
                          </button>
                          <span className="badge vehicle-type-badge">{item.vehicleType || 'Vehicle'}</span>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{item.vehicleName}</h5>
                          <div className="vehicle-rating mb-2">
                            {renderStars(item.rating)}
                            <span className="ms-1 text-muted">({item.rating || 0})</span>
                          </div>
                          <div className="vehicle-location mb-2">
                            <i className="la la-map-marker text-danger"></i>
                            <span className="ms-1">{item.location || ''}</span>
                          </div>
                          <div className="vehicle-price-section">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="price-info">
                                <span className="price-amount">{item.pricePerDay || 0} MAD</span>
                                <small className="text-muted d-block">per day</small>
                              </div>
                              <button className="btn btn-primary btn-sm">
                                <i className="la la-calendar me-1"></i>Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
