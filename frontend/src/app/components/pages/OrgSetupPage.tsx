import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Building2, Users, Tag, MapPin } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useApp } from '../../AppContext';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { PageHeader } from '../shared/PageHeader';
import type { Employee, Department } from '../../types';
import { ConfirmDialog } from '../shared/ConfirmDialog';

function AddEmployeeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { departments, addEmployee } = useApp();
  const [form, setForm] = useState({ name: '', email: '', role: '', departmentId: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => { setForm(p => ({ ...p, [k]: v })); };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email.trim()) errs.email = 'Email required';
    if (!form.role.trim()) errs.role = 'Role required';
    if (!form.departmentId) errs.departmentId = 'Department required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const emp: Employee = { id: `e${Date.now()}`, name: form.name, email: form.email, role: form.role, departmentId: form.departmentId };
    addEmployee(emp);
    toast.success('Employee added successfully');
    onOpenChange(false);
    setForm({ name: '', email: '', role: '', departmentId: '' });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-semibold text-gray-900">Add Employee</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X size={18} /></button></Dialog.Close>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {([['name', 'Full Name', 'text'], ['email', 'Email Address', 'email'], ['role', 'Job Title / Role', 'text']] as [keyof typeof form, string, string][]).map(([field, label, type]) => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-600 block mb-1">{label} <span style={{ color: '#F2726F' }}>*</span></label>
                <input type={type} value={form[field]} onChange={e => set(field, e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }} />
                {errors[field] && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Department <span style={{ color: '#F2726F' }}>*</span></label>
              <select value={form.departmentId} onChange={e => set('departmentId', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: errors.departmentId ? '#F2726F' : '#E5E7EB' }}>
                <option value="">Select department...</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors.departmentId}</p>}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <Dialog.Close asChild><button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button></Dialog.Close>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
              Add Employee
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AddDeptModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addDepartment } = useApp();
  const [form, setForm] = useState({ name: '', manager: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.manager.trim()) errs.manager = 'Manager required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addDepartment({ id: `d${Date.now()}`, name: form.name, manager: form.manager, headCount: 0 });
    toast.success('Department added');
    onOpenChange(false);
    setForm({ name: '', manager: '' });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-semibold text-gray-900">Add Department</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X size={18} /></button></Dialog.Close>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {([['name', 'Department Name'], ['manager', 'Manager Name']] as [keyof typeof form, string][]).map(([field, label]) => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-600 block mb-1">{label} <span style={{ color: '#F2726F' }}>*</span></label>
                <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: errors[field] ? '#F2726F' : '#E5E7EB' }} />
                {errors[field] && <p className="text-xs mt-1" style={{ color: '#F2726F' }}>{errors[field]}</p>}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <Dialog.Close asChild><button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Cancel</button></Dialog.Close>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#714B67' }}>Add Department</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function OrgSetupPage() {
  const { employees, departments, categories, locations, deleteEmployee } = useApp();
  const [tab, setTab] = useState('employees');
  const [search, setSearch] = useState('');
  const [empModal, setEmpModal] = useState(false);
  const [deptModal, setDeptModal] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = useState<string | null>(null);

  const tabs = [
    { value: 'employees', label: 'Employees', icon: <Users size={14} /> },
    { value: 'departments', label: 'Departments', icon: <Building2 size={14} /> },
    { value: 'categories', label: 'Asset Categories', icon: <Tag size={14} /> },
    { value: 'locations', label: 'Locations', icon: <MapPin size={14} /> },
  ];

  const getDept = (id: string) => departments.find(d => d.id === id)?.name ?? '—';

  const filteredEmp = employees.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const TableToolbar = ({ placeholder, onAdd, addLabel }: { placeholder: string; onAdd: () => void; addLabel: string }) => (
    <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-50">
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white" />
      </div>
      <button onClick={onAdd} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: '#714B67' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Organization Setup"
        subtitle="Manage employees, departments, categories, and locations"
        breadcrumbs={[{ label: 'Organization Setup' }]}
      />

      <Tabs.Root value={tab} onValueChange={v => { setTab(v); setSearch(''); }}>
        <Tabs.List className="flex gap-0 border-b border-gray-200 mb-5">
          {tabs.map(t => (
            <Tabs.Trigger key={t.value} value={t.value} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all outline-none whitespace-nowrap"
              style={{ borderColor: tab === t.value ? '#714B67' : 'transparent', color: tab === t.value ? '#714B67' : '#6B7280' }}>
              {t.icon}{t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Employees */}
        <Tabs.Content value="employees">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <TableToolbar placeholder="Search employees..." onAdd={() => setEmpModal(true)} addLabel="Add Employee" />
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Name', 'Email', 'Role', 'Department', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmp.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon={Users} title="No employees found" description="Add employees to manage asset allocations." action={{ label: 'Add Employee', onClick: () => setEmpModal(true) }} /></td></tr>
                ) : filteredEmp.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 font-medium" style={{ backgroundColor: '#714B67' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{emp.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{emp.role}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{getDept(emp.departmentId)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all" style={{ color: '#3AB0E6' }}><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteEmpId(emp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-all" style={{ color: '#F2726F' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* Departments */}
        <Tabs.Content value="departments">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <TableToolbar placeholder="Search departments..." onAdd={() => setDeptModal(true)} addLabel="Add Department" />
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Department', 'Manager', 'Head Count', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {departments.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase())).map(dept => (
                  <tr key={dept.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F1EBEF' }}>
                          <Building2 size={14} style={{ color: '#714B67' }} />
                        </div>
                        <span className="font-medium text-gray-800">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{dept.manager}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-700">{dept.headCount}</span>
                      <span className="text-xs text-gray-400 ml-1">employees</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all" style={{ color: '#3AB0E6' }}><Edit2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* Categories */}
        <Tabs.Content value="categories">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <TableToolbar placeholder="Search categories..." onAdd={() => toast.info('Add category form coming soon')} addLabel="Add Category" />
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Category', 'Description', 'Asset Count', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F1EBEF' }}>
                          <Tag size={14} style={{ color: '#714B67' }} />
                        </div>
                        <span className="font-medium text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{cat.description}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-700">{cat.assetCount}</span>
                      <span className="text-xs text-gray-400 ml-1">assets</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all" style={{ color: '#3AB0E6' }}><Edit2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* Locations */}
        <Tabs.Content value="locations">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <TableToolbar placeholder="Search locations..." onAdd={() => toast.info('Add location form coming soon')} addLabel="Add Location" />
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Location', 'Type', 'Address', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {locations.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase())).map(loc => (
                  <tr key={loc.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F1EBEF' }}>
                          <MapPin size={14} style={{ color: '#714B67' }} />
                        </div>
                        <span className="font-medium text-gray-800">{loc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={loc.type} showDot={false} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{loc.address}</td>
                    <td className="px-4 py-3">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all" style={{ color: '#3AB0E6' }}><Edit2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <AddEmployeeModal open={empModal} onOpenChange={setEmpModal} />
      <AddDeptModal open={deptModal} onOpenChange={setDeptModal} />
      <ConfirmDialog
        open={!!deleteEmpId}
        onOpenChange={v => !v && setDeleteEmpId(null)}
        title="Remove Employee"
        description="Are you sure you want to remove this employee? Their allocation records will be preserved."
        confirmLabel="Remove Employee"
        onConfirm={() => { if (deleteEmpId) { deleteEmployee(deleteEmpId); toast.success('Employee removed'); setDeleteEmpId(null); } }}
      />
    </div>
  );
}
