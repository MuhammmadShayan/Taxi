'use client';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export default function AgencyLayout({ children, pageTitle, breadcrumbItems, showStats = false, statsCards = [] }) {
  const { logout } = useAuth();
  const { unreadCount } = useNotification();
  
  const agencyMenuItems = [
    {
      href: '/agency/dashboard',
      icon: 'la la-dashboard',
      label: 'Dashboard',
      isActive: true
    },
    {
      href: '/agency/chat',
      icon: 'la la-comments text-color-2',
      label: 'Messages',
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      href: '/agency/dashboard-trips',
      icon: 'la la-road text-color',
      label: 'My Trips'
    },
    {
      href: '/agency/dashboard-manage-car',
      icon: 'la la-car text-color-3',
      label: 'My Cars'
    },
    {
      href: '/agency/dashboard-add-car',
      icon: 'la la-plus-circle text-color-4',
      label: 'Add Car'
    },
    {
      href: '/agency/dashboard-earnings',
      icon: 'la la-money text-color-5',
      label: 'Earnings'
    },
    {
      href: '/agency/dashboard-profile',
      icon: 'la la-user text-color-7',
      label: 'My Profile'
    },
    {
      href: '/agency/settings',
      icon: 'la la-cog text-color-8',
      label: 'Settings'
    },
    {
      href: '/agency/support',
      icon: 'la la-question-circle text-color-9',
      label: 'Support'
    },
    {
      href: '#',
      icon: 'la la-power-off text-color-11',
      label: 'Logout',
      onClick: logout
    }
  ];

  return (
    <DashboardLayout
      userType="agency"
      userName="Agency Account"
      userRole="Professional Agency"
      pageTitle={pageTitle || 'Dashboard'}
      breadcrumbItems={breadcrumbItems || [{ label: 'Home', href: '/' }, { label: 'Agency Dashboard' }]}
      menuItems={agencyMenuItems}
      showStats={showStats}
      statsCards={statsCards}
    >
      {children}
    </DashboardLayout>
  );
}
