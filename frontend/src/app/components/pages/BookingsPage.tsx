import { useState } from 'react';
import { Plus, Search, Check, X as XIcon, CalendarDays } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { PageHeader } from '../shared/PageHeader';
import type { Booking } from '../../types';

function BookingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { assets, employees, bookings, addBooking } = useApp();
  const [form, setForm] = useState({ assetId: '', employeeId: '', fromDate: '', toDate: '', purpose: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAssets = assets.filter(a => a.status !== 'Retired' && a.status !== 'Maintenance');

  const set = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.assetId) errs.assetId = 'Select an asset';
    if (!form.employeeId) errs.employeeId = 'Select an employee';
    if (!form.fromDate) errs.fromDate = 'From date required';
    if (!form.toDate) errs.toDate = 'To date required';
    if (!form.purpose.trim()) errs.purpose = 'Purpose is required';
    if (form.fromDate && form.toDate && form.toDate <= form.fromDate) errs.toDate = 'To date must be after from date';

    if (form.assetId && form.fromDate && form.toDate) {
      const conflict = bookings.find(b =>
        b.assetId === form.assetId &&
        b.status === 'Approved' &&
        b.fromDate < form.toDate &&
        b.toDate > form.fromDate
      );
      if (conflict) errs.assetId = `Booking conflict: this asset is already booked ${conflict.fromDate} to ${conflict.toDate}`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const booking: Booking = {
      id: `b${Date.now()}`,
      assetId: form.assetId,
      employeeId: form.employeeId,
      fromDate: form.fromDate,
      toDate: form.toDate,
      status: 'Pending',
      purpose: form.purpose,
    };
    addBooking(booking);
    toast.success('Booking created and pending approval');
    onOpenChange(false);
    setForm({ assetId: '', employeeId: '', fromDate: '', toDate: '', purpose: '' });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-semibold text-gray-900">New Booking Request</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><XIcon size={18} /></button></Dialog.Close>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {(['assetId', 'employeeId'] as const).map(field => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  {field === 'assetId' ? 'Asset' : 'Requested By'} <span style={{ color: '#F2726F' }}>*</span>
                </label>
                <select
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }}
                >
                  <option value="">Select...</option>
                  {field === 'assetId'
                    ? availableAssets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>)
                    : employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)
                  }
                </select>
                {errors[field] && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors[field]}</p>}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {(['fromDate', 'toDate'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    {field === 'fromDate' ? 'From Date' : 'To Date'} <span style={{ color: '#F2726F' }}>*</span>
                  </label>
                  <input type="date" value={form[field]} onChange={e => set(field, e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }} />
                  {errors[field] && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Purpose <span style={{ color: '#F2726F' }}>*</span></label>
              <textarea
                value={form.purpose}
                onChange={e => set('purpose', e.target.value)}
                rows={2}
                placeholder="Describe why you need this asset..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
                style={{ borderColor: errors.purpose ? '#F2726F' : '#E5E7EB' }}
              />
              {errors.purpose && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.purpose}</p>}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
            </Dialog.Close>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
              Submit Request
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function BookingsPage() {
  const { bookings, assets, employees, updateBooking, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getAsset = (id: string) => assets.find(a => a.id === id);
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const filtered = bookings.filter(b => {
    const asset = getAsset(b.assetId);
    const emp = getEmp(b.employeeId);
    const matchSearch = !search ||
      asset?.name.toLowerCase().includes(search.toLowerCase()) ||
      emp?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (b: Booking) => {
    updateBooking({ ...b, status: 'Approved', approvedBy: 'Admin' });
    toast.success(`Booking for ${getAsset(b.assetId)?.name} approved`);
  };

  const handleCancel = (b: Booking) => {
    updateBooking({ ...b, status: 'Cancelled' });
    toast.error(`Booking cancelled`);
  };

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Bookings"
        subtitle={`${bookings.filter(b => b.status === 'Pending').length} pending approvals`}
        breadcrumbs={[{ label: 'Bookings' }]}
        actions={
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
            <Plus size={15} /> New Booking
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white" />
        </div>
        {(['All', 'Pending', 'Approved', 'Completed', 'Cancelled'] as string[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{ backgroundColor: statusFilter === s ? '#714B67' : 'white', color: statusFilter === s ? '#fff' : '#374151', borderColor: statusFilter === s ? '#714B67' : '#E5E7EB' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Asset', 'Requested By', 'From', 'To', 'Purpose', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <EmptyState icon={CalendarDays} title="No bookings found" description="Create a booking request to reserve an asset." action={{ label: 'New Booking', onClick: () => setModalOpen(true) }} />
              </td></tr>
            ) : filtered.map(b => {
              const asset = getAsset(b.assetId);
              const emp = getEmp(b.employeeId);
              return (
                <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => navigate('asset-details', b.assetId)} className="font-medium hover:underline" style={{ color: '#714B67' }}>
                      {asset?.name}
                    </button>
                    <p className="text-xs text-gray-400">{asset?.assetTag}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#714B67' }}>
                        {emp?.name.charAt(0)}
                      </div>
                      <span className="text-gray-700">{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{b.fromDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{b.toDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-40 truncate">{b.purpose}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    {b.status === 'Pending' && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleApprove(b)} title="Approve" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 transition-all" style={{ color: '#00A09D' }}>
                          <Check size={14} />
                        </button>
                        <button onClick={() => handleCancel(b)} title="Cancel" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all" style={{ color: '#F2726F' }}>
                          <XIcon size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <BookingModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
