import { useState } from 'react';
import { Plus, Search, Eye, Edit2, ArrowRightLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { EmptyState } from '../shared/EmptyState';
import { PageHeader } from '../shared/PageHeader';
import type { Asset, AssetStatus } from '../../types';
import { Package, X } from 'lucide-react';

const STATUSES: AssetStatus[] = ['Available', 'Allocated', 'Maintenance', 'Retired'];

function AssetModal({
  open, onOpenChange, existing, onSave
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: Asset;
  onSave: (a: Asset) => void;
}) {
  const { categories, locations, departments } = useApp();
  const [form, setForm] = useState<Partial<Asset>>(existing ?? {
    status: 'Available', condition: 'New',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof Asset, val: string | number) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name?.trim()) errs.name = 'Asset name is required';
    if (!form.assetTag?.trim()) errs.assetTag = 'Asset tag is required';
    if (!form.categoryId) errs.categoryId = 'Category is required';
    if (!form.serialNumber?.trim()) errs.serialNumber = 'Serial number is required';
    if (!form.locationId) errs.locationId = 'Location is required';
    if (!form.departmentId) errs.departmentId = 'Department is required';
    if (!form.purchaseDate) errs.purchaseDate = 'Purchase date is required';
    if (!form.purchaseValue) errs.purchaseValue = 'Purchase value is required';
    if (!form.warrantyExpiry) errs.warrantyExpiry = 'Warranty expiry is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const asset: Asset = {
      id: existing?.id ?? `a${Date.now()}`,
      name: form.name!,
      assetTag: form.assetTag!,
      categoryId: form.categoryId!,
      serialNumber: form.serialNumber!,
      locationId: form.locationId!,
      departmentId: form.departmentId!,
      status: (form.status as AssetStatus) ?? 'Available',
      condition: (form.condition as Asset['condition']) ?? 'New',
      purchaseDate: form.purchaseDate!,
      purchaseValue: Number(form.purchaseValue),
      warrantyExpiry: form.warrantyExpiry!,
      notes: form.notes,
    };
    onSave(asset);
    onOpenChange(false);
    toast.success(existing ? 'Asset updated successfully' : 'Asset added successfully');
  };

  const InputField = ({ label, field, type = 'text', required = true }: { label: string; field: keyof Asset; type?: string; required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}{required && <span style={{ color: '#F2726F' }}> *</span>}</label>
      <input
        type={type}
        value={String(form[field] ?? '')}
        onChange={e => set(field, e.target.value)}
        className="px-3 py-2 rounded-lg border text-sm outline-none transition-all"
        style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }}
      />
      {errors[field] && <p className="text-xs" style={{ color: '#F2726F' }}>{errors[field]}</p>}
    </div>
  );

  const SelectField = ({ label, field, options, required = true }: { label: string; field: keyof Asset; options: { value: string; label: string }[]; required?: boolean }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}{required && <span style={{ color: '#F2726F' }}> *</span>}</label>
      <select
        value={String(form[field] ?? '')}
        onChange={e => set(field, e.target.value)}
        className="px-3 py-2 rounded-lg border text-sm outline-none bg-white transition-all"
        style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[field] && <p className="text-xs" style={{ color: '#F2726F' }}>{errors[field]}</p>}
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
            <Dialog.Title className="font-semibold text-gray-900">
              {existing ? 'Edit Asset' : 'Add New Asset'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </Dialog.Close>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <InputField label="Asset Name" field="name" />
            <InputField label="Asset Tag" field="assetTag" />
            <InputField label="Serial Number" field="serialNumber" />
            <SelectField label="Category" field="categoryId" options={categories.map(c => ({ value: c.id, label: c.name }))} />
            <SelectField label="Location" field="locationId" options={locations.map(l => ({ value: l.id, label: l.name }))} />
            <SelectField label="Department" field="departmentId" options={departments.map(d => ({ value: d.id, label: d.name }))} />
            <SelectField label="Status" field="status" options={STATUSES.map(s => ({ value: s, label: s }))} />
            <SelectField label="Condition" field="condition" options={['New', 'Good', 'Fair', 'Poor'].map(s => ({ value: s, label: s }))} />
            <InputField label="Purchase Date" field="purchaseDate" type="date" />
            <InputField label="Purchase Value ($)" field="purchaseValue" type="number" />
            <InputField label="Warranty Expiry" field="warrantyExpiry" type="date" />
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Notes <span className="text-gray-400">(optional)</span></label>
              <textarea
                value={form.notes ?? ''}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none resize-none"
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
            >
              {existing ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function TipBtn({ label, onClick, icon: Icon, color }: { label: string; onClick: () => void; icon: React.ElementType; color?: string }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={onClick}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
            style={{ color: color ?? '#6B7280' }}
          >
            <Icon size={14} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md z-50" sideOffset={4}>
            {label}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function AssetsPage() {
  const { assets, categories, locations, departments, navigate, addAsset, updateAsset, deleteAsset } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchCat = categoryFilter === 'All' || a.categoryId === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getCat = (id: string) => categories.find(c => c.id === id)?.name ?? '—';
  const getLoc = (id: string) => locations.find(l => l.id === id)?.name ?? '—';
  const getDept = (id: string) => departments.find(d => d.id === id)?.name ?? '—';

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Asset Management"
        subtitle={`${assets.length} total assets across all departments`}
        actions={
          <button
            onClick={() => { setEditAsset(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: '#714B67' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
          >
            <Plus size={15} /> Add Asset
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, tag, serial..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', ...STATUSES] as string[]).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={{
                backgroundColor: statusFilter === s ? '#714B67' : 'white',
                color: statusFilter === s ? '#fff' : '#374151',
                borderColor: statusFilter === s ? '#714B67' : '#E5E7EB',
              }}
            >
              {s}
            </button>
          ))}
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Asset', 'Tag', 'Category', 'Department', 'Location', 'Condition', 'Status', 'Value', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      icon={Package}
                      title="No assets found"
                      description="Try adjusting your search or filters, or add a new asset."
                      action={{ label: 'Add Asset', onClick: () => { setEditAsset(undefined); setModalOpen(true); } }}
                    />
                  </td>
                </tr>
              ) : pageData.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate('asset-details', asset.id)}
                      className="font-medium text-left hover:underline"
                      style={{ color: '#714B67' }}
                    >
                      {asset.name}
                    </button>
                    <p className="text-xs text-gray-400">{asset.serialNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{asset.assetTag}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{getCat(asset.categoryId)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{getDept(asset.departmentId)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{getLoc(asset.locationId)}</td>
                  <td className="px-4 py-3"><StatusBadge status={asset.condition} /></td>
                  <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-700 font-medium">${asset.purchaseValue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <TipBtn label="View Details" onClick={() => navigate('asset-details', asset.id)} icon={Eye} color="#714B67" />
                      <TipBtn label="Edit Asset" onClick={() => { setEditAsset(asset); setModalOpen(true); }} icon={Edit2} color="#3AB0E6" />
                      <TipBtn label="Allocate" onClick={() => navigate('allocations')} icon={ArrowRightLeft} color="#00A09D" />
                      <TipBtn label="Delete Asset" onClick={() => setDeleteId(asset.id)} icon={Trash2} color="#F2726F" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-gray-500 transition-all">
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => setPage(pg)} className="w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-all border"
                  style={{ backgroundColor: page === pg ? '#714B67' : 'transparent', color: page === pg ? '#fff' : '#374151', borderColor: page === pg ? '#714B67' : '#E5E7EB' }}>
                  {pg}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-gray-500 transition-all">
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      <AssetModal
        open={modalOpen}
        onOpenChange={v => { setModalOpen(v); if (!v) setEditAsset(undefined); }}
        existing={editAsset}
        onSave={editAsset ? updateAsset : addAsset}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        title="Delete Asset"
        description="Are you sure you want to permanently delete this asset? This action cannot be undone and all associated records will be removed."
        confirmLabel="Delete Asset"
        onConfirm={() => {
          if (deleteId) { deleteAsset(deleteId); toast.success('Asset deleted'); setDeleteId(null); }
        }}
      />
    </div>
  );
}
