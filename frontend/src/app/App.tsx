import { AppProvider, useApp } from './AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AssetsPage } from './components/pages/AssetsPage';
import { AssetDetailsPage } from './components/pages/AssetDetailsPage';
import { AllocationsPage } from './components/pages/AllocationsPage';
import { BookingsPage } from './components/pages/BookingsPage';
import { MaintenancePage } from './components/pages/MaintenancePage';
import { OrgSetupPage } from './components/pages/OrgSetupPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from 'sonner';

function AppRouter() {
  const { isLoggedIn, currentPage } = useApp();

  if (!isLoggedIn) return <LoginPage />;

  const PageContent = () => {
    switch (currentPage) {
      case 'dashboard':      return <DashboardPage />;
      case 'assets':         return <AssetsPage />;
      case 'asset-details':  return <AssetDetailsPage />;
      case 'allocations':    return <AllocationsPage />;
      case 'bookings':       return <BookingsPage />;
      case 'maintenance':    return <MaintenancePage />;
      case 'org-setup':      return <OrgSetupPage />;
      case 'notifications':  return <NotificationsPage />;
      case 'reports':        return <ReportsPage />;
      case 'settings':       return <SettingsPage />;
      default:               return <DashboardPage />;
    }
  };

  return (
    <AppLayout>
      <PageContent />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13 },
          duration: 3500,
        }}
      />
      <AppRouter />
    </AppProvider>
  );
}
