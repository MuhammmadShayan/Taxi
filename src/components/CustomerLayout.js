'use client';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerLayout({ children, pageTitle, breadcrumbItems, showStats = false, statsCards = [] }) {
  const { logout } = useAuth();
  
  const customerMenuItems = [
    {
      href: '/customer',
      icon: 'la la-dashboard',
      label: 'Dashboard',
      isActive: true
    },
    {
      href: '/customer/dashboard-booking',
      icon: 'la la-shopping-cart text-color',
      label: 'My Booking'
    },
    {
      href: '/customer/dashboard-profile',
      icon: 'la la-user text-color-2',
      label: 'My Profile'
    },
    {
      href: '/customer/dashboard-reviews',
      icon: 'la la-star text-color-3',
      label: 'My Reviews'
    },
    {
      href: '/customer/dashboard-wishlist',
      icon: 'la la-heart text-color-4',
      label: 'Wishlist'
    },
    {
      href: '/customer/dashboard-settings',
      icon: 'la la-cog text-color-5',
      label: 'Settings'
    },
    {
      href: '/customer/chat',
      icon: 'la la-comments text-color-6',
      label: 'Messages',
      badge: 'unread_count'
    },
    {
      href: '#',
      icon: 'la la-power-off text-color-7',
      label: 'Logout',
      onClick: logout
    }
  ];

  return (
    <DashboardLayout
      userType="customer"
      userName="Ali Tufan"
      userRole="Member Since May 2017"
      pageTitle={pageTitle || 'Dashboard'}
      breadcrumbItems={breadcrumbItems || [{ label: 'Home', href: '/' }, { label: 'Customer Dashboard' }]}
      menuItems={customerMenuItems}
      showStats={showStats}
      statsCards={statsCards}
    >
      {children}
    </DashboardLayout>
  );
}
