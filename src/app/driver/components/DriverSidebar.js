'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DriverSidebar() {
  const pathname = usePathname();
  const [toggleMenus, setToggleMenus] = useState({});

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');
  const toggleMenu = (id) => setToggleMenus((prev) => ({ ...prev, [id]: !prev[id] }));

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: 'la la-dashboard', path: '/driver/dashboard', isActive: isActive('/driver/dashboard') },
    { id: 'trips', title: 'My Trips', icon: 'la la-road', path: '/driver/dashboard-trips', isActive: isActive('/driver/dashboard-trips') },
    {
      id: 'vehicles', title: 'My Vehicles', icon: 'la la-car', hasSubmenu: true,
      isActive: isActive('/driver/dashboard-manage-car') || isActive('/driver/dashboard-add-car'),
      submenu: [
        { title: 'Manage Vehicles', path: '/driver/dashboard-manage-car' },
        { title: 'Add New Vehicle', path: '/driver/dashboard-add-car' },
      ],
    },
    { id: 'destinations', title: 'Destinations', icon: 'la la-map-marker', path: '/driver/dashboard-destination', isActive: isActive('/driver/dashboard-destination') },
    { id: 'earnings', title: 'Earnings', icon: 'la la-dollar', path: '/driver/dashboard-earnings', isActive: isActive('/driver/dashboard-earnings') },
    { id: 'profile', title: 'My Profile', icon: 'la la-user', path: '/driver/dashboard-profile', isActive: isActive('/driver/dashboard-profile') },
    { id: 'settings', title: 'Settings', icon: 'la la-cog', path: '/driver/dashboard-settings', isActive: isActive('/driver/dashboard-settings') },
    { id: 'support', title: 'Support', icon: 'la la-headphones', path: '/driver/dashboard-support', isActive: isActive('/driver/dashboard-support') },
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
              <img src="/html-folder/images/team9.jpg" alt="driver" />
            </div>
            <div className="author-bio">
              <h4 className="author__title">Driver</h4>
              <span className="author__meta">KiraStay Driver</span>
            </div>
          </div>
        </div>
        <div className="sidebar-menu-wrap">
          <ul className="sidebar-menu toggle-menu list-items">
            {menuItems.map((item) => (
              <li key={item.id} className={item.isActive ? 'page-active' : ''}>
                {item.hasSubmenu ? (
                  <>
                    <span className="side-menu-icon toggle-menu-icon" onClick={() => toggleMenu(item.id)}>
                      <i className={`la la-angle-${toggleMenus[item.id] ? 'up' : 'down'}`}></i>
                    </span>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu(item.id); }}>
                      <i className={`${item.icon} me-2 text-color-2`}></i>
                      {item.title}
                    </a>
                    <ul className={`toggle-drop-menu ${toggleMenus[item.id] ? 'show' : ''}`}>
                      {item.submenu.map((sub, idx) => (
                        <li key={idx}><Link href={sub.path}>{sub.title}</Link></li>
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
