import DashboardLayout from './DashboardLayout';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout({ children, pageTitle, breadcrumbItems, showStats = false, statsCards = [] }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  // Auth check removed - handled by middleware and page components
  
  const adminMenuItems = [
    {
      href: '/admin/dashboard',
      icon: 'la la-dashboard',
      label: 'Dashboard',
      isActive: pathname === '/admin/dashboard' || pathname === '/admin'
    },
    {
      href: '/admin/scrape-cars',
      icon: 'la la-download text-color-4',
      label: 'Scrape Cars',
      isActive: pathname === '/admin/scrape-cars'
    },
    {
      href: '/admin/users',
      icon: 'la la-users text-color',
      label: 'Users',
      isActive: pathname === '/admin/users'
    },
    {
      href: '/admin/agencies',
      icon: 'la la-building text-color-2',
      label: 'Agencies',
      isActive: pathname === '/admin/agencies'
    },
    {
      href: '/admin/vehicles',
      icon: 'la la-car text-color-3',
      label: 'Vehicles Catalog',
      isActive: pathname === '/admin/vehicles'
    },
    {
      href: '/admin/agency_vehicles',
      icon: 'la la-truck text-color-3',
      label: 'Agency Vehicles',
      isActive: pathname === '/admin/agency_vehicles'
    },
    {
      href: '/admin/bookings',
      icon: 'la la-shopping-cart text-color-4',
      label: 'Bookings',
      isActive: pathname === '/admin/bookings'
    },
    {
      href: '/admin/earnings',
      icon: 'la la-money text-color-5',
      label: 'Finance',
      isActive: pathname === '/admin/earnings'
    },
    {
      href: '/admin/settings',
      icon: 'la la-cog text-color-6',
      label: 'Settings',
      isActive: pathname === '/admin/settings'
    },
    {
      href: '#',
      icon: 'la la-power-off text-color-7',
      label: 'Logout',
      isActive: false,
      onClick: logout // Add click handler for logout
    }
  ];

  return (
    <DashboardLayout
      userType="admin"
      userName="Royel Admin"
      pageTitle={pageTitle || 'Dashboard'}
      breadcrumbItems={breadcrumbItems || [{ label: 'Home', href: '/' }, { label: 'Pages' }, { label: 'Dashboard' }]}
      menuItems={adminMenuItems}
      showStats={showStats}
      statsCards={statsCards}
    >
      {children}
    </DashboardLayout>
  );
}
