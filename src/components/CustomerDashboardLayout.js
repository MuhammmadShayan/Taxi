'use client';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import NotificationHeader from './NotificationHeader';
import MessageHeader from './MessageHeader';
import ImpersonationBanner from './ImpersonationBanner';

export default function CustomerDashboardLayout({ children, pageTitle = "Dashboard", breadcrumbs = [] }) {
  const { user, loading, logout, isCustomer } = useAuth();
  const { unreadCount } = useNotification();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('notification');
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch recent messages when message tab is active
  useEffect(() => {
    if (activeTab === 'message') {
      const fetchMessages = async () => {
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
      };
      fetchMessages();
    }
  }, [activeTab]);

  // Cleanup any leftover Bootstrap modals/backdrops that can cause a dark overlay after navigation
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.querySelectorAll('.modal.show').forEach(modal => {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          modal.style.display = 'none';
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isCustomer())) {
      router.push('/');
    }
  }, [user, loading, isCustomer, router]);

  // User dropdown state (hooks must come before any early returns)
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="preloader" id="preloader">
        <div className="loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            ></circle>
          </svg>
        </div>
      </div>
    );
  }

  if (!user || !isCustomer()) {
    return null;
  }

  return (
    <>
      <div className="section-bg">
        {/* Impersonation banner */}
        <ImpersonationBanner />
        {/* User Canvas Menu */}
        <div className="user-canvas-container">
          <div className="side-menu-close">
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
                  {/* Could render a notifications list here if needed */}
                  <div className="notification-item">
                    <div className="list-group drop-reveal-list">
                      <a href="#" className="list-group-item list-group-item-action">
                        <div className="msg-body d-flex align-items-center">
                          <div className="icon-element flex-shrink-0 me-3 ms-0">
                            <i className="la la-bell"></i>
                          </div>
                          <div className="msg-content w-100">
                            <h3 className="title pb-1">Welcome to KiraStay!</h3>
                            <p className="msg-text">Just now</p>
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
                            href={`/customer/chat?id=${msg.conversation_id}`} 
                            key={msg.conversation_id} 
                            className="list-group-item list-group-item-action"
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
                         <Link href="/customer/chat" className="theme-btn theme-btn-small w-100">View All Messages</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`tab-pane fade ${activeTab === 'account' ? 'show active' : ''}`} id="account" role="tabpanel">
                <div className="user-action-wrap user-sidebar-panel">
                  <div className="notification-item">
                    <Link href="/customer/profile" className="dropdown-item">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm flex-shrink-0 me-2">
                          <img 
                            src="/html-folder/images/team8.jpg" 
                            alt="user-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E👤%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <span className="font-size-14 font-weight-bold">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </Link>
                    <div className="list-group drop-reveal-list user-drop-reveal-list">
                      <Link href="/customer/profile" className="list-group-item list-group-item-action">
                        <div className="msg-body">
                          <div className="msg-content">
                            <h3 className="title">
                              <i className="la la-user me-2"></i>My Profile
                            </h3>
                          </div>
                        </div>
                      </Link>
                      <Link href="/customer/dashboard-booking" className="list-group-item list-group-item-action">
                        <div className="msg-body">
                          <div className="msg-content">
                            <h3 className="title">
                              <i className="la la-shopping-cart me-2"></i>My Booking
                            </h3>
                          </div>
                        </div>
                      </Link>
                      <Link href="/customer/dashboard-wishlist" className="list-group-item list-group-item-action">
                        <div className="msg-body">
                          <div className="msg-content">
                            <h3 className="title">
                              <i className="la la-heart me-2"></i>My Wishlist
                            </h3>
                          </div>
                        </div>
                      </Link>
                      <Link href="/customer/chat" className="list-group-item list-group-item-action">
                        <div className="msg-body">
                          <div className="msg-content d-flex align-items-center justify-content-between">
                            <h3 className="title">
                              <i className="la la-comments me-2"></i>Messages
                            </h3>
                            {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                          </div>
                        </div>
                      </Link>
                      <div className="section-block"></div>
                      <button onClick={handleLogout} className="list-group-item list-group-item-action border-0 bg-transparent">
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

        {/* Sidebar Navigation */}
        <div className="sidebar-nav">
          <div className="sidebar-nav-body">
            <div className="side-menu-close">
              <i className="la la-times"></i>
            </div>
            <div className="author-content">
              <div className="d-flex align-items-center">
                <div className="author-img avatar-sm">
                  <img 
                    src="/html-folder/images/team8.jpg" 
                    alt="user-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23007bff'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16'%3E👤%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="author-bio">
                  <h4 className="author__title">{user.first_name} {user.last_name}</h4>
                  <span className="author__meta">Member Since {new Date(user.created_at || Date.now()).getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="sidebar-menu-wrap">
              <ul className="sidebar-menu list-items">
                <li className={pageTitle === "Dashboard" ? "page-active" : ""}>
                  <Link href="/customer/dashboard">
                    <i className="la la-dashboard me-2"></i>Dashboard
                  </Link>
                </li>
                <li className={pageTitle.includes("Booking") ? "page-active" : ""}>
                  <Link href="/customer/dashboard-booking">
                    <i className="la la-shopping-cart me-2 text-color"></i>My Booking
                  </Link>
                </li>
                <li className={pageTitle === "Messages" ? "page-active" : ""}>
                  <Link href="/customer/chat" className="d-flex align-items-center justify-content-between">
                    <span><i className="la la-comments me-2 text-color-4"></i>Messages</span>
                    {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                  </Link>
                </li>
                <li className={pageTitle === "My Profile" ? "page-active" : ""}>
                  <Link href="/customer/profile">
                    <i className="la la-user me-2 text-color-2"></i>My Profile
                  </Link>
                </li>
                <li className={pageTitle.includes("Wishlist") ? "page-active" : ""}>
                  <Link href="/customer/dashboard-wishlist">
                    <i className="la la-heart me-2 text-color-4"></i>Wishlist
                  </Link>
                </li>
                <li className={pageTitle.includes("Chat") || pageTitle.includes("Messages") ? "page-active" : ""}>
                  <Link href="/customer/chat" className="d-flex align-items-center justify-content-between pe-3">
                    <span><i className="la la-comments me-2 text-color-5"></i>Messages</span>
                    {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="border-0 bg-transparent text-start w-100 p-0">
                    <i className="la la-power-off me-2 text-color-6"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <section className="dashboard-area">
          <div className="dashboard-nav">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="menu-wrapper">
                    <div className="logo me-5">
                      <Link href="/">
                        <img 
                          src="/html-folder/images/logo2.png" 
                          alt="logo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='%23ffffff' font-size='20' font-weight='bold'%3EKIRASTAY%3C/text%3E%3C/svg%3E";
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
                    <div className="dashboard-search-box">
                      <div className="contact-form-action">
                        <form action="#">
                          <div className="form-group mb-0">
                            <input
                              className="form-control"
                              type="text"
                              name="text"
                              placeholder="Search"
                            />
                            <button className="search-btn">
                              <i className="la la-search"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="nav-btn ms-auto">
                      <div className="notification-wrap d-flex align-items-center">
                        {/* Role-aware dropdowns for customer */}
                        <MessageHeader basePath="customer" />
                        <NotificationHeader basePath="customer" />

                        {/* User dropdown (React controlled) */}
                        <div className="notification-item" ref={userDropdownRef}>
                          <div className="dropdown">
                            <a
                              href="#"
                              className="dropdown-toggle"
                              id="userDropdownMenu"
                              aria-haspopup="true"
                              aria-expanded={userDropdownOpen ? 'true' : 'false'}
                              onClick={(e) => { e.preventDefault(); setUserDropdownOpen((v) => !v); }}
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
                                    src="/html-folder/images/team8.jpg" 
                                    alt="user-img"
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 2px #fff inset' }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23007bff'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='14'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <span className="font-size-14 font-weight-bold" style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#212529' }}>
                                  {user.first_name} {user.last_name}
                                </span>
                              </div>
                            </a>
                            <div className={`dropdown-menu dropdown-reveal dropdown-menu-md dropdown-menu-right ${userDropdownOpen ? 'show' : ''}`} style={{ display: userDropdownOpen ? 'block' : 'none' }}>
                              <div className="dropdown-item drop-reveal-header user-reveal-header">
                                <h6 className="title text-uppercase">Welcome!</h6>
                              </div>
                              <div className="list-group drop-reveal-list user-drop-reveal-list">
                                <Link href="/customer/profile" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-user me-2"></i>My Profile
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/customer/dashboard-booking" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-shopping-cart me-2"></i>My Booking
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/customer/dashboard-wishlist" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-heart me-2"></i>My Wishlist
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <Link href="/customer/chat" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                                  <div className="msg-body">
                                    <div className="msg-content">
                                      <h3 className="title">
                                        <i className="la la-comments me-2"></i>Messages
                                      </h3>
                                    </div>
                                  </div>
                                </Link>
                                <div className="section-block"></div>
                                {user?.impersonated && (
                                  <button 
                                    className="list-group-item list-group-item-action border-0 bg-transparent"
                                    onClick={async () => {
                                      try {
                                        const resp = await fetch('/api/admin/impersonate/restore', { method: 'POST', credentials: 'include' });
                                        const data = await resp.json();
                                        if (resp.ok && data.success) {
                                          window.location.href = data.redirectTo || '/admin/dashboard';
                                        } else {
                                          alert(data.error || 'Failed to return to admin');
                                        }
                                      } catch (e) {
                                        console.error('Return to admin failed', e);
                                        alert('Failed to return to admin');
                                      }
                                    }}
                                  >
                                    <div className="msg-body">
                                      <div className="msg-content">
                                        <h3 className="title">
                                          <i className="la la-undo me-2"></i>Return to Admin
                                        </h3>
                                      </div>
                                    </div>
                                  </button>
                                )}
                                <button onClick={() => { setUserDropdownOpen(false); handleLogout(); }} className="list-group-item list-group-item-action border-0 bg-transparent">
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
          <div className="dashboard-content-wrap">
            <div className="dashboard-bread">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="breadcrumb-content">
                      <div className="section-heading">
                        <h2 className="sec__title font-size-30 text-white">
                          Hi, {user.first_name} Welcome Back!
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="breadcrumb-list text-end">
                      <ul className="list-items">
                        <li><Link href="/" className="text-white">Home</Link></li>
                        <li>Customer</li>
                        <li>{pageTitle}</li>
                        {breadcrumbs.map((crumb, index) => (
                          <li key={index}>{crumb}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-main-content">
              <div className="container-fluid">
                {children}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
