'use client';
import { useState, useEffect } from 'react';
import UserLayout from '../../../components/UserLayout';

export default function UserDashboardWishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/wishlist?filter=${filter}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        
        const data = await response.json();
        setWishlistItems(data.wishlist || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [filter]);
  
  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };
  
  if (loading) {
    return (
      <UserLayout 
        pageTitle="My Wishlist"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/user' }, { label: 'Wishlist' }]}
        showStats={false}
      >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading wishlist...</p>
        </div>
      </UserLayout>
    );
  }
  
  if (error) {
    return (
      <UserLayout 
        pageTitle="My Wishlist"
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/user' }, { label: 'Wishlist' }]}
        showStats={false}
      >
        <div className="alert alert-danger text-center">
          <i className="la la-exclamation-triangle me-2"></i>
          {error}
        </div>
      </UserLayout>
    );
  }
  return (
    <UserLayout 
      pageTitle="My Wishlist"
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/user' }, { label: 'Wishlist' }]}
      showStats={false}
    >
      {/* Main Wishlist Content */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-box">
                    <div className="form-title-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <h3 className="title">Saved Tours & Destinations</h3>
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-3">{wishlistItems.length} items saved</span>
                          <div className="select-contain">
                            <select 
                              className="select-contain-select"
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                            >
                              <option value="all">All Items</option>
                              <option value="tours">Tours</option>
                              <option value="destinations">Destinations</option>
                              <option value="hotels">Hotels</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-content">
                      <div className="row">
                        {wishlistItems.length > 0 ? (
                          wishlistItems.map((item, index) => (
                            <div key={item.id || index} className="col-lg-6 col-xl-4">
                              <div className="card-item wishlist-card">
                                <div className="card-img">
                                  <a href={item.detailUrl || `/tour-detail?id=${item.id}`}>
                                    <img src={item.image || item.featured_image || "/html-folder/images/destination1.jpg"} alt="tour-img" />
                                  </a>
                                  <div 
                                    className="add-to-wishlist icon-element" 
                                    title="Remove from Wishlist"
                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                    style={{cursor: 'pointer'}}
                                  >
                                    <i className="la la-heart"></i>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <div className="card-top-title">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="card-meta">{item.location || item.destination || 'Location'}</span>
                                      <div className="card-rating">
                                        <span className="rating-text">{item.rating || '4.5'}</span>
                                        <span className="rating__result">
                                          <i className="la la-star"></i>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <h3 className="card-title">
                                    <a href={item.detailUrl || `/tour-detail?id=${item.id}`}>{item.title || item.name}</a>
                                  </h3>
                                  <p className="card-text">{item.description || item.short_description || 'Tour package'}</p>
                                  <div className="card-price">
                                    <div className="price">
                                      <span className="price__from">From</span>
                                      <span className="price__num">${item.price || item.starting_price || '299'}</span>
                                      <span className="price__text">per person</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="card-footer">
                                  <div className="btn-box">
                                    <a href={item.detailUrl || `/tour-detail?id=${item.id}`} className="theme-btn theme-btn-small w-100">
                                      <i className="la la-eye me-1"></i>View Details
                                    </a>
                                  </div>
                                  <div className="wishlist-meta mt-2">
                                    <small className="text-muted">Added on {new Date(item.added_date || item.created_at).toLocaleDateString()}</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12">
                            <div className="empty-wishlist-item text-center p-5">
                              <div className="empty-icon mb-3">
                                <i className="la la-heart-o" style={{fontSize: '48px', color: '#ccc'}}></i>
                              </div>
                              <h4>Your Wishlist is Empty</h4>
                              <p className="text-muted">Browse our tours and destinations to add items to your wishlist</p>
                              <a href="/tours" className="theme-btn theme-btn-small">
                                <i className="la la-search me-1"></i>Browse Tours
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </UserLayout>
  );
}
