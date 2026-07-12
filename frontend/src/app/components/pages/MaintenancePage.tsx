import { useState } from 'react';
import { Plus, Search, X, Wrench } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { PageHeader } from '../shared/PageHeader';
import type { MaintenanceRequest, MaintenancePriority } from '../../types';

function MaintenanceModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { assets, addMaintenance } = useApp();
  const [form, setForm] = useState({ assetId: '', title: '', description: '', priority: 'Medium' as MaintenancePriority });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.assetId) errs.assetId = 'Select an asset';
    if (!form.title.trim()) errs.title = 'Issue title required';
    if (!form.description.trim()) errs.description = 'Description required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const req: MaintenanceRequest = {
      id: `m${Date.now()}`,
      assetId: form.assetId,
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: 'Pending',
      reportedBy: 'Admin',
      reportedDate: new Date().toISOString().split('T')[0],
    };
    addMaintenance(req);
    toast.success('Maintenance request submitted');
    onOpenChange(false);
    setForm({ assetId: '', title: '', description: '', priority: 'Medium' });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-semibold text-gray-900">New Maintenance Request</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X size={18} /></button></Dialog.Close>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Asset <span style={{ color: '#F2726F' }}>*</span></label>
              <select value={form.assetId} onChange={e => set('assetId', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: errors.assetId ? '#F2726F' : '#E5E7EB' }}>
                <option value="">Select asset...</option>
                {assets.filter(a => a.status !== 'Retired').map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>)}
              </select>
              {errors.assetId && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.assetId}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Issue Title <span style={{ color: '#F2726F' }}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Screen flickering" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: errors.title ? '#F2726F' : '#E5E7EB' }} />
              {errors.title && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.title}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Priority <span style={{ color: '#F2726F' }}>*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {(['Critical', 'High', 'Medium', 'Low'] as MaintenancePriority[]).map(p => (
                  <button key={p} type="button" onClick={() => set('priority', p)} className="py-2 rounded-lg text-xs font-medium border transition-all"
                    style={{ backgroundColor: form.priority === p ? '#714B67' : 'white', color: form.priority === p ? '#fff' : '#374151', borderColor: form.priority === p ? '#714B67' : '#E5E7EB' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Description <span style={{ color: '#F2726F' }}>*</span></label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the issue in detail..." className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: errors.description ? '#F2726F' : '#E5E7EB' }} />
              {errors.description && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.description}</p>}
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

export function MaintenancePage() {
  const { maintenanceRequests, assets, updateMaintenance, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const getAsset = (id: string) => assets.find(a => a.id === id);

  const filtered = maintenanceRequests.filter(m => {
    const asset = getAsset(m.assetId);
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || asset?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || m.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const markInProgress = (m: MaintenanceRequest) => {
    updateMaintenance({ ...m, status: 'In Progress', assignedTech: 'Carlos Rivera' });
    toast.success('Request marked as In Progress');
  };

  const markCompleted = (m: MaintenanceRequest) => {
    updateMaintenance({ ...m, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] });
    toast.success('Maintenance marked as Completed');
  };

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Maintenance"
        subtitle={`${maintenanceRequests.filter(m => m.status === 'Pending' || m.status === 'In Progress').length} active requests`}
        breadcrumbs={[{ label: 'Maintenance' }]}
        actions={
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
            <Plus size={15} /> New Request
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'] as string[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{ backgroundColor: statusFilter === s ? '#714B67' : 'white', color: statusFilter === s ? '#fff' : '#374151', borderColor: statusFilter === s ? '#714B67' : '#E5E7EB' }}>
              {s}
            </button>
          ))}
          <span className="text-gray-300">|</span>
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as string[]).map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{ backgroundColor: priorityFilter === p ? '#F5A623' : 'white', color: priorityFilter === p ? '#fff' : '#374151', borderColor: priorityFilter === p ? '#F5A623' : '#E5E7EB' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Issue', 'Asset', 'Priority', 'Status', 'Reported By', 'Tech', 'Date', 'Cost', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>
                <EmptyState icon={Wrench} title="No maintenance requests" description="No requests match your current filters." action={{ label: 'New Request', onClick: () => setModalOpen(true) }} />
              </td></tr>
            ) : filtered.map(m => {
              const asset = getAsset(m.assetId);
              return (
                <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 max-w-48">
                    <p className="font-medium text-gray-800 truncate">{m.title}</p>
                    <p className="text-xs text-gray-400 truncate">{m.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigate('asset-details', m.assetId)} className="text-xs font-medium hover:underline" style={{ color: '#714B67' }}>
                      {asset?.name}
                    </button>
                    <p className="text-xs text-gray-400">{asset?.assetTag}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{m.reportedBy}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.assignedTech ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.reportedDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{m.cost != null ? `$${m.cost}` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {m.status === 'Pending' && (
                        <button onClick={() => markInProgress(m)} className="px-2 py-1 rounded text-xs font-medium text-white transition-all" style={{ backgroundColor: '#3AB0E6' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2990C4')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3AB0E6')}>
                          Start
                        </button>
                      )}
                      {m.status === 'In Progress' && (
                        <button onClick={() => markCompleted(m)} className="px-2 py-1 rounded text-xs font-medium text-white transition-all" style={{ backgroundColor: '#00A09D' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#007A78')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00A09D')}>
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <MaintenanceModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
