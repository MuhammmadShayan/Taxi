'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import DynamicHeader from './DynamicHeader';
import ImpersonationBanner from './ImpersonationBanner';

export default function DashboardLayout({ 
  children, 
  userType = 'admin', // admin, user, driver
  userName = 'User',
  userRole = 'Welcome to Dashboard',
  pageTitle = 'Dashboard',
  breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Dashboard' }],
  menuItems = [],
  showStats = false,
  statsCards = []
}) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('notification');
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

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
    // Check if user canvas is active and tab is message
    const checkCanvas = () => {
      const container = document.querySelector('.user-canvas-container');
      if (container && container.classList.contains('active') && activeTab === 'message') {
        fetchRecentMessages();
      }
    };
    
    // Add observer or just hook into click events?
    // Since we rely on vanilla JS for toggling .active class in this file (lines 113-115),
    // we might need to poll or add our own click handler to the toggle button.
    // However, since I am editing this file, I can just modify the toggle logic or use React state for the canvas visibility too.
    // But to minimize disruption to existing vanilla JS logic, I will just trigger fetch when tab changes to message.
    if (activeTab === 'message') {
      fetchRecentMessages();
    }
  }, [activeTab, fetchRecentMessages]);
  
  useEffect(() => {
    // Initialize dashboard functionality
    const loadScripts = () => {
      if (typeof window !== 'undefined') {
        // Clear any leftover Bootstrap modals/backdrops from previous pages
        const cleanupOverlays = () => {
          try {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.querySelectorAll('.modal.show').forEach(modal => {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              modal.style.display = 'none';
            });
          } catch {}
        };
        cleanupOverlays();

        // Initialize preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 500);
        }
        
        // Initialize sidebar menu toggle functionality
        const initSidebarMenu = () => {
          // Handle main menu toggle
          const menuToggler = document.querySelector('.menu-toggler');
          const sidebarNav = document.querySelector('.sidebar-nav');
          const sideMenuClose = document.querySelectorAll('.side-menu-close');
          
          if (menuToggler && sidebarNav) {
            menuToggler.addEventListener('click', () => {
              sidebarNav.classList.toggle('sidebar--show');
            });
          }
          
          sideMenuClose.forEach(closeBtn => {
            if (closeBtn && sidebarNav) {
              closeBtn.addEventListener('click', () => {
                sidebarNav.classList.remove('sidebar--show');
              });
            }
          });
          
          // Handle dropdown menu toggles - replicate the original HTML functionality
          const toggleMenuIcons = document.querySelectorAll('.toggle-menu > li .toggle-menu-icon');
          
          toggleMenuIcons.forEach((icon) => {
            const handleClick = (e) => {
              e.preventDefault();
              
              const closestLi = icon.closest('li');
              
              // Close all other dropdowns (siblings)
              const siblings = Array.from(closestLi.parentElement.children).filter(li => li !== closestLi);
              siblings.forEach(sibling => {
                sibling.classList.remove('active');
                const dropdownMenu = sibling.querySelector('.toggle-drop-menu, .dropdown-menu-item');
                if (dropdownMenu) {
                  dropdownMenu.style.display = 'none';
                }
              });
              
              // Toggle current dropdown
              closestLi.classList.toggle('active');
              const currentDropdown = closestLi.querySelector('.toggle-drop-menu, .dropdown-menu-item');
              if (currentDropdown) {
                if (closestLi.classList.contains('active')) {
                  currentDropdown.style.display = 'block';
                } else {
                  currentDropdown.style.display = 'none';
                }
              }
              
              return false;
            };
            
            icon.addEventListener('click', handleClick);
          });
          
          // Handle user canvas menu
          const userMenuOpen = document.querySelector('.user-menu-open');
          const userCanvasContainer = document.querySelector('.user-canvas-container');
          
          if (userMenuOpen && userCanvasContainer) {
            userMenuOpen.addEventListener('click', () => {
              userCanvasContainer.classList.toggle('active');
            });
          }
        };
        
        // Initialize Bootstrap dropdowns
        const initBootstrapDropdowns = () => {
          const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
          dropdownToggleList.forEach(dropdownToggleEl => {
            const handler = (e) => {
              e.preventDefault();
              const dropdown = dropdownToggleEl.nextElementSibling;
              if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                // Close any other open dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(d => {
                  if (d !== dropdown) {
                    d.classList.remove('show');
                    d.style.display = 'none';
                  }
                });
                const isOpen = dropdown.classList.contains('show');
                if (isOpen) {
                  dropdown.classList.remove('show');
                  dropdown.style.display = 'none';
                } else {
                  dropdown.classList.add('show');
                  dropdown.style.display = 'block';
                }
              }
            };
            dropdownToggleEl.addEventListener('click', handler);
          });

          // One-time global outside click closer
          if (typeof window !== 'undefined' && !window.__dashDropdownInit) {
            document.addEventListener('click', (ev) => {
              const withinDropdown = ev.target.closest('.dropdown');
              if (!withinDropdown) {
                document.querySelectorAll('.dropdown-menu.show').forEach(d => {
                  d.classList.remove('show');
                  d.style.display = 'none';
                });
              }
            });
            window.__dashDropdownInit = true;
          }
        };
        
        // Initialize after a short delay to ensure DOM is ready
        setTimeout(initSidebarMenu, 100);
        setTimeout(initBootstrapDropdowns, 200);
      }
    };
    
    loadScripts();
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        // Remove event listeners when component unmounts
        const toggleMenuIcons = document.querySelectorAll('.toggle-menu > li .toggle-menu-icon');
        toggleMenuIcons.forEach(icon => {
          const newIcon = icon.cloneNode(true);
          icon.parentNode.replaceChild(newIcon, icon);
        });
      }
    };
  }, []);

  const getUserTypeConfig = () => {
    switch (userType) {
      case 'admin':
        return {
          brandTitle: 'Royel travel agency',
          brandSubtitle: 'Welcome to Admin Panel',
          avatarImg: '/html-folder/images/team9.jpg',
          headerTitle: 'Royel Admin'
        };
      case 'user':
        return {
          brandTitle: 'KiraStay User',
          brandSubtitle: 'Welcome to User Panel',
          avatarImg: '/html-folder/images/team8.jpg',
          headerTitle: 'User Panel'
        };
      case 'driver':
        return {
          brandTitle: 'Driver Panel',
          brandSubtitle: 'Welcome to Driver Panel',
          avatarImg: '/html-folder/images/team9.jpg',
          headerTitle: 'Driver Account'
        };
      default:
        return {
          brandTitle: 'Dashboard',
          brandSubtitle: 'Welcome',
          avatarImg: '/html-folder/images/team8.jpg',
          headerTitle: 'Account'
        };
    }
  };

  const config = getUserTypeConfig();
  const getStatsColClass = (count) => {
    if (count >= 5) return 'col-lg-2 col-md-4 col-sm-6 col-12';
    if (count === 4) return 'col-lg-3 col-md-6 col-sm-6 col-12';
    if (count === 3) return 'col-lg-4 col-md-6 col-sm-6 col-12';
    if (count === 2) return 'col-lg-6 col-md-6 col-sm-12 col-12';
    return 'col-lg-12 col-12';
  };

  return (
    <>
      <style jsx global>{`
        .toggle-drop-menu {
          display: none;
          padding-left: 0;
          margin: 0;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          margin-top: 5px;
        }
        
        .toggle-drop-menu li {
          list-style: none;
        }
        
        .toggle-drop-menu li a {
          display: block;
          padding: 8px 20px 8px 40px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .toggle-drop-menu li a:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          padding-left: 45px;
        }
        
        .active .toggle-drop-menu {
          display: block !important;
        }
        
        .toggle-menu-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
        }
        
        .toggle-menu-icon:hover {
          color: #fff;
        }
        
        .active .toggle-menu-icon i {
          transform: rotate(180deg);
        }
        
        .sidebar-menu li {
          position: relative;
        }
        
        .sidebar-menu li a {
          position: relative;
          padding-right: 45px;
        }
        
        .dropdown-menu.show {
          display: block;
        }
      `}</style>
      <div className="section-bg">
      {/* Impersonation banner (shows when admin is impersonating another user) */}
      <ImpersonationBanner />
      {/* User Canvas Menu */}
      {mounted && (
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
            <div
              className={`tab-pane fade ${activeTab === 'notification' ? 'show active' : ''}`}
              id="notification"
              role="tabpanel"
            >
              <div className="user-sidebar-item">
                <div className="notification-item">
                  <div className="list-group drop-reveal-list">
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element flex-shrink-0 me-3 ms-0">
                          <i className="la la-bell"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Your request has been sent</h3>
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
                          <h3 className="title pb-1">Your account has been created</h3>
                          <p className="msg-text">1 day ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element bg-3 flex-shrink-0 me-3 ms-0">
                          <i className="la la-user"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Your account updated</h3>
                          <p className="msg-text">2 hrs ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element bg-4 flex-shrink-0 me-3 ms-0">
                          <i className="la la-lock"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Your password changed</h3>
                          <p className="msg-text">Yesterday</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element bg-5 flex-shrink-0 me-3 ms-0">
                          <i className="la la-envelope"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Your email sent</h3>
                          <p className="msg-text">Yesterday</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                      <div className="msg-body d-flex align-items-center">
                        <div className="icon-element bg-6 flex-shrink-0 me-3 ms-0">
                          <i className="la la-envelope"></i>
                        </div>
                        <div className="msg-content w-100">
                          <h3 className="title pb-1">Your email changed</h3>
                          <p className="msg-text">Yesterday</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'message' ? 'show active' : ''}`}
              id="message"
              role="tabpanel"
            >
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
                          href={`/${userType}/chat?id=${msg.conversation_id}`} 
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
                       <Link href={`/${userType}/chat`} className="theme-btn theme-btn-small w-100">View All Messages</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'account' ? 'show active' : ''}`}
              id="account"
              role="tabpanel"
            >
              <div className="user-action-wrap user-sidebar-panel">
                <div className="notification-item">
                  <a href={`/${userType}/dashboard-profile`} className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm flex-shrink-0 me-2">
                        <img src={config.avatarImg} alt="team-img" />
                      </div>
                      <span className="font-size-14 font-weight-bold">{userName}</span>
                    </div>
                  </a>
                  <div className="list-group drop-reveal-list user-drop-reveal-list">
                    <a
                      href={`/${userType}/dashboard-profile`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="msg-body">
                        <div className="msg-content">
                          <h3 className="title">
                            <i className="la la-user me-2"></i>My Profile
                          </h3>
                        </div>
                      </div>
                    </a>
                    <div className="section-block"></div>
                    <a 
                      href="#" 
                      className="list-group-item list-group-item-action"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
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
      )}

      {/* Sidebar Navigation */}
      <div className="sidebar-nav sidebar--nav">
        <div className="sidebar-nav-body">
          <div className="side-menu-close">
            <i className="la la-times"></i>
          </div>
          <div className="author-content">
            <div className="d-flex align-items-center">
              <div className="author-img avatar-sm">
                <img src={config.avatarImg} alt="profile image" />
              </div>
              <div className="author-bio">
                <h4 className="author__title">{config.brandTitle}</h4>
                <span className="author__meta">{config.brandSubtitle}</span>
              </div>
            </div>
          </div>
          <div className="sidebar-menu-wrap">
            <ul className="sidebar-menu toggle-menu list-items">
              {menuItems.map((item, index) => (
                <li key={index} className={item.isActive ? 'page-active' : ''}>
                  {item.submenu ? (
                    <>
                      <span className="side-menu-icon toggle-menu-icon">
                        <i className="la la-angle-down"></i>
                      </span>
                      <a href={item.href}>
                        <i className={`${item.icon} me-2`}></i>{item.label}
                      </a>
                      <ul className="toggle-drop-menu">
                        {item.submenu.map((subitem, subindex) => (
                          <li key={subindex}>
                            <a href={subitem.href}>{subitem.label}</a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    item.onClick ? (
                      <button 
                        type="button"
                        className="border-0 bg-transparent p-0 text-start w-100"
                        onClick={(e) => { e.preventDefault(); item.onClick(); }}
                      >
                        <i className={`${item.icon} me-2`}></i>{item.label}
                      </button>
                    ) : (
                      <a href={item.href} className="d-flex align-items-center justify-content-between">
                        <span><i className={`${item.icon} me-2`}></i>{item.label}</span>
                        {item.badge && <span className="badge bg-danger ms-2">{item.badge}</span>}
                      </a>
                    )
                  )}
                </li>
              ))}
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
                    <a href="/">
                      <img src="/html-folder/images/logo2.png" alt="logo" />
                    </a>
                    <div className="menu-toggler">
                      <i className="la la-bars"></i>
                      <i className="la la-times"></i>
                    </div>
                    <div className="user-menu-open">
                      <i className="la la-user"></i>
                    </div>
                  </div>
                  <div className="nav-btn ms-auto">
                    {/* Dynamic Header Component with Notifications, Messages, and User Profile */}
                    <DynamicHeader />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content-wrap">
          <div className="dashboard-bread dashboard-bread-2">
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
                      {breadcrumbItems.map((item, index) => (
                        <li key={index}>
                          {item.href ? (
                            <a href={item.href} className="text-white">{item.label}</a>
                          ) : (
                            <span className="text-white">{item.label}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              {showStats && statsCards.length > 0 && (
                <div className="row mt-4">
                  {statsCards.map((card, index) => (
                    <div key={index} className={`${getStatsColClass(statsCards.length)} responsive-column-l`}>
                      <div className="icon-box icon-layout-2 dashboard-icon-box pb-0">
                        <div className="d-flex pb-3 justify-content-between">
                          <div className="info-content">
                            <p className="info__desc">{card.title}</p>
                            <h4 className="info__title">{card.value}</h4>
                          </div>
                          <div className={`info-icon icon-element ${card.bgClass || 'bg-4'}`}>
                            <i className={card.icon}></i>
                          </div>
                        </div>
                        <div className="section-block"></div>
                        {card.link && (
                          <a
                            href={card.link}
                            className="d-flex align-items-center justify-content-between view-all"
                          >
                            View All <i className="la la-angle-right"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="dashboard-main-content">
            <div className="container-fluid">
              {children}
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <div id="back-to-top">
        <i className="la la-angle-up" title="Go top"></i>
      </div>
    </div>
    </>
  );
}
