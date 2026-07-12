import { BarChart3, TrendingUp, Package, ArrowRightLeft, Wrench, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../../AppContext';
import { PageHeader } from '../shared/PageHeader';

export function ReportsPage() {
  const { assets, allocations, maintenanceRequests, categories, departments } = useApp();

  const totalValue = assets.reduce((s, a) => s + a.purchaseValue, 0);
  const allocRate = assets.length ? Math.round((assets.filter(a => a.status === 'Allocated').length / assets.length) * 100) : 0;

  // Assets by category
  const byCat = categories.map(cat => ({
    name: cat.name.length > 10 ? cat.name.slice(0, 10) + '…' : cat.name,
    count: assets.filter(a => a.categoryId === cat.id).length,
  })).filter(x => x.count > 0);

  // Assets by status (pie)
  const byStatus = [
    { name: 'Available', value: assets.filter(a => a.status === 'Available').length, color: '#00A09D' },
    { name: 'Allocated', value: assets.filter(a => a.status === 'Allocated').length, color: '#714B67' },
    { name: 'Maintenance', value: assets.filter(a => a.status === 'Maintenance').length, color: '#F5A623' },
    { name: 'Retired', value: assets.filter(a => a.status === 'Retired').length, color: '#9CA3AF' },
  ].filter(x => x.value > 0);

  // Value by department
  const byDept = departments.map(dept => ({
    name: dept.name.length > 8 ? dept.name.slice(0, 8) + '…' : dept.name,
    value: assets.filter(a => a.departmentId === dept.id).reduce((s, a) => s + a.purchaseValue, 0),
  })).filter(x => x.value > 0);

  // Maintenance by priority
  const byPriority = [
    { name: 'Critical', value: maintenanceRequests.filter(m => m.priority === 'Critical').length, color: '#F2726F' },
    { name: 'High', value: maintenanceRequests.filter(m => m.priority === 'High').length, color: '#F5A623' },
    { name: 'Medium', value: maintenanceRequests.filter(m => m.priority === 'Medium').length, color: '#3AB0E6' },
    { name: 'Low', value: maintenanceRequests.filter(m => m.priority === 'Low').length, color: '#00A09D' },
  ].filter(x => x.value > 0);

  const kpis = [
    { label: 'Total Asset Value', value: `$${(totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: '#714B67', bg: '#F1EBEF' },
    { label: 'Allocation Rate', value: `${allocRate}%`, icon: TrendingUp, color: '#00A09D', bg: '#E8F8F8' },
    { label: 'Active Allocations', value: allocations.filter(a => a.status === 'Active').length, icon: ArrowRightLeft, color: '#3AB0E6', bg: '#EFF6FF' },
    { label: 'Maintenance Costs', value: `$${maintenanceRequests.reduce((s, m) => s + (m.cost ?? 0), 0).toLocaleString()}`, icon: Wrench, color: '#F5A623', bg: '#FEF3E2' },
  ];

  return (
    <div className="p-6 max-w-screen-xl">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Portfolio overview and performance metrics"
        breadcrumbs={[{ label: 'Reports' }]}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
              <kpi.icon size={18} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Assets by Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCat} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
              <Bar dataKey="count" fill="#714B67" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Asset Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {byStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => <span style={{ fontSize: 11, color: '#6B7280' }}>{value}</span>}
              />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Value by Department */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Asset Value by Department ($)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDept} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']} />
              <Bar dataKey="value" fill="#00A09D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance by Priority */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Maintenance by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byPriority} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {byPriority.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend formatter={(value) => <span style={{ fontSize: 11, color: '#6B7280' }}>{value}</span>} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset summary table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">Asset Portfolio Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Category', 'Total', 'Available', 'Allocated', 'Maintenance', 'Retired', 'Total Value'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => {
              const catAssets = assets.filter(a => a.categoryId === cat.id);
              if (!catAssets.length) return null;
              return (
                <tr key={cat.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-700 font-semibold">{catAssets.length}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#00A09D' }}>{catAssets.filter(a => a.status === 'Available').length}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#714B67' }}>{catAssets.filter(a => a.status === 'Allocated').length}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#F5A623' }}>{catAssets.filter(a => a.status === 'Maintenance').length}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{catAssets.filter(a => a.status === 'Retired').length}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700">${catAssets.reduce((s, a) => s + a.purchaseValue, 0).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
