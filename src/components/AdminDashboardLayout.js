'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import NotificationHeader from './NotificationHeader';
import MessageHeader from './MessageHeader';

export default function AdminDashboardLayout({ children, pageTitle, breadcrumbs = [] }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notification');
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const userDropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchRecentMessages = useCallback(async () => {
    if (!user) return;
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRecentMessages((data.conversations || []).slice(0, 5));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  }, [user]);

  useEffect(() => {
    if (userMenuOpen && activeTab === 'message') {
      fetchRecentMessages();
    }
  }, [userMenuOpen, activeTab, fetchRecentMessages]);

  const handleMessageHeaderClick = () => {
    setActiveTab('message');
    setUserMenuOpen(true);
  };

  const isActiveRoute = (route) => {
    return pathname === route || pathname.startsWith(route + '/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <>
      {/* Impersonation Banner */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      {typeof window !== 'undefined' && null}
      {/* User Canvas Menu */}
      <div className={`user-canvas-container ${userMenuOpen ? 'user-canvas-container-open' : ''}`}>
        <div className="side-menu-close" onClick={() => setUserMenuOpen(false)}>
          <i className="la la-times"></i>
        </div>
        <div className="user-canvas-nav">
          <div className="section-tab section-tab-2 text-center pt-4 pb-3 ps-4">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'notification' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('notification'); }}
                  href="#" 
                  role="tab"
                >
                  Notifications
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'message' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('message'); }}
                  href="#" 
                  role="tab"
                >
                  Messages
                  {unreadCount > 0 && <span className="badge bg-danger ms-1">{unreadCount}</span>}
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'account' ? 'active' : ''}`} 
                  onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}
                  href="#" 
                  role="tab"
                >
                  Account
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="user-canvas-nav-content">
          <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${activeTab === 'notification' ? 'show active' : ''}`} id="notification" role="tabpanel">
              <div className="user-sidebar-item">
                <div className="notification-item">
                  <div className="list-group drop-reveal-list">
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element flex-shrink-0 me-3 ms-0">
                          <i className="la la-bell"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">New booking received</h3>
                          <p className="msg-text">2 min ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element bg-2 flex-shrink-0 me-3 ms-0">
                          <i className="la la-check"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Payment confirmed</h3>
                          <p className="msg-text">1 day ago</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-pane fade ${activeTab === 'message' ? 'show active' : ''}`} id="message" role="tabpanel">
              <div className="user-sidebar-item">
                <div className="notification-item">
                  <div className="list-group drop-reveal-list">
                    {loadingMessages ? (
                      <div className="p-4 text-center">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : recentMessages.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <i className="la la-inbox display-4 mb-2"></i>
                        <p className="small">No recent messages</p>
                      </div>
                    ) : (
                      recentMessages.map(msg => (
                        <Link 
                          href={`/admin/chat?id=${msg.conversation_id}`} 
                          key={msg.conversation_id} 
                          className="list-group-item list-group-item-action"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="msg-body d-flex align-items-center">
                            <div className="avatar flex-shrink-0 me-3">
                              {msg.profile_image ? (
                                <img src={msg.profile_image} alt="" style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                              ) : (
                                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#495057'}}>
                                  <i className="la la-user"></i>
                                </div>
                              )}
                            </div>
                            <div className="msg-content w-100">
                              <div className="d-flex align-items-center justify-content-between">
                                <h3 className="title pb-1" style={{fontWeight: msg.unread_count > 0 ? 'bold' : 'normal'}}>
                                  {msg.title || (msg.first_name ? `${msg.first_name} ${msg.last_name}` : msg.other_participants) || 'Chat'}
                                </h3>
                                <span className="msg-text small text-muted">
                                  {new Date(msg.last_message_at || msg.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                              <p className="msg-text text-truncate" style={{maxWidth: '200px', fontWeight: msg.unread_count > 0 ? '600' : '400'}}>
                                {msg.last_message || 'No messages'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                    <div className="text-center pt-3">
                       <Link href="/admin/chat" className="theme-btn theme-btn-small w-100" onClick={() => setUserMenuOpen(false)}>View All Messages</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-pane fade ${activeTab === 'account' ? 'show active' : ''}`} id="account" role="tabpanel">
              <div className="user-sidebar-item">
                <div className="notification-item">
                  <div className="list-group drop-reveal-list">
                    <Link href="/admin/dashboard-profile" className="list-group-item list-group-item-action">
                      <div className="msg-body">
                        <div className="msg-content">
                          <h3 className="title">
                            <i className="la la-user me-2"></i>My Profile
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <Link href="/admin/settings" className="list-group-item list-group-item-action">
                      <div className="msg-body">
                        <div className="msg-content">
                          <h3 className="title">
                            <i className="la la-gear me-2"></i>Settings
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <div className="section-block"></div>
                    <a href="/" className="list-group-item list-group-item-action">
                      <div className="msg-body">
                        <div className="msg-content">
                          <h3 className="title">
                            <i className="la la-power-off me-2"></i>Logout
                          </h3>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className={`sidebar-nav sidebar--nav ${sidebarOpen ? 'sidebar-nav-open' : ''}`}>
        <div className="sidebar-nav-body">
          <div className="side-menu-close" onClick={() => setSidebarOpen(false)}>
            <i className="la la-times"></i>
          </div>
          <div className="author-content">
            <div className="d-flex align-items-center">
              <div className="author-img avatar-sm">
                <img src="/html-folder/images/team9.jpg" alt="admin" />
              </div>
              <div className="author-bio">
                <h4 className="author__title">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'System Administrator'}</h4>
                <span className="author__meta">Welcome to {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
              </div>
            </div>
          </div>
          <div className="sidebar-menu-wrap">
            <ul className="sidebar-menu toggle-menu list-items">
              <li className={isActiveRoute('/admin') && pathname === '/admin' ? 'page-active' : ''}>
                <Link href="/admin">
                  <i className="la la-dashboard me-2 text-color"></i>Dashboard
                </Link>
              </li>
              <li className={isActiveRoute('/admin/bookings') ? 'page-active' : ''}>
                <Link href="/admin/bookings">
                  <i className="la la-shopping-cart me-2"></i>Bookings
                </Link>
              </li>
              <li className={isActiveRoute('/admin/vehicles') ? 'page-active' : ''}>
                <Link href="/admin/vehicles">
                  <i className="la la-car me-2 text-color-2"></i>Vehicles
                </Link>
              </li>
              <li className={isActiveRoute('/admin/customers') ? 'page-active' : ''}>
                <Link href="/admin/customers">
                  <i className="la la-users me-2 text-color-3"></i>Customers
                </Link>
              </li>
              <li className={isActiveRoute('/admin/reviews') ? 'page-active' : ''}>
                <Link href="/admin/reviews">
                  <i className="la la-star me-2 text-color-5"></i>Reviews
                </Link>
              </li>
              <li className={isActiveRoute('/admin/chat') ? 'page-active' : ''}>
                <Link href="/admin/chat" className="d-flex align-items-center justify-content-between pe-3">
                  <span><i className="la la-comments me-2 text-color-6"></i>Chat</span>
                  {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                </Link>
              </li>
              <li className={isActiveRoute('/admin/agencies') ? 'page-active' : ''}>
                <Link href="/admin/agencies">
                  <i className="la la-building me-2 text-color-7"></i>Agencies
                </Link>
              </li>
              <li className={isActiveRoute('/admin/locations') ? 'page-active' : ''}>
                <span className="side-menu-icon toggle-menu-icon">
                  <i className="la la-angle-down"></i>
                </span>
                <Link href="/admin/locations">
                  <i className="la la-map-signs me-2 text-color-9"></i>Locations
                </Link>
                <ul className="toggle-drop-menu">
                  <li><Link href="/admin/locations/countries">Countries</Link></li>
                  <li><Link href="/admin/locations/cities">Cities</Link></li>
                </ul>
              </li>
              <li className={isActiveRoute('/admin/finance') ? 'page-active' : ''}>
                <span className="side-menu-icon toggle-menu-icon">
                  <i className="la la-angle-down"></i>
                </span>
                <Link href="/admin/finance">
                  <i className="la la-area-chart me-2 text-color-8"></i>Finance
                </Link>
                <ul className="toggle-drop-menu">
                  <li><Link href="/admin/finance/payments">Payments</Link></li>
                  <li><Link href="/admin/finance/reports">Reports</Link></li>
                </ul>
              </li>
              <li className={isActiveRoute('/admin/settings') ? 'page-active' : ''}>
                <Link href="/admin/settings">
                  <i className="la la-cog me-2 text-color-10"></i>Settings
                </Link>
              </li>
              <li>
                <button 
                  className="list-group-item list-group-item-action border-0 bg-transparent"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await logout();
                    } catch (_) {}
                  }}
                >
                  <i className="la la-power-off me-2 text-color-11"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Dashboard Area */}
      {/* Impersonation banner at top of main area - import dynamically to avoid SSR issues */}
      {/* We include it here: */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <div style={{position:'relative', zIndex: 2000}}>
        {require('./ImpersonationBanner').default && require('./ImpersonationBanner').default()}
      </div>
      <section className="dashboard-area">
        {/* Top Navigation */}
        <div className="dashboard-nav dashboard--nav">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="menu-wrapper">
                  <div className="logo me-5">
                    <Link href="/">
                      <img src="/html-folder/images/logo2.png" alt="logo" />
                    </Link>
                    <div className="menu-toggler" onClick={toggleSidebar}>
                      <i className="la la-bars"></i>
                      <i className="la la-times"></i>
                    </div>
                    <div className="user-menu-open" onClick={toggleUserMenu}>
                      <i className="la la-user"></i>
                    </div>
                  </div>
                  <div className="dashboard-search-box">
                    <div className="contact-form-action">
                      <form>
                        <div className="form-group mb-0">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Search bookings, customers, vehicles..."
                          />
                          <button type="submit" className="search-btn">
                            <i className="la la-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="nav-btn ms-auto">
                    <div className="notification-wrap d-flex align-items-center">
                      <NotificationHeader />
                      <MessageHeader onClick={handleMessageHeaderClick} />
                      <div className="notification-item" ref={userDropdownRef}>
                        <div className="dropdown">
                          <a
                            href="#"
                            id="userDropdownMenu"
                            className="dropdown-toggle"
                            aria-haspopup="true"
                            aria-expanded={userDropdownOpen ? 'true' : 'false'}
                            onClick={(e) => { e.preventDefault(); toggleUserDropdown(); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 10px',
                              border: '1px solid #dee2e6',
                              borderRadius: '20px',
                              backgroundColor: '#fff',
                              color: '#212529',
                              transition: 'all .2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                              e.currentTarget.style.borderColor = '#cbd3da';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#fff';
                              e.currentTarget.style.borderColor = '#dee2e6';
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm flex-shrink-0 me-2">
                                <img 
                                  alt="profile-img" 
                                  src={user?.profile_image || '/html-folder/images/team9.jpg'} 
                                  style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 2px #fff inset'}}
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23dc3545'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='14'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E"; }}
                                />
                              </div>
                              <div className="user-info" style={{ color: '#212529' }}>
                                <span className="font-size-14 font-weight-bold d-block" style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#212529' }}>
                                  {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'System Administrator'}
                                </span>
                                <span className="font-size-12 text-muted" style={{ display: 'block', lineHeight: 1, color: '#6c757d' }}>
                                  {user?.role === 'admin' ? 'Administrator' : user?.role || 'User'}
                                </span>
                              </div>
                            </div>
                          </a>
                          <div 
                            className={`dropdown-menu dropdown-reveal dropdown-menu-md dropdown-menu-right ${userDropdownOpen ? 'show' : ''}`}
                            style={{ display: userDropdownOpen ? 'block' : 'none' }}
                          >
                            <div className="dropdown-item drop-reveal-header user-reveal-header">
                              <h6 className="title text-uppercase">Welcome!</h6>
                              <p className="mb-0 text-muted small">{user?.email || 'No email'}</p>
                            </div>
                            <div className="list-group drop-reveal-list user-drop-reveal-list">
                              <Link href="/admin/dashboard-profile" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-user me-2"></i>Edit Profile
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <Link href="/admin/dashboard-orders" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-shopping-cart me-2"></i>Orders
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <Link href="/admin/users" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-users me-2"></i>Users
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <Link href="/admin/agencies" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-building me-2"></i>Agencies
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <Link href="/admin/dashboard-settings" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-gear me-2"></i>Settings
                                    </h3>
                                  </div>
                                </div>
                              </Link>
                              <div className="section-block"></div>
                              <button 
                                className="list-group-item list-group-item-action btn btn-link text-start" 
                                onClick={() => {
                                  setUserDropdownOpen(false);
                                  logout();
                                  router.push('/');
                                }}
                                style={{border: 'none', background: 'none'}}
                              >
                                <div className="msg-body">
                                  <div className="msg-content">
                                    <h3 className="title">
                                      <i className="la la-power-off me-2"></i>Logout
                                    </h3>
                                  </div>
                                </div>
                              </button>
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

        {/* Dashboard Content */}
        <div className="dashboard-content-wrap">
          {/* Breadcrumb */}
          <div className="dashboard-bread dashboard--bread dashboard-bread-2">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="breadcrumb-content">
                    <div className="section-heading">
                      <h2 className="sec__title font-size-30 text-white">{pageTitle}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="breadcrumb-list text-end">
                    <ul className="list-items">
                      <li><Link href="/" className="text-white">Home</Link></li>
                      <li><Link href="/admin" className="text-white">Dashboard</Link></li>
                      {breadcrumbs.map((breadcrumb, index) => (
                        <li key={index}>{breadcrumb}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-main-content">
            <div className="container-fluid">
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
