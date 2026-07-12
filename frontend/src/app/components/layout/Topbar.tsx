import { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Settings, Plus } from 'lucide-react';
import { useApp } from '../../AppContext';
import * as Popover from '@radix-ui/react-popover';
import { formatDistanceToNow } from 'date-fns';

const typeColors: Record<string, string> = {
  info: '#3AB0E6',
  success: '#00A09D',
  warning: '#F5A623',
  error: '#F2726F',
};

export function Topbar() {
  const { notifications, markNotificationRead, markAllNotificationsRead, logout, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-40 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search assets, employees, departments..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          style={{ '--tw-ring-color': '#714B67' } as React.CSSProperties}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick Add */}
        <button
          onClick={() => navigate('assets')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: '#714B67' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
        >
          <Plus size={15} />
          Add Asset
        </button>

        {/* Notifications */}
        <Popover.Root open={notifOpen} onOpenChange={setNotifOpen}>
          <Popover.Trigger asChild>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
              <Bell size={18} />
              {unread > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{ fontSize: 9, backgroundColor: '#F2726F' }}
                >
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={8}
              className="w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-800">Notifications</span>
                {unread > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs hover:underline"
                    style={{ color: '#714B67' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">No notifications</div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.id}
                      onClick={() => { markNotificationRead(n.id); if (n.actionPage) navigate(n.actionPage); setNotifOpen(false); }}
                      className="flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all"
                      style={{ backgroundColor: n.read ? 'transparent' : '#FEFAF9' }}
                    >
                      <span
                        className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: typeColors[n.type] ?? '#ccc', opacity: n.read ? 0.3 : 1 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {n.timestamp ? formatDistanceToNow(new Date(n.timestamp), { addSuffix: true }) : ''}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: '#714B67' }} />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <button
                  onClick={() => { navigate('notifications'); setNotifOpen(false); }}
                  className="text-xs font-medium w-full text-center hover:underline"
                  style={{ color: '#714B67' }}
                >
                  View all notifications
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Profile */}
        <Popover.Root open={profileOpen} onOpenChange={setProfileOpen}>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: '#714B67' }}>
                AR
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Admin</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={8} className="w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-1">
              <div className="px-3 py-2 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800">Asset Admin</p>
                <p className="text-xs text-gray-500">admin@assetflow.io</p>
              </div>
              <button onClick={() => { navigate('settings'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                <User size={14} /> Profile
              </button>
              <button onClick={() => { navigate('settings'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                <Settings size={14} /> Settings
              </button>
              <div className="border-t border-gray-100 mt-1" />
              <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-all" style={{ color: '#F2726F' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </header>
  );
}
