import { useApp } from '../../AppContext';
import type { Page } from '../../types';
import {
  LayoutDashboard, Package, ArrowRightLeft, CalendarDays,
  Wrench, Building2, Bell, BarChart3, Settings, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

interface NavItem {
  label: string;
  page: Page;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Assets', page: 'assets', icon: <Package size={18} /> },
  { label: 'Allocations', page: 'allocations', icon: <ArrowRightLeft size={18} /> },
  { label: 'Bookings', page: 'bookings', icon: <CalendarDays size={18} /> },
  { label: 'Maintenance', page: 'maintenance', icon: <Wrench size={18} /> },
  { label: 'Organization', page: 'org-setup', icon: <Building2 size={18} /> },
  { label: 'Notifications', page: 'notifications', icon: <Bell size={18} /> },
  { label: 'Reports', page: 'reports', icon: <BarChart3 size={18} /> },
  { label: 'Settings', page: 'settings', icon: <Settings size={18} /> },
];

export function Sidebar() {
  const { currentPage, navigate, sidebarCollapsed, toggleSidebar, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <aside
      className="h-full flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shrink-0"
      style={{ width: sidebarCollapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#714B67' }}>
          <Zap size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-base font-semibold tracking-tight" style={{ color: '#714B67' }}>
            AssetFlow
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentPage === item.page ||
            (item.page === 'assets' && currentPage === 'asset-details');
          const isBell = item.page === 'notifications';

          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              title={sidebarCollapsed ? item.label : undefined}
              className="w-full flex items-center gap-3 px-4 py-2.5 mb-0.5 rounded-none transition-all duration-150 text-left group relative"
              style={{
                backgroundColor: isActive ? '#F1EBEF' : 'transparent',
                color: isActive ? '#714B67' : '#52525b',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#fafafa';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                  style={{ backgroundColor: '#714B67' }}
                />
              )}
              <span className="shrink-0 relative">
                {item.icon}
                {isBell && unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ fontSize: 9, backgroundColor: '#F2726F' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && isBell && unreadCount > 0 && (
                <span
                  className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: '#F2726F' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all text-sm"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
