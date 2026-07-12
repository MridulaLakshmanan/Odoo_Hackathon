import { useState } from 'react';
import { Edit2, ArrowLeft, CalendarDays, Wrench, ArrowRightLeft, Activity } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-700">{value || '—'}</span>
    </div>
  );
}

export function AssetDetailsPage() {
  const { assets, selectedAssetId, employees, categories, locations, departments, allocations, bookings, maintenanceRequests, navigate } = useApp();
  const [tab, setTab] = useState('overview');

  const asset = assets.find(a => a.id === selectedAssetId);
  if (!asset) return (
    <div className="p-6 text-center">
      <p className="text-gray-500">Asset not found.</p>
      <button onClick={() => navigate('assets')} className="mt-2 text-sm" style={{ color: '#714B67' }}>Back to Assets</button>
    </div>
  );

  const category = categories.find(c => c.id === asset.categoryId);
  const location = locations.find(l => l.id === asset.locationId);
  const department = departments.find(d => d.id === asset.departmentId);
  const assignedTo = asset.assignedToId ? employees.find(e => e.id === asset.assignedToId) : null;
  const assetAllocs = allocations.filter(a => a.assetId === asset.id);
  const assetBookings = bookings.filter(b => b.assetId === asset.id);
  const assetMaint = maintenanceRequests.filter(m => m.assetId === asset.id);

  const getEmp = (id: string) => employees.find(e => e.id === id)?.name ?? id;

  const tabs = [
    { value: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { value: 'allocations', label: 'Allocation History', icon: <ArrowRightLeft size={14} /> },
    { value: 'bookings', label: 'Booking History', icon: <CalendarDays size={14} /> },
    { value: 'maintenance', label: 'Maintenance', icon: <Wrench size={14} /> },
  ];

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Breadcrumb + Back */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <button onClick={() => navigate('dashboard')} className="hover:text-gray-600">Dashboard</button>
        <span>›</span>
        <button onClick={() => navigate('assets')} className="hover:text-gray-600" style={{ color: '#714B67' }}>Assets</button>
        <span>›</span>
        <span className="text-gray-600 font-medium">{asset.name}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1EBEF' }}>
              <span className="text-xl">📦</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">{asset.name}</h1>
                <StatusBadge status={asset.status} size="md" />
              </div>
              <p className="text-sm text-gray-500">{asset.assetTag} · {category?.name} · {department?.name}</p>
              {assignedTo && (
                <p className="text-xs text-gray-400 mt-1">Assigned to <span className="font-medium text-gray-600">{assignedTo.name}</span></p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('assets')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
            >
              <Edit2 size={14} /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List className="flex gap-0 border-b border-gray-200 mb-5 bg-transparent">
          {tabs.map(t => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all outline-none whitespace-nowrap"
              style={{
                borderColor: tab === t.value ? '#714B67' : 'transparent',
                color: tab === t.value ? '#714B67' : '#6B7280',
              }}
            >
              {t.icon}
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Overview */}
        <Tabs.Content value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Asset Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Asset Name" value={asset.name} />
                <Field label="Asset Tag" value={asset.assetTag} />
                <Field label="Serial Number" value={asset.serialNumber} />
                <Field label="Category" value={category?.name ?? '—'} />
                <Field label="Status" value={asset.status} />
                <Field label="Condition" value={asset.condition} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Financial & Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Purchase Date" value={asset.purchaseDate} />
                <Field label="Purchase Value" value={`$${asset.purchaseValue.toLocaleString()}`} />
                <Field label="Warranty Expiry" value={asset.warrantyExpiry} />
                <Field label="Department" value={department?.name ?? '—'} />
                <Field label="Location" value={location?.name ?? '—'} />
                <Field label="Assigned To" value={assignedTo?.name ?? 'Unassigned'} />
              </div>
            </div>
            {asset.notes && (
              <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{asset.notes}</p>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* Allocation History */}
        <Tabs.Content value="allocations">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {assetAllocs.length === 0 ? (
              <EmptyState icon={ArrowRightLeft} title="No allocation history" description="This asset has never been allocated to an employee." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Employee', 'From', 'To', 'Status', 'Notes', 'Allocated By'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assetAllocs.map(al => (
                    <tr key={al.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3 text-gray-700 font-medium">{getEmp(al.employeeId)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{al.fromDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{al.toDate ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={al.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{al.notes ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{al.allocatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Tabs.Content>

        {/* Booking History */}
        <Tabs.Content value="bookings">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {assetBookings.length === 0 ? (
              <EmptyState icon={CalendarDays} title="No booking history" description="This asset has no booking records." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Requested By', 'From', 'To', 'Purpose', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assetBookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3 text-gray-700 font-medium">{getEmp(b.employeeId)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{b.fromDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{b.toDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{b.purpose}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Tabs.Content>

        {/* Maintenance */}
        <Tabs.Content value="maintenance">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {assetMaint.length === 0 ? (
              <EmptyState icon={Wrench} title="No maintenance history" description="No maintenance requests have been filed for this asset." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Issue', 'Priority', 'Status', 'Reported By', 'Reported Date', 'Tech', 'Cost'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assetMaint.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{m.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={m.priority} /></td>
                      <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{m.reportedBy}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.reportedDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.assignedTech ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{m.cost != null ? `$${m.cost}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
