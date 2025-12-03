'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserProfileHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Get user role display
  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'agency_owner':
        return 'Agency Owner';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  };

  // Get profile image URL
  const getProfileImage = () => {
    if (user?.profile_image) {
      return user.profile_image.startsWith('http') 
        ? user.profile_image 
        : `/${user.profile_image}`;
    }
    return '/html-folder/images/team9.jpg'; // Default avatar
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        href: '/profile',
        icon: 'la la-user',
        label: 'Edit Profile',
        show: true
      }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        {
          href: '/admin/dashboard-orders',
          icon: 'la la-shopping-cart',
          label: 'Orders',
          show: true
        },
        {
          href: '/admin/users',
          icon: 'la la-users',
          label: 'Users',
          show: true
        },
        {
          href: '/admin/agencies',
          icon: 'la la-building',
          label: 'Agencies',
          show: true
        },
        {
          href: '/admin/dashboard-settings',
          icon: 'la la-gear',
          label: 'Settings',
          show: true
        }
      ];
    } else if (user?.role === 'agency_owner') {
      return [
        ...baseItems,
        {
          href: '/agency/bookings',
          icon: 'la la-calendar',
          label: 'Bookings',
          show: true
        },
        {
          href: '/agency/vehicles',
          icon: 'la la-car',
          label: 'Vehicles',
          show: true
        },
        {
          href: '/agency/earnings',
          icon: 'la la-money',
          label: 'Earnings',
          show: true
        },
        {
          href: '/agency/dashboard-settings',
          icon: 'la la-gear',
          label: 'Settings',
          show: true
        }
      ];
    } else {
      // Customer menu items
      return [
        ...baseItems,
        {
          href: '/customer/bookings',
          icon: 'la la-calendar',
          label: 'My Bookings',
          show: true
        },
        {
          href: '/customer/favorites',
          icon: 'la la-heart',
          label: 'Favorites',
          show: true
        },
        {
          href: '/customer/dashboard-settings',
          icon: 'la la-gear',
          label: 'Settings',
          show: true
        }
      ];
    }
  };

  if (!user) {
    return null; // Don't render if no user is logged in
  }

  return (
    <div className="jsx-af76ee54c9d17dd2 notification-item" ref={dropdownRef}>
      <div className="jsx-af76ee54c9d17dd2 dropdown">
        <a 
          href="#" 
          id="userDropdownMenu" 
          aria-haspopup="true" 
          aria-expanded={isOpen ? "true" : "false"} 
          className="jsx-af76ee54c9d17dd2 dropdown-toggle"
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown();
          }}
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
          <div className="jsx-af76ee54c9d17dd2 d-flex align-items-center">
            <div className="jsx-af76ee54c9d17dd2 avatar avatar-sm flex-shrink-0 me-2">
              <img 
                alt="profile-img" 
                className="jsx-af76ee54c9d17dd2" 
                src={getProfileImage()}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  boxShadow: '0 0 0 2px #fff inset'
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23007bff'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='14'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="user-info">
              <span className="jsx-af76ee54c9d17dd2 font-size-14 font-weight-bold d-block" style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getDisplayName()}
              </span>
              <span className="jsx-af76ee54c9d17dd2 font-size-12 text-muted" style={{ display: 'block', lineHeight: 1, color: '#6c757d' }}>
                {getRoleDisplay()}
              </span>
            </div>
          </div>
        </a>
        
        <div 
          className={`jsx-af76ee54c9d17dd2 dropdown-menu dropdown-reveal dropdown-menu-md dropdown-menu-right ${isOpen ? 'show' : ''}`}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div className="jsx-af76ee54c9d17dd2 dropdown-item drop-reveal-header user-reveal-header">
            <h6 className="jsx-af76ee54c9d17dd2 title text-uppercase">Welcome!</h6>
            <p className="mb-0 text-muted small">{user.email}</p>
          </div>
          
          <div className="jsx-af76ee54c9d17dd2 list-group drop-reveal-list user-drop-reveal-list">
            {getMenuItems().map((item, index) => 
              item.show && (
                <Link 
                  key={index}
                  href={item.href} 
                  className="jsx-af76ee54c9d17dd2 list-group-item list-group-item-action"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="jsx-af76ee54c9d17dd2 msg-body">
                    <div className="jsx-af76ee54c9d17dd2 msg-content">
                      <h3 className="jsx-af76ee54c9d17dd2 title">
                        <i className={`jsx-af76ee54c9d17dd2 ${item.icon} me-2`}></i>
                        {item.label}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            )}
            
            {/* Divider */}
            <div className="jsx-af76ee54c9d17dd2 section-block"></div>
            
            {/* Logout */}
            <button 
              className="jsx-af76ee54c9d17dd2 list-group-item list-group-item-action btn btn-link text-start"
              onClick={handleLogout}
              style={{ border: 'none', background: 'none' }}
            >
              <div className="jsx-af76ee54c9d17dd2 msg-body">
                <div className="jsx-af76ee54c9d17dd2 msg-content">
                  <h3 className="jsx-af76ee54c9d17dd2 title">
                    <i className="jsx-af76ee54c9d17dd2 la la-power-off me-2"></i>
                    Logout
                  </h3>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
