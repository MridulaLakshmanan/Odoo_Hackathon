import { Package, ArrowRightLeft, CalendarDays, Wrench, CheckCircle, Bell } from 'lucide-react';
import { useApp } from '../../AppContext';
import { KPICard } from '../shared/KPICard';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { formatDistanceToNow } from 'date-fns';

const typeColors: Record<string, string> = {
  info: '#3AB0E6',
  success: '#00A09D',
  warning: '#F5A623',
  error: '#F2726F',
};

export function DashboardPage() {
  const { assets, allocations, bookings, maintenanceRequests, notifications, employees, navigate } = useApp();

  const totalAssets = assets.length;
  const allocated = assets.filter(a => a.status === 'Allocated').length;
  const available = assets.filter(a => a.status === 'Available').length;
  const maintenance = maintenanceRequests.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
  const pending = bookings.filter(b => b.status === 'Pending').length;

  const recentAllocations = allocations.filter(a => a.status === 'Active').slice(0, 5);
  const pendingMaintenance = maintenanceRequests.filter(m => m.status !== 'Completed' && m.status !== 'Cancelled').slice(0, 5);
  const pendingBookings = bookings.filter(b => b.status === 'Pending').slice(0, 3);
  const recentNotifs = notifications.slice(0, 4);

  const getEmployee = (id: string) => employees.find(e => e.id === id);
  const getAsset = (id: string) => assets.find(a => a.id === id);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-0.5" style={{ fontFamily: "'Caveat', cursive", fontSize: 18 }}>
          Good morning, Admin 👋
        </p>
        <h1 className="text-xl font-semibold text-gray-900">Here's what's happening today</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Total Assets"
          value={totalAssets}
          icon={Package}
          iconColor="#714B67"
          iconBg="#F1EBEF"
          subtitle="Across all departments"
          onClick={() => navigate('assets')}
        />
        <KPICard
          title="Allocated"
          value={allocated}
          icon={ArrowRightLeft}
          iconColor="#714B67"
          iconBg="#F1EBEF"
          subtitle={`${Math.round((allocated / totalAssets) * 100)}% of total`}
          onClick={() => navigate('allocations')}
        />
        <KPICard
          title="Available"
          value={available}
          icon={CheckCircle}
          iconColor="#00A09D"
          iconBg="#E8F8F8"
          subtitle="Ready to allocate"
          onClick={() => navigate('assets')}
        />
        <KPICard
          title="Maintenance"
          value={maintenance}
          icon={Wrench}
          iconColor="#F5A623"
          iconBg="#FEF3E2"
          subtitle="Active requests"
          onClick={() => navigate('maintenance')}
        />
        <KPICard
          title="Pending Bookings"
          value={pending}
          icon={CalendarDays}
          iconColor="#3AB0E6"
          iconBg="#EFF6FF"
          subtitle="Awaiting approval"
          onClick={() => navigate('bookings')}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Allocations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Allocations</h2>
            <button onClick={() => navigate('allocations')} className="text-xs font-medium hover:underline" style={{ color: '#714B67' }}>
              View all
            </button>
          </div>
          {recentAllocations.length === 0 ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No active allocations"
              description="Allocate assets to employees to see them listed here."
              action={{ label: 'Allocate an Asset', onClick: () => navigate('allocations') }}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Asset</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Employee</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Since</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAllocations.map(al => {
                  const asset = getAsset(al.assetId);
                  const emp = getEmployee(al.employeeId);
                  return (
                    <tr key={al.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <button
                          onClick={() => navigate('asset-details', al.assetId)}
                          className="font-medium text-gray-800 hover:underline text-left"
                          style={{ color: '#714B67' }}
                        >
                          {asset?.name ?? '—'}
                        </button>
                        <p className="text-xs text-gray-400">{asset?.assetTag}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: '#714B67' }}>
                            {emp?.name.charAt(0)}
                          </div>
                          <span className="text-gray-700">{emp?.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(al.fromDate), { addSuffix: true })}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={al.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Notifications</h2>
            <button onClick={() => navigate('notifications')} className="text-xs font-medium hover:underline" style={{ color: '#714B67' }}>
              View all
            </button>
          </div>
          {recentNotifs.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" description="System events and alerts will appear here." />
          ) : (
            <div className="divide-y divide-gray-50">
              {recentNotifs.map(n => (
                <div
                  key={n.id}
                  className="px-5 py-3.5 cursor-pointer hover:bg-gray-50/70 transition-colors"
                  style={{ backgroundColor: n.read ? 'transparent' : '#FEFAF9' }}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-1 w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: typeColors[n.type], opacity: n.read ? 0.4 : 1 }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && <span className="ml-auto w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: '#714B67' }} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Maintenance */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Pending Maintenance</h2>
            <button onClick={() => navigate('maintenance')} className="text-xs font-medium hover:underline" style={{ color: '#714B67' }}>
              View all
            </button>
          </div>
          {pendingMaintenance.length === 0 ? (
            <EmptyState icon={Wrench} title="No pending maintenance" description="Maintenance requests will appear here when submitted." />
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingMaintenance.map(m => {
                const asset = getAsset(m.assetId);
                return (
                  <div key={m.id} className="px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{m.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{asset?.name}</p>
                      </div>
                      <StatusBadge status={m.priority} />
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Pending Bookings</h2>
            <button onClick={() => navigate('bookings')} className="text-xs font-medium hover:underline" style={{ color: '#714B67' }}>
              View all
            </button>
          </div>
          {pendingBookings.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No pending bookings" description="Booking requests will appear here for review." />
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingBookings.map(b => {
                const asset = getAsset(b.assetId);
                const emp = getEmployee(b.employeeId);
                return (
                  <div key={b.id} className="px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{asset?.name}</p>
                        <p className="text-xs text-gray-500">{emp?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{b.fromDate} → {b.toDate}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
