'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import NotificationHeader from '../../../components/NotificationHeader';
import MessageHeader from '../../../components/MessageHeader';
import { useAuth } from '../../../contexts/AuthContext';

export default function AgencyHeader({ basePath = 'agency', userName = 'User', avatarSrc = '/html-folder/images/team9.jpg' }) {
  const { user } = useAuth();
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

  const profileHref = `/${basePath}/dashboard-profile`;
  const earningsHref = `/${basePath}/dashboard-earnings`;
  const settingsHref = `/${basePath}/dashboard-settings`;

  return (
    <>
      {/* Impersonation banner */}
      {require('../../../components/ImpersonationBanner').default && require('../../../components/ImpersonationBanner').default()}
      <div className="dashboard-nav dashboard--nav">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="menu-wrapper">
              <div className="logo me-5">
                <Link href="/">
                  <img src="/html-folder/images/logo2.png" alt="KiraStay" />
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
                  <form action="#" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group mb-0">
                      <input
                        className="form-control"
                        type="text"
                        name="text"
                        placeholder="Search trips, customers, earnings..."
                      />
                      <button className="search-btn" type="submit">
                        <i className="la la-search"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="nav-btn ms-auto">
                <div className="notification-wrap d-flex align-items-center">
                  {/* Role-aware dropdowns */}
                  <MessageHeader basePath={basePath} />
                  <NotificationHeader basePath={basePath} />

                  {/* User Profile Dropdown (React-controlled) */}
                  <div className="notification-item" ref={userDropdownRef}>
                    <div className="dropdown">
                      <a
                        href="#"
                        className="dropdown-toggle"
                        id="agencyUserDropdown"
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
                              src={avatarSrc} 
                              alt="profile" 
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 2px #fff inset' }}
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23007bff'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='14'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E"; }}
                            />
                          </div>
                          <span className="font-size-14 font-weight-bold" style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#212529' }}>{userName}</span>
                        </div>
                      </a>
                      <div className={`dropdown-menu dropdown-reveal dropdown-menu-md dropdown-menu-right ${userDropdownOpen ? 'show' : ''}`} style={{ display: userDropdownOpen ? 'block' : 'none' }}>
                        <div className="dropdown-item drop-reveal-header user-reveal-header">
                          <h6 className="title text-uppercase">Account</h6>
                        </div>
                        <div className="list-group drop-reveal-list user-drop-reveal-list">
                          <Link href={profileHref} className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                            <div className="msg-body">
                              <div className="msg-content">
                                <h3 className="title">
                                  <i className="la la-user me-2"></i>My Profile
                                </h3>
                              </div>
                            </div>
                          </Link>
                          <Link href={earningsHref} className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                            <div className="msg-body">
                              <div className="msg-content">
                                <h3 className="title">
                                  <i className="la la-dollar me-2"></i>My Earnings
                                </h3>
                              </div>
                            </div>
                          </Link>
                          <Link href={settingsHref} className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
                            <div className="msg-body">
                              <div className="msg-content">
                                <h3 className="title">
                                  <i className="la la-cog me-2"></i>Settings
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
                          <Link href="/" className="list-group-item list-group-item-action" onClick={() => setUserDropdownOpen(false)}>
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
    </>
  );
}
