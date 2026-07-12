import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { PageHeader } from '../shared/PageHeader';
import type { Allocation } from '../../types';
import { ArrowRightLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function AllocateModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { assets, employees, allocations, addAllocation } = useApp();
  const [assetId, setAssetId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAssets = assets.filter(a => a.status === 'Available');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!assetId) errs.assetId = 'Select an asset';
    if (!employeeId) errs.employeeId = 'Select an employee';
    if (!fromDate) errs.fromDate = 'Select allocation date';

    if (assetId) {
      const already = allocations.find(a => a.assetId === assetId && a.status === 'Active');
      if (already) errs.assetId = 'This asset is already allocated to someone else';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const alloc: Allocation = {
      id: `al${Date.now()}`,
      assetId, employeeId, fromDate, notes,
      status: 'Active',
      allocatedBy: 'Admin',
    };
    addAllocation(alloc);
    toast.success('Asset allocated successfully');
    onOpenChange(false);
    setAssetId(''); setEmployeeId(''); setNotes('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-semibold text-gray-900">Allocate Asset</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </Dialog.Close>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Asset <span style={{ color: '#F2726F' }}>*</span></label>
              <select
                value={assetId}
                onChange={e => { setAssetId(e.target.value); if (errors.assetId) setErrors(p => { const n = { ...p }; delete n.assetId; return n; }); }}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                style={{ borderColor: errors.assetId ? '#F2726F' : '#E5E7EB' }}
              >
                <option value="">Select an available asset...</option>
                {availableAssets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
                ))}
              </select>
              {errors.assetId && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.assetId}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Employee <span style={{ color: '#F2726F' }}>*</span></label>
              <select
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                style={{ borderColor: errors.employeeId ? '#F2726F' : '#E5E7EB' }}
              >
                <option value="">Select employee...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} — {e.role}</option>
                ))}
              </select>
              {errors.employeeId && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.employeeId}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Allocation Date <span style={{ color: '#F2726F' }}>*</span></label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Notes <span className="text-gray-400">(optional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
                placeholder="Purpose, conditions, etc."
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
            >
              Allocate Asset
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AllocationsPage() {
  const { allocations, assets, employees, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getAsset = (id: string) => assets.find(a => a.id === id);
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const filtered = allocations.filter(al => {
    const asset = getAsset(al.assetId);
    const emp = getEmp(al.employeeId);
    const matchSearch = !search ||
      asset?.name.toLowerCase().includes(search.toLowerCase()) ||
      emp?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || al.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Allocations"
        subtitle={`${allocations.filter(a => a.status === 'Active').length} active allocations`}
        breadcrumbs={[{ label: 'Allocations' }]}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: '#714B67' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
          >
            <Plus size={15} /> Allocate Asset
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search asset or employee..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white" />
        </div>
        {(['All', 'Active', 'Returned', 'Overdue'] as string[]).map(s => (
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
              {['Asset', 'Employee', 'Department', 'Allocated Since', 'Returned', 'Status', 'Allocated By'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <EmptyState icon={ArrowRightLeft} title="No allocations found" description="No allocations match your current filters." action={{ label: 'Allocate an Asset', onClick: () => setModalOpen(true) }} />
              </td></tr>
            ) : filtered.map(al => {
              const asset = getAsset(al.assetId);
              const emp = getEmp(al.employeeId);
              return (
                <tr key={al.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => navigate('asset-details', al.assetId)} className="font-medium hover:underline text-left" style={{ color: '#714B67' }}>
                      {asset?.name ?? '—'}
                    </button>
                    <p className="text-xs text-gray-400">{asset?.assetTag}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#714B67' }}>
                        {emp?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">{emp?.name}</p>
                        <p className="text-xs text-gray-400">{emp?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{emp?.role}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {al.fromDate ? formatDistanceToNow(new Date(al.fromDate), { addSuffix: true }) : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{al.toDate ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={al.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{al.allocatedBy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AllocateModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
