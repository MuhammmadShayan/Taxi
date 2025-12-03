import DashboardLayout from './DashboardLayout';

export default function UserLayout({ children, pageTitle, breadcrumbItems, showStats = false, statsCards = [] }) {
  const userMenuItems = [
    {
      href: '/user/dashboard',
      icon: 'la la-dashboard',
      label: 'Dashboard',
      isActive: true
    },
    {
      href: '/user/dashboard-booking',
      icon: 'la la-shopping-cart text-color',
      label: 'My Booking'
    },
    {
      href: '/user/dashboard-profile',
      icon: 'la la-user text-color-2',
      label: 'My Profile'
    },
    {
      href: '/user/dashboard-reviews',
      icon: 'la la-star text-color-3',
      label: 'My Reviews'
    },
    {
      href: '/user/dashboard-wishlist',
      icon: 'la la-heart text-color-4',
      label: 'Wishlist'
    },
    {
      href: '/user/dashboard-settings',
      icon: 'la la-cog text-color-5',
      label: 'Settings'
    },
    {
      href: '/',
      icon: 'la la-power-off text-color-6',
      label: 'Logout'
    }
  ];

  return (
    <DashboardLayout
      userType="user"
      userName="User"
      userRole="Member Since 2023"
      pageTitle={pageTitle || 'User Dashboard'}
      breadcrumbItems={breadcrumbItems || [{ label: 'Home', href: '/' }, { label: 'User Dashboard' }]}
      menuItems={userMenuItems}
      showStats={showStats}
      statsCards={statsCards}
    >
      {children}
    </DashboardLayout>
  );
}
