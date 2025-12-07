'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerDashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      href: '/customer/dashboard',
      icon: 'la la-tachometer',
      label: 'Dashboard',
      description: 'Overview & Statistics'
    },
    {
      href: '/customer/dashboard-booking',
      icon: 'la la-calendar-check-o',
      label: 'My Bookings',
      description: 'Active & Past Reservations'
    },
    {
      href: '/customer/dashboard-wishlist',
      icon: 'la la-heart-o',
      label: 'My Wishlist',
      description: 'Saved Vehicles'
    },
    {
      href: '/customer/profile',
      icon: 'la la-user',
      label: 'My Profile',
      description: 'Personal Information'
    },
    {
      href: '/customer/payment-methods',
      icon: 'la la-credit-card',
      label: 'Payment Methods',
      description: 'Cards & Billing'
    },
    {
      href: '/customer/reviews',
      icon: 'la la-star',
      label: 'My Reviews',
      description: 'Rate Your Experiences'
    },
    {
      href: '/customer/support',
      icon: 'la la-life-ring',
      label: 'Support',
      description: 'Help & Contact'
    },
    {
      href: '/customer/settings',
      icon: 'la la-cog',
      label: 'Settings',
      description: 'Preferences & Privacy'
    }
  ];

  const isActive = (href) => {
    if (href === '/customer/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-nav-sidebar">
      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="logo-section">
          <Link href="/">
            <img 
              src="/html-folder/images/logo.png" 
              alt="HOLIKEY logo"
              className="sidebar-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Ctext x='10' y='25' fill='white' font-size='20' font-weight='bold'%3EHOLIKEY%3C/text%3E%3C/svg%3E";
              }}
            />
          </Link>
        </div>
        <div className="user-avatar">
          <img 
            src="/html-folder/images/team8.jpg" 
            alt="User Avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23007bff'/%3E%3Ctext x='40' y='50' text-anchor='middle' fill='white' font-size='30'%3E👤%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="user-info">
          <h4 className="user-name">
            {user?.first_name} {user?.last_name}
          </h4>
          <p className="user-role">Premium Customer</p>
          <div className="user-status">
            <span className="status-badge active">
              <i className="la la-circle"></i> Active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="sidebar-search-section">
        <Link href="/search" className="btn btn-primary btn-block search-btn">
          <i className="la la-search me-2"></i>
          Find Vehicles
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h6 className="nav-section-title">Main</h6>
          <ul className="nav-list">
            {navigationItems.slice(0, 4).map((item) => (
              <li key={item.href} className={`nav-item ${isActive(item.href) ? 'active' : ''}`}>
                <Link href={item.href} className="nav-link">
                  <div className="nav-link-content">
                    <div className="nav-icon">
                      <i className={item.icon}></i>
                    </div>
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <small className="nav-description">{item.description}</small>
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <div className="nav-indicator"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h6 className="nav-section-title">Account</h6>
          <ul className="nav-list">
            {navigationItems.slice(4, 8).map((item) => (
              <li key={item.href} className={`nav-item ${isActive(item.href) ? 'active' : ''}`}>
                <Link href={item.href} className="nav-link">
                  <div className="nav-link-content">
                    <div className="nav-icon">
                      <i className={item.icon}></i>
                    </div>
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <small className="nav-description">{item.description}</small>
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <div className="nav-indicator"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Section */}
        <div className="nav-section logout-section">
          <ul className="nav-list">
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logout-link">
                <div className="nav-link-content">
                  <div className="nav-icon">
                    <i className="la la-sign-out"></i>
                  </div>
                  <div className="nav-text">
                    <span className="nav-label">Logout</span>
                    <small className="nav-description">Sign out of your account</small>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Support Banner */}
      <div className="sidebar-support-banner">
        <div className="support-icon">
          <i className="la la-headphones"></i>
        </div>
        <h6>Need Help?</h6>
        <p>Our support team is available 24/7</p>
        <Link href="/customer/support" className="btn btn-outline-light btn-sm">
          Contact Support
        </Link>
      </div>
      <style jsx>{`
        .dashboard-nav-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          overflow-y: auto;
          z-index: 1000;
          padding: 0;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .user-profile-section {
          padding: 30px 20px 20px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        .logo-section {
          margin-bottom: 20px;
        }

        .sidebar-logo {
          max-height: 35px;
          filter: brightness(0) invert(1);
        }

        .user-avatar {
          margin-bottom: 15px;
        }

        .user-avatar img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.2);
          object-fit: cover;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          margin: 10px 0 5px;
          color: white;
        }

        .user-role {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 10px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge i {
          font-size: 8px;
          margin-right: 6px;
        }

        .sidebar-search-section {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-weight: 500;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-1px);
        }

        .sidebar-nav {
          flex: 1;
          padding: 0;
        }

        .nav-section {
          margin-bottom: 10px;
        }

        .nav-section-title {
          padding: 20px 20px 10px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin: 0;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          position: relative;
          margin-bottom: 2px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
        }

        .nav-item.active .nav-link {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .nav-link-content {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .nav-icon i {
          font-size: 18px;
        }

        .nav-text {
          flex: 1;
        }

        .nav-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
        }

        .nav-description {
          display: block;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
          line-height: 1.2;
        }

        .nav-indicator {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: white;
          border-radius: 2px 0 0 2px;
        }

        .logout-section {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 10px;
        }

        .logout-link {
          color: rgba(255, 255, 255, 0.8);
        }

        .logout-link:hover {
          background: rgba(220, 53, 69, 0.2);
          color: #dc3545;
        }

        .sidebar-support-banner {
          padding: 20px;
          margin: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .support-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }

        .support-icon i {
          font-size: 24px;
        }

        .sidebar-support-banner h6 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: white;
        }

        .sidebar-support-banner p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .sidebar-support-banner .btn {
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 6px;
        }

        /* Scrollbar Styling */
        .dashboard-nav-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .dashboard-nav-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .dashboard-nav-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .dashboard-nav-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-nav-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .dashboard-nav-sidebar.mobile-show {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
