import { Bell, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../AppContext';
import { PageHeader } from '../shared/PageHeader';
import { EmptyState } from '../shared/EmptyState';
import { formatDistanceToNow } from 'date-fns';

const typeColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  info:    { bg: '#EFF6FF', text: '#2563EB', dot: '#3AB0E6', label: 'Info' },
  success: { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D', label: 'Success' },
  warning: { bg: '#FEF3E2', text: '#D97706', dot: '#F5A623', label: 'Warning' },
  error:   { bg: '#FEF2F2', text: '#DC2626', dot: '#F2726F', label: 'Alert' },
};

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          unread > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="System events, alerts, and updates will appear here." />
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(n => {
              const style = typeColors[n.type] ?? typeColors.info;
              return (
                <div
                  key={n.id}
                  onClick={() => { markNotificationRead(n.id); if (n.actionPage) navigate(n.actionPage); }}
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/70 transition-all"
                  style={{ backgroundColor: n.read ? 'transparent' : '#FEFAF9' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: style.bg }}>
                    <Bell size={16} style={{ color: style.dot }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-1"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {style.label}
                        </span>
                        <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#714B67' }} />
                        )}
                        {!n.read && (
                          <button
                            onClick={e => { e.stopPropagation(); markNotificationRead(n.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all text-gray-400"
                            title="Mark as read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {n.timestamp ? formatDistanceToNow(new Date(n.timestamp), { addSuffix: true }) : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
