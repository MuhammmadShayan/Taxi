'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AgencySidebar() {
  const pathname = usePathname();
  const [toggleMenus, setToggleMenus] = useState({});

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const toggleMenu = (menuId) => {
    setToggleMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'la la-dashboard',
      path: '/agency/dashboard',
      isActive: pathname === '/agency/dashboard'
    },
    {
      id: 'trips',
      title: 'My Trips',
      icon: 'la la-road',
      path: '/agency/dashboard-trips',
      isActive: isActive('/agency/dashboard-trips')
    },
    {
      id: 'vehicles',
      title: 'My Vehicles',
      icon: 'la la-car',
      hasSubmenu: true,
      isActive: isActive('/agency/dashboard-manage-car') || isActive('/agency/dashboard-add-car'),
      submenu: [
        {
          title: 'Manage Vehicles',
          path: '/agency/dashboard-manage-car'
        },
        {
          title: 'Add New Vehicle',
          path: '/agency/dashboard-add-car'
        }
      ]
    },
    {
      id: 'destinations',
      title: 'Destinations',
      icon: 'la la-map-marker',
      path: '/agency/dashboard-destination',
      isActive: isActive('/agency/dashboard-destination')
    },
    {
      id: 'earnings',
      title: 'Earnings',
      icon: 'la la-dollar',
      path: '/agency/dashboard-earnings',
      isActive: isActive('/agency/dashboard-earnings')
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'la la-user',
      path: '/agency/dashboard-profile',
      isActive: isActive('/agency/dashboard-profile')
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'la la-cog',
      path: '/agency/dashboard-settings',
      isActive: isActive('/agency/dashboard-settings')
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'la la-headphones',
      path: '/agency/dashboard-support',
      isActive: isActive('/agency/dashboard-support')
    }
  ];

  return (
    <div className="sidebar-nav sidebar--nav">
      <div className="sidebar-nav-body">
        <div className="side-menu-close">
          <i className="la la-times"></i>
        </div>
        <div className="author-content">
          <div className="d-flex align-items-center">
            <div className="author-img avatar-sm">
              <img src="/html-folder/images/team9.jpg" alt="agency image" />
            </div>
            <div className="author-bio">
              <h4 className="author__title">Michael Johnson</h4>
              <span className="author__meta">KiraStay Agency</span>
            </div>
          </div>
        </div>
        <div className="sidebar-menu-wrap">
          <ul className="sidebar-menu toggle-menu list-items">
            {menuItems.map((item) => (
              <li key={item.id} className={item.isActive ? 'page-active' : ''}>
                {item.hasSubmenu ? (
                  <>
                    <span 
                      className="side-menu-icon toggle-menu-icon"
                      onClick={() => toggleMenu(item.id)}
                    >
                      <i className={`la la-angle-${toggleMenus[item.id] ? 'up' : 'down'}`}></i>
                    </span>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu(item.id);
                      }}
                    >
                      <i className={`${item.icon} me-2 text-color-2`}></i>
                      {item.title}
                    </a>
                    <ul className={`toggle-drop-menu ${toggleMenus[item.id] ? 'show' : ''}`}>
                      {item.submenu.map((subItem, index) => (
                        <li key={index}>
                          <Link href={subItem.path}>{subItem.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.path}>
                    <i className={`${item.icon} me-2`}></i>
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/admin/dashboard">
                <i className="la la-user-shield me-2 text-color-8"></i>
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/">
                <i className="la la-power-off me-2 text-color-11"></i>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
